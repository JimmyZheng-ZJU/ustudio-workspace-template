import { EventDispatcher, Vector3, type Curve } from 'three/webgpu';
import type { Viewer } from 'u-space';
export type CurveMovementEventMap = {
    update: {
        progress: number;
    };
    complete: {};
};
declare class CurveMovement extends EventDispatcher<CurveMovementEventMap> {
    viewer: Viewer;
    /** 路径曲线 */
    path: Curve<Vector3> | null;
    /** 当前进度 (0-1) */
    progress: number;
    /** 移动速度 (每秒进度) */
    speed: number;
    /** 循环模式 */
    loop: 'once' | 'repeat' | 'pingpong';
    /** 是否往返移动 */
    pingPong: boolean;
    /** 位置偏移 */
    positionOffset: Vector3;
    /** 是否自动朝向路径前方 */
    autoLookAt: boolean;
    /** Y轴朝向角度偏移 (弧度) */
    lookAtOffset: number;
    /** 当前方向 (1: 正向, -1: 反向) */
    direction: 1 | -1;
    /** 是否正在播放 */
    protected _isPlaying: boolean;
    /** 临时向量用于计算 */
    protected _tempPosition: Vector3;
    protected _tempTangent: Vector3;
    protected _tempLookAt: Vector3;
    constructor(viewer: Viewer);
    /**
     * 从点数组创建 CatmullRom 曲线路径
     */
    setFromPoints(points: Vector3[], closed?: boolean): this;
    /**
     * 设置路径曲线
     */
    setPath(path: Curve<Vector3>): this;
    /**
     * 设置当前进度并更新位置
     */
    setProgress(progress: number): this;
    /**
     * 获取是否正在播放
     */
    get isPlaying(): boolean;
    /**
     * 开始移动动画
     */
    play(): this;
    resume(): this;
    /**
     * 暂停移动动画
     */
    pause(): this;
    /**
     * 停止并重置进度
     */
    stop(): this;
    /**
     * 反转移动方向
     */
    reverse(): this;
    /**
     * 更新动画帧
     */
    private _update;
    /**
     * 销毁插件
     */
    dispose(): void;
}
export { CurveMovement };
