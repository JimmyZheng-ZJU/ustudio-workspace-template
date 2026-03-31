import { EventDispatcher as r, Vector3 as e, CatmullRomCurve3 as h } from "three/webgpu";
class i extends r {
  viewer;
  /** 路径曲线 */
  path = null;
  /** 当前进度 (0-1) */
  progress = 0;
  /** 移动速度 (每秒进度) */
  speed = 0.1;
  /** 循环模式 */
  loop = "once";
  /** 是否往返移动 */
  pingPong = !1;
  /** 位置偏移 */
  positionOffset = new e();
  /** 是否自动朝向路径前方 */
  autoLookAt = !0;
  /** Y轴朝向角度偏移 (弧度) */
  lookAtOffset = 0;
  /** 当前方向 (1: 正向, -1: 反向) */
  direction = 1;
  /** 是否正在播放 */
  _isPlaying = !1;
  /** 临时向量用于计算 */
  _tempPosition = new e();
  _tempTangent = new e();
  _tempLookAt = new e();
  constructor(t) {
    super(), this.viewer = t;
  }
  /**
   * 从点数组创建 CatmullRom 曲线路径
   */
  setFromPoints(t, o = !1) {
    return this.setPath(new h(t, o, "catmullrom", 0));
  }
  /**
   * 设置路径曲线
   */
  setPath(t) {
    return this.path = t, this;
  }
  /**
   * 设置当前进度并更新位置
   */
  setProgress(t) {
    return this.progress = Math.max(0, Math.min(1, t)), this;
  }
  /**
   * 获取是否正在播放
   */
  get isPlaying() {
    return this._isPlaying;
  }
  /**
   * 开始移动动画
   */
  play() {
    return this.resume(), this.progress = 0, this.direction = 1, this;
  }
  resume() {
    return this._isPlaying = !0, this.viewer.addEventListener("beforeControlsUpdate", this._update), this;
  }
  /**
   * 暂停移动动画
   */
  pause() {
    return this._isPlaying = !1, this.viewer.removeEventListener("beforeControlsUpdate", this._update), this;
  }
  /**
   * 停止并重置进度
   */
  stop() {
    return this.pause(), this.progress = 0, this.direction = 1, this;
  }
  /**
   * 反转移动方向
   */
  reverse() {
    return this.direction *= -1, this;
  }
  /**
   * 更新动画帧
   */
  _update = () => {
    if (!this._isPlaying || !this.path) return;
    const t = this.viewer.timer.getDelta();
    if (this.progress += this.speed * t * this.direction, this.progress >= 1)
      switch (this.loop) {
        case "once":
          this.progress = 1, this.pause(), this.dispatchEvent({ type: "complete" });
          break;
        case "repeat":
          this.progress = 0;
          break;
        case "pingpong":
          this.progress = 1, this.direction = -1;
          break;
      }
    else if (this.progress <= 0)
      switch (this.loop) {
        case "once":
          this.progress = 0, this.pause(), this.dispatchEvent({ type: "complete" });
          break;
        case "repeat":
          this.progress = 1;
          break;
        case "pingpong":
          this.progress = 0, this.direction = 1;
          break;
      }
    this.path.getPointAt(this.progress, this._tempPosition), this._tempPosition.add(this.positionOffset), this.autoLookAt && (this.path.getTangentAt(this.progress, this._tempTangent), this._tempLookAt.copy(this._tempPosition).add(this._tempTangent)), this.dispatchEvent({ type: "update", progress: this.progress }), this.viewer.render();
  };
  /**
   * 销毁插件
   */
  dispose() {
    this.stop(), this.path = null;
  }
}
class a extends i {
  constructor(t) {
    super(t), this.addEventListener("update", this._updateCamera);
  }
  _updateCamera = () => {
    this.viewer.controls.setPosition(this._tempPosition.x, this._tempPosition.y, this._tempPosition.z), this.autoLookAt && (this.viewer.controls.setTarget(this._tempLookAt.x, this._tempLookAt.y, this._tempLookAt.z), this.lookAtOffset !== 0 && this.viewer.controls.rotate(this.lookAtOffset, 0));
  };
  dispose() {
    super.dispose(), this.removeEventListener("update", this._updateCamera);
  }
}
class n extends i {
  /** 移动目标对象 */
  target = null;
  constructor(t) {
    super(t), this.addEventListener("update", this._updateObject);
  }
  /**
   * 更新动画帧
   */
  _updateObject() {
    this.target && (this.target.position.copy(this._tempPosition), this.autoLookAt && (this.target.lookAt(this._tempLookAt), this.lookAtOffset !== 0 && this.target.rotateY(this.lookAtOffset)));
  }
  dispose() {
    super.dispose(), this.removeEventListener("update", this._updateObject), this.target = null;
  }
}
export {
  i as CurveMovement,
  a as CurveMovementCamera,
  n as CurveMovementObject
};
