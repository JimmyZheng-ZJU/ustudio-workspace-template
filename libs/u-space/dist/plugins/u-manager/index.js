import { FileLoader, Scene, OrthographicCamera, Mesh, PlaneGeometry, MeshBasicNodeMaterial, Matrix4, Loader, LoadingManager, Group, EventDispatcher, Vector3, Euler } from "three/webgpu";
import { TextureLoaderManager, Model, ShapeMesh, CircleMesh, ExtrudeMesh, tweenAnimation, Topology, MaterialEffects as MaterialEffects$1 } from "u-space";
import { pass } from "three/tsl";
import { MaterialEffects } from "../../index.js";
class BaseFileLoader extends FileLoader {
  constructor(a) {
    super(), this.manager = a.manager, this.setPath(a.path), this.setResponseType("json"), this.setRequestHeader(a.requestHeader), this.setWithCredentials(a.withCredentials);
  }
  async loadAsync(a) {
    return super.loadAsync(a);
  }
}
const META_DATA_FILE_PATH = "/SceneMetadata.json", dbBase = "/db", TOPOLOGY_DATA_FILE_PATH = `${dbBase}/topology_paths.json`, ANIMATIONS_DATA_FILE_PATH = `${dbBase}/animations.json`, VISIONS_DATA_FILE_PATH = `${dbBase}/model_visions.json`, PROPERTIES_DATA_FILE_PATH = `${dbBase}/properties.json`;
var commonjsGlobal = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function getDefaultExportFromCjs$1(c) {
  return c && c.__esModule && Object.prototype.hasOwnProperty.call(c, "default") ? c.default : c;
}
var buffer$1 = {}, base64Js = {};
base64Js.byteLength = byteLength;
base64Js.toByteArray = toByteArray;
base64Js.fromByteArray = fromByteArray;
var lookup = [], revLookup = [], Arr = typeof Uint8Array < "u" ? Uint8Array : Array, code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (var i = 0, len = code.length; i < len; ++i)
  lookup[i] = code[i], revLookup[code.charCodeAt(i)] = i;
revLookup[45] = 62;
revLookup[95] = 63;
function getLens(c) {
  var a = c.length;
  if (a % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var h = c.indexOf("=");
  h === -1 && (h = a);
  var f = h === a ? 0 : 4 - h % 4;
  return [h, f];
}
function byteLength(c) {
  var a = getLens(c), h = a[0], f = a[1];
  return (h + f) * 3 / 4 - f;
}
function _byteLength(c, a, h) {
  return (a + h) * 3 / 4 - h;
}
function toByteArray(c) {
  var a, h = getLens(c), f = h[0], p = h[1], r = new Arr(_byteLength(c, f, p)), u = 0, o = p > 0 ? f - 4 : f, t;
  for (t = 0; t < o; t += 4)
    a = revLookup[c.charCodeAt(t)] << 18 | revLookup[c.charCodeAt(t + 1)] << 12 | revLookup[c.charCodeAt(t + 2)] << 6 | revLookup[c.charCodeAt(t + 3)], r[u++] = a >> 16 & 255, r[u++] = a >> 8 & 255, r[u++] = a & 255;
  return p === 2 && (a = revLookup[c.charCodeAt(t)] << 2 | revLookup[c.charCodeAt(t + 1)] >> 4, r[u++] = a & 255), p === 1 && (a = revLookup[c.charCodeAt(t)] << 10 | revLookup[c.charCodeAt(t + 1)] << 4 | revLookup[c.charCodeAt(t + 2)] >> 2, r[u++] = a >> 8 & 255, r[u++] = a & 255), r;
}
function tripletToBase64(c) {
  return lookup[c >> 18 & 63] + lookup[c >> 12 & 63] + lookup[c >> 6 & 63] + lookup[c & 63];
}
function encodeChunk(c, a, h) {
  for (var f, p = [], r = a; r < h; r += 3)
    f = (c[r] << 16 & 16711680) + (c[r + 1] << 8 & 65280) + (c[r + 2] & 255), p.push(tripletToBase64(f));
  return p.join("");
}
function fromByteArray(c) {
  for (var a, h = c.length, f = h % 3, p = [], r = 16383, u = 0, o = h - f; u < o; u += r)
    p.push(encodeChunk(c, u, u + r > o ? o : u + r));
  return f === 1 ? (a = c[h - 1], p.push(
    lookup[a >> 2] + lookup[a << 4 & 63] + "=="
  )) : f === 2 && (a = (c[h - 2] << 8) + c[h - 1], p.push(
    lookup[a >> 10] + lookup[a >> 4 & 63] + lookup[a << 2 & 63] + "="
  )), p.join("");
}
var ieee754 = {};
ieee754.read = function(c, a, h, f, p) {
  var r, u, o = p * 8 - f - 1, t = (1 << o) - 1, n = t >> 1, e = -7, s = h ? p - 1 : 0, d = h ? -1 : 1, v = c[a + s];
  for (s += d, r = v & (1 << -e) - 1, v >>= -e, e += o; e > 0; r = r * 256 + c[a + s], s += d, e -= 8)
    ;
  for (u = r & (1 << -e) - 1, r >>= -e, e += f; e > 0; u = u * 256 + c[a + s], s += d, e -= 8)
    ;
  if (r === 0)
    r = 1 - n;
  else {
    if (r === t)
      return u ? NaN : (v ? -1 : 1) * (1 / 0);
    u = u + Math.pow(2, f), r = r - n;
  }
  return (v ? -1 : 1) * u * Math.pow(2, r - f);
};
ieee754.write = function(c, a, h, f, p, r) {
  var u, o, t, n = r * 8 - p - 1, e = (1 << n) - 1, s = e >> 1, d = p === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, v = f ? 0 : r - 1, y = f ? 1 : -1, m = a < 0 || a === 0 && 1 / a < 0 ? 1 : 0;
  for (a = Math.abs(a), isNaN(a) || a === 1 / 0 ? (o = isNaN(a) ? 1 : 0, u = e) : (u = Math.floor(Math.log(a) / Math.LN2), a * (t = Math.pow(2, -u)) < 1 && (u--, t *= 2), u + s >= 1 ? a += d / t : a += d * Math.pow(2, 1 - s), a * t >= 2 && (u++, t /= 2), u + s >= e ? (o = 0, u = e) : u + s >= 1 ? (o = (a * t - 1) * Math.pow(2, p), u = u + s) : (o = a * Math.pow(2, s - 1) * Math.pow(2, p), u = 0)); p >= 8; c[h + v] = o & 255, v += y, o /= 256, p -= 8)
    ;
  for (u = u << p | o, n += p; n > 0; c[h + v] = u & 255, v += y, u /= 256, n -= 8)
    ;
  c[h + v - y] |= m * 128;
};
(function(c) {
  const a = base64Js, h = ieee754, f = typeof Symbol == "function" && typeof Symbol.for == "function" ? /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom") : null;
  c.Buffer = e, c.SlowBuffer = $, c.INSPECT_MAX_BYTES = 50;
  const p = 2147483647;
  c.kMaxLength = p;
  const { Uint8Array: r, ArrayBuffer: u, SharedArrayBuffer: o } = globalThis;
  e.TYPED_ARRAY_SUPPORT = t(), !e.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function t() {
    try {
      const j = new r(1), I = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(I, r.prototype), Object.setPrototypeOf(j, I), j.foo() === 42;
    } catch {
      return !1;
    }
  }
  Object.defineProperty(e.prototype, "parent", {
    enumerable: !0,
    get: function() {
      if (e.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(e.prototype, "offset", {
    enumerable: !0,
    get: function() {
      if (e.isBuffer(this))
        return this.byteOffset;
    }
  });
  function n(j) {
    if (j > p)
      throw new RangeError('The value "' + j + '" is invalid for option "size"');
    const I = new r(j);
    return Object.setPrototypeOf(I, e.prototype), I;
  }
  function e(j, I, C) {
    if (typeof j == "number") {
      if (typeof I == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return y(j);
    }
    return s(j, I, C);
  }
  e.poolSize = 8192;
  function s(j, I, C) {
    if (typeof j == "string")
      return m(j, I);
    if (u.isView(j))
      return E(j);
    if (j == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof j
      );
    if (ce(j, u) || j && ce(j.buffer, u) || typeof o < "u" && (ce(j, o) || j && ce(j.buffer, o)))
      return S(j, I, C);
    if (typeof j == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const X = j.valueOf && j.valueOf();
    if (X != null && X !== j)
      return e.from(X, I, C);
    const se = O(j);
    if (se) return se;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof j[Symbol.toPrimitive] == "function")
      return e.from(j[Symbol.toPrimitive]("string"), I, C);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof j
    );
  }
  e.from = function(j, I, C) {
    return s(j, I, C);
  }, Object.setPrototypeOf(e.prototype, r.prototype), Object.setPrototypeOf(e, r);
  function d(j) {
    if (typeof j != "number")
      throw new TypeError('"size" argument must be of type number');
    if (j < 0)
      throw new RangeError('The value "' + j + '" is invalid for option "size"');
  }
  function v(j, I, C) {
    return d(j), j <= 0 ? n(j) : I !== void 0 ? typeof C == "string" ? n(j).fill(I, C) : n(j).fill(I) : n(j);
  }
  e.alloc = function(j, I, C) {
    return v(j, I, C);
  };
  function y(j) {
    return d(j), n(j < 0 ? 0 : D(j) | 0);
  }
  e.allocUnsafe = function(j) {
    return y(j);
  }, e.allocUnsafeSlow = function(j) {
    return y(j);
  };
  function m(j, I) {
    if ((typeof I != "string" || I === "") && (I = "utf8"), !e.isEncoding(I))
      throw new TypeError("Unknown encoding: " + I);
    const C = V(j, I) | 0;
    let X = n(C);
    const se = X.write(j, I);
    return se !== C && (X = X.slice(0, se)), X;
  }
  function B(j) {
    const I = j.length < 0 ? 0 : D(j.length) | 0, C = n(I);
    for (let X = 0; X < I; X += 1)
      C[X] = j[X] & 255;
    return C;
  }
  function E(j) {
    if (ce(j, r)) {
      const I = new r(j);
      return S(I.buffer, I.byteOffset, I.byteLength);
    }
    return B(j);
  }
  function S(j, I, C) {
    if (I < 0 || j.byteLength < I)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (j.byteLength < I + (C || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let X;
    return I === void 0 && C === void 0 ? X = new r(j) : C === void 0 ? X = new r(j, I) : X = new r(j, I, C), Object.setPrototypeOf(X, e.prototype), X;
  }
  function O(j) {
    if (e.isBuffer(j)) {
      const I = D(j.length) | 0, C = n(I);
      return C.length === 0 || j.copy(C, 0, 0, I), C;
    }
    if (j.length !== void 0)
      return typeof j.length != "number" || ge(j.length) ? n(0) : B(j);
    if (j.type === "Buffer" && Array.isArray(j.data))
      return B(j.data);
  }
  function D(j) {
    if (j >= p)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + p.toString(16) + " bytes");
    return j | 0;
  }
  function $(j) {
    return +j != j && (j = 0), e.alloc(+j);
  }
  e.isBuffer = function(I) {
    return I != null && I._isBuffer === !0 && I !== e.prototype;
  }, e.compare = function(I, C) {
    if (ce(I, r) && (I = e.from(I, I.offset, I.byteLength)), ce(C, r) && (C = e.from(C, C.offset, C.byteLength)), !e.isBuffer(I) || !e.isBuffer(C))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (I === C) return 0;
    let X = I.length, se = C.length;
    for (let de = 0, ve = Math.min(X, se); de < ve; ++de)
      if (I[de] !== C[de]) {
        X = I[de], se = C[de];
        break;
      }
    return X < se ? -1 : se < X ? 1 : 0;
  }, e.isEncoding = function(I) {
    switch (String(I).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }, e.concat = function(I, C) {
    if (!Array.isArray(I))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (I.length === 0)
      return e.alloc(0);
    let X;
    if (C === void 0)
      for (C = 0, X = 0; X < I.length; ++X)
        C += I[X].length;
    const se = e.allocUnsafe(C);
    let de = 0;
    for (X = 0; X < I.length; ++X) {
      let ve = I[X];
      if (ce(ve, r))
        de + ve.length > se.length ? (e.isBuffer(ve) || (ve = e.from(ve)), ve.copy(se, de)) : r.prototype.set.call(
          se,
          ve,
          de
        );
      else if (e.isBuffer(ve))
        ve.copy(se, de);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      de += ve.length;
    }
    return se;
  };
  function V(j, I) {
    if (e.isBuffer(j))
      return j.length;
    if (u.isView(j) || ce(j, u))
      return j.byteLength;
    if (typeof j != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof j
      );
    const C = j.length, X = arguments.length > 2 && arguments[2] === !0;
    if (!X && C === 0) return 0;
    let se = !1;
    for (; ; )
      switch (I) {
        case "ascii":
        case "latin1":
        case "binary":
          return C;
        case "utf8":
        case "utf-8":
          return Fe(j).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return C * 2;
        case "hex":
          return C >>> 1;
        case "base64":
          return Te(j).length;
        default:
          if (se)
            return X ? -1 : Fe(j).length;
          I = ("" + I).toLowerCase(), se = !0;
      }
  }
  e.byteLength = V;
  function J(j, I, C) {
    let X = !1;
    if ((I === void 0 || I < 0) && (I = 0), I > this.length || ((C === void 0 || C > this.length) && (C = this.length), C <= 0) || (C >>>= 0, I >>>= 0, C <= I))
      return "";
    for (j || (j = "utf8"); ; )
      switch (j) {
        case "hex":
          return x(this, I, C);
        case "utf8":
        case "utf-8":
          return q(this, I, C);
        case "ascii":
          return w(this, I, C);
        case "latin1":
        case "binary":
          return M(this, I, C);
        case "base64":
          return A(this, I, C);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return L(this, I, C);
        default:
          if (X) throw new TypeError("Unknown encoding: " + j);
          j = (j + "").toLowerCase(), X = !0;
      }
  }
  e.prototype._isBuffer = !0;
  function ie(j, I, C) {
    const X = j[I];
    j[I] = j[C], j[C] = X;
  }
  e.prototype.swap16 = function() {
    const I = this.length;
    if (I % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let C = 0; C < I; C += 2)
      ie(this, C, C + 1);
    return this;
  }, e.prototype.swap32 = function() {
    const I = this.length;
    if (I % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let C = 0; C < I; C += 4)
      ie(this, C, C + 3), ie(this, C + 1, C + 2);
    return this;
  }, e.prototype.swap64 = function() {
    const I = this.length;
    if (I % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let C = 0; C < I; C += 8)
      ie(this, C, C + 7), ie(this, C + 1, C + 6), ie(this, C + 2, C + 5), ie(this, C + 3, C + 4);
    return this;
  }, e.prototype.toString = function() {
    const I = this.length;
    return I === 0 ? "" : arguments.length === 0 ? q(this, 0, I) : J.apply(this, arguments);
  }, e.prototype.toLocaleString = e.prototype.toString, e.prototype.equals = function(I) {
    if (!e.isBuffer(I)) throw new TypeError("Argument must be a Buffer");
    return this === I ? !0 : e.compare(this, I) === 0;
  }, e.prototype.inspect = function() {
    let I = "";
    const C = c.INSPECT_MAX_BYTES;
    return I = this.toString("hex", 0, C).replace(/(.{2})/g, "$1 ").trim(), this.length > C && (I += " ... "), "<Buffer " + I + ">";
  }, f && (e.prototype[f] = e.prototype.inspect), e.prototype.compare = function(I, C, X, se, de) {
    if (ce(I, r) && (I = e.from(I, I.offset, I.byteLength)), !e.isBuffer(I))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof I
      );
    if (C === void 0 && (C = 0), X === void 0 && (X = I ? I.length : 0), se === void 0 && (se = 0), de === void 0 && (de = this.length), C < 0 || X > I.length || se < 0 || de > this.length)
      throw new RangeError("out of range index");
    if (se >= de && C >= X)
      return 0;
    if (se >= de)
      return -1;
    if (C >= X)
      return 1;
    if (C >>>= 0, X >>>= 0, se >>>= 0, de >>>= 0, this === I) return 0;
    let ve = de - se, Ce = X - C;
    const Le = Math.min(ve, Ce), Ie = this.slice(se, de), Ue = I.slice(C, X);
    for (let $e = 0; $e < Le; ++$e)
      if (Ie[$e] !== Ue[$e]) {
        ve = Ie[$e], Ce = Ue[$e];
        break;
      }
    return ve < Ce ? -1 : Ce < ve ? 1 : 0;
  };
  function ne(j, I, C, X, se) {
    if (j.length === 0) return -1;
    if (typeof C == "string" ? (X = C, C = 0) : C > 2147483647 ? C = 2147483647 : C < -2147483648 && (C = -2147483648), C = +C, ge(C) && (C = se ? 0 : j.length - 1), C < 0 && (C = j.length + C), C >= j.length) {
      if (se) return -1;
      C = j.length - 1;
    } else if (C < 0)
      if (se) C = 0;
      else return -1;
    if (typeof I == "string" && (I = e.from(I, X)), e.isBuffer(I))
      return I.length === 0 ? -1 : le(j, I, C, X, se);
    if (typeof I == "number")
      return I = I & 255, typeof r.prototype.indexOf == "function" ? se ? r.prototype.indexOf.call(j, I, C) : r.prototype.lastIndexOf.call(j, I, C) : le(j, [I], C, X, se);
    throw new TypeError("val must be string, number or Buffer");
  }
  function le(j, I, C, X, se) {
    let de = 1, ve = j.length, Ce = I.length;
    if (X !== void 0 && (X = String(X).toLowerCase(), X === "ucs2" || X === "ucs-2" || X === "utf16le" || X === "utf-16le")) {
      if (j.length < 2 || I.length < 2)
        return -1;
      de = 2, ve /= 2, Ce /= 2, C /= 2;
    }
    function Le(Ue, $e) {
      return de === 1 ? Ue[$e] : Ue.readUInt16BE($e * de);
    }
    let Ie;
    if (se) {
      let Ue = -1;
      for (Ie = C; Ie < ve; Ie++)
        if (Le(j, Ie) === Le(I, Ue === -1 ? 0 : Ie - Ue)) {
          if (Ue === -1 && (Ue = Ie), Ie - Ue + 1 === Ce) return Ue * de;
        } else
          Ue !== -1 && (Ie -= Ie - Ue), Ue = -1;
    } else
      for (C + Ce > ve && (C = ve - Ce), Ie = C; Ie >= 0; Ie--) {
        let Ue = !0;
        for (let $e = 0; $e < Ce; $e++)
          if (Le(j, Ie + $e) !== Le(I, $e)) {
            Ue = !1;
            break;
          }
        if (Ue) return Ie;
      }
    return -1;
  }
  e.prototype.includes = function(I, C, X) {
    return this.indexOf(I, C, X) !== -1;
  }, e.prototype.indexOf = function(I, C, X) {
    return ne(this, I, C, X, !0);
  }, e.prototype.lastIndexOf = function(I, C, X) {
    return ne(this, I, C, X, !1);
  };
  function Y(j, I, C, X) {
    C = Number(C) || 0;
    const se = j.length - C;
    X ? (X = Number(X), X > se && (X = se)) : X = se;
    const de = I.length;
    X > de / 2 && (X = de / 2);
    let ve;
    for (ve = 0; ve < X; ++ve) {
      const Ce = parseInt(I.substr(ve * 2, 2), 16);
      if (ge(Ce)) return ve;
      j[C + ve] = Ce;
    }
    return ve;
  }
  function b(j, I, C, X) {
    return oe(Fe(I, j.length - C), j, C, X);
  }
  function g(j, I, C, X) {
    return oe(qe(I), j, C, X);
  }
  function l(j, I, C, X) {
    return oe(Te(I), j, C, X);
  }
  function _(j, I, C, X) {
    return oe(Me(I, j.length - C), j, C, X);
  }
  e.prototype.write = function(I, C, X, se) {
    if (C === void 0)
      se = "utf8", X = this.length, C = 0;
    else if (X === void 0 && typeof C == "string")
      se = C, X = this.length, C = 0;
    else if (isFinite(C))
      C = C >>> 0, isFinite(X) ? (X = X >>> 0, se === void 0 && (se = "utf8")) : (se = X, X = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const de = this.length - C;
    if ((X === void 0 || X > de) && (X = de), I.length > 0 && (X < 0 || C < 0) || C > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    se || (se = "utf8");
    let ve = !1;
    for (; ; )
      switch (se) {
        case "hex":
          return Y(this, I, C, X);
        case "utf8":
        case "utf-8":
          return b(this, I, C, X);
        case "ascii":
        case "latin1":
        case "binary":
          return g(this, I, C, X);
        case "base64":
          return l(this, I, C, X);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return _(this, I, C, X);
        default:
          if (ve) throw new TypeError("Unknown encoding: " + se);
          se = ("" + se).toLowerCase(), ve = !0;
      }
  }, e.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function A(j, I, C) {
    return I === 0 && C === j.length ? a.fromByteArray(j) : a.fromByteArray(j.slice(I, C));
  }
  function q(j, I, C) {
    C = Math.min(j.length, C);
    const X = [];
    let se = I;
    for (; se < C; ) {
      const de = j[se];
      let ve = null, Ce = de > 239 ? 4 : de > 223 ? 3 : de > 191 ? 2 : 1;
      if (se + Ce <= C) {
        let Le, Ie, Ue, $e;
        switch (Ce) {
          case 1:
            de < 128 && (ve = de);
            break;
          case 2:
            Le = j[se + 1], (Le & 192) === 128 && ($e = (de & 31) << 6 | Le & 63, $e > 127 && (ve = $e));
            break;
          case 3:
            Le = j[se + 1], Ie = j[se + 2], (Le & 192) === 128 && (Ie & 192) === 128 && ($e = (de & 15) << 12 | (Le & 63) << 6 | Ie & 63, $e > 2047 && ($e < 55296 || $e > 57343) && (ve = $e));
            break;
          case 4:
            Le = j[se + 1], Ie = j[se + 2], Ue = j[se + 3], (Le & 192) === 128 && (Ie & 192) === 128 && (Ue & 192) === 128 && ($e = (de & 15) << 18 | (Le & 63) << 12 | (Ie & 63) << 6 | Ue & 63, $e > 65535 && $e < 1114112 && (ve = $e));
        }
      }
      ve === null ? (ve = 65533, Ce = 1) : ve > 65535 && (ve -= 65536, X.push(ve >>> 10 & 1023 | 55296), ve = 56320 | ve & 1023), X.push(ve), se += Ce;
    }
    return R(X);
  }
  const P = 4096;
  function R(j) {
    const I = j.length;
    if (I <= P)
      return String.fromCharCode.apply(String, j);
    let C = "", X = 0;
    for (; X < I; )
      C += String.fromCharCode.apply(
        String,
        j.slice(X, X += P)
      );
    return C;
  }
  function w(j, I, C) {
    let X = "";
    C = Math.min(j.length, C);
    for (let se = I; se < C; ++se)
      X += String.fromCharCode(j[se] & 127);
    return X;
  }
  function M(j, I, C) {
    let X = "";
    C = Math.min(j.length, C);
    for (let se = I; se < C; ++se)
      X += String.fromCharCode(j[se]);
    return X;
  }
  function x(j, I, C) {
    const X = j.length;
    (!I || I < 0) && (I = 0), (!C || C < 0 || C > X) && (C = X);
    let se = "";
    for (let de = I; de < C; ++de)
      se += we[j[de]];
    return se;
  }
  function L(j, I, C) {
    const X = j.slice(I, C);
    let se = "";
    for (let de = 0; de < X.length - 1; de += 2)
      se += String.fromCharCode(X[de] + X[de + 1] * 256);
    return se;
  }
  e.prototype.slice = function(I, C) {
    const X = this.length;
    I = ~~I, C = C === void 0 ? X : ~~C, I < 0 ? (I += X, I < 0 && (I = 0)) : I > X && (I = X), C < 0 ? (C += X, C < 0 && (C = 0)) : C > X && (C = X), C < I && (C = I);
    const se = this.subarray(I, C);
    return Object.setPrototypeOf(se, e.prototype), se;
  };
  function K(j, I, C) {
    if (j % 1 !== 0 || j < 0) throw new RangeError("offset is not uint");
    if (j + I > C) throw new RangeError("Trying to access beyond buffer length");
  }
  e.prototype.readUintLE = e.prototype.readUIntLE = function(I, C, X) {
    I = I >>> 0, C = C >>> 0, X || K(I, C, this.length);
    let se = this[I], de = 1, ve = 0;
    for (; ++ve < C && (de *= 256); )
      se += this[I + ve] * de;
    return se;
  }, e.prototype.readUintBE = e.prototype.readUIntBE = function(I, C, X) {
    I = I >>> 0, C = C >>> 0, X || K(I, C, this.length);
    let se = this[I + --C], de = 1;
    for (; C > 0 && (de *= 256); )
      se += this[I + --C] * de;
    return se;
  }, e.prototype.readUint8 = e.prototype.readUInt8 = function(I, C) {
    return I = I >>> 0, C || K(I, 1, this.length), this[I];
  }, e.prototype.readUint16LE = e.prototype.readUInt16LE = function(I, C) {
    return I = I >>> 0, C || K(I, 2, this.length), this[I] | this[I + 1] << 8;
  }, e.prototype.readUint16BE = e.prototype.readUInt16BE = function(I, C) {
    return I = I >>> 0, C || K(I, 2, this.length), this[I] << 8 | this[I + 1];
  }, e.prototype.readUint32LE = e.prototype.readUInt32LE = function(I, C) {
    return I = I >>> 0, C || K(I, 4, this.length), (this[I] | this[I + 1] << 8 | this[I + 2] << 16) + this[I + 3] * 16777216;
  }, e.prototype.readUint32BE = e.prototype.readUInt32BE = function(I, C) {
    return I = I >>> 0, C || K(I, 4, this.length), this[I] * 16777216 + (this[I + 1] << 16 | this[I + 2] << 8 | this[I + 3]);
  }, e.prototype.readBigUInt64LE = Se(function(I) {
    I = I >>> 0, _e(I, "offset");
    const C = this[I], X = this[I + 7];
    (C === void 0 || X === void 0) && Be(I, this.length - 8);
    const se = C + this[++I] * 2 ** 8 + this[++I] * 2 ** 16 + this[++I] * 2 ** 24, de = this[++I] + this[++I] * 2 ** 8 + this[++I] * 2 ** 16 + X * 2 ** 24;
    return BigInt(se) + (BigInt(de) << BigInt(32));
  }), e.prototype.readBigUInt64BE = Se(function(I) {
    I = I >>> 0, _e(I, "offset");
    const C = this[I], X = this[I + 7];
    (C === void 0 || X === void 0) && Be(I, this.length - 8);
    const se = C * 2 ** 24 + this[++I] * 2 ** 16 + this[++I] * 2 ** 8 + this[++I], de = this[++I] * 2 ** 24 + this[++I] * 2 ** 16 + this[++I] * 2 ** 8 + X;
    return (BigInt(se) << BigInt(32)) + BigInt(de);
  }), e.prototype.readIntLE = function(I, C, X) {
    I = I >>> 0, C = C >>> 0, X || K(I, C, this.length);
    let se = this[I], de = 1, ve = 0;
    for (; ++ve < C && (de *= 256); )
      se += this[I + ve] * de;
    return de *= 128, se >= de && (se -= Math.pow(2, 8 * C)), se;
  }, e.prototype.readIntBE = function(I, C, X) {
    I = I >>> 0, C = C >>> 0, X || K(I, C, this.length);
    let se = C, de = 1, ve = this[I + --se];
    for (; se > 0 && (de *= 256); )
      ve += this[I + --se] * de;
    return de *= 128, ve >= de && (ve -= Math.pow(2, 8 * C)), ve;
  }, e.prototype.readInt8 = function(I, C) {
    return I = I >>> 0, C || K(I, 1, this.length), this[I] & 128 ? (255 - this[I] + 1) * -1 : this[I];
  }, e.prototype.readInt16LE = function(I, C) {
    I = I >>> 0, C || K(I, 2, this.length);
    const X = this[I] | this[I + 1] << 8;
    return X & 32768 ? X | 4294901760 : X;
  }, e.prototype.readInt16BE = function(I, C) {
    I = I >>> 0, C || K(I, 2, this.length);
    const X = this[I + 1] | this[I] << 8;
    return X & 32768 ? X | 4294901760 : X;
  }, e.prototype.readInt32LE = function(I, C) {
    return I = I >>> 0, C || K(I, 4, this.length), this[I] | this[I + 1] << 8 | this[I + 2] << 16 | this[I + 3] << 24;
  }, e.prototype.readInt32BE = function(I, C) {
    return I = I >>> 0, C || K(I, 4, this.length), this[I] << 24 | this[I + 1] << 16 | this[I + 2] << 8 | this[I + 3];
  }, e.prototype.readBigInt64LE = Se(function(I) {
    I = I >>> 0, _e(I, "offset");
    const C = this[I], X = this[I + 7];
    (C === void 0 || X === void 0) && Be(I, this.length - 8);
    const se = this[I + 4] + this[I + 5] * 2 ** 8 + this[I + 6] * 2 ** 16 + (X << 24);
    return (BigInt(se) << BigInt(32)) + BigInt(C + this[++I] * 2 ** 8 + this[++I] * 2 ** 16 + this[++I] * 2 ** 24);
  }), e.prototype.readBigInt64BE = Se(function(I) {
    I = I >>> 0, _e(I, "offset");
    const C = this[I], X = this[I + 7];
    (C === void 0 || X === void 0) && Be(I, this.length - 8);
    const se = (C << 24) + // Overflow
    this[++I] * 2 ** 16 + this[++I] * 2 ** 8 + this[++I];
    return (BigInt(se) << BigInt(32)) + BigInt(this[++I] * 2 ** 24 + this[++I] * 2 ** 16 + this[++I] * 2 ** 8 + X);
  }), e.prototype.readFloatLE = function(I, C) {
    return I = I >>> 0, C || K(I, 4, this.length), h.read(this, I, !0, 23, 4);
  }, e.prototype.readFloatBE = function(I, C) {
    return I = I >>> 0, C || K(I, 4, this.length), h.read(this, I, !1, 23, 4);
  }, e.prototype.readDoubleLE = function(I, C) {
    return I = I >>> 0, C || K(I, 8, this.length), h.read(this, I, !0, 52, 8);
  }, e.prototype.readDoubleBE = function(I, C) {
    return I = I >>> 0, C || K(I, 8, this.length), h.read(this, I, !1, 52, 8);
  };
  function Q(j, I, C, X, se, de) {
    if (!e.isBuffer(j)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (I > se || I < de) throw new RangeError('"value" argument is out of bounds');
    if (C + X > j.length) throw new RangeError("Index out of range");
  }
  e.prototype.writeUintLE = e.prototype.writeUIntLE = function(I, C, X, se) {
    if (I = +I, C = C >>> 0, X = X >>> 0, !se) {
      const Ce = Math.pow(2, 8 * X) - 1;
      Q(this, I, C, X, Ce, 0);
    }
    let de = 1, ve = 0;
    for (this[C] = I & 255; ++ve < X && (de *= 256); )
      this[C + ve] = I / de & 255;
    return C + X;
  }, e.prototype.writeUintBE = e.prototype.writeUIntBE = function(I, C, X, se) {
    if (I = +I, C = C >>> 0, X = X >>> 0, !se) {
      const Ce = Math.pow(2, 8 * X) - 1;
      Q(this, I, C, X, Ce, 0);
    }
    let de = X - 1, ve = 1;
    for (this[C + de] = I & 255; --de >= 0 && (ve *= 256); )
      this[C + de] = I / ve & 255;
    return C + X;
  }, e.prototype.writeUint8 = e.prototype.writeUInt8 = function(I, C, X) {
    return I = +I, C = C >>> 0, X || Q(this, I, C, 1, 255, 0), this[C] = I & 255, C + 1;
  }, e.prototype.writeUint16LE = e.prototype.writeUInt16LE = function(I, C, X) {
    return I = +I, C = C >>> 0, X || Q(this, I, C, 2, 65535, 0), this[C] = I & 255, this[C + 1] = I >>> 8, C + 2;
  }, e.prototype.writeUint16BE = e.prototype.writeUInt16BE = function(I, C, X) {
    return I = +I, C = C >>> 0, X || Q(this, I, C, 2, 65535, 0), this[C] = I >>> 8, this[C + 1] = I & 255, C + 2;
  }, e.prototype.writeUint32LE = e.prototype.writeUInt32LE = function(I, C, X) {
    return I = +I, C = C >>> 0, X || Q(this, I, C, 4, 4294967295, 0), this[C + 3] = I >>> 24, this[C + 2] = I >>> 16, this[C + 1] = I >>> 8, this[C] = I & 255, C + 4;
  }, e.prototype.writeUint32BE = e.prototype.writeUInt32BE = function(I, C, X) {
    return I = +I, C = C >>> 0, X || Q(this, I, C, 4, 4294967295, 0), this[C] = I >>> 24, this[C + 1] = I >>> 16, this[C + 2] = I >>> 8, this[C + 3] = I & 255, C + 4;
  };
  function U(j, I, C, X, se) {
    xe(I, X, se, j, C, 7);
    let de = Number(I & BigInt(4294967295));
    j[C++] = de, de = de >> 8, j[C++] = de, de = de >> 8, j[C++] = de, de = de >> 8, j[C++] = de;
    let ve = Number(I >> BigInt(32) & BigInt(4294967295));
    return j[C++] = ve, ve = ve >> 8, j[C++] = ve, ve = ve >> 8, j[C++] = ve, ve = ve >> 8, j[C++] = ve, C;
  }
  function N(j, I, C, X, se) {
    xe(I, X, se, j, C, 7);
    let de = Number(I & BigInt(4294967295));
    j[C + 7] = de, de = de >> 8, j[C + 6] = de, de = de >> 8, j[C + 5] = de, de = de >> 8, j[C + 4] = de;
    let ve = Number(I >> BigInt(32) & BigInt(4294967295));
    return j[C + 3] = ve, ve = ve >> 8, j[C + 2] = ve, ve = ve >> 8, j[C + 1] = ve, ve = ve >> 8, j[C] = ve, C + 8;
  }
  e.prototype.writeBigUInt64LE = Se(function(I, C = 0) {
    return U(this, I, C, BigInt(0), BigInt("0xffffffffffffffff"));
  }), e.prototype.writeBigUInt64BE = Se(function(I, C = 0) {
    return N(this, I, C, BigInt(0), BigInt("0xffffffffffffffff"));
  }), e.prototype.writeIntLE = function(I, C, X, se) {
    if (I = +I, C = C >>> 0, !se) {
      const Le = Math.pow(2, 8 * X - 1);
      Q(this, I, C, X, Le - 1, -Le);
    }
    let de = 0, ve = 1, Ce = 0;
    for (this[C] = I & 255; ++de < X && (ve *= 256); )
      I < 0 && Ce === 0 && this[C + de - 1] !== 0 && (Ce = 1), this[C + de] = (I / ve >> 0) - Ce & 255;
    return C + X;
  }, e.prototype.writeIntBE = function(I, C, X, se) {
    if (I = +I, C = C >>> 0, !se) {
      const Le = Math.pow(2, 8 * X - 1);
      Q(this, I, C, X, Le - 1, -Le);
    }
    let de = X - 1, ve = 1, Ce = 0;
    for (this[C + de] = I & 255; --de >= 0 && (ve *= 256); )
      I < 0 && Ce === 0 && this[C + de + 1] !== 0 && (Ce = 1), this[C + de] = (I / ve >> 0) - Ce & 255;
    return C + X;
  }, e.prototype.writeInt8 = function(I, C, X) {
    return I = +I, C = C >>> 0, X || Q(this, I, C, 1, 127, -128), I < 0 && (I = 255 + I + 1), this[C] = I & 255, C + 1;
  }, e.prototype.writeInt16LE = function(I, C, X) {
    return I = +I, C = C >>> 0, X || Q(this, I, C, 2, 32767, -32768), this[C] = I & 255, this[C + 1] = I >>> 8, C + 2;
  }, e.prototype.writeInt16BE = function(I, C, X) {
    return I = +I, C = C >>> 0, X || Q(this, I, C, 2, 32767, -32768), this[C] = I >>> 8, this[C + 1] = I & 255, C + 2;
  }, e.prototype.writeInt32LE = function(I, C, X) {
    return I = +I, C = C >>> 0, X || Q(this, I, C, 4, 2147483647, -2147483648), this[C] = I & 255, this[C + 1] = I >>> 8, this[C + 2] = I >>> 16, this[C + 3] = I >>> 24, C + 4;
  }, e.prototype.writeInt32BE = function(I, C, X) {
    return I = +I, C = C >>> 0, X || Q(this, I, C, 4, 2147483647, -2147483648), I < 0 && (I = 4294967295 + I + 1), this[C] = I >>> 24, this[C + 1] = I >>> 16, this[C + 2] = I >>> 8, this[C + 3] = I & 255, C + 4;
  }, e.prototype.writeBigInt64LE = Se(function(I, C = 0) {
    return U(this, I, C, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), e.prototype.writeBigInt64BE = Se(function(I, C = 0) {
    return N(this, I, C, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function F(j, I, C, X, se, de) {
    if (C + X > j.length) throw new RangeError("Index out of range");
    if (C < 0) throw new RangeError("Index out of range");
  }
  function ee(j, I, C, X, se) {
    return I = +I, C = C >>> 0, se || F(j, I, C, 4), h.write(j, I, C, X, 23, 4), C + 4;
  }
  e.prototype.writeFloatLE = function(I, C, X) {
    return ee(this, I, C, !0, X);
  }, e.prototype.writeFloatBE = function(I, C, X) {
    return ee(this, I, C, !1, X);
  };
  function ae(j, I, C, X, se) {
    return I = +I, C = C >>> 0, se || F(j, I, C, 8), h.write(j, I, C, X, 52, 8), C + 8;
  }
  e.prototype.writeDoubleLE = function(I, C, X) {
    return ae(this, I, C, !0, X);
  }, e.prototype.writeDoubleBE = function(I, C, X) {
    return ae(this, I, C, !1, X);
  }, e.prototype.copy = function(I, C, X, se) {
    if (!e.isBuffer(I)) throw new TypeError("argument should be a Buffer");
    if (X || (X = 0), !se && se !== 0 && (se = this.length), C >= I.length && (C = I.length), C || (C = 0), se > 0 && se < X && (se = X), se === X || I.length === 0 || this.length === 0) return 0;
    if (C < 0)
      throw new RangeError("targetStart out of bounds");
    if (X < 0 || X >= this.length) throw new RangeError("Index out of range");
    if (se < 0) throw new RangeError("sourceEnd out of bounds");
    se > this.length && (se = this.length), I.length - C < se - X && (se = I.length - C + X);
    const de = se - X;
    return this === I && typeof r.prototype.copyWithin == "function" ? this.copyWithin(C, X, se) : r.prototype.set.call(
      I,
      this.subarray(X, se),
      C
    ), de;
  }, e.prototype.fill = function(I, C, X, se) {
    if (typeof I == "string") {
      if (typeof C == "string" ? (se = C, C = 0, X = this.length) : typeof X == "string" && (se = X, X = this.length), se !== void 0 && typeof se != "string")
        throw new TypeError("encoding must be a string");
      if (typeof se == "string" && !e.isEncoding(se))
        throw new TypeError("Unknown encoding: " + se);
      if (I.length === 1) {
        const ve = I.charCodeAt(0);
        (se === "utf8" && ve < 128 || se === "latin1") && (I = ve);
      }
    } else typeof I == "number" ? I = I & 255 : typeof I == "boolean" && (I = Number(I));
    if (C < 0 || this.length < C || this.length < X)
      throw new RangeError("Out of range index");
    if (X <= C)
      return this;
    C = C >>> 0, X = X === void 0 ? this.length : X >>> 0, I || (I = 0);
    let de;
    if (typeof I == "number")
      for (de = C; de < X; ++de)
        this[de] = I;
    else {
      const ve = e.isBuffer(I) ? I : e.from(I, se), Ce = ve.length;
      if (Ce === 0)
        throw new TypeError('The value "' + I + '" is invalid for argument "value"');
      for (de = 0; de < X - C; ++de)
        this[de + C] = ve[de % Ce];
    }
    return this;
  };
  const G = {};
  function z(j, I, C) {
    G[j] = class extends C {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: I.apply(this, arguments),
          writable: !0,
          configurable: !0
        }), this.name = `${this.name} [${j}]`, this.stack, delete this.name;
      }
      get code() {
        return j;
      }
      set code(se) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: se,
          writable: !0
        });
      }
      toString() {
        return `${this.name} [${j}]: ${this.message}`;
      }
    };
  }
  z(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(j) {
      return j ? `${j} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), z(
    "ERR_INVALID_ARG_TYPE",
    function(j, I) {
      return `The "${j}" argument must be of type number. Received type ${typeof I}`;
    },
    TypeError
  ), z(
    "ERR_OUT_OF_RANGE",
    function(j, I, C) {
      let X = `The value of "${j}" is out of range.`, se = C;
      return Number.isInteger(C) && Math.abs(C) > 2 ** 32 ? se = fe(String(C)) : typeof C == "bigint" && (se = String(C), (C > BigInt(2) ** BigInt(32) || C < -(BigInt(2) ** BigInt(32))) && (se = fe(se)), se += "n"), X += ` It must be ${I}. Received ${se}`, X;
    },
    RangeError
  );
  function fe(j) {
    let I = "", C = j.length;
    const X = j[0] === "-" ? 1 : 0;
    for (; C >= X + 4; C -= 3)
      I = `_${j.slice(C - 3, C)}${I}`;
    return `${j.slice(0, C)}${I}`;
  }
  function me(j, I, C) {
    _e(I, "offset"), (j[I] === void 0 || j[I + C] === void 0) && Be(I, j.length - (C + 1));
  }
  function xe(j, I, C, X, se, de) {
    if (j > C || j < I) {
      const ve = typeof I == "bigint" ? "n" : "";
      let Ce;
      throw I === 0 || I === BigInt(0) ? Ce = `>= 0${ve} and < 2${ve} ** ${(de + 1) * 8}${ve}` : Ce = `>= -(2${ve} ** ${(de + 1) * 8 - 1}${ve}) and < 2 ** ${(de + 1) * 8 - 1}${ve}`, new G.ERR_OUT_OF_RANGE("value", Ce, j);
    }
    me(X, se, de);
  }
  function _e(j, I) {
    if (typeof j != "number")
      throw new G.ERR_INVALID_ARG_TYPE(I, "number", j);
  }
  function Be(j, I, C) {
    throw Math.floor(j) !== j ? (_e(j, C), new G.ERR_OUT_OF_RANGE("offset", "an integer", j)) : I < 0 ? new G.ERR_BUFFER_OUT_OF_BOUNDS() : new G.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${I}`,
      j
    );
  }
  const Ae = /[^+/0-9A-Za-z-_]/g;
  function be(j) {
    if (j = j.split("=")[0], j = j.trim().replace(Ae, ""), j.length < 2) return "";
    for (; j.length % 4 !== 0; )
      j = j + "=";
    return j;
  }
  function Fe(j, I) {
    I = I || 1 / 0;
    let C;
    const X = j.length;
    let se = null;
    const de = [];
    for (let ve = 0; ve < X; ++ve) {
      if (C = j.charCodeAt(ve), C > 55295 && C < 57344) {
        if (!se) {
          if (C > 56319) {
            (I -= 3) > -1 && de.push(239, 191, 189);
            continue;
          } else if (ve + 1 === X) {
            (I -= 3) > -1 && de.push(239, 191, 189);
            continue;
          }
          se = C;
          continue;
        }
        if (C < 56320) {
          (I -= 3) > -1 && de.push(239, 191, 189), se = C;
          continue;
        }
        C = (se - 55296 << 10 | C - 56320) + 65536;
      } else se && (I -= 3) > -1 && de.push(239, 191, 189);
      if (se = null, C < 128) {
        if ((I -= 1) < 0) break;
        de.push(C);
      } else if (C < 2048) {
        if ((I -= 2) < 0) break;
        de.push(
          C >> 6 | 192,
          C & 63 | 128
        );
      } else if (C < 65536) {
        if ((I -= 3) < 0) break;
        de.push(
          C >> 12 | 224,
          C >> 6 & 63 | 128,
          C & 63 | 128
        );
      } else if (C < 1114112) {
        if ((I -= 4) < 0) break;
        de.push(
          C >> 18 | 240,
          C >> 12 & 63 | 128,
          C >> 6 & 63 | 128,
          C & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return de;
  }
  function qe(j) {
    const I = [];
    for (let C = 0; C < j.length; ++C)
      I.push(j.charCodeAt(C) & 255);
    return I;
  }
  function Me(j, I) {
    let C, X, se;
    const de = [];
    for (let ve = 0; ve < j.length && !((I -= 2) < 0); ++ve)
      C = j.charCodeAt(ve), X = C >> 8, se = C % 256, de.push(se), de.push(X);
    return de;
  }
  function Te(j) {
    return a.toByteArray(be(j));
  }
  function oe(j, I, C, X) {
    let se;
    for (se = 0; se < X && !(se + C >= I.length || se >= j.length); ++se)
      I[se + C] = j[se];
    return se;
  }
  function ce(j, I) {
    return j instanceof I || j != null && j.constructor != null && j.constructor.name != null && j.constructor.name === I.name;
  }
  function ge(j) {
    return j !== j;
  }
  const we = (function() {
    const j = "0123456789abcdef", I = new Array(256);
    for (let C = 0; C < 16; ++C) {
      const X = C * 16;
      for (let se = 0; se < 16; ++se)
        I[X + se] = j[C] + j[se];
    }
    return I;
  })();
  function Se(j) {
    return typeof BigInt > "u" ? Oe : j;
  }
  function Oe() {
    throw new Error("BigInt not supported");
  }
})(buffer$1);
const Buffer = buffer$1.Buffer, RSA_PKCS1_PADDING = 1, RSA_NO_PADDING = 3, RSA_PKCS1_OAEP_PADDING = 4, require$$0$1 = {
  RSA_PKCS1_PADDING,
  RSA_NO_PADDING,
  RSA_PKCS1_OAEP_PADDING
};
var rsa = {};
function getDefaultExportFromCjs(c) {
  return c && c.__esModule && Object.prototype.hasOwnProperty.call(c, "default") ? c.default : c;
}
var browser$c = { exports: {} }, process = browser$c.exports = {}, cachedSetTimeout, cachedClearTimeout;
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? cachedSetTimeout = setTimeout : cachedSetTimeout = defaultSetTimout;
  } catch {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    typeof clearTimeout == "function" ? cachedClearTimeout = clearTimeout : cachedClearTimeout = defaultClearTimeout;
  } catch {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(c) {
  if (cachedSetTimeout === setTimeout)
    return setTimeout(c, 0);
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout)
    return cachedSetTimeout = setTimeout, setTimeout(c, 0);
  try {
    return cachedSetTimeout(c, 0);
  } catch {
    try {
      return cachedSetTimeout.call(null, c, 0);
    } catch {
      return cachedSetTimeout.call(this, c, 0);
    }
  }
}
function runClearTimeout(c) {
  if (cachedClearTimeout === clearTimeout)
    return clearTimeout(c);
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout)
    return cachedClearTimeout = clearTimeout, clearTimeout(c);
  try {
    return cachedClearTimeout(c);
  } catch {
    try {
      return cachedClearTimeout.call(null, c);
    } catch {
      return cachedClearTimeout.call(this, c);
    }
  }
}
var queue = [], draining = !1, currentQueue, queueIndex = -1;
function cleanUpNextTick() {
  !draining || !currentQueue || (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue());
}
function drainQueue() {
  if (!draining) {
    var c = runTimeout(cleanUpNextTick);
    draining = !0;
    for (var a = queue.length; a; ) {
      for (currentQueue = queue, queue = []; ++queueIndex < a; )
        currentQueue && currentQueue[queueIndex].run();
      queueIndex = -1, a = queue.length;
    }
    currentQueue = null, draining = !1, runClearTimeout(c);
  }
}
process.nextTick = function(c) {
  var a = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var h = 1; h < arguments.length; h++)
      a[h - 1] = arguments[h];
  queue.push(new Item(c, a)), queue.length === 1 && !draining && runTimeout(drainQueue);
};
function Item(c, a) {
  this.fun = c, this.array = a;
}
Item.prototype.run = function() {
  this.fun.apply(null, this.array);
};
process.title = "browser";
process.browser = !0;
process.env = {};
process.argv = [];
process.version = "";
process.versions = {};
function noop() {
}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function(c) {
  return [];
};
process.binding = function(c) {
  throw new Error("process.binding is not supported");
};
process.cwd = function() {
  return "/";
};
process.chdir = function(c) {
  throw new Error("process.chdir is not supported");
};
process.umask = function() {
  return 0;
};
var browserExports = browser$c.exports;
const process$1 = /* @__PURE__ */ getDefaultExportFromCjs(browserExports);
var utils$4 = {}, cryptoBrowserify = {}, browser$b = { exports: {} }, safeBuffer$1 = { exports: {} }, dist = {}, hasRequiredDist;
function requireDist() {
  return hasRequiredDist || (hasRequiredDist = 1, (function(c) {
    Object.defineProperties(c, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: "Module" } });
    var a = {}, h = {};
    h.byteLength = e, h.toByteArray = d, h.fromByteArray = m;
    for (var f = [], p = [], r = typeof Uint8Array < "u" ? Uint8Array : Array, u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, t = u.length; o < t; ++o)
      f[o] = u[o], p[u.charCodeAt(o)] = o;
    p[45] = 62, p[95] = 63;
    function n(S) {
      var O = S.length;
      if (O % 4 > 0)
        throw new Error("Invalid string. Length must be a multiple of 4");
      var D = S.indexOf("=");
      D === -1 && (D = O);
      var $ = D === O ? 0 : 4 - D % 4;
      return [D, $];
    }
    function e(S) {
      var O = n(S), D = O[0], $ = O[1];
      return (D + $) * 3 / 4 - $;
    }
    function s(S, O, D) {
      return (O + D) * 3 / 4 - D;
    }
    function d(S) {
      var O, D = n(S), $ = D[0], V = D[1], J = new r(s(S, $, V)), ie = 0, ne = V > 0 ? $ - 4 : $, le;
      for (le = 0; le < ne; le += 4)
        O = p[S.charCodeAt(le)] << 18 | p[S.charCodeAt(le + 1)] << 12 | p[S.charCodeAt(le + 2)] << 6 | p[S.charCodeAt(le + 3)], J[ie++] = O >> 16 & 255, J[ie++] = O >> 8 & 255, J[ie++] = O & 255;
      return V === 2 && (O = p[S.charCodeAt(le)] << 2 | p[S.charCodeAt(le + 1)] >> 4, J[ie++] = O & 255), V === 1 && (O = p[S.charCodeAt(le)] << 10 | p[S.charCodeAt(le + 1)] << 4 | p[S.charCodeAt(le + 2)] >> 2, J[ie++] = O >> 8 & 255, J[ie++] = O & 255), J;
    }
    function v(S) {
      return f[S >> 18 & 63] + f[S >> 12 & 63] + f[S >> 6 & 63] + f[S & 63];
    }
    function y(S, O, D) {
      for (var $, V = [], J = O; J < D; J += 3)
        $ = (S[J] << 16 & 16711680) + (S[J + 1] << 8 & 65280) + (S[J + 2] & 255), V.push(v($));
      return V.join("");
    }
    function m(S) {
      for (var O, D = S.length, $ = D % 3, V = [], J = 16383, ie = 0, ne = D - $; ie < ne; ie += J)
        V.push(y(S, ie, ie + J > ne ? ne : ie + J));
      return $ === 1 ? (O = S[D - 1], V.push(
        f[O >> 2] + f[O << 4 & 63] + "=="
      )) : $ === 2 && (O = (S[D - 2] << 8) + S[D - 1], V.push(
        f[O >> 10] + f[O >> 4 & 63] + f[O << 2 & 63] + "="
      )), V.join("");
    }
    var B = {};
    B.read = function(S, O, D, $, V) {
      var J, ie, ne = V * 8 - $ - 1, le = (1 << ne) - 1, Y = le >> 1, b = -7, g = D ? V - 1 : 0, l = D ? -1 : 1, _ = S[O + g];
      for (g += l, J = _ & (1 << -b) - 1, _ >>= -b, b += ne; b > 0; J = J * 256 + S[O + g], g += l, b -= 8)
        ;
      for (ie = J & (1 << -b) - 1, J >>= -b, b += $; b > 0; ie = ie * 256 + S[O + g], g += l, b -= 8)
        ;
      if (J === 0)
        J = 1 - Y;
      else {
        if (J === le)
          return ie ? NaN : (_ ? -1 : 1) * (1 / 0);
        ie = ie + Math.pow(2, $), J = J - Y;
      }
      return (_ ? -1 : 1) * ie * Math.pow(2, J - $);
    }, B.write = function(S, O, D, $, V, J) {
      var ie, ne, le, Y = J * 8 - V - 1, b = (1 << Y) - 1, g = b >> 1, l = V === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, _ = $ ? 0 : J - 1, A = $ ? 1 : -1, q = O < 0 || O === 0 && 1 / O < 0 ? 1 : 0;
      for (O = Math.abs(O), isNaN(O) || O === 1 / 0 ? (ne = isNaN(O) ? 1 : 0, ie = b) : (ie = Math.floor(Math.log(O) / Math.LN2), O * (le = Math.pow(2, -ie)) < 1 && (ie--, le *= 2), ie + g >= 1 ? O += l / le : O += l * Math.pow(2, 1 - g), O * le >= 2 && (ie++, le /= 2), ie + g >= b ? (ne = 0, ie = b) : ie + g >= 1 ? (ne = (O * le - 1) * Math.pow(2, V), ie = ie + g) : (ne = O * Math.pow(2, g - 1) * Math.pow(2, V), ie = 0)); V >= 8; S[D + _] = ne & 255, _ += A, ne /= 256, V -= 8)
        ;
      for (ie = ie << V | ne, Y += V; Y > 0; S[D + _] = ie & 255, _ += A, ie /= 256, Y -= 8)
        ;
      S[D + _ - A] |= q * 128;
    };
    (function(S) {
      const O = h, D = B, $ = typeof Symbol == "function" && typeof Symbol.for == "function" ? /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom") : null;
      S.Buffer = b, S.SlowBuffer = L, S.INSPECT_MAX_BYTES = 50;
      const V = 2147483647;
      S.kMaxLength = V;
      const { Uint8Array: J, ArrayBuffer: ie, SharedArrayBuffer: ne } = globalThis;
      b.TYPED_ARRAY_SUPPORT = le(), !b.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
      function le() {
        try {
          const W = new J(1), T = { foo: function() {
            return 42;
          } };
          return Object.setPrototypeOf(T, J.prototype), Object.setPrototypeOf(W, T), W.foo() === 42;
        } catch {
          return !1;
        }
      }
      Object.defineProperty(b.prototype, "parent", {
        enumerable: !0,
        get: function() {
          if (b.isBuffer(this))
            return this.buffer;
        }
      }), Object.defineProperty(b.prototype, "offset", {
        enumerable: !0,
        get: function() {
          if (b.isBuffer(this))
            return this.byteOffset;
        }
      });
      function Y(W) {
        if (W > V)
          throw new RangeError('The value "' + W + '" is invalid for option "size"');
        const T = new J(W);
        return Object.setPrototypeOf(T, b.prototype), T;
      }
      function b(W, T, k) {
        if (typeof W == "number") {
          if (typeof T == "string")
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          return A(W);
        }
        return g(W, T, k);
      }
      b.poolSize = 8192;
      function g(W, T, k) {
        if (typeof W == "string")
          return q(W, T);
        if (ie.isView(W))
          return R(W);
        if (W == null)
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof W
          );
        if (Ke(W, ie) || W && Ke(W.buffer, ie) || typeof ne < "u" && (Ke(W, ne) || W && Ke(W.buffer, ne)))
          return w(W, T, k);
        if (typeof W == "number")
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        const re = W.valueOf && W.valueOf();
        if (re != null && re !== W)
          return b.from(re, T, k);
        const ue = M(W);
        if (ue) return ue;
        if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof W[Symbol.toPrimitive] == "function")
          return b.from(W[Symbol.toPrimitive]("string"), T, k);
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof W
        );
      }
      b.from = function(W, T, k) {
        return g(W, T, k);
      }, Object.setPrototypeOf(b.prototype, J.prototype), Object.setPrototypeOf(b, J);
      function l(W) {
        if (typeof W != "number")
          throw new TypeError('"size" argument must be of type number');
        if (W < 0)
          throw new RangeError('The value "' + W + '" is invalid for option "size"');
      }
      function _(W, T, k) {
        return l(W), W <= 0 ? Y(W) : T !== void 0 ? typeof k == "string" ? Y(W).fill(T, k) : Y(W).fill(T) : Y(W);
      }
      b.alloc = function(W, T, k) {
        return _(W, T, k);
      };
      function A(W) {
        return l(W), Y(W < 0 ? 0 : x(W) | 0);
      }
      b.allocUnsafe = function(W) {
        return A(W);
      }, b.allocUnsafeSlow = function(W) {
        return A(W);
      };
      function q(W, T) {
        if ((typeof T != "string" || T === "") && (T = "utf8"), !b.isEncoding(T))
          throw new TypeError("Unknown encoding: " + T);
        const k = K(W, T) | 0;
        let re = Y(k);
        const ue = re.write(W, T);
        return ue !== k && (re = re.slice(0, ue)), re;
      }
      function P(W) {
        const T = W.length < 0 ? 0 : x(W.length) | 0, k = Y(T);
        for (let re = 0; re < T; re += 1)
          k[re] = W[re] & 255;
        return k;
      }
      function R(W) {
        if (Ke(W, J)) {
          const T = new J(W);
          return w(T.buffer, T.byteOffset, T.byteLength);
        }
        return P(W);
      }
      function w(W, T, k) {
        if (T < 0 || W.byteLength < T)
          throw new RangeError('"offset" is outside of buffer bounds');
        if (W.byteLength < T + (k || 0))
          throw new RangeError('"length" is outside of buffer bounds');
        let re;
        return T === void 0 && k === void 0 ? re = new J(W) : k === void 0 ? re = new J(W, T) : re = new J(W, T, k), Object.setPrototypeOf(re, b.prototype), re;
      }
      function M(W) {
        if (b.isBuffer(W)) {
          const T = x(W.length) | 0, k = Y(T);
          return k.length === 0 || W.copy(k, 0, 0, T), k;
        }
        if (W.length !== void 0)
          return typeof W.length != "number" || Ye(W.length) ? Y(0) : P(W);
        if (W.type === "Buffer" && Array.isArray(W.data))
          return P(W.data);
      }
      function x(W) {
        if (W >= V)
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + V.toString(16) + " bytes");
        return W | 0;
      }
      function L(W) {
        return +W != W && (W = 0), b.alloc(+W);
      }
      b.isBuffer = function(T) {
        return T != null && T._isBuffer === !0 && T !== b.prototype;
      }, b.compare = function(T, k) {
        if (Ke(T, J) && (T = b.from(T, T.offset, T.byteLength)), Ke(k, J) && (k = b.from(k, k.offset, k.byteLength)), !b.isBuffer(T) || !b.isBuffer(k))
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        if (T === k) return 0;
        let re = T.length, ue = k.length;
        for (let pe = 0, ye = Math.min(re, ue); pe < ye; ++pe)
          if (T[pe] !== k[pe]) {
            re = T[pe], ue = k[pe];
            break;
          }
        return re < ue ? -1 : ue < re ? 1 : 0;
      }, b.isEncoding = function(T) {
        switch (String(T).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return !0;
          default:
            return !1;
        }
      }, b.concat = function(T, k) {
        if (!Array.isArray(T))
          throw new TypeError('"list" argument must be an Array of Buffers');
        if (T.length === 0)
          return b.alloc(0);
        let re;
        if (k === void 0)
          for (k = 0, re = 0; re < T.length; ++re)
            k += T[re].length;
        const ue = b.allocUnsafe(k);
        let pe = 0;
        for (re = 0; re < T.length; ++re) {
          let ye = T[re];
          if (Ke(ye, J))
            pe + ye.length > ue.length ? (b.isBuffer(ye) || (ye = b.from(ye)), ye.copy(ue, pe)) : J.prototype.set.call(
              ue,
              ye,
              pe
            );
          else if (b.isBuffer(ye))
            ye.copy(ue, pe);
          else
            throw new TypeError('"list" argument must be an Array of Buffers');
          pe += ye.length;
        }
        return ue;
      };
      function K(W, T) {
        if (b.isBuffer(W))
          return W.length;
        if (ie.isView(W) || Ke(W, ie))
          return W.byteLength;
        if (typeof W != "string")
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof W
          );
        const k = W.length, re = arguments.length > 2 && arguments[2] === !0;
        if (!re && k === 0) return 0;
        let ue = !1;
        for (; ; )
          switch (T) {
            case "ascii":
            case "latin1":
            case "binary":
              return k;
            case "utf8":
            case "utf-8":
              return Le(W).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return k * 2;
            case "hex":
              return k >>> 1;
            case "base64":
              return $e(W).length;
            default:
              if (ue)
                return re ? -1 : Le(W).length;
              T = ("" + T).toLowerCase(), ue = !0;
          }
      }
      b.byteLength = K;
      function Q(W, T, k) {
        let re = !1;
        if ((T === void 0 || T < 0) && (T = 0), T > this.length || ((k === void 0 || k > this.length) && (k = this.length), k <= 0) || (k >>>= 0, T >>>= 0, k <= T))
          return "";
        for (W || (W = "utf8"); ; )
          switch (W) {
            case "hex":
              return Fe(this, T, k);
            case "utf8":
            case "utf-8":
              return xe(this, T, k);
            case "ascii":
              return Ae(this, T, k);
            case "latin1":
            case "binary":
              return be(this, T, k);
            case "base64":
              return me(this, T, k);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return qe(this, T, k);
            default:
              if (re) throw new TypeError("Unknown encoding: " + W);
              W = (W + "").toLowerCase(), re = !0;
          }
      }
      b.prototype._isBuffer = !0;
      function U(W, T, k) {
        const re = W[T];
        W[T] = W[k], W[k] = re;
      }
      b.prototype.swap16 = function() {
        const T = this.length;
        if (T % 2 !== 0)
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (let k = 0; k < T; k += 2)
          U(this, k, k + 1);
        return this;
      }, b.prototype.swap32 = function() {
        const T = this.length;
        if (T % 4 !== 0)
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (let k = 0; k < T; k += 4)
          U(this, k, k + 3), U(this, k + 1, k + 2);
        return this;
      }, b.prototype.swap64 = function() {
        const T = this.length;
        if (T % 8 !== 0)
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (let k = 0; k < T; k += 8)
          U(this, k, k + 7), U(this, k + 1, k + 6), U(this, k + 2, k + 5), U(this, k + 3, k + 4);
        return this;
      }, b.prototype.toString = function() {
        const T = this.length;
        return T === 0 ? "" : arguments.length === 0 ? xe(this, 0, T) : Q.apply(this, arguments);
      }, b.prototype.toLocaleString = b.prototype.toString, b.prototype.equals = function(T) {
        if (!b.isBuffer(T)) throw new TypeError("Argument must be a Buffer");
        return this === T ? !0 : b.compare(this, T) === 0;
      }, b.prototype.inspect = function() {
        let T = "";
        const k = S.INSPECT_MAX_BYTES;
        return T = this.toString("hex", 0, k).replace(/(.{2})/g, "$1 ").trim(), this.length > k && (T += " ... "), "<Buffer " + T + ">";
      }, $ && (b.prototype[$] = b.prototype.inspect), b.prototype.compare = function(T, k, re, ue, pe) {
        if (Ke(T, J) && (T = b.from(T, T.offset, T.byteLength)), !b.isBuffer(T))
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof T
          );
        if (k === void 0 && (k = 0), re === void 0 && (re = T ? T.length : 0), ue === void 0 && (ue = 0), pe === void 0 && (pe = this.length), k < 0 || re > T.length || ue < 0 || pe > this.length)
          throw new RangeError("out of range index");
        if (ue >= pe && k >= re)
          return 0;
        if (ue >= pe)
          return -1;
        if (k >= re)
          return 1;
        if (k >>>= 0, re >>>= 0, ue >>>= 0, pe >>>= 0, this === T) return 0;
        let ye = pe - ue, ke = re - k;
        const Ve = Math.min(ye, ke), Ne = this.slice(ue, pe), ze = T.slice(k, re);
        for (let je = 0; je < Ve; ++je)
          if (Ne[je] !== ze[je]) {
            ye = Ne[je], ke = ze[je];
            break;
          }
        return ye < ke ? -1 : ke < ye ? 1 : 0;
      };
      function N(W, T, k, re, ue) {
        if (W.length === 0) return -1;
        if (typeof k == "string" ? (re = k, k = 0) : k > 2147483647 ? k = 2147483647 : k < -2147483648 && (k = -2147483648), k = +k, Ye(k) && (k = ue ? 0 : W.length - 1), k < 0 && (k = W.length + k), k >= W.length) {
          if (ue) return -1;
          k = W.length - 1;
        } else if (k < 0)
          if (ue) k = 0;
          else return -1;
        if (typeof T == "string" && (T = b.from(T, re)), b.isBuffer(T))
          return T.length === 0 ? -1 : F(W, T, k, re, ue);
        if (typeof T == "number")
          return T = T & 255, typeof J.prototype.indexOf == "function" ? ue ? J.prototype.indexOf.call(W, T, k) : J.prototype.lastIndexOf.call(W, T, k) : F(W, [T], k, re, ue);
        throw new TypeError("val must be string, number or Buffer");
      }
      function F(W, T, k, re, ue) {
        let pe = 1, ye = W.length, ke = T.length;
        if (re !== void 0 && (re = String(re).toLowerCase(), re === "ucs2" || re === "ucs-2" || re === "utf16le" || re === "utf-16le")) {
          if (W.length < 2 || T.length < 2)
            return -1;
          pe = 2, ye /= 2, ke /= 2, k /= 2;
        }
        function Ve(ze, je) {
          return pe === 1 ? ze[je] : ze.readUInt16BE(je * pe);
        }
        let Ne;
        if (ue) {
          let ze = -1;
          for (Ne = k; Ne < ye; Ne++)
            if (Ve(W, Ne) === Ve(T, ze === -1 ? 0 : Ne - ze)) {
              if (ze === -1 && (ze = Ne), Ne - ze + 1 === ke) return ze * pe;
            } else
              ze !== -1 && (Ne -= Ne - ze), ze = -1;
        } else
          for (k + ke > ye && (k = ye - ke), Ne = k; Ne >= 0; Ne--) {
            let ze = !0;
            for (let je = 0; je < ke; je++)
              if (Ve(W, Ne + je) !== Ve(T, je)) {
                ze = !1;
                break;
              }
            if (ze) return Ne;
          }
        return -1;
      }
      b.prototype.includes = function(T, k, re) {
        return this.indexOf(T, k, re) !== -1;
      }, b.prototype.indexOf = function(T, k, re) {
        return N(this, T, k, re, !0);
      }, b.prototype.lastIndexOf = function(T, k, re) {
        return N(this, T, k, re, !1);
      };
      function ee(W, T, k, re) {
        k = Number(k) || 0;
        const ue = W.length - k;
        re ? (re = Number(re), re > ue && (re = ue)) : re = ue;
        const pe = T.length;
        re > pe / 2 && (re = pe / 2);
        let ye;
        for (ye = 0; ye < re; ++ye) {
          const ke = parseInt(T.substr(ye * 2, 2), 16);
          if (Ye(ke)) return ye;
          W[k + ye] = ke;
        }
        return ye;
      }
      function ae(W, T, k, re) {
        return He(Le(T, W.length - k), W, k, re);
      }
      function G(W, T, k, re) {
        return He(Ie(T), W, k, re);
      }
      function z(W, T, k, re) {
        return He($e(T), W, k, re);
      }
      function fe(W, T, k, re) {
        return He(Ue(T, W.length - k), W, k, re);
      }
      b.prototype.write = function(T, k, re, ue) {
        if (k === void 0)
          ue = "utf8", re = this.length, k = 0;
        else if (re === void 0 && typeof k == "string")
          ue = k, re = this.length, k = 0;
        else if (isFinite(k))
          k = k >>> 0, isFinite(re) ? (re = re >>> 0, ue === void 0 && (ue = "utf8")) : (ue = re, re = void 0);
        else
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        const pe = this.length - k;
        if ((re === void 0 || re > pe) && (re = pe), T.length > 0 && (re < 0 || k < 0) || k > this.length)
          throw new RangeError("Attempt to write outside buffer bounds");
        ue || (ue = "utf8");
        let ye = !1;
        for (; ; )
          switch (ue) {
            case "hex":
              return ee(this, T, k, re);
            case "utf8":
            case "utf-8":
              return ae(this, T, k, re);
            case "ascii":
            case "latin1":
            case "binary":
              return G(this, T, k, re);
            case "base64":
              return z(this, T, k, re);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return fe(this, T, k, re);
            default:
              if (ye) throw new TypeError("Unknown encoding: " + ue);
              ue = ("" + ue).toLowerCase(), ye = !0;
          }
      }, b.prototype.toJSON = function() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function me(W, T, k) {
        return T === 0 && k === W.length ? O.fromByteArray(W) : O.fromByteArray(W.slice(T, k));
      }
      function xe(W, T, k) {
        k = Math.min(W.length, k);
        const re = [];
        let ue = T;
        for (; ue < k; ) {
          const pe = W[ue];
          let ye = null, ke = pe > 239 ? 4 : pe > 223 ? 3 : pe > 191 ? 2 : 1;
          if (ue + ke <= k) {
            let Ve, Ne, ze, je;
            switch (ke) {
              case 1:
                pe < 128 && (ye = pe);
                break;
              case 2:
                Ve = W[ue + 1], (Ve & 192) === 128 && (je = (pe & 31) << 6 | Ve & 63, je > 127 && (ye = je));
                break;
              case 3:
                Ve = W[ue + 1], Ne = W[ue + 2], (Ve & 192) === 128 && (Ne & 192) === 128 && (je = (pe & 15) << 12 | (Ve & 63) << 6 | Ne & 63, je > 2047 && (je < 55296 || je > 57343) && (ye = je));
                break;
              case 4:
                Ve = W[ue + 1], Ne = W[ue + 2], ze = W[ue + 3], (Ve & 192) === 128 && (Ne & 192) === 128 && (ze & 192) === 128 && (je = (pe & 15) << 18 | (Ve & 63) << 12 | (Ne & 63) << 6 | ze & 63, je > 65535 && je < 1114112 && (ye = je));
            }
          }
          ye === null ? (ye = 65533, ke = 1) : ye > 65535 && (ye -= 65536, re.push(ye >>> 10 & 1023 | 55296), ye = 56320 | ye & 1023), re.push(ye), ue += ke;
        }
        return Be(re);
      }
      const _e = 4096;
      function Be(W) {
        const T = W.length;
        if (T <= _e)
          return String.fromCharCode.apply(String, W);
        let k = "", re = 0;
        for (; re < T; )
          k += String.fromCharCode.apply(
            String,
            W.slice(re, re += _e)
          );
        return k;
      }
      function Ae(W, T, k) {
        let re = "";
        k = Math.min(W.length, k);
        for (let ue = T; ue < k; ++ue)
          re += String.fromCharCode(W[ue] & 127);
        return re;
      }
      function be(W, T, k) {
        let re = "";
        k = Math.min(W.length, k);
        for (let ue = T; ue < k; ++ue)
          re += String.fromCharCode(W[ue]);
        return re;
      }
      function Fe(W, T, k) {
        const re = W.length;
        (!T || T < 0) && (T = 0), (!k || k < 0 || k > re) && (k = re);
        let ue = "";
        for (let pe = T; pe < k; ++pe)
          ue += We[W[pe]];
        return ue;
      }
      function qe(W, T, k) {
        const re = W.slice(T, k);
        let ue = "";
        for (let pe = 0; pe < re.length - 1; pe += 2)
          ue += String.fromCharCode(re[pe] + re[pe + 1] * 256);
        return ue;
      }
      b.prototype.slice = function(T, k) {
        const re = this.length;
        T = ~~T, k = k === void 0 ? re : ~~k, T < 0 ? (T += re, T < 0 && (T = 0)) : T > re && (T = re), k < 0 ? (k += re, k < 0 && (k = 0)) : k > re && (k = re), k < T && (k = T);
        const ue = this.subarray(T, k);
        return Object.setPrototypeOf(ue, b.prototype), ue;
      };
      function Me(W, T, k) {
        if (W % 1 !== 0 || W < 0) throw new RangeError("offset is not uint");
        if (W + T > k) throw new RangeError("Trying to access beyond buffer length");
      }
      b.prototype.readUintLE = b.prototype.readUIntLE = function(T, k, re) {
        T = T >>> 0, k = k >>> 0, re || Me(T, k, this.length);
        let ue = this[T], pe = 1, ye = 0;
        for (; ++ye < k && (pe *= 256); )
          ue += this[T + ye] * pe;
        return ue;
      }, b.prototype.readUintBE = b.prototype.readUIntBE = function(T, k, re) {
        T = T >>> 0, k = k >>> 0, re || Me(T, k, this.length);
        let ue = this[T + --k], pe = 1;
        for (; k > 0 && (pe *= 256); )
          ue += this[T + --k] * pe;
        return ue;
      }, b.prototype.readUint8 = b.prototype.readUInt8 = function(T, k) {
        return T = T >>> 0, k || Me(T, 1, this.length), this[T];
      }, b.prototype.readUint16LE = b.prototype.readUInt16LE = function(T, k) {
        return T = T >>> 0, k || Me(T, 2, this.length), this[T] | this[T + 1] << 8;
      }, b.prototype.readUint16BE = b.prototype.readUInt16BE = function(T, k) {
        return T = T >>> 0, k || Me(T, 2, this.length), this[T] << 8 | this[T + 1];
      }, b.prototype.readUint32LE = b.prototype.readUInt32LE = function(T, k) {
        return T = T >>> 0, k || Me(T, 4, this.length), (this[T] | this[T + 1] << 8 | this[T + 2] << 16) + this[T + 3] * 16777216;
      }, b.prototype.readUint32BE = b.prototype.readUInt32BE = function(T, k) {
        return T = T >>> 0, k || Me(T, 4, this.length), this[T] * 16777216 + (this[T + 1] << 16 | this[T + 2] << 8 | this[T + 3]);
      }, b.prototype.readBigUInt64LE = Ze(function(T) {
        T = T >>> 0, se(T, "offset");
        const k = this[T], re = this[T + 7];
        (k === void 0 || re === void 0) && de(T, this.length - 8);
        const ue = k + this[++T] * 2 ** 8 + this[++T] * 2 ** 16 + this[++T] * 2 ** 24, pe = this[++T] + this[++T] * 2 ** 8 + this[++T] * 2 ** 16 + re * 2 ** 24;
        return BigInt(ue) + (BigInt(pe) << BigInt(32));
      }), b.prototype.readBigUInt64BE = Ze(function(T) {
        T = T >>> 0, se(T, "offset");
        const k = this[T], re = this[T + 7];
        (k === void 0 || re === void 0) && de(T, this.length - 8);
        const ue = k * 2 ** 24 + this[++T] * 2 ** 16 + this[++T] * 2 ** 8 + this[++T], pe = this[++T] * 2 ** 24 + this[++T] * 2 ** 16 + this[++T] * 2 ** 8 + re;
        return (BigInt(ue) << BigInt(32)) + BigInt(pe);
      }), b.prototype.readIntLE = function(T, k, re) {
        T = T >>> 0, k = k >>> 0, re || Me(T, k, this.length);
        let ue = this[T], pe = 1, ye = 0;
        for (; ++ye < k && (pe *= 256); )
          ue += this[T + ye] * pe;
        return pe *= 128, ue >= pe && (ue -= Math.pow(2, 8 * k)), ue;
      }, b.prototype.readIntBE = function(T, k, re) {
        T = T >>> 0, k = k >>> 0, re || Me(T, k, this.length);
        let ue = k, pe = 1, ye = this[T + --ue];
        for (; ue > 0 && (pe *= 256); )
          ye += this[T + --ue] * pe;
        return pe *= 128, ye >= pe && (ye -= Math.pow(2, 8 * k)), ye;
      }, b.prototype.readInt8 = function(T, k) {
        return T = T >>> 0, k || Me(T, 1, this.length), this[T] & 128 ? (255 - this[T] + 1) * -1 : this[T];
      }, b.prototype.readInt16LE = function(T, k) {
        T = T >>> 0, k || Me(T, 2, this.length);
        const re = this[T] | this[T + 1] << 8;
        return re & 32768 ? re | 4294901760 : re;
      }, b.prototype.readInt16BE = function(T, k) {
        T = T >>> 0, k || Me(T, 2, this.length);
        const re = this[T + 1] | this[T] << 8;
        return re & 32768 ? re | 4294901760 : re;
      }, b.prototype.readInt32LE = function(T, k) {
        return T = T >>> 0, k || Me(T, 4, this.length), this[T] | this[T + 1] << 8 | this[T + 2] << 16 | this[T + 3] << 24;
      }, b.prototype.readInt32BE = function(T, k) {
        return T = T >>> 0, k || Me(T, 4, this.length), this[T] << 24 | this[T + 1] << 16 | this[T + 2] << 8 | this[T + 3];
      }, b.prototype.readBigInt64LE = Ze(function(T) {
        T = T >>> 0, se(T, "offset");
        const k = this[T], re = this[T + 7];
        (k === void 0 || re === void 0) && de(T, this.length - 8);
        const ue = this[T + 4] + this[T + 5] * 2 ** 8 + this[T + 6] * 2 ** 16 + (re << 24);
        return (BigInt(ue) << BigInt(32)) + BigInt(k + this[++T] * 2 ** 8 + this[++T] * 2 ** 16 + this[++T] * 2 ** 24);
      }), b.prototype.readBigInt64BE = Ze(function(T) {
        T = T >>> 0, se(T, "offset");
        const k = this[T], re = this[T + 7];
        (k === void 0 || re === void 0) && de(T, this.length - 8);
        const ue = (k << 24) + // Overflow
        this[++T] * 2 ** 16 + this[++T] * 2 ** 8 + this[++T];
        return (BigInt(ue) << BigInt(32)) + BigInt(this[++T] * 2 ** 24 + this[++T] * 2 ** 16 + this[++T] * 2 ** 8 + re);
      }), b.prototype.readFloatLE = function(T, k) {
        return T = T >>> 0, k || Me(T, 4, this.length), D.read(this, T, !0, 23, 4);
      }, b.prototype.readFloatBE = function(T, k) {
        return T = T >>> 0, k || Me(T, 4, this.length), D.read(this, T, !1, 23, 4);
      }, b.prototype.readDoubleLE = function(T, k) {
        return T = T >>> 0, k || Me(T, 8, this.length), D.read(this, T, !0, 52, 8);
      }, b.prototype.readDoubleBE = function(T, k) {
        return T = T >>> 0, k || Me(T, 8, this.length), D.read(this, T, !1, 52, 8);
      };
      function Te(W, T, k, re, ue, pe) {
        if (!b.isBuffer(W)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (T > ue || T < pe) throw new RangeError('"value" argument is out of bounds');
        if (k + re > W.length) throw new RangeError("Index out of range");
      }
      b.prototype.writeUintLE = b.prototype.writeUIntLE = function(T, k, re, ue) {
        if (T = +T, k = k >>> 0, re = re >>> 0, !ue) {
          const ke = Math.pow(2, 8 * re) - 1;
          Te(this, T, k, re, ke, 0);
        }
        let pe = 1, ye = 0;
        for (this[k] = T & 255; ++ye < re && (pe *= 256); )
          this[k + ye] = T / pe & 255;
        return k + re;
      }, b.prototype.writeUintBE = b.prototype.writeUIntBE = function(T, k, re, ue) {
        if (T = +T, k = k >>> 0, re = re >>> 0, !ue) {
          const ke = Math.pow(2, 8 * re) - 1;
          Te(this, T, k, re, ke, 0);
        }
        let pe = re - 1, ye = 1;
        for (this[k + pe] = T & 255; --pe >= 0 && (ye *= 256); )
          this[k + pe] = T / ye & 255;
        return k + re;
      }, b.prototype.writeUint8 = b.prototype.writeUInt8 = function(T, k, re) {
        return T = +T, k = k >>> 0, re || Te(this, T, k, 1, 255, 0), this[k] = T & 255, k + 1;
      }, b.prototype.writeUint16LE = b.prototype.writeUInt16LE = function(T, k, re) {
        return T = +T, k = k >>> 0, re || Te(this, T, k, 2, 65535, 0), this[k] = T & 255, this[k + 1] = T >>> 8, k + 2;
      }, b.prototype.writeUint16BE = b.prototype.writeUInt16BE = function(T, k, re) {
        return T = +T, k = k >>> 0, re || Te(this, T, k, 2, 65535, 0), this[k] = T >>> 8, this[k + 1] = T & 255, k + 2;
      }, b.prototype.writeUint32LE = b.prototype.writeUInt32LE = function(T, k, re) {
        return T = +T, k = k >>> 0, re || Te(this, T, k, 4, 4294967295, 0), this[k + 3] = T >>> 24, this[k + 2] = T >>> 16, this[k + 1] = T >>> 8, this[k] = T & 255, k + 4;
      }, b.prototype.writeUint32BE = b.prototype.writeUInt32BE = function(T, k, re) {
        return T = +T, k = k >>> 0, re || Te(this, T, k, 4, 4294967295, 0), this[k] = T >>> 24, this[k + 1] = T >>> 16, this[k + 2] = T >>> 8, this[k + 3] = T & 255, k + 4;
      };
      function oe(W, T, k, re, ue) {
        X(T, re, ue, W, k, 7);
        let pe = Number(T & BigInt(4294967295));
        W[k++] = pe, pe = pe >> 8, W[k++] = pe, pe = pe >> 8, W[k++] = pe, pe = pe >> 8, W[k++] = pe;
        let ye = Number(T >> BigInt(32) & BigInt(4294967295));
        return W[k++] = ye, ye = ye >> 8, W[k++] = ye, ye = ye >> 8, W[k++] = ye, ye = ye >> 8, W[k++] = ye, k;
      }
      function ce(W, T, k, re, ue) {
        X(T, re, ue, W, k, 7);
        let pe = Number(T & BigInt(4294967295));
        W[k + 7] = pe, pe = pe >> 8, W[k + 6] = pe, pe = pe >> 8, W[k + 5] = pe, pe = pe >> 8, W[k + 4] = pe;
        let ye = Number(T >> BigInt(32) & BigInt(4294967295));
        return W[k + 3] = ye, ye = ye >> 8, W[k + 2] = ye, ye = ye >> 8, W[k + 1] = ye, ye = ye >> 8, W[k] = ye, k + 8;
      }
      b.prototype.writeBigUInt64LE = Ze(function(T, k = 0) {
        return oe(this, T, k, BigInt(0), BigInt("0xffffffffffffffff"));
      }), b.prototype.writeBigUInt64BE = Ze(function(T, k = 0) {
        return ce(this, T, k, BigInt(0), BigInt("0xffffffffffffffff"));
      }), b.prototype.writeIntLE = function(T, k, re, ue) {
        if (T = +T, k = k >>> 0, !ue) {
          const Ve = Math.pow(2, 8 * re - 1);
          Te(this, T, k, re, Ve - 1, -Ve);
        }
        let pe = 0, ye = 1, ke = 0;
        for (this[k] = T & 255; ++pe < re && (ye *= 256); )
          T < 0 && ke === 0 && this[k + pe - 1] !== 0 && (ke = 1), this[k + pe] = (T / ye >> 0) - ke & 255;
        return k + re;
      }, b.prototype.writeIntBE = function(T, k, re, ue) {
        if (T = +T, k = k >>> 0, !ue) {
          const Ve = Math.pow(2, 8 * re - 1);
          Te(this, T, k, re, Ve - 1, -Ve);
        }
        let pe = re - 1, ye = 1, ke = 0;
        for (this[k + pe] = T & 255; --pe >= 0 && (ye *= 256); )
          T < 0 && ke === 0 && this[k + pe + 1] !== 0 && (ke = 1), this[k + pe] = (T / ye >> 0) - ke & 255;
        return k + re;
      }, b.prototype.writeInt8 = function(T, k, re) {
        return T = +T, k = k >>> 0, re || Te(this, T, k, 1, 127, -128), T < 0 && (T = 255 + T + 1), this[k] = T & 255, k + 1;
      }, b.prototype.writeInt16LE = function(T, k, re) {
        return T = +T, k = k >>> 0, re || Te(this, T, k, 2, 32767, -32768), this[k] = T & 255, this[k + 1] = T >>> 8, k + 2;
      }, b.prototype.writeInt16BE = function(T, k, re) {
        return T = +T, k = k >>> 0, re || Te(this, T, k, 2, 32767, -32768), this[k] = T >>> 8, this[k + 1] = T & 255, k + 2;
      }, b.prototype.writeInt32LE = function(T, k, re) {
        return T = +T, k = k >>> 0, re || Te(this, T, k, 4, 2147483647, -2147483648), this[k] = T & 255, this[k + 1] = T >>> 8, this[k + 2] = T >>> 16, this[k + 3] = T >>> 24, k + 4;
      }, b.prototype.writeInt32BE = function(T, k, re) {
        return T = +T, k = k >>> 0, re || Te(this, T, k, 4, 2147483647, -2147483648), T < 0 && (T = 4294967295 + T + 1), this[k] = T >>> 24, this[k + 1] = T >>> 16, this[k + 2] = T >>> 8, this[k + 3] = T & 255, k + 4;
      }, b.prototype.writeBigInt64LE = Ze(function(T, k = 0) {
        return oe(this, T, k, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      }), b.prototype.writeBigInt64BE = Ze(function(T, k = 0) {
        return ce(this, T, k, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function ge(W, T, k, re, ue, pe) {
        if (k + re > W.length) throw new RangeError("Index out of range");
        if (k < 0) throw new RangeError("Index out of range");
      }
      function we(W, T, k, re, ue) {
        return T = +T, k = k >>> 0, ue || ge(W, T, k, 4), D.write(W, T, k, re, 23, 4), k + 4;
      }
      b.prototype.writeFloatLE = function(T, k, re) {
        return we(this, T, k, !0, re);
      }, b.prototype.writeFloatBE = function(T, k, re) {
        return we(this, T, k, !1, re);
      };
      function Se(W, T, k, re, ue) {
        return T = +T, k = k >>> 0, ue || ge(W, T, k, 8), D.write(W, T, k, re, 52, 8), k + 8;
      }
      b.prototype.writeDoubleLE = function(T, k, re) {
        return Se(this, T, k, !0, re);
      }, b.prototype.writeDoubleBE = function(T, k, re) {
        return Se(this, T, k, !1, re);
      }, b.prototype.copy = function(T, k, re, ue) {
        if (!b.isBuffer(T)) throw new TypeError("argument should be a Buffer");
        if (re || (re = 0), !ue && ue !== 0 && (ue = this.length), k >= T.length && (k = T.length), k || (k = 0), ue > 0 && ue < re && (ue = re), ue === re || T.length === 0 || this.length === 0) return 0;
        if (k < 0)
          throw new RangeError("targetStart out of bounds");
        if (re < 0 || re >= this.length) throw new RangeError("Index out of range");
        if (ue < 0) throw new RangeError("sourceEnd out of bounds");
        ue > this.length && (ue = this.length), T.length - k < ue - re && (ue = T.length - k + re);
        const pe = ue - re;
        return this === T && typeof J.prototype.copyWithin == "function" ? this.copyWithin(k, re, ue) : J.prototype.set.call(
          T,
          this.subarray(re, ue),
          k
        ), pe;
      }, b.prototype.fill = function(T, k, re, ue) {
        if (typeof T == "string") {
          if (typeof k == "string" ? (ue = k, k = 0, re = this.length) : typeof re == "string" && (ue = re, re = this.length), ue !== void 0 && typeof ue != "string")
            throw new TypeError("encoding must be a string");
          if (typeof ue == "string" && !b.isEncoding(ue))
            throw new TypeError("Unknown encoding: " + ue);
          if (T.length === 1) {
            const ye = T.charCodeAt(0);
            (ue === "utf8" && ye < 128 || ue === "latin1") && (T = ye);
          }
        } else typeof T == "number" ? T = T & 255 : typeof T == "boolean" && (T = Number(T));
        if (k < 0 || this.length < k || this.length < re)
          throw new RangeError("Out of range index");
        if (re <= k)
          return this;
        k = k >>> 0, re = re === void 0 ? this.length : re >>> 0, T || (T = 0);
        let pe;
        if (typeof T == "number")
          for (pe = k; pe < re; ++pe)
            this[pe] = T;
        else {
          const ye = b.isBuffer(T) ? T : b.from(T, ue), ke = ye.length;
          if (ke === 0)
            throw new TypeError('The value "' + T + '" is invalid for argument "value"');
          for (pe = 0; pe < re - k; ++pe)
            this[pe + k] = ye[pe % ke];
        }
        return this;
      };
      const Oe = {};
      function j(W, T, k) {
        Oe[W] = class extends k {
          constructor() {
            super(), Object.defineProperty(this, "message", {
              value: T.apply(this, arguments),
              writable: !0,
              configurable: !0
            }), this.name = `${this.name} [${W}]`, this.stack, delete this.name;
          }
          get code() {
            return W;
          }
          set code(ue) {
            Object.defineProperty(this, "code", {
              configurable: !0,
              enumerable: !0,
              value: ue,
              writable: !0
            });
          }
          toString() {
            return `${this.name} [${W}]: ${this.message}`;
          }
        };
      }
      j(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(W) {
          return W ? `${W} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
        },
        RangeError
      ), j(
        "ERR_INVALID_ARG_TYPE",
        function(W, T) {
          return `The "${W}" argument must be of type number. Received type ${typeof T}`;
        },
        TypeError
      ), j(
        "ERR_OUT_OF_RANGE",
        function(W, T, k) {
          let re = `The value of "${W}" is out of range.`, ue = k;
          return Number.isInteger(k) && Math.abs(k) > 2 ** 32 ? ue = I(String(k)) : typeof k == "bigint" && (ue = String(k), (k > BigInt(2) ** BigInt(32) || k < -(BigInt(2) ** BigInt(32))) && (ue = I(ue)), ue += "n"), re += ` It must be ${T}. Received ${ue}`, re;
        },
        RangeError
      );
      function I(W) {
        let T = "", k = W.length;
        const re = W[0] === "-" ? 1 : 0;
        for (; k >= re + 4; k -= 3)
          T = `_${W.slice(k - 3, k)}${T}`;
        return `${W.slice(0, k)}${T}`;
      }
      function C(W, T, k) {
        se(T, "offset"), (W[T] === void 0 || W[T + k] === void 0) && de(T, W.length - (k + 1));
      }
      function X(W, T, k, re, ue, pe) {
        if (W > k || W < T) {
          const ye = typeof T == "bigint" ? "n" : "";
          let ke;
          throw T === 0 || T === BigInt(0) ? ke = `>= 0${ye} and < 2${ye} ** ${(pe + 1) * 8}${ye}` : ke = `>= -(2${ye} ** ${(pe + 1) * 8 - 1}${ye}) and < 2 ** ${(pe + 1) * 8 - 1}${ye}`, new Oe.ERR_OUT_OF_RANGE("value", ke, W);
        }
        C(re, ue, pe);
      }
      function se(W, T) {
        if (typeof W != "number")
          throw new Oe.ERR_INVALID_ARG_TYPE(T, "number", W);
      }
      function de(W, T, k) {
        throw Math.floor(W) !== W ? (se(W, k), new Oe.ERR_OUT_OF_RANGE("offset", "an integer", W)) : T < 0 ? new Oe.ERR_BUFFER_OUT_OF_BOUNDS() : new Oe.ERR_OUT_OF_RANGE(
          "offset",
          `>= 0 and <= ${T}`,
          W
        );
      }
      const ve = /[^+/0-9A-Za-z-_]/g;
      function Ce(W) {
        if (W = W.split("=")[0], W = W.trim().replace(ve, ""), W.length < 2) return "";
        for (; W.length % 4 !== 0; )
          W = W + "=";
        return W;
      }
      function Le(W, T) {
        T = T || 1 / 0;
        let k;
        const re = W.length;
        let ue = null;
        const pe = [];
        for (let ye = 0; ye < re; ++ye) {
          if (k = W.charCodeAt(ye), k > 55295 && k < 57344) {
            if (!ue) {
              if (k > 56319) {
                (T -= 3) > -1 && pe.push(239, 191, 189);
                continue;
              } else if (ye + 1 === re) {
                (T -= 3) > -1 && pe.push(239, 191, 189);
                continue;
              }
              ue = k;
              continue;
            }
            if (k < 56320) {
              (T -= 3) > -1 && pe.push(239, 191, 189), ue = k;
              continue;
            }
            k = (ue - 55296 << 10 | k - 56320) + 65536;
          } else ue && (T -= 3) > -1 && pe.push(239, 191, 189);
          if (ue = null, k < 128) {
            if ((T -= 1) < 0) break;
            pe.push(k);
          } else if (k < 2048) {
            if ((T -= 2) < 0) break;
            pe.push(
              k >> 6 | 192,
              k & 63 | 128
            );
          } else if (k < 65536) {
            if ((T -= 3) < 0) break;
            pe.push(
              k >> 12 | 224,
              k >> 6 & 63 | 128,
              k & 63 | 128
            );
          } else if (k < 1114112) {
            if ((T -= 4) < 0) break;
            pe.push(
              k >> 18 | 240,
              k >> 12 & 63 | 128,
              k >> 6 & 63 | 128,
              k & 63 | 128
            );
          } else
            throw new Error("Invalid code point");
        }
        return pe;
      }
      function Ie(W) {
        const T = [];
        for (let k = 0; k < W.length; ++k)
          T.push(W.charCodeAt(k) & 255);
        return T;
      }
      function Ue(W, T) {
        let k, re, ue;
        const pe = [];
        for (let ye = 0; ye < W.length && !((T -= 2) < 0); ++ye)
          k = W.charCodeAt(ye), re = k >> 8, ue = k % 256, pe.push(ue), pe.push(re);
        return pe;
      }
      function $e(W) {
        return O.toByteArray(Ce(W));
      }
      function He(W, T, k, re) {
        let ue;
        for (ue = 0; ue < re && !(ue + k >= T.length || ue >= W.length); ++ue)
          T[ue + k] = W[ue];
        return ue;
      }
      function Ke(W, T) {
        return W instanceof T || W != null && W.constructor != null && W.constructor.name != null && W.constructor.name === T.name;
      }
      function Ye(W) {
        return W !== W;
      }
      const We = (function() {
        const W = "0123456789abcdef", T = new Array(256);
        for (let k = 0; k < 16; ++k) {
          const re = k * 16;
          for (let ue = 0; ue < 16; ++ue)
            T[re + ue] = W[k] + W[ue];
        }
        return T;
      })();
      function Ze(W) {
        return typeof BigInt > "u" ? Xe : W;
      }
      function Xe() {
        throw new Error("BigInt not supported");
      }
    })(a);
    const E = a.Buffer;
    c.Blob = a.Blob, c.BlobOptions = a.BlobOptions, c.Buffer = a.Buffer, c.File = a.File, c.FileOptions = a.FileOptions, c.INSPECT_MAX_BYTES = a.INSPECT_MAX_BYTES, c.SlowBuffer = a.SlowBuffer, c.TranscodeEncoding = a.TranscodeEncoding, c.atob = a.atob, c.btoa = a.btoa, c.constants = a.constants, c.default = E, c.isAscii = a.isAscii, c.isUtf8 = a.isUtf8, c.kMaxLength = a.kMaxLength, c.kStringMaxLength = a.kStringMaxLength, c.resolveObjectURL = a.resolveObjectURL, c.transcode = a.transcode;
  })(dist)), dist;
}
var hasRequiredSafeBuffer$1;
function requireSafeBuffer$1() {
  return hasRequiredSafeBuffer$1 || (hasRequiredSafeBuffer$1 = 1, (function(c, a) {
    var h = requireDist(), f = h.Buffer;
    function p(u, o) {
      for (var t in u)
        o[t] = u[t];
    }
    f.from && f.alloc && f.allocUnsafe && f.allocUnsafeSlow ? c.exports = h : (p(h, a), a.Buffer = r);
    function r(u, o, t) {
      return f(u, o, t);
    }
    r.prototype = Object.create(f.prototype), p(f, r), r.from = function(u, o, t) {
      if (typeof u == "number")
        throw new TypeError("Argument must not be a number");
      return f(u, o, t);
    }, r.alloc = function(u, o, t) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      var n = f(u);
      return o !== void 0 ? typeof t == "string" ? n.fill(o, t) : n.fill(o) : n.fill(0), n;
    }, r.allocUnsafe = function(u) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      return f(u);
    }, r.allocUnsafeSlow = function(u) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      return h.SlowBuffer(u);
    };
  })(safeBuffer$1, safeBuffer$1.exports)), safeBuffer$1.exports;
}
var hasRequiredBrowser$b;
function requireBrowser$b() {
  if (hasRequiredBrowser$b) return browser$b.exports;
  hasRequiredBrowser$b = 1;
  var c = 65536, a = 4294967295;
  function h() {
    throw new Error(`Secure random number generation is not supported by this browser.
Use Chrome, Firefox or Internet Explorer 11`);
  }
  var f = requireSafeBuffer$1().Buffer, p = commonjsGlobal.crypto || commonjsGlobal.msCrypto;
  p && p.getRandomValues ? browser$b.exports = r : browser$b.exports = h;
  function r(u, o) {
    if (u > a) throw new RangeError("requested too many random bytes");
    var t = f.allocUnsafe(u);
    if (u > 0)
      if (u > c)
        for (var n = 0; n < u; n += c)
          p.getRandomValues(t.slice(n, n + c));
      else
        p.getRandomValues(t);
    return typeof o == "function" ? process$1.nextTick(function() {
      o(null, t);
    }) : t;
  }
  return browser$b.exports;
}
var inherits_browser = { exports: {} }, hasRequiredInherits_browser;
function requireInherits_browser() {
  return hasRequiredInherits_browser || (hasRequiredInherits_browser = 1, typeof Object.create == "function" ? inherits_browser.exports = function(a, h) {
    h && (a.super_ = h, a.prototype = Object.create(h.prototype, {
      constructor: {
        value: a,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }));
  } : inherits_browser.exports = function(a, h) {
    if (h) {
      a.super_ = h;
      var f = function() {
      };
      f.prototype = h.prototype, a.prototype = new f(), a.prototype.constructor = a;
    }
  }), inherits_browser.exports;
}
var events = { exports: {} }, hasRequiredEvents;
function requireEvents() {
  if (hasRequiredEvents) return events.exports;
  hasRequiredEvents = 1;
  var c = typeof Reflect == "object" ? Reflect : null, a = c && typeof c.apply == "function" ? c.apply : function($, V, J) {
    return Function.prototype.apply.call($, V, J);
  }, h;
  c && typeof c.ownKeys == "function" ? h = c.ownKeys : Object.getOwnPropertySymbols ? h = function($) {
    return Object.getOwnPropertyNames($).concat(Object.getOwnPropertySymbols($));
  } : h = function($) {
    return Object.getOwnPropertyNames($);
  };
  function f(D) {
    console && console.warn && console.warn(D);
  }
  var p = Number.isNaN || function($) {
    return $ !== $;
  };
  function r() {
    r.init.call(this);
  }
  events.exports = r, events.exports.once = E, r.EventEmitter = r, r.prototype._events = void 0, r.prototype._eventsCount = 0, r.prototype._maxListeners = void 0;
  var u = 10;
  function o(D) {
    if (typeof D != "function")
      throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof D);
  }
  Object.defineProperty(r, "defaultMaxListeners", {
    enumerable: !0,
    get: function() {
      return u;
    },
    set: function(D) {
      if (typeof D != "number" || D < 0 || p(D))
        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + D + ".");
      u = D;
    }
  }), r.init = function() {
    (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
  }, r.prototype.setMaxListeners = function($) {
    if (typeof $ != "number" || $ < 0 || p($))
      throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + $ + ".");
    return this._maxListeners = $, this;
  };
  function t(D) {
    return D._maxListeners === void 0 ? r.defaultMaxListeners : D._maxListeners;
  }
  r.prototype.getMaxListeners = function() {
    return t(this);
  }, r.prototype.emit = function($) {
    for (var V = [], J = 1; J < arguments.length; J++) V.push(arguments[J]);
    var ie = $ === "error", ne = this._events;
    if (ne !== void 0)
      ie = ie && ne.error === void 0;
    else if (!ie)
      return !1;
    if (ie) {
      var le;
      if (V.length > 0 && (le = V[0]), le instanceof Error)
        throw le;
      var Y = new Error("Unhandled error." + (le ? " (" + le.message + ")" : ""));
      throw Y.context = le, Y;
    }
    var b = ne[$];
    if (b === void 0)
      return !1;
    if (typeof b == "function")
      a(b, this, V);
    else
      for (var g = b.length, l = y(b, g), J = 0; J < g; ++J)
        a(l[J], this, V);
    return !0;
  };
  function n(D, $, V, J) {
    var ie, ne, le;
    if (o(V), ne = D._events, ne === void 0 ? (ne = D._events = /* @__PURE__ */ Object.create(null), D._eventsCount = 0) : (ne.newListener !== void 0 && (D.emit(
      "newListener",
      $,
      V.listener ? V.listener : V
    ), ne = D._events), le = ne[$]), le === void 0)
      le = ne[$] = V, ++D._eventsCount;
    else if (typeof le == "function" ? le = ne[$] = J ? [V, le] : [le, V] : J ? le.unshift(V) : le.push(V), ie = t(D), ie > 0 && le.length > ie && !le.warned) {
      le.warned = !0;
      var Y = new Error("Possible EventEmitter memory leak detected. " + le.length + " " + String($) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      Y.name = "MaxListenersExceededWarning", Y.emitter = D, Y.type = $, Y.count = le.length, f(Y);
    }
    return D;
  }
  r.prototype.addListener = function($, V) {
    return n(this, $, V, !1);
  }, r.prototype.on = r.prototype.addListener, r.prototype.prependListener = function($, V) {
    return n(this, $, V, !0);
  };
  function e() {
    if (!this.fired)
      return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
  }
  function s(D, $, V) {
    var J = { fired: !1, wrapFn: void 0, target: D, type: $, listener: V }, ie = e.bind(J);
    return ie.listener = V, J.wrapFn = ie, ie;
  }
  r.prototype.once = function($, V) {
    return o(V), this.on($, s(this, $, V)), this;
  }, r.prototype.prependOnceListener = function($, V) {
    return o(V), this.prependListener($, s(this, $, V)), this;
  }, r.prototype.removeListener = function($, V) {
    var J, ie, ne, le, Y;
    if (o(V), ie = this._events, ie === void 0)
      return this;
    if (J = ie[$], J === void 0)
      return this;
    if (J === V || J.listener === V)
      --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete ie[$], ie.removeListener && this.emit("removeListener", $, J.listener || V));
    else if (typeof J != "function") {
      for (ne = -1, le = J.length - 1; le >= 0; le--)
        if (J[le] === V || J[le].listener === V) {
          Y = J[le].listener, ne = le;
          break;
        }
      if (ne < 0)
        return this;
      ne === 0 ? J.shift() : m(J, ne), J.length === 1 && (ie[$] = J[0]), ie.removeListener !== void 0 && this.emit("removeListener", $, Y || V);
    }
    return this;
  }, r.prototype.off = r.prototype.removeListener, r.prototype.removeAllListeners = function($) {
    var V, J, ie;
    if (J = this._events, J === void 0)
      return this;
    if (J.removeListener === void 0)
      return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : J[$] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete J[$]), this;
    if (arguments.length === 0) {
      var ne = Object.keys(J), le;
      for (ie = 0; ie < ne.length; ++ie)
        le = ne[ie], le !== "removeListener" && this.removeAllListeners(le);
      return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
    }
    if (V = J[$], typeof V == "function")
      this.removeListener($, V);
    else if (V !== void 0)
      for (ie = V.length - 1; ie >= 0; ie--)
        this.removeListener($, V[ie]);
    return this;
  };
  function d(D, $, V) {
    var J = D._events;
    if (J === void 0)
      return [];
    var ie = J[$];
    return ie === void 0 ? [] : typeof ie == "function" ? V ? [ie.listener || ie] : [ie] : V ? B(ie) : y(ie, ie.length);
  }
  r.prototype.listeners = function($) {
    return d(this, $, !0);
  }, r.prototype.rawListeners = function($) {
    return d(this, $, !1);
  }, r.listenerCount = function(D, $) {
    return typeof D.listenerCount == "function" ? D.listenerCount($) : v.call(D, $);
  }, r.prototype.listenerCount = v;
  function v(D) {
    var $ = this._events;
    if ($ !== void 0) {
      var V = $[D];
      if (typeof V == "function")
        return 1;
      if (V !== void 0)
        return V.length;
    }
    return 0;
  }
  r.prototype.eventNames = function() {
    return this._eventsCount > 0 ? h(this._events) : [];
  };
  function y(D, $) {
    for (var V = new Array($), J = 0; J < $; ++J)
      V[J] = D[J];
    return V;
  }
  function m(D, $) {
    for (; $ + 1 < D.length; $++)
      D[$] = D[$ + 1];
    D.pop();
  }
  function B(D) {
    for (var $ = new Array(D.length), V = 0; V < $.length; ++V)
      $[V] = D[V].listener || D[V];
    return $;
  }
  function E(D, $) {
    return new Promise(function(V, J) {
      function ie(le) {
        D.removeListener($, ne), J(le);
      }
      function ne() {
        typeof D.removeListener == "function" && D.removeListener("error", ie), V([].slice.call(arguments));
      }
      O(D, $, ne, { once: !0 }), $ !== "error" && S(D, ie, { once: !0 });
    });
  }
  function S(D, $, V) {
    typeof D.on == "function" && O(D, "error", $, V);
  }
  function O(D, $, V, J) {
    if (typeof D.on == "function")
      J.once ? D.once($, V) : D.on($, V);
    else if (typeof D.addEventListener == "function")
      D.addEventListener($, function ie(ne) {
        J.once && D.removeEventListener($, ie), V(ne);
      });
    else
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof D);
  }
  return events.exports;
}
var streamBrowser$1, hasRequiredStreamBrowser$1;
function requireStreamBrowser$1() {
  return hasRequiredStreamBrowser$1 || (hasRequiredStreamBrowser$1 = 1, streamBrowser$1 = requireEvents().EventEmitter), streamBrowser$1;
}
var util$1 = {}, types$1 = {}, shams$1, hasRequiredShams$1;
function requireShams$1() {
  return hasRequiredShams$1 || (hasRequiredShams$1 = 1, shams$1 = function() {
    if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
      return !1;
    if (typeof Symbol.iterator == "symbol")
      return !0;
    var a = {}, h = /* @__PURE__ */ Symbol("test"), f = Object(h);
    if (typeof h == "string" || Object.prototype.toString.call(h) !== "[object Symbol]" || Object.prototype.toString.call(f) !== "[object Symbol]")
      return !1;
    var p = 42;
    a[h] = p;
    for (var r in a)
      return !1;
    if (typeof Object.keys == "function" && Object.keys(a).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(a).length !== 0)
      return !1;
    var u = Object.getOwnPropertySymbols(a);
    if (u.length !== 1 || u[0] !== h || !Object.prototype.propertyIsEnumerable.call(a, h))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor == "function") {
      var o = (
        /** @type {PropertyDescriptor} */
        Object.getOwnPropertyDescriptor(a, h)
      );
      if (o.value !== p || o.enumerable !== !0)
        return !1;
    }
    return !0;
  }), shams$1;
}
var shams, hasRequiredShams;
function requireShams() {
  if (hasRequiredShams) return shams;
  hasRequiredShams = 1;
  var c = requireShams$1();
  return shams = function() {
    return c() && !!Symbol.toStringTag;
  }, shams;
}
var esObjectAtoms, hasRequiredEsObjectAtoms;
function requireEsObjectAtoms() {
  return hasRequiredEsObjectAtoms || (hasRequiredEsObjectAtoms = 1, esObjectAtoms = Object), esObjectAtoms;
}
var esErrors, hasRequiredEsErrors;
function requireEsErrors() {
  return hasRequiredEsErrors || (hasRequiredEsErrors = 1, esErrors = Error), esErrors;
}
var _eval, hasRequired_eval;
function require_eval() {
  return hasRequired_eval || (hasRequired_eval = 1, _eval = EvalError), _eval;
}
var range, hasRequiredRange;
function requireRange() {
  return hasRequiredRange || (hasRequiredRange = 1, range = RangeError), range;
}
var ref, hasRequiredRef;
function requireRef() {
  return hasRequiredRef || (hasRequiredRef = 1, ref = ReferenceError), ref;
}
var syntax, hasRequiredSyntax;
function requireSyntax() {
  return hasRequiredSyntax || (hasRequiredSyntax = 1, syntax = SyntaxError), syntax;
}
var type, hasRequiredType;
function requireType() {
  return hasRequiredType || (hasRequiredType = 1, type = TypeError), type;
}
var uri, hasRequiredUri;
function requireUri() {
  return hasRequiredUri || (hasRequiredUri = 1, uri = URIError), uri;
}
var abs, hasRequiredAbs;
function requireAbs() {
  return hasRequiredAbs || (hasRequiredAbs = 1, abs = Math.abs), abs;
}
var floor, hasRequiredFloor;
function requireFloor() {
  return hasRequiredFloor || (hasRequiredFloor = 1, floor = Math.floor), floor;
}
var max, hasRequiredMax;
function requireMax() {
  return hasRequiredMax || (hasRequiredMax = 1, max = Math.max), max;
}
var min, hasRequiredMin;
function requireMin() {
  return hasRequiredMin || (hasRequiredMin = 1, min = Math.min), min;
}
var pow, hasRequiredPow;
function requirePow() {
  return hasRequiredPow || (hasRequiredPow = 1, pow = Math.pow), pow;
}
var round, hasRequiredRound;
function requireRound() {
  return hasRequiredRound || (hasRequiredRound = 1, round = Math.round), round;
}
var _isNaN, hasRequired_isNaN;
function require_isNaN() {
  return hasRequired_isNaN || (hasRequired_isNaN = 1, _isNaN = Number.isNaN || function(a) {
    return a !== a;
  }), _isNaN;
}
var sign$1, hasRequiredSign$1;
function requireSign$1() {
  if (hasRequiredSign$1) return sign$1;
  hasRequiredSign$1 = 1;
  var c = /* @__PURE__ */ require_isNaN();
  return sign$1 = function(h) {
    return c(h) || h === 0 ? h : h < 0 ? -1 : 1;
  }, sign$1;
}
var gOPD, hasRequiredGOPD;
function requireGOPD() {
  return hasRequiredGOPD || (hasRequiredGOPD = 1, gOPD = Object.getOwnPropertyDescriptor), gOPD;
}
var gopd, hasRequiredGopd;
function requireGopd() {
  if (hasRequiredGopd) return gopd;
  hasRequiredGopd = 1;
  var c = /* @__PURE__ */ requireGOPD();
  if (c)
    try {
      c([], "length");
    } catch {
      c = null;
    }
  return gopd = c, gopd;
}
var esDefineProperty, hasRequiredEsDefineProperty;
function requireEsDefineProperty() {
  if (hasRequiredEsDefineProperty) return esDefineProperty;
  hasRequiredEsDefineProperty = 1;
  var c = Object.defineProperty || !1;
  if (c)
    try {
      c({}, "a", { value: 1 });
    } catch {
      c = !1;
    }
  return esDefineProperty = c, esDefineProperty;
}
var hasSymbols, hasRequiredHasSymbols;
function requireHasSymbols() {
  if (hasRequiredHasSymbols) return hasSymbols;
  hasRequiredHasSymbols = 1;
  var c = typeof Symbol < "u" && Symbol, a = requireShams$1();
  return hasSymbols = function() {
    return typeof c != "function" || typeof Symbol != "function" || typeof c("foo") != "symbol" || typeof /* @__PURE__ */ Symbol("bar") != "symbol" ? !1 : a();
  }, hasSymbols;
}
var Reflect_getPrototypeOf, hasRequiredReflect_getPrototypeOf;
function requireReflect_getPrototypeOf() {
  return hasRequiredReflect_getPrototypeOf || (hasRequiredReflect_getPrototypeOf = 1, Reflect_getPrototypeOf = typeof Reflect < "u" && Reflect.getPrototypeOf || null), Reflect_getPrototypeOf;
}
var Object_getPrototypeOf, hasRequiredObject_getPrototypeOf;
function requireObject_getPrototypeOf() {
  if (hasRequiredObject_getPrototypeOf) return Object_getPrototypeOf;
  hasRequiredObject_getPrototypeOf = 1;
  var c = /* @__PURE__ */ requireEsObjectAtoms();
  return Object_getPrototypeOf = c.getPrototypeOf || null, Object_getPrototypeOf;
}
var implementation$4, hasRequiredImplementation$4;
function requireImplementation$4() {
  if (hasRequiredImplementation$4) return implementation$4;
  hasRequiredImplementation$4 = 1;
  var c = "Function.prototype.bind called on incompatible ", a = Object.prototype.toString, h = Math.max, f = "[object Function]", p = function(t, n) {
    for (var e = [], s = 0; s < t.length; s += 1)
      e[s] = t[s];
    for (var d = 0; d < n.length; d += 1)
      e[d + t.length] = n[d];
    return e;
  }, r = function(t, n) {
    for (var e = [], s = n, d = 0; s < t.length; s += 1, d += 1)
      e[d] = t[s];
    return e;
  }, u = function(o, t) {
    for (var n = "", e = 0; e < o.length; e += 1)
      n += o[e], e + 1 < o.length && (n += t);
    return n;
  };
  return implementation$4 = function(t) {
    var n = this;
    if (typeof n != "function" || a.apply(n) !== f)
      throw new TypeError(c + n);
    for (var e = r(arguments, 1), s, d = function() {
      if (this instanceof s) {
        var E = n.apply(
          this,
          p(e, arguments)
        );
        return Object(E) === E ? E : this;
      }
      return n.apply(
        t,
        p(e, arguments)
      );
    }, v = h(0, n.length - e.length), y = [], m = 0; m < v; m++)
      y[m] = "$" + m;
    if (s = Function("binder", "return function (" + u(y, ",") + "){ return binder.apply(this,arguments); }")(d), n.prototype) {
      var B = function() {
      };
      B.prototype = n.prototype, s.prototype = new B(), B.prototype = null;
    }
    return s;
  }, implementation$4;
}
var functionBind, hasRequiredFunctionBind;
function requireFunctionBind() {
  if (hasRequiredFunctionBind) return functionBind;
  hasRequiredFunctionBind = 1;
  var c = requireImplementation$4();
  return functionBind = Function.prototype.bind || c, functionBind;
}
var functionCall, hasRequiredFunctionCall;
function requireFunctionCall() {
  return hasRequiredFunctionCall || (hasRequiredFunctionCall = 1, functionCall = Function.prototype.call), functionCall;
}
var functionApply, hasRequiredFunctionApply;
function requireFunctionApply() {
  return hasRequiredFunctionApply || (hasRequiredFunctionApply = 1, functionApply = Function.prototype.apply), functionApply;
}
var reflectApply, hasRequiredReflectApply;
function requireReflectApply() {
  return hasRequiredReflectApply || (hasRequiredReflectApply = 1, reflectApply = typeof Reflect < "u" && Reflect && Reflect.apply), reflectApply;
}
var actualApply, hasRequiredActualApply;
function requireActualApply() {
  if (hasRequiredActualApply) return actualApply;
  hasRequiredActualApply = 1;
  var c = requireFunctionBind(), a = requireFunctionApply(), h = requireFunctionCall(), f = requireReflectApply();
  return actualApply = f || c.call(h, a), actualApply;
}
var callBindApplyHelpers, hasRequiredCallBindApplyHelpers;
function requireCallBindApplyHelpers() {
  if (hasRequiredCallBindApplyHelpers) return callBindApplyHelpers;
  hasRequiredCallBindApplyHelpers = 1;
  var c = requireFunctionBind(), a = /* @__PURE__ */ requireType(), h = requireFunctionCall(), f = requireActualApply();
  return callBindApplyHelpers = function(r) {
    if (r.length < 1 || typeof r[0] != "function")
      throw new a("a function is required");
    return f(c, h, r);
  }, callBindApplyHelpers;
}
var get, hasRequiredGet;
function requireGet() {
  if (hasRequiredGet) return get;
  hasRequiredGet = 1;
  var c = requireCallBindApplyHelpers(), a = /* @__PURE__ */ requireGopd(), h;
  try {
    h = /** @type {{ __proto__?: typeof Array.prototype }} */
    [].__proto__ === Array.prototype;
  } catch (u) {
    if (!u || typeof u != "object" || !("code" in u) || u.code !== "ERR_PROTO_ACCESS")
      throw u;
  }
  var f = !!h && a && a(
    Object.prototype,
    /** @type {keyof typeof Object.prototype} */
    "__proto__"
  ), p = Object, r = p.getPrototypeOf;
  return get = f && typeof f.get == "function" ? c([f.get]) : typeof r == "function" ? (
    /** @type {import('./get')} */
    function(o) {
      return r(o == null ? o : p(o));
    }
  ) : !1, get;
}
var getProto, hasRequiredGetProto;
function requireGetProto() {
  if (hasRequiredGetProto) return getProto;
  hasRequiredGetProto = 1;
  var c = requireReflect_getPrototypeOf(), a = requireObject_getPrototypeOf(), h = /* @__PURE__ */ requireGet();
  return getProto = c ? function(p) {
    return c(p);
  } : a ? function(p) {
    if (!p || typeof p != "object" && typeof p != "function")
      throw new TypeError("getProto: not an object");
    return a(p);
  } : h ? function(p) {
    return h(p);
  } : null, getProto;
}
var hasown, hasRequiredHasown;
function requireHasown() {
  if (hasRequiredHasown) return hasown;
  hasRequiredHasown = 1;
  var c = Function.prototype.call, a = Object.prototype.hasOwnProperty, h = requireFunctionBind();
  return hasown = h.call(c, a), hasown;
}
var getIntrinsic, hasRequiredGetIntrinsic;
function requireGetIntrinsic() {
  if (hasRequiredGetIntrinsic) return getIntrinsic;
  hasRequiredGetIntrinsic = 1;
  var c, a = /* @__PURE__ */ requireEsObjectAtoms(), h = /* @__PURE__ */ requireEsErrors(), f = /* @__PURE__ */ require_eval(), p = /* @__PURE__ */ requireRange(), r = /* @__PURE__ */ requireRef(), u = /* @__PURE__ */ requireSyntax(), o = /* @__PURE__ */ requireType(), t = /* @__PURE__ */ requireUri(), n = /* @__PURE__ */ requireAbs(), e = /* @__PURE__ */ requireFloor(), s = /* @__PURE__ */ requireMax(), d = /* @__PURE__ */ requireMin(), v = /* @__PURE__ */ requirePow(), y = /* @__PURE__ */ requireRound(), m = /* @__PURE__ */ requireSign$1(), B = Function, E = function(ee) {
    try {
      return B('"use strict"; return (' + ee + ").constructor;")();
    } catch {
    }
  }, S = /* @__PURE__ */ requireGopd(), O = /* @__PURE__ */ requireEsDefineProperty(), D = function() {
    throw new o();
  }, $ = S ? (function() {
    try {
      return arguments.callee, D;
    } catch {
      try {
        return S(arguments, "callee").get;
      } catch {
        return D;
      }
    }
  })() : D, V = requireHasSymbols()(), J = requireGetProto(), ie = requireObject_getPrototypeOf(), ne = requireReflect_getPrototypeOf(), le = requireFunctionApply(), Y = requireFunctionCall(), b = {}, g = typeof Uint8Array > "u" || !J ? c : J(Uint8Array), l = {
    __proto__: null,
    "%AggregateError%": typeof AggregateError > "u" ? c : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? c : ArrayBuffer,
    "%ArrayIteratorPrototype%": V && J ? J([][Symbol.iterator]()) : c,
    "%AsyncFromSyncIteratorPrototype%": c,
    "%AsyncFunction%": b,
    "%AsyncGenerator%": b,
    "%AsyncGeneratorFunction%": b,
    "%AsyncIteratorPrototype%": b,
    "%Atomics%": typeof Atomics > "u" ? c : Atomics,
    "%BigInt%": typeof BigInt > "u" ? c : BigInt,
    "%BigInt64Array%": typeof BigInt64Array > "u" ? c : BigInt64Array,
    "%BigUint64Array%": typeof BigUint64Array > "u" ? c : BigUint64Array,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView > "u" ? c : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": h,
    "%eval%": eval,
    // eslint-disable-line no-eval
    "%EvalError%": f,
    "%Float16Array%": typeof Float16Array > "u" ? c : Float16Array,
    "%Float32Array%": typeof Float32Array > "u" ? c : Float32Array,
    "%Float64Array%": typeof Float64Array > "u" ? c : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? c : FinalizationRegistry,
    "%Function%": B,
    "%GeneratorFunction%": b,
    "%Int8Array%": typeof Int8Array > "u" ? c : Int8Array,
    "%Int16Array%": typeof Int16Array > "u" ? c : Int16Array,
    "%Int32Array%": typeof Int32Array > "u" ? c : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": V && J ? J(J([][Symbol.iterator]())) : c,
    "%JSON%": typeof JSON == "object" ? JSON : c,
    "%Map%": typeof Map > "u" ? c : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !V || !J ? c : J((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": a,
    "%Object.getOwnPropertyDescriptor%": S,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? c : Promise,
    "%Proxy%": typeof Proxy > "u" ? c : Proxy,
    "%RangeError%": p,
    "%ReferenceError%": r,
    "%Reflect%": typeof Reflect > "u" ? c : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? c : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !V || !J ? c : J((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? c : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": V && J ? J(""[Symbol.iterator]()) : c,
    "%Symbol%": V ? Symbol : c,
    "%SyntaxError%": u,
    "%ThrowTypeError%": $,
    "%TypedArray%": g,
    "%TypeError%": o,
    "%Uint8Array%": typeof Uint8Array > "u" ? c : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? c : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array > "u" ? c : Uint16Array,
    "%Uint32Array%": typeof Uint32Array > "u" ? c : Uint32Array,
    "%URIError%": t,
    "%WeakMap%": typeof WeakMap > "u" ? c : WeakMap,
    "%WeakRef%": typeof WeakRef > "u" ? c : WeakRef,
    "%WeakSet%": typeof WeakSet > "u" ? c : WeakSet,
    "%Function.prototype.call%": Y,
    "%Function.prototype.apply%": le,
    "%Object.defineProperty%": O,
    "%Object.getPrototypeOf%": ie,
    "%Math.abs%": n,
    "%Math.floor%": e,
    "%Math.max%": s,
    "%Math.min%": d,
    "%Math.pow%": v,
    "%Math.round%": y,
    "%Math.sign%": m,
    "%Reflect.getPrototypeOf%": ne
  };
  if (J)
    try {
      null.error;
    } catch (ee) {
      var _ = J(J(ee));
      l["%Error.prototype%"] = _;
    }
  var A = function ee(ae) {
    var G;
    if (ae === "%AsyncFunction%")
      G = E("async function () {}");
    else if (ae === "%GeneratorFunction%")
      G = E("function* () {}");
    else if (ae === "%AsyncGeneratorFunction%")
      G = E("async function* () {}");
    else if (ae === "%AsyncGenerator%") {
      var z = ee("%AsyncGeneratorFunction%");
      z && (G = z.prototype);
    } else if (ae === "%AsyncIteratorPrototype%") {
      var fe = ee("%AsyncGenerator%");
      fe && J && (G = J(fe.prototype));
    }
    return l[ae] = G, G;
  }, q = {
    __proto__: null,
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  }, P = requireFunctionBind(), R = /* @__PURE__ */ requireHasown(), w = P.call(Y, Array.prototype.concat), M = P.call(le, Array.prototype.splice), x = P.call(Y, String.prototype.replace), L = P.call(Y, String.prototype.slice), K = P.call(Y, RegExp.prototype.exec), Q = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, U = /\\(\\)?/g, N = function(ae) {
    var G = L(ae, 0, 1), z = L(ae, -1);
    if (G === "%" && z !== "%")
      throw new u("invalid intrinsic syntax, expected closing `%`");
    if (z === "%" && G !== "%")
      throw new u("invalid intrinsic syntax, expected opening `%`");
    var fe = [];
    return x(ae, Q, function(me, xe, _e, Be) {
      fe[fe.length] = _e ? x(Be, U, "$1") : xe || me;
    }), fe;
  }, F = function(ae, G) {
    var z = ae, fe;
    if (R(q, z) && (fe = q[z], z = "%" + fe[0] + "%"), R(l, z)) {
      var me = l[z];
      if (me === b && (me = A(z)), typeof me > "u" && !G)
        throw new o("intrinsic " + ae + " exists, but is not available. Please file an issue!");
      return {
        alias: fe,
        name: z,
        value: me
      };
    }
    throw new u("intrinsic " + ae + " does not exist!");
  };
  return getIntrinsic = function(ae, G) {
    if (typeof ae != "string" || ae.length === 0)
      throw new o("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof G != "boolean")
      throw new o('"allowMissing" argument must be a boolean');
    if (K(/^%?[^%]*%?$/, ae) === null)
      throw new u("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var z = N(ae), fe = z.length > 0 ? z[0] : "", me = F("%" + fe + "%", G), xe = me.name, _e = me.value, Be = !1, Ae = me.alias;
    Ae && (fe = Ae[0], M(z, w([0, 1], Ae)));
    for (var be = 1, Fe = !0; be < z.length; be += 1) {
      var qe = z[be], Me = L(qe, 0, 1), Te = L(qe, -1);
      if ((Me === '"' || Me === "'" || Me === "`" || Te === '"' || Te === "'" || Te === "`") && Me !== Te)
        throw new u("property names with quotes must have matching quotes");
      if ((qe === "constructor" || !Fe) && (Be = !0), fe += "." + qe, xe = "%" + fe + "%", R(l, xe))
        _e = l[xe];
      else if (_e != null) {
        if (!(qe in _e)) {
          if (!G)
            throw new o("base intrinsic for " + ae + " exists, but the property is not available.");
          return;
        }
        if (S && be + 1 >= z.length) {
          var oe = S(_e, qe);
          Fe = !!oe, Fe && "get" in oe && !("originalValue" in oe.get) ? _e = oe.get : _e = _e[qe];
        } else
          Fe = R(_e, qe), _e = _e[qe];
        Fe && !Be && (l[xe] = _e);
      }
    }
    return _e;
  }, getIntrinsic;
}
var callBound$1, hasRequiredCallBound$1;
function requireCallBound$1() {
  if (hasRequiredCallBound$1) return callBound$1;
  hasRequiredCallBound$1 = 1;
  var c = /* @__PURE__ */ requireGetIntrinsic(), a = requireCallBindApplyHelpers(), h = a([c("%String.prototype.indexOf%")]);
  return callBound$1 = function(p, r) {
    var u = (
      /** @type {(this: unknown, ...args: unknown[]) => unknown} */
      c(p, !!r)
    );
    return typeof u == "function" && h(p, ".prototype.") > -1 ? a(
      /** @type {const} */
      [u]
    ) : u;
  }, callBound$1;
}
var isArguments$1, hasRequiredIsArguments$1;
function requireIsArguments$1() {
  if (hasRequiredIsArguments$1) return isArguments$1;
  hasRequiredIsArguments$1 = 1;
  var c = requireShams()(), a = /* @__PURE__ */ requireCallBound$1(), h = a("Object.prototype.toString"), f = function(o) {
    return c && o && typeof o == "object" && Symbol.toStringTag in o ? !1 : h(o) === "[object Arguments]";
  }, p = function(o) {
    return f(o) ? !0 : o !== null && typeof o == "object" && "length" in o && typeof o.length == "number" && o.length >= 0 && h(o) !== "[object Array]" && "callee" in o && h(o.callee) === "[object Function]";
  }, r = (function() {
    return f(arguments);
  })();
  return f.isLegacyArguments = p, isArguments$1 = r ? f : p, isArguments$1;
}
var isRegex, hasRequiredIsRegex;
function requireIsRegex() {
  if (hasRequiredIsRegex) return isRegex;
  hasRequiredIsRegex = 1;
  var c = /* @__PURE__ */ requireCallBound$1(), a = requireShams()(), h = /* @__PURE__ */ requireHasown(), f = /* @__PURE__ */ requireGopd(), p;
  if (a) {
    var r = c("RegExp.prototype.exec"), u = {}, o = function() {
      throw u;
    }, t = {
      toString: o,
      valueOf: o
    };
    typeof Symbol.toPrimitive == "symbol" && (t[Symbol.toPrimitive] = o), p = function(d) {
      if (!d || typeof d != "object")
        return !1;
      var v = (
        /** @type {NonNullable<typeof gOPD>} */
        f(
          /** @type {{ lastIndex?: unknown }} */
          d,
          "lastIndex"
        )
      ), y = v && h(v, "value");
      if (!y)
        return !1;
      try {
        r(
          d,
          /** @type {string} */
          /** @type {unknown} */
          t
        );
      } catch (m) {
        return m === u;
      }
    };
  } else {
    var n = c("Object.prototype.toString"), e = "[object RegExp]";
    p = function(d) {
      return !d || typeof d != "object" && typeof d != "function" ? !1 : n(d) === e;
    };
  }
  return isRegex = p, isRegex;
}
var safeRegexTest, hasRequiredSafeRegexTest;
function requireSafeRegexTest() {
  if (hasRequiredSafeRegexTest) return safeRegexTest;
  hasRequiredSafeRegexTest = 1;
  var c = /* @__PURE__ */ requireCallBound$1(), a = requireIsRegex(), h = c("RegExp.prototype.exec"), f = /* @__PURE__ */ requireType();
  return safeRegexTest = function(r) {
    if (!a(r))
      throw new f("`regex` must be a RegExp");
    return function(o) {
      return h(r, o) !== null;
    };
  }, safeRegexTest;
}
var generatorFunction, hasRequiredGeneratorFunction;
function requireGeneratorFunction() {
  if (hasRequiredGeneratorFunction) return generatorFunction;
  hasRequiredGeneratorFunction = 1;
  const c = (
    /** @type {GeneratorFunctionConstructor} */
    (function* () {
    }).constructor
  );
  return generatorFunction = () => c, generatorFunction;
}
var isGeneratorFunction, hasRequiredIsGeneratorFunction;
function requireIsGeneratorFunction() {
  if (hasRequiredIsGeneratorFunction) return isGeneratorFunction;
  hasRequiredIsGeneratorFunction = 1;
  var c = /* @__PURE__ */ requireCallBound$1(), a = /* @__PURE__ */ requireSafeRegexTest(), h = a(/^\s*(?:function)?\*/), f = requireShams()(), p = requireGetProto(), r = c("Object.prototype.toString"), u = c("Function.prototype.toString"), o = /* @__PURE__ */ requireGeneratorFunction();
  return isGeneratorFunction = function(n) {
    if (typeof n != "function")
      return !1;
    if (h(u(n)))
      return !0;
    if (!f) {
      var e = r(n);
      return e === "[object GeneratorFunction]";
    }
    if (!p)
      return !1;
    var s = o();
    return s && p(n) === s.prototype;
  }, isGeneratorFunction;
}
var isCallable, hasRequiredIsCallable;
function requireIsCallable() {
  if (hasRequiredIsCallable) return isCallable;
  hasRequiredIsCallable = 1;
  var c = Function.prototype.toString, a = typeof Reflect == "object" && Reflect !== null && Reflect.apply, h, f;
  if (typeof a == "function" && typeof Object.defineProperty == "function")
    try {
      h = Object.defineProperty({}, "length", {
        get: function() {
          throw f;
        }
      }), f = {}, a(function() {
        throw 42;
      }, null, h);
    } catch (S) {
      S !== f && (a = null);
    }
  else
    a = null;
  var p = /^\s*class\b/, r = function(O) {
    try {
      var D = c.call(O);
      return p.test(D);
    } catch {
      return !1;
    }
  }, u = function(O) {
    try {
      return r(O) ? !1 : (c.call(O), !0);
    } catch {
      return !1;
    }
  }, o = Object.prototype.toString, t = "[object Object]", n = "[object Function]", e = "[object GeneratorFunction]", s = "[object HTMLAllCollection]", d = "[object HTML document.all class]", v = "[object HTMLCollection]", y = typeof Symbol == "function" && !!Symbol.toStringTag, m = !(0 in [,]), B = function() {
    return !1;
  };
  if (typeof document == "object") {
    var E = document.all;
    o.call(E) === o.call(document.all) && (B = function(O) {
      if ((m || !O) && (typeof O > "u" || typeof O == "object"))
        try {
          var D = o.call(O);
          return (D === s || D === d || D === v || D === t) && O("") == null;
        } catch {
        }
      return !1;
    });
  }
  return isCallable = a ? function(O) {
    if (B(O))
      return !0;
    if (!O || typeof O != "function" && typeof O != "object")
      return !1;
    try {
      a(O, null, h);
    } catch (D) {
      if (D !== f)
        return !1;
    }
    return !r(O) && u(O);
  } : function(O) {
    if (B(O))
      return !0;
    if (!O || typeof O != "function" && typeof O != "object")
      return !1;
    if (y)
      return u(O);
    if (r(O))
      return !1;
    var D = o.call(O);
    return D !== n && D !== e && !/^\[object HTML/.test(D) ? !1 : u(O);
  }, isCallable;
}
var forEach, hasRequiredForEach;
function requireForEach() {
  if (hasRequiredForEach) return forEach;
  hasRequiredForEach = 1;
  var c = requireIsCallable(), a = Object.prototype.toString, h = Object.prototype.hasOwnProperty, f = function(t, n, e) {
    for (var s = 0, d = t.length; s < d; s++)
      h.call(t, s) && (e == null ? n(t[s], s, t) : n.call(e, t[s], s, t));
  }, p = function(t, n, e) {
    for (var s = 0, d = t.length; s < d; s++)
      e == null ? n(t.charAt(s), s, t) : n.call(e, t.charAt(s), s, t);
  }, r = function(t, n, e) {
    for (var s in t)
      h.call(t, s) && (e == null ? n(t[s], s, t) : n.call(e, t[s], s, t));
  };
  function u(o) {
    return a.call(o) === "[object Array]";
  }
  return forEach = function(t, n, e) {
    if (!c(n))
      throw new TypeError("iterator must be a function");
    var s;
    arguments.length >= 3 && (s = e), u(t) ? f(t, n, s) : typeof t == "string" ? p(t, n, s) : r(t, n, s);
  }, forEach;
}
var possibleTypedArrayNames, hasRequiredPossibleTypedArrayNames;
function requirePossibleTypedArrayNames() {
  return hasRequiredPossibleTypedArrayNames || (hasRequiredPossibleTypedArrayNames = 1, possibleTypedArrayNames = [
    "Float16Array",
    "Float32Array",
    "Float64Array",
    "Int8Array",
    "Int16Array",
    "Int32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "Uint16Array",
    "Uint32Array",
    "BigInt64Array",
    "BigUint64Array"
  ]), possibleTypedArrayNames;
}
var availableTypedArrays, hasRequiredAvailableTypedArrays;
function requireAvailableTypedArrays() {
  if (hasRequiredAvailableTypedArrays) return availableTypedArrays;
  hasRequiredAvailableTypedArrays = 1;
  var c = /* @__PURE__ */ requirePossibleTypedArrayNames(), a = typeof globalThis > "u" ? commonjsGlobal : globalThis;
  return availableTypedArrays = function() {
    for (var f = [], p = 0; p < c.length; p++)
      typeof a[c[p]] == "function" && (f[f.length] = c[p]);
    return f;
  }, availableTypedArrays;
}
var callBind = { exports: {} }, defineDataProperty, hasRequiredDefineDataProperty;
function requireDefineDataProperty() {
  if (hasRequiredDefineDataProperty) return defineDataProperty;
  hasRequiredDefineDataProperty = 1;
  var c = /* @__PURE__ */ requireEsDefineProperty(), a = /* @__PURE__ */ requireSyntax(), h = /* @__PURE__ */ requireType(), f = /* @__PURE__ */ requireGopd();
  return defineDataProperty = function(r, u, o) {
    if (!r || typeof r != "object" && typeof r != "function")
      throw new h("`obj` must be an object or a function`");
    if (typeof u != "string" && typeof u != "symbol")
      throw new h("`property` must be a string or a symbol`");
    if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
      throw new h("`nonEnumerable`, if provided, must be a boolean or null");
    if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
      throw new h("`nonWritable`, if provided, must be a boolean or null");
    if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
      throw new h("`nonConfigurable`, if provided, must be a boolean or null");
    if (arguments.length > 6 && typeof arguments[6] != "boolean")
      throw new h("`loose`, if provided, must be a boolean");
    var t = arguments.length > 3 ? arguments[3] : null, n = arguments.length > 4 ? arguments[4] : null, e = arguments.length > 5 ? arguments[5] : null, s = arguments.length > 6 ? arguments[6] : !1, d = !!f && f(r, u);
    if (c)
      c(r, u, {
        configurable: e === null && d ? d.configurable : !e,
        enumerable: t === null && d ? d.enumerable : !t,
        value: o,
        writable: n === null && d ? d.writable : !n
      });
    else if (s || !t && !n && !e)
      r[u] = o;
    else
      throw new a("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
  }, defineDataProperty;
}
var hasPropertyDescriptors_1, hasRequiredHasPropertyDescriptors;
function requireHasPropertyDescriptors() {
  if (hasRequiredHasPropertyDescriptors) return hasPropertyDescriptors_1;
  hasRequiredHasPropertyDescriptors = 1;
  var c = /* @__PURE__ */ requireEsDefineProperty(), a = function() {
    return !!c;
  };
  return a.hasArrayLengthDefineBug = function() {
    if (!c)
      return null;
    try {
      return c([], "length", { value: 1 }).length !== 1;
    } catch {
      return !0;
    }
  }, hasPropertyDescriptors_1 = a, hasPropertyDescriptors_1;
}
var setFunctionLength, hasRequiredSetFunctionLength;
function requireSetFunctionLength() {
  if (hasRequiredSetFunctionLength) return setFunctionLength;
  hasRequiredSetFunctionLength = 1;
  var c = /* @__PURE__ */ requireGetIntrinsic(), a = /* @__PURE__ */ requireDefineDataProperty(), h = /* @__PURE__ */ requireHasPropertyDescriptors()(), f = /* @__PURE__ */ requireGopd(), p = /* @__PURE__ */ requireType(), r = c("%Math.floor%");
  return setFunctionLength = function(o, t) {
    if (typeof o != "function")
      throw new p("`fn` is not a function");
    if (typeof t != "number" || t < 0 || t > 4294967295 || r(t) !== t)
      throw new p("`length` must be a positive 32-bit integer");
    var n = arguments.length > 2 && !!arguments[2], e = !0, s = !0;
    if ("length" in o && f) {
      var d = f(o, "length");
      d && !d.configurable && (e = !1), d && !d.writable && (s = !1);
    }
    return (e || s || !n) && (h ? a(
      /** @type {Parameters<define>[0]} */
      o,
      "length",
      t,
      !0,
      !0
    ) : a(
      /** @type {Parameters<define>[0]} */
      o,
      "length",
      t
    )), o;
  }, setFunctionLength;
}
var applyBind, hasRequiredApplyBind;
function requireApplyBind() {
  if (hasRequiredApplyBind) return applyBind;
  hasRequiredApplyBind = 1;
  var c = requireFunctionBind(), a = requireFunctionApply(), h = requireActualApply();
  return applyBind = function() {
    return h(c, a, arguments);
  }, applyBind;
}
var hasRequiredCallBind;
function requireCallBind() {
  return hasRequiredCallBind || (hasRequiredCallBind = 1, (function(c) {
    var a = /* @__PURE__ */ requireSetFunctionLength(), h = /* @__PURE__ */ requireEsDefineProperty(), f = requireCallBindApplyHelpers(), p = requireApplyBind();
    c.exports = function(u) {
      var o = f(arguments), t = u.length - (arguments.length - 1);
      return a(
        o,
        1 + (t > 0 ? t : 0),
        !0
      );
    }, h ? h(c.exports, "apply", { value: p }) : c.exports.apply = p;
  })(callBind)), callBind.exports;
}
var whichTypedArray, hasRequiredWhichTypedArray;
function requireWhichTypedArray() {
  if (hasRequiredWhichTypedArray) return whichTypedArray;
  hasRequiredWhichTypedArray = 1;
  var c = requireForEach(), a = /* @__PURE__ */ requireAvailableTypedArrays(), h = requireCallBind(), f = /* @__PURE__ */ requireCallBound$1(), p = /* @__PURE__ */ requireGopd(), r = requireGetProto(), u = f("Object.prototype.toString"), o = requireShams()(), t = typeof globalThis > "u" ? commonjsGlobal : globalThis, n = a(), e = f("String.prototype.slice"), s = f("Array.prototype.indexOf", !0) || function(B, E) {
    for (var S = 0; S < B.length; S += 1)
      if (B[S] === E)
        return S;
    return -1;
  }, d = { __proto__: null };
  o && p && r ? c(n, function(m) {
    var B = new t[m]();
    if (Symbol.toStringTag in B && r) {
      var E = r(B), S = p(E, Symbol.toStringTag);
      if (!S && E) {
        var O = r(E);
        S = p(O, Symbol.toStringTag);
      }
      if (S && S.get) {
        var D = h(S.get);
        d[
          /** @type {`$${import('.').TypedArrayName}`} */
          "$" + m
        ] = D;
      }
    }
  }) : c(n, function(m) {
    var B = new t[m](), E = B.slice || B.set;
    if (E) {
      var S = (
        /** @type {import('./types').BoundSlice | import('./types').BoundSet} */
        // @ts-expect-error TODO FIXME
        h(E)
      );
      d[
        /** @type {`$${import('.').TypedArrayName}`} */
        "$" + m
      ] = S;
    }
  });
  var v = function(B) {
    var E = !1;
    return c(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      d,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(S, O) {
        if (!E)
          try {
            "$" + S(B) === O && (E = /** @type {import('.').TypedArrayName} */
            e(O, 1));
          } catch {
          }
      }
    ), E;
  }, y = function(B) {
    var E = !1;
    return c(
      /** @type {Record<`\$${import('.').TypedArrayName}`, Getter>} */
      d,
      /** @type {(getter: Getter, name: `\$${import('.').TypedArrayName}`) => void} */
      function(S, O) {
        if (!E)
          try {
            S(B), E = /** @type {import('.').TypedArrayName} */
            e(O, 1);
          } catch {
          }
      }
    ), E;
  };
  return whichTypedArray = function(B) {
    if (!B || typeof B != "object")
      return !1;
    if (!o) {
      var E = e(u(B), 8, -1);
      return s(n, E) > -1 ? E : E !== "Object" ? !1 : y(B);
    }
    return p ? v(B) : null;
  }, whichTypedArray;
}
var isTypedArray, hasRequiredIsTypedArray;
function requireIsTypedArray() {
  if (hasRequiredIsTypedArray) return isTypedArray;
  hasRequiredIsTypedArray = 1;
  var c = /* @__PURE__ */ requireWhichTypedArray();
  return isTypedArray = function(h) {
    return !!c(h);
  }, isTypedArray;
}
var hasRequiredTypes$1;
function requireTypes$1() {
  return hasRequiredTypes$1 || (hasRequiredTypes$1 = 1, (function(c) {
    var a = /* @__PURE__ */ requireIsArguments$1(), h = requireIsGeneratorFunction(), f = /* @__PURE__ */ requireWhichTypedArray(), p = /* @__PURE__ */ requireIsTypedArray();
    function r(be) {
      return be.call.bind(be);
    }
    var u = typeof BigInt < "u", o = typeof Symbol < "u", t = r(Object.prototype.toString), n = r(Number.prototype.valueOf), e = r(String.prototype.valueOf), s = r(Boolean.prototype.valueOf);
    if (u)
      var d = r(BigInt.prototype.valueOf);
    if (o)
      var v = r(Symbol.prototype.valueOf);
    function y(be, Fe) {
      if (typeof be != "object")
        return !1;
      try {
        return Fe(be), !0;
      } catch {
        return !1;
      }
    }
    c.isArgumentsObject = a, c.isGeneratorFunction = h, c.isTypedArray = p;
    function m(be) {
      return typeof Promise < "u" && be instanceof Promise || be !== null && typeof be == "object" && typeof be.then == "function" && typeof be.catch == "function";
    }
    c.isPromise = m;
    function B(be) {
      return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(be) : p(be) || L(be);
    }
    c.isArrayBufferView = B;
    function E(be) {
      return f(be) === "Uint8Array";
    }
    c.isUint8Array = E;
    function S(be) {
      return f(be) === "Uint8ClampedArray";
    }
    c.isUint8ClampedArray = S;
    function O(be) {
      return f(be) === "Uint16Array";
    }
    c.isUint16Array = O;
    function D(be) {
      return f(be) === "Uint32Array";
    }
    c.isUint32Array = D;
    function $(be) {
      return f(be) === "Int8Array";
    }
    c.isInt8Array = $;
    function V(be) {
      return f(be) === "Int16Array";
    }
    c.isInt16Array = V;
    function J(be) {
      return f(be) === "Int32Array";
    }
    c.isInt32Array = J;
    function ie(be) {
      return f(be) === "Float32Array";
    }
    c.isFloat32Array = ie;
    function ne(be) {
      return f(be) === "Float64Array";
    }
    c.isFloat64Array = ne;
    function le(be) {
      return f(be) === "BigInt64Array";
    }
    c.isBigInt64Array = le;
    function Y(be) {
      return f(be) === "BigUint64Array";
    }
    c.isBigUint64Array = Y;
    function b(be) {
      return t(be) === "[object Map]";
    }
    b.working = typeof Map < "u" && b(/* @__PURE__ */ new Map());
    function g(be) {
      return typeof Map > "u" ? !1 : b.working ? b(be) : be instanceof Map;
    }
    c.isMap = g;
    function l(be) {
      return t(be) === "[object Set]";
    }
    l.working = typeof Set < "u" && l(/* @__PURE__ */ new Set());
    function _(be) {
      return typeof Set > "u" ? !1 : l.working ? l(be) : be instanceof Set;
    }
    c.isSet = _;
    function A(be) {
      return t(be) === "[object WeakMap]";
    }
    A.working = typeof WeakMap < "u" && A(/* @__PURE__ */ new WeakMap());
    function q(be) {
      return typeof WeakMap > "u" ? !1 : A.working ? A(be) : be instanceof WeakMap;
    }
    c.isWeakMap = q;
    function P(be) {
      return t(be) === "[object WeakSet]";
    }
    P.working = typeof WeakSet < "u" && P(/* @__PURE__ */ new WeakSet());
    function R(be) {
      return P(be);
    }
    c.isWeakSet = R;
    function w(be) {
      return t(be) === "[object ArrayBuffer]";
    }
    w.working = typeof ArrayBuffer < "u" && w(new ArrayBuffer());
    function M(be) {
      return typeof ArrayBuffer > "u" ? !1 : w.working ? w(be) : be instanceof ArrayBuffer;
    }
    c.isArrayBuffer = M;
    function x(be) {
      return t(be) === "[object DataView]";
    }
    x.working = typeof ArrayBuffer < "u" && typeof DataView < "u" && x(new DataView(new ArrayBuffer(1), 0, 1));
    function L(be) {
      return typeof DataView > "u" ? !1 : x.working ? x(be) : be instanceof DataView;
    }
    c.isDataView = L;
    var K = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : void 0;
    function Q(be) {
      return t(be) === "[object SharedArrayBuffer]";
    }
    function U(be) {
      return typeof K > "u" ? !1 : (typeof Q.working > "u" && (Q.working = Q(new K())), Q.working ? Q(be) : be instanceof K);
    }
    c.isSharedArrayBuffer = U;
    function N(be) {
      return t(be) === "[object AsyncFunction]";
    }
    c.isAsyncFunction = N;
    function F(be) {
      return t(be) === "[object Map Iterator]";
    }
    c.isMapIterator = F;
    function ee(be) {
      return t(be) === "[object Set Iterator]";
    }
    c.isSetIterator = ee;
    function ae(be) {
      return t(be) === "[object Generator]";
    }
    c.isGeneratorObject = ae;
    function G(be) {
      return t(be) === "[object WebAssembly.Module]";
    }
    c.isWebAssemblyCompiledModule = G;
    function z(be) {
      return y(be, n);
    }
    c.isNumberObject = z;
    function fe(be) {
      return y(be, e);
    }
    c.isStringObject = fe;
    function me(be) {
      return y(be, s);
    }
    c.isBooleanObject = me;
    function xe(be) {
      return u && y(be, d);
    }
    c.isBigIntObject = xe;
    function _e(be) {
      return o && y(be, v);
    }
    c.isSymbolObject = _e;
    function Be(be) {
      return z(be) || fe(be) || me(be) || xe(be) || _e(be);
    }
    c.isBoxedPrimitive = Be;
    function Ae(be) {
      return typeof Uint8Array < "u" && (M(be) || U(be));
    }
    c.isAnyArrayBuffer = Ae, ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(be) {
      Object.defineProperty(c, be, {
        enumerable: !1,
        value: function() {
          throw new Error(be + " is not supported in userland");
        }
      });
    });
  })(types$1)), types$1;
}
var isBufferBrowser, hasRequiredIsBufferBrowser;
function requireIsBufferBrowser() {
  return hasRequiredIsBufferBrowser || (hasRequiredIsBufferBrowser = 1, isBufferBrowser = function(a) {
    return a && typeof a == "object" && typeof a.copy == "function" && typeof a.fill == "function" && typeof a.readUInt8 == "function";
  }), isBufferBrowser;
}
var hasRequiredUtil$1;
function requireUtil$1() {
  return hasRequiredUtil$1 || (hasRequiredUtil$1 = 1, (function(c) {
    var a = Object.getOwnPropertyDescriptors || function(L) {
      for (var K = Object.keys(L), Q = {}, U = 0; U < K.length; U++)
        Q[K[U]] = Object.getOwnPropertyDescriptor(L, K[U]);
      return Q;
    }, h = /%[sdj%]/g;
    c.format = function(x) {
      if (!$(x)) {
        for (var L = [], K = 0; K < arguments.length; K++)
          L.push(u(arguments[K]));
        return L.join(" ");
      }
      for (var K = 1, Q = arguments, U = Q.length, N = String(x).replace(h, function(ee) {
        if (ee === "%%") return "%";
        if (K >= U) return ee;
        switch (ee) {
          case "%s":
            return String(Q[K++]);
          case "%d":
            return Number(Q[K++]);
          case "%j":
            try {
              return JSON.stringify(Q[K++]);
            } catch {
              return "[Circular]";
            }
          default:
            return ee;
        }
      }), F = Q[K]; K < U; F = Q[++K])
        S(F) || !ne(F) ? N += " " + F : N += " " + u(F);
      return N;
    }, c.deprecate = function(x, L) {
      if (typeof process$1 < "u" && process$1.noDeprecation === !0)
        return x;
      if (typeof process$1 > "u")
        return function() {
          return c.deprecate(x, L).apply(this, arguments);
        };
      var K = !1;
      function Q() {
        if (!K) {
          if (process$1.throwDeprecation)
            throw new Error(L);
          process$1.traceDeprecation ? console.trace(L) : console.error(L), K = !0;
        }
        return x.apply(this, arguments);
      }
      return Q;
    };
    var f = {}, p = /^$/;
    if (process$1.env.NODE_DEBUG) {
      var r = process$1.env.NODE_DEBUG;
      r = r.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), p = new RegExp("^" + r + "$", "i");
    }
    c.debuglog = function(x) {
      if (x = x.toUpperCase(), !f[x])
        if (p.test(x)) {
          var L = process$1.pid;
          f[x] = function() {
            var K = c.format.apply(c, arguments);
            console.error("%s %d: %s", x, L, K);
          };
        } else
          f[x] = function() {
          };
      return f[x];
    };
    function u(x, L) {
      var K = {
        seen: [],
        stylize: t
      };
      return arguments.length >= 3 && (K.depth = arguments[2]), arguments.length >= 4 && (K.colors = arguments[3]), E(L) ? K.showHidden = L : L && c._extend(K, L), J(K.showHidden) && (K.showHidden = !1), J(K.depth) && (K.depth = 2), J(K.colors) && (K.colors = !1), J(K.customInspect) && (K.customInspect = !0), K.colors && (K.stylize = o), e(K, x, K.depth);
    }
    c.inspect = u, u.colors = {
      bold: [1, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      white: [37, 39],
      grey: [90, 39],
      black: [30, 39],
      blue: [34, 39],
      cyan: [36, 39],
      green: [32, 39],
      magenta: [35, 39],
      red: [31, 39],
      yellow: [33, 39]
    }, u.styles = {
      special: "cyan",
      number: "yellow",
      boolean: "yellow",
      undefined: "grey",
      null: "bold",
      string: "green",
      date: "magenta",
      // "name": intentionally not styling
      regexp: "red"
    };
    function o(x, L) {
      var K = u.styles[L];
      return K ? "\x1B[" + u.colors[K][0] + "m" + x + "\x1B[" + u.colors[K][1] + "m" : x;
    }
    function t(x, L) {
      return x;
    }
    function n(x) {
      var L = {};
      return x.forEach(function(K, Q) {
        L[K] = !0;
      }), L;
    }
    function e(x, L, K) {
      if (x.customInspect && L && b(L.inspect) && // Filter out the util module, it's inspect function is special
      L.inspect !== c.inspect && // Also filter out any prototype objects using the circular check.
      !(L.constructor && L.constructor.prototype === L)) {
        var Q = L.inspect(K, x);
        return $(Q) || (Q = e(x, Q, K)), Q;
      }
      var U = s(x, L);
      if (U)
        return U;
      var N = Object.keys(L), F = n(N);
      if (x.showHidden && (N = Object.getOwnPropertyNames(L)), Y(L) && (N.indexOf("message") >= 0 || N.indexOf("description") >= 0))
        return d(L);
      if (N.length === 0) {
        if (b(L)) {
          var ee = L.name ? ": " + L.name : "";
          return x.stylize("[Function" + ee + "]", "special");
        }
        if (ie(L))
          return x.stylize(RegExp.prototype.toString.call(L), "regexp");
        if (le(L))
          return x.stylize(Date.prototype.toString.call(L), "date");
        if (Y(L))
          return d(L);
      }
      var ae = "", G = !1, z = ["{", "}"];
      if (B(L) && (G = !0, z = ["[", "]"]), b(L)) {
        var fe = L.name ? ": " + L.name : "";
        ae = " [Function" + fe + "]";
      }
      if (ie(L) && (ae = " " + RegExp.prototype.toString.call(L)), le(L) && (ae = " " + Date.prototype.toUTCString.call(L)), Y(L) && (ae = " " + d(L)), N.length === 0 && (!G || L.length == 0))
        return z[0] + ae + z[1];
      if (K < 0)
        return ie(L) ? x.stylize(RegExp.prototype.toString.call(L), "regexp") : x.stylize("[Object]", "special");
      x.seen.push(L);
      var me;
      return G ? me = v(x, L, K, F, N) : me = N.map(function(xe) {
        return y(x, L, K, F, xe, G);
      }), x.seen.pop(), m(me, ae, z);
    }
    function s(x, L) {
      if (J(L))
        return x.stylize("undefined", "undefined");
      if ($(L)) {
        var K = "'" + JSON.stringify(L).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return x.stylize(K, "string");
      }
      if (D(L))
        return x.stylize("" + L, "number");
      if (E(L))
        return x.stylize("" + L, "boolean");
      if (S(L))
        return x.stylize("null", "null");
    }
    function d(x) {
      return "[" + Error.prototype.toString.call(x) + "]";
    }
    function v(x, L, K, Q, U) {
      for (var N = [], F = 0, ee = L.length; F < ee; ++F)
        P(L, String(F)) ? N.push(y(
          x,
          L,
          K,
          Q,
          String(F),
          !0
        )) : N.push("");
      return U.forEach(function(ae) {
        ae.match(/^\d+$/) || N.push(y(
          x,
          L,
          K,
          Q,
          ae,
          !0
        ));
      }), N;
    }
    function y(x, L, K, Q, U, N) {
      var F, ee, ae;
      if (ae = Object.getOwnPropertyDescriptor(L, U) || { value: L[U] }, ae.get ? ae.set ? ee = x.stylize("[Getter/Setter]", "special") : ee = x.stylize("[Getter]", "special") : ae.set && (ee = x.stylize("[Setter]", "special")), P(Q, U) || (F = "[" + U + "]"), ee || (x.seen.indexOf(ae.value) < 0 ? (S(K) ? ee = e(x, ae.value, null) : ee = e(x, ae.value, K - 1), ee.indexOf(`
`) > -1 && (N ? ee = ee.split(`
`).map(function(G) {
        return "  " + G;
      }).join(`
`).slice(2) : ee = `
` + ee.split(`
`).map(function(G) {
        return "   " + G;
      }).join(`
`))) : ee = x.stylize("[Circular]", "special")), J(F)) {
        if (N && U.match(/^\d+$/))
          return ee;
        F = JSON.stringify("" + U), F.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (F = F.slice(1, -1), F = x.stylize(F, "name")) : (F = F.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), F = x.stylize(F, "string"));
      }
      return F + ": " + ee;
    }
    function m(x, L, K) {
      var Q = x.reduce(function(U, N) {
        return N.indexOf(`
`) >= 0, U + N.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      return Q > 60 ? K[0] + (L === "" ? "" : L + `
 `) + " " + x.join(`,
  `) + " " + K[1] : K[0] + L + " " + x.join(", ") + " " + K[1];
    }
    c.types = requireTypes$1();
    function B(x) {
      return Array.isArray(x);
    }
    c.isArray = B;
    function E(x) {
      return typeof x == "boolean";
    }
    c.isBoolean = E;
    function S(x) {
      return x === null;
    }
    c.isNull = S;
    function O(x) {
      return x == null;
    }
    c.isNullOrUndefined = O;
    function D(x) {
      return typeof x == "number";
    }
    c.isNumber = D;
    function $(x) {
      return typeof x == "string";
    }
    c.isString = $;
    function V(x) {
      return typeof x == "symbol";
    }
    c.isSymbol = V;
    function J(x) {
      return x === void 0;
    }
    c.isUndefined = J;
    function ie(x) {
      return ne(x) && l(x) === "[object RegExp]";
    }
    c.isRegExp = ie, c.types.isRegExp = ie;
    function ne(x) {
      return typeof x == "object" && x !== null;
    }
    c.isObject = ne;
    function le(x) {
      return ne(x) && l(x) === "[object Date]";
    }
    c.isDate = le, c.types.isDate = le;
    function Y(x) {
      return ne(x) && (l(x) === "[object Error]" || x instanceof Error);
    }
    c.isError = Y, c.types.isNativeError = Y;
    function b(x) {
      return typeof x == "function";
    }
    c.isFunction = b;
    function g(x) {
      return x === null || typeof x == "boolean" || typeof x == "number" || typeof x == "string" || typeof x == "symbol" || // ES6 symbol
      typeof x > "u";
    }
    c.isPrimitive = g, c.isBuffer = requireIsBufferBrowser();
    function l(x) {
      return Object.prototype.toString.call(x);
    }
    function _(x) {
      return x < 10 ? "0" + x.toString(10) : x.toString(10);
    }
    var A = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    function q() {
      var x = /* @__PURE__ */ new Date(), L = [
        _(x.getHours()),
        _(x.getMinutes()),
        _(x.getSeconds())
      ].join(":");
      return [x.getDate(), A[x.getMonth()], L].join(" ");
    }
    c.log = function() {
      console.log("%s - %s", q(), c.format.apply(c, arguments));
    }, c.inherits = requireInherits_browser(), c._extend = function(x, L) {
      if (!L || !ne(L)) return x;
      for (var K = Object.keys(L), Q = K.length; Q--; )
        x[K[Q]] = L[K[Q]];
      return x;
    };
    function P(x, L) {
      return Object.prototype.hasOwnProperty.call(x, L);
    }
    var R = typeof Symbol < "u" ? /* @__PURE__ */ Symbol("util.promisify.custom") : void 0;
    c.promisify = function(L) {
      if (typeof L != "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (R && L[R]) {
        var K = L[R];
        if (typeof K != "function")
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        return Object.defineProperty(K, R, {
          value: K,
          enumerable: !1,
          writable: !1,
          configurable: !0
        }), K;
      }
      function K() {
        for (var Q, U, N = new Promise(function(ae, G) {
          Q = ae, U = G;
        }), F = [], ee = 0; ee < arguments.length; ee++)
          F.push(arguments[ee]);
        F.push(function(ae, G) {
          ae ? U(ae) : Q(G);
        });
        try {
          L.apply(this, F);
        } catch (ae) {
          U(ae);
        }
        return N;
      }
      return Object.setPrototypeOf(K, Object.getPrototypeOf(L)), R && Object.defineProperty(K, R, {
        value: K,
        enumerable: !1,
        writable: !1,
        configurable: !0
      }), Object.defineProperties(
        K,
        a(L)
      );
    }, c.promisify.custom = R;
    function w(x, L) {
      if (!x) {
        var K = new Error("Promise was rejected with a falsy value");
        K.reason = x, x = K;
      }
      return L(x);
    }
    function M(x) {
      if (typeof x != "function")
        throw new TypeError('The "original" argument must be of type Function');
      function L() {
        for (var K = [], Q = 0; Q < arguments.length; Q++)
          K.push(arguments[Q]);
        var U = K.pop();
        if (typeof U != "function")
          throw new TypeError("The last argument must be of type Function");
        var N = this, F = function() {
          return U.apply(N, arguments);
        };
        x.apply(this, K).then(
          function(ee) {
            process$1.nextTick(F.bind(null, null, ee));
          },
          function(ee) {
            process$1.nextTick(w.bind(null, ee, F));
          }
        );
      }
      return Object.setPrototypeOf(L, Object.getPrototypeOf(x)), Object.defineProperties(
        L,
        a(x)
      ), L;
    }
    c.callbackify = M;
  })(util$1)), util$1;
}
var buffer_list, hasRequiredBuffer_list;
function requireBuffer_list() {
  if (hasRequiredBuffer_list) return buffer_list;
  hasRequiredBuffer_list = 1;
  function c(y, m) {
    var B = Object.keys(y);
    if (Object.getOwnPropertySymbols) {
      var E = Object.getOwnPropertySymbols(y);
      m && (E = E.filter(function(S) {
        return Object.getOwnPropertyDescriptor(y, S).enumerable;
      })), B.push.apply(B, E);
    }
    return B;
  }
  function a(y) {
    for (var m = 1; m < arguments.length; m++) {
      var B = arguments[m] != null ? arguments[m] : {};
      m % 2 ? c(Object(B), !0).forEach(function(E) {
        h(y, E, B[E]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(y, Object.getOwnPropertyDescriptors(B)) : c(Object(B)).forEach(function(E) {
        Object.defineProperty(y, E, Object.getOwnPropertyDescriptor(B, E));
      });
    }
    return y;
  }
  function h(y, m, B) {
    return m = u(m), m in y ? Object.defineProperty(y, m, { value: B, enumerable: !0, configurable: !0, writable: !0 }) : y[m] = B, y;
  }
  function f(y, m) {
    if (!(y instanceof m))
      throw new TypeError("Cannot call a class as a function");
  }
  function p(y, m) {
    for (var B = 0; B < m.length; B++) {
      var E = m[B];
      E.enumerable = E.enumerable || !1, E.configurable = !0, "value" in E && (E.writable = !0), Object.defineProperty(y, u(E.key), E);
    }
  }
  function r(y, m, B) {
    return m && p(y.prototype, m), Object.defineProperty(y, "prototype", { writable: !1 }), y;
  }
  function u(y) {
    var m = o(y, "string");
    return typeof m == "symbol" ? m : String(m);
  }
  function o(y, m) {
    if (typeof y != "object" || y === null) return y;
    var B = y[Symbol.toPrimitive];
    if (B !== void 0) {
      var E = B.call(y, m);
      if (typeof E != "object") return E;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(y);
  }
  var t = requireDist(), n = t.Buffer, e = requireUtil$1(), s = e.inspect, d = s && s.custom || "inspect";
  function v(y, m, B) {
    n.prototype.copy.call(y, m, B);
  }
  return buffer_list = /* @__PURE__ */ (function() {
    function y() {
      f(this, y), this.head = null, this.tail = null, this.length = 0;
    }
    return r(y, [{
      key: "push",
      value: function(B) {
        var E = {
          data: B,
          next: null
        };
        this.length > 0 ? this.tail.next = E : this.head = E, this.tail = E, ++this.length;
      }
    }, {
      key: "unshift",
      value: function(B) {
        var E = {
          data: B,
          next: this.head
        };
        this.length === 0 && (this.tail = E), this.head = E, ++this.length;
      }
    }, {
      key: "shift",
      value: function() {
        if (this.length !== 0) {
          var B = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, B;
        }
      }
    }, {
      key: "clear",
      value: function() {
        this.head = this.tail = null, this.length = 0;
      }
    }, {
      key: "join",
      value: function(B) {
        if (this.length === 0) return "";
        for (var E = this.head, S = "" + E.data; E = E.next; ) S += B + E.data;
        return S;
      }
    }, {
      key: "concat",
      value: function(B) {
        if (this.length === 0) return n.alloc(0);
        for (var E = n.allocUnsafe(B >>> 0), S = this.head, O = 0; S; )
          v(S.data, E, O), O += S.data.length, S = S.next;
        return E;
      }
      // Consumes a specified amount of bytes or characters from the buffered data.
    }, {
      key: "consume",
      value: function(B, E) {
        var S;
        return B < this.head.data.length ? (S = this.head.data.slice(0, B), this.head.data = this.head.data.slice(B)) : B === this.head.data.length ? S = this.shift() : S = E ? this._getString(B) : this._getBuffer(B), S;
      }
    }, {
      key: "first",
      value: function() {
        return this.head.data;
      }
      // Consumes a specified amount of characters from the buffered data.
    }, {
      key: "_getString",
      value: function(B) {
        var E = this.head, S = 1, O = E.data;
        for (B -= O.length; E = E.next; ) {
          var D = E.data, $ = B > D.length ? D.length : B;
          if ($ === D.length ? O += D : O += D.slice(0, B), B -= $, B === 0) {
            $ === D.length ? (++S, E.next ? this.head = E.next : this.head = this.tail = null) : (this.head = E, E.data = D.slice($));
            break;
          }
          ++S;
        }
        return this.length -= S, O;
      }
      // Consumes a specified amount of bytes from the buffered data.
    }, {
      key: "_getBuffer",
      value: function(B) {
        var E = n.allocUnsafe(B), S = this.head, O = 1;
        for (S.data.copy(E), B -= S.data.length; S = S.next; ) {
          var D = S.data, $ = B > D.length ? D.length : B;
          if (D.copy(E, E.length - B, 0, $), B -= $, B === 0) {
            $ === D.length ? (++O, S.next ? this.head = S.next : this.head = this.tail = null) : (this.head = S, S.data = D.slice($));
            break;
          }
          ++O;
        }
        return this.length -= O, E;
      }
      // Make sure the linked list only shows the minimal necessary information.
    }, {
      key: d,
      value: function(B, E) {
        return s(this, a(a({}, E), {}, {
          // Only inspect one level.
          depth: 0,
          // It should not recurse.
          customInspect: !1
        }));
      }
    }]), y;
  })(), buffer_list;
}
var destroy_1$1, hasRequiredDestroy$1;
function requireDestroy$1() {
  if (hasRequiredDestroy$1) return destroy_1$1;
  hasRequiredDestroy$1 = 1;
  function c(u, o) {
    var t = this, n = this._readableState && this._readableState.destroyed, e = this._writableState && this._writableState.destroyed;
    return n || e ? (o ? o(u) : u && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, process$1.nextTick(p, this, u)) : process$1.nextTick(p, this, u)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(u || null, function(s) {
      !o && s ? t._writableState ? t._writableState.errorEmitted ? process$1.nextTick(h, t) : (t._writableState.errorEmitted = !0, process$1.nextTick(a, t, s)) : process$1.nextTick(a, t, s) : o ? (process$1.nextTick(h, t), o(s)) : process$1.nextTick(h, t);
    }), this);
  }
  function a(u, o) {
    p(u, o), h(u);
  }
  function h(u) {
    u._writableState && !u._writableState.emitClose || u._readableState && !u._readableState.emitClose || u.emit("close");
  }
  function f() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
  }
  function p(u, o) {
    u.emit("error", o);
  }
  function r(u, o) {
    var t = u._readableState, n = u._writableState;
    t && t.autoDestroy || n && n.autoDestroy ? u.destroy(o) : u.emit("error", o);
  }
  return destroy_1$1 = {
    destroy: c,
    undestroy: f,
    errorOrDestroy: r
  }, destroy_1$1;
}
var errorsBrowser = {}, hasRequiredErrorsBrowser;
function requireErrorsBrowser() {
  if (hasRequiredErrorsBrowser) return errorsBrowser;
  hasRequiredErrorsBrowser = 1;
  function c(o, t) {
    o.prototype = Object.create(t.prototype), o.prototype.constructor = o, o.__proto__ = t;
  }
  var a = {};
  function h(o, t, n) {
    n || (n = Error);
    function e(d, v, y) {
      return typeof t == "string" ? t : t(d, v, y);
    }
    var s = /* @__PURE__ */ (function(d) {
      c(v, d);
      function v(y, m, B) {
        return d.call(this, e(y, m, B)) || this;
      }
      return v;
    })(n);
    s.prototype.name = n.name, s.prototype.code = o, a[o] = s;
  }
  function f(o, t) {
    if (Array.isArray(o)) {
      var n = o.length;
      return o = o.map(function(e) {
        return String(e);
      }), n > 2 ? "one of ".concat(t, " ").concat(o.slice(0, n - 1).join(", "), ", or ") + o[n - 1] : n === 2 ? "one of ".concat(t, " ").concat(o[0], " or ").concat(o[1]) : "of ".concat(t, " ").concat(o[0]);
    } else
      return "of ".concat(t, " ").concat(String(o));
  }
  function p(o, t, n) {
    return o.substr(0, t.length) === t;
  }
  function r(o, t, n) {
    return (n === void 0 || n > o.length) && (n = o.length), o.substring(n - t.length, n) === t;
  }
  function u(o, t, n) {
    return typeof n != "number" && (n = 0), n + t.length > o.length ? !1 : o.indexOf(t, n) !== -1;
  }
  return h("ERR_INVALID_OPT_VALUE", function(o, t) {
    return 'The value "' + t + '" is invalid for option "' + o + '"';
  }, TypeError), h("ERR_INVALID_ARG_TYPE", function(o, t, n) {
    var e;
    typeof t == "string" && p(t, "not ") ? (e = "must not be", t = t.replace(/^not /, "")) : e = "must be";
    var s;
    if (r(o, " argument"))
      s = "The ".concat(o, " ").concat(e, " ").concat(f(t, "type"));
    else {
      var d = u(o, ".") ? "property" : "argument";
      s = 'The "'.concat(o, '" ').concat(d, " ").concat(e, " ").concat(f(t, "type"));
    }
    return s += ". Received type ".concat(typeof n), s;
  }, TypeError), h("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), h("ERR_METHOD_NOT_IMPLEMENTED", function(o) {
    return "The " + o + " method is not implemented";
  }), h("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), h("ERR_STREAM_DESTROYED", function(o) {
    return "Cannot call " + o + " after a stream was destroyed";
  }), h("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), h("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), h("ERR_STREAM_WRITE_AFTER_END", "write after end"), h("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), h("ERR_UNKNOWN_ENCODING", function(o) {
    return "Unknown encoding: " + o;
  }, TypeError), h("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), errorsBrowser.codes = a, errorsBrowser;
}
var state, hasRequiredState;
function requireState() {
  if (hasRequiredState) return state;
  hasRequiredState = 1;
  var c = requireErrorsBrowser().codes.ERR_INVALID_OPT_VALUE;
  function a(f, p, r) {
    return f.highWaterMark != null ? f.highWaterMark : p ? f[r] : null;
  }
  function h(f, p, r, u) {
    var o = a(p, u, r);
    if (o != null) {
      if (!(isFinite(o) && Math.floor(o) === o) || o < 0) {
        var t = u ? r : "highWaterMark";
        throw new c(t, o);
      }
      return Math.floor(o);
    }
    return f.objectMode ? 16 : 16 * 1024;
  }
  return state = {
    getHighWaterMark: h
  }, state;
}
var browser$a, hasRequiredBrowser$a;
function requireBrowser$a() {
  if (hasRequiredBrowser$a) return browser$a;
  hasRequiredBrowser$a = 1, browser$a = c;
  function c(h, f) {
    if (a("noDeprecation"))
      return h;
    var p = !1;
    function r() {
      if (!p) {
        if (a("throwDeprecation"))
          throw new Error(f);
        a("traceDeprecation") ? console.trace(f) : console.warn(f), p = !0;
      }
      return h.apply(this, arguments);
    }
    return r;
  }
  function a(h) {
    try {
      if (!commonjsGlobal.localStorage) return !1;
    } catch {
      return !1;
    }
    var f = commonjsGlobal.localStorage[h];
    return f == null ? !1 : String(f).toLowerCase() === "true";
  }
  return browser$a;
}
var _stream_writable$1, hasRequired_stream_writable$1;
function require_stream_writable$1() {
  if (hasRequired_stream_writable$1) return _stream_writable$1;
  hasRequired_stream_writable$1 = 1, _stream_writable$1 = ie;
  function c(U) {
    var N = this;
    this.next = null, this.entry = null, this.finish = function() {
      Q(N, U);
    };
  }
  var a;
  ie.WritableState = V;
  var h = {
    deprecate: requireBrowser$a()
  }, f = requireStreamBrowser$1(), p = requireDist().Buffer, r = (typeof commonjsGlobal < "u" ? commonjsGlobal : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function u(U) {
    return p.from(U);
  }
  function o(U) {
    return p.isBuffer(U) || U instanceof r;
  }
  var t = requireDestroy$1(), n = requireState(), e = n.getHighWaterMark, s = requireErrorsBrowser().codes, d = s.ERR_INVALID_ARG_TYPE, v = s.ERR_METHOD_NOT_IMPLEMENTED, y = s.ERR_MULTIPLE_CALLBACK, m = s.ERR_STREAM_CANNOT_PIPE, B = s.ERR_STREAM_DESTROYED, E = s.ERR_STREAM_NULL_VALUES, S = s.ERR_STREAM_WRITE_AFTER_END, O = s.ERR_UNKNOWN_ENCODING, D = t.errorOrDestroy;
  requireInherits_browser()(ie, f);
  function $() {
  }
  function V(U, N, F) {
    a = a || require_stream_duplex$1(), U = U || {}, typeof F != "boolean" && (F = N instanceof a), this.objectMode = !!U.objectMode, F && (this.objectMode = this.objectMode || !!U.writableObjectMode), this.highWaterMark = e(this, U, "writableHighWaterMark", F), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var ee = U.decodeStrings === !1;
    this.decodeStrings = !ee, this.defaultEncoding = U.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(ae) {
      A(N, ae);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = U.emitClose !== !1, this.autoDestroy = !!U.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new c(this);
  }
  V.prototype.getBuffer = function() {
    for (var N = this.bufferedRequest, F = []; N; )
      F.push(N), N = N.next;
    return F;
  }, (function() {
    try {
      Object.defineProperty(V.prototype, "buffer", {
        get: h.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var J;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (J = Function.prototype[Symbol.hasInstance], Object.defineProperty(ie, Symbol.hasInstance, {
    value: function(N) {
      return J.call(this, N) ? !0 : this !== ie ? !1 : N && N._writableState instanceof V;
    }
  })) : J = function(N) {
    return N instanceof this;
  };
  function ie(U) {
    a = a || require_stream_duplex$1();
    var N = this instanceof a;
    if (!N && !J.call(ie, this)) return new ie(U);
    this._writableState = new V(U, this, N), this.writable = !0, U && (typeof U.write == "function" && (this._write = U.write), typeof U.writev == "function" && (this._writev = U.writev), typeof U.destroy == "function" && (this._destroy = U.destroy), typeof U.final == "function" && (this._final = U.final)), f.call(this);
  }
  ie.prototype.pipe = function() {
    D(this, new m());
  };
  function ne(U, N) {
    var F = new S();
    D(U, F), process$1.nextTick(N, F);
  }
  function le(U, N, F, ee) {
    var ae;
    return F === null ? ae = new E() : typeof F != "string" && !N.objectMode && (ae = new d("chunk", ["string", "Buffer"], F)), ae ? (D(U, ae), process$1.nextTick(ee, ae), !1) : !0;
  }
  ie.prototype.write = function(U, N, F) {
    var ee = this._writableState, ae = !1, G = !ee.objectMode && o(U);
    return G && !p.isBuffer(U) && (U = u(U)), typeof N == "function" && (F = N, N = null), G ? N = "buffer" : N || (N = ee.defaultEncoding), typeof F != "function" && (F = $), ee.ending ? ne(this, F) : (G || le(this, ee, U, F)) && (ee.pendingcb++, ae = b(this, ee, G, U, N, F)), ae;
  }, ie.prototype.cork = function() {
    this._writableState.corked++;
  }, ie.prototype.uncork = function() {
    var U = this._writableState;
    U.corked && (U.corked--, !U.writing && !U.corked && !U.bufferProcessing && U.bufferedRequest && R(this, U));
  }, ie.prototype.setDefaultEncoding = function(N) {
    if (typeof N == "string" && (N = N.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((N + "").toLowerCase()) > -1)) throw new O(N);
    return this._writableState.defaultEncoding = N, this;
  }, Object.defineProperty(ie.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  function Y(U, N, F) {
    return !U.objectMode && U.decodeStrings !== !1 && typeof N == "string" && (N = p.from(N, F)), N;
  }
  Object.defineProperty(ie.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function b(U, N, F, ee, ae, G) {
    if (!F) {
      var z = Y(N, ee, ae);
      ee !== z && (F = !0, ae = "buffer", ee = z);
    }
    var fe = N.objectMode ? 1 : ee.length;
    N.length += fe;
    var me = N.length < N.highWaterMark;
    if (me || (N.needDrain = !0), N.writing || N.corked) {
      var xe = N.lastBufferedRequest;
      N.lastBufferedRequest = {
        chunk: ee,
        encoding: ae,
        isBuf: F,
        callback: G,
        next: null
      }, xe ? xe.next = N.lastBufferedRequest : N.bufferedRequest = N.lastBufferedRequest, N.bufferedRequestCount += 1;
    } else
      g(U, N, !1, fe, ee, ae, G);
    return me;
  }
  function g(U, N, F, ee, ae, G, z) {
    N.writelen = ee, N.writecb = z, N.writing = !0, N.sync = !0, N.destroyed ? N.onwrite(new B("write")) : F ? U._writev(ae, N.onwrite) : U._write(ae, G, N.onwrite), N.sync = !1;
  }
  function l(U, N, F, ee, ae) {
    --N.pendingcb, F ? (process$1.nextTick(ae, ee), process$1.nextTick(L, U, N), U._writableState.errorEmitted = !0, D(U, ee)) : (ae(ee), U._writableState.errorEmitted = !0, D(U, ee), L(U, N));
  }
  function _(U) {
    U.writing = !1, U.writecb = null, U.length -= U.writelen, U.writelen = 0;
  }
  function A(U, N) {
    var F = U._writableState, ee = F.sync, ae = F.writecb;
    if (typeof ae != "function") throw new y();
    if (_(F), N) l(U, F, ee, N, ae);
    else {
      var G = w(F) || U.destroyed;
      !G && !F.corked && !F.bufferProcessing && F.bufferedRequest && R(U, F), ee ? process$1.nextTick(q, U, F, G, ae) : q(U, F, G, ae);
    }
  }
  function q(U, N, F, ee) {
    F || P(U, N), N.pendingcb--, ee(), L(U, N);
  }
  function P(U, N) {
    N.length === 0 && N.needDrain && (N.needDrain = !1, U.emit("drain"));
  }
  function R(U, N) {
    N.bufferProcessing = !0;
    var F = N.bufferedRequest;
    if (U._writev && F && F.next) {
      var ee = N.bufferedRequestCount, ae = new Array(ee), G = N.corkedRequestsFree;
      G.entry = F;
      for (var z = 0, fe = !0; F; )
        ae[z] = F, F.isBuf || (fe = !1), F = F.next, z += 1;
      ae.allBuffers = fe, g(U, N, !0, N.length, ae, "", G.finish), N.pendingcb++, N.lastBufferedRequest = null, G.next ? (N.corkedRequestsFree = G.next, G.next = null) : N.corkedRequestsFree = new c(N), N.bufferedRequestCount = 0;
    } else {
      for (; F; ) {
        var me = F.chunk, xe = F.encoding, _e = F.callback, Be = N.objectMode ? 1 : me.length;
        if (g(U, N, !1, Be, me, xe, _e), F = F.next, N.bufferedRequestCount--, N.writing)
          break;
      }
      F === null && (N.lastBufferedRequest = null);
    }
    N.bufferedRequest = F, N.bufferProcessing = !1;
  }
  ie.prototype._write = function(U, N, F) {
    F(new v("_write()"));
  }, ie.prototype._writev = null, ie.prototype.end = function(U, N, F) {
    var ee = this._writableState;
    return typeof U == "function" ? (F = U, U = null, N = null) : typeof N == "function" && (F = N, N = null), U != null && this.write(U, N), ee.corked && (ee.corked = 1, this.uncork()), ee.ending || K(this, ee, F), this;
  }, Object.defineProperty(ie.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function w(U) {
    return U.ending && U.length === 0 && U.bufferedRequest === null && !U.finished && !U.writing;
  }
  function M(U, N) {
    U._final(function(F) {
      N.pendingcb--, F && D(U, F), N.prefinished = !0, U.emit("prefinish"), L(U, N);
    });
  }
  function x(U, N) {
    !N.prefinished && !N.finalCalled && (typeof U._final == "function" && !N.destroyed ? (N.pendingcb++, N.finalCalled = !0, process$1.nextTick(M, U, N)) : (N.prefinished = !0, U.emit("prefinish")));
  }
  function L(U, N) {
    var F = w(N);
    if (F && (x(U, N), N.pendingcb === 0 && (N.finished = !0, U.emit("finish"), N.autoDestroy))) {
      var ee = U._readableState;
      (!ee || ee.autoDestroy && ee.endEmitted) && U.destroy();
    }
    return F;
  }
  function K(U, N, F) {
    N.ending = !0, L(U, N), F && (N.finished ? process$1.nextTick(F) : U.once("finish", F)), N.ended = !0, U.writable = !1;
  }
  function Q(U, N, F) {
    var ee = U.entry;
    for (U.entry = null; ee; ) {
      var ae = ee.callback;
      N.pendingcb--, ae(F), ee = ee.next;
    }
    N.corkedRequestsFree.next = U;
  }
  return Object.defineProperty(ie.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(N) {
      this._writableState && (this._writableState.destroyed = N);
    }
  }), ie.prototype.destroy = t.destroy, ie.prototype._undestroy = t.undestroy, ie.prototype._destroy = function(U, N) {
    N(U);
  }, _stream_writable$1;
}
var _stream_duplex$1, hasRequired_stream_duplex$1;
function require_stream_duplex$1() {
  if (hasRequired_stream_duplex$1) return _stream_duplex$1;
  hasRequired_stream_duplex$1 = 1;
  var c = Object.keys || function(n) {
    var e = [];
    for (var s in n) e.push(s);
    return e;
  };
  _stream_duplex$1 = u;
  var a = require_stream_readable$1(), h = require_stream_writable$1();
  requireInherits_browser()(u, a);
  for (var f = c(h.prototype), p = 0; p < f.length; p++) {
    var r = f[p];
    u.prototype[r] || (u.prototype[r] = h.prototype[r]);
  }
  function u(n) {
    if (!(this instanceof u)) return new u(n);
    a.call(this, n), h.call(this, n), this.allowHalfOpen = !0, n && (n.readable === !1 && (this.readable = !1), n.writable === !1 && (this.writable = !1), n.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", o)));
  }
  Object.defineProperty(u.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  }), Object.defineProperty(u.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  }), Object.defineProperty(u.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function o() {
    this._writableState.ended || process$1.nextTick(t, this);
  }
  function t(n) {
    n.end();
  }
  return Object.defineProperty(u.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(e) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = e, this._writableState.destroyed = e);
    }
  }), _stream_duplex$1;
}
var string_decoder = {}, hasRequiredString_decoder;
function requireString_decoder() {
  if (hasRequiredString_decoder) return string_decoder;
  hasRequiredString_decoder = 1;
  var c = requireSafeBuffer$1().Buffer, a = c.isEncoding || function(E) {
    switch (E = "" + E, E && E.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return !0;
      default:
        return !1;
    }
  };
  function h(E) {
    if (!E) return "utf8";
    for (var S; ; )
      switch (E) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return E;
        default:
          if (S) return;
          E = ("" + E).toLowerCase(), S = !0;
      }
  }
  function f(E) {
    var S = h(E);
    if (typeof S != "string" && (c.isEncoding === a || !a(E))) throw new Error("Unknown encoding: " + E);
    return S || E;
  }
  string_decoder.StringDecoder = p;
  function p(E) {
    this.encoding = f(E);
    var S;
    switch (this.encoding) {
      case "utf16le":
        this.text = s, this.end = d, S = 4;
        break;
      case "utf8":
        this.fillLast = t, S = 4;
        break;
      case "base64":
        this.text = v, this.end = y, S = 3;
        break;
      default:
        this.write = m, this.end = B;
        return;
    }
    this.lastNeed = 0, this.lastTotal = 0, this.lastChar = c.allocUnsafe(S);
  }
  p.prototype.write = function(E) {
    if (E.length === 0) return "";
    var S, O;
    if (this.lastNeed) {
      if (S = this.fillLast(E), S === void 0) return "";
      O = this.lastNeed, this.lastNeed = 0;
    } else
      O = 0;
    return O < E.length ? S ? S + this.text(E, O) : this.text(E, O) : S || "";
  }, p.prototype.end = e, p.prototype.text = n, p.prototype.fillLast = function(E) {
    if (this.lastNeed <= E.length)
      return E.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    E.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, E.length), this.lastNeed -= E.length;
  };
  function r(E) {
    return E <= 127 ? 0 : E >> 5 === 6 ? 2 : E >> 4 === 14 ? 3 : E >> 3 === 30 ? 4 : E >> 6 === 2 ? -1 : -2;
  }
  function u(E, S, O) {
    var D = S.length - 1;
    if (D < O) return 0;
    var $ = r(S[D]);
    return $ >= 0 ? ($ > 0 && (E.lastNeed = $ - 1), $) : --D < O || $ === -2 ? 0 : ($ = r(S[D]), $ >= 0 ? ($ > 0 && (E.lastNeed = $ - 2), $) : --D < O || $ === -2 ? 0 : ($ = r(S[D]), $ >= 0 ? ($ > 0 && ($ === 2 ? $ = 0 : E.lastNeed = $ - 3), $) : 0));
  }
  function o(E, S, O) {
    if ((S[0] & 192) !== 128)
      return E.lastNeed = 0, "�";
    if (E.lastNeed > 1 && S.length > 1) {
      if ((S[1] & 192) !== 128)
        return E.lastNeed = 1, "�";
      if (E.lastNeed > 2 && S.length > 2 && (S[2] & 192) !== 128)
        return E.lastNeed = 2, "�";
    }
  }
  function t(E) {
    var S = this.lastTotal - this.lastNeed, O = o(this, E);
    if (O !== void 0) return O;
    if (this.lastNeed <= E.length)
      return E.copy(this.lastChar, S, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    E.copy(this.lastChar, S, 0, E.length), this.lastNeed -= E.length;
  }
  function n(E, S) {
    var O = u(this, E, S);
    if (!this.lastNeed) return E.toString("utf8", S);
    this.lastTotal = O;
    var D = E.length - (O - this.lastNeed);
    return E.copy(this.lastChar, 0, D), E.toString("utf8", S, D);
  }
  function e(E) {
    var S = E && E.length ? this.write(E) : "";
    return this.lastNeed ? S + "�" : S;
  }
  function s(E, S) {
    if ((E.length - S) % 2 === 0) {
      var O = E.toString("utf16le", S);
      if (O) {
        var D = O.charCodeAt(O.length - 1);
        if (D >= 55296 && D <= 56319)
          return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = E[E.length - 2], this.lastChar[1] = E[E.length - 1], O.slice(0, -1);
      }
      return O;
    }
    return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = E[E.length - 1], E.toString("utf16le", S, E.length - 1);
  }
  function d(E) {
    var S = E && E.length ? this.write(E) : "";
    if (this.lastNeed) {
      var O = this.lastTotal - this.lastNeed;
      return S + this.lastChar.toString("utf16le", 0, O);
    }
    return S;
  }
  function v(E, S) {
    var O = (E.length - S) % 3;
    return O === 0 ? E.toString("base64", S) : (this.lastNeed = 3 - O, this.lastTotal = 3, O === 1 ? this.lastChar[0] = E[E.length - 1] : (this.lastChar[0] = E[E.length - 2], this.lastChar[1] = E[E.length - 1]), E.toString("base64", S, E.length - O));
  }
  function y(E) {
    var S = E && E.length ? this.write(E) : "";
    return this.lastNeed ? S + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : S;
  }
  function m(E) {
    return E.toString(this.encoding);
  }
  function B(E) {
    return E && E.length ? this.write(E) : "";
  }
  return string_decoder;
}
var endOfStream, hasRequiredEndOfStream;
function requireEndOfStream() {
  if (hasRequiredEndOfStream) return endOfStream;
  hasRequiredEndOfStream = 1;
  var c = requireErrorsBrowser().codes.ERR_STREAM_PREMATURE_CLOSE;
  function a(r) {
    var u = !1;
    return function() {
      if (!u) {
        u = !0;
        for (var o = arguments.length, t = new Array(o), n = 0; n < o; n++)
          t[n] = arguments[n];
        r.apply(this, t);
      }
    };
  }
  function h() {
  }
  function f(r) {
    return r.setHeader && typeof r.abort == "function";
  }
  function p(r, u, o) {
    if (typeof u == "function") return p(r, null, u);
    u || (u = {}), o = a(o || h);
    var t = u.readable || u.readable !== !1 && r.readable, n = u.writable || u.writable !== !1 && r.writable, e = function() {
      r.writable || d();
    }, s = r._writableState && r._writableState.finished, d = function() {
      n = !1, s = !0, t || o.call(r);
    }, v = r._readableState && r._readableState.endEmitted, y = function() {
      t = !1, v = !0, n || o.call(r);
    }, m = function(O) {
      o.call(r, O);
    }, B = function() {
      var O;
      if (t && !v)
        return (!r._readableState || !r._readableState.ended) && (O = new c()), o.call(r, O);
      if (n && !s)
        return (!r._writableState || !r._writableState.ended) && (O = new c()), o.call(r, O);
    }, E = function() {
      r.req.on("finish", d);
    };
    return f(r) ? (r.on("complete", d), r.on("abort", B), r.req ? E() : r.on("request", E)) : n && !r._writableState && (r.on("end", e), r.on("close", e)), r.on("end", y), r.on("finish", d), u.error !== !1 && r.on("error", m), r.on("close", B), function() {
      r.removeListener("complete", d), r.removeListener("abort", B), r.removeListener("request", E), r.req && r.req.removeListener("finish", d), r.removeListener("end", e), r.removeListener("close", e), r.removeListener("finish", d), r.removeListener("end", y), r.removeListener("error", m), r.removeListener("close", B);
    };
  }
  return endOfStream = p, endOfStream;
}
var async_iterator, hasRequiredAsync_iterator;
function requireAsync_iterator() {
  if (hasRequiredAsync_iterator) return async_iterator;
  hasRequiredAsync_iterator = 1;
  var c;
  function a(O, D, $) {
    return D = h(D), D in O ? Object.defineProperty(O, D, { value: $, enumerable: !0, configurable: !0, writable: !0 }) : O[D] = $, O;
  }
  function h(O) {
    var D = f(O, "string");
    return typeof D == "symbol" ? D : String(D);
  }
  function f(O, D) {
    if (typeof O != "object" || O === null) return O;
    var $ = O[Symbol.toPrimitive];
    if ($ !== void 0) {
      var V = $.call(O, D);
      if (typeof V != "object") return V;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (D === "string" ? String : Number)(O);
  }
  var p = requireEndOfStream(), r = /* @__PURE__ */ Symbol("lastResolve"), u = /* @__PURE__ */ Symbol("lastReject"), o = /* @__PURE__ */ Symbol("error"), t = /* @__PURE__ */ Symbol("ended"), n = /* @__PURE__ */ Symbol("lastPromise"), e = /* @__PURE__ */ Symbol("handlePromise"), s = /* @__PURE__ */ Symbol("stream");
  function d(O, D) {
    return {
      value: O,
      done: D
    };
  }
  function v(O) {
    var D = O[r];
    if (D !== null) {
      var $ = O[s].read();
      $ !== null && (O[n] = null, O[r] = null, O[u] = null, D(d($, !1)));
    }
  }
  function y(O) {
    process$1.nextTick(v, O);
  }
  function m(O, D) {
    return function($, V) {
      O.then(function() {
        if (D[t]) {
          $(d(void 0, !0));
          return;
        }
        D[e]($, V);
      }, V);
    };
  }
  var B = Object.getPrototypeOf(function() {
  }), E = Object.setPrototypeOf((c = {
    get stream() {
      return this[s];
    },
    next: function() {
      var D = this, $ = this[o];
      if ($ !== null)
        return Promise.reject($);
      if (this[t])
        return Promise.resolve(d(void 0, !0));
      if (this[s].destroyed)
        return new Promise(function(ne, le) {
          process$1.nextTick(function() {
            D[o] ? le(D[o]) : ne(d(void 0, !0));
          });
        });
      var V = this[n], J;
      if (V)
        J = new Promise(m(V, this));
      else {
        var ie = this[s].read();
        if (ie !== null)
          return Promise.resolve(d(ie, !1));
        J = new Promise(this[e]);
      }
      return this[n] = J, J;
    }
  }, a(c, Symbol.asyncIterator, function() {
    return this;
  }), a(c, "return", function() {
    var D = this;
    return new Promise(function($, V) {
      D[s].destroy(null, function(J) {
        if (J) {
          V(J);
          return;
        }
        $(d(void 0, !0));
      });
    });
  }), c), B), S = function(D) {
    var $, V = Object.create(E, ($ = {}, a($, s, {
      value: D,
      writable: !0
    }), a($, r, {
      value: null,
      writable: !0
    }), a($, u, {
      value: null,
      writable: !0
    }), a($, o, {
      value: null,
      writable: !0
    }), a($, t, {
      value: D._readableState.endEmitted,
      writable: !0
    }), a($, e, {
      value: function(ie, ne) {
        var le = V[s].read();
        le ? (V[n] = null, V[r] = null, V[u] = null, ie(d(le, !1))) : (V[r] = ie, V[u] = ne);
      },
      writable: !0
    }), $));
    return V[n] = null, p(D, function(J) {
      if (J && J.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var ie = V[u];
        ie !== null && (V[n] = null, V[r] = null, V[u] = null, ie(J)), V[o] = J;
        return;
      }
      var ne = V[r];
      ne !== null && (V[n] = null, V[r] = null, V[u] = null, ne(d(void 0, !0))), V[t] = !0;
    }), D.on("readable", y.bind(null, V)), V;
  };
  return async_iterator = S, async_iterator;
}
var fromBrowser, hasRequiredFromBrowser;
function requireFromBrowser() {
  return hasRequiredFromBrowser || (hasRequiredFromBrowser = 1, fromBrowser = function() {
    throw new Error("Readable.from is not available in the browser");
  }), fromBrowser;
}
var _stream_readable$1, hasRequired_stream_readable$1;
function require_stream_readable$1() {
  if (hasRequired_stream_readable$1) return _stream_readable$1;
  hasRequired_stream_readable$1 = 1, _stream_readable$1 = ne;
  var c;
  ne.ReadableState = ie, requireEvents().EventEmitter;
  var a = function(z, fe) {
    return z.listeners(fe).length;
  }, h = requireStreamBrowser$1(), f = requireDist().Buffer, p = (typeof commonjsGlobal < "u" ? commonjsGlobal : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function r(G) {
    return f.from(G);
  }
  function u(G) {
    return f.isBuffer(G) || G instanceof p;
  }
  var o = requireUtil$1(), t;
  o && o.debuglog ? t = o.debuglog("stream") : t = function() {
  };
  var n = requireBuffer_list(), e = requireDestroy$1(), s = requireState(), d = s.getHighWaterMark, v = requireErrorsBrowser().codes, y = v.ERR_INVALID_ARG_TYPE, m = v.ERR_STREAM_PUSH_AFTER_EOF, B = v.ERR_METHOD_NOT_IMPLEMENTED, E = v.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, S, O, D;
  requireInherits_browser()(ne, h);
  var $ = e.errorOrDestroy, V = ["error", "close", "destroy", "pause", "resume"];
  function J(G, z, fe) {
    if (typeof G.prependListener == "function") return G.prependListener(z, fe);
    !G._events || !G._events[z] ? G.on(z, fe) : Array.isArray(G._events[z]) ? G._events[z].unshift(fe) : G._events[z] = [fe, G._events[z]];
  }
  function ie(G, z, fe) {
    c = c || require_stream_duplex$1(), G = G || {}, typeof fe != "boolean" && (fe = z instanceof c), this.objectMode = !!G.objectMode, fe && (this.objectMode = this.objectMode || !!G.readableObjectMode), this.highWaterMark = d(this, G, "readableHighWaterMark", fe), this.buffer = new n(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = G.emitClose !== !1, this.autoDestroy = !!G.autoDestroy, this.destroyed = !1, this.defaultEncoding = G.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, G.encoding && (S || (S = requireString_decoder().StringDecoder), this.decoder = new S(G.encoding), this.encoding = G.encoding);
  }
  function ne(G) {
    if (c = c || require_stream_duplex$1(), !(this instanceof ne)) return new ne(G);
    var z = this instanceof c;
    this._readableState = new ie(G, this, z), this.readable = !0, G && (typeof G.read == "function" && (this._read = G.read), typeof G.destroy == "function" && (this._destroy = G.destroy)), h.call(this);
  }
  Object.defineProperty(ne.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(z) {
      this._readableState && (this._readableState.destroyed = z);
    }
  }), ne.prototype.destroy = e.destroy, ne.prototype._undestroy = e.undestroy, ne.prototype._destroy = function(G, z) {
    z(G);
  }, ne.prototype.push = function(G, z) {
    var fe = this._readableState, me;
    return fe.objectMode ? me = !0 : typeof G == "string" && (z = z || fe.defaultEncoding, z !== fe.encoding && (G = f.from(G, z), z = ""), me = !0), le(this, G, z, !1, me);
  }, ne.prototype.unshift = function(G) {
    return le(this, G, null, !0, !1);
  };
  function le(G, z, fe, me, xe) {
    t("readableAddChunk", z);
    var _e = G._readableState;
    if (z === null)
      _e.reading = !1, A(G, _e);
    else {
      var Be;
      if (xe || (Be = b(_e, z)), Be)
        $(G, Be);
      else if (_e.objectMode || z && z.length > 0)
        if (typeof z != "string" && !_e.objectMode && Object.getPrototypeOf(z) !== f.prototype && (z = r(z)), me)
          _e.endEmitted ? $(G, new E()) : Y(G, _e, z, !0);
        else if (_e.ended)
          $(G, new m());
        else {
          if (_e.destroyed)
            return !1;
          _e.reading = !1, _e.decoder && !fe ? (z = _e.decoder.write(z), _e.objectMode || z.length !== 0 ? Y(G, _e, z, !1) : R(G, _e)) : Y(G, _e, z, !1);
        }
      else me || (_e.reading = !1, R(G, _e));
    }
    return !_e.ended && (_e.length < _e.highWaterMark || _e.length === 0);
  }
  function Y(G, z, fe, me) {
    z.flowing && z.length === 0 && !z.sync ? (z.awaitDrain = 0, G.emit("data", fe)) : (z.length += z.objectMode ? 1 : fe.length, me ? z.buffer.unshift(fe) : z.buffer.push(fe), z.needReadable && q(G)), R(G, z);
  }
  function b(G, z) {
    var fe;
    return !u(z) && typeof z != "string" && z !== void 0 && !G.objectMode && (fe = new y("chunk", ["string", "Buffer", "Uint8Array"], z)), fe;
  }
  ne.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, ne.prototype.setEncoding = function(G) {
    S || (S = requireString_decoder().StringDecoder);
    var z = new S(G);
    this._readableState.decoder = z, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var fe = this._readableState.buffer.head, me = ""; fe !== null; )
      me += z.write(fe.data), fe = fe.next;
    return this._readableState.buffer.clear(), me !== "" && this._readableState.buffer.push(me), this._readableState.length = me.length, this;
  };
  var g = 1073741824;
  function l(G) {
    return G >= g ? G = g : (G--, G |= G >>> 1, G |= G >>> 2, G |= G >>> 4, G |= G >>> 8, G |= G >>> 16, G++), G;
  }
  function _(G, z) {
    return G <= 0 || z.length === 0 && z.ended ? 0 : z.objectMode ? 1 : G !== G ? z.flowing && z.length ? z.buffer.head.data.length : z.length : (G > z.highWaterMark && (z.highWaterMark = l(G)), G <= z.length ? G : z.ended ? z.length : (z.needReadable = !0, 0));
  }
  ne.prototype.read = function(G) {
    t("read", G), G = parseInt(G, 10);
    var z = this._readableState, fe = G;
    if (G !== 0 && (z.emittedReadable = !1), G === 0 && z.needReadable && ((z.highWaterMark !== 0 ? z.length >= z.highWaterMark : z.length > 0) || z.ended))
      return t("read: emitReadable", z.length, z.ended), z.length === 0 && z.ended ? F(this) : q(this), null;
    if (G = _(G, z), G === 0 && z.ended)
      return z.length === 0 && F(this), null;
    var me = z.needReadable;
    t("need readable", me), (z.length === 0 || z.length - G < z.highWaterMark) && (me = !0, t("length less than watermark", me)), z.ended || z.reading ? (me = !1, t("reading or ended", me)) : me && (t("do read"), z.reading = !0, z.sync = !0, z.length === 0 && (z.needReadable = !0), this._read(z.highWaterMark), z.sync = !1, z.reading || (G = _(fe, z)));
    var xe;
    return G > 0 ? xe = N(G, z) : xe = null, xe === null ? (z.needReadable = z.length <= z.highWaterMark, G = 0) : (z.length -= G, z.awaitDrain = 0), z.length === 0 && (z.ended || (z.needReadable = !0), fe !== G && z.ended && F(this)), xe !== null && this.emit("data", xe), xe;
  };
  function A(G, z) {
    if (t("onEofChunk"), !z.ended) {
      if (z.decoder) {
        var fe = z.decoder.end();
        fe && fe.length && (z.buffer.push(fe), z.length += z.objectMode ? 1 : fe.length);
      }
      z.ended = !0, z.sync ? q(G) : (z.needReadable = !1, z.emittedReadable || (z.emittedReadable = !0, P(G)));
    }
  }
  function q(G) {
    var z = G._readableState;
    t("emitReadable", z.needReadable, z.emittedReadable), z.needReadable = !1, z.emittedReadable || (t("emitReadable", z.flowing), z.emittedReadable = !0, process$1.nextTick(P, G));
  }
  function P(G) {
    var z = G._readableState;
    t("emitReadable_", z.destroyed, z.length, z.ended), !z.destroyed && (z.length || z.ended) && (G.emit("readable"), z.emittedReadable = !1), z.needReadable = !z.flowing && !z.ended && z.length <= z.highWaterMark, U(G);
  }
  function R(G, z) {
    z.readingMore || (z.readingMore = !0, process$1.nextTick(w, G, z));
  }
  function w(G, z) {
    for (; !z.reading && !z.ended && (z.length < z.highWaterMark || z.flowing && z.length === 0); ) {
      var fe = z.length;
      if (t("maybeReadMore read 0"), G.read(0), fe === z.length)
        break;
    }
    z.readingMore = !1;
  }
  ne.prototype._read = function(G) {
    $(this, new B("_read()"));
  }, ne.prototype.pipe = function(G, z) {
    var fe = this, me = this._readableState;
    switch (me.pipesCount) {
      case 0:
        me.pipes = G;
        break;
      case 1:
        me.pipes = [me.pipes, G];
        break;
      default:
        me.pipes.push(G);
        break;
    }
    me.pipesCount += 1, t("pipe count=%d opts=%j", me.pipesCount, z);
    var xe = (!z || z.end !== !1) && G !== process$1.stdout && G !== process$1.stderr, _e = xe ? Ae : ge;
    me.endEmitted ? process$1.nextTick(_e) : fe.once("end", _e), G.on("unpipe", Be);
    function Be(we, Se) {
      t("onunpipe"), we === fe && Se && Se.hasUnpiped === !1 && (Se.hasUnpiped = !0, qe());
    }
    function Ae() {
      t("onend"), G.end();
    }
    var be = M(fe);
    G.on("drain", be);
    var Fe = !1;
    function qe() {
      t("cleanup"), G.removeListener("close", oe), G.removeListener("finish", ce), G.removeListener("drain", be), G.removeListener("error", Te), G.removeListener("unpipe", Be), fe.removeListener("end", Ae), fe.removeListener("end", ge), fe.removeListener("data", Me), Fe = !0, me.awaitDrain && (!G._writableState || G._writableState.needDrain) && be();
    }
    fe.on("data", Me);
    function Me(we) {
      t("ondata");
      var Se = G.write(we);
      t("dest.write", Se), Se === !1 && ((me.pipesCount === 1 && me.pipes === G || me.pipesCount > 1 && ae(me.pipes, G) !== -1) && !Fe && (t("false write response, pause", me.awaitDrain), me.awaitDrain++), fe.pause());
    }
    function Te(we) {
      t("onerror", we), ge(), G.removeListener("error", Te), a(G, "error") === 0 && $(G, we);
    }
    J(G, "error", Te);
    function oe() {
      G.removeListener("finish", ce), ge();
    }
    G.once("close", oe);
    function ce() {
      t("onfinish"), G.removeListener("close", oe), ge();
    }
    G.once("finish", ce);
    function ge() {
      t("unpipe"), fe.unpipe(G);
    }
    return G.emit("pipe", fe), me.flowing || (t("pipe resume"), fe.resume()), G;
  };
  function M(G) {
    return function() {
      var fe = G._readableState;
      t("pipeOnDrain", fe.awaitDrain), fe.awaitDrain && fe.awaitDrain--, fe.awaitDrain === 0 && a(G, "data") && (fe.flowing = !0, U(G));
    };
  }
  ne.prototype.unpipe = function(G) {
    var z = this._readableState, fe = {
      hasUnpiped: !1
    };
    if (z.pipesCount === 0) return this;
    if (z.pipesCount === 1)
      return G && G !== z.pipes ? this : (G || (G = z.pipes), z.pipes = null, z.pipesCount = 0, z.flowing = !1, G && G.emit("unpipe", this, fe), this);
    if (!G) {
      var me = z.pipes, xe = z.pipesCount;
      z.pipes = null, z.pipesCount = 0, z.flowing = !1;
      for (var _e = 0; _e < xe; _e++) me[_e].emit("unpipe", this, {
        hasUnpiped: !1
      });
      return this;
    }
    var Be = ae(z.pipes, G);
    return Be === -1 ? this : (z.pipes.splice(Be, 1), z.pipesCount -= 1, z.pipesCount === 1 && (z.pipes = z.pipes[0]), G.emit("unpipe", this, fe), this);
  }, ne.prototype.on = function(G, z) {
    var fe = h.prototype.on.call(this, G, z), me = this._readableState;
    return G === "data" ? (me.readableListening = this.listenerCount("readable") > 0, me.flowing !== !1 && this.resume()) : G === "readable" && !me.endEmitted && !me.readableListening && (me.readableListening = me.needReadable = !0, me.flowing = !1, me.emittedReadable = !1, t("on readable", me.length, me.reading), me.length ? q(this) : me.reading || process$1.nextTick(L, this)), fe;
  }, ne.prototype.addListener = ne.prototype.on, ne.prototype.removeListener = function(G, z) {
    var fe = h.prototype.removeListener.call(this, G, z);
    return G === "readable" && process$1.nextTick(x, this), fe;
  }, ne.prototype.removeAllListeners = function(G) {
    var z = h.prototype.removeAllListeners.apply(this, arguments);
    return (G === "readable" || G === void 0) && process$1.nextTick(x, this), z;
  };
  function x(G) {
    var z = G._readableState;
    z.readableListening = G.listenerCount("readable") > 0, z.resumeScheduled && !z.paused ? z.flowing = !0 : G.listenerCount("data") > 0 && G.resume();
  }
  function L(G) {
    t("readable nexttick read 0"), G.read(0);
  }
  ne.prototype.resume = function() {
    var G = this._readableState;
    return G.flowing || (t("resume"), G.flowing = !G.readableListening, K(this, G)), G.paused = !1, this;
  };
  function K(G, z) {
    z.resumeScheduled || (z.resumeScheduled = !0, process$1.nextTick(Q, G, z));
  }
  function Q(G, z) {
    t("resume", z.reading), z.reading || G.read(0), z.resumeScheduled = !1, G.emit("resume"), U(G), z.flowing && !z.reading && G.read(0);
  }
  ne.prototype.pause = function() {
    return t("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (t("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function U(G) {
    var z = G._readableState;
    for (t("flow", z.flowing); z.flowing && G.read() !== null; ) ;
  }
  ne.prototype.wrap = function(G) {
    var z = this, fe = this._readableState, me = !1;
    G.on("end", function() {
      if (t("wrapped end"), fe.decoder && !fe.ended) {
        var Be = fe.decoder.end();
        Be && Be.length && z.push(Be);
      }
      z.push(null);
    }), G.on("data", function(Be) {
      if (t("wrapped data"), fe.decoder && (Be = fe.decoder.write(Be)), !(fe.objectMode && Be == null) && !(!fe.objectMode && (!Be || !Be.length))) {
        var Ae = z.push(Be);
        Ae || (me = !0, G.pause());
      }
    });
    for (var xe in G)
      this[xe] === void 0 && typeof G[xe] == "function" && (this[xe] = /* @__PURE__ */ (function(Ae) {
        return function() {
          return G[Ae].apply(G, arguments);
        };
      })(xe));
    for (var _e = 0; _e < V.length; _e++)
      G.on(V[_e], this.emit.bind(this, V[_e]));
    return this._read = function(Be) {
      t("wrapped _read", Be), me && (me = !1, G.resume());
    }, this;
  }, typeof Symbol == "function" && (ne.prototype[Symbol.asyncIterator] = function() {
    return O === void 0 && (O = requireAsync_iterator()), O(this);
  }), Object.defineProperty(ne.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), Object.defineProperty(ne.prototype, "readableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState && this._readableState.buffer;
    }
  }), Object.defineProperty(ne.prototype, "readableFlowing", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.flowing;
    },
    set: function(z) {
      this._readableState && (this._readableState.flowing = z);
    }
  }), ne._fromList = N, Object.defineProperty(ne.prototype, "readableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.length;
    }
  });
  function N(G, z) {
    if (z.length === 0) return null;
    var fe;
    return z.objectMode ? fe = z.buffer.shift() : !G || G >= z.length ? (z.decoder ? fe = z.buffer.join("") : z.buffer.length === 1 ? fe = z.buffer.first() : fe = z.buffer.concat(z.length), z.buffer.clear()) : fe = z.buffer.consume(G, z.decoder), fe;
  }
  function F(G) {
    var z = G._readableState;
    t("endReadable", z.endEmitted), z.endEmitted || (z.ended = !0, process$1.nextTick(ee, z, G));
  }
  function ee(G, z) {
    if (t("endReadableNT", G.endEmitted, G.length), !G.endEmitted && G.length === 0 && (G.endEmitted = !0, z.readable = !1, z.emit("end"), G.autoDestroy)) {
      var fe = z._writableState;
      (!fe || fe.autoDestroy && fe.finished) && z.destroy();
    }
  }
  typeof Symbol == "function" && (ne.from = function(G, z) {
    return D === void 0 && (D = requireFromBrowser()), D(ne, G, z);
  });
  function ae(G, z) {
    for (var fe = 0, me = G.length; fe < me; fe++)
      if (G[fe] === z) return fe;
    return -1;
  }
  return _stream_readable$1;
}
var _stream_transform$1, hasRequired_stream_transform$1;
function require_stream_transform$1() {
  if (hasRequired_stream_transform$1) return _stream_transform$1;
  hasRequired_stream_transform$1 = 1, _stream_transform$1 = o;
  var c = requireErrorsBrowser().codes, a = c.ERR_METHOD_NOT_IMPLEMENTED, h = c.ERR_MULTIPLE_CALLBACK, f = c.ERR_TRANSFORM_ALREADY_TRANSFORMING, p = c.ERR_TRANSFORM_WITH_LENGTH_0, r = require_stream_duplex$1();
  requireInherits_browser()(o, r);
  function u(e, s) {
    var d = this._transformState;
    d.transforming = !1;
    var v = d.writecb;
    if (v === null)
      return this.emit("error", new h());
    d.writechunk = null, d.writecb = null, s != null && this.push(s), v(e);
    var y = this._readableState;
    y.reading = !1, (y.needReadable || y.length < y.highWaterMark) && this._read(y.highWaterMark);
  }
  function o(e) {
    if (!(this instanceof o)) return new o(e);
    r.call(this, e), this._transformState = {
      afterTransform: u.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && (typeof e.transform == "function" && (this._transform = e.transform), typeof e.flush == "function" && (this._flush = e.flush)), this.on("prefinish", t);
  }
  function t() {
    var e = this;
    typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(s, d) {
      n(e, s, d);
    }) : n(this, null, null);
  }
  o.prototype.push = function(e, s) {
    return this._transformState.needTransform = !1, r.prototype.push.call(this, e, s);
  }, o.prototype._transform = function(e, s, d) {
    d(new a("_transform()"));
  }, o.prototype._write = function(e, s, d) {
    var v = this._transformState;
    if (v.writecb = d, v.writechunk = e, v.writeencoding = s, !v.transforming) {
      var y = this._readableState;
      (v.needTransform || y.needReadable || y.length < y.highWaterMark) && this._read(y.highWaterMark);
    }
  }, o.prototype._read = function(e) {
    var s = this._transformState;
    s.writechunk !== null && !s.transforming ? (s.transforming = !0, this._transform(s.writechunk, s.writeencoding, s.afterTransform)) : s.needTransform = !0;
  }, o.prototype._destroy = function(e, s) {
    r.prototype._destroy.call(this, e, function(d) {
      s(d);
    });
  };
  function n(e, s, d) {
    if (s) return e.emit("error", s);
    if (d != null && e.push(d), e._writableState.length) throw new p();
    if (e._transformState.transforming) throw new f();
    return e.push(null);
  }
  return _stream_transform$1;
}
var _stream_passthrough$1, hasRequired_stream_passthrough$1;
function require_stream_passthrough$1() {
  if (hasRequired_stream_passthrough$1) return _stream_passthrough$1;
  hasRequired_stream_passthrough$1 = 1, _stream_passthrough$1 = a;
  var c = require_stream_transform$1();
  requireInherits_browser()(a, c);
  function a(h) {
    if (!(this instanceof a)) return new a(h);
    c.call(this, h);
  }
  return a.prototype._transform = function(h, f, p) {
    p(null, h);
  }, _stream_passthrough$1;
}
var pipeline_1, hasRequiredPipeline;
function requirePipeline() {
  if (hasRequiredPipeline) return pipeline_1;
  hasRequiredPipeline = 1;
  var c;
  function a(d) {
    var v = !1;
    return function() {
      v || (v = !0, d.apply(void 0, arguments));
    };
  }
  var h = requireErrorsBrowser().codes, f = h.ERR_MISSING_ARGS, p = h.ERR_STREAM_DESTROYED;
  function r(d) {
    if (d) throw d;
  }
  function u(d) {
    return d.setHeader && typeof d.abort == "function";
  }
  function o(d, v, y, m) {
    m = a(m);
    var B = !1;
    d.on("close", function() {
      B = !0;
    }), c === void 0 && (c = requireEndOfStream()), c(d, {
      readable: v,
      writable: y
    }, function(S) {
      if (S) return m(S);
      B = !0, m();
    });
    var E = !1;
    return function(S) {
      if (!B && !E) {
        if (E = !0, u(d)) return d.abort();
        if (typeof d.destroy == "function") return d.destroy();
        m(S || new p("pipe"));
      }
    };
  }
  function t(d) {
    d();
  }
  function n(d, v) {
    return d.pipe(v);
  }
  function e(d) {
    return !d.length || typeof d[d.length - 1] != "function" ? r : d.pop();
  }
  function s() {
    for (var d = arguments.length, v = new Array(d), y = 0; y < d; y++)
      v[y] = arguments[y];
    var m = e(v);
    if (Array.isArray(v[0]) && (v = v[0]), v.length < 2)
      throw new f("streams");
    var B, E = v.map(function(S, O) {
      var D = O < v.length - 1, $ = O > 0;
      return o(S, D, $, function(V) {
        B || (B = V), V && E.forEach(t), !D && (E.forEach(t), m(B));
      });
    });
    return v.reduce(n);
  }
  return pipeline_1 = s, pipeline_1;
}
var streamBrowserify, hasRequiredStreamBrowserify;
function requireStreamBrowserify() {
  if (hasRequiredStreamBrowserify) return streamBrowserify;
  hasRequiredStreamBrowserify = 1, streamBrowserify = h;
  var c = requireEvents().EventEmitter, a = requireInherits_browser();
  a(h, c), h.Readable = require_stream_readable$1(), h.Writable = require_stream_writable$1(), h.Duplex = require_stream_duplex$1(), h.Transform = require_stream_transform$1(), h.PassThrough = require_stream_passthrough$1(), h.finished = requireEndOfStream(), h.pipeline = requirePipeline(), h.Stream = h;
  function h() {
    c.call(this);
  }
  return h.prototype.pipe = function(f, p) {
    var r = this;
    function u(v) {
      f.writable && f.write(v) === !1 && r.pause && r.pause();
    }
    r.on("data", u);
    function o() {
      r.readable && r.resume && r.resume();
    }
    f.on("drain", o), !f._isStdio && (!p || p.end !== !1) && (r.on("end", n), r.on("close", e));
    var t = !1;
    function n() {
      t || (t = !0, f.end());
    }
    function e() {
      t || (t = !0, typeof f.destroy == "function" && f.destroy());
    }
    function s(v) {
      if (d(), c.listenerCount(this, "error") === 0)
        throw v;
    }
    r.on("error", s), f.on("error", s);
    function d() {
      r.removeListener("data", u), f.removeListener("drain", o), r.removeListener("end", n), r.removeListener("close", e), r.removeListener("error", s), f.removeListener("error", s), r.removeListener("end", d), r.removeListener("close", d), f.removeListener("close", d);
    }
    return r.on("end", d), r.on("close", d), f.on("close", d), f.emit("pipe", r), f;
  }, streamBrowserify;
}
var hashBase$1, hasRequiredHashBase$1;
function requireHashBase$1() {
  if (hasRequiredHashBase$1) return hashBase$1;
  hasRequiredHashBase$1 = 1;
  var c = requireSafeBuffer$1().Buffer, a = requireStreamBrowserify().Transform, h = requireInherits_browser();
  function f(o) {
    a.call(this), this._block = c.allocUnsafe(o), this._blockSize = o, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
  }
  h(f, a), f.prototype._transform = function(o, t, n) {
    var e = null;
    try {
      this.update(o, t);
    } catch (s) {
      e = s;
    }
    n(e);
  }, f.prototype._flush = function(o) {
    var t = null;
    try {
      this.push(this.digest());
    } catch (n) {
      t = n;
    }
    o(t);
  };
  var p = typeof Uint8Array < "u", r = typeof ArrayBuffer < "u" && typeof Uint8Array < "u" && ArrayBuffer.isView && (c.prototype instanceof Uint8Array || c.TYPED_ARRAY_SUPPORT);
  function u(o, t) {
    if (o instanceof c) return o;
    if (typeof o == "string") return c.from(o, t);
    if (r && ArrayBuffer.isView(o)) {
      if (o.byteLength === 0) return c.alloc(0);
      var n = c.from(o.buffer, o.byteOffset, o.byteLength);
      if (n.byteLength === o.byteLength) return n;
    }
    if (p && o instanceof Uint8Array || c.isBuffer(o) && o.constructor && typeof o.constructor.isBuffer == "function" && o.constructor.isBuffer(o))
      return c.from(o);
    throw new TypeError('The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView.');
  }
  return f.prototype.update = function(o, t) {
    if (this._finalized) throw new Error("Digest already called");
    o = u(o, t);
    for (var n = this._block, e = 0; this._blockOffset + o.length - e >= this._blockSize; ) {
      for (var s = this._blockOffset; s < this._blockSize; ) n[s++] = o[e++];
      this._update(), this._blockOffset = 0;
    }
    for (; e < o.length; ) n[this._blockOffset++] = o[e++];
    for (var d = 0, v = o.length * 8; v > 0; ++d)
      this._length[d] += v, v = this._length[d] / 4294967296 | 0, v > 0 && (this._length[d] -= 4294967296 * v);
    return this;
  }, f.prototype._update = function() {
    throw new Error("_update is not implemented");
  }, f.prototype.digest = function(o) {
    if (this._finalized) throw new Error("Digest already called");
    this._finalized = !0;
    var t = this._digest();
    o !== void 0 && (t = t.toString(o)), this._block.fill(0), this._blockOffset = 0;
    for (var n = 0; n < 4; ++n) this._length[n] = 0;
    return t;
  }, f.prototype._digest = function() {
    throw new Error("_digest is not implemented");
  }, hashBase$1 = f, hashBase$1;
}
var md5_js, hasRequiredMd5_js;
function requireMd5_js() {
  if (hasRequiredMd5_js) return md5_js;
  hasRequiredMd5_js = 1;
  var c = requireInherits_browser(), a = requireHashBase$1(), h = requireSafeBuffer$1().Buffer, f = new Array(16);
  function p() {
    a.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878;
  }
  c(p, a), p.prototype._update = function() {
    for (var e = f, s = 0; s < 16; ++s) e[s] = this._block.readInt32LE(s * 4);
    var d = this._a, v = this._b, y = this._c, m = this._d;
    d = u(d, v, y, m, e[0], 3614090360, 7), m = u(m, d, v, y, e[1], 3905402710, 12), y = u(y, m, d, v, e[2], 606105819, 17), v = u(v, y, m, d, e[3], 3250441966, 22), d = u(d, v, y, m, e[4], 4118548399, 7), m = u(m, d, v, y, e[5], 1200080426, 12), y = u(y, m, d, v, e[6], 2821735955, 17), v = u(v, y, m, d, e[7], 4249261313, 22), d = u(d, v, y, m, e[8], 1770035416, 7), m = u(m, d, v, y, e[9], 2336552879, 12), y = u(y, m, d, v, e[10], 4294925233, 17), v = u(v, y, m, d, e[11], 2304563134, 22), d = u(d, v, y, m, e[12], 1804603682, 7), m = u(m, d, v, y, e[13], 4254626195, 12), y = u(y, m, d, v, e[14], 2792965006, 17), v = u(v, y, m, d, e[15], 1236535329, 22), d = o(d, v, y, m, e[1], 4129170786, 5), m = o(m, d, v, y, e[6], 3225465664, 9), y = o(y, m, d, v, e[11], 643717713, 14), v = o(v, y, m, d, e[0], 3921069994, 20), d = o(d, v, y, m, e[5], 3593408605, 5), m = o(m, d, v, y, e[10], 38016083, 9), y = o(y, m, d, v, e[15], 3634488961, 14), v = o(v, y, m, d, e[4], 3889429448, 20), d = o(d, v, y, m, e[9], 568446438, 5), m = o(m, d, v, y, e[14], 3275163606, 9), y = o(y, m, d, v, e[3], 4107603335, 14), v = o(v, y, m, d, e[8], 1163531501, 20), d = o(d, v, y, m, e[13], 2850285829, 5), m = o(m, d, v, y, e[2], 4243563512, 9), y = o(y, m, d, v, e[7], 1735328473, 14), v = o(v, y, m, d, e[12], 2368359562, 20), d = t(d, v, y, m, e[5], 4294588738, 4), m = t(m, d, v, y, e[8], 2272392833, 11), y = t(y, m, d, v, e[11], 1839030562, 16), v = t(v, y, m, d, e[14], 4259657740, 23), d = t(d, v, y, m, e[1], 2763975236, 4), m = t(m, d, v, y, e[4], 1272893353, 11), y = t(y, m, d, v, e[7], 4139469664, 16), v = t(v, y, m, d, e[10], 3200236656, 23), d = t(d, v, y, m, e[13], 681279174, 4), m = t(m, d, v, y, e[0], 3936430074, 11), y = t(y, m, d, v, e[3], 3572445317, 16), v = t(v, y, m, d, e[6], 76029189, 23), d = t(d, v, y, m, e[9], 3654602809, 4), m = t(m, d, v, y, e[12], 3873151461, 11), y = t(y, m, d, v, e[15], 530742520, 16), v = t(v, y, m, d, e[2], 3299628645, 23), d = n(d, v, y, m, e[0], 4096336452, 6), m = n(m, d, v, y, e[7], 1126891415, 10), y = n(y, m, d, v, e[14], 2878612391, 15), v = n(v, y, m, d, e[5], 4237533241, 21), d = n(d, v, y, m, e[12], 1700485571, 6), m = n(m, d, v, y, e[3], 2399980690, 10), y = n(y, m, d, v, e[10], 4293915773, 15), v = n(v, y, m, d, e[1], 2240044497, 21), d = n(d, v, y, m, e[8], 1873313359, 6), m = n(m, d, v, y, e[15], 4264355552, 10), y = n(y, m, d, v, e[6], 2734768916, 15), v = n(v, y, m, d, e[13], 1309151649, 21), d = n(d, v, y, m, e[4], 4149444226, 6), m = n(m, d, v, y, e[11], 3174756917, 10), y = n(y, m, d, v, e[2], 718787259, 15), v = n(v, y, m, d, e[9], 3951481745, 21), this._a = this._a + d | 0, this._b = this._b + v | 0, this._c = this._c + y | 0, this._d = this._d + m | 0;
  }, p.prototype._digest = function() {
    this._block[this._blockOffset++] = 128, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
    var e = h.allocUnsafe(16);
    return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e;
  };
  function r(e, s) {
    return e << s | e >>> 32 - s;
  }
  function u(e, s, d, v, y, m, B) {
    return r(e + (s & d | ~s & v) + y + m | 0, B) + s | 0;
  }
  function o(e, s, d, v, y, m, B) {
    return r(e + (s & v | d & ~v) + y + m | 0, B) + s | 0;
  }
  function t(e, s, d, v, y, m, B) {
    return r(e + (s ^ d ^ v) + y + m | 0, B) + s | 0;
  }
  function n(e, s, d, v, y, m, B) {
    return r(e + (d ^ (s | ~v)) + y + m | 0, B) + s | 0;
  }
  return md5_js = p, md5_js;
}
var isarray$1, hasRequiredIsarray$1;
function requireIsarray$1() {
  if (hasRequiredIsarray$1) return isarray$1;
  hasRequiredIsarray$1 = 1;
  var c = {}.toString;
  return isarray$1 = Array.isArray || function(a) {
    return c.call(a) == "[object Array]";
  }, isarray$1;
}
var typedArrayBuffer, hasRequiredTypedArrayBuffer;
function requireTypedArrayBuffer() {
  if (hasRequiredTypedArrayBuffer) return typedArrayBuffer;
  hasRequiredTypedArrayBuffer = 1;
  var c = /* @__PURE__ */ requireType(), a = /* @__PURE__ */ requireCallBound$1(), h = a("TypedArray.prototype.buffer", !0), f = /* @__PURE__ */ requireIsTypedArray();
  return typedArrayBuffer = h || function(r) {
    if (!f(r))
      throw new c("Not a Typed Array");
    return r.buffer;
  }, typedArrayBuffer;
}
var toBuffer, hasRequiredToBuffer$2;
function requireToBuffer$2() {
  if (hasRequiredToBuffer$2) return toBuffer;
  hasRequiredToBuffer$2 = 1;
  var c = requireSafeBuffer$1().Buffer, a = requireIsarray$1(), h = /* @__PURE__ */ requireTypedArrayBuffer(), f = ArrayBuffer.isView || function(t) {
    try {
      return h(t), !0;
    } catch {
      return !1;
    }
  }, p = typeof Uint8Array < "u", r = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", u = r && (c.prototype instanceof Uint8Array || c.TYPED_ARRAY_SUPPORT);
  return toBuffer = function(t, n) {
    if (c.isBuffer(t))
      return t.constructor && !("isBuffer" in t) ? c.from(t) : t;
    if (typeof t == "string")
      return c.from(t, n);
    if (r && f(t)) {
      if (t.byteLength === 0)
        return c.alloc(0);
      if (u) {
        var e = c.from(t.buffer, t.byteOffset, t.byteLength);
        if (e.byteLength === t.byteLength)
          return e;
      }
      var s = t instanceof Uint8Array ? t : new Uint8Array(t.buffer, t.byteOffset, t.byteLength), d = c.from(s);
      if (d.length === t.byteLength)
        return d;
    }
    if (p && t instanceof Uint8Array)
      return c.from(t);
    var v = a(t);
    if (v)
      for (var y = 0; y < t.length; y += 1) {
        var m = t[y];
        if (typeof m != "number" || m < 0 || m > 255 || ~~m !== m)
          throw new RangeError("Array items must be numbers in the range 0-255.");
      }
    if (v || c.isBuffer(t) && t.constructor && typeof t.constructor.isBuffer == "function" && t.constructor.isBuffer(t))
      return c.from(t);
    throw new TypeError('The "data" argument must be a string, an Array, a Buffer, a Uint8Array, or a DataView.');
  }, toBuffer;
}
var toBuffer_1$1, hasRequiredToBuffer$1;
function requireToBuffer$1() {
  if (hasRequiredToBuffer$1) return toBuffer_1$1;
  hasRequiredToBuffer$1 = 1;
  var c = requireSafeBuffer$1().Buffer, a = /* @__PURE__ */ requireToBuffer$2(), h = typeof Uint8Array < "u", f = h && typeof ArrayBuffer < "u", p = f && ArrayBuffer.isView;
  return toBuffer_1$1 = function(r, u) {
    if (typeof r == "string" || c.isBuffer(r) || h && r instanceof Uint8Array || p && p(r))
      return a(r, u);
    throw new TypeError('The "data" argument must be a string, a Buffer, a Uint8Array, or a DataView');
  }, toBuffer_1$1;
}
var readableBrowser = { exports: {} }, processNextickArgs = { exports: {} }, hasRequiredProcessNextickArgs;
function requireProcessNextickArgs() {
  if (hasRequiredProcessNextickArgs) return processNextickArgs.exports;
  hasRequiredProcessNextickArgs = 1, typeof process$1 > "u" || !process$1.version || process$1.version.indexOf("v0.") === 0 || process$1.version.indexOf("v1.") === 0 && process$1.version.indexOf("v1.8.") !== 0 ? processNextickArgs.exports = { nextTick: c } : processNextickArgs.exports = process$1;
  function c(a, h, f, p) {
    if (typeof a != "function")
      throw new TypeError('"callback" argument must be a function');
    var r = arguments.length, u, o;
    switch (r) {
      case 0:
      case 1:
        return process$1.nextTick(a);
      case 2:
        return process$1.nextTick(function() {
          a.call(null, h);
        });
      case 3:
        return process$1.nextTick(function() {
          a.call(null, h, f);
        });
      case 4:
        return process$1.nextTick(function() {
          a.call(null, h, f, p);
        });
      default:
        for (u = new Array(r - 1), o = 0; o < u.length; )
          u[o++] = arguments[o];
        return process$1.nextTick(function() {
          a.apply(null, u);
        });
    }
  }
  return processNextickArgs.exports;
}
var isarray, hasRequiredIsarray;
function requireIsarray() {
  if (hasRequiredIsarray) return isarray;
  hasRequiredIsarray = 1;
  var c = {}.toString;
  return isarray = Array.isArray || function(a) {
    return c.call(a) == "[object Array]";
  }, isarray;
}
var streamBrowser, hasRequiredStreamBrowser;
function requireStreamBrowser() {
  return hasRequiredStreamBrowser || (hasRequiredStreamBrowser = 1, streamBrowser = requireEvents().EventEmitter), streamBrowser;
}
var safeBuffer = { exports: {} }, hasRequiredSafeBuffer;
function requireSafeBuffer() {
  return hasRequiredSafeBuffer || (hasRequiredSafeBuffer = 1, (function(c, a) {
    var h = requireDist(), f = h.Buffer;
    function p(u, o) {
      for (var t in u)
        o[t] = u[t];
    }
    f.from && f.alloc && f.allocUnsafe && f.allocUnsafeSlow ? c.exports = h : (p(h, a), a.Buffer = r);
    function r(u, o, t) {
      return f(u, o, t);
    }
    p(f, r), r.from = function(u, o, t) {
      if (typeof u == "number")
        throw new TypeError("Argument must not be a number");
      return f(u, o, t);
    }, r.alloc = function(u, o, t) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      var n = f(u);
      return o !== void 0 ? typeof t == "string" ? n.fill(o, t) : n.fill(o) : n.fill(0), n;
    }, r.allocUnsafe = function(u) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      return f(u);
    }, r.allocUnsafeSlow = function(u) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      return h.SlowBuffer(u);
    };
  })(safeBuffer, safeBuffer.exports)), safeBuffer.exports;
}
var util = {}, hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  function c(m) {
    return Array.isArray ? Array.isArray(m) : y(m) === "[object Array]";
  }
  util.isArray = c;
  function a(m) {
    return typeof m == "boolean";
  }
  util.isBoolean = a;
  function h(m) {
    return m === null;
  }
  util.isNull = h;
  function f(m) {
    return m == null;
  }
  util.isNullOrUndefined = f;
  function p(m) {
    return typeof m == "number";
  }
  util.isNumber = p;
  function r(m) {
    return typeof m == "string";
  }
  util.isString = r;
  function u(m) {
    return typeof m == "symbol";
  }
  util.isSymbol = u;
  function o(m) {
    return m === void 0;
  }
  util.isUndefined = o;
  function t(m) {
    return y(m) === "[object RegExp]";
  }
  util.isRegExp = t;
  function n(m) {
    return typeof m == "object" && m !== null;
  }
  util.isObject = n;
  function e(m) {
    return y(m) === "[object Date]";
  }
  util.isDate = e;
  function s(m) {
    return y(m) === "[object Error]" || m instanceof Error;
  }
  util.isError = s;
  function d(m) {
    return typeof m == "function";
  }
  util.isFunction = d;
  function v(m) {
    return m === null || typeof m == "boolean" || typeof m == "number" || typeof m == "string" || typeof m == "symbol" || // ES6 symbol
    typeof m > "u";
  }
  util.isPrimitive = v, util.isBuffer = requireDist().Buffer.isBuffer;
  function y(m) {
    return Object.prototype.toString.call(m);
  }
  return util;
}
var BufferList = { exports: {} }, hasRequiredBufferList;
function requireBufferList() {
  return hasRequiredBufferList || (hasRequiredBufferList = 1, (function(c) {
    function a(r, u) {
      if (!(r instanceof u))
        throw new TypeError("Cannot call a class as a function");
    }
    var h = requireSafeBuffer().Buffer, f = requireUtil$1();
    function p(r, u, o) {
      r.copy(u, o);
    }
    c.exports = (function() {
      function r() {
        a(this, r), this.head = null, this.tail = null, this.length = 0;
      }
      return r.prototype.push = function(o) {
        var t = { data: o, next: null };
        this.length > 0 ? this.tail.next = t : this.head = t, this.tail = t, ++this.length;
      }, r.prototype.unshift = function(o) {
        var t = { data: o, next: this.head };
        this.length === 0 && (this.tail = t), this.head = t, ++this.length;
      }, r.prototype.shift = function() {
        if (this.length !== 0) {
          var o = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, o;
        }
      }, r.prototype.clear = function() {
        this.head = this.tail = null, this.length = 0;
      }, r.prototype.join = function(o) {
        if (this.length === 0) return "";
        for (var t = this.head, n = "" + t.data; t = t.next; )
          n += o + t.data;
        return n;
      }, r.prototype.concat = function(o) {
        if (this.length === 0) return h.alloc(0);
        for (var t = h.allocUnsafe(o >>> 0), n = this.head, e = 0; n; )
          p(n.data, t, e), e += n.data.length, n = n.next;
        return t;
      }, r;
    })(), f && f.inspect && f.inspect.custom && (c.exports.prototype[f.inspect.custom] = function() {
      var r = f.inspect({ length: this.length });
      return this.constructor.name + " " + r;
    });
  })(BufferList)), BufferList.exports;
}
var destroy_1, hasRequiredDestroy;
function requireDestroy() {
  if (hasRequiredDestroy) return destroy_1;
  hasRequiredDestroy = 1;
  var c = requireProcessNextickArgs();
  function a(p, r) {
    var u = this, o = this._readableState && this._readableState.destroyed, t = this._writableState && this._writableState.destroyed;
    return o || t ? (r ? r(p) : p && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, c.nextTick(f, this, p)) : c.nextTick(f, this, p)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(p || null, function(n) {
      !r && n ? u._writableState ? u._writableState.errorEmitted || (u._writableState.errorEmitted = !0, c.nextTick(f, u, n)) : c.nextTick(f, u, n) : r && r(n);
    }), this);
  }
  function h() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
  }
  function f(p, r) {
    p.emit("error", r);
  }
  return destroy_1 = {
    destroy: a,
    undestroy: h
  }, destroy_1;
}
var _stream_writable, hasRequired_stream_writable;
function require_stream_writable() {
  if (hasRequired_stream_writable) return _stream_writable;
  hasRequired_stream_writable = 1;
  var c = requireProcessNextickArgs();
  _stream_writable = m;
  function a(q) {
    var P = this;
    this.next = null, this.entry = null, this.finish = function() {
      A(P, q);
    };
  }
  var h = !process$1.browser && ["v0.10", "v0.9."].indexOf(process$1.version.slice(0, 5)) > -1 ? setImmediate : c.nextTick, f;
  m.WritableState = v;
  var p = Object.create(requireUtil());
  p.inherits = requireInherits_browser();
  var r = {
    deprecate: requireBrowser$a()
  }, u = requireStreamBrowser(), o = requireSafeBuffer().Buffer, t = (typeof commonjsGlobal < "u" ? commonjsGlobal : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function n(q) {
    return o.from(q);
  }
  function e(q) {
    return o.isBuffer(q) || q instanceof t;
  }
  var s = requireDestroy();
  p.inherits(m, u);
  function d() {
  }
  function v(q, P) {
    f = f || require_stream_duplex(), q = q || {};
    var R = P instanceof f;
    this.objectMode = !!q.objectMode, R && (this.objectMode = this.objectMode || !!q.writableObjectMode);
    var w = q.highWaterMark, M = q.writableHighWaterMark, x = this.objectMode ? 16 : 16 * 1024;
    w || w === 0 ? this.highWaterMark = w : R && (M || M === 0) ? this.highWaterMark = M : this.highWaterMark = x, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var L = q.decodeStrings === !1;
    this.decodeStrings = !L, this.defaultEncoding = q.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(K) {
      J(P, K);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new a(this);
  }
  v.prototype.getBuffer = function() {
    for (var P = this.bufferedRequest, R = []; P; )
      R.push(P), P = P.next;
    return R;
  }, (function() {
    try {
      Object.defineProperty(v.prototype, "buffer", {
        get: r.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  })();
  var y;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (y = Function.prototype[Symbol.hasInstance], Object.defineProperty(m, Symbol.hasInstance, {
    value: function(q) {
      return y.call(this, q) ? !0 : this !== m ? !1 : q && q._writableState instanceof v;
    }
  })) : y = function(q) {
    return q instanceof this;
  };
  function m(q) {
    if (f = f || require_stream_duplex(), !y.call(m, this) && !(this instanceof f))
      return new m(q);
    this._writableState = new v(q, this), this.writable = !0, q && (typeof q.write == "function" && (this._write = q.write), typeof q.writev == "function" && (this._writev = q.writev), typeof q.destroy == "function" && (this._destroy = q.destroy), typeof q.final == "function" && (this._final = q.final)), u.call(this);
  }
  m.prototype.pipe = function() {
    this.emit("error", new Error("Cannot pipe, not readable"));
  };
  function B(q, P) {
    var R = new Error("write after end");
    q.emit("error", R), c.nextTick(P, R);
  }
  function E(q, P, R, w) {
    var M = !0, x = !1;
    return R === null ? x = new TypeError("May not write null values to stream") : typeof R != "string" && R !== void 0 && !P.objectMode && (x = new TypeError("Invalid non-string/buffer chunk")), x && (q.emit("error", x), c.nextTick(w, x), M = !1), M;
  }
  m.prototype.write = function(q, P, R) {
    var w = this._writableState, M = !1, x = !w.objectMode && e(q);
    return x && !o.isBuffer(q) && (q = n(q)), typeof P == "function" && (R = P, P = null), x ? P = "buffer" : P || (P = w.defaultEncoding), typeof R != "function" && (R = d), w.ended ? B(this, R) : (x || E(this, w, q, R)) && (w.pendingcb++, M = O(this, w, x, q, P, R)), M;
  }, m.prototype.cork = function() {
    var q = this._writableState;
    q.corked++;
  }, m.prototype.uncork = function() {
    var q = this._writableState;
    q.corked && (q.corked--, !q.writing && !q.corked && !q.bufferProcessing && q.bufferedRequest && le(this, q));
  }, m.prototype.setDefaultEncoding = function(P) {
    if (typeof P == "string" && (P = P.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((P + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + P);
    return this._writableState.defaultEncoding = P, this;
  };
  function S(q, P, R) {
    return !q.objectMode && q.decodeStrings !== !1 && typeof P == "string" && (P = o.from(P, R)), P;
  }
  Object.defineProperty(m.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function O(q, P, R, w, M, x) {
    if (!R) {
      var L = S(P, w, M);
      w !== L && (R = !0, M = "buffer", w = L);
    }
    var K = P.objectMode ? 1 : w.length;
    P.length += K;
    var Q = P.length < P.highWaterMark;
    if (Q || (P.needDrain = !0), P.writing || P.corked) {
      var U = P.lastBufferedRequest;
      P.lastBufferedRequest = {
        chunk: w,
        encoding: M,
        isBuf: R,
        callback: x,
        next: null
      }, U ? U.next = P.lastBufferedRequest : P.bufferedRequest = P.lastBufferedRequest, P.bufferedRequestCount += 1;
    } else
      D(q, P, !1, K, w, M, x);
    return Q;
  }
  function D(q, P, R, w, M, x, L) {
    P.writelen = w, P.writecb = L, P.writing = !0, P.sync = !0, R ? q._writev(M, P.onwrite) : q._write(M, x, P.onwrite), P.sync = !1;
  }
  function $(q, P, R, w, M) {
    --P.pendingcb, R ? (c.nextTick(M, w), c.nextTick(l, q, P), q._writableState.errorEmitted = !0, q.emit("error", w)) : (M(w), q._writableState.errorEmitted = !0, q.emit("error", w), l(q, P));
  }
  function V(q) {
    q.writing = !1, q.writecb = null, q.length -= q.writelen, q.writelen = 0;
  }
  function J(q, P) {
    var R = q._writableState, w = R.sync, M = R.writecb;
    if (V(R), P) $(q, R, w, P, M);
    else {
      var x = Y(R);
      !x && !R.corked && !R.bufferProcessing && R.bufferedRequest && le(q, R), w ? h(ie, q, R, x, M) : ie(q, R, x, M);
    }
  }
  function ie(q, P, R, w) {
    R || ne(q, P), P.pendingcb--, w(), l(q, P);
  }
  function ne(q, P) {
    P.length === 0 && P.needDrain && (P.needDrain = !1, q.emit("drain"));
  }
  function le(q, P) {
    P.bufferProcessing = !0;
    var R = P.bufferedRequest;
    if (q._writev && R && R.next) {
      var w = P.bufferedRequestCount, M = new Array(w), x = P.corkedRequestsFree;
      x.entry = R;
      for (var L = 0, K = !0; R; )
        M[L] = R, R.isBuf || (K = !1), R = R.next, L += 1;
      M.allBuffers = K, D(q, P, !0, P.length, M, "", x.finish), P.pendingcb++, P.lastBufferedRequest = null, x.next ? (P.corkedRequestsFree = x.next, x.next = null) : P.corkedRequestsFree = new a(P), P.bufferedRequestCount = 0;
    } else {
      for (; R; ) {
        var Q = R.chunk, U = R.encoding, N = R.callback, F = P.objectMode ? 1 : Q.length;
        if (D(q, P, !1, F, Q, U, N), R = R.next, P.bufferedRequestCount--, P.writing)
          break;
      }
      R === null && (P.lastBufferedRequest = null);
    }
    P.bufferedRequest = R, P.bufferProcessing = !1;
  }
  m.prototype._write = function(q, P, R) {
    R(new Error("_write() is not implemented"));
  }, m.prototype._writev = null, m.prototype.end = function(q, P, R) {
    var w = this._writableState;
    typeof q == "function" ? (R = q, q = null, P = null) : typeof P == "function" && (R = P, P = null), q != null && this.write(q, P), w.corked && (w.corked = 1, this.uncork()), w.ending || _(this, w, R);
  };
  function Y(q) {
    return q.ending && q.length === 0 && q.bufferedRequest === null && !q.finished && !q.writing;
  }
  function b(q, P) {
    q._final(function(R) {
      P.pendingcb--, R && q.emit("error", R), P.prefinished = !0, q.emit("prefinish"), l(q, P);
    });
  }
  function g(q, P) {
    !P.prefinished && !P.finalCalled && (typeof q._final == "function" ? (P.pendingcb++, P.finalCalled = !0, c.nextTick(b, q, P)) : (P.prefinished = !0, q.emit("prefinish")));
  }
  function l(q, P) {
    var R = Y(P);
    return R && (g(q, P), P.pendingcb === 0 && (P.finished = !0, q.emit("finish"))), R;
  }
  function _(q, P, R) {
    P.ending = !0, l(q, P), R && (P.finished ? c.nextTick(R) : q.once("finish", R)), P.ended = !0, q.writable = !1;
  }
  function A(q, P, R) {
    var w = q.entry;
    for (q.entry = null; w; ) {
      var M = w.callback;
      P.pendingcb--, M(R), w = w.next;
    }
    P.corkedRequestsFree.next = q;
  }
  return Object.defineProperty(m.prototype, "destroyed", {
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(q) {
      this._writableState && (this._writableState.destroyed = q);
    }
  }), m.prototype.destroy = s.destroy, m.prototype._undestroy = s.undestroy, m.prototype._destroy = function(q, P) {
    this.end(), P(q);
  }, _stream_writable;
}
var _stream_duplex, hasRequired_stream_duplex;
function require_stream_duplex() {
  if (hasRequired_stream_duplex) return _stream_duplex;
  hasRequired_stream_duplex = 1;
  var c = requireProcessNextickArgs(), a = Object.keys || function(s) {
    var d = [];
    for (var v in s)
      d.push(v);
    return d;
  };
  _stream_duplex = t;
  var h = Object.create(requireUtil());
  h.inherits = requireInherits_browser();
  var f = require_stream_readable(), p = require_stream_writable();
  h.inherits(t, f);
  for (var r = a(p.prototype), u = 0; u < r.length; u++) {
    var o = r[u];
    t.prototype[o] || (t.prototype[o] = p.prototype[o]);
  }
  function t(s) {
    if (!(this instanceof t)) return new t(s);
    f.call(this, s), p.call(this, s), s && s.readable === !1 && (this.readable = !1), s && s.writable === !1 && (this.writable = !1), this.allowHalfOpen = !0, s && s.allowHalfOpen === !1 && (this.allowHalfOpen = !1), this.once("end", n);
  }
  Object.defineProperty(t.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function n() {
    this.allowHalfOpen || this._writableState.ended || c.nextTick(e, this);
  }
  function e(s) {
    s.end();
  }
  return Object.defineProperty(t.prototype, "destroyed", {
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(s) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = s, this._writableState.destroyed = s);
    }
  }), t.prototype._destroy = function(s, d) {
    this.push(null), this.end(), c.nextTick(d, s);
  }, _stream_duplex;
}
var _stream_readable, hasRequired_stream_readable;
function require_stream_readable() {
  if (hasRequired_stream_readable) return _stream_readable;
  hasRequired_stream_readable = 1;
  var c = requireProcessNextickArgs();
  _stream_readable = S;
  var a = requireIsarray(), h;
  S.ReadableState = E, requireEvents().EventEmitter;
  var f = function(N, F) {
    return N.listeners(F).length;
  }, p = requireStreamBrowser(), r = requireSafeBuffer().Buffer, u = (typeof commonjsGlobal < "u" ? commonjsGlobal : typeof window < "u" ? window : typeof self < "u" ? self : {}).Uint8Array || function() {
  };
  function o(N) {
    return r.from(N);
  }
  function t(N) {
    return r.isBuffer(N) || N instanceof u;
  }
  var n = Object.create(requireUtil());
  n.inherits = requireInherits_browser();
  var e = requireUtil$1(), s = void 0;
  e && e.debuglog ? s = e.debuglog("stream") : s = function() {
  };
  var d = requireBufferList(), v = requireDestroy(), y;
  n.inherits(S, p);
  var m = ["error", "close", "destroy", "pause", "resume"];
  function B(N, F, ee) {
    if (typeof N.prependListener == "function") return N.prependListener(F, ee);
    !N._events || !N._events[F] ? N.on(F, ee) : a(N._events[F]) ? N._events[F].unshift(ee) : N._events[F] = [ee, N._events[F]];
  }
  function E(N, F) {
    h = h || require_stream_duplex(), N = N || {};
    var ee = F instanceof h;
    this.objectMode = !!N.objectMode, ee && (this.objectMode = this.objectMode || !!N.readableObjectMode);
    var ae = N.highWaterMark, G = N.readableHighWaterMark, z = this.objectMode ? 16 : 16 * 1024;
    ae || ae === 0 ? this.highWaterMark = ae : ee && (G || G === 0) ? this.highWaterMark = G : this.highWaterMark = z, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new d(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = N.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, N.encoding && (y || (y = requireString_decoder().StringDecoder), this.decoder = new y(N.encoding), this.encoding = N.encoding);
  }
  function S(N) {
    if (h = h || require_stream_duplex(), !(this instanceof S)) return new S(N);
    this._readableState = new E(N, this), this.readable = !0, N && (typeof N.read == "function" && (this._read = N.read), typeof N.destroy == "function" && (this._destroy = N.destroy)), p.call(this);
  }
  Object.defineProperty(S.prototype, "destroyed", {
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(N) {
      this._readableState && (this._readableState.destroyed = N);
    }
  }), S.prototype.destroy = v.destroy, S.prototype._undestroy = v.undestroy, S.prototype._destroy = function(N, F) {
    this.push(null), F(N);
  }, S.prototype.push = function(N, F) {
    var ee = this._readableState, ae;
    return ee.objectMode ? ae = !0 : typeof N == "string" && (F = F || ee.defaultEncoding, F !== ee.encoding && (N = r.from(N, F), F = ""), ae = !0), O(this, N, F, !1, ae);
  }, S.prototype.unshift = function(N) {
    return O(this, N, null, !0, !1);
  };
  function O(N, F, ee, ae, G) {
    var z = N._readableState;
    if (F === null)
      z.reading = !1, le(N, z);
    else {
      var fe;
      G || (fe = $(z, F)), fe ? N.emit("error", fe) : z.objectMode || F && F.length > 0 ? (typeof F != "string" && !z.objectMode && Object.getPrototypeOf(F) !== r.prototype && (F = o(F)), ae ? z.endEmitted ? N.emit("error", new Error("stream.unshift() after end event")) : D(N, z, F, !0) : z.ended ? N.emit("error", new Error("stream.push() after EOF")) : (z.reading = !1, z.decoder && !ee ? (F = z.decoder.write(F), z.objectMode || F.length !== 0 ? D(N, z, F, !1) : g(N, z)) : D(N, z, F, !1))) : ae || (z.reading = !1);
    }
    return V(z);
  }
  function D(N, F, ee, ae) {
    F.flowing && F.length === 0 && !F.sync ? (N.emit("data", ee), N.read(0)) : (F.length += F.objectMode ? 1 : ee.length, ae ? F.buffer.unshift(ee) : F.buffer.push(ee), F.needReadable && Y(N)), g(N, F);
  }
  function $(N, F) {
    var ee;
    return !t(F) && typeof F != "string" && F !== void 0 && !N.objectMode && (ee = new TypeError("Invalid non-string/buffer chunk")), ee;
  }
  function V(N) {
    return !N.ended && (N.needReadable || N.length < N.highWaterMark || N.length === 0);
  }
  S.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, S.prototype.setEncoding = function(N) {
    return y || (y = requireString_decoder().StringDecoder), this._readableState.decoder = new y(N), this._readableState.encoding = N, this;
  };
  var J = 8388608;
  function ie(N) {
    return N >= J ? N = J : (N--, N |= N >>> 1, N |= N >>> 2, N |= N >>> 4, N |= N >>> 8, N |= N >>> 16, N++), N;
  }
  function ne(N, F) {
    return N <= 0 || F.length === 0 && F.ended ? 0 : F.objectMode ? 1 : N !== N ? F.flowing && F.length ? F.buffer.head.data.length : F.length : (N > F.highWaterMark && (F.highWaterMark = ie(N)), N <= F.length ? N : F.ended ? F.length : (F.needReadable = !0, 0));
  }
  S.prototype.read = function(N) {
    s("read", N), N = parseInt(N, 10);
    var F = this._readableState, ee = N;
    if (N !== 0 && (F.emittedReadable = !1), N === 0 && F.needReadable && (F.length >= F.highWaterMark || F.ended))
      return s("read: emitReadable", F.length, F.ended), F.length === 0 && F.ended ? K(this) : Y(this), null;
    if (N = ne(N, F), N === 0 && F.ended)
      return F.length === 0 && K(this), null;
    var ae = F.needReadable;
    s("need readable", ae), (F.length === 0 || F.length - N < F.highWaterMark) && (ae = !0, s("length less than watermark", ae)), F.ended || F.reading ? (ae = !1, s("reading or ended", ae)) : ae && (s("do read"), F.reading = !0, F.sync = !0, F.length === 0 && (F.needReadable = !0), this._read(F.highWaterMark), F.sync = !1, F.reading || (N = ne(ee, F)));
    var G;
    return N > 0 ? G = w(N, F) : G = null, G === null ? (F.needReadable = !0, N = 0) : F.length -= N, F.length === 0 && (F.ended || (F.needReadable = !0), ee !== N && F.ended && K(this)), G !== null && this.emit("data", G), G;
  };
  function le(N, F) {
    if (!F.ended) {
      if (F.decoder) {
        var ee = F.decoder.end();
        ee && ee.length && (F.buffer.push(ee), F.length += F.objectMode ? 1 : ee.length);
      }
      F.ended = !0, Y(N);
    }
  }
  function Y(N) {
    var F = N._readableState;
    F.needReadable = !1, F.emittedReadable || (s("emitReadable", F.flowing), F.emittedReadable = !0, F.sync ? c.nextTick(b, N) : b(N));
  }
  function b(N) {
    s("emit readable"), N.emit("readable"), R(N);
  }
  function g(N, F) {
    F.readingMore || (F.readingMore = !0, c.nextTick(l, N, F));
  }
  function l(N, F) {
    for (var ee = F.length; !F.reading && !F.flowing && !F.ended && F.length < F.highWaterMark && (s("maybeReadMore read 0"), N.read(0), ee !== F.length); )
      ee = F.length;
    F.readingMore = !1;
  }
  S.prototype._read = function(N) {
    this.emit("error", new Error("_read() is not implemented"));
  }, S.prototype.pipe = function(N, F) {
    var ee = this, ae = this._readableState;
    switch (ae.pipesCount) {
      case 0:
        ae.pipes = N;
        break;
      case 1:
        ae.pipes = [ae.pipes, N];
        break;
      default:
        ae.pipes.push(N);
        break;
    }
    ae.pipesCount += 1, s("pipe count=%d opts=%j", ae.pipesCount, F);
    var G = (!F || F.end !== !1) && N !== process$1.stdout && N !== process$1.stderr, z = G ? me : Te;
    ae.endEmitted ? c.nextTick(z) : ee.once("end", z), N.on("unpipe", fe);
    function fe(oe, ce) {
      s("onunpipe"), oe === ee && ce && ce.hasUnpiped === !1 && (ce.hasUnpiped = !0, Be());
    }
    function me() {
      s("onend"), N.end();
    }
    var xe = _(ee);
    N.on("drain", xe);
    var _e = !1;
    function Be() {
      s("cleanup"), N.removeListener("close", qe), N.removeListener("finish", Me), N.removeListener("drain", xe), N.removeListener("error", Fe), N.removeListener("unpipe", fe), ee.removeListener("end", me), ee.removeListener("end", Te), ee.removeListener("data", be), _e = !0, ae.awaitDrain && (!N._writableState || N._writableState.needDrain) && xe();
    }
    var Ae = !1;
    ee.on("data", be);
    function be(oe) {
      s("ondata"), Ae = !1;
      var ce = N.write(oe);
      ce === !1 && !Ae && ((ae.pipesCount === 1 && ae.pipes === N || ae.pipesCount > 1 && U(ae.pipes, N) !== -1) && !_e && (s("false write response, pause", ae.awaitDrain), ae.awaitDrain++, Ae = !0), ee.pause());
    }
    function Fe(oe) {
      s("onerror", oe), Te(), N.removeListener("error", Fe), f(N, "error") === 0 && N.emit("error", oe);
    }
    B(N, "error", Fe);
    function qe() {
      N.removeListener("finish", Me), Te();
    }
    N.once("close", qe);
    function Me() {
      s("onfinish"), N.removeListener("close", qe), Te();
    }
    N.once("finish", Me);
    function Te() {
      s("unpipe"), ee.unpipe(N);
    }
    return N.emit("pipe", ee), ae.flowing || (s("pipe resume"), ee.resume()), N;
  };
  function _(N) {
    return function() {
      var F = N._readableState;
      s("pipeOnDrain", F.awaitDrain), F.awaitDrain && F.awaitDrain--, F.awaitDrain === 0 && f(N, "data") && (F.flowing = !0, R(N));
    };
  }
  S.prototype.unpipe = function(N) {
    var F = this._readableState, ee = { hasUnpiped: !1 };
    if (F.pipesCount === 0) return this;
    if (F.pipesCount === 1)
      return N && N !== F.pipes ? this : (N || (N = F.pipes), F.pipes = null, F.pipesCount = 0, F.flowing = !1, N && N.emit("unpipe", this, ee), this);
    if (!N) {
      var ae = F.pipes, G = F.pipesCount;
      F.pipes = null, F.pipesCount = 0, F.flowing = !1;
      for (var z = 0; z < G; z++)
        ae[z].emit("unpipe", this, { hasUnpiped: !1 });
      return this;
    }
    var fe = U(F.pipes, N);
    return fe === -1 ? this : (F.pipes.splice(fe, 1), F.pipesCount -= 1, F.pipesCount === 1 && (F.pipes = F.pipes[0]), N.emit("unpipe", this, ee), this);
  }, S.prototype.on = function(N, F) {
    var ee = p.prototype.on.call(this, N, F);
    if (N === "data")
      this._readableState.flowing !== !1 && this.resume();
    else if (N === "readable") {
      var ae = this._readableState;
      !ae.endEmitted && !ae.readableListening && (ae.readableListening = ae.needReadable = !0, ae.emittedReadable = !1, ae.reading ? ae.length && Y(this) : c.nextTick(A, this));
    }
    return ee;
  }, S.prototype.addListener = S.prototype.on;
  function A(N) {
    s("readable nexttick read 0"), N.read(0);
  }
  S.prototype.resume = function() {
    var N = this._readableState;
    return N.flowing || (s("resume"), N.flowing = !0, q(this, N)), this;
  };
  function q(N, F) {
    F.resumeScheduled || (F.resumeScheduled = !0, c.nextTick(P, N, F));
  }
  function P(N, F) {
    F.reading || (s("resume read 0"), N.read(0)), F.resumeScheduled = !1, F.awaitDrain = 0, N.emit("resume"), R(N), F.flowing && !F.reading && N.read(0);
  }
  S.prototype.pause = function() {
    return s("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (s("pause"), this._readableState.flowing = !1, this.emit("pause")), this;
  };
  function R(N) {
    var F = N._readableState;
    for (s("flow", F.flowing); F.flowing && N.read() !== null; )
      ;
  }
  S.prototype.wrap = function(N) {
    var F = this, ee = this._readableState, ae = !1;
    N.on("end", function() {
      if (s("wrapped end"), ee.decoder && !ee.ended) {
        var fe = ee.decoder.end();
        fe && fe.length && F.push(fe);
      }
      F.push(null);
    }), N.on("data", function(fe) {
      if (s("wrapped data"), ee.decoder && (fe = ee.decoder.write(fe)), !(ee.objectMode && fe == null) && !(!ee.objectMode && (!fe || !fe.length))) {
        var me = F.push(fe);
        me || (ae = !0, N.pause());
      }
    });
    for (var G in N)
      this[G] === void 0 && typeof N[G] == "function" && (this[G] = /* @__PURE__ */ (function(fe) {
        return function() {
          return N[fe].apply(N, arguments);
        };
      })(G));
    for (var z = 0; z < m.length; z++)
      N.on(m[z], this.emit.bind(this, m[z]));
    return this._read = function(fe) {
      s("wrapped _read", fe), ae && (ae = !1, N.resume());
    }, this;
  }, Object.defineProperty(S.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), S._fromList = w;
  function w(N, F) {
    if (F.length === 0) return null;
    var ee;
    return F.objectMode ? ee = F.buffer.shift() : !N || N >= F.length ? (F.decoder ? ee = F.buffer.join("") : F.buffer.length === 1 ? ee = F.buffer.head.data : ee = F.buffer.concat(F.length), F.buffer.clear()) : ee = M(N, F.buffer, F.decoder), ee;
  }
  function M(N, F, ee) {
    var ae;
    return N < F.head.data.length ? (ae = F.head.data.slice(0, N), F.head.data = F.head.data.slice(N)) : N === F.head.data.length ? ae = F.shift() : ae = ee ? x(N, F) : L(N, F), ae;
  }
  function x(N, F) {
    var ee = F.head, ae = 1, G = ee.data;
    for (N -= G.length; ee = ee.next; ) {
      var z = ee.data, fe = N > z.length ? z.length : N;
      if (fe === z.length ? G += z : G += z.slice(0, N), N -= fe, N === 0) {
        fe === z.length ? (++ae, ee.next ? F.head = ee.next : F.head = F.tail = null) : (F.head = ee, ee.data = z.slice(fe));
        break;
      }
      ++ae;
    }
    return F.length -= ae, G;
  }
  function L(N, F) {
    var ee = r.allocUnsafe(N), ae = F.head, G = 1;
    for (ae.data.copy(ee), N -= ae.data.length; ae = ae.next; ) {
      var z = ae.data, fe = N > z.length ? z.length : N;
      if (z.copy(ee, ee.length - N, 0, fe), N -= fe, N === 0) {
        fe === z.length ? (++G, ae.next ? F.head = ae.next : F.head = F.tail = null) : (F.head = ae, ae.data = z.slice(fe));
        break;
      }
      ++G;
    }
    return F.length -= G, ee;
  }
  function K(N) {
    var F = N._readableState;
    if (F.length > 0) throw new Error('"endReadable()" called on non-empty stream');
    F.endEmitted || (F.ended = !0, c.nextTick(Q, F, N));
  }
  function Q(N, F) {
    !N.endEmitted && N.length === 0 && (N.endEmitted = !0, F.readable = !1, F.emit("end"));
  }
  function U(N, F) {
    for (var ee = 0, ae = N.length; ee < ae; ee++)
      if (N[ee] === F) return ee;
    return -1;
  }
  return _stream_readable;
}
var _stream_transform, hasRequired_stream_transform;
function require_stream_transform() {
  if (hasRequired_stream_transform) return _stream_transform;
  hasRequired_stream_transform = 1, _stream_transform = f;
  var c = require_stream_duplex(), a = Object.create(requireUtil());
  a.inherits = requireInherits_browser(), a.inherits(f, c);
  function h(u, o) {
    var t = this._transformState;
    t.transforming = !1;
    var n = t.writecb;
    if (!n)
      return this.emit("error", new Error("write callback called multiple times"));
    t.writechunk = null, t.writecb = null, o != null && this.push(o), n(u);
    var e = this._readableState;
    e.reading = !1, (e.needReadable || e.length < e.highWaterMark) && this._read(e.highWaterMark);
  }
  function f(u) {
    if (!(this instanceof f)) return new f(u);
    c.call(this, u), this._transformState = {
      afterTransform: h.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, u && (typeof u.transform == "function" && (this._transform = u.transform), typeof u.flush == "function" && (this._flush = u.flush)), this.on("prefinish", p);
  }
  function p() {
    var u = this;
    typeof this._flush == "function" ? this._flush(function(o, t) {
      r(u, o, t);
    }) : r(this, null, null);
  }
  f.prototype.push = function(u, o) {
    return this._transformState.needTransform = !1, c.prototype.push.call(this, u, o);
  }, f.prototype._transform = function(u, o, t) {
    throw new Error("_transform() is not implemented");
  }, f.prototype._write = function(u, o, t) {
    var n = this._transformState;
    if (n.writecb = t, n.writechunk = u, n.writeencoding = o, !n.transforming) {
      var e = this._readableState;
      (n.needTransform || e.needReadable || e.length < e.highWaterMark) && this._read(e.highWaterMark);
    }
  }, f.prototype._read = function(u) {
    var o = this._transformState;
    o.writechunk !== null && o.writecb && !o.transforming ? (o.transforming = !0, this._transform(o.writechunk, o.writeencoding, o.afterTransform)) : o.needTransform = !0;
  }, f.prototype._destroy = function(u, o) {
    var t = this;
    c.prototype._destroy.call(this, u, function(n) {
      o(n), t.emit("close");
    });
  };
  function r(u, o, t) {
    if (o) return u.emit("error", o);
    if (t != null && u.push(t), u._writableState.length) throw new Error("Calling transform done when ws.length != 0");
    if (u._transformState.transforming) throw new Error("Calling transform done when still transforming");
    return u.push(null);
  }
  return _stream_transform;
}
var _stream_passthrough, hasRequired_stream_passthrough;
function require_stream_passthrough() {
  if (hasRequired_stream_passthrough) return _stream_passthrough;
  hasRequired_stream_passthrough = 1, _stream_passthrough = h;
  var c = require_stream_transform(), a = Object.create(requireUtil());
  a.inherits = requireInherits_browser(), a.inherits(h, c);
  function h(f) {
    if (!(this instanceof h)) return new h(f);
    c.call(this, f);
  }
  return h.prototype._transform = function(f, p, r) {
    r(null, f);
  }, _stream_passthrough;
}
var hasRequiredReadableBrowser;
function requireReadableBrowser() {
  return hasRequiredReadableBrowser || (hasRequiredReadableBrowser = 1, (function(c, a) {
    a = c.exports = require_stream_readable(), a.Stream = a, a.Readable = a, a.Writable = require_stream_writable(), a.Duplex = require_stream_duplex(), a.Transform = require_stream_transform(), a.PassThrough = require_stream_passthrough();
  })(readableBrowser, readableBrowser.exports)), readableBrowser.exports;
}
var hashBase, hasRequiredHashBase;
function requireHashBase() {
  if (hasRequiredHashBase) return hashBase;
  hasRequiredHashBase = 1;
  var c = requireSafeBuffer$1().Buffer, a = requireToBuffer$1(), h = requireReadableBrowser().Transform, f = requireInherits_browser();
  function p(r) {
    h.call(this), this._block = c.allocUnsafe(r), this._blockSize = r, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1;
  }
  return f(p, h), p.prototype._transform = function(r, u, o) {
    var t = null;
    try {
      this.update(r, u);
    } catch (n) {
      t = n;
    }
    o(t);
  }, p.prototype._flush = function(r) {
    var u = null;
    try {
      this.push(this.digest());
    } catch (o) {
      u = o;
    }
    r(u);
  }, p.prototype.update = function(r, u) {
    if (this._finalized)
      throw new Error("Digest already called");
    for (var o = a(r, u), t = this._block, n = 0; this._blockOffset + o.length - n >= this._blockSize; ) {
      for (var e = this._blockOffset; e < this._blockSize; )
        t[e] = o[n], e += 1, n += 1;
      this._update(), this._blockOffset = 0;
    }
    for (; n < o.length; )
      t[this._blockOffset] = o[n], this._blockOffset += 1, n += 1;
    for (var s = 0, d = o.length * 8; d > 0; ++s)
      this._length[s] += d, d = this._length[s] / 4294967296 | 0, d > 0 && (this._length[s] -= 4294967296 * d);
    return this;
  }, p.prototype._update = function() {
    throw new Error("_update is not implemented");
  }, p.prototype.digest = function(r) {
    if (this._finalized)
      throw new Error("Digest already called");
    this._finalized = !0;
    var u = this._digest();
    r !== void 0 && (u = u.toString(r)), this._block.fill(0), this._blockOffset = 0;
    for (var o = 0; o < 4; ++o)
      this._length[o] = 0;
    return u;
  }, p.prototype._digest = function() {
    throw new Error("_digest is not implemented");
  }, hashBase = p, hashBase;
}
var ripemd160, hasRequiredRipemd160;
function requireRipemd160() {
  if (hasRequiredRipemd160) return ripemd160;
  hasRequiredRipemd160 = 1;
  var c = requireDist().Buffer, a = requireInherits_browser(), h = requireHashBase(), f = new Array(16), p = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    7,
    4,
    13,
    1,
    10,
    6,
    15,
    3,
    12,
    0,
    9,
    5,
    2,
    14,
    11,
    8,
    3,
    10,
    14,
    4,
    9,
    15,
    8,
    1,
    2,
    7,
    0,
    6,
    13,
    11,
    5,
    12,
    1,
    9,
    11,
    10,
    0,
    8,
    12,
    4,
    13,
    3,
    7,
    15,
    14,
    5,
    6,
    2,
    4,
    0,
    5,
    9,
    7,
    12,
    2,
    10,
    14,
    1,
    3,
    8,
    11,
    6,
    15,
    13
  ], r = [
    5,
    14,
    7,
    0,
    9,
    2,
    11,
    4,
    13,
    6,
    15,
    8,
    1,
    10,
    3,
    12,
    6,
    11,
    3,
    7,
    0,
    13,
    5,
    10,
    14,
    15,
    8,
    12,
    4,
    9,
    1,
    2,
    15,
    5,
    1,
    3,
    7,
    14,
    6,
    9,
    11,
    8,
    12,
    2,
    10,
    0,
    4,
    13,
    8,
    6,
    4,
    1,
    3,
    11,
    15,
    0,
    5,
    12,
    2,
    13,
    9,
    7,
    10,
    14,
    12,
    15,
    10,
    4,
    1,
    5,
    8,
    7,
    6,
    2,
    13,
    14,
    0,
    3,
    9,
    11
  ], u = [
    11,
    14,
    15,
    12,
    5,
    8,
    7,
    9,
    11,
    13,
    14,
    15,
    6,
    7,
    9,
    8,
    7,
    6,
    8,
    13,
    11,
    9,
    7,
    15,
    7,
    12,
    15,
    9,
    11,
    7,
    13,
    12,
    11,
    13,
    6,
    7,
    14,
    9,
    13,
    15,
    14,
    8,
    13,
    6,
    5,
    12,
    7,
    5,
    11,
    12,
    14,
    15,
    14,
    15,
    9,
    8,
    9,
    14,
    5,
    6,
    8,
    6,
    5,
    12,
    9,
    15,
    5,
    11,
    6,
    8,
    13,
    12,
    5,
    12,
    13,
    14,
    11,
    8,
    5,
    6
  ], o = [
    8,
    9,
    9,
    11,
    13,
    15,
    15,
    5,
    7,
    7,
    8,
    11,
    14,
    14,
    12,
    6,
    9,
    13,
    15,
    7,
    12,
    8,
    9,
    11,
    7,
    7,
    12,
    7,
    6,
    15,
    13,
    11,
    9,
    7,
    15,
    11,
    8,
    6,
    6,
    14,
    12,
    13,
    5,
    14,
    13,
    13,
    7,
    5,
    15,
    5,
    8,
    11,
    14,
    14,
    6,
    14,
    6,
    9,
    12,
    9,
    12,
    5,
    15,
    8,
    8,
    5,
    12,
    9,
    12,
    5,
    14,
    6,
    8,
    13,
    6,
    5,
    15,
    13,
    11,
    11
  ], t = [0, 1518500249, 1859775393, 2400959708, 2840853838], n = [1352829926, 1548603684, 1836072691, 2053994217, 0];
  function e(E, S) {
    return E << S | E >>> 32 - S;
  }
  function s(E, S, O, D, $, V, J, ie) {
    return e(E + (S ^ O ^ D) + V + J | 0, ie) + $ | 0;
  }
  function d(E, S, O, D, $, V, J, ie) {
    return e(E + (S & O | ~S & D) + V + J | 0, ie) + $ | 0;
  }
  function v(E, S, O, D, $, V, J, ie) {
    return e(E + ((S | ~O) ^ D) + V + J | 0, ie) + $ | 0;
  }
  function y(E, S, O, D, $, V, J, ie) {
    return e(E + (S & D | O & ~D) + V + J | 0, ie) + $ | 0;
  }
  function m(E, S, O, D, $, V, J, ie) {
    return e(E + (S ^ (O | ~D)) + V + J | 0, ie) + $ | 0;
  }
  function B() {
    h.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520;
  }
  return a(B, h), B.prototype._update = function() {
    for (var E = f, S = 0; S < 16; ++S)
      E[S] = this._block.readInt32LE(S * 4);
    for (var O = this._a | 0, D = this._b | 0, $ = this._c | 0, V = this._d | 0, J = this._e | 0, ie = this._a | 0, ne = this._b | 0, le = this._c | 0, Y = this._d | 0, b = this._e | 0, g = 0; g < 80; g += 1) {
      var l, _;
      g < 16 ? (l = s(O, D, $, V, J, E[p[g]], t[0], u[g]), _ = m(ie, ne, le, Y, b, E[r[g]], n[0], o[g])) : g < 32 ? (l = d(O, D, $, V, J, E[p[g]], t[1], u[g]), _ = y(ie, ne, le, Y, b, E[r[g]], n[1], o[g])) : g < 48 ? (l = v(O, D, $, V, J, E[p[g]], t[2], u[g]), _ = v(ie, ne, le, Y, b, E[r[g]], n[2], o[g])) : g < 64 ? (l = y(O, D, $, V, J, E[p[g]], t[3], u[g]), _ = d(ie, ne, le, Y, b, E[r[g]], n[3], o[g])) : (l = m(O, D, $, V, J, E[p[g]], t[4], u[g]), _ = s(ie, ne, le, Y, b, E[r[g]], n[4], o[g])), O = J, J = V, V = e($, 10), $ = D, D = l, ie = b, b = Y, Y = e(le, 10), le = ne, ne = _;
    }
    var A = this._b + $ + Y | 0;
    this._b = this._c + V + b | 0, this._c = this._d + J + ie | 0, this._d = this._e + O + ne | 0, this._e = this._a + D + le | 0, this._a = A;
  }, B.prototype._digest = function() {
    this._block[this._blockOffset] = 128, this._blockOffset += 1, this._blockOffset > 56 && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
    var E = c.alloc ? c.alloc(20) : new c(20);
    return E.writeInt32LE(this._a, 0), E.writeInt32LE(this._b, 4), E.writeInt32LE(this._c, 8), E.writeInt32LE(this._d, 12), E.writeInt32LE(this._e, 16), E;
  }, ripemd160 = B, ripemd160;
}
var sha_js = { exports: {} }, hash$1, hasRequiredHash$1;
function requireHash$1() {
  if (hasRequiredHash$1) return hash$1;
  hasRequiredHash$1 = 1;
  var c = requireSafeBuffer$1().Buffer, a = /* @__PURE__ */ requireToBuffer$2();
  function h(f, p) {
    this._block = c.alloc(f), this._finalSize = p, this._blockSize = f, this._len = 0;
  }
  return h.prototype.update = function(f, p) {
    f = a(f, p || "utf8");
    for (var r = this._block, u = this._blockSize, o = f.length, t = this._len, n = 0; n < o; ) {
      for (var e = t % u, s = Math.min(o - n, u - e), d = 0; d < s; d++)
        r[e + d] = f[n + d];
      t += s, n += s, t % u === 0 && this._update(r);
    }
    return this._len += o, this;
  }, h.prototype.digest = function(f) {
    var p = this._len % this._blockSize;
    this._block[p] = 128, this._block.fill(0, p + 1), p >= this._finalSize && (this._update(this._block), this._block.fill(0));
    var r = this._len * 8;
    if (r <= 4294967295)
      this._block.writeUInt32BE(r, this._blockSize - 4);
    else {
      var u = (r & 4294967295) >>> 0, o = (r - u) / 4294967296;
      this._block.writeUInt32BE(o, this._blockSize - 8), this._block.writeUInt32BE(u, this._blockSize - 4);
    }
    this._update(this._block);
    var t = this._hash();
    return f ? t.toString(f) : t;
  }, h.prototype._update = function() {
    throw new Error("_update must be implemented by subclass");
  }, hash$1 = h, hash$1;
}
var sha$1, hasRequiredSha$1;
function requireSha$1() {
  if (hasRequiredSha$1) return sha$1;
  hasRequiredSha$1 = 1;
  var c = requireInherits_browser(), a = requireHash$1(), h = requireSafeBuffer$1().Buffer, f = [
    1518500249,
    1859775393,
    -1894007588,
    -899497514
  ], p = new Array(80);
  function r() {
    this.init(), this._w = p, a.call(this, 64, 56);
  }
  c(r, a), r.prototype.init = function() {
    return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
  };
  function u(n) {
    return n << 5 | n >>> 27;
  }
  function o(n) {
    return n << 30 | n >>> 2;
  }
  function t(n, e, s, d) {
    return n === 0 ? e & s | ~e & d : n === 2 ? e & s | e & d | s & d : e ^ s ^ d;
  }
  return r.prototype._update = function(n) {
    for (var e = this._w, s = this._a | 0, d = this._b | 0, v = this._c | 0, y = this._d | 0, m = this._e | 0, B = 0; B < 16; ++B)
      e[B] = n.readInt32BE(B * 4);
    for (; B < 80; ++B)
      e[B] = e[B - 3] ^ e[B - 8] ^ e[B - 14] ^ e[B - 16];
    for (var E = 0; E < 80; ++E) {
      var S = ~~(E / 20), O = u(s) + t(S, d, v, y) + m + e[E] + f[S] | 0;
      m = y, y = v, v = o(d), d = s, s = O;
    }
    this._a = s + this._a | 0, this._b = d + this._b | 0, this._c = v + this._c | 0, this._d = y + this._d | 0, this._e = m + this._e | 0;
  }, r.prototype._hash = function() {
    var n = h.allocUnsafe(20);
    return n.writeInt32BE(this._a | 0, 0), n.writeInt32BE(this._b | 0, 4), n.writeInt32BE(this._c | 0, 8), n.writeInt32BE(this._d | 0, 12), n.writeInt32BE(this._e | 0, 16), n;
  }, sha$1 = r, sha$1;
}
var sha1, hasRequiredSha1;
function requireSha1() {
  if (hasRequiredSha1) return sha1;
  hasRequiredSha1 = 1;
  var c = requireInherits_browser(), a = requireHash$1(), h = requireSafeBuffer$1().Buffer, f = [
    1518500249,
    1859775393,
    -1894007588,
    -899497514
  ], p = new Array(80);
  function r() {
    this.init(), this._w = p, a.call(this, 64, 56);
  }
  c(r, a), r.prototype.init = function() {
    return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this;
  };
  function u(e) {
    return e << 1 | e >>> 31;
  }
  function o(e) {
    return e << 5 | e >>> 27;
  }
  function t(e) {
    return e << 30 | e >>> 2;
  }
  function n(e, s, d, v) {
    return e === 0 ? s & d | ~s & v : e === 2 ? s & d | s & v | d & v : s ^ d ^ v;
  }
  return r.prototype._update = function(e) {
    for (var s = this._w, d = this._a | 0, v = this._b | 0, y = this._c | 0, m = this._d | 0, B = this._e | 0, E = 0; E < 16; ++E)
      s[E] = e.readInt32BE(E * 4);
    for (; E < 80; ++E)
      s[E] = u(s[E - 3] ^ s[E - 8] ^ s[E - 14] ^ s[E - 16]);
    for (var S = 0; S < 80; ++S) {
      var O = ~~(S / 20), D = o(d) + n(O, v, y, m) + B + s[S] + f[O] | 0;
      B = m, m = y, y = t(v), v = d, d = D;
    }
    this._a = d + this._a | 0, this._b = v + this._b | 0, this._c = y + this._c | 0, this._d = m + this._d | 0, this._e = B + this._e | 0;
  }, r.prototype._hash = function() {
    var e = h.allocUnsafe(20);
    return e.writeInt32BE(this._a | 0, 0), e.writeInt32BE(this._b | 0, 4), e.writeInt32BE(this._c | 0, 8), e.writeInt32BE(this._d | 0, 12), e.writeInt32BE(this._e | 0, 16), e;
  }, sha1 = r, sha1;
}
var sha256$1, hasRequiredSha256;
function requireSha256() {
  if (hasRequiredSha256) return sha256$1;
  hasRequiredSha256 = 1;
  var c = requireInherits_browser(), a = requireHash$1(), h = requireSafeBuffer$1().Buffer, f = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ], p = new Array(64);
  function r() {
    this.init(), this._w = p, a.call(this, 64, 56);
  }
  c(r, a), r.prototype.init = function() {
    return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this;
  };
  function u(d, v, y) {
    return y ^ d & (v ^ y);
  }
  function o(d, v, y) {
    return d & v | y & (d | v);
  }
  function t(d) {
    return (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
  }
  function n(d) {
    return (d >>> 6 | d << 26) ^ (d >>> 11 | d << 21) ^ (d >>> 25 | d << 7);
  }
  function e(d) {
    return (d >>> 7 | d << 25) ^ (d >>> 18 | d << 14) ^ d >>> 3;
  }
  function s(d) {
    return (d >>> 17 | d << 15) ^ (d >>> 19 | d << 13) ^ d >>> 10;
  }
  return r.prototype._update = function(d) {
    for (var v = this._w, y = this._a | 0, m = this._b | 0, B = this._c | 0, E = this._d | 0, S = this._e | 0, O = this._f | 0, D = this._g | 0, $ = this._h | 0, V = 0; V < 16; ++V)
      v[V] = d.readInt32BE(V * 4);
    for (; V < 64; ++V)
      v[V] = s(v[V - 2]) + v[V - 7] + e(v[V - 15]) + v[V - 16] | 0;
    for (var J = 0; J < 64; ++J) {
      var ie = $ + n(S) + u(S, O, D) + f[J] + v[J] | 0, ne = t(y) + o(y, m, B) | 0;
      $ = D, D = O, O = S, S = E + ie | 0, E = B, B = m, m = y, y = ie + ne | 0;
    }
    this._a = y + this._a | 0, this._b = m + this._b | 0, this._c = B + this._c | 0, this._d = E + this._d | 0, this._e = S + this._e | 0, this._f = O + this._f | 0, this._g = D + this._g | 0, this._h = $ + this._h | 0;
  }, r.prototype._hash = function() {
    var d = h.allocUnsafe(32);
    return d.writeInt32BE(this._a, 0), d.writeInt32BE(this._b, 4), d.writeInt32BE(this._c, 8), d.writeInt32BE(this._d, 12), d.writeInt32BE(this._e, 16), d.writeInt32BE(this._f, 20), d.writeInt32BE(this._g, 24), d.writeInt32BE(this._h, 28), d;
  }, sha256$1 = r, sha256$1;
}
var sha224$1, hasRequiredSha224;
function requireSha224() {
  if (hasRequiredSha224) return sha224$1;
  hasRequiredSha224 = 1;
  var c = requireInherits_browser(), a = requireSha256(), h = requireHash$1(), f = requireSafeBuffer$1().Buffer, p = new Array(64);
  function r() {
    this.init(), this._w = p, h.call(this, 64, 56);
  }
  return c(r, a), r.prototype.init = function() {
    return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this;
  }, r.prototype._hash = function() {
    var u = f.allocUnsafe(28);
    return u.writeInt32BE(this._a, 0), u.writeInt32BE(this._b, 4), u.writeInt32BE(this._c, 8), u.writeInt32BE(this._d, 12), u.writeInt32BE(this._e, 16), u.writeInt32BE(this._f, 20), u.writeInt32BE(this._g, 24), u;
  }, sha224$1 = r, sha224$1;
}
var sha512$1, hasRequiredSha512;
function requireSha512() {
  if (hasRequiredSha512) return sha512$1;
  hasRequiredSha512 = 1;
  var c = requireInherits_browser(), a = requireHash$1(), h = requireSafeBuffer$1().Buffer, f = [
    1116352408,
    3609767458,
    1899447441,
    602891725,
    3049323471,
    3964484399,
    3921009573,
    2173295548,
    961987163,
    4081628472,
    1508970993,
    3053834265,
    2453635748,
    2937671579,
    2870763221,
    3664609560,
    3624381080,
    2734883394,
    310598401,
    1164996542,
    607225278,
    1323610764,
    1426881987,
    3590304994,
    1925078388,
    4068182383,
    2162078206,
    991336113,
    2614888103,
    633803317,
    3248222580,
    3479774868,
    3835390401,
    2666613458,
    4022224774,
    944711139,
    264347078,
    2341262773,
    604807628,
    2007800933,
    770255983,
    1495990901,
    1249150122,
    1856431235,
    1555081692,
    3175218132,
    1996064986,
    2198950837,
    2554220882,
    3999719339,
    2821834349,
    766784016,
    2952996808,
    2566594879,
    3210313671,
    3203337956,
    3336571891,
    1034457026,
    3584528711,
    2466948901,
    113926993,
    3758326383,
    338241895,
    168717936,
    666307205,
    1188179964,
    773529912,
    1546045734,
    1294757372,
    1522805485,
    1396182291,
    2643833823,
    1695183700,
    2343527390,
    1986661051,
    1014477480,
    2177026350,
    1206759142,
    2456956037,
    344077627,
    2730485921,
    1290863460,
    2820302411,
    3158454273,
    3259730800,
    3505952657,
    3345764771,
    106217008,
    3516065817,
    3606008344,
    3600352804,
    1432725776,
    4094571909,
    1467031594,
    275423344,
    851169720,
    430227734,
    3100823752,
    506948616,
    1363258195,
    659060556,
    3750685593,
    883997877,
    3785050280,
    958139571,
    3318307427,
    1322822218,
    3812723403,
    1537002063,
    2003034995,
    1747873779,
    3602036899,
    1955562222,
    1575990012,
    2024104815,
    1125592928,
    2227730452,
    2716904306,
    2361852424,
    442776044,
    2428436474,
    593698344,
    2756734187,
    3733110249,
    3204031479,
    2999351573,
    3329325298,
    3815920427,
    3391569614,
    3928383900,
    3515267271,
    566280711,
    3940187606,
    3454069534,
    4118630271,
    4000239992,
    116418474,
    1914138554,
    174292421,
    2731055270,
    289380356,
    3203993006,
    460393269,
    320620315,
    685471733,
    587496836,
    852142971,
    1086792851,
    1017036298,
    365543100,
    1126000580,
    2618297676,
    1288033470,
    3409855158,
    1501505948,
    4234509866,
    1607167915,
    987167468,
    1816402316,
    1246189591
  ], p = new Array(160);
  function r() {
    this.init(), this._w = p, a.call(this, 128, 112);
  }
  c(r, a), r.prototype.init = function() {
    return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this;
  };
  function u(m, B, E) {
    return E ^ m & (B ^ E);
  }
  function o(m, B, E) {
    return m & B | E & (m | B);
  }
  function t(m, B) {
    return (m >>> 28 | B << 4) ^ (B >>> 2 | m << 30) ^ (B >>> 7 | m << 25);
  }
  function n(m, B) {
    return (m >>> 14 | B << 18) ^ (m >>> 18 | B << 14) ^ (B >>> 9 | m << 23);
  }
  function e(m, B) {
    return (m >>> 1 | B << 31) ^ (m >>> 8 | B << 24) ^ m >>> 7;
  }
  function s(m, B) {
    return (m >>> 1 | B << 31) ^ (m >>> 8 | B << 24) ^ (m >>> 7 | B << 25);
  }
  function d(m, B) {
    return (m >>> 19 | B << 13) ^ (B >>> 29 | m << 3) ^ m >>> 6;
  }
  function v(m, B) {
    return (m >>> 19 | B << 13) ^ (B >>> 29 | m << 3) ^ (m >>> 6 | B << 26);
  }
  function y(m, B) {
    return m >>> 0 < B >>> 0 ? 1 : 0;
  }
  return r.prototype._update = function(m) {
    for (var B = this._w, E = this._ah | 0, S = this._bh | 0, O = this._ch | 0, D = this._dh | 0, $ = this._eh | 0, V = this._fh | 0, J = this._gh | 0, ie = this._hh | 0, ne = this._al | 0, le = this._bl | 0, Y = this._cl | 0, b = this._dl | 0, g = this._el | 0, l = this._fl | 0, _ = this._gl | 0, A = this._hl | 0, q = 0; q < 32; q += 2)
      B[q] = m.readInt32BE(q * 4), B[q + 1] = m.readInt32BE(q * 4 + 4);
    for (; q < 160; q += 2) {
      var P = B[q - 30], R = B[q - 30 + 1], w = e(P, R), M = s(R, P);
      P = B[q - 4], R = B[q - 4 + 1];
      var x = d(P, R), L = v(R, P), K = B[q - 14], Q = B[q - 14 + 1], U = B[q - 32], N = B[q - 32 + 1], F = M + Q | 0, ee = w + K + y(F, M) | 0;
      F = F + L | 0, ee = ee + x + y(F, L) | 0, F = F + N | 0, ee = ee + U + y(F, N) | 0, B[q] = ee, B[q + 1] = F;
    }
    for (var ae = 0; ae < 160; ae += 2) {
      ee = B[ae], F = B[ae + 1];
      var G = o(E, S, O), z = o(ne, le, Y), fe = t(E, ne), me = t(ne, E), xe = n($, g), _e = n(g, $), Be = f[ae], Ae = f[ae + 1], be = u($, V, J), Fe = u(g, l, _), qe = A + _e | 0, Me = ie + xe + y(qe, A) | 0;
      qe = qe + Fe | 0, Me = Me + be + y(qe, Fe) | 0, qe = qe + Ae | 0, Me = Me + Be + y(qe, Ae) | 0, qe = qe + F | 0, Me = Me + ee + y(qe, F) | 0;
      var Te = me + z | 0, oe = fe + G + y(Te, me) | 0;
      ie = J, A = _, J = V, _ = l, V = $, l = g, g = b + qe | 0, $ = D + Me + y(g, b) | 0, D = O, b = Y, O = S, Y = le, S = E, le = ne, ne = qe + Te | 0, E = Me + oe + y(ne, qe) | 0;
    }
    this._al = this._al + ne | 0, this._bl = this._bl + le | 0, this._cl = this._cl + Y | 0, this._dl = this._dl + b | 0, this._el = this._el + g | 0, this._fl = this._fl + l | 0, this._gl = this._gl + _ | 0, this._hl = this._hl + A | 0, this._ah = this._ah + E + y(this._al, ne) | 0, this._bh = this._bh + S + y(this._bl, le) | 0, this._ch = this._ch + O + y(this._cl, Y) | 0, this._dh = this._dh + D + y(this._dl, b) | 0, this._eh = this._eh + $ + y(this._el, g) | 0, this._fh = this._fh + V + y(this._fl, l) | 0, this._gh = this._gh + J + y(this._gl, _) | 0, this._hh = this._hh + ie + y(this._hl, A) | 0;
  }, r.prototype._hash = function() {
    var m = h.allocUnsafe(64);
    function B(E, S, O) {
      m.writeInt32BE(E, O), m.writeInt32BE(S, O + 4);
    }
    return B(this._ah, this._al, 0), B(this._bh, this._bl, 8), B(this._ch, this._cl, 16), B(this._dh, this._dl, 24), B(this._eh, this._el, 32), B(this._fh, this._fl, 40), B(this._gh, this._gl, 48), B(this._hh, this._hl, 56), m;
  }, sha512$1 = r, sha512$1;
}
var sha384$1, hasRequiredSha384;
function requireSha384() {
  if (hasRequiredSha384) return sha384$1;
  hasRequiredSha384 = 1;
  var c = requireInherits_browser(), a = requireSha512(), h = requireHash$1(), f = requireSafeBuffer$1().Buffer, p = new Array(160);
  function r() {
    this.init(), this._w = p, h.call(this, 128, 112);
  }
  return c(r, a), r.prototype.init = function() {
    return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this;
  }, r.prototype._hash = function() {
    var u = f.allocUnsafe(48);
    function o(t, n, e) {
      u.writeInt32BE(t, e), u.writeInt32BE(n, e + 4);
    }
    return o(this._ah, this._al, 0), o(this._bh, this._bl, 8), o(this._ch, this._cl, 16), o(this._dh, this._dl, 24), o(this._eh, this._el, 32), o(this._fh, this._fl, 40), u;
  }, sha384$1 = r, sha384$1;
}
var hasRequiredSha_js;
function requireSha_js() {
  return hasRequiredSha_js || (hasRequiredSha_js = 1, (function(c) {
    c.exports = function(h) {
      var f = h.toLowerCase(), p = c.exports[f];
      if (!p)
        throw new Error(f + " is not supported (we accept pull requests)");
      return new p();
    }, c.exports.sha = requireSha$1(), c.exports.sha1 = requireSha1(), c.exports.sha224 = requireSha224(), c.exports.sha256 = requireSha256(), c.exports.sha384 = requireSha384(), c.exports.sha512 = requireSha512();
  })(sha_js)), sha_js.exports;
}
var cipherBase, hasRequiredCipherBase;
function requireCipherBase() {
  if (hasRequiredCipherBase) return cipherBase;
  hasRequiredCipherBase = 1;
  var c = requireSafeBuffer$1().Buffer, a = requireStreamBrowserify().Transform, h = requireString_decoder().StringDecoder, f = requireInherits_browser(), p = /* @__PURE__ */ requireToBuffer$2();
  function r(u) {
    a.call(this), this.hashMode = typeof u == "string", this.hashMode ? this[u] = this._finalOrDigest : this.final = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null;
  }
  return f(r, a), r.prototype.update = function(u, o, t) {
    var n = p(u, o), e = this._update(n);
    return this.hashMode ? this : (t && (e = this._toString(e, t)), e);
  }, r.prototype.setAutoPadding = function() {
  }, r.prototype.getAuthTag = function() {
    throw new Error("trying to get auth tag in unsupported state");
  }, r.prototype.setAuthTag = function() {
    throw new Error("trying to set auth tag in unsupported state");
  }, r.prototype.setAAD = function() {
    throw new Error("trying to set aad in unsupported state");
  }, r.prototype._transform = function(u, o, t) {
    var n;
    try {
      this.hashMode ? this._update(u) : this.push(this._update(u));
    } catch (e) {
      n = e;
    } finally {
      t(n);
    }
  }, r.prototype._flush = function(u) {
    var o;
    try {
      this.push(this.__final());
    } catch (t) {
      o = t;
    }
    u(o);
  }, r.prototype._finalOrDigest = function(u) {
    var o = this.__final() || c.alloc(0);
    return u && (o = this._toString(o, u, !0)), o;
  }, r.prototype._toString = function(u, o, t) {
    if (this._decoder || (this._decoder = new h(o), this._encoding = o), this._encoding !== o)
      throw new Error("can’t switch encodings");
    var n = this._decoder.write(u);
    return t && (n += this._decoder.end()), n;
  }, cipherBase = r, cipherBase;
}
var browser$9, hasRequiredBrowser$9;
function requireBrowser$9() {
  if (hasRequiredBrowser$9) return browser$9;
  hasRequiredBrowser$9 = 1;
  var c = requireInherits_browser(), a = requireMd5_js(), h = requireRipemd160(), f = requireSha_js(), p = requireCipherBase();
  function r(u) {
    p.call(this, "digest"), this._hash = u;
  }
  return c(r, p), r.prototype._update = function(u) {
    this._hash.update(u);
  }, r.prototype._final = function() {
    return this._hash.digest();
  }, browser$9 = function(o) {
    return o = o.toLowerCase(), o === "md5" ? new a() : o === "rmd160" || o === "ripemd160" ? new h() : new r(f(o));
  }, browser$9;
}
var legacy, hasRequiredLegacy;
function requireLegacy() {
  if (hasRequiredLegacy) return legacy;
  hasRequiredLegacy = 1;
  var c = requireInherits_browser(), a = requireSafeBuffer$1().Buffer, h = requireCipherBase(), f = a.alloc(128), p = 64;
  function r(u, o) {
    h.call(this, "digest"), typeof o == "string" && (o = a.from(o)), this._alg = u, this._key = o, o.length > p ? o = u(o) : o.length < p && (o = a.concat([o, f], p));
    for (var t = this._ipad = a.allocUnsafe(p), n = this._opad = a.allocUnsafe(p), e = 0; e < p; e++)
      t[e] = o[e] ^ 54, n[e] = o[e] ^ 92;
    this._hash = [t];
  }
  return c(r, h), r.prototype._update = function(u) {
    this._hash.push(u);
  }, r.prototype._final = function() {
    var u = this._alg(a.concat(this._hash));
    return this._alg(a.concat([this._opad, u]));
  }, legacy = r, legacy;
}
var md5, hasRequiredMd5;
function requireMd5() {
  if (hasRequiredMd5) return md5;
  hasRequiredMd5 = 1;
  var c = requireMd5_js();
  return md5 = function(a) {
    return new c().update(a).digest();
  }, md5;
}
var browser$8, hasRequiredBrowser$8;
function requireBrowser$8() {
  if (hasRequiredBrowser$8) return browser$8;
  hasRequiredBrowser$8 = 1;
  var c = requireInherits_browser(), a = requireLegacy(), h = requireCipherBase(), f = requireSafeBuffer$1().Buffer, p = requireMd5(), r = requireRipemd160(), u = requireSha_js(), o = f.alloc(128);
  function t(n, e) {
    h.call(this, "digest"), typeof e == "string" && (e = f.from(e));
    var s = n === "sha512" || n === "sha384" ? 128 : 64;
    if (this._alg = n, this._key = e, e.length > s) {
      var d = n === "rmd160" ? new r() : u(n);
      e = d.update(e).digest();
    } else e.length < s && (e = f.concat([e, o], s));
    for (var v = this._ipad = f.allocUnsafe(s), y = this._opad = f.allocUnsafe(s), m = 0; m < s; m++)
      v[m] = e[m] ^ 54, y[m] = e[m] ^ 92;
    this._hash = n === "rmd160" ? new r() : u(n), this._hash.update(v);
  }
  return c(t, h), t.prototype._update = function(n) {
    this._hash.update(n);
  }, t.prototype._final = function() {
    var n = this._hash.digest(), e = this._alg === "rmd160" ? new r() : u(this._alg);
    return e.update(this._opad).update(n).digest();
  }, browser$8 = function(e, s) {
    return e = e.toLowerCase(), e === "rmd160" || e === "ripemd160" ? new t("rmd160", s) : e === "md5" ? new a(p, s) : new t(e, s);
  }, browser$8;
}
const sha224WithRSAEncryption = { sign: "rsa", hash: "sha224", id: "302d300d06096086480165030402040500041c" }, sha256WithRSAEncryption = { sign: "rsa", hash: "sha256", id: "3031300d060960864801650304020105000420" }, sha384WithRSAEncryption = { sign: "rsa", hash: "sha384", id: "3041300d060960864801650304020205000430" }, sha512WithRSAEncryption = { sign: "rsa", hash: "sha512", id: "3051300d060960864801650304020305000440" }, sha256 = { sign: "ecdsa", hash: "sha256", id: "" }, sha224 = { sign: "ecdsa", hash: "sha224", id: "" }, sha384 = { sign: "ecdsa", hash: "sha384", id: "" }, sha512 = { sign: "ecdsa", hash: "sha512", id: "" }, DSA = { sign: "dsa", hash: "sha1", id: "" }, ripemd160WithRSA = { sign: "rsa", hash: "rmd160", id: "3021300906052b2403020105000414" }, md5WithRSAEncryption = { sign: "rsa", hash: "md5", id: "3020300c06082a864886f70d020505000410" }, require$$6 = {
  sha224WithRSAEncryption,
  "RSA-SHA224": { sign: "ecdsa/rsa", hash: "sha224", id: "302d300d06096086480165030402040500041c" },
  sha256WithRSAEncryption,
  "RSA-SHA256": { sign: "ecdsa/rsa", hash: "sha256", id: "3031300d060960864801650304020105000420" },
  sha384WithRSAEncryption,
  "RSA-SHA384": { sign: "ecdsa/rsa", hash: "sha384", id: "3041300d060960864801650304020205000430" },
  sha512WithRSAEncryption,
  "RSA-SHA512": { sign: "ecdsa/rsa", hash: "sha512", id: "3051300d060960864801650304020305000440" },
  "RSA-SHA1": { sign: "rsa", hash: "sha1", id: "3021300906052b0e03021a05000414" },
  "ecdsa-with-SHA1": { sign: "ecdsa", hash: "sha1", id: "" },
  sha256,
  sha224,
  sha384,
  sha512,
  "DSA-SHA": { sign: "dsa", hash: "sha1", id: "" },
  "DSA-SHA1": { sign: "dsa", hash: "sha1", id: "" },
  DSA,
  "DSA-WITH-SHA224": { sign: "dsa", hash: "sha224", id: "" },
  "DSA-SHA224": { sign: "dsa", hash: "sha224", id: "" },
  "DSA-WITH-SHA256": { sign: "dsa", hash: "sha256", id: "" },
  "DSA-SHA256": { sign: "dsa", hash: "sha256", id: "" },
  "DSA-WITH-SHA384": { sign: "dsa", hash: "sha384", id: "" },
  "DSA-SHA384": { sign: "dsa", hash: "sha384", id: "" },
  "DSA-WITH-SHA512": { sign: "dsa", hash: "sha512", id: "" },
  "DSA-SHA512": { sign: "dsa", hash: "sha512", id: "" },
  "DSA-RIPEMD160": { sign: "dsa", hash: "rmd160", id: "" },
  ripemd160WithRSA,
  "RSA-RIPEMD160": { sign: "rsa", hash: "rmd160", id: "3021300906052b2403020105000414" },
  md5WithRSAEncryption,
  "RSA-MD5": { sign: "rsa", hash: "md5", id: "3020300c06082a864886f70d020505000410" }
};
var algos, hasRequiredAlgos;
function requireAlgos() {
  return hasRequiredAlgos || (hasRequiredAlgos = 1, algos = require$$6), algos;
}
var browser$7 = {}, precondition, hasRequiredPrecondition;
function requirePrecondition() {
  if (hasRequiredPrecondition) return precondition;
  hasRequiredPrecondition = 1;
  var c = isFinite, a = Math.pow(2, 30) - 1;
  return precondition = function(h, f) {
    if (typeof h != "number")
      throw new TypeError("Iterations not a number");
    if (h < 0 || !c(h))
      throw new TypeError("Bad iterations");
    if (typeof f != "number")
      throw new TypeError("Key length not a number");
    if (f < 0 || f > a || f !== f)
      throw new TypeError("Bad key length");
  }, precondition;
}
var defaultEncoding_1, hasRequiredDefaultEncoding;
function requireDefaultEncoding() {
  if (hasRequiredDefaultEncoding) return defaultEncoding_1;
  hasRequiredDefaultEncoding = 1;
  var c;
  if (commonjsGlobal.process && commonjsGlobal.process.browser)
    c = "utf-8";
  else if (commonjsGlobal.process && commonjsGlobal.process.version) {
    var a = parseInt(process$1.version.split(".")[0].slice(1), 10);
    c = a >= 6 ? "utf-8" : "binary";
  } else
    c = "utf-8";
  return defaultEncoding_1 = c, defaultEncoding_1;
}
var toBuffer_1, hasRequiredToBuffer;
function requireToBuffer() {
  if (hasRequiredToBuffer) return toBuffer_1;
  hasRequiredToBuffer = 1;
  var c = requireSafeBuffer$1().Buffer, a = /* @__PURE__ */ requireToBuffer$2(), h = typeof Uint8Array < "u", f = h && typeof ArrayBuffer < "u", p = f && ArrayBuffer.isView;
  return toBuffer_1 = function(r, u, o) {
    if (typeof r == "string" || c.isBuffer(r) || h && r instanceof Uint8Array || p && p(r))
      return a(r, u);
    throw new TypeError(o + " must be a string, a Buffer, a Uint8Array, or a DataView");
  }, toBuffer_1;
}
var syncBrowser, hasRequiredSyncBrowser;
function requireSyncBrowser() {
  if (hasRequiredSyncBrowser) return syncBrowser;
  hasRequiredSyncBrowser = 1;
  var c = requireMd5(), a = requireRipemd160(), h = requireSha_js(), f = requireSafeBuffer$1().Buffer, p = requirePrecondition(), r = requireDefaultEncoding(), u = requireToBuffer(), o = f.alloc(128), t = {
    __proto__: null,
    md5: 16,
    sha1: 20,
    sha224: 28,
    sha256: 32,
    sha384: 48,
    sha512: 64,
    "sha512-256": 32,
    ripemd160: 20,
    rmd160: 20
  }, n = {
    __proto__: null,
    "sha-1": "sha1",
    "sha-224": "sha224",
    "sha-256": "sha256",
    "sha-384": "sha384",
    "sha-512": "sha512",
    "ripemd-160": "ripemd160"
  };
  function e(y) {
    return new a().update(y).digest();
  }
  function s(y) {
    function m(B) {
      return h(y).update(B).digest();
    }
    return y === "rmd160" || y === "ripemd160" ? e : y === "md5" ? c : m;
  }
  function d(y, m, B) {
    var E = s(y), S = y === "sha512" || y === "sha384" ? 128 : 64;
    m.length > S ? m = E(m) : m.length < S && (m = f.concat([m, o], S));
    for (var O = f.allocUnsafe(S + t[y]), D = f.allocUnsafe(S + t[y]), $ = 0; $ < S; $++)
      O[$] = m[$] ^ 54, D[$] = m[$] ^ 92;
    var V = f.allocUnsafe(S + B + 4);
    O.copy(V, 0, 0, S), this.ipad1 = V, this.ipad2 = O, this.opad = D, this.alg = y, this.blocksize = S, this.hash = E, this.size = t[y];
  }
  d.prototype.run = function(y, m) {
    y.copy(m, this.blocksize);
    var B = this.hash(m);
    return B.copy(this.opad, this.blocksize), this.hash(this.opad);
  };
  function v(y, m, B, E, S) {
    p(B, E), y = u(y, r, "Password"), m = u(m, r, "Salt");
    var O = (S || "sha1").toLowerCase(), D = n[O] || O, $ = t[D];
    if (typeof $ != "number" || !$)
      throw new TypeError("Digest algorithm not supported: " + S);
    var V = new d(D, y, m.length), J = f.allocUnsafe(E), ie = f.allocUnsafe(m.length + 4);
    m.copy(ie, 0, 0, m.length);
    for (var ne = 0, le = $, Y = Math.ceil(E / le), b = 1; b <= Y; b++) {
      ie.writeUInt32BE(b, m.length);
      for (var g = V.run(ie, V.ipad1), l = g, _ = 1; _ < B; _++) {
        l = V.run(l, V.ipad2);
        for (var A = 0; A < le; A++)
          g[A] ^= l[A];
      }
      g.copy(J, ne), ne += le;
    }
    return J;
  }
  return syncBrowser = v, syncBrowser;
}
var async, hasRequiredAsync;
function requireAsync() {
  if (hasRequiredAsync) return async;
  hasRequiredAsync = 1;
  var c = requireSafeBuffer$1().Buffer, a = requirePrecondition(), h = requireDefaultEncoding(), f = requireSyncBrowser(), p = requireToBuffer(), r, u = commonjsGlobal.crypto && commonjsGlobal.crypto.subtle, o = {
    sha: "SHA-1",
    "sha-1": "SHA-1",
    sha1: "SHA-1",
    sha256: "SHA-256",
    "sha-256": "SHA-256",
    sha384: "SHA-384",
    "sha-384": "SHA-384",
    "sha-512": "SHA-512",
    sha512: "SHA-512"
  }, t = [], n;
  function e() {
    return n || (commonjsGlobal.process && commonjsGlobal.process.nextTick ? n = commonjsGlobal.process.nextTick : commonjsGlobal.queueMicrotask ? n = commonjsGlobal.queueMicrotask : commonjsGlobal.setImmediate ? n = commonjsGlobal.setImmediate : n = commonjsGlobal.setTimeout, n);
  }
  function s(y, m, B, E, S) {
    return u.importKey("raw", y, { name: "PBKDF2" }, !1, ["deriveBits"]).then(function(O) {
      return u.deriveBits({
        name: "PBKDF2",
        salt: m,
        iterations: B,
        hash: {
          name: S
        }
      }, O, E << 3);
    }).then(function(O) {
      return c.from(O);
    });
  }
  function d(y) {
    if (commonjsGlobal.process && !commonjsGlobal.process.browser || !u || !u.importKey || !u.deriveBits)
      return Promise.resolve(!1);
    if (t[y] !== void 0)
      return t[y];
    r = r || c.alloc(8);
    var m = s(r, r, 10, 128, y).then(
      function() {
        return !0;
      },
      function() {
        return !1;
      }
    );
    return t[y] = m, m;
  }
  function v(y, m) {
    y.then(function(B) {
      e()(function() {
        m(null, B);
      });
    }, function(B) {
      e()(function() {
        m(B);
      });
    });
  }
  return async = function(y, m, B, E, S, O) {
    if (typeof S == "function" && (O = S, S = void 0), a(B, E), y = p(y, h, "Password"), m = p(m, h, "Salt"), typeof O != "function")
      throw new Error("No callback provided to pbkdf2");
    S = S || "sha1";
    var D = o[S.toLowerCase()];
    if (!D || typeof commonjsGlobal.Promise != "function") {
      e()(function() {
        var $;
        try {
          $ = f(y, m, B, E, S);
        } catch (V) {
          O(V);
          return;
        }
        O(null, $);
      });
      return;
    }
    v(d(D).then(function($) {
      return $ ? s(y, m, B, E, D) : f(y, m, B, E, S);
    }), O);
  }, async;
}
var hasRequiredBrowser$7;
function requireBrowser$7() {
  return hasRequiredBrowser$7 || (hasRequiredBrowser$7 = 1, browser$7.pbkdf2 = requireAsync(), browser$7.pbkdf2Sync = requireSyncBrowser()), browser$7;
}
var browser$6 = {}, des$1 = {}, utils$3 = {}, hasRequiredUtils$4;
function requireUtils$4() {
  if (hasRequiredUtils$4) return utils$3;
  hasRequiredUtils$4 = 1, utils$3.readUInt32BE = function(p, r) {
    var u = p[0 + r] << 24 | p[1 + r] << 16 | p[2 + r] << 8 | p[3 + r];
    return u >>> 0;
  }, utils$3.writeUInt32BE = function(p, r, u) {
    p[0 + u] = r >>> 24, p[1 + u] = r >>> 16 & 255, p[2 + u] = r >>> 8 & 255, p[3 + u] = r & 255;
  }, utils$3.ip = function(p, r, u, o) {
    for (var t = 0, n = 0, e = 6; e >= 0; e -= 2) {
      for (var s = 0; s <= 24; s += 8)
        t <<= 1, t |= r >>> s + e & 1;
      for (var s = 0; s <= 24; s += 8)
        t <<= 1, t |= p >>> s + e & 1;
    }
    for (var e = 6; e >= 0; e -= 2) {
      for (var s = 1; s <= 25; s += 8)
        n <<= 1, n |= r >>> s + e & 1;
      for (var s = 1; s <= 25; s += 8)
        n <<= 1, n |= p >>> s + e & 1;
    }
    u[o + 0] = t >>> 0, u[o + 1] = n >>> 0;
  }, utils$3.rip = function(p, r, u, o) {
    for (var t = 0, n = 0, e = 0; e < 4; e++)
      for (var s = 24; s >= 0; s -= 8)
        t <<= 1, t |= r >>> s + e & 1, t <<= 1, t |= p >>> s + e & 1;
    for (var e = 4; e < 8; e++)
      for (var s = 24; s >= 0; s -= 8)
        n <<= 1, n |= r >>> s + e & 1, n <<= 1, n |= p >>> s + e & 1;
    u[o + 0] = t >>> 0, u[o + 1] = n >>> 0;
  }, utils$3.pc1 = function(p, r, u, o) {
    for (var t = 0, n = 0, e = 7; e >= 5; e--) {
      for (var s = 0; s <= 24; s += 8)
        t <<= 1, t |= r >> s + e & 1;
      for (var s = 0; s <= 24; s += 8)
        t <<= 1, t |= p >> s + e & 1;
    }
    for (var s = 0; s <= 24; s += 8)
      t <<= 1, t |= r >> s + e & 1;
    for (var e = 1; e <= 3; e++) {
      for (var s = 0; s <= 24; s += 8)
        n <<= 1, n |= r >> s + e & 1;
      for (var s = 0; s <= 24; s += 8)
        n <<= 1, n |= p >> s + e & 1;
    }
    for (var s = 0; s <= 24; s += 8)
      n <<= 1, n |= p >> s + e & 1;
    u[o + 0] = t >>> 0, u[o + 1] = n >>> 0;
  }, utils$3.r28shl = function(p, r) {
    return p << r & 268435455 | p >>> 28 - r;
  };
  var c = [
    // inL => outL
    14,
    11,
    17,
    4,
    27,
    23,
    25,
    0,
    13,
    22,
    7,
    18,
    5,
    9,
    16,
    24,
    2,
    20,
    12,
    21,
    1,
    8,
    15,
    26,
    // inR => outR
    15,
    4,
    25,
    19,
    9,
    1,
    26,
    16,
    5,
    11,
    23,
    8,
    12,
    7,
    17,
    0,
    22,
    3,
    10,
    14,
    6,
    20,
    27,
    24
  ];
  utils$3.pc2 = function(p, r, u, o) {
    for (var t = 0, n = 0, e = c.length >>> 1, s = 0; s < e; s++)
      t <<= 1, t |= p >>> c[s] & 1;
    for (var s = e; s < c.length; s++)
      n <<= 1, n |= r >>> c[s] & 1;
    u[o + 0] = t >>> 0, u[o + 1] = n >>> 0;
  }, utils$3.expand = function(p, r, u) {
    var o = 0, t = 0;
    o = (p & 1) << 5 | p >>> 27;
    for (var n = 23; n >= 15; n -= 4)
      o <<= 6, o |= p >>> n & 63;
    for (var n = 11; n >= 3; n -= 4)
      t |= p >>> n & 63, t <<= 6;
    t |= (p & 31) << 1 | p >>> 31, r[u + 0] = o >>> 0, r[u + 1] = t >>> 0;
  };
  var a = [
    14,
    0,
    4,
    15,
    13,
    7,
    1,
    4,
    2,
    14,
    15,
    2,
    11,
    13,
    8,
    1,
    3,
    10,
    10,
    6,
    6,
    12,
    12,
    11,
    5,
    9,
    9,
    5,
    0,
    3,
    7,
    8,
    4,
    15,
    1,
    12,
    14,
    8,
    8,
    2,
    13,
    4,
    6,
    9,
    2,
    1,
    11,
    7,
    15,
    5,
    12,
    11,
    9,
    3,
    7,
    14,
    3,
    10,
    10,
    0,
    5,
    6,
    0,
    13,
    15,
    3,
    1,
    13,
    8,
    4,
    14,
    7,
    6,
    15,
    11,
    2,
    3,
    8,
    4,
    14,
    9,
    12,
    7,
    0,
    2,
    1,
    13,
    10,
    12,
    6,
    0,
    9,
    5,
    11,
    10,
    5,
    0,
    13,
    14,
    8,
    7,
    10,
    11,
    1,
    10,
    3,
    4,
    15,
    13,
    4,
    1,
    2,
    5,
    11,
    8,
    6,
    12,
    7,
    6,
    12,
    9,
    0,
    3,
    5,
    2,
    14,
    15,
    9,
    10,
    13,
    0,
    7,
    9,
    0,
    14,
    9,
    6,
    3,
    3,
    4,
    15,
    6,
    5,
    10,
    1,
    2,
    13,
    8,
    12,
    5,
    7,
    14,
    11,
    12,
    4,
    11,
    2,
    15,
    8,
    1,
    13,
    1,
    6,
    10,
    4,
    13,
    9,
    0,
    8,
    6,
    15,
    9,
    3,
    8,
    0,
    7,
    11,
    4,
    1,
    15,
    2,
    14,
    12,
    3,
    5,
    11,
    10,
    5,
    14,
    2,
    7,
    12,
    7,
    13,
    13,
    8,
    14,
    11,
    3,
    5,
    0,
    6,
    6,
    15,
    9,
    0,
    10,
    3,
    1,
    4,
    2,
    7,
    8,
    2,
    5,
    12,
    11,
    1,
    12,
    10,
    4,
    14,
    15,
    9,
    10,
    3,
    6,
    15,
    9,
    0,
    0,
    6,
    12,
    10,
    11,
    1,
    7,
    13,
    13,
    8,
    15,
    9,
    1,
    4,
    3,
    5,
    14,
    11,
    5,
    12,
    2,
    7,
    8,
    2,
    4,
    14,
    2,
    14,
    12,
    11,
    4,
    2,
    1,
    12,
    7,
    4,
    10,
    7,
    11,
    13,
    6,
    1,
    8,
    5,
    5,
    0,
    3,
    15,
    15,
    10,
    13,
    3,
    0,
    9,
    14,
    8,
    9,
    6,
    4,
    11,
    2,
    8,
    1,
    12,
    11,
    7,
    10,
    1,
    13,
    14,
    7,
    2,
    8,
    13,
    15,
    6,
    9,
    15,
    12,
    0,
    5,
    9,
    6,
    10,
    3,
    4,
    0,
    5,
    14,
    3,
    12,
    10,
    1,
    15,
    10,
    4,
    15,
    2,
    9,
    7,
    2,
    12,
    6,
    9,
    8,
    5,
    0,
    6,
    13,
    1,
    3,
    13,
    4,
    14,
    14,
    0,
    7,
    11,
    5,
    3,
    11,
    8,
    9,
    4,
    14,
    3,
    15,
    2,
    5,
    12,
    2,
    9,
    8,
    5,
    12,
    15,
    3,
    10,
    7,
    11,
    0,
    14,
    4,
    1,
    10,
    7,
    1,
    6,
    13,
    0,
    11,
    8,
    6,
    13,
    4,
    13,
    11,
    0,
    2,
    11,
    14,
    7,
    15,
    4,
    0,
    9,
    8,
    1,
    13,
    10,
    3,
    14,
    12,
    3,
    9,
    5,
    7,
    12,
    5,
    2,
    10,
    15,
    6,
    8,
    1,
    6,
    1,
    6,
    4,
    11,
    11,
    13,
    13,
    8,
    12,
    1,
    3,
    4,
    7,
    10,
    14,
    7,
    10,
    9,
    15,
    5,
    6,
    0,
    8,
    15,
    0,
    14,
    5,
    2,
    9,
    3,
    2,
    12,
    13,
    1,
    2,
    15,
    8,
    13,
    4,
    8,
    6,
    10,
    15,
    3,
    11,
    7,
    1,
    4,
    10,
    12,
    9,
    5,
    3,
    6,
    14,
    11,
    5,
    0,
    0,
    14,
    12,
    9,
    7,
    2,
    7,
    2,
    11,
    1,
    4,
    14,
    1,
    7,
    9,
    4,
    12,
    10,
    14,
    8,
    2,
    13,
    0,
    15,
    6,
    12,
    10,
    9,
    13,
    0,
    15,
    3,
    3,
    5,
    5,
    6,
    8,
    11
  ];
  utils$3.substitute = function(p, r) {
    for (var u = 0, o = 0; o < 4; o++) {
      var t = p >>> 18 - o * 6 & 63, n = a[o * 64 + t];
      u <<= 4, u |= n;
    }
    for (var o = 0; o < 4; o++) {
      var t = r >>> 18 - o * 6 & 63, n = a[256 + o * 64 + t];
      u <<= 4, u |= n;
    }
    return u >>> 0;
  };
  var h = [
    16,
    25,
    12,
    11,
    3,
    20,
    4,
    15,
    31,
    17,
    9,
    6,
    27,
    14,
    1,
    22,
    30,
    24,
    8,
    18,
    0,
    5,
    29,
    23,
    13,
    19,
    2,
    26,
    10,
    21,
    28,
    7
  ];
  return utils$3.permute = function(p) {
    for (var r = 0, u = 0; u < h.length; u++)
      r <<= 1, r |= p >>> h[u] & 1;
    return r >>> 0;
  }, utils$3.padSplit = function(p, r, u) {
    for (var o = p.toString(2); o.length < r; )
      o = "0" + o;
    for (var t = [], n = 0; n < r; n += u)
      t.push(o.slice(n, n + u));
    return t.join(" ");
  }, utils$3;
}
var minimalisticAssert, hasRequiredMinimalisticAssert;
function requireMinimalisticAssert() {
  if (hasRequiredMinimalisticAssert) return minimalisticAssert;
  hasRequiredMinimalisticAssert = 1, minimalisticAssert = c;
  function c(a, h) {
    if (!a)
      throw new Error(h || "Assertion failed");
  }
  return c.equal = function(h, f, p) {
    if (h != f)
      throw new Error(p || "Assertion failed: " + h + " != " + f);
  }, minimalisticAssert;
}
var cipher, hasRequiredCipher;
function requireCipher() {
  if (hasRequiredCipher) return cipher;
  hasRequiredCipher = 1;
  var c = requireMinimalisticAssert();
  function a(h) {
    this.options = h, this.type = this.options.type, this.blockSize = 8, this._init(), this.buffer = new Array(this.blockSize), this.bufferOff = 0, this.padding = h.padding !== !1;
  }
  return cipher = a, a.prototype._init = function() {
  }, a.prototype.update = function(f) {
    return f.length === 0 ? [] : this.type === "decrypt" ? this._updateDecrypt(f) : this._updateEncrypt(f);
  }, a.prototype._buffer = function(f, p) {
    for (var r = Math.min(this.buffer.length - this.bufferOff, f.length - p), u = 0; u < r; u++)
      this.buffer[this.bufferOff + u] = f[p + u];
    return this.bufferOff += r, r;
  }, a.prototype._flushBuffer = function(f, p) {
    return this._update(this.buffer, 0, f, p), this.bufferOff = 0, this.blockSize;
  }, a.prototype._updateEncrypt = function(f) {
    var p = 0, r = 0, u = (this.bufferOff + f.length) / this.blockSize | 0, o = new Array(u * this.blockSize);
    this.bufferOff !== 0 && (p += this._buffer(f, p), this.bufferOff === this.buffer.length && (r += this._flushBuffer(o, r)));
    for (var t = f.length - (f.length - p) % this.blockSize; p < t; p += this.blockSize)
      this._update(f, p, o, r), r += this.blockSize;
    for (; p < f.length; p++, this.bufferOff++)
      this.buffer[this.bufferOff] = f[p];
    return o;
  }, a.prototype._updateDecrypt = function(f) {
    for (var p = 0, r = 0, u = Math.ceil((this.bufferOff + f.length) / this.blockSize) - 1, o = new Array(u * this.blockSize); u > 0; u--)
      p += this._buffer(f, p), r += this._flushBuffer(o, r);
    return p += this._buffer(f, p), o;
  }, a.prototype.final = function(f) {
    var p;
    f && (p = this.update(f));
    var r;
    return this.type === "encrypt" ? r = this._finalEncrypt() : r = this._finalDecrypt(), p ? p.concat(r) : r;
  }, a.prototype._pad = function(f, p) {
    if (p === 0)
      return !1;
    for (; p < f.length; )
      f[p++] = 0;
    return !0;
  }, a.prototype._finalEncrypt = function() {
    if (!this._pad(this.buffer, this.bufferOff))
      return [];
    var f = new Array(this.blockSize);
    return this._update(this.buffer, 0, f, 0), f;
  }, a.prototype._unpad = function(f) {
    return f;
  }, a.prototype._finalDecrypt = function() {
    c.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
    var f = new Array(this.blockSize);
    return this._flushBuffer(f, 0), this._unpad(f);
  }, cipher;
}
var des, hasRequiredDes$1;
function requireDes$1() {
  if (hasRequiredDes$1) return des;
  hasRequiredDes$1 = 1;
  var c = requireMinimalisticAssert(), a = requireInherits_browser(), h = requireUtils$4(), f = requireCipher();
  function p() {
    this.tmp = new Array(2), this.keys = null;
  }
  function r(o) {
    f.call(this, o);
    var t = new p();
    this._desState = t, this.deriveKeys(t, o.key);
  }
  a(r, f), des = r, r.create = function(t) {
    return new r(t);
  };
  var u = [
    1,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    1,
    2,
    2,
    2,
    2,
    2,
    2,
    1
  ];
  return r.prototype.deriveKeys = function(t, n) {
    t.keys = new Array(32), c.equal(n.length, this.blockSize, "Invalid key length");
    var e = h.readUInt32BE(n, 0), s = h.readUInt32BE(n, 4);
    h.pc1(e, s, t.tmp, 0), e = t.tmp[0], s = t.tmp[1];
    for (var d = 0; d < t.keys.length; d += 2) {
      var v = u[d >>> 1];
      e = h.r28shl(e, v), s = h.r28shl(s, v), h.pc2(e, s, t.keys, d);
    }
  }, r.prototype._update = function(t, n, e, s) {
    var d = this._desState, v = h.readUInt32BE(t, n), y = h.readUInt32BE(t, n + 4);
    h.ip(v, y, d.tmp, 0), v = d.tmp[0], y = d.tmp[1], this.type === "encrypt" ? this._encrypt(d, v, y, d.tmp, 0) : this._decrypt(d, v, y, d.tmp, 0), v = d.tmp[0], y = d.tmp[1], h.writeUInt32BE(e, v, s), h.writeUInt32BE(e, y, s + 4);
  }, r.prototype._pad = function(t, n) {
    if (this.padding === !1)
      return !1;
    for (var e = t.length - n, s = n; s < t.length; s++)
      t[s] = e;
    return !0;
  }, r.prototype._unpad = function(t) {
    if (this.padding === !1)
      return t;
    for (var n = t[t.length - 1], e = t.length - n; e < t.length; e++)
      c.equal(t[e], n);
    return t.slice(0, t.length - n);
  }, r.prototype._encrypt = function(t, n, e, s, d) {
    for (var v = n, y = e, m = 0; m < t.keys.length; m += 2) {
      var B = t.keys[m], E = t.keys[m + 1];
      h.expand(y, t.tmp, 0), B ^= t.tmp[0], E ^= t.tmp[1];
      var S = h.substitute(B, E), O = h.permute(S), D = y;
      y = (v ^ O) >>> 0, v = D;
    }
    h.rip(y, v, s, d);
  }, r.prototype._decrypt = function(t, n, e, s, d) {
    for (var v = e, y = n, m = t.keys.length - 2; m >= 0; m -= 2) {
      var B = t.keys[m], E = t.keys[m + 1];
      h.expand(v, t.tmp, 0), B ^= t.tmp[0], E ^= t.tmp[1];
      var S = h.substitute(B, E), O = h.permute(S), D = v;
      v = (y ^ O) >>> 0, y = D;
    }
    h.rip(v, y, s, d);
  }, des;
}
var cbc$1 = {}, hasRequiredCbc$1;
function requireCbc$1() {
  if (hasRequiredCbc$1) return cbc$1;
  hasRequiredCbc$1 = 1;
  var c = requireMinimalisticAssert(), a = requireInherits_browser(), h = {};
  function f(r) {
    c.equal(r.length, 8, "Invalid IV length"), this.iv = new Array(8);
    for (var u = 0; u < this.iv.length; u++)
      this.iv[u] = r[u];
  }
  function p(r) {
    function u(e) {
      r.call(this, e), this._cbcInit();
    }
    a(u, r);
    for (var o = Object.keys(h), t = 0; t < o.length; t++) {
      var n = o[t];
      u.prototype[n] = h[n];
    }
    return u.create = function(s) {
      return new u(s);
    }, u;
  }
  return cbc$1.instantiate = p, h._cbcInit = function() {
    var u = new f(this.options.iv);
    this._cbcState = u;
  }, h._update = function(u, o, t, n) {
    var e = this._cbcState, s = this.constructor.super_.prototype, d = e.iv;
    if (this.type === "encrypt") {
      for (var v = 0; v < this.blockSize; v++)
        d[v] ^= u[o + v];
      s._update.call(this, d, 0, t, n);
      for (var v = 0; v < this.blockSize; v++)
        d[v] = t[n + v];
    } else {
      s._update.call(this, u, o, t, n);
      for (var v = 0; v < this.blockSize; v++)
        t[n + v] ^= d[v];
      for (var v = 0; v < this.blockSize; v++)
        d[v] = u[o + v];
    }
  }, cbc$1;
}
var ede, hasRequiredEde;
function requireEde() {
  if (hasRequiredEde) return ede;
  hasRequiredEde = 1;
  var c = requireMinimalisticAssert(), a = requireInherits_browser(), h = requireCipher(), f = requireDes$1();
  function p(u, o) {
    c.equal(o.length, 24, "Invalid key length");
    var t = o.slice(0, 8), n = o.slice(8, 16), e = o.slice(16, 24);
    u === "encrypt" ? this.ciphers = [
      f.create({ type: "encrypt", key: t }),
      f.create({ type: "decrypt", key: n }),
      f.create({ type: "encrypt", key: e })
    ] : this.ciphers = [
      f.create({ type: "decrypt", key: e }),
      f.create({ type: "encrypt", key: n }),
      f.create({ type: "decrypt", key: t })
    ];
  }
  function r(u) {
    h.call(this, u);
    var o = new p(this.type, this.options.key);
    this._edeState = o;
  }
  return a(r, h), ede = r, r.create = function(o) {
    return new r(o);
  }, r.prototype._update = function(o, t, n, e) {
    var s = this._edeState;
    s.ciphers[0]._update(o, t, n, e), s.ciphers[1]._update(n, e, n, e), s.ciphers[2]._update(n, e, n, e);
  }, r.prototype._pad = f.prototype._pad, r.prototype._unpad = f.prototype._unpad, ede;
}
var hasRequiredDes;
function requireDes() {
  return hasRequiredDes || (hasRequiredDes = 1, des$1.utils = requireUtils$4(), des$1.Cipher = requireCipher(), des$1.DES = requireDes$1(), des$1.CBC = requireCbc$1(), des$1.EDE = requireEde()), des$1;
}
var browserifyDes, hasRequiredBrowserifyDes;
function requireBrowserifyDes() {
  if (hasRequiredBrowserifyDes) return browserifyDes;
  hasRequiredBrowserifyDes = 1;
  var c = requireCipherBase(), a = requireDes(), h = requireInherits_browser(), f = requireSafeBuffer$1().Buffer, p = {
    "des-ede3-cbc": a.CBC.instantiate(a.EDE),
    "des-ede3": a.EDE,
    "des-ede-cbc": a.CBC.instantiate(a.EDE),
    "des-ede": a.EDE,
    "des-cbc": a.CBC.instantiate(a.DES),
    "des-ecb": a.DES
  };
  p.des = p["des-cbc"], p.des3 = p["des-ede3-cbc"], browserifyDes = r, h(r, c);
  function r(u) {
    c.call(this);
    var o = u.mode.toLowerCase(), t = p[o], n;
    u.decrypt ? n = "decrypt" : n = "encrypt";
    var e = u.key;
    f.isBuffer(e) || (e = f.from(e)), (o === "des-ede" || o === "des-ede-cbc") && (e = f.concat([e, e.slice(0, 8)]));
    var s = u.iv;
    f.isBuffer(s) || (s = f.from(s)), this._des = t.create({
      key: e,
      iv: s,
      type: n
    });
  }
  return r.prototype._update = function(u) {
    return f.from(this._des.update(u));
  }, r.prototype._final = function() {
    return f.from(this._des.final());
  }, browserifyDes;
}
var browser$5 = {}, encrypter = {}, ecb = {}, hasRequiredEcb;
function requireEcb() {
  return hasRequiredEcb || (hasRequiredEcb = 1, ecb.encrypt = function(c, a) {
    return c._cipher.encryptBlock(a);
  }, ecb.decrypt = function(c, a) {
    return c._cipher.decryptBlock(a);
  }), ecb;
}
var cbc = {}, bufferXor, hasRequiredBufferXor;
function requireBufferXor() {
  return hasRequiredBufferXor || (hasRequiredBufferXor = 1, bufferXor = function(a, h) {
    for (var f = Math.min(a.length, h.length), p = new Buffer(f), r = 0; r < f; ++r)
      p[r] = a[r] ^ h[r];
    return p;
  }), bufferXor;
}
var hasRequiredCbc;
function requireCbc() {
  if (hasRequiredCbc) return cbc;
  hasRequiredCbc = 1;
  var c = requireBufferXor();
  return cbc.encrypt = function(a, h) {
    var f = c(h, a._prev);
    return a._prev = a._cipher.encryptBlock(f), a._prev;
  }, cbc.decrypt = function(a, h) {
    var f = a._prev;
    a._prev = h;
    var p = a._cipher.decryptBlock(h);
    return c(p, f);
  }, cbc;
}
var cfb = {}, hasRequiredCfb;
function requireCfb() {
  if (hasRequiredCfb) return cfb;
  hasRequiredCfb = 1;
  var c = requireSafeBuffer$1().Buffer, a = requireBufferXor();
  function h(f, p, r) {
    var u = p.length, o = a(p, f._cache);
    return f._cache = f._cache.slice(u), f._prev = c.concat([f._prev, r ? p : o]), o;
  }
  return cfb.encrypt = function(f, p, r) {
    for (var u = c.allocUnsafe(0), o; p.length; )
      if (f._cache.length === 0 && (f._cache = f._cipher.encryptBlock(f._prev), f._prev = c.allocUnsafe(0)), f._cache.length <= p.length)
        o = f._cache.length, u = c.concat([u, h(f, p.slice(0, o), r)]), p = p.slice(o);
      else {
        u = c.concat([u, h(f, p, r)]);
        break;
      }
    return u;
  }, cfb;
}
var cfb8 = {}, hasRequiredCfb8;
function requireCfb8() {
  if (hasRequiredCfb8) return cfb8;
  hasRequiredCfb8 = 1;
  var c = requireSafeBuffer$1().Buffer;
  function a(h, f, p) {
    var r = h._cipher.encryptBlock(h._prev), u = r[0] ^ f;
    return h._prev = c.concat([
      h._prev.slice(1),
      c.from([p ? f : u])
    ]), u;
  }
  return cfb8.encrypt = function(h, f, p) {
    for (var r = f.length, u = c.allocUnsafe(r), o = -1; ++o < r; )
      u[o] = a(h, f[o], p);
    return u;
  }, cfb8;
}
var cfb1 = {}, hasRequiredCfb1;
function requireCfb1() {
  if (hasRequiredCfb1) return cfb1;
  hasRequiredCfb1 = 1;
  var c = requireSafeBuffer$1().Buffer;
  function a(f, p, r) {
    for (var u, o = -1, t = 8, n = 0, e, s; ++o < t; )
      u = f._cipher.encryptBlock(f._prev), e = p & 1 << 7 - o ? 128 : 0, s = u[0] ^ e, n += (s & 128) >> o % 8, f._prev = h(f._prev, r ? e : s);
    return n;
  }
  function h(f, p) {
    var r = f.length, u = -1, o = c.allocUnsafe(f.length);
    for (f = c.concat([f, c.from([p])]); ++u < r; )
      o[u] = f[u] << 1 | f[u + 1] >> 7;
    return o;
  }
  return cfb1.encrypt = function(f, p, r) {
    for (var u = p.length, o = c.allocUnsafe(u), t = -1; ++t < u; )
      o[t] = a(f, p[t], r);
    return o;
  }, cfb1;
}
var ofb = {}, hasRequiredOfb;
function requireOfb() {
  if (hasRequiredOfb) return ofb;
  hasRequiredOfb = 1;
  var c = requireBufferXor();
  function a(h) {
    return h._prev = h._cipher.encryptBlock(h._prev), h._prev;
  }
  return ofb.encrypt = function(h, f) {
    for (; h._cache.length < f.length; )
      h._cache = Buffer.concat([h._cache, a(h)]);
    var p = h._cache.slice(0, f.length);
    return h._cache = h._cache.slice(f.length), c(f, p);
  }, ofb;
}
var ctr = {}, incr32_1, hasRequiredIncr32;
function requireIncr32() {
  if (hasRequiredIncr32) return incr32_1;
  hasRequiredIncr32 = 1;
  function c(a) {
    for (var h = a.length, f; h--; )
      if (f = a.readUInt8(h), f === 255)
        a.writeUInt8(0, h);
      else {
        f++, a.writeUInt8(f, h);
        break;
      }
  }
  return incr32_1 = c, incr32_1;
}
var hasRequiredCtr;
function requireCtr() {
  if (hasRequiredCtr) return ctr;
  hasRequiredCtr = 1;
  var c = requireBufferXor(), a = requireSafeBuffer$1().Buffer, h = requireIncr32();
  function f(r) {
    var u = r._cipher.encryptBlockRaw(r._prev);
    return h(r._prev), u;
  }
  var p = 16;
  return ctr.encrypt = function(r, u) {
    var o = Math.ceil(u.length / p), t = r._cache.length;
    r._cache = a.concat([
      r._cache,
      a.allocUnsafe(o * p)
    ]);
    for (var n = 0; n < o; n++) {
      var e = f(r), s = t + n * p;
      r._cache.writeUInt32BE(e[0], s + 0), r._cache.writeUInt32BE(e[1], s + 4), r._cache.writeUInt32BE(e[2], s + 8), r._cache.writeUInt32BE(e[3], s + 12);
    }
    var d = r._cache.slice(0, u.length);
    return r._cache = r._cache.slice(u.length), c(u, d);
  }, ctr;
}
const aes128 = { cipher: "AES", key: 128, iv: 16, mode: "CBC", type: "block" }, aes192 = { cipher: "AES", key: 192, iv: 16, mode: "CBC", type: "block" }, aes256 = { cipher: "AES", key: 256, iv: 16, mode: "CBC", type: "block" }, require$$2 = {
  "aes-128-ecb": { cipher: "AES", key: 128, iv: 0, mode: "ECB", type: "block" },
  "aes-192-ecb": { cipher: "AES", key: 192, iv: 0, mode: "ECB", type: "block" },
  "aes-256-ecb": { cipher: "AES", key: 256, iv: 0, mode: "ECB", type: "block" },
  "aes-128-cbc": { cipher: "AES", key: 128, iv: 16, mode: "CBC", type: "block" },
  "aes-192-cbc": { cipher: "AES", key: 192, iv: 16, mode: "CBC", type: "block" },
  "aes-256-cbc": { cipher: "AES", key: 256, iv: 16, mode: "CBC", type: "block" },
  aes128,
  aes192,
  aes256,
  "aes-128-cfb": { cipher: "AES", key: 128, iv: 16, mode: "CFB", type: "stream" },
  "aes-192-cfb": { cipher: "AES", key: 192, iv: 16, mode: "CFB", type: "stream" },
  "aes-256-cfb": { cipher: "AES", key: 256, iv: 16, mode: "CFB", type: "stream" },
  "aes-128-cfb8": { cipher: "AES", key: 128, iv: 16, mode: "CFB8", type: "stream" },
  "aes-192-cfb8": { cipher: "AES", key: 192, iv: 16, mode: "CFB8", type: "stream" },
  "aes-256-cfb8": { cipher: "AES", key: 256, iv: 16, mode: "CFB8", type: "stream" },
  "aes-128-cfb1": { cipher: "AES", key: 128, iv: 16, mode: "CFB1", type: "stream" },
  "aes-192-cfb1": { cipher: "AES", key: 192, iv: 16, mode: "CFB1", type: "stream" },
  "aes-256-cfb1": { cipher: "AES", key: 256, iv: 16, mode: "CFB1", type: "stream" },
  "aes-128-ofb": { cipher: "AES", key: 128, iv: 16, mode: "OFB", type: "stream" },
  "aes-192-ofb": { cipher: "AES", key: 192, iv: 16, mode: "OFB", type: "stream" },
  "aes-256-ofb": { cipher: "AES", key: 256, iv: 16, mode: "OFB", type: "stream" },
  "aes-128-ctr": { cipher: "AES", key: 128, iv: 16, mode: "CTR", type: "stream" },
  "aes-192-ctr": { cipher: "AES", key: 192, iv: 16, mode: "CTR", type: "stream" },
  "aes-256-ctr": { cipher: "AES", key: 256, iv: 16, mode: "CTR", type: "stream" },
  "aes-128-gcm": { cipher: "AES", key: 128, iv: 12, mode: "GCM", type: "auth" },
  "aes-192-gcm": { cipher: "AES", key: 192, iv: 12, mode: "GCM", type: "auth" },
  "aes-256-gcm": { cipher: "AES", key: 256, iv: 12, mode: "GCM", type: "auth" }
};
var modes_1, hasRequiredModes$1;
function requireModes$1() {
  if (hasRequiredModes$1) return modes_1;
  hasRequiredModes$1 = 1;
  var c = {
    ECB: requireEcb(),
    CBC: requireCbc(),
    CFB: requireCfb(),
    CFB8: requireCfb8(),
    CFB1: requireCfb1(),
    OFB: requireOfb(),
    CTR: requireCtr(),
    GCM: requireCtr()
  }, a = require$$2;
  for (var h in a)
    a[h].module = c[a[h].mode];
  return modes_1 = a, modes_1;
}
var aes = {}, hasRequiredAes;
function requireAes() {
  if (hasRequiredAes) return aes;
  hasRequiredAes = 1;
  var c = requireSafeBuffer$1().Buffer;
  function a(o) {
    c.isBuffer(o) || (o = c.from(o));
    for (var t = o.length / 4 | 0, n = new Array(t), e = 0; e < t; e++)
      n[e] = o.readUInt32BE(e * 4);
    return n;
  }
  function h(o) {
    for (var t = 0; t < o.length; o++)
      o[t] = 0;
  }
  function f(o, t, n, e, s) {
    for (var d = n[0], v = n[1], y = n[2], m = n[3], B = o[0] ^ t[0], E = o[1] ^ t[1], S = o[2] ^ t[2], O = o[3] ^ t[3], D, $, V, J, ie = 4, ne = 1; ne < s; ne++)
      D = d[B >>> 24] ^ v[E >>> 16 & 255] ^ y[S >>> 8 & 255] ^ m[O & 255] ^ t[ie++], $ = d[E >>> 24] ^ v[S >>> 16 & 255] ^ y[O >>> 8 & 255] ^ m[B & 255] ^ t[ie++], V = d[S >>> 24] ^ v[O >>> 16 & 255] ^ y[B >>> 8 & 255] ^ m[E & 255] ^ t[ie++], J = d[O >>> 24] ^ v[B >>> 16 & 255] ^ y[E >>> 8 & 255] ^ m[S & 255] ^ t[ie++], B = D, E = $, S = V, O = J;
    return D = (e[B >>> 24] << 24 | e[E >>> 16 & 255] << 16 | e[S >>> 8 & 255] << 8 | e[O & 255]) ^ t[ie++], $ = (e[E >>> 24] << 24 | e[S >>> 16 & 255] << 16 | e[O >>> 8 & 255] << 8 | e[B & 255]) ^ t[ie++], V = (e[S >>> 24] << 24 | e[O >>> 16 & 255] << 16 | e[B >>> 8 & 255] << 8 | e[E & 255]) ^ t[ie++], J = (e[O >>> 24] << 24 | e[B >>> 16 & 255] << 16 | e[E >>> 8 & 255] << 8 | e[S & 255]) ^ t[ie++], D = D >>> 0, $ = $ >>> 0, V = V >>> 0, J = J >>> 0, [D, $, V, J];
  }
  var p = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], r = (function() {
    for (var o = new Array(256), t = 0; t < 256; t++)
      t < 128 ? o[t] = t << 1 : o[t] = t << 1 ^ 283;
    for (var n = [], e = [], s = [[], [], [], []], d = [[], [], [], []], v = 0, y = 0, m = 0; m < 256; ++m) {
      var B = y ^ y << 1 ^ y << 2 ^ y << 3 ^ y << 4;
      B = B >>> 8 ^ B & 255 ^ 99, n[v] = B, e[B] = v;
      var E = o[v], S = o[E], O = o[S], D = o[B] * 257 ^ B * 16843008;
      s[0][v] = D << 24 | D >>> 8, s[1][v] = D << 16 | D >>> 16, s[2][v] = D << 8 | D >>> 24, s[3][v] = D, D = O * 16843009 ^ S * 65537 ^ E * 257 ^ v * 16843008, d[0][B] = D << 24 | D >>> 8, d[1][B] = D << 16 | D >>> 16, d[2][B] = D << 8 | D >>> 24, d[3][B] = D, v === 0 ? v = y = 1 : (v = E ^ o[o[o[O ^ E]]], y ^= o[o[y]]);
    }
    return {
      SBOX: n,
      INV_SBOX: e,
      SUB_MIX: s,
      INV_SUB_MIX: d
    };
  })();
  function u(o) {
    this._key = a(o), this._reset();
  }
  return u.blockSize = 16, u.keySize = 256 / 8, u.prototype.blockSize = u.blockSize, u.prototype.keySize = u.keySize, u.prototype._reset = function() {
    for (var o = this._key, t = o.length, n = t + 6, e = (n + 1) * 4, s = [], d = 0; d < t; d++)
      s[d] = o[d];
    for (d = t; d < e; d++) {
      var v = s[d - 1];
      d % t === 0 ? (v = v << 8 | v >>> 24, v = r.SBOX[v >>> 24] << 24 | r.SBOX[v >>> 16 & 255] << 16 | r.SBOX[v >>> 8 & 255] << 8 | r.SBOX[v & 255], v ^= p[d / t | 0] << 24) : t > 6 && d % t === 4 && (v = r.SBOX[v >>> 24] << 24 | r.SBOX[v >>> 16 & 255] << 16 | r.SBOX[v >>> 8 & 255] << 8 | r.SBOX[v & 255]), s[d] = s[d - t] ^ v;
    }
    for (var y = [], m = 0; m < e; m++) {
      var B = e - m, E = s[B - (m % 4 ? 0 : 4)];
      m < 4 || B <= 4 ? y[m] = E : y[m] = r.INV_SUB_MIX[0][r.SBOX[E >>> 24]] ^ r.INV_SUB_MIX[1][r.SBOX[E >>> 16 & 255]] ^ r.INV_SUB_MIX[2][r.SBOX[E >>> 8 & 255]] ^ r.INV_SUB_MIX[3][r.SBOX[E & 255]];
    }
    this._nRounds = n, this._keySchedule = s, this._invKeySchedule = y;
  }, u.prototype.encryptBlockRaw = function(o) {
    return o = a(o), f(o, this._keySchedule, r.SUB_MIX, r.SBOX, this._nRounds);
  }, u.prototype.encryptBlock = function(o) {
    var t = this.encryptBlockRaw(o), n = c.allocUnsafe(16);
    return n.writeUInt32BE(t[0], 0), n.writeUInt32BE(t[1], 4), n.writeUInt32BE(t[2], 8), n.writeUInt32BE(t[3], 12), n;
  }, u.prototype.decryptBlock = function(o) {
    o = a(o);
    var t = o[1];
    o[1] = o[3], o[3] = t;
    var n = f(o, this._invKeySchedule, r.INV_SUB_MIX, r.INV_SBOX, this._nRounds), e = c.allocUnsafe(16);
    return e.writeUInt32BE(n[0], 0), e.writeUInt32BE(n[3], 4), e.writeUInt32BE(n[2], 8), e.writeUInt32BE(n[1], 12), e;
  }, u.prototype.scrub = function() {
    h(this._keySchedule), h(this._invKeySchedule), h(this._key);
  }, aes.AES = u, aes;
}
var ghash, hasRequiredGhash;
function requireGhash() {
  if (hasRequiredGhash) return ghash;
  hasRequiredGhash = 1;
  var c = requireSafeBuffer$1().Buffer, a = c.alloc(16, 0);
  function h(r) {
    return [
      r.readUInt32BE(0),
      r.readUInt32BE(4),
      r.readUInt32BE(8),
      r.readUInt32BE(12)
    ];
  }
  function f(r) {
    var u = c.allocUnsafe(16);
    return u.writeUInt32BE(r[0] >>> 0, 0), u.writeUInt32BE(r[1] >>> 0, 4), u.writeUInt32BE(r[2] >>> 0, 8), u.writeUInt32BE(r[3] >>> 0, 12), u;
  }
  function p(r) {
    this.h = r, this.state = c.alloc(16, 0), this.cache = c.allocUnsafe(0);
  }
  return p.prototype.ghash = function(r) {
    for (var u = -1; ++u < r.length; )
      this.state[u] ^= r[u];
    this._multiply();
  }, p.prototype._multiply = function() {
    for (var r = h(this.h), u = [0, 0, 0, 0], o, t, n, e = -1; ++e < 128; ) {
      for (t = (this.state[~~(e / 8)] & 1 << 7 - e % 8) !== 0, t && (u[0] ^= r[0], u[1] ^= r[1], u[2] ^= r[2], u[3] ^= r[3]), n = (r[3] & 1) !== 0, o = 3; o > 0; o--)
        r[o] = r[o] >>> 1 | (r[o - 1] & 1) << 31;
      r[0] = r[0] >>> 1, n && (r[0] = r[0] ^ 225 << 24);
    }
    this.state = f(u);
  }, p.prototype.update = function(r) {
    this.cache = c.concat([this.cache, r]);
    for (var u; this.cache.length >= 16; )
      u = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(u);
  }, p.prototype.final = function(r, u) {
    return this.cache.length && this.ghash(c.concat([this.cache, a], 16)), this.ghash(f([0, r, 0, u])), this.state;
  }, ghash = p, ghash;
}
var authCipher, hasRequiredAuthCipher;
function requireAuthCipher() {
  if (hasRequiredAuthCipher) return authCipher;
  hasRequiredAuthCipher = 1;
  var c = requireAes(), a = requireSafeBuffer$1().Buffer, h = requireCipherBase(), f = requireInherits_browser(), p = requireGhash(), r = requireBufferXor(), u = requireIncr32();
  function o(e, s) {
    var d = 0;
    e.length !== s.length && d++;
    for (var v = Math.min(e.length, s.length), y = 0; y < v; ++y)
      d += e[y] ^ s[y];
    return d;
  }
  function t(e, s, d) {
    if (s.length === 12)
      return e._finID = a.concat([s, a.from([0, 0, 0, 1])]), a.concat([s, a.from([0, 0, 0, 2])]);
    var v = new p(d), y = s.length, m = y % 16;
    v.update(s), m && (m = 16 - m, v.update(a.alloc(m, 0))), v.update(a.alloc(8, 0));
    var B = y * 8, E = a.alloc(8);
    E.writeUIntBE(B, 0, 8), v.update(E), e._finID = v.state;
    var S = a.from(e._finID);
    return u(S), S;
  }
  function n(e, s, d, v) {
    h.call(this);
    var y = a.alloc(4, 0);
    this._cipher = new c.AES(s);
    var m = this._cipher.encryptBlock(y);
    this._ghash = new p(m), d = t(this, d, m), this._prev = a.from(d), this._cache = a.allocUnsafe(0), this._secCache = a.allocUnsafe(0), this._decrypt = v, this._alen = 0, this._len = 0, this._mode = e, this._authTag = null, this._called = !1;
  }
  return f(n, h), n.prototype._update = function(e) {
    if (!this._called && this._alen) {
      var s = 16 - this._alen % 16;
      s < 16 && (s = a.alloc(s, 0), this._ghash.update(s));
    }
    this._called = !0;
    var d = this._mode.encrypt(this, e);
    return this._decrypt ? this._ghash.update(e) : this._ghash.update(d), this._len += e.length, d;
  }, n.prototype._final = function() {
    if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
    var e = r(this._ghash.final(this._alen * 8, this._len * 8), this._cipher.encryptBlock(this._finID));
    if (this._decrypt && o(e, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
    this._authTag = e, this._cipher.scrub();
  }, n.prototype.getAuthTag = function() {
    if (this._decrypt || !a.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state");
    return this._authTag;
  }, n.prototype.setAuthTag = function(s) {
    if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
    this._authTag = s;
  }, n.prototype.setAAD = function(s) {
    if (this._called) throw new Error("Attempting to set AAD in unsupported state");
    this._ghash.update(s), this._alen += s.length;
  }, authCipher = n, authCipher;
}
var streamCipher, hasRequiredStreamCipher;
function requireStreamCipher() {
  if (hasRequiredStreamCipher) return streamCipher;
  hasRequiredStreamCipher = 1;
  var c = requireAes(), a = requireSafeBuffer$1().Buffer, h = requireCipherBase(), f = requireInherits_browser();
  function p(r, u, o, t) {
    h.call(this), this._cipher = new c.AES(u), this._prev = a.from(o), this._cache = a.allocUnsafe(0), this._secCache = a.allocUnsafe(0), this._decrypt = t, this._mode = r;
  }
  return f(p, h), p.prototype._update = function(r) {
    return this._mode.encrypt(this, r, this._decrypt);
  }, p.prototype._final = function() {
    this._cipher.scrub();
  }, streamCipher = p, streamCipher;
}
var evp_bytestokey, hasRequiredEvp_bytestokey;
function requireEvp_bytestokey() {
  if (hasRequiredEvp_bytestokey) return evp_bytestokey;
  hasRequiredEvp_bytestokey = 1;
  var c = requireSafeBuffer$1().Buffer, a = requireMd5_js();
  function h(f, p, r, u) {
    if (c.isBuffer(f) || (f = c.from(f, "binary")), p && (c.isBuffer(p) || (p = c.from(p, "binary")), p.length !== 8))
      throw new RangeError("salt should be Buffer with 8 byte length");
    for (var o = r / 8, t = c.alloc(o), n = c.alloc(u || 0), e = c.alloc(0); o > 0 || u > 0; ) {
      var s = new a();
      s.update(e), s.update(f), p && s.update(p), e = s.digest();
      var d = 0;
      if (o > 0) {
        var v = t.length - o;
        d = Math.min(o, e.length), e.copy(t, v, 0, d), o -= d;
      }
      if (d < e.length && u > 0) {
        var y = n.length - u, m = Math.min(u, e.length - d);
        e.copy(n, y, d, d + m), u -= m;
      }
    }
    return e.fill(0), { key: t, iv: n };
  }
  return evp_bytestokey = h, evp_bytestokey;
}
var hasRequiredEncrypter;
function requireEncrypter() {
  if (hasRequiredEncrypter) return encrypter;
  hasRequiredEncrypter = 1;
  var c = requireModes$1(), a = requireAuthCipher(), h = requireSafeBuffer$1().Buffer, f = requireStreamCipher(), p = requireCipherBase(), r = requireAes(), u = requireEvp_bytestokey(), o = requireInherits_browser();
  function t(v, y, m) {
    p.call(this), this._cache = new e(), this._cipher = new r.AES(y), this._prev = h.from(m), this._mode = v, this._autopadding = !0;
  }
  o(t, p), t.prototype._update = function(v) {
    this._cache.add(v);
    for (var y, m, B = []; y = this._cache.get(); )
      m = this._mode.encrypt(this, y), B.push(m);
    return h.concat(B);
  };
  var n = h.alloc(16, 16);
  t.prototype._final = function() {
    var v = this._cache.flush();
    if (this._autopadding)
      return v = this._mode.encrypt(this, v), this._cipher.scrub(), v;
    if (!v.equals(n))
      throw this._cipher.scrub(), new Error("data not multiple of block length");
  }, t.prototype.setAutoPadding = function(v) {
    return this._autopadding = !!v, this;
  };
  function e() {
    this.cache = h.allocUnsafe(0);
  }
  e.prototype.add = function(v) {
    this.cache = h.concat([this.cache, v]);
  }, e.prototype.get = function() {
    if (this.cache.length > 15) {
      var v = this.cache.slice(0, 16);
      return this.cache = this.cache.slice(16), v;
    }
    return null;
  }, e.prototype.flush = function() {
    for (var v = 16 - this.cache.length, y = h.allocUnsafe(v), m = -1; ++m < v; )
      y.writeUInt8(v, m);
    return h.concat([this.cache, y]);
  };
  function s(v, y, m) {
    var B = c[v.toLowerCase()];
    if (!B) throw new TypeError("invalid suite type");
    if (typeof y == "string" && (y = h.from(y)), y.length !== B.key / 8) throw new TypeError("invalid key length " + y.length);
    if (typeof m == "string" && (m = h.from(m)), B.mode !== "GCM" && m.length !== B.iv) throw new TypeError("invalid iv length " + m.length);
    return B.type === "stream" ? new f(B.module, y, m) : B.type === "auth" ? new a(B.module, y, m) : new t(B.module, y, m);
  }
  function d(v, y) {
    var m = c[v.toLowerCase()];
    if (!m) throw new TypeError("invalid suite type");
    var B = u(y, !1, m.key, m.iv);
    return s(v, B.key, B.iv);
  }
  return encrypter.createCipheriv = s, encrypter.createCipher = d, encrypter;
}
var decrypter = {}, hasRequiredDecrypter;
function requireDecrypter() {
  if (hasRequiredDecrypter) return decrypter;
  hasRequiredDecrypter = 1;
  var c = requireAuthCipher(), a = requireSafeBuffer$1().Buffer, h = requireModes$1(), f = requireStreamCipher(), p = requireCipherBase(), r = requireAes(), u = requireEvp_bytestokey(), o = requireInherits_browser();
  function t(v, y, m) {
    p.call(this), this._cache = new n(), this._last = void 0, this._cipher = new r.AES(y), this._prev = a.from(m), this._mode = v, this._autopadding = !0;
  }
  o(t, p), t.prototype._update = function(v) {
    this._cache.add(v);
    for (var y, m, B = []; y = this._cache.get(this._autopadding); )
      m = this._mode.decrypt(this, y), B.push(m);
    return a.concat(B);
  }, t.prototype._final = function() {
    var v = this._cache.flush();
    if (this._autopadding)
      return e(this._mode.decrypt(this, v));
    if (v)
      throw new Error("data not multiple of block length");
  }, t.prototype.setAutoPadding = function(v) {
    return this._autopadding = !!v, this;
  };
  function n() {
    this.cache = a.allocUnsafe(0);
  }
  n.prototype.add = function(v) {
    this.cache = a.concat([this.cache, v]);
  }, n.prototype.get = function(v) {
    var y;
    if (v) {
      if (this.cache.length > 16)
        return y = this.cache.slice(0, 16), this.cache = this.cache.slice(16), y;
    } else if (this.cache.length >= 16)
      return y = this.cache.slice(0, 16), this.cache = this.cache.slice(16), y;
    return null;
  }, n.prototype.flush = function() {
    if (this.cache.length) return this.cache;
  };
  function e(v) {
    var y = v[15];
    if (y < 1 || y > 16)
      throw new Error("unable to decrypt data");
    for (var m = -1; ++m < y; )
      if (v[m + (16 - y)] !== y)
        throw new Error("unable to decrypt data");
    if (y !== 16)
      return v.slice(0, 16 - y);
  }
  function s(v, y, m) {
    var B = h[v.toLowerCase()];
    if (!B) throw new TypeError("invalid suite type");
    if (typeof m == "string" && (m = a.from(m)), B.mode !== "GCM" && m.length !== B.iv) throw new TypeError("invalid iv length " + m.length);
    if (typeof y == "string" && (y = a.from(y)), y.length !== B.key / 8) throw new TypeError("invalid key length " + y.length);
    return B.type === "stream" ? new f(B.module, y, m, !0) : B.type === "auth" ? new c(B.module, y, m, !0) : new t(B.module, y, m);
  }
  function d(v, y) {
    var m = h[v.toLowerCase()];
    if (!m) throw new TypeError("invalid suite type");
    var B = u(y, !1, m.key, m.iv);
    return s(v, B.key, B.iv);
  }
  return decrypter.createDecipher = d, decrypter.createDecipheriv = s, decrypter;
}
var hasRequiredBrowser$6;
function requireBrowser$6() {
  if (hasRequiredBrowser$6) return browser$5;
  hasRequiredBrowser$6 = 1;
  var c = requireEncrypter(), a = requireDecrypter(), h = require$$2;
  function f() {
    return Object.keys(h);
  }
  return browser$5.createCipher = browser$5.Cipher = c.createCipher, browser$5.createCipheriv = browser$5.Cipheriv = c.createCipheriv, browser$5.createDecipher = browser$5.Decipher = a.createDecipher, browser$5.createDecipheriv = browser$5.Decipheriv = a.createDecipheriv, browser$5.listCiphers = browser$5.getCiphers = f, browser$5;
}
var modes = {}, hasRequiredModes;
function requireModes() {
  return hasRequiredModes || (hasRequiredModes = 1, (function(c) {
    c["des-ecb"] = {
      key: 8,
      iv: 0
    }, c["des-cbc"] = c.des = {
      key: 8,
      iv: 8
    }, c["des-ede3-cbc"] = c.des3 = {
      key: 24,
      iv: 8
    }, c["des-ede3"] = {
      key: 24,
      iv: 0
    }, c["des-ede-cbc"] = {
      key: 16,
      iv: 8
    }, c["des-ede"] = {
      key: 16,
      iv: 0
    };
  })(modes)), modes;
}
var hasRequiredBrowser$5;
function requireBrowser$5() {
  if (hasRequiredBrowser$5) return browser$6;
  hasRequiredBrowser$5 = 1;
  var c = requireBrowserifyDes(), a = requireBrowser$6(), h = requireModes$1(), f = requireModes(), p = requireEvp_bytestokey();
  function r(e, s) {
    e = e.toLowerCase();
    var d, v;
    if (h[e])
      d = h[e].key, v = h[e].iv;
    else if (f[e])
      d = f[e].key * 8, v = f[e].iv;
    else
      throw new TypeError("invalid suite type");
    var y = p(s, !1, d, v);
    return o(e, y.key, y.iv);
  }
  function u(e, s) {
    e = e.toLowerCase();
    var d, v;
    if (h[e])
      d = h[e].key, v = h[e].iv;
    else if (f[e])
      d = f[e].key * 8, v = f[e].iv;
    else
      throw new TypeError("invalid suite type");
    var y = p(s, !1, d, v);
    return t(e, y.key, y.iv);
  }
  function o(e, s, d) {
    if (e = e.toLowerCase(), h[e]) return a.createCipheriv(e, s, d);
    if (f[e]) return new c({ key: s, iv: d, mode: e });
    throw new TypeError("invalid suite type");
  }
  function t(e, s, d) {
    if (e = e.toLowerCase(), h[e]) return a.createDecipheriv(e, s, d);
    if (f[e]) return new c({ key: s, iv: d, mode: e, decrypt: !0 });
    throw new TypeError("invalid suite type");
  }
  function n() {
    return Object.keys(f).concat(a.getCiphers());
  }
  return browser$6.createCipher = browser$6.Cipher = r, browser$6.createCipheriv = browser$6.Cipheriv = o, browser$6.createDecipher = browser$6.Decipher = u, browser$6.createDecipheriv = browser$6.Decipheriv = t, browser$6.listCiphers = browser$6.getCiphers = n, browser$6;
}
var browser$4 = {}, bn$3 = { exports: {} }, bn$2 = bn$3.exports, hasRequiredBn$1;
function requireBn$1() {
  return hasRequiredBn$1 || (hasRequiredBn$1 = 1, (function(c) {
    (function(a, h) {
      function f(Y, b) {
        if (!Y) throw new Error(b || "Assertion failed");
      }
      function p(Y, b) {
        Y.super_ = b;
        var g = function() {
        };
        g.prototype = b.prototype, Y.prototype = new g(), Y.prototype.constructor = Y;
      }
      function r(Y, b, g) {
        if (r.isBN(Y))
          return Y;
        this.negative = 0, this.words = null, this.length = 0, this.red = null, Y !== null && ((b === "le" || b === "be") && (g = b, b = 10), this._init(Y || 0, b || 10, g || "be"));
      }
      typeof a == "object" ? a.exports = r : h.BN = r, r.BN = r, r.wordSize = 26;
      var u;
      try {
        typeof window < "u" && typeof window.Buffer < "u" ? u = window.Buffer : u = requireDist().Buffer;
      } catch {
      }
      r.isBN = function(b) {
        return b instanceof r ? !0 : b !== null && typeof b == "object" && b.constructor.wordSize === r.wordSize && Array.isArray(b.words);
      }, r.max = function(b, g) {
        return b.cmp(g) > 0 ? b : g;
      }, r.min = function(b, g) {
        return b.cmp(g) < 0 ? b : g;
      }, r.prototype._init = function(b, g, l) {
        if (typeof b == "number")
          return this._initNumber(b, g, l);
        if (typeof b == "object")
          return this._initArray(b, g, l);
        g === "hex" && (g = 16), f(g === (g | 0) && g >= 2 && g <= 36), b = b.toString().replace(/\s+/g, "");
        var _ = 0;
        b[0] === "-" && (_++, this.negative = 1), _ < b.length && (g === 16 ? this._parseHex(b, _, l) : (this._parseBase(b, g, _), l === "le" && this._initArray(this.toArray(), g, l)));
      }, r.prototype._initNumber = function(b, g, l) {
        b < 0 && (this.negative = 1, b = -b), b < 67108864 ? (this.words = [b & 67108863], this.length = 1) : b < 4503599627370496 ? (this.words = [
          b & 67108863,
          b / 67108864 & 67108863
        ], this.length = 2) : (f(b < 9007199254740992), this.words = [
          b & 67108863,
          b / 67108864 & 67108863,
          1
        ], this.length = 3), l === "le" && this._initArray(this.toArray(), g, l);
      }, r.prototype._initArray = function(b, g, l) {
        if (f(typeof b.length == "number"), b.length <= 0)
          return this.words = [0], this.length = 1, this;
        this.length = Math.ceil(b.length / 3), this.words = new Array(this.length);
        for (var _ = 0; _ < this.length; _++)
          this.words[_] = 0;
        var A, q, P = 0;
        if (l === "be")
          for (_ = b.length - 1, A = 0; _ >= 0; _ -= 3)
            q = b[_] | b[_ - 1] << 8 | b[_ - 2] << 16, this.words[A] |= q << P & 67108863, this.words[A + 1] = q >>> 26 - P & 67108863, P += 24, P >= 26 && (P -= 26, A++);
        else if (l === "le")
          for (_ = 0, A = 0; _ < b.length; _ += 3)
            q = b[_] | b[_ + 1] << 8 | b[_ + 2] << 16, this.words[A] |= q << P & 67108863, this.words[A + 1] = q >>> 26 - P & 67108863, P += 24, P >= 26 && (P -= 26, A++);
        return this.strip();
      };
      function o(Y, b) {
        var g = Y.charCodeAt(b);
        return g >= 65 && g <= 70 ? g - 55 : g >= 97 && g <= 102 ? g - 87 : g - 48 & 15;
      }
      function t(Y, b, g) {
        var l = o(Y, g);
        return g - 1 >= b && (l |= o(Y, g - 1) << 4), l;
      }
      r.prototype._parseHex = function(b, g, l) {
        this.length = Math.ceil((b.length - g) / 6), this.words = new Array(this.length);
        for (var _ = 0; _ < this.length; _++)
          this.words[_] = 0;
        var A = 0, q = 0, P;
        if (l === "be")
          for (_ = b.length - 1; _ >= g; _ -= 2)
            P = t(b, g, _) << A, this.words[q] |= P & 67108863, A >= 18 ? (A -= 18, q += 1, this.words[q] |= P >>> 26) : A += 8;
        else {
          var R = b.length - g;
          for (_ = R % 2 === 0 ? g + 1 : g; _ < b.length; _ += 2)
            P = t(b, g, _) << A, this.words[q] |= P & 67108863, A >= 18 ? (A -= 18, q += 1, this.words[q] |= P >>> 26) : A += 8;
        }
        this.strip();
      };
      function n(Y, b, g, l) {
        for (var _ = 0, A = Math.min(Y.length, g), q = b; q < A; q++) {
          var P = Y.charCodeAt(q) - 48;
          _ *= l, P >= 49 ? _ += P - 49 + 10 : P >= 17 ? _ += P - 17 + 10 : _ += P;
        }
        return _;
      }
      r.prototype._parseBase = function(b, g, l) {
        this.words = [0], this.length = 1;
        for (var _ = 0, A = 1; A <= 67108863; A *= g)
          _++;
        _--, A = A / g | 0;
        for (var q = b.length - l, P = q % _, R = Math.min(q, q - P) + l, w = 0, M = l; M < R; M += _)
          w = n(b, M, M + _, g), this.imuln(A), this.words[0] + w < 67108864 ? this.words[0] += w : this._iaddn(w);
        if (P !== 0) {
          var x = 1;
          for (w = n(b, M, b.length, g), M = 0; M < P; M++)
            x *= g;
          this.imuln(x), this.words[0] + w < 67108864 ? this.words[0] += w : this._iaddn(w);
        }
        this.strip();
      }, r.prototype.copy = function(b) {
        b.words = new Array(this.length);
        for (var g = 0; g < this.length; g++)
          b.words[g] = this.words[g];
        b.length = this.length, b.negative = this.negative, b.red = this.red;
      }, r.prototype.clone = function() {
        var b = new r(null);
        return this.copy(b), b;
      }, r.prototype._expand = function(b) {
        for (; this.length < b; )
          this.words[this.length++] = 0;
        return this;
      }, r.prototype.strip = function() {
        for (; this.length > 1 && this.words[this.length - 1] === 0; )
          this.length--;
        return this._normSign();
      }, r.prototype._normSign = function() {
        return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
      }, r.prototype.inspect = function() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
      };
      var e = [
        "",
        "0",
        "00",
        "000",
        "0000",
        "00000",
        "000000",
        "0000000",
        "00000000",
        "000000000",
        "0000000000",
        "00000000000",
        "000000000000",
        "0000000000000",
        "00000000000000",
        "000000000000000",
        "0000000000000000",
        "00000000000000000",
        "000000000000000000",
        "0000000000000000000",
        "00000000000000000000",
        "000000000000000000000",
        "0000000000000000000000",
        "00000000000000000000000",
        "000000000000000000000000",
        "0000000000000000000000000"
      ], s = [
        0,
        0,
        25,
        16,
        12,
        11,
        10,
        9,
        8,
        8,
        7,
        7,
        7,
        7,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ], d = [
        0,
        0,
        33554432,
        43046721,
        16777216,
        48828125,
        60466176,
        40353607,
        16777216,
        43046721,
        1e7,
        19487171,
        35831808,
        62748517,
        7529536,
        11390625,
        16777216,
        24137569,
        34012224,
        47045881,
        64e6,
        4084101,
        5153632,
        6436343,
        7962624,
        9765625,
        11881376,
        14348907,
        17210368,
        20511149,
        243e5,
        28629151,
        33554432,
        39135393,
        45435424,
        52521875,
        60466176
      ];
      r.prototype.toString = function(b, g) {
        b = b || 10, g = g | 0 || 1;
        var l;
        if (b === 16 || b === "hex") {
          l = "";
          for (var _ = 0, A = 0, q = 0; q < this.length; q++) {
            var P = this.words[q], R = ((P << _ | A) & 16777215).toString(16);
            A = P >>> 24 - _ & 16777215, _ += 2, _ >= 26 && (_ -= 26, q--), A !== 0 || q !== this.length - 1 ? l = e[6 - R.length] + R + l : l = R + l;
          }
          for (A !== 0 && (l = A.toString(16) + l); l.length % g !== 0; )
            l = "0" + l;
          return this.negative !== 0 && (l = "-" + l), l;
        }
        if (b === (b | 0) && b >= 2 && b <= 36) {
          var w = s[b], M = d[b];
          l = "";
          var x = this.clone();
          for (x.negative = 0; !x.isZero(); ) {
            var L = x.modn(M).toString(b);
            x = x.idivn(M), x.isZero() ? l = L + l : l = e[w - L.length] + L + l;
          }
          for (this.isZero() && (l = "0" + l); l.length % g !== 0; )
            l = "0" + l;
          return this.negative !== 0 && (l = "-" + l), l;
        }
        f(!1, "Base should be between 2 and 36");
      }, r.prototype.toNumber = function() {
        var b = this.words[0];
        return this.length === 2 ? b += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? b += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && f(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -b : b;
      }, r.prototype.toJSON = function() {
        return this.toString(16);
      }, r.prototype.toBuffer = function(b, g) {
        return f(typeof u < "u"), this.toArrayLike(u, b, g);
      }, r.prototype.toArray = function(b, g) {
        return this.toArrayLike(Array, b, g);
      }, r.prototype.toArrayLike = function(b, g, l) {
        var _ = this.byteLength(), A = l || Math.max(1, _);
        f(_ <= A, "byte array longer than desired length"), f(A > 0, "Requested array length <= 0"), this.strip();
        var q = g === "le", P = new b(A), R, w, M = this.clone();
        if (q) {
          for (w = 0; !M.isZero(); w++)
            R = M.andln(255), M.iushrn(8), P[w] = R;
          for (; w < A; w++)
            P[w] = 0;
        } else {
          for (w = 0; w < A - _; w++)
            P[w] = 0;
          for (w = 0; !M.isZero(); w++)
            R = M.andln(255), M.iushrn(8), P[A - w - 1] = R;
        }
        return P;
      }, Math.clz32 ? r.prototype._countBits = function(b) {
        return 32 - Math.clz32(b);
      } : r.prototype._countBits = function(b) {
        var g = b, l = 0;
        return g >= 4096 && (l += 13, g >>>= 13), g >= 64 && (l += 7, g >>>= 7), g >= 8 && (l += 4, g >>>= 4), g >= 2 && (l += 2, g >>>= 2), l + g;
      }, r.prototype._zeroBits = function(b) {
        if (b === 0) return 26;
        var g = b, l = 0;
        return (g & 8191) === 0 && (l += 13, g >>>= 13), (g & 127) === 0 && (l += 7, g >>>= 7), (g & 15) === 0 && (l += 4, g >>>= 4), (g & 3) === 0 && (l += 2, g >>>= 2), (g & 1) === 0 && l++, l;
      }, r.prototype.bitLength = function() {
        var b = this.words[this.length - 1], g = this._countBits(b);
        return (this.length - 1) * 26 + g;
      };
      function v(Y) {
        for (var b = new Array(Y.bitLength()), g = 0; g < b.length; g++) {
          var l = g / 26 | 0, _ = g % 26;
          b[g] = (Y.words[l] & 1 << _) >>> _;
        }
        return b;
      }
      r.prototype.zeroBits = function() {
        if (this.isZero()) return 0;
        for (var b = 0, g = 0; g < this.length; g++) {
          var l = this._zeroBits(this.words[g]);
          if (b += l, l !== 26) break;
        }
        return b;
      }, r.prototype.byteLength = function() {
        return Math.ceil(this.bitLength() / 8);
      }, r.prototype.toTwos = function(b) {
        return this.negative !== 0 ? this.abs().inotn(b).iaddn(1) : this.clone();
      }, r.prototype.fromTwos = function(b) {
        return this.testn(b - 1) ? this.notn(b).iaddn(1).ineg() : this.clone();
      }, r.prototype.isNeg = function() {
        return this.negative !== 0;
      }, r.prototype.neg = function() {
        return this.clone().ineg();
      }, r.prototype.ineg = function() {
        return this.isZero() || (this.negative ^= 1), this;
      }, r.prototype.iuor = function(b) {
        for (; this.length < b.length; )
          this.words[this.length++] = 0;
        for (var g = 0; g < b.length; g++)
          this.words[g] = this.words[g] | b.words[g];
        return this.strip();
      }, r.prototype.ior = function(b) {
        return f((this.negative | b.negative) === 0), this.iuor(b);
      }, r.prototype.or = function(b) {
        return this.length > b.length ? this.clone().ior(b) : b.clone().ior(this);
      }, r.prototype.uor = function(b) {
        return this.length > b.length ? this.clone().iuor(b) : b.clone().iuor(this);
      }, r.prototype.iuand = function(b) {
        var g;
        this.length > b.length ? g = b : g = this;
        for (var l = 0; l < g.length; l++)
          this.words[l] = this.words[l] & b.words[l];
        return this.length = g.length, this.strip();
      }, r.prototype.iand = function(b) {
        return f((this.negative | b.negative) === 0), this.iuand(b);
      }, r.prototype.and = function(b) {
        return this.length > b.length ? this.clone().iand(b) : b.clone().iand(this);
      }, r.prototype.uand = function(b) {
        return this.length > b.length ? this.clone().iuand(b) : b.clone().iuand(this);
      }, r.prototype.iuxor = function(b) {
        var g, l;
        this.length > b.length ? (g = this, l = b) : (g = b, l = this);
        for (var _ = 0; _ < l.length; _++)
          this.words[_] = g.words[_] ^ l.words[_];
        if (this !== g)
          for (; _ < g.length; _++)
            this.words[_] = g.words[_];
        return this.length = g.length, this.strip();
      }, r.prototype.ixor = function(b) {
        return f((this.negative | b.negative) === 0), this.iuxor(b);
      }, r.prototype.xor = function(b) {
        return this.length > b.length ? this.clone().ixor(b) : b.clone().ixor(this);
      }, r.prototype.uxor = function(b) {
        return this.length > b.length ? this.clone().iuxor(b) : b.clone().iuxor(this);
      }, r.prototype.inotn = function(b) {
        f(typeof b == "number" && b >= 0);
        var g = Math.ceil(b / 26) | 0, l = b % 26;
        this._expand(g), l > 0 && g--;
        for (var _ = 0; _ < g; _++)
          this.words[_] = ~this.words[_] & 67108863;
        return l > 0 && (this.words[_] = ~this.words[_] & 67108863 >> 26 - l), this.strip();
      }, r.prototype.notn = function(b) {
        return this.clone().inotn(b);
      }, r.prototype.setn = function(b, g) {
        f(typeof b == "number" && b >= 0);
        var l = b / 26 | 0, _ = b % 26;
        return this._expand(l + 1), g ? this.words[l] = this.words[l] | 1 << _ : this.words[l] = this.words[l] & ~(1 << _), this.strip();
      }, r.prototype.iadd = function(b) {
        var g;
        if (this.negative !== 0 && b.negative === 0)
          return this.negative = 0, g = this.isub(b), this.negative ^= 1, this._normSign();
        if (this.negative === 0 && b.negative !== 0)
          return b.negative = 0, g = this.isub(b), b.negative = 1, g._normSign();
        var l, _;
        this.length > b.length ? (l = this, _ = b) : (l = b, _ = this);
        for (var A = 0, q = 0; q < _.length; q++)
          g = (l.words[q] | 0) + (_.words[q] | 0) + A, this.words[q] = g & 67108863, A = g >>> 26;
        for (; A !== 0 && q < l.length; q++)
          g = (l.words[q] | 0) + A, this.words[q] = g & 67108863, A = g >>> 26;
        if (this.length = l.length, A !== 0)
          this.words[this.length] = A, this.length++;
        else if (l !== this)
          for (; q < l.length; q++)
            this.words[q] = l.words[q];
        return this;
      }, r.prototype.add = function(b) {
        var g;
        return b.negative !== 0 && this.negative === 0 ? (b.negative = 0, g = this.sub(b), b.negative ^= 1, g) : b.negative === 0 && this.negative !== 0 ? (this.negative = 0, g = b.sub(this), this.negative = 1, g) : this.length > b.length ? this.clone().iadd(b) : b.clone().iadd(this);
      }, r.prototype.isub = function(b) {
        if (b.negative !== 0) {
          b.negative = 0;
          var g = this.iadd(b);
          return b.negative = 1, g._normSign();
        } else if (this.negative !== 0)
          return this.negative = 0, this.iadd(b), this.negative = 1, this._normSign();
        var l = this.cmp(b);
        if (l === 0)
          return this.negative = 0, this.length = 1, this.words[0] = 0, this;
        var _, A;
        l > 0 ? (_ = this, A = b) : (_ = b, A = this);
        for (var q = 0, P = 0; P < A.length; P++)
          g = (_.words[P] | 0) - (A.words[P] | 0) + q, q = g >> 26, this.words[P] = g & 67108863;
        for (; q !== 0 && P < _.length; P++)
          g = (_.words[P] | 0) + q, q = g >> 26, this.words[P] = g & 67108863;
        if (q === 0 && P < _.length && _ !== this)
          for (; P < _.length; P++)
            this.words[P] = _.words[P];
        return this.length = Math.max(this.length, P), _ !== this && (this.negative = 1), this.strip();
      }, r.prototype.sub = function(b) {
        return this.clone().isub(b);
      };
      function y(Y, b, g) {
        g.negative = b.negative ^ Y.negative;
        var l = Y.length + b.length | 0;
        g.length = l, l = l - 1 | 0;
        var _ = Y.words[0] | 0, A = b.words[0] | 0, q = _ * A, P = q & 67108863, R = q / 67108864 | 0;
        g.words[0] = P;
        for (var w = 1; w < l; w++) {
          for (var M = R >>> 26, x = R & 67108863, L = Math.min(w, b.length - 1), K = Math.max(0, w - Y.length + 1); K <= L; K++) {
            var Q = w - K | 0;
            _ = Y.words[Q] | 0, A = b.words[K] | 0, q = _ * A + x, M += q / 67108864 | 0, x = q & 67108863;
          }
          g.words[w] = x | 0, R = M | 0;
        }
        return R !== 0 ? g.words[w] = R | 0 : g.length--, g.strip();
      }
      var m = function(b, g, l) {
        var _ = b.words, A = g.words, q = l.words, P = 0, R, w, M, x = _[0] | 0, L = x & 8191, K = x >>> 13, Q = _[1] | 0, U = Q & 8191, N = Q >>> 13, F = _[2] | 0, ee = F & 8191, ae = F >>> 13, G = _[3] | 0, z = G & 8191, fe = G >>> 13, me = _[4] | 0, xe = me & 8191, _e = me >>> 13, Be = _[5] | 0, Ae = Be & 8191, be = Be >>> 13, Fe = _[6] | 0, qe = Fe & 8191, Me = Fe >>> 13, Te = _[7] | 0, oe = Te & 8191, ce = Te >>> 13, ge = _[8] | 0, we = ge & 8191, Se = ge >>> 13, Oe = _[9] | 0, j = Oe & 8191, I = Oe >>> 13, C = A[0] | 0, X = C & 8191, se = C >>> 13, de = A[1] | 0, ve = de & 8191, Ce = de >>> 13, Le = A[2] | 0, Ie = Le & 8191, Ue = Le >>> 13, $e = A[3] | 0, He = $e & 8191, Ke = $e >>> 13, Ye = A[4] | 0, We = Ye & 8191, Ze = Ye >>> 13, Xe = A[5] | 0, W = Xe & 8191, T = Xe >>> 13, k = A[6] | 0, re = k & 8191, ue = k >>> 13, pe = A[7] | 0, ye = pe & 8191, ke = pe >>> 13, Ve = A[8] | 0, Ne = Ve & 8191, ze = Ve >>> 13, je = A[9] | 0, Ge = je & 8191, Je = je >>> 13;
        l.negative = b.negative ^ g.negative, l.length = 19, R = Math.imul(L, X), w = Math.imul(L, se), w = w + Math.imul(K, X) | 0, M = Math.imul(K, se);
        var Qe = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (Qe >>> 26) | 0, Qe &= 67108863, R = Math.imul(U, X), w = Math.imul(U, se), w = w + Math.imul(N, X) | 0, M = Math.imul(N, se), R = R + Math.imul(L, ve) | 0, w = w + Math.imul(L, Ce) | 0, w = w + Math.imul(K, ve) | 0, M = M + Math.imul(K, Ce) | 0;
        var er = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (er >>> 26) | 0, er &= 67108863, R = Math.imul(ee, X), w = Math.imul(ee, se), w = w + Math.imul(ae, X) | 0, M = Math.imul(ae, se), R = R + Math.imul(U, ve) | 0, w = w + Math.imul(U, Ce) | 0, w = w + Math.imul(N, ve) | 0, M = M + Math.imul(N, Ce) | 0, R = R + Math.imul(L, Ie) | 0, w = w + Math.imul(L, Ue) | 0, w = w + Math.imul(K, Ie) | 0, M = M + Math.imul(K, Ue) | 0;
        var fr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (fr >>> 26) | 0, fr &= 67108863, R = Math.imul(z, X), w = Math.imul(z, se), w = w + Math.imul(fe, X) | 0, M = Math.imul(fe, se), R = R + Math.imul(ee, ve) | 0, w = w + Math.imul(ee, Ce) | 0, w = w + Math.imul(ae, ve) | 0, M = M + Math.imul(ae, Ce) | 0, R = R + Math.imul(U, Ie) | 0, w = w + Math.imul(U, Ue) | 0, w = w + Math.imul(N, Ie) | 0, M = M + Math.imul(N, Ue) | 0, R = R + Math.imul(L, He) | 0, w = w + Math.imul(L, Ke) | 0, w = w + Math.imul(K, He) | 0, M = M + Math.imul(K, Ke) | 0;
        var ur = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (ur >>> 26) | 0, ur &= 67108863, R = Math.imul(xe, X), w = Math.imul(xe, se), w = w + Math.imul(_e, X) | 0, M = Math.imul(_e, se), R = R + Math.imul(z, ve) | 0, w = w + Math.imul(z, Ce) | 0, w = w + Math.imul(fe, ve) | 0, M = M + Math.imul(fe, Ce) | 0, R = R + Math.imul(ee, Ie) | 0, w = w + Math.imul(ee, Ue) | 0, w = w + Math.imul(ae, Ie) | 0, M = M + Math.imul(ae, Ue) | 0, R = R + Math.imul(U, He) | 0, w = w + Math.imul(U, Ke) | 0, w = w + Math.imul(N, He) | 0, M = M + Math.imul(N, Ke) | 0, R = R + Math.imul(L, We) | 0, w = w + Math.imul(L, Ze) | 0, w = w + Math.imul(K, We) | 0, M = M + Math.imul(K, Ze) | 0;
        var cr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (cr >>> 26) | 0, cr &= 67108863, R = Math.imul(Ae, X), w = Math.imul(Ae, se), w = w + Math.imul(be, X) | 0, M = Math.imul(be, se), R = R + Math.imul(xe, ve) | 0, w = w + Math.imul(xe, Ce) | 0, w = w + Math.imul(_e, ve) | 0, M = M + Math.imul(_e, Ce) | 0, R = R + Math.imul(z, Ie) | 0, w = w + Math.imul(z, Ue) | 0, w = w + Math.imul(fe, Ie) | 0, M = M + Math.imul(fe, Ue) | 0, R = R + Math.imul(ee, He) | 0, w = w + Math.imul(ee, Ke) | 0, w = w + Math.imul(ae, He) | 0, M = M + Math.imul(ae, Ke) | 0, R = R + Math.imul(U, We) | 0, w = w + Math.imul(U, Ze) | 0, w = w + Math.imul(N, We) | 0, M = M + Math.imul(N, Ze) | 0, R = R + Math.imul(L, W) | 0, w = w + Math.imul(L, T) | 0, w = w + Math.imul(K, W) | 0, M = M + Math.imul(K, T) | 0;
        var nr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (nr >>> 26) | 0, nr &= 67108863, R = Math.imul(qe, X), w = Math.imul(qe, se), w = w + Math.imul(Me, X) | 0, M = Math.imul(Me, se), R = R + Math.imul(Ae, ve) | 0, w = w + Math.imul(Ae, Ce) | 0, w = w + Math.imul(be, ve) | 0, M = M + Math.imul(be, Ce) | 0, R = R + Math.imul(xe, Ie) | 0, w = w + Math.imul(xe, Ue) | 0, w = w + Math.imul(_e, Ie) | 0, M = M + Math.imul(_e, Ue) | 0, R = R + Math.imul(z, He) | 0, w = w + Math.imul(z, Ke) | 0, w = w + Math.imul(fe, He) | 0, M = M + Math.imul(fe, Ke) | 0, R = R + Math.imul(ee, We) | 0, w = w + Math.imul(ee, Ze) | 0, w = w + Math.imul(ae, We) | 0, M = M + Math.imul(ae, Ze) | 0, R = R + Math.imul(U, W) | 0, w = w + Math.imul(U, T) | 0, w = w + Math.imul(N, W) | 0, M = M + Math.imul(N, T) | 0, R = R + Math.imul(L, re) | 0, w = w + Math.imul(L, ue) | 0, w = w + Math.imul(K, re) | 0, M = M + Math.imul(K, ue) | 0;
        var hr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (hr >>> 26) | 0, hr &= 67108863, R = Math.imul(oe, X), w = Math.imul(oe, se), w = w + Math.imul(ce, X) | 0, M = Math.imul(ce, se), R = R + Math.imul(qe, ve) | 0, w = w + Math.imul(qe, Ce) | 0, w = w + Math.imul(Me, ve) | 0, M = M + Math.imul(Me, Ce) | 0, R = R + Math.imul(Ae, Ie) | 0, w = w + Math.imul(Ae, Ue) | 0, w = w + Math.imul(be, Ie) | 0, M = M + Math.imul(be, Ue) | 0, R = R + Math.imul(xe, He) | 0, w = w + Math.imul(xe, Ke) | 0, w = w + Math.imul(_e, He) | 0, M = M + Math.imul(_e, Ke) | 0, R = R + Math.imul(z, We) | 0, w = w + Math.imul(z, Ze) | 0, w = w + Math.imul(fe, We) | 0, M = M + Math.imul(fe, Ze) | 0, R = R + Math.imul(ee, W) | 0, w = w + Math.imul(ee, T) | 0, w = w + Math.imul(ae, W) | 0, M = M + Math.imul(ae, T) | 0, R = R + Math.imul(U, re) | 0, w = w + Math.imul(U, ue) | 0, w = w + Math.imul(N, re) | 0, M = M + Math.imul(N, ue) | 0, R = R + Math.imul(L, ye) | 0, w = w + Math.imul(L, ke) | 0, w = w + Math.imul(K, ye) | 0, M = M + Math.imul(K, ke) | 0;
        var dr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (dr >>> 26) | 0, dr &= 67108863, R = Math.imul(we, X), w = Math.imul(we, se), w = w + Math.imul(Se, X) | 0, M = Math.imul(Se, se), R = R + Math.imul(oe, ve) | 0, w = w + Math.imul(oe, Ce) | 0, w = w + Math.imul(ce, ve) | 0, M = M + Math.imul(ce, Ce) | 0, R = R + Math.imul(qe, Ie) | 0, w = w + Math.imul(qe, Ue) | 0, w = w + Math.imul(Me, Ie) | 0, M = M + Math.imul(Me, Ue) | 0, R = R + Math.imul(Ae, He) | 0, w = w + Math.imul(Ae, Ke) | 0, w = w + Math.imul(be, He) | 0, M = M + Math.imul(be, Ke) | 0, R = R + Math.imul(xe, We) | 0, w = w + Math.imul(xe, Ze) | 0, w = w + Math.imul(_e, We) | 0, M = M + Math.imul(_e, Ze) | 0, R = R + Math.imul(z, W) | 0, w = w + Math.imul(z, T) | 0, w = w + Math.imul(fe, W) | 0, M = M + Math.imul(fe, T) | 0, R = R + Math.imul(ee, re) | 0, w = w + Math.imul(ee, ue) | 0, w = w + Math.imul(ae, re) | 0, M = M + Math.imul(ae, ue) | 0, R = R + Math.imul(U, ye) | 0, w = w + Math.imul(U, ke) | 0, w = w + Math.imul(N, ye) | 0, M = M + Math.imul(N, ke) | 0, R = R + Math.imul(L, Ne) | 0, w = w + Math.imul(L, ze) | 0, w = w + Math.imul(K, Ne) | 0, M = M + Math.imul(K, ze) | 0;
        var lr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (lr >>> 26) | 0, lr &= 67108863, R = Math.imul(j, X), w = Math.imul(j, se), w = w + Math.imul(I, X) | 0, M = Math.imul(I, se), R = R + Math.imul(we, ve) | 0, w = w + Math.imul(we, Ce) | 0, w = w + Math.imul(Se, ve) | 0, M = M + Math.imul(Se, Ce) | 0, R = R + Math.imul(oe, Ie) | 0, w = w + Math.imul(oe, Ue) | 0, w = w + Math.imul(ce, Ie) | 0, M = M + Math.imul(ce, Ue) | 0, R = R + Math.imul(qe, He) | 0, w = w + Math.imul(qe, Ke) | 0, w = w + Math.imul(Me, He) | 0, M = M + Math.imul(Me, Ke) | 0, R = R + Math.imul(Ae, We) | 0, w = w + Math.imul(Ae, Ze) | 0, w = w + Math.imul(be, We) | 0, M = M + Math.imul(be, Ze) | 0, R = R + Math.imul(xe, W) | 0, w = w + Math.imul(xe, T) | 0, w = w + Math.imul(_e, W) | 0, M = M + Math.imul(_e, T) | 0, R = R + Math.imul(z, re) | 0, w = w + Math.imul(z, ue) | 0, w = w + Math.imul(fe, re) | 0, M = M + Math.imul(fe, ue) | 0, R = R + Math.imul(ee, ye) | 0, w = w + Math.imul(ee, ke) | 0, w = w + Math.imul(ae, ye) | 0, M = M + Math.imul(ae, ke) | 0, R = R + Math.imul(U, Ne) | 0, w = w + Math.imul(U, ze) | 0, w = w + Math.imul(N, Ne) | 0, M = M + Math.imul(N, ze) | 0, R = R + Math.imul(L, Ge) | 0, w = w + Math.imul(L, Je) | 0, w = w + Math.imul(K, Ge) | 0, M = M + Math.imul(K, Je) | 0;
        var pr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (pr >>> 26) | 0, pr &= 67108863, R = Math.imul(j, ve), w = Math.imul(j, Ce), w = w + Math.imul(I, ve) | 0, M = Math.imul(I, Ce), R = R + Math.imul(we, Ie) | 0, w = w + Math.imul(we, Ue) | 0, w = w + Math.imul(Se, Ie) | 0, M = M + Math.imul(Se, Ue) | 0, R = R + Math.imul(oe, He) | 0, w = w + Math.imul(oe, Ke) | 0, w = w + Math.imul(ce, He) | 0, M = M + Math.imul(ce, Ke) | 0, R = R + Math.imul(qe, We) | 0, w = w + Math.imul(qe, Ze) | 0, w = w + Math.imul(Me, We) | 0, M = M + Math.imul(Me, Ze) | 0, R = R + Math.imul(Ae, W) | 0, w = w + Math.imul(Ae, T) | 0, w = w + Math.imul(be, W) | 0, M = M + Math.imul(be, T) | 0, R = R + Math.imul(xe, re) | 0, w = w + Math.imul(xe, ue) | 0, w = w + Math.imul(_e, re) | 0, M = M + Math.imul(_e, ue) | 0, R = R + Math.imul(z, ye) | 0, w = w + Math.imul(z, ke) | 0, w = w + Math.imul(fe, ye) | 0, M = M + Math.imul(fe, ke) | 0, R = R + Math.imul(ee, Ne) | 0, w = w + Math.imul(ee, ze) | 0, w = w + Math.imul(ae, Ne) | 0, M = M + Math.imul(ae, ze) | 0, R = R + Math.imul(U, Ge) | 0, w = w + Math.imul(U, Je) | 0, w = w + Math.imul(N, Ge) | 0, M = M + Math.imul(N, Je) | 0;
        var vr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (vr >>> 26) | 0, vr &= 67108863, R = Math.imul(j, Ie), w = Math.imul(j, Ue), w = w + Math.imul(I, Ie) | 0, M = Math.imul(I, Ue), R = R + Math.imul(we, He) | 0, w = w + Math.imul(we, Ke) | 0, w = w + Math.imul(Se, He) | 0, M = M + Math.imul(Se, Ke) | 0, R = R + Math.imul(oe, We) | 0, w = w + Math.imul(oe, Ze) | 0, w = w + Math.imul(ce, We) | 0, M = M + Math.imul(ce, Ze) | 0, R = R + Math.imul(qe, W) | 0, w = w + Math.imul(qe, T) | 0, w = w + Math.imul(Me, W) | 0, M = M + Math.imul(Me, T) | 0, R = R + Math.imul(Ae, re) | 0, w = w + Math.imul(Ae, ue) | 0, w = w + Math.imul(be, re) | 0, M = M + Math.imul(be, ue) | 0, R = R + Math.imul(xe, ye) | 0, w = w + Math.imul(xe, ke) | 0, w = w + Math.imul(_e, ye) | 0, M = M + Math.imul(_e, ke) | 0, R = R + Math.imul(z, Ne) | 0, w = w + Math.imul(z, ze) | 0, w = w + Math.imul(fe, Ne) | 0, M = M + Math.imul(fe, ze) | 0, R = R + Math.imul(ee, Ge) | 0, w = w + Math.imul(ee, Je) | 0, w = w + Math.imul(ae, Ge) | 0, M = M + Math.imul(ae, Je) | 0;
        var br = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (br >>> 26) | 0, br &= 67108863, R = Math.imul(j, He), w = Math.imul(j, Ke), w = w + Math.imul(I, He) | 0, M = Math.imul(I, Ke), R = R + Math.imul(we, We) | 0, w = w + Math.imul(we, Ze) | 0, w = w + Math.imul(Se, We) | 0, M = M + Math.imul(Se, Ze) | 0, R = R + Math.imul(oe, W) | 0, w = w + Math.imul(oe, T) | 0, w = w + Math.imul(ce, W) | 0, M = M + Math.imul(ce, T) | 0, R = R + Math.imul(qe, re) | 0, w = w + Math.imul(qe, ue) | 0, w = w + Math.imul(Me, re) | 0, M = M + Math.imul(Me, ue) | 0, R = R + Math.imul(Ae, ye) | 0, w = w + Math.imul(Ae, ke) | 0, w = w + Math.imul(be, ye) | 0, M = M + Math.imul(be, ke) | 0, R = R + Math.imul(xe, Ne) | 0, w = w + Math.imul(xe, ze) | 0, w = w + Math.imul(_e, Ne) | 0, M = M + Math.imul(_e, ze) | 0, R = R + Math.imul(z, Ge) | 0, w = w + Math.imul(z, Je) | 0, w = w + Math.imul(fe, Ge) | 0, M = M + Math.imul(fe, Je) | 0;
        var yr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (yr >>> 26) | 0, yr &= 67108863, R = Math.imul(j, We), w = Math.imul(j, Ze), w = w + Math.imul(I, We) | 0, M = Math.imul(I, Ze), R = R + Math.imul(we, W) | 0, w = w + Math.imul(we, T) | 0, w = w + Math.imul(Se, W) | 0, M = M + Math.imul(Se, T) | 0, R = R + Math.imul(oe, re) | 0, w = w + Math.imul(oe, ue) | 0, w = w + Math.imul(ce, re) | 0, M = M + Math.imul(ce, ue) | 0, R = R + Math.imul(qe, ye) | 0, w = w + Math.imul(qe, ke) | 0, w = w + Math.imul(Me, ye) | 0, M = M + Math.imul(Me, ke) | 0, R = R + Math.imul(Ae, Ne) | 0, w = w + Math.imul(Ae, ze) | 0, w = w + Math.imul(be, Ne) | 0, M = M + Math.imul(be, ze) | 0, R = R + Math.imul(xe, Ge) | 0, w = w + Math.imul(xe, Je) | 0, w = w + Math.imul(_e, Ge) | 0, M = M + Math.imul(_e, Je) | 0;
        var gr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (gr >>> 26) | 0, gr &= 67108863, R = Math.imul(j, W), w = Math.imul(j, T), w = w + Math.imul(I, W) | 0, M = Math.imul(I, T), R = R + Math.imul(we, re) | 0, w = w + Math.imul(we, ue) | 0, w = w + Math.imul(Se, re) | 0, M = M + Math.imul(Se, ue) | 0, R = R + Math.imul(oe, ye) | 0, w = w + Math.imul(oe, ke) | 0, w = w + Math.imul(ce, ye) | 0, M = M + Math.imul(ce, ke) | 0, R = R + Math.imul(qe, Ne) | 0, w = w + Math.imul(qe, ze) | 0, w = w + Math.imul(Me, Ne) | 0, M = M + Math.imul(Me, ze) | 0, R = R + Math.imul(Ae, Ge) | 0, w = w + Math.imul(Ae, Je) | 0, w = w + Math.imul(be, Ge) | 0, M = M + Math.imul(be, Je) | 0;
        var wr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (wr >>> 26) | 0, wr &= 67108863, R = Math.imul(j, re), w = Math.imul(j, ue), w = w + Math.imul(I, re) | 0, M = Math.imul(I, ue), R = R + Math.imul(we, ye) | 0, w = w + Math.imul(we, ke) | 0, w = w + Math.imul(Se, ye) | 0, M = M + Math.imul(Se, ke) | 0, R = R + Math.imul(oe, Ne) | 0, w = w + Math.imul(oe, ze) | 0, w = w + Math.imul(ce, Ne) | 0, M = M + Math.imul(ce, ze) | 0, R = R + Math.imul(qe, Ge) | 0, w = w + Math.imul(qe, Je) | 0, w = w + Math.imul(Me, Ge) | 0, M = M + Math.imul(Me, Je) | 0;
        var rr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (rr >>> 26) | 0, rr &= 67108863, R = Math.imul(j, ye), w = Math.imul(j, ke), w = w + Math.imul(I, ye) | 0, M = Math.imul(I, ke), R = R + Math.imul(we, Ne) | 0, w = w + Math.imul(we, ze) | 0, w = w + Math.imul(Se, Ne) | 0, M = M + Math.imul(Se, ze) | 0, R = R + Math.imul(oe, Ge) | 0, w = w + Math.imul(oe, Je) | 0, w = w + Math.imul(ce, Ge) | 0, M = M + Math.imul(ce, Je) | 0;
        var _r = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (_r >>> 26) | 0, _r &= 67108863, R = Math.imul(j, Ne), w = Math.imul(j, ze), w = w + Math.imul(I, Ne) | 0, M = Math.imul(I, ze), R = R + Math.imul(we, Ge) | 0, w = w + Math.imul(we, Je) | 0, w = w + Math.imul(Se, Ge) | 0, M = M + Math.imul(Se, Je) | 0;
        var xr = (P + R | 0) + ((w & 8191) << 13) | 0;
        P = (M + (w >>> 13) | 0) + (xr >>> 26) | 0, xr &= 67108863, R = Math.imul(j, Ge), w = Math.imul(j, Je), w = w + Math.imul(I, Ge) | 0, M = Math.imul(I, Je);
        var Sr = (P + R | 0) + ((w & 8191) << 13) | 0;
        return P = (M + (w >>> 13) | 0) + (Sr >>> 26) | 0, Sr &= 67108863, q[0] = Qe, q[1] = er, q[2] = fr, q[3] = ur, q[4] = cr, q[5] = nr, q[6] = hr, q[7] = dr, q[8] = lr, q[9] = pr, q[10] = vr, q[11] = br, q[12] = yr, q[13] = gr, q[14] = wr, q[15] = rr, q[16] = _r, q[17] = xr, q[18] = Sr, P !== 0 && (q[19] = P, l.length++), l;
      };
      Math.imul || (m = y);
      function B(Y, b, g) {
        g.negative = b.negative ^ Y.negative, g.length = Y.length + b.length;
        for (var l = 0, _ = 0, A = 0; A < g.length - 1; A++) {
          var q = _;
          _ = 0;
          for (var P = l & 67108863, R = Math.min(A, b.length - 1), w = Math.max(0, A - Y.length + 1); w <= R; w++) {
            var M = A - w, x = Y.words[M] | 0, L = b.words[w] | 0, K = x * L, Q = K & 67108863;
            q = q + (K / 67108864 | 0) | 0, Q = Q + P | 0, P = Q & 67108863, q = q + (Q >>> 26) | 0, _ += q >>> 26, q &= 67108863;
          }
          g.words[A] = P, l = q, q = _;
        }
        return l !== 0 ? g.words[A] = l : g.length--, g.strip();
      }
      function E(Y, b, g) {
        var l = new S();
        return l.mulp(Y, b, g);
      }
      r.prototype.mulTo = function(b, g) {
        var l, _ = this.length + b.length;
        return this.length === 10 && b.length === 10 ? l = m(this, b, g) : _ < 63 ? l = y(this, b, g) : _ < 1024 ? l = B(this, b, g) : l = E(this, b, g), l;
      };
      function S(Y, b) {
        this.x = Y, this.y = b;
      }
      S.prototype.makeRBT = function(b) {
        for (var g = new Array(b), l = r.prototype._countBits(b) - 1, _ = 0; _ < b; _++)
          g[_] = this.revBin(_, l, b);
        return g;
      }, S.prototype.revBin = function(b, g, l) {
        if (b === 0 || b === l - 1) return b;
        for (var _ = 0, A = 0; A < g; A++)
          _ |= (b & 1) << g - A - 1, b >>= 1;
        return _;
      }, S.prototype.permute = function(b, g, l, _, A, q) {
        for (var P = 0; P < q; P++)
          _[P] = g[b[P]], A[P] = l[b[P]];
      }, S.prototype.transform = function(b, g, l, _, A, q) {
        this.permute(q, b, g, l, _, A);
        for (var P = 1; P < A; P <<= 1)
          for (var R = P << 1, w = Math.cos(2 * Math.PI / R), M = Math.sin(2 * Math.PI / R), x = 0; x < A; x += R)
            for (var L = w, K = M, Q = 0; Q < P; Q++) {
              var U = l[x + Q], N = _[x + Q], F = l[x + Q + P], ee = _[x + Q + P], ae = L * F - K * ee;
              ee = L * ee + K * F, F = ae, l[x + Q] = U + F, _[x + Q] = N + ee, l[x + Q + P] = U - F, _[x + Q + P] = N - ee, Q !== R && (ae = w * L - M * K, K = w * K + M * L, L = ae);
            }
      }, S.prototype.guessLen13b = function(b, g) {
        var l = Math.max(g, b) | 1, _ = l & 1, A = 0;
        for (l = l / 2 | 0; l; l = l >>> 1)
          A++;
        return 1 << A + 1 + _;
      }, S.prototype.conjugate = function(b, g, l) {
        if (!(l <= 1))
          for (var _ = 0; _ < l / 2; _++) {
            var A = b[_];
            b[_] = b[l - _ - 1], b[l - _ - 1] = A, A = g[_], g[_] = -g[l - _ - 1], g[l - _ - 1] = -A;
          }
      }, S.prototype.normalize13b = function(b, g) {
        for (var l = 0, _ = 0; _ < g / 2; _++) {
          var A = Math.round(b[2 * _ + 1] / g) * 8192 + Math.round(b[2 * _] / g) + l;
          b[_] = A & 67108863, A < 67108864 ? l = 0 : l = A / 67108864 | 0;
        }
        return b;
      }, S.prototype.convert13b = function(b, g, l, _) {
        for (var A = 0, q = 0; q < g; q++)
          A = A + (b[q] | 0), l[2 * q] = A & 8191, A = A >>> 13, l[2 * q + 1] = A & 8191, A = A >>> 13;
        for (q = 2 * g; q < _; ++q)
          l[q] = 0;
        f(A === 0), f((A & -8192) === 0);
      }, S.prototype.stub = function(b) {
        for (var g = new Array(b), l = 0; l < b; l++)
          g[l] = 0;
        return g;
      }, S.prototype.mulp = function(b, g, l) {
        var _ = 2 * this.guessLen13b(b.length, g.length), A = this.makeRBT(_), q = this.stub(_), P = new Array(_), R = new Array(_), w = new Array(_), M = new Array(_), x = new Array(_), L = new Array(_), K = l.words;
        K.length = _, this.convert13b(b.words, b.length, P, _), this.convert13b(g.words, g.length, M, _), this.transform(P, q, R, w, _, A), this.transform(M, q, x, L, _, A);
        for (var Q = 0; Q < _; Q++) {
          var U = R[Q] * x[Q] - w[Q] * L[Q];
          w[Q] = R[Q] * L[Q] + w[Q] * x[Q], R[Q] = U;
        }
        return this.conjugate(R, w, _), this.transform(R, w, K, q, _, A), this.conjugate(K, q, _), this.normalize13b(K, _), l.negative = b.negative ^ g.negative, l.length = b.length + g.length, l.strip();
      }, r.prototype.mul = function(b) {
        var g = new r(null);
        return g.words = new Array(this.length + b.length), this.mulTo(b, g);
      }, r.prototype.mulf = function(b) {
        var g = new r(null);
        return g.words = new Array(this.length + b.length), E(this, b, g);
      }, r.prototype.imul = function(b) {
        return this.clone().mulTo(b, this);
      }, r.prototype.imuln = function(b) {
        f(typeof b == "number"), f(b < 67108864);
        for (var g = 0, l = 0; l < this.length; l++) {
          var _ = (this.words[l] | 0) * b, A = (_ & 67108863) + (g & 67108863);
          g >>= 26, g += _ / 67108864 | 0, g += A >>> 26, this.words[l] = A & 67108863;
        }
        return g !== 0 && (this.words[l] = g, this.length++), this.length = b === 0 ? 1 : this.length, this;
      }, r.prototype.muln = function(b) {
        return this.clone().imuln(b);
      }, r.prototype.sqr = function() {
        return this.mul(this);
      }, r.prototype.isqr = function() {
        return this.imul(this.clone());
      }, r.prototype.pow = function(b) {
        var g = v(b);
        if (g.length === 0) return new r(1);
        for (var l = this, _ = 0; _ < g.length && g[_] === 0; _++, l = l.sqr())
          ;
        if (++_ < g.length)
          for (var A = l.sqr(); _ < g.length; _++, A = A.sqr())
            g[_] !== 0 && (l = l.mul(A));
        return l;
      }, r.prototype.iushln = function(b) {
        f(typeof b == "number" && b >= 0);
        var g = b % 26, l = (b - g) / 26, _ = 67108863 >>> 26 - g << 26 - g, A;
        if (g !== 0) {
          var q = 0;
          for (A = 0; A < this.length; A++) {
            var P = this.words[A] & _, R = (this.words[A] | 0) - P << g;
            this.words[A] = R | q, q = P >>> 26 - g;
          }
          q && (this.words[A] = q, this.length++);
        }
        if (l !== 0) {
          for (A = this.length - 1; A >= 0; A--)
            this.words[A + l] = this.words[A];
          for (A = 0; A < l; A++)
            this.words[A] = 0;
          this.length += l;
        }
        return this.strip();
      }, r.prototype.ishln = function(b) {
        return f(this.negative === 0), this.iushln(b);
      }, r.prototype.iushrn = function(b, g, l) {
        f(typeof b == "number" && b >= 0);
        var _;
        g ? _ = (g - g % 26) / 26 : _ = 0;
        var A = b % 26, q = Math.min((b - A) / 26, this.length), P = 67108863 ^ 67108863 >>> A << A, R = l;
        if (_ -= q, _ = Math.max(0, _), R) {
          for (var w = 0; w < q; w++)
            R.words[w] = this.words[w];
          R.length = q;
        }
        if (q !== 0) if (this.length > q)
          for (this.length -= q, w = 0; w < this.length; w++)
            this.words[w] = this.words[w + q];
        else
          this.words[0] = 0, this.length = 1;
        var M = 0;
        for (w = this.length - 1; w >= 0 && (M !== 0 || w >= _); w--) {
          var x = this.words[w] | 0;
          this.words[w] = M << 26 - A | x >>> A, M = x & P;
        }
        return R && M !== 0 && (R.words[R.length++] = M), this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
      }, r.prototype.ishrn = function(b, g, l) {
        return f(this.negative === 0), this.iushrn(b, g, l);
      }, r.prototype.shln = function(b) {
        return this.clone().ishln(b);
      }, r.prototype.ushln = function(b) {
        return this.clone().iushln(b);
      }, r.prototype.shrn = function(b) {
        return this.clone().ishrn(b);
      }, r.prototype.ushrn = function(b) {
        return this.clone().iushrn(b);
      }, r.prototype.testn = function(b) {
        f(typeof b == "number" && b >= 0);
        var g = b % 26, l = (b - g) / 26, _ = 1 << g;
        if (this.length <= l) return !1;
        var A = this.words[l];
        return !!(A & _);
      }, r.prototype.imaskn = function(b) {
        f(typeof b == "number" && b >= 0);
        var g = b % 26, l = (b - g) / 26;
        if (f(this.negative === 0, "imaskn works only with positive numbers"), this.length <= l)
          return this;
        if (g !== 0 && l++, this.length = Math.min(l, this.length), g !== 0) {
          var _ = 67108863 ^ 67108863 >>> g << g;
          this.words[this.length - 1] &= _;
        }
        return this.length === 0 && (this.words[0] = 0, this.length = 1), this.strip();
      }, r.prototype.maskn = function(b) {
        return this.clone().imaskn(b);
      }, r.prototype.iaddn = function(b) {
        return f(typeof b == "number"), f(b < 67108864), b < 0 ? this.isubn(-b) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) < b ? (this.words[0] = b - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(b), this.negative = 1, this) : this._iaddn(b);
      }, r.prototype._iaddn = function(b) {
        this.words[0] += b;
        for (var g = 0; g < this.length && this.words[g] >= 67108864; g++)
          this.words[g] -= 67108864, g === this.length - 1 ? this.words[g + 1] = 1 : this.words[g + 1]++;
        return this.length = Math.max(this.length, g + 1), this;
      }, r.prototype.isubn = function(b) {
        if (f(typeof b == "number"), f(b < 67108864), b < 0) return this.iaddn(-b);
        if (this.negative !== 0)
          return this.negative = 0, this.iaddn(b), this.negative = 1, this;
        if (this.words[0] -= b, this.length === 1 && this.words[0] < 0)
          this.words[0] = -this.words[0], this.negative = 1;
        else
          for (var g = 0; g < this.length && this.words[g] < 0; g++)
            this.words[g] += 67108864, this.words[g + 1] -= 1;
        return this.strip();
      }, r.prototype.addn = function(b) {
        return this.clone().iaddn(b);
      }, r.prototype.subn = function(b) {
        return this.clone().isubn(b);
      }, r.prototype.iabs = function() {
        return this.negative = 0, this;
      }, r.prototype.abs = function() {
        return this.clone().iabs();
      }, r.prototype._ishlnsubmul = function(b, g, l) {
        var _ = b.length + l, A;
        this._expand(_);
        var q, P = 0;
        for (A = 0; A < b.length; A++) {
          q = (this.words[A + l] | 0) + P;
          var R = (b.words[A] | 0) * g;
          q -= R & 67108863, P = (q >> 26) - (R / 67108864 | 0), this.words[A + l] = q & 67108863;
        }
        for (; A < this.length - l; A++)
          q = (this.words[A + l] | 0) + P, P = q >> 26, this.words[A + l] = q & 67108863;
        if (P === 0) return this.strip();
        for (f(P === -1), P = 0, A = 0; A < this.length; A++)
          q = -(this.words[A] | 0) + P, P = q >> 26, this.words[A] = q & 67108863;
        return this.negative = 1, this.strip();
      }, r.prototype._wordDiv = function(b, g) {
        var l = this.length - b.length, _ = this.clone(), A = b, q = A.words[A.length - 1] | 0, P = this._countBits(q);
        l = 26 - P, l !== 0 && (A = A.ushln(l), _.iushln(l), q = A.words[A.length - 1] | 0);
        var R = _.length - A.length, w;
        if (g !== "mod") {
          w = new r(null), w.length = R + 1, w.words = new Array(w.length);
          for (var M = 0; M < w.length; M++)
            w.words[M] = 0;
        }
        var x = _.clone()._ishlnsubmul(A, 1, R);
        x.negative === 0 && (_ = x, w && (w.words[R] = 1));
        for (var L = R - 1; L >= 0; L--) {
          var K = (_.words[A.length + L] | 0) * 67108864 + (_.words[A.length + L - 1] | 0);
          for (K = Math.min(K / q | 0, 67108863), _._ishlnsubmul(A, K, L); _.negative !== 0; )
            K--, _.negative = 0, _._ishlnsubmul(A, 1, L), _.isZero() || (_.negative ^= 1);
          w && (w.words[L] = K);
        }
        return w && w.strip(), _.strip(), g !== "div" && l !== 0 && _.iushrn(l), {
          div: w || null,
          mod: _
        };
      }, r.prototype.divmod = function(b, g, l) {
        if (f(!b.isZero()), this.isZero())
          return {
            div: new r(0),
            mod: new r(0)
          };
        var _, A, q;
        return this.negative !== 0 && b.negative === 0 ? (q = this.neg().divmod(b, g), g !== "mod" && (_ = q.div.neg()), g !== "div" && (A = q.mod.neg(), l && A.negative !== 0 && A.iadd(b)), {
          div: _,
          mod: A
        }) : this.negative === 0 && b.negative !== 0 ? (q = this.divmod(b.neg(), g), g !== "mod" && (_ = q.div.neg()), {
          div: _,
          mod: q.mod
        }) : (this.negative & b.negative) !== 0 ? (q = this.neg().divmod(b.neg(), g), g !== "div" && (A = q.mod.neg(), l && A.negative !== 0 && A.isub(b)), {
          div: q.div,
          mod: A
        }) : b.length > this.length || this.cmp(b) < 0 ? {
          div: new r(0),
          mod: this
        } : b.length === 1 ? g === "div" ? {
          div: this.divn(b.words[0]),
          mod: null
        } : g === "mod" ? {
          div: null,
          mod: new r(this.modn(b.words[0]))
        } : {
          div: this.divn(b.words[0]),
          mod: new r(this.modn(b.words[0]))
        } : this._wordDiv(b, g);
      }, r.prototype.div = function(b) {
        return this.divmod(b, "div", !1).div;
      }, r.prototype.mod = function(b) {
        return this.divmod(b, "mod", !1).mod;
      }, r.prototype.umod = function(b) {
        return this.divmod(b, "mod", !0).mod;
      }, r.prototype.divRound = function(b) {
        var g = this.divmod(b);
        if (g.mod.isZero()) return g.div;
        var l = g.div.negative !== 0 ? g.mod.isub(b) : g.mod, _ = b.ushrn(1), A = b.andln(1), q = l.cmp(_);
        return q < 0 || A === 1 && q === 0 ? g.div : g.div.negative !== 0 ? g.div.isubn(1) : g.div.iaddn(1);
      }, r.prototype.modn = function(b) {
        f(b <= 67108863);
        for (var g = (1 << 26) % b, l = 0, _ = this.length - 1; _ >= 0; _--)
          l = (g * l + (this.words[_] | 0)) % b;
        return l;
      }, r.prototype.idivn = function(b) {
        f(b <= 67108863);
        for (var g = 0, l = this.length - 1; l >= 0; l--) {
          var _ = (this.words[l] | 0) + g * 67108864;
          this.words[l] = _ / b | 0, g = _ % b;
        }
        return this.strip();
      }, r.prototype.divn = function(b) {
        return this.clone().idivn(b);
      }, r.prototype.egcd = function(b) {
        f(b.negative === 0), f(!b.isZero());
        var g = this, l = b.clone();
        g.negative !== 0 ? g = g.umod(b) : g = g.clone();
        for (var _ = new r(1), A = new r(0), q = new r(0), P = new r(1), R = 0; g.isEven() && l.isEven(); )
          g.iushrn(1), l.iushrn(1), ++R;
        for (var w = l.clone(), M = g.clone(); !g.isZero(); ) {
          for (var x = 0, L = 1; (g.words[0] & L) === 0 && x < 26; ++x, L <<= 1) ;
          if (x > 0)
            for (g.iushrn(x); x-- > 0; )
              (_.isOdd() || A.isOdd()) && (_.iadd(w), A.isub(M)), _.iushrn(1), A.iushrn(1);
          for (var K = 0, Q = 1; (l.words[0] & Q) === 0 && K < 26; ++K, Q <<= 1) ;
          if (K > 0)
            for (l.iushrn(K); K-- > 0; )
              (q.isOdd() || P.isOdd()) && (q.iadd(w), P.isub(M)), q.iushrn(1), P.iushrn(1);
          g.cmp(l) >= 0 ? (g.isub(l), _.isub(q), A.isub(P)) : (l.isub(g), q.isub(_), P.isub(A));
        }
        return {
          a: q,
          b: P,
          gcd: l.iushln(R)
        };
      }, r.prototype._invmp = function(b) {
        f(b.negative === 0), f(!b.isZero());
        var g = this, l = b.clone();
        g.negative !== 0 ? g = g.umod(b) : g = g.clone();
        for (var _ = new r(1), A = new r(0), q = l.clone(); g.cmpn(1) > 0 && l.cmpn(1) > 0; ) {
          for (var P = 0, R = 1; (g.words[0] & R) === 0 && P < 26; ++P, R <<= 1) ;
          if (P > 0)
            for (g.iushrn(P); P-- > 0; )
              _.isOdd() && _.iadd(q), _.iushrn(1);
          for (var w = 0, M = 1; (l.words[0] & M) === 0 && w < 26; ++w, M <<= 1) ;
          if (w > 0)
            for (l.iushrn(w); w-- > 0; )
              A.isOdd() && A.iadd(q), A.iushrn(1);
          g.cmp(l) >= 0 ? (g.isub(l), _.isub(A)) : (l.isub(g), A.isub(_));
        }
        var x;
        return g.cmpn(1) === 0 ? x = _ : x = A, x.cmpn(0) < 0 && x.iadd(b), x;
      }, r.prototype.gcd = function(b) {
        if (this.isZero()) return b.abs();
        if (b.isZero()) return this.abs();
        var g = this.clone(), l = b.clone();
        g.negative = 0, l.negative = 0;
        for (var _ = 0; g.isEven() && l.isEven(); _++)
          g.iushrn(1), l.iushrn(1);
        do {
          for (; g.isEven(); )
            g.iushrn(1);
          for (; l.isEven(); )
            l.iushrn(1);
          var A = g.cmp(l);
          if (A < 0) {
            var q = g;
            g = l, l = q;
          } else if (A === 0 || l.cmpn(1) === 0)
            break;
          g.isub(l);
        } while (!0);
        return l.iushln(_);
      }, r.prototype.invm = function(b) {
        return this.egcd(b).a.umod(b);
      }, r.prototype.isEven = function() {
        return (this.words[0] & 1) === 0;
      }, r.prototype.isOdd = function() {
        return (this.words[0] & 1) === 1;
      }, r.prototype.andln = function(b) {
        return this.words[0] & b;
      }, r.prototype.bincn = function(b) {
        f(typeof b == "number");
        var g = b % 26, l = (b - g) / 26, _ = 1 << g;
        if (this.length <= l)
          return this._expand(l + 1), this.words[l] |= _, this;
        for (var A = _, q = l; A !== 0 && q < this.length; q++) {
          var P = this.words[q] | 0;
          P += A, A = P >>> 26, P &= 67108863, this.words[q] = P;
        }
        return A !== 0 && (this.words[q] = A, this.length++), this;
      }, r.prototype.isZero = function() {
        return this.length === 1 && this.words[0] === 0;
      }, r.prototype.cmpn = function(b) {
        var g = b < 0;
        if (this.negative !== 0 && !g) return -1;
        if (this.negative === 0 && g) return 1;
        this.strip();
        var l;
        if (this.length > 1)
          l = 1;
        else {
          g && (b = -b), f(b <= 67108863, "Number is too big");
          var _ = this.words[0] | 0;
          l = _ === b ? 0 : _ < b ? -1 : 1;
        }
        return this.negative !== 0 ? -l | 0 : l;
      }, r.prototype.cmp = function(b) {
        if (this.negative !== 0 && b.negative === 0) return -1;
        if (this.negative === 0 && b.negative !== 0) return 1;
        var g = this.ucmp(b);
        return this.negative !== 0 ? -g | 0 : g;
      }, r.prototype.ucmp = function(b) {
        if (this.length > b.length) return 1;
        if (this.length < b.length) return -1;
        for (var g = 0, l = this.length - 1; l >= 0; l--) {
          var _ = this.words[l] | 0, A = b.words[l] | 0;
          if (_ !== A) {
            _ < A ? g = -1 : _ > A && (g = 1);
            break;
          }
        }
        return g;
      }, r.prototype.gtn = function(b) {
        return this.cmpn(b) === 1;
      }, r.prototype.gt = function(b) {
        return this.cmp(b) === 1;
      }, r.prototype.gten = function(b) {
        return this.cmpn(b) >= 0;
      }, r.prototype.gte = function(b) {
        return this.cmp(b) >= 0;
      }, r.prototype.ltn = function(b) {
        return this.cmpn(b) === -1;
      }, r.prototype.lt = function(b) {
        return this.cmp(b) === -1;
      }, r.prototype.lten = function(b) {
        return this.cmpn(b) <= 0;
      }, r.prototype.lte = function(b) {
        return this.cmp(b) <= 0;
      }, r.prototype.eqn = function(b) {
        return this.cmpn(b) === 0;
      }, r.prototype.eq = function(b) {
        return this.cmp(b) === 0;
      }, r.red = function(b) {
        return new ne(b);
      }, r.prototype.toRed = function(b) {
        return f(!this.red, "Already a number in reduction context"), f(this.negative === 0, "red works only with positives"), b.convertTo(this)._forceRed(b);
      }, r.prototype.fromRed = function() {
        return f(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
      }, r.prototype._forceRed = function(b) {
        return this.red = b, this;
      }, r.prototype.forceRed = function(b) {
        return f(!this.red, "Already a number in reduction context"), this._forceRed(b);
      }, r.prototype.redAdd = function(b) {
        return f(this.red, "redAdd works only with red numbers"), this.red.add(this, b);
      }, r.prototype.redIAdd = function(b) {
        return f(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, b);
      }, r.prototype.redSub = function(b) {
        return f(this.red, "redSub works only with red numbers"), this.red.sub(this, b);
      }, r.prototype.redISub = function(b) {
        return f(this.red, "redISub works only with red numbers"), this.red.isub(this, b);
      }, r.prototype.redShl = function(b) {
        return f(this.red, "redShl works only with red numbers"), this.red.shl(this, b);
      }, r.prototype.redMul = function(b) {
        return f(this.red, "redMul works only with red numbers"), this.red._verify2(this, b), this.red.mul(this, b);
      }, r.prototype.redIMul = function(b) {
        return f(this.red, "redMul works only with red numbers"), this.red._verify2(this, b), this.red.imul(this, b);
      }, r.prototype.redSqr = function() {
        return f(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
      }, r.prototype.redISqr = function() {
        return f(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
      }, r.prototype.redSqrt = function() {
        return f(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
      }, r.prototype.redInvm = function() {
        return f(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
      }, r.prototype.redNeg = function() {
        return f(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
      }, r.prototype.redPow = function(b) {
        return f(this.red && !b.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, b);
      };
      var O = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
      };
      function D(Y, b) {
        this.name = Y, this.p = new r(b, 16), this.n = this.p.bitLength(), this.k = new r(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
      }
      D.prototype._tmp = function() {
        var b = new r(null);
        return b.words = new Array(Math.ceil(this.n / 13)), b;
      }, D.prototype.ireduce = function(b) {
        var g = b, l;
        do
          this.split(g, this.tmp), g = this.imulK(g), g = g.iadd(this.tmp), l = g.bitLength();
        while (l > this.n);
        var _ = l < this.n ? -1 : g.ucmp(this.p);
        return _ === 0 ? (g.words[0] = 0, g.length = 1) : _ > 0 ? g.isub(this.p) : g.strip !== void 0 ? g.strip() : g._strip(), g;
      }, D.prototype.split = function(b, g) {
        b.iushrn(this.n, 0, g);
      }, D.prototype.imulK = function(b) {
        return b.imul(this.k);
      };
      function $() {
        D.call(
          this,
          "k256",
          "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
        );
      }
      p($, D), $.prototype.split = function(b, g) {
        for (var l = 4194303, _ = Math.min(b.length, 9), A = 0; A < _; A++)
          g.words[A] = b.words[A];
        if (g.length = _, b.length <= 9) {
          b.words[0] = 0, b.length = 1;
          return;
        }
        var q = b.words[9];
        for (g.words[g.length++] = q & l, A = 10; A < b.length; A++) {
          var P = b.words[A] | 0;
          b.words[A - 10] = (P & l) << 4 | q >>> 22, q = P;
        }
        q >>>= 22, b.words[A - 10] = q, q === 0 && b.length > 10 ? b.length -= 10 : b.length -= 9;
      }, $.prototype.imulK = function(b) {
        b.words[b.length] = 0, b.words[b.length + 1] = 0, b.length += 2;
        for (var g = 0, l = 0; l < b.length; l++) {
          var _ = b.words[l] | 0;
          g += _ * 977, b.words[l] = g & 67108863, g = _ * 64 + (g / 67108864 | 0);
        }
        return b.words[b.length - 1] === 0 && (b.length--, b.words[b.length - 1] === 0 && b.length--), b;
      };
      function V() {
        D.call(
          this,
          "p224",
          "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
        );
      }
      p(V, D);
      function J() {
        D.call(
          this,
          "p192",
          "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
        );
      }
      p(J, D);
      function ie() {
        D.call(
          this,
          "25519",
          "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
        );
      }
      p(ie, D), ie.prototype.imulK = function(b) {
        for (var g = 0, l = 0; l < b.length; l++) {
          var _ = (b.words[l] | 0) * 19 + g, A = _ & 67108863;
          _ >>>= 26, b.words[l] = A, g = _;
        }
        return g !== 0 && (b.words[b.length++] = g), b;
      }, r._prime = function(b) {
        if (O[b]) return O[b];
        var g;
        if (b === "k256")
          g = new $();
        else if (b === "p224")
          g = new V();
        else if (b === "p192")
          g = new J();
        else if (b === "p25519")
          g = new ie();
        else
          throw new Error("Unknown prime " + b);
        return O[b] = g, g;
      };
      function ne(Y) {
        if (typeof Y == "string") {
          var b = r._prime(Y);
          this.m = b.p, this.prime = b;
        } else
          f(Y.gtn(1), "modulus must be greater than 1"), this.m = Y, this.prime = null;
      }
      ne.prototype._verify1 = function(b) {
        f(b.negative === 0, "red works only with positives"), f(b.red, "red works only with red numbers");
      }, ne.prototype._verify2 = function(b, g) {
        f((b.negative | g.negative) === 0, "red works only with positives"), f(
          b.red && b.red === g.red,
          "red works only with red numbers"
        );
      }, ne.prototype.imod = function(b) {
        return this.prime ? this.prime.ireduce(b)._forceRed(this) : b.umod(this.m)._forceRed(this);
      }, ne.prototype.neg = function(b) {
        return b.isZero() ? b.clone() : this.m.sub(b)._forceRed(this);
      }, ne.prototype.add = function(b, g) {
        this._verify2(b, g);
        var l = b.add(g);
        return l.cmp(this.m) >= 0 && l.isub(this.m), l._forceRed(this);
      }, ne.prototype.iadd = function(b, g) {
        this._verify2(b, g);
        var l = b.iadd(g);
        return l.cmp(this.m) >= 0 && l.isub(this.m), l;
      }, ne.prototype.sub = function(b, g) {
        this._verify2(b, g);
        var l = b.sub(g);
        return l.cmpn(0) < 0 && l.iadd(this.m), l._forceRed(this);
      }, ne.prototype.isub = function(b, g) {
        this._verify2(b, g);
        var l = b.isub(g);
        return l.cmpn(0) < 0 && l.iadd(this.m), l;
      }, ne.prototype.shl = function(b, g) {
        return this._verify1(b), this.imod(b.ushln(g));
      }, ne.prototype.imul = function(b, g) {
        return this._verify2(b, g), this.imod(b.imul(g));
      }, ne.prototype.mul = function(b, g) {
        return this._verify2(b, g), this.imod(b.mul(g));
      }, ne.prototype.isqr = function(b) {
        return this.imul(b, b.clone());
      }, ne.prototype.sqr = function(b) {
        return this.mul(b, b);
      }, ne.prototype.sqrt = function(b) {
        if (b.isZero()) return b.clone();
        var g = this.m.andln(3);
        if (f(g % 2 === 1), g === 3) {
          var l = this.m.add(new r(1)).iushrn(2);
          return this.pow(b, l);
        }
        for (var _ = this.m.subn(1), A = 0; !_.isZero() && _.andln(1) === 0; )
          A++, _.iushrn(1);
        f(!_.isZero());
        var q = new r(1).toRed(this), P = q.redNeg(), R = this.m.subn(1).iushrn(1), w = this.m.bitLength();
        for (w = new r(2 * w * w).toRed(this); this.pow(w, R).cmp(P) !== 0; )
          w.redIAdd(P);
        for (var M = this.pow(w, _), x = this.pow(b, _.addn(1).iushrn(1)), L = this.pow(b, _), K = A; L.cmp(q) !== 0; ) {
          for (var Q = L, U = 0; Q.cmp(q) !== 0; U++)
            Q = Q.redSqr();
          f(U < K);
          var N = this.pow(M, new r(1).iushln(K - U - 1));
          x = x.redMul(N), M = N.redSqr(), L = L.redMul(M), K = U;
        }
        return x;
      }, ne.prototype.invm = function(b) {
        var g = b._invmp(this.m);
        return g.negative !== 0 ? (g.negative = 0, this.imod(g).redNeg()) : this.imod(g);
      }, ne.prototype.pow = function(b, g) {
        if (g.isZero()) return new r(1).toRed(this);
        if (g.cmpn(1) === 0) return b.clone();
        var l = 4, _ = new Array(1 << l);
        _[0] = new r(1).toRed(this), _[1] = b;
        for (var A = 2; A < _.length; A++)
          _[A] = this.mul(_[A - 1], b);
        var q = _[0], P = 0, R = 0, w = g.bitLength() % 26;
        for (w === 0 && (w = 26), A = g.length - 1; A >= 0; A--) {
          for (var M = g.words[A], x = w - 1; x >= 0; x--) {
            var L = M >> x & 1;
            if (q !== _[0] && (q = this.sqr(q)), L === 0 && P === 0) {
              R = 0;
              continue;
            }
            P <<= 1, P |= L, R++, !(R !== l && (A !== 0 || x !== 0)) && (q = this.mul(q, _[P]), R = 0, P = 0);
          }
          w = 26;
        }
        return q;
      }, ne.prototype.convertTo = function(b) {
        var g = b.umod(this.m);
        return g === b ? g.clone() : g;
      }, ne.prototype.convertFrom = function(b) {
        var g = b.clone();
        return g.red = null, g;
      }, r.mont = function(b) {
        return new le(b);
      };
      function le(Y) {
        ne.call(this, Y), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new r(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
      }
      p(le, ne), le.prototype.convertTo = function(b) {
        return this.imod(b.ushln(this.shift));
      }, le.prototype.convertFrom = function(b) {
        var g = this.imod(b.mul(this.rinv));
        return g.red = null, g;
      }, le.prototype.imul = function(b, g) {
        if (b.isZero() || g.isZero())
          return b.words[0] = 0, b.length = 1, b;
        var l = b.imul(g), _ = l.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), A = l.isub(_).iushrn(this.shift), q = A;
        return A.cmp(this.m) >= 0 ? q = A.isub(this.m) : A.cmpn(0) < 0 && (q = A.iadd(this.m)), q._forceRed(this);
      }, le.prototype.mul = function(b, g) {
        if (b.isZero() || g.isZero()) return new r(0)._forceRed(this);
        var l = b.mul(g), _ = l.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), A = l.isub(_).iushrn(this.shift), q = A;
        return A.cmp(this.m) >= 0 ? q = A.isub(this.m) : A.cmpn(0) < 0 && (q = A.iadd(this.m)), q._forceRed(this);
      }, le.prototype.invm = function(b) {
        var g = this.imod(b._invmp(this.m).mul(this.r2));
        return g._forceRed(this);
      };
    })(c, bn$2);
  })(bn$3)), bn$3.exports;
}
var brorand = { exports: {} }, hasRequiredBrorand;
function requireBrorand() {
  if (hasRequiredBrorand) return brorand.exports;
  hasRequiredBrorand = 1;
  var c;
  brorand.exports = function(p) {
    return c || (c = new a(null)), c.generate(p);
  };
  function a(f) {
    this.rand = f;
  }
  if (brorand.exports.Rand = a, a.prototype.generate = function(p) {
    return this._rand(p);
  }, a.prototype._rand = function(p) {
    if (this.rand.getBytes)
      return this.rand.getBytes(p);
    for (var r = new Uint8Array(p), u = 0; u < r.length; u++)
      r[u] = this.rand.getByte();
    return r;
  }, typeof self == "object")
    self.crypto && self.crypto.getRandomValues ? a.prototype._rand = function(p) {
      var r = new Uint8Array(p);
      return self.crypto.getRandomValues(r), r;
    } : self.msCrypto && self.msCrypto.getRandomValues ? a.prototype._rand = function(p) {
      var r = new Uint8Array(p);
      return self.msCrypto.getRandomValues(r), r;
    } : typeof window == "object" && (a.prototype._rand = function() {
      throw new Error("Not implemented yet");
    });
  else
    try {
      var h = requireCryptoBrowserify();
      if (typeof h.randomBytes != "function")
        throw new Error("Not supported");
      a.prototype._rand = function(p) {
        return h.randomBytes(p);
      };
    } catch {
    }
  return brorand.exports;
}
var mr, hasRequiredMr;
function requireMr() {
  if (hasRequiredMr) return mr;
  hasRequiredMr = 1;
  var c = requireBn$1(), a = requireBrorand();
  function h(f) {
    this.rand = f || new a.Rand();
  }
  return mr = h, h.create = function(p) {
    return new h(p);
  }, h.prototype._randbelow = function(p) {
    var r = p.bitLength(), u = Math.ceil(r / 8);
    do
      var o = new c(this.rand.generate(u));
    while (o.cmp(p) >= 0);
    return o;
  }, h.prototype._randrange = function(p, r) {
    var u = r.sub(p);
    return p.add(this._randbelow(u));
  }, h.prototype.test = function(p, r, u) {
    var o = p.bitLength(), t = c.mont(p), n = new c(1).toRed(t);
    r || (r = Math.max(1, o / 48 | 0));
    for (var e = p.subn(1), s = 0; !e.testn(s); s++)
      ;
    for (var d = p.shrn(s), v = e.toRed(t), y = !0; r > 0; r--) {
      var m = this._randrange(new c(2), e);
      u && u(m);
      var B = m.toRed(t).redPow(d);
      if (!(B.cmp(n) === 0 || B.cmp(v) === 0)) {
        for (var E = 1; E < s; E++) {
          if (B = B.redSqr(), B.cmp(n) === 0)
            return !1;
          if (B.cmp(v) === 0)
            break;
        }
        if (E === s)
          return !1;
      }
    }
    return y;
  }, h.prototype.getDivisor = function(p, r) {
    var u = p.bitLength(), o = c.mont(p), t = new c(1).toRed(o);
    r || (r = Math.max(1, u / 48 | 0));
    for (var n = p.subn(1), e = 0; !n.testn(e); e++)
      ;
    for (var s = p.shrn(e), d = n.toRed(o); r > 0; r--) {
      var v = this._randrange(new c(2), n), y = p.gcd(v);
      if (y.cmpn(1) !== 0)
        return y;
      var m = v.toRed(o).redPow(s);
      if (!(m.cmp(t) === 0 || m.cmp(d) === 0)) {
        for (var B = 1; B < e; B++) {
          if (m = m.redSqr(), m.cmp(t) === 0)
            return m.fromRed().subn(1).gcd(p);
          if (m.cmp(d) === 0)
            break;
        }
        if (B === e)
          return m = m.redSqr(), m.fromRed().subn(1).gcd(p);
      }
    }
    return !1;
  }, mr;
}
var generatePrime, hasRequiredGeneratePrime;
function requireGeneratePrime() {
  if (hasRequiredGeneratePrime) return generatePrime;
  hasRequiredGeneratePrime = 1;
  var c = requireBrowser$b();
  generatePrime = B, B.simpleSieve = y, B.fermatTest = m;
  var a = requireBn$1(), h = new a(24), f = requireMr(), p = new f(), r = new a(1), u = new a(2), o = new a(5);
  new a(16), new a(8);
  var t = new a(10), n = new a(3);
  new a(7);
  var e = new a(11), s = new a(4);
  new a(12);
  var d = null;
  function v() {
    if (d !== null)
      return d;
    var E = 1048576, S = [];
    S[0] = 2;
    for (var O = 1, D = 3; D < E; D += 2) {
      for (var $ = Math.ceil(Math.sqrt(D)), V = 0; V < O && S[V] <= $ && D % S[V] !== 0; V++)
        ;
      O !== V && S[V] <= $ || (S[O++] = D);
    }
    return d = S, S;
  }
  function y(E) {
    for (var S = v(), O = 0; O < S.length; O++)
      if (E.modn(S[O]) === 0)
        return E.cmpn(S[O]) === 0;
    return !0;
  }
  function m(E) {
    var S = a.mont(E);
    return u.toRed(S).redPow(E.subn(1)).fromRed().cmpn(1) === 0;
  }
  function B(E, S) {
    if (E < 16)
      return S === 2 || S === 5 ? new a([140, 123]) : new a([140, 39]);
    S = new a(S);
    for (var O, D; ; ) {
      for (O = new a(c(Math.ceil(E / 8))); O.bitLength() > E; )
        O.ishrn(1);
      if (O.isEven() && O.iadd(r), O.testn(1) || O.iadd(u), S.cmp(u)) {
        if (!S.cmp(o))
          for (; O.mod(t).cmp(n); )
            O.iadd(s);
      } else for (; O.mod(h).cmp(e); )
        O.iadd(s);
      if (D = O.shrn(1), y(D) && y(O) && m(D) && m(O) && p.test(D) && p.test(O))
        return O;
    }
  }
  return generatePrime;
}
const modp1 = { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff" }, modp2 = { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff" }, modp5 = { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff" }, modp14 = { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff" }, modp15 = { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff" }, modp16 = { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff" }, modp17 = { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff" }, modp18 = { gen: "02", prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff" }, require$$1$1 = {
  modp1,
  modp2,
  modp5,
  modp14,
  modp15,
  modp16,
  modp17,
  modp18
};
var dh, hasRequiredDh;
function requireDh() {
  if (hasRequiredDh) return dh;
  hasRequiredDh = 1;
  var c = requireBn$1(), a = requireMr(), h = new a(), f = new c(24), p = new c(11), r = new c(10), u = new c(3), o = new c(7), t = requireGeneratePrime(), n = requireBrowser$b();
  dh = y;
  function e(B, E) {
    return E = E || "utf8", Buffer.isBuffer(B) || (B = new Buffer(B, E)), this._pub = new c(B), this;
  }
  function s(B, E) {
    return E = E || "utf8", Buffer.isBuffer(B) || (B = new Buffer(B, E)), this._priv = new c(B), this;
  }
  var d = {};
  function v(B, E) {
    var S = E.toString("hex"), O = [S, B.toString(16)].join("_");
    if (O in d)
      return d[O];
    var D = 0;
    if (B.isEven() || !t.simpleSieve || !t.fermatTest(B) || !h.test(B))
      return D += 1, S === "02" || S === "05" ? D += 8 : D += 4, d[O] = D, D;
    h.test(B.shrn(1)) || (D += 2);
    var $;
    switch (S) {
      case "02":
        B.mod(f).cmp(p) && (D += 8);
        break;
      case "05":
        $ = B.mod(r), $.cmp(u) && $.cmp(o) && (D += 8);
        break;
      default:
        D += 4;
    }
    return d[O] = D, D;
  }
  function y(B, E, S) {
    this.setGenerator(E), this.__prime = new c(B), this._prime = c.mont(this.__prime), this._primeLen = B.length, this._pub = void 0, this._priv = void 0, this._primeCode = void 0, S ? (this.setPublicKey = e, this.setPrivateKey = s) : this._primeCode = 8;
  }
  Object.defineProperty(y.prototype, "verifyError", {
    enumerable: !0,
    get: function() {
      return typeof this._primeCode != "number" && (this._primeCode = v(this.__prime, this.__gen)), this._primeCode;
    }
  }), y.prototype.generateKeys = function() {
    return this._priv || (this._priv = new c(n(this._primeLen))), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), this.getPublicKey();
  }, y.prototype.computeSecret = function(B) {
    B = new c(B), B = B.toRed(this._prime);
    var E = B.redPow(this._priv).fromRed(), S = new Buffer(E.toArray()), O = this.getPrime();
    if (S.length < O.length) {
      var D = new Buffer(O.length - S.length);
      D.fill(0), S = Buffer.concat([D, S]);
    }
    return S;
  }, y.prototype.getPublicKey = function(E) {
    return m(this._pub, E);
  }, y.prototype.getPrivateKey = function(E) {
    return m(this._priv, E);
  }, y.prototype.getPrime = function(B) {
    return m(this.__prime, B);
  }, y.prototype.getGenerator = function(B) {
    return m(this._gen, B);
  }, y.prototype.setGenerator = function(B, E) {
    return E = E || "utf8", Buffer.isBuffer(B) || (B = new Buffer(B, E)), this.__gen = B, this._gen = new c(B), this;
  };
  function m(B, E) {
    var S = new Buffer(B.toArray());
    return E ? S.toString(E) : S;
  }
  return dh;
}
var hasRequiredBrowser$4;
function requireBrowser$4() {
  if (hasRequiredBrowser$4) return browser$4;
  hasRequiredBrowser$4 = 1;
  var c = requireGeneratePrime(), a = require$$1$1, h = requireDh();
  function f(u) {
    var o = new Buffer(a[u].prime, "hex"), t = new Buffer(a[u].gen, "hex");
    return new h(o, t);
  }
  var p = {
    binary: !0,
    hex: !0,
    base64: !0
  };
  function r(u, o, t, n) {
    return Buffer.isBuffer(o) || p[o] === void 0 ? r(u, "binary", o, t) : (o = o || "binary", n = n || "binary", t = t || new Buffer([2]), Buffer.isBuffer(t) || (t = new Buffer(t, n)), typeof u == "number" ? new h(c(u, t), t, !0) : (Buffer.isBuffer(u) || (u = new Buffer(u, o)), new h(u, t, !0)));
  }
  return browser$4.DiffieHellmanGroup = browser$4.createDiffieHellmanGroup = browser$4.getDiffieHellman = f, browser$4.createDiffieHellman = browser$4.DiffieHellman = r, browser$4;
}
var sign = { exports: {} }, bn$1 = { exports: {} }, bn = bn$1.exports, hasRequiredBn;
function requireBn() {
  return hasRequiredBn || (hasRequiredBn = 1, (function(c) {
    (function(a, h) {
      function f(g, l) {
        if (!g) throw new Error(l || "Assertion failed");
      }
      function p(g, l) {
        g.super_ = l;
        var _ = function() {
        };
        _.prototype = l.prototype, g.prototype = new _(), g.prototype.constructor = g;
      }
      function r(g, l, _) {
        if (r.isBN(g))
          return g;
        this.negative = 0, this.words = null, this.length = 0, this.red = null, g !== null && ((l === "le" || l === "be") && (_ = l, l = 10), this._init(g || 0, l || 10, _ || "be"));
      }
      typeof a == "object" ? a.exports = r : h.BN = r, r.BN = r, r.wordSize = 26;
      var u;
      try {
        typeof window < "u" && typeof window.Buffer < "u" ? u = window.Buffer : u = requireDist().Buffer;
      } catch {
      }
      r.isBN = function(l) {
        return l instanceof r ? !0 : l !== null && typeof l == "object" && l.constructor.wordSize === r.wordSize && Array.isArray(l.words);
      }, r.max = function(l, _) {
        return l.cmp(_) > 0 ? l : _;
      }, r.min = function(l, _) {
        return l.cmp(_) < 0 ? l : _;
      }, r.prototype._init = function(l, _, A) {
        if (typeof l == "number")
          return this._initNumber(l, _, A);
        if (typeof l == "object")
          return this._initArray(l, _, A);
        _ === "hex" && (_ = 16), f(_ === (_ | 0) && _ >= 2 && _ <= 36), l = l.toString().replace(/\s+/g, "");
        var q = 0;
        l[0] === "-" && (q++, this.negative = 1), q < l.length && (_ === 16 ? this._parseHex(l, q, A) : (this._parseBase(l, _, q), A === "le" && this._initArray(this.toArray(), _, A)));
      }, r.prototype._initNumber = function(l, _, A) {
        l < 0 && (this.negative = 1, l = -l), l < 67108864 ? (this.words = [l & 67108863], this.length = 1) : l < 4503599627370496 ? (this.words = [
          l & 67108863,
          l / 67108864 & 67108863
        ], this.length = 2) : (f(l < 9007199254740992), this.words = [
          l & 67108863,
          l / 67108864 & 67108863,
          1
        ], this.length = 3), A === "le" && this._initArray(this.toArray(), _, A);
      }, r.prototype._initArray = function(l, _, A) {
        if (f(typeof l.length == "number"), l.length <= 0)
          return this.words = [0], this.length = 1, this;
        this.length = Math.ceil(l.length / 3), this.words = new Array(this.length);
        for (var q = 0; q < this.length; q++)
          this.words[q] = 0;
        var P, R, w = 0;
        if (A === "be")
          for (q = l.length - 1, P = 0; q >= 0; q -= 3)
            R = l[q] | l[q - 1] << 8 | l[q - 2] << 16, this.words[P] |= R << w & 67108863, this.words[P + 1] = R >>> 26 - w & 67108863, w += 24, w >= 26 && (w -= 26, P++);
        else if (A === "le")
          for (q = 0, P = 0; q < l.length; q += 3)
            R = l[q] | l[q + 1] << 8 | l[q + 2] << 16, this.words[P] |= R << w & 67108863, this.words[P + 1] = R >>> 26 - w & 67108863, w += 24, w >= 26 && (w -= 26, P++);
        return this._strip();
      };
      function o(g, l) {
        var _ = g.charCodeAt(l);
        if (_ >= 48 && _ <= 57)
          return _ - 48;
        if (_ >= 65 && _ <= 70)
          return _ - 55;
        if (_ >= 97 && _ <= 102)
          return _ - 87;
        f(!1, "Invalid character in " + g);
      }
      function t(g, l, _) {
        var A = o(g, _);
        return _ - 1 >= l && (A |= o(g, _ - 1) << 4), A;
      }
      r.prototype._parseHex = function(l, _, A) {
        this.length = Math.ceil((l.length - _) / 6), this.words = new Array(this.length);
        for (var q = 0; q < this.length; q++)
          this.words[q] = 0;
        var P = 0, R = 0, w;
        if (A === "be")
          for (q = l.length - 1; q >= _; q -= 2)
            w = t(l, _, q) << P, this.words[R] |= w & 67108863, P >= 18 ? (P -= 18, R += 1, this.words[R] |= w >>> 26) : P += 8;
        else {
          var M = l.length - _;
          for (q = M % 2 === 0 ? _ + 1 : _; q < l.length; q += 2)
            w = t(l, _, q) << P, this.words[R] |= w & 67108863, P >= 18 ? (P -= 18, R += 1, this.words[R] |= w >>> 26) : P += 8;
        }
        this._strip();
      };
      function n(g, l, _, A) {
        for (var q = 0, P = 0, R = Math.min(g.length, _), w = l; w < R; w++) {
          var M = g.charCodeAt(w) - 48;
          q *= A, M >= 49 ? P = M - 49 + 10 : M >= 17 ? P = M - 17 + 10 : P = M, f(M >= 0 && P < A, "Invalid character"), q += P;
        }
        return q;
      }
      r.prototype._parseBase = function(l, _, A) {
        this.words = [0], this.length = 1;
        for (var q = 0, P = 1; P <= 67108863; P *= _)
          q++;
        q--, P = P / _ | 0;
        for (var R = l.length - A, w = R % q, M = Math.min(R, R - w) + A, x = 0, L = A; L < M; L += q)
          x = n(l, L, L + q, _), this.imuln(P), this.words[0] + x < 67108864 ? this.words[0] += x : this._iaddn(x);
        if (w !== 0) {
          var K = 1;
          for (x = n(l, L, l.length, _), L = 0; L < w; L++)
            K *= _;
          this.imuln(K), this.words[0] + x < 67108864 ? this.words[0] += x : this._iaddn(x);
        }
        this._strip();
      }, r.prototype.copy = function(l) {
        l.words = new Array(this.length);
        for (var _ = 0; _ < this.length; _++)
          l.words[_] = this.words[_];
        l.length = this.length, l.negative = this.negative, l.red = this.red;
      };
      function e(g, l) {
        g.words = l.words, g.length = l.length, g.negative = l.negative, g.red = l.red;
      }
      if (r.prototype._move = function(l) {
        e(l, this);
      }, r.prototype.clone = function() {
        var l = new r(null);
        return this.copy(l), l;
      }, r.prototype._expand = function(l) {
        for (; this.length < l; )
          this.words[this.length++] = 0;
        return this;
      }, r.prototype._strip = function() {
        for (; this.length > 1 && this.words[this.length - 1] === 0; )
          this.length--;
        return this._normSign();
      }, r.prototype._normSign = function() {
        return this.length === 1 && this.words[0] === 0 && (this.negative = 0), this;
      }, typeof Symbol < "u" && typeof Symbol.for == "function")
        try {
          r.prototype[/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")] = s;
        } catch {
          r.prototype.inspect = s;
        }
      else
        r.prototype.inspect = s;
      function s() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
      }
      var d = [
        "",
        "0",
        "00",
        "000",
        "0000",
        "00000",
        "000000",
        "0000000",
        "00000000",
        "000000000",
        "0000000000",
        "00000000000",
        "000000000000",
        "0000000000000",
        "00000000000000",
        "000000000000000",
        "0000000000000000",
        "00000000000000000",
        "000000000000000000",
        "0000000000000000000",
        "00000000000000000000",
        "000000000000000000000",
        "0000000000000000000000",
        "00000000000000000000000",
        "000000000000000000000000",
        "0000000000000000000000000"
      ], v = [
        0,
        0,
        25,
        16,
        12,
        11,
        10,
        9,
        8,
        8,
        7,
        7,
        7,
        7,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ], y = [
        0,
        0,
        33554432,
        43046721,
        16777216,
        48828125,
        60466176,
        40353607,
        16777216,
        43046721,
        1e7,
        19487171,
        35831808,
        62748517,
        7529536,
        11390625,
        16777216,
        24137569,
        34012224,
        47045881,
        64e6,
        4084101,
        5153632,
        6436343,
        7962624,
        9765625,
        11881376,
        14348907,
        17210368,
        20511149,
        243e5,
        28629151,
        33554432,
        39135393,
        45435424,
        52521875,
        60466176
      ];
      r.prototype.toString = function(l, _) {
        l = l || 10, _ = _ | 0 || 1;
        var A;
        if (l === 16 || l === "hex") {
          A = "";
          for (var q = 0, P = 0, R = 0; R < this.length; R++) {
            var w = this.words[R], M = ((w << q | P) & 16777215).toString(16);
            P = w >>> 24 - q & 16777215, q += 2, q >= 26 && (q -= 26, R--), P !== 0 || R !== this.length - 1 ? A = d[6 - M.length] + M + A : A = M + A;
          }
          for (P !== 0 && (A = P.toString(16) + A); A.length % _ !== 0; )
            A = "0" + A;
          return this.negative !== 0 && (A = "-" + A), A;
        }
        if (l === (l | 0) && l >= 2 && l <= 36) {
          var x = v[l], L = y[l];
          A = "";
          var K = this.clone();
          for (K.negative = 0; !K.isZero(); ) {
            var Q = K.modrn(L).toString(l);
            K = K.idivn(L), K.isZero() ? A = Q + A : A = d[x - Q.length] + Q + A;
          }
          for (this.isZero() && (A = "0" + A); A.length % _ !== 0; )
            A = "0" + A;
          return this.negative !== 0 && (A = "-" + A), A;
        }
        f(!1, "Base should be between 2 and 36");
      }, r.prototype.toNumber = function() {
        var l = this.words[0];
        return this.length === 2 ? l += this.words[1] * 67108864 : this.length === 3 && this.words[2] === 1 ? l += 4503599627370496 + this.words[1] * 67108864 : this.length > 2 && f(!1, "Number can only safely store up to 53 bits"), this.negative !== 0 ? -l : l;
      }, r.prototype.toJSON = function() {
        return this.toString(16, 2);
      }, u && (r.prototype.toBuffer = function(l, _) {
        return this.toArrayLike(u, l, _);
      }), r.prototype.toArray = function(l, _) {
        return this.toArrayLike(Array, l, _);
      };
      var m = function(l, _) {
        return l.allocUnsafe ? l.allocUnsafe(_) : new l(_);
      };
      r.prototype.toArrayLike = function(l, _, A) {
        this._strip();
        var q = this.byteLength(), P = A || Math.max(1, q);
        f(q <= P, "byte array longer than desired length"), f(P > 0, "Requested array length <= 0");
        var R = m(l, P), w = _ === "le" ? "LE" : "BE";
        return this["_toArrayLike" + w](R, q), R;
      }, r.prototype._toArrayLikeLE = function(l, _) {
        for (var A = 0, q = 0, P = 0, R = 0; P < this.length; P++) {
          var w = this.words[P] << R | q;
          l[A++] = w & 255, A < l.length && (l[A++] = w >> 8 & 255), A < l.length && (l[A++] = w >> 16 & 255), R === 6 ? (A < l.length && (l[A++] = w >> 24 & 255), q = 0, R = 0) : (q = w >>> 24, R += 2);
        }
        if (A < l.length)
          for (l[A++] = q; A < l.length; )
            l[A++] = 0;
      }, r.prototype._toArrayLikeBE = function(l, _) {
        for (var A = l.length - 1, q = 0, P = 0, R = 0; P < this.length; P++) {
          var w = this.words[P] << R | q;
          l[A--] = w & 255, A >= 0 && (l[A--] = w >> 8 & 255), A >= 0 && (l[A--] = w >> 16 & 255), R === 6 ? (A >= 0 && (l[A--] = w >> 24 & 255), q = 0, R = 0) : (q = w >>> 24, R += 2);
        }
        if (A >= 0)
          for (l[A--] = q; A >= 0; )
            l[A--] = 0;
      }, Math.clz32 ? r.prototype._countBits = function(l) {
        return 32 - Math.clz32(l);
      } : r.prototype._countBits = function(l) {
        var _ = l, A = 0;
        return _ >= 4096 && (A += 13, _ >>>= 13), _ >= 64 && (A += 7, _ >>>= 7), _ >= 8 && (A += 4, _ >>>= 4), _ >= 2 && (A += 2, _ >>>= 2), A + _;
      }, r.prototype._zeroBits = function(l) {
        if (l === 0) return 26;
        var _ = l, A = 0;
        return (_ & 8191) === 0 && (A += 13, _ >>>= 13), (_ & 127) === 0 && (A += 7, _ >>>= 7), (_ & 15) === 0 && (A += 4, _ >>>= 4), (_ & 3) === 0 && (A += 2, _ >>>= 2), (_ & 1) === 0 && A++, A;
      }, r.prototype.bitLength = function() {
        var l = this.words[this.length - 1], _ = this._countBits(l);
        return (this.length - 1) * 26 + _;
      };
      function B(g) {
        for (var l = new Array(g.bitLength()), _ = 0; _ < l.length; _++) {
          var A = _ / 26 | 0, q = _ % 26;
          l[_] = g.words[A] >>> q & 1;
        }
        return l;
      }
      r.prototype.zeroBits = function() {
        if (this.isZero()) return 0;
        for (var l = 0, _ = 0; _ < this.length; _++) {
          var A = this._zeroBits(this.words[_]);
          if (l += A, A !== 26) break;
        }
        return l;
      }, r.prototype.byteLength = function() {
        return Math.ceil(this.bitLength() / 8);
      }, r.prototype.toTwos = function(l) {
        return this.negative !== 0 ? this.abs().inotn(l).iaddn(1) : this.clone();
      }, r.prototype.fromTwos = function(l) {
        return this.testn(l - 1) ? this.notn(l).iaddn(1).ineg() : this.clone();
      }, r.prototype.isNeg = function() {
        return this.negative !== 0;
      }, r.prototype.neg = function() {
        return this.clone().ineg();
      }, r.prototype.ineg = function() {
        return this.isZero() || (this.negative ^= 1), this;
      }, r.prototype.iuor = function(l) {
        for (; this.length < l.length; )
          this.words[this.length++] = 0;
        for (var _ = 0; _ < l.length; _++)
          this.words[_] = this.words[_] | l.words[_];
        return this._strip();
      }, r.prototype.ior = function(l) {
        return f((this.negative | l.negative) === 0), this.iuor(l);
      }, r.prototype.or = function(l) {
        return this.length > l.length ? this.clone().ior(l) : l.clone().ior(this);
      }, r.prototype.uor = function(l) {
        return this.length > l.length ? this.clone().iuor(l) : l.clone().iuor(this);
      }, r.prototype.iuand = function(l) {
        var _;
        this.length > l.length ? _ = l : _ = this;
        for (var A = 0; A < _.length; A++)
          this.words[A] = this.words[A] & l.words[A];
        return this.length = _.length, this._strip();
      }, r.prototype.iand = function(l) {
        return f((this.negative | l.negative) === 0), this.iuand(l);
      }, r.prototype.and = function(l) {
        return this.length > l.length ? this.clone().iand(l) : l.clone().iand(this);
      }, r.prototype.uand = function(l) {
        return this.length > l.length ? this.clone().iuand(l) : l.clone().iuand(this);
      }, r.prototype.iuxor = function(l) {
        var _, A;
        this.length > l.length ? (_ = this, A = l) : (_ = l, A = this);
        for (var q = 0; q < A.length; q++)
          this.words[q] = _.words[q] ^ A.words[q];
        if (this !== _)
          for (; q < _.length; q++)
            this.words[q] = _.words[q];
        return this.length = _.length, this._strip();
      }, r.prototype.ixor = function(l) {
        return f((this.negative | l.negative) === 0), this.iuxor(l);
      }, r.prototype.xor = function(l) {
        return this.length > l.length ? this.clone().ixor(l) : l.clone().ixor(this);
      }, r.prototype.uxor = function(l) {
        return this.length > l.length ? this.clone().iuxor(l) : l.clone().iuxor(this);
      }, r.prototype.inotn = function(l) {
        f(typeof l == "number" && l >= 0);
        var _ = Math.ceil(l / 26) | 0, A = l % 26;
        this._expand(_), A > 0 && _--;
        for (var q = 0; q < _; q++)
          this.words[q] = ~this.words[q] & 67108863;
        return A > 0 && (this.words[q] = ~this.words[q] & 67108863 >> 26 - A), this._strip();
      }, r.prototype.notn = function(l) {
        return this.clone().inotn(l);
      }, r.prototype.setn = function(l, _) {
        f(typeof l == "number" && l >= 0);
        var A = l / 26 | 0, q = l % 26;
        return this._expand(A + 1), _ ? this.words[A] = this.words[A] | 1 << q : this.words[A] = this.words[A] & ~(1 << q), this._strip();
      }, r.prototype.iadd = function(l) {
        var _;
        if (this.negative !== 0 && l.negative === 0)
          return this.negative = 0, _ = this.isub(l), this.negative ^= 1, this._normSign();
        if (this.negative === 0 && l.negative !== 0)
          return l.negative = 0, _ = this.isub(l), l.negative = 1, _._normSign();
        var A, q;
        this.length > l.length ? (A = this, q = l) : (A = l, q = this);
        for (var P = 0, R = 0; R < q.length; R++)
          _ = (A.words[R] | 0) + (q.words[R] | 0) + P, this.words[R] = _ & 67108863, P = _ >>> 26;
        for (; P !== 0 && R < A.length; R++)
          _ = (A.words[R] | 0) + P, this.words[R] = _ & 67108863, P = _ >>> 26;
        if (this.length = A.length, P !== 0)
          this.words[this.length] = P, this.length++;
        else if (A !== this)
          for (; R < A.length; R++)
            this.words[R] = A.words[R];
        return this;
      }, r.prototype.add = function(l) {
        var _;
        return l.negative !== 0 && this.negative === 0 ? (l.negative = 0, _ = this.sub(l), l.negative ^= 1, _) : l.negative === 0 && this.negative !== 0 ? (this.negative = 0, _ = l.sub(this), this.negative = 1, _) : this.length > l.length ? this.clone().iadd(l) : l.clone().iadd(this);
      }, r.prototype.isub = function(l) {
        if (l.negative !== 0) {
          l.negative = 0;
          var _ = this.iadd(l);
          return l.negative = 1, _._normSign();
        } else if (this.negative !== 0)
          return this.negative = 0, this.iadd(l), this.negative = 1, this._normSign();
        var A = this.cmp(l);
        if (A === 0)
          return this.negative = 0, this.length = 1, this.words[0] = 0, this;
        var q, P;
        A > 0 ? (q = this, P = l) : (q = l, P = this);
        for (var R = 0, w = 0; w < P.length; w++)
          _ = (q.words[w] | 0) - (P.words[w] | 0) + R, R = _ >> 26, this.words[w] = _ & 67108863;
        for (; R !== 0 && w < q.length; w++)
          _ = (q.words[w] | 0) + R, R = _ >> 26, this.words[w] = _ & 67108863;
        if (R === 0 && w < q.length && q !== this)
          for (; w < q.length; w++)
            this.words[w] = q.words[w];
        return this.length = Math.max(this.length, w), q !== this && (this.negative = 1), this._strip();
      }, r.prototype.sub = function(l) {
        return this.clone().isub(l);
      };
      function E(g, l, _) {
        _.negative = l.negative ^ g.negative;
        var A = g.length + l.length | 0;
        _.length = A, A = A - 1 | 0;
        var q = g.words[0] | 0, P = l.words[0] | 0, R = q * P, w = R & 67108863, M = R / 67108864 | 0;
        _.words[0] = w;
        for (var x = 1; x < A; x++) {
          for (var L = M >>> 26, K = M & 67108863, Q = Math.min(x, l.length - 1), U = Math.max(0, x - g.length + 1); U <= Q; U++) {
            var N = x - U | 0;
            q = g.words[N] | 0, P = l.words[U] | 0, R = q * P + K, L += R / 67108864 | 0, K = R & 67108863;
          }
          _.words[x] = K | 0, M = L | 0;
        }
        return M !== 0 ? _.words[x] = M | 0 : _.length--, _._strip();
      }
      var S = function(l, _, A) {
        var q = l.words, P = _.words, R = A.words, w = 0, M, x, L, K = q[0] | 0, Q = K & 8191, U = K >>> 13, N = q[1] | 0, F = N & 8191, ee = N >>> 13, ae = q[2] | 0, G = ae & 8191, z = ae >>> 13, fe = q[3] | 0, me = fe & 8191, xe = fe >>> 13, _e = q[4] | 0, Be = _e & 8191, Ae = _e >>> 13, be = q[5] | 0, Fe = be & 8191, qe = be >>> 13, Me = q[6] | 0, Te = Me & 8191, oe = Me >>> 13, ce = q[7] | 0, ge = ce & 8191, we = ce >>> 13, Se = q[8] | 0, Oe = Se & 8191, j = Se >>> 13, I = q[9] | 0, C = I & 8191, X = I >>> 13, se = P[0] | 0, de = se & 8191, ve = se >>> 13, Ce = P[1] | 0, Le = Ce & 8191, Ie = Ce >>> 13, Ue = P[2] | 0, $e = Ue & 8191, He = Ue >>> 13, Ke = P[3] | 0, Ye = Ke & 8191, We = Ke >>> 13, Ze = P[4] | 0, Xe = Ze & 8191, W = Ze >>> 13, T = P[5] | 0, k = T & 8191, re = T >>> 13, ue = P[6] | 0, pe = ue & 8191, ye = ue >>> 13, ke = P[7] | 0, Ve = ke & 8191, Ne = ke >>> 13, ze = P[8] | 0, je = ze & 8191, Ge = ze >>> 13, Je = P[9] | 0, Qe = Je & 8191, er = Je >>> 13;
        A.negative = l.negative ^ _.negative, A.length = 19, M = Math.imul(Q, de), x = Math.imul(Q, ve), x = x + Math.imul(U, de) | 0, L = Math.imul(U, ve);
        var fr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (fr >>> 26) | 0, fr &= 67108863, M = Math.imul(F, de), x = Math.imul(F, ve), x = x + Math.imul(ee, de) | 0, L = Math.imul(ee, ve), M = M + Math.imul(Q, Le) | 0, x = x + Math.imul(Q, Ie) | 0, x = x + Math.imul(U, Le) | 0, L = L + Math.imul(U, Ie) | 0;
        var ur = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (ur >>> 26) | 0, ur &= 67108863, M = Math.imul(G, de), x = Math.imul(G, ve), x = x + Math.imul(z, de) | 0, L = Math.imul(z, ve), M = M + Math.imul(F, Le) | 0, x = x + Math.imul(F, Ie) | 0, x = x + Math.imul(ee, Le) | 0, L = L + Math.imul(ee, Ie) | 0, M = M + Math.imul(Q, $e) | 0, x = x + Math.imul(Q, He) | 0, x = x + Math.imul(U, $e) | 0, L = L + Math.imul(U, He) | 0;
        var cr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (cr >>> 26) | 0, cr &= 67108863, M = Math.imul(me, de), x = Math.imul(me, ve), x = x + Math.imul(xe, de) | 0, L = Math.imul(xe, ve), M = M + Math.imul(G, Le) | 0, x = x + Math.imul(G, Ie) | 0, x = x + Math.imul(z, Le) | 0, L = L + Math.imul(z, Ie) | 0, M = M + Math.imul(F, $e) | 0, x = x + Math.imul(F, He) | 0, x = x + Math.imul(ee, $e) | 0, L = L + Math.imul(ee, He) | 0, M = M + Math.imul(Q, Ye) | 0, x = x + Math.imul(Q, We) | 0, x = x + Math.imul(U, Ye) | 0, L = L + Math.imul(U, We) | 0;
        var nr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (nr >>> 26) | 0, nr &= 67108863, M = Math.imul(Be, de), x = Math.imul(Be, ve), x = x + Math.imul(Ae, de) | 0, L = Math.imul(Ae, ve), M = M + Math.imul(me, Le) | 0, x = x + Math.imul(me, Ie) | 0, x = x + Math.imul(xe, Le) | 0, L = L + Math.imul(xe, Ie) | 0, M = M + Math.imul(G, $e) | 0, x = x + Math.imul(G, He) | 0, x = x + Math.imul(z, $e) | 0, L = L + Math.imul(z, He) | 0, M = M + Math.imul(F, Ye) | 0, x = x + Math.imul(F, We) | 0, x = x + Math.imul(ee, Ye) | 0, L = L + Math.imul(ee, We) | 0, M = M + Math.imul(Q, Xe) | 0, x = x + Math.imul(Q, W) | 0, x = x + Math.imul(U, Xe) | 0, L = L + Math.imul(U, W) | 0;
        var hr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (hr >>> 26) | 0, hr &= 67108863, M = Math.imul(Fe, de), x = Math.imul(Fe, ve), x = x + Math.imul(qe, de) | 0, L = Math.imul(qe, ve), M = M + Math.imul(Be, Le) | 0, x = x + Math.imul(Be, Ie) | 0, x = x + Math.imul(Ae, Le) | 0, L = L + Math.imul(Ae, Ie) | 0, M = M + Math.imul(me, $e) | 0, x = x + Math.imul(me, He) | 0, x = x + Math.imul(xe, $e) | 0, L = L + Math.imul(xe, He) | 0, M = M + Math.imul(G, Ye) | 0, x = x + Math.imul(G, We) | 0, x = x + Math.imul(z, Ye) | 0, L = L + Math.imul(z, We) | 0, M = M + Math.imul(F, Xe) | 0, x = x + Math.imul(F, W) | 0, x = x + Math.imul(ee, Xe) | 0, L = L + Math.imul(ee, W) | 0, M = M + Math.imul(Q, k) | 0, x = x + Math.imul(Q, re) | 0, x = x + Math.imul(U, k) | 0, L = L + Math.imul(U, re) | 0;
        var dr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (dr >>> 26) | 0, dr &= 67108863, M = Math.imul(Te, de), x = Math.imul(Te, ve), x = x + Math.imul(oe, de) | 0, L = Math.imul(oe, ve), M = M + Math.imul(Fe, Le) | 0, x = x + Math.imul(Fe, Ie) | 0, x = x + Math.imul(qe, Le) | 0, L = L + Math.imul(qe, Ie) | 0, M = M + Math.imul(Be, $e) | 0, x = x + Math.imul(Be, He) | 0, x = x + Math.imul(Ae, $e) | 0, L = L + Math.imul(Ae, He) | 0, M = M + Math.imul(me, Ye) | 0, x = x + Math.imul(me, We) | 0, x = x + Math.imul(xe, Ye) | 0, L = L + Math.imul(xe, We) | 0, M = M + Math.imul(G, Xe) | 0, x = x + Math.imul(G, W) | 0, x = x + Math.imul(z, Xe) | 0, L = L + Math.imul(z, W) | 0, M = M + Math.imul(F, k) | 0, x = x + Math.imul(F, re) | 0, x = x + Math.imul(ee, k) | 0, L = L + Math.imul(ee, re) | 0, M = M + Math.imul(Q, pe) | 0, x = x + Math.imul(Q, ye) | 0, x = x + Math.imul(U, pe) | 0, L = L + Math.imul(U, ye) | 0;
        var lr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (lr >>> 26) | 0, lr &= 67108863, M = Math.imul(ge, de), x = Math.imul(ge, ve), x = x + Math.imul(we, de) | 0, L = Math.imul(we, ve), M = M + Math.imul(Te, Le) | 0, x = x + Math.imul(Te, Ie) | 0, x = x + Math.imul(oe, Le) | 0, L = L + Math.imul(oe, Ie) | 0, M = M + Math.imul(Fe, $e) | 0, x = x + Math.imul(Fe, He) | 0, x = x + Math.imul(qe, $e) | 0, L = L + Math.imul(qe, He) | 0, M = M + Math.imul(Be, Ye) | 0, x = x + Math.imul(Be, We) | 0, x = x + Math.imul(Ae, Ye) | 0, L = L + Math.imul(Ae, We) | 0, M = M + Math.imul(me, Xe) | 0, x = x + Math.imul(me, W) | 0, x = x + Math.imul(xe, Xe) | 0, L = L + Math.imul(xe, W) | 0, M = M + Math.imul(G, k) | 0, x = x + Math.imul(G, re) | 0, x = x + Math.imul(z, k) | 0, L = L + Math.imul(z, re) | 0, M = M + Math.imul(F, pe) | 0, x = x + Math.imul(F, ye) | 0, x = x + Math.imul(ee, pe) | 0, L = L + Math.imul(ee, ye) | 0, M = M + Math.imul(Q, Ve) | 0, x = x + Math.imul(Q, Ne) | 0, x = x + Math.imul(U, Ve) | 0, L = L + Math.imul(U, Ne) | 0;
        var pr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (pr >>> 26) | 0, pr &= 67108863, M = Math.imul(Oe, de), x = Math.imul(Oe, ve), x = x + Math.imul(j, de) | 0, L = Math.imul(j, ve), M = M + Math.imul(ge, Le) | 0, x = x + Math.imul(ge, Ie) | 0, x = x + Math.imul(we, Le) | 0, L = L + Math.imul(we, Ie) | 0, M = M + Math.imul(Te, $e) | 0, x = x + Math.imul(Te, He) | 0, x = x + Math.imul(oe, $e) | 0, L = L + Math.imul(oe, He) | 0, M = M + Math.imul(Fe, Ye) | 0, x = x + Math.imul(Fe, We) | 0, x = x + Math.imul(qe, Ye) | 0, L = L + Math.imul(qe, We) | 0, M = M + Math.imul(Be, Xe) | 0, x = x + Math.imul(Be, W) | 0, x = x + Math.imul(Ae, Xe) | 0, L = L + Math.imul(Ae, W) | 0, M = M + Math.imul(me, k) | 0, x = x + Math.imul(me, re) | 0, x = x + Math.imul(xe, k) | 0, L = L + Math.imul(xe, re) | 0, M = M + Math.imul(G, pe) | 0, x = x + Math.imul(G, ye) | 0, x = x + Math.imul(z, pe) | 0, L = L + Math.imul(z, ye) | 0, M = M + Math.imul(F, Ve) | 0, x = x + Math.imul(F, Ne) | 0, x = x + Math.imul(ee, Ve) | 0, L = L + Math.imul(ee, Ne) | 0, M = M + Math.imul(Q, je) | 0, x = x + Math.imul(Q, Ge) | 0, x = x + Math.imul(U, je) | 0, L = L + Math.imul(U, Ge) | 0;
        var vr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (vr >>> 26) | 0, vr &= 67108863, M = Math.imul(C, de), x = Math.imul(C, ve), x = x + Math.imul(X, de) | 0, L = Math.imul(X, ve), M = M + Math.imul(Oe, Le) | 0, x = x + Math.imul(Oe, Ie) | 0, x = x + Math.imul(j, Le) | 0, L = L + Math.imul(j, Ie) | 0, M = M + Math.imul(ge, $e) | 0, x = x + Math.imul(ge, He) | 0, x = x + Math.imul(we, $e) | 0, L = L + Math.imul(we, He) | 0, M = M + Math.imul(Te, Ye) | 0, x = x + Math.imul(Te, We) | 0, x = x + Math.imul(oe, Ye) | 0, L = L + Math.imul(oe, We) | 0, M = M + Math.imul(Fe, Xe) | 0, x = x + Math.imul(Fe, W) | 0, x = x + Math.imul(qe, Xe) | 0, L = L + Math.imul(qe, W) | 0, M = M + Math.imul(Be, k) | 0, x = x + Math.imul(Be, re) | 0, x = x + Math.imul(Ae, k) | 0, L = L + Math.imul(Ae, re) | 0, M = M + Math.imul(me, pe) | 0, x = x + Math.imul(me, ye) | 0, x = x + Math.imul(xe, pe) | 0, L = L + Math.imul(xe, ye) | 0, M = M + Math.imul(G, Ve) | 0, x = x + Math.imul(G, Ne) | 0, x = x + Math.imul(z, Ve) | 0, L = L + Math.imul(z, Ne) | 0, M = M + Math.imul(F, je) | 0, x = x + Math.imul(F, Ge) | 0, x = x + Math.imul(ee, je) | 0, L = L + Math.imul(ee, Ge) | 0, M = M + Math.imul(Q, Qe) | 0, x = x + Math.imul(Q, er) | 0, x = x + Math.imul(U, Qe) | 0, L = L + Math.imul(U, er) | 0;
        var br = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (br >>> 26) | 0, br &= 67108863, M = Math.imul(C, Le), x = Math.imul(C, Ie), x = x + Math.imul(X, Le) | 0, L = Math.imul(X, Ie), M = M + Math.imul(Oe, $e) | 0, x = x + Math.imul(Oe, He) | 0, x = x + Math.imul(j, $e) | 0, L = L + Math.imul(j, He) | 0, M = M + Math.imul(ge, Ye) | 0, x = x + Math.imul(ge, We) | 0, x = x + Math.imul(we, Ye) | 0, L = L + Math.imul(we, We) | 0, M = M + Math.imul(Te, Xe) | 0, x = x + Math.imul(Te, W) | 0, x = x + Math.imul(oe, Xe) | 0, L = L + Math.imul(oe, W) | 0, M = M + Math.imul(Fe, k) | 0, x = x + Math.imul(Fe, re) | 0, x = x + Math.imul(qe, k) | 0, L = L + Math.imul(qe, re) | 0, M = M + Math.imul(Be, pe) | 0, x = x + Math.imul(Be, ye) | 0, x = x + Math.imul(Ae, pe) | 0, L = L + Math.imul(Ae, ye) | 0, M = M + Math.imul(me, Ve) | 0, x = x + Math.imul(me, Ne) | 0, x = x + Math.imul(xe, Ve) | 0, L = L + Math.imul(xe, Ne) | 0, M = M + Math.imul(G, je) | 0, x = x + Math.imul(G, Ge) | 0, x = x + Math.imul(z, je) | 0, L = L + Math.imul(z, Ge) | 0, M = M + Math.imul(F, Qe) | 0, x = x + Math.imul(F, er) | 0, x = x + Math.imul(ee, Qe) | 0, L = L + Math.imul(ee, er) | 0;
        var yr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (yr >>> 26) | 0, yr &= 67108863, M = Math.imul(C, $e), x = Math.imul(C, He), x = x + Math.imul(X, $e) | 0, L = Math.imul(X, He), M = M + Math.imul(Oe, Ye) | 0, x = x + Math.imul(Oe, We) | 0, x = x + Math.imul(j, Ye) | 0, L = L + Math.imul(j, We) | 0, M = M + Math.imul(ge, Xe) | 0, x = x + Math.imul(ge, W) | 0, x = x + Math.imul(we, Xe) | 0, L = L + Math.imul(we, W) | 0, M = M + Math.imul(Te, k) | 0, x = x + Math.imul(Te, re) | 0, x = x + Math.imul(oe, k) | 0, L = L + Math.imul(oe, re) | 0, M = M + Math.imul(Fe, pe) | 0, x = x + Math.imul(Fe, ye) | 0, x = x + Math.imul(qe, pe) | 0, L = L + Math.imul(qe, ye) | 0, M = M + Math.imul(Be, Ve) | 0, x = x + Math.imul(Be, Ne) | 0, x = x + Math.imul(Ae, Ve) | 0, L = L + Math.imul(Ae, Ne) | 0, M = M + Math.imul(me, je) | 0, x = x + Math.imul(me, Ge) | 0, x = x + Math.imul(xe, je) | 0, L = L + Math.imul(xe, Ge) | 0, M = M + Math.imul(G, Qe) | 0, x = x + Math.imul(G, er) | 0, x = x + Math.imul(z, Qe) | 0, L = L + Math.imul(z, er) | 0;
        var gr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (gr >>> 26) | 0, gr &= 67108863, M = Math.imul(C, Ye), x = Math.imul(C, We), x = x + Math.imul(X, Ye) | 0, L = Math.imul(X, We), M = M + Math.imul(Oe, Xe) | 0, x = x + Math.imul(Oe, W) | 0, x = x + Math.imul(j, Xe) | 0, L = L + Math.imul(j, W) | 0, M = M + Math.imul(ge, k) | 0, x = x + Math.imul(ge, re) | 0, x = x + Math.imul(we, k) | 0, L = L + Math.imul(we, re) | 0, M = M + Math.imul(Te, pe) | 0, x = x + Math.imul(Te, ye) | 0, x = x + Math.imul(oe, pe) | 0, L = L + Math.imul(oe, ye) | 0, M = M + Math.imul(Fe, Ve) | 0, x = x + Math.imul(Fe, Ne) | 0, x = x + Math.imul(qe, Ve) | 0, L = L + Math.imul(qe, Ne) | 0, M = M + Math.imul(Be, je) | 0, x = x + Math.imul(Be, Ge) | 0, x = x + Math.imul(Ae, je) | 0, L = L + Math.imul(Ae, Ge) | 0, M = M + Math.imul(me, Qe) | 0, x = x + Math.imul(me, er) | 0, x = x + Math.imul(xe, Qe) | 0, L = L + Math.imul(xe, er) | 0;
        var wr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (wr >>> 26) | 0, wr &= 67108863, M = Math.imul(C, Xe), x = Math.imul(C, W), x = x + Math.imul(X, Xe) | 0, L = Math.imul(X, W), M = M + Math.imul(Oe, k) | 0, x = x + Math.imul(Oe, re) | 0, x = x + Math.imul(j, k) | 0, L = L + Math.imul(j, re) | 0, M = M + Math.imul(ge, pe) | 0, x = x + Math.imul(ge, ye) | 0, x = x + Math.imul(we, pe) | 0, L = L + Math.imul(we, ye) | 0, M = M + Math.imul(Te, Ve) | 0, x = x + Math.imul(Te, Ne) | 0, x = x + Math.imul(oe, Ve) | 0, L = L + Math.imul(oe, Ne) | 0, M = M + Math.imul(Fe, je) | 0, x = x + Math.imul(Fe, Ge) | 0, x = x + Math.imul(qe, je) | 0, L = L + Math.imul(qe, Ge) | 0, M = M + Math.imul(Be, Qe) | 0, x = x + Math.imul(Be, er) | 0, x = x + Math.imul(Ae, Qe) | 0, L = L + Math.imul(Ae, er) | 0;
        var rr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (rr >>> 26) | 0, rr &= 67108863, M = Math.imul(C, k), x = Math.imul(C, re), x = x + Math.imul(X, k) | 0, L = Math.imul(X, re), M = M + Math.imul(Oe, pe) | 0, x = x + Math.imul(Oe, ye) | 0, x = x + Math.imul(j, pe) | 0, L = L + Math.imul(j, ye) | 0, M = M + Math.imul(ge, Ve) | 0, x = x + Math.imul(ge, Ne) | 0, x = x + Math.imul(we, Ve) | 0, L = L + Math.imul(we, Ne) | 0, M = M + Math.imul(Te, je) | 0, x = x + Math.imul(Te, Ge) | 0, x = x + Math.imul(oe, je) | 0, L = L + Math.imul(oe, Ge) | 0, M = M + Math.imul(Fe, Qe) | 0, x = x + Math.imul(Fe, er) | 0, x = x + Math.imul(qe, Qe) | 0, L = L + Math.imul(qe, er) | 0;
        var _r = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (_r >>> 26) | 0, _r &= 67108863, M = Math.imul(C, pe), x = Math.imul(C, ye), x = x + Math.imul(X, pe) | 0, L = Math.imul(X, ye), M = M + Math.imul(Oe, Ve) | 0, x = x + Math.imul(Oe, Ne) | 0, x = x + Math.imul(j, Ve) | 0, L = L + Math.imul(j, Ne) | 0, M = M + Math.imul(ge, je) | 0, x = x + Math.imul(ge, Ge) | 0, x = x + Math.imul(we, je) | 0, L = L + Math.imul(we, Ge) | 0, M = M + Math.imul(Te, Qe) | 0, x = x + Math.imul(Te, er) | 0, x = x + Math.imul(oe, Qe) | 0, L = L + Math.imul(oe, er) | 0;
        var xr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (xr >>> 26) | 0, xr &= 67108863, M = Math.imul(C, Ve), x = Math.imul(C, Ne), x = x + Math.imul(X, Ve) | 0, L = Math.imul(X, Ne), M = M + Math.imul(Oe, je) | 0, x = x + Math.imul(Oe, Ge) | 0, x = x + Math.imul(j, je) | 0, L = L + Math.imul(j, Ge) | 0, M = M + Math.imul(ge, Qe) | 0, x = x + Math.imul(ge, er) | 0, x = x + Math.imul(we, Qe) | 0, L = L + Math.imul(we, er) | 0;
        var Sr = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (Sr >>> 26) | 0, Sr &= 67108863, M = Math.imul(C, je), x = Math.imul(C, Ge), x = x + Math.imul(X, je) | 0, L = Math.imul(X, Ge), M = M + Math.imul(Oe, Qe) | 0, x = x + Math.imul(Oe, er) | 0, x = x + Math.imul(j, Qe) | 0, L = L + Math.imul(j, er) | 0;
        var H = (w + M | 0) + ((x & 8191) << 13) | 0;
        w = (L + (x >>> 13) | 0) + (H >>> 26) | 0, H &= 67108863, M = Math.imul(C, Qe), x = Math.imul(C, er), x = x + Math.imul(X, Qe) | 0, L = Math.imul(X, er);
        var Z = (w + M | 0) + ((x & 8191) << 13) | 0;
        return w = (L + (x >>> 13) | 0) + (Z >>> 26) | 0, Z &= 67108863, R[0] = fr, R[1] = ur, R[2] = cr, R[3] = nr, R[4] = hr, R[5] = dr, R[6] = lr, R[7] = pr, R[8] = vr, R[9] = br, R[10] = yr, R[11] = gr, R[12] = wr, R[13] = rr, R[14] = _r, R[15] = xr, R[16] = Sr, R[17] = H, R[18] = Z, w !== 0 && (R[19] = w, A.length++), A;
      };
      Math.imul || (S = E);
      function O(g, l, _) {
        _.negative = l.negative ^ g.negative, _.length = g.length + l.length;
        for (var A = 0, q = 0, P = 0; P < _.length - 1; P++) {
          var R = q;
          q = 0;
          for (var w = A & 67108863, M = Math.min(P, l.length - 1), x = Math.max(0, P - g.length + 1); x <= M; x++) {
            var L = P - x, K = g.words[L] | 0, Q = l.words[x] | 0, U = K * Q, N = U & 67108863;
            R = R + (U / 67108864 | 0) | 0, N = N + w | 0, w = N & 67108863, R = R + (N >>> 26) | 0, q += R >>> 26, R &= 67108863;
          }
          _.words[P] = w, A = R, R = q;
        }
        return A !== 0 ? _.words[P] = A : _.length--, _._strip();
      }
      function D(g, l, _) {
        return O(g, l, _);
      }
      r.prototype.mulTo = function(l, _) {
        var A, q = this.length + l.length;
        return this.length === 10 && l.length === 10 ? A = S(this, l, _) : q < 63 ? A = E(this, l, _) : q < 1024 ? A = O(this, l, _) : A = D(this, l, _), A;
      }, r.prototype.mul = function(l) {
        var _ = new r(null);
        return _.words = new Array(this.length + l.length), this.mulTo(l, _);
      }, r.prototype.mulf = function(l) {
        var _ = new r(null);
        return _.words = new Array(this.length + l.length), D(this, l, _);
      }, r.prototype.imul = function(l) {
        return this.clone().mulTo(l, this);
      }, r.prototype.imuln = function(l) {
        var _ = l < 0;
        _ && (l = -l), f(typeof l == "number"), f(l < 67108864);
        for (var A = 0, q = 0; q < this.length; q++) {
          var P = (this.words[q] | 0) * l, R = (P & 67108863) + (A & 67108863);
          A >>= 26, A += P / 67108864 | 0, A += R >>> 26, this.words[q] = R & 67108863;
        }
        return A !== 0 && (this.words[q] = A, this.length++), this.length = l === 0 ? 1 : this.length, _ ? this.ineg() : this;
      }, r.prototype.muln = function(l) {
        return this.clone().imuln(l);
      }, r.prototype.sqr = function() {
        return this.mul(this);
      }, r.prototype.isqr = function() {
        return this.imul(this.clone());
      }, r.prototype.pow = function(l) {
        var _ = B(l);
        if (_.length === 0) return new r(1);
        for (var A = this, q = 0; q < _.length && _[q] === 0; q++, A = A.sqr())
          ;
        if (++q < _.length)
          for (var P = A.sqr(); q < _.length; q++, P = P.sqr())
            _[q] !== 0 && (A = A.mul(P));
        return A;
      }, r.prototype.iushln = function(l) {
        f(typeof l == "number" && l >= 0);
        var _ = l % 26, A = (l - _) / 26, q = 67108863 >>> 26 - _ << 26 - _, P;
        if (_ !== 0) {
          var R = 0;
          for (P = 0; P < this.length; P++) {
            var w = this.words[P] & q, M = (this.words[P] | 0) - w << _;
            this.words[P] = M | R, R = w >>> 26 - _;
          }
          R && (this.words[P] = R, this.length++);
        }
        if (A !== 0) {
          for (P = this.length - 1; P >= 0; P--)
            this.words[P + A] = this.words[P];
          for (P = 0; P < A; P++)
            this.words[P] = 0;
          this.length += A;
        }
        return this._strip();
      }, r.prototype.ishln = function(l) {
        return f(this.negative === 0), this.iushln(l);
      }, r.prototype.iushrn = function(l, _, A) {
        f(typeof l == "number" && l >= 0);
        var q;
        _ ? q = (_ - _ % 26) / 26 : q = 0;
        var P = l % 26, R = Math.min((l - P) / 26, this.length), w = 67108863 ^ 67108863 >>> P << P, M = A;
        if (q -= R, q = Math.max(0, q), M) {
          for (var x = 0; x < R; x++)
            M.words[x] = this.words[x];
          M.length = R;
        }
        if (R !== 0) if (this.length > R)
          for (this.length -= R, x = 0; x < this.length; x++)
            this.words[x] = this.words[x + R];
        else
          this.words[0] = 0, this.length = 1;
        var L = 0;
        for (x = this.length - 1; x >= 0 && (L !== 0 || x >= q); x--) {
          var K = this.words[x] | 0;
          this.words[x] = L << 26 - P | K >>> P, L = K & w;
        }
        return M && L !== 0 && (M.words[M.length++] = L), this.length === 0 && (this.words[0] = 0, this.length = 1), this._strip();
      }, r.prototype.ishrn = function(l, _, A) {
        return f(this.negative === 0), this.iushrn(l, _, A);
      }, r.prototype.shln = function(l) {
        return this.clone().ishln(l);
      }, r.prototype.ushln = function(l) {
        return this.clone().iushln(l);
      }, r.prototype.shrn = function(l) {
        return this.clone().ishrn(l);
      }, r.prototype.ushrn = function(l) {
        return this.clone().iushrn(l);
      }, r.prototype.testn = function(l) {
        f(typeof l == "number" && l >= 0);
        var _ = l % 26, A = (l - _) / 26, q = 1 << _;
        if (this.length <= A) return !1;
        var P = this.words[A];
        return !!(P & q);
      }, r.prototype.imaskn = function(l) {
        f(typeof l == "number" && l >= 0);
        var _ = l % 26, A = (l - _) / 26;
        if (f(this.negative === 0, "imaskn works only with positive numbers"), this.length <= A)
          return this;
        if (_ !== 0 && A++, this.length = Math.min(A, this.length), _ !== 0) {
          var q = 67108863 ^ 67108863 >>> _ << _;
          this.words[this.length - 1] &= q;
        }
        return this.length === 0 && (this.words[0] = 0, this.length = 1), this._strip();
      }, r.prototype.maskn = function(l) {
        return this.clone().imaskn(l);
      }, r.prototype.iaddn = function(l) {
        return f(typeof l == "number"), f(l < 67108864), l < 0 ? this.isubn(-l) : this.negative !== 0 ? this.length === 1 && (this.words[0] | 0) <= l ? (this.words[0] = l - (this.words[0] | 0), this.negative = 0, this) : (this.negative = 0, this.isubn(l), this.negative = 1, this) : this._iaddn(l);
      }, r.prototype._iaddn = function(l) {
        this.words[0] += l;
        for (var _ = 0; _ < this.length && this.words[_] >= 67108864; _++)
          this.words[_] -= 67108864, _ === this.length - 1 ? this.words[_ + 1] = 1 : this.words[_ + 1]++;
        return this.length = Math.max(this.length, _ + 1), this;
      }, r.prototype.isubn = function(l) {
        if (f(typeof l == "number"), f(l < 67108864), l < 0) return this.iaddn(-l);
        if (this.negative !== 0)
          return this.negative = 0, this.iaddn(l), this.negative = 1, this;
        if (this.words[0] -= l, this.length === 1 && this.words[0] < 0)
          this.words[0] = -this.words[0], this.negative = 1;
        else
          for (var _ = 0; _ < this.length && this.words[_] < 0; _++)
            this.words[_] += 67108864, this.words[_ + 1] -= 1;
        return this._strip();
      }, r.prototype.addn = function(l) {
        return this.clone().iaddn(l);
      }, r.prototype.subn = function(l) {
        return this.clone().isubn(l);
      }, r.prototype.iabs = function() {
        return this.negative = 0, this;
      }, r.prototype.abs = function() {
        return this.clone().iabs();
      }, r.prototype._ishlnsubmul = function(l, _, A) {
        var q = l.length + A, P;
        this._expand(q);
        var R, w = 0;
        for (P = 0; P < l.length; P++) {
          R = (this.words[P + A] | 0) + w;
          var M = (l.words[P] | 0) * _;
          R -= M & 67108863, w = (R >> 26) - (M / 67108864 | 0), this.words[P + A] = R & 67108863;
        }
        for (; P < this.length - A; P++)
          R = (this.words[P + A] | 0) + w, w = R >> 26, this.words[P + A] = R & 67108863;
        if (w === 0) return this._strip();
        for (f(w === -1), w = 0, P = 0; P < this.length; P++)
          R = -(this.words[P] | 0) + w, w = R >> 26, this.words[P] = R & 67108863;
        return this.negative = 1, this._strip();
      }, r.prototype._wordDiv = function(l, _) {
        var A = this.length - l.length, q = this.clone(), P = l, R = P.words[P.length - 1] | 0, w = this._countBits(R);
        A = 26 - w, A !== 0 && (P = P.ushln(A), q.iushln(A), R = P.words[P.length - 1] | 0);
        var M = q.length - P.length, x;
        if (_ !== "mod") {
          x = new r(null), x.length = M + 1, x.words = new Array(x.length);
          for (var L = 0; L < x.length; L++)
            x.words[L] = 0;
        }
        var K = q.clone()._ishlnsubmul(P, 1, M);
        K.negative === 0 && (q = K, x && (x.words[M] = 1));
        for (var Q = M - 1; Q >= 0; Q--) {
          var U = (q.words[P.length + Q] | 0) * 67108864 + (q.words[P.length + Q - 1] | 0);
          for (U = Math.min(U / R | 0, 67108863), q._ishlnsubmul(P, U, Q); q.negative !== 0; )
            U--, q.negative = 0, q._ishlnsubmul(P, 1, Q), q.isZero() || (q.negative ^= 1);
          x && (x.words[Q] = U);
        }
        return x && x._strip(), q._strip(), _ !== "div" && A !== 0 && q.iushrn(A), {
          div: x || null,
          mod: q
        };
      }, r.prototype.divmod = function(l, _, A) {
        if (f(!l.isZero()), this.isZero())
          return {
            div: new r(0),
            mod: new r(0)
          };
        var q, P, R;
        return this.negative !== 0 && l.negative === 0 ? (R = this.neg().divmod(l, _), _ !== "mod" && (q = R.div.neg()), _ !== "div" && (P = R.mod.neg(), A && P.negative !== 0 && P.iadd(l)), {
          div: q,
          mod: P
        }) : this.negative === 0 && l.negative !== 0 ? (R = this.divmod(l.neg(), _), _ !== "mod" && (q = R.div.neg()), {
          div: q,
          mod: R.mod
        }) : (this.negative & l.negative) !== 0 ? (R = this.neg().divmod(l.neg(), _), _ !== "div" && (P = R.mod.neg(), A && P.negative !== 0 && P.isub(l)), {
          div: R.div,
          mod: P
        }) : l.length > this.length || this.cmp(l) < 0 ? {
          div: new r(0),
          mod: this
        } : l.length === 1 ? _ === "div" ? {
          div: this.divn(l.words[0]),
          mod: null
        } : _ === "mod" ? {
          div: null,
          mod: new r(this.modrn(l.words[0]))
        } : {
          div: this.divn(l.words[0]),
          mod: new r(this.modrn(l.words[0]))
        } : this._wordDiv(l, _);
      }, r.prototype.div = function(l) {
        return this.divmod(l, "div", !1).div;
      }, r.prototype.mod = function(l) {
        return this.divmod(l, "mod", !1).mod;
      }, r.prototype.umod = function(l) {
        return this.divmod(l, "mod", !0).mod;
      }, r.prototype.divRound = function(l) {
        var _ = this.divmod(l);
        if (_.mod.isZero()) return _.div;
        var A = _.div.negative !== 0 ? _.mod.isub(l) : _.mod, q = l.ushrn(1), P = l.andln(1), R = A.cmp(q);
        return R < 0 || P === 1 && R === 0 ? _.div : _.div.negative !== 0 ? _.div.isubn(1) : _.div.iaddn(1);
      }, r.prototype.modrn = function(l) {
        var _ = l < 0;
        _ && (l = -l), f(l <= 67108863);
        for (var A = (1 << 26) % l, q = 0, P = this.length - 1; P >= 0; P--)
          q = (A * q + (this.words[P] | 0)) % l;
        return _ ? -q : q;
      }, r.prototype.modn = function(l) {
        return this.modrn(l);
      }, r.prototype.idivn = function(l) {
        var _ = l < 0;
        _ && (l = -l), f(l <= 67108863);
        for (var A = 0, q = this.length - 1; q >= 0; q--) {
          var P = (this.words[q] | 0) + A * 67108864;
          this.words[q] = P / l | 0, A = P % l;
        }
        return this._strip(), _ ? this.ineg() : this;
      }, r.prototype.divn = function(l) {
        return this.clone().idivn(l);
      }, r.prototype.egcd = function(l) {
        f(l.negative === 0), f(!l.isZero());
        var _ = this, A = l.clone();
        _.negative !== 0 ? _ = _.umod(l) : _ = _.clone();
        for (var q = new r(1), P = new r(0), R = new r(0), w = new r(1), M = 0; _.isEven() && A.isEven(); )
          _.iushrn(1), A.iushrn(1), ++M;
        for (var x = A.clone(), L = _.clone(); !_.isZero(); ) {
          for (var K = 0, Q = 1; (_.words[0] & Q) === 0 && K < 26; ++K, Q <<= 1) ;
          if (K > 0)
            for (_.iushrn(K); K-- > 0; )
              (q.isOdd() || P.isOdd()) && (q.iadd(x), P.isub(L)), q.iushrn(1), P.iushrn(1);
          for (var U = 0, N = 1; (A.words[0] & N) === 0 && U < 26; ++U, N <<= 1) ;
          if (U > 0)
            for (A.iushrn(U); U-- > 0; )
              (R.isOdd() || w.isOdd()) && (R.iadd(x), w.isub(L)), R.iushrn(1), w.iushrn(1);
          _.cmp(A) >= 0 ? (_.isub(A), q.isub(R), P.isub(w)) : (A.isub(_), R.isub(q), w.isub(P));
        }
        return {
          a: R,
          b: w,
          gcd: A.iushln(M)
        };
      }, r.prototype._invmp = function(l) {
        f(l.negative === 0), f(!l.isZero());
        var _ = this, A = l.clone();
        _.negative !== 0 ? _ = _.umod(l) : _ = _.clone();
        for (var q = new r(1), P = new r(0), R = A.clone(); _.cmpn(1) > 0 && A.cmpn(1) > 0; ) {
          for (var w = 0, M = 1; (_.words[0] & M) === 0 && w < 26; ++w, M <<= 1) ;
          if (w > 0)
            for (_.iushrn(w); w-- > 0; )
              q.isOdd() && q.iadd(R), q.iushrn(1);
          for (var x = 0, L = 1; (A.words[0] & L) === 0 && x < 26; ++x, L <<= 1) ;
          if (x > 0)
            for (A.iushrn(x); x-- > 0; )
              P.isOdd() && P.iadd(R), P.iushrn(1);
          _.cmp(A) >= 0 ? (_.isub(A), q.isub(P)) : (A.isub(_), P.isub(q));
        }
        var K;
        return _.cmpn(1) === 0 ? K = q : K = P, K.cmpn(0) < 0 && K.iadd(l), K;
      }, r.prototype.gcd = function(l) {
        if (this.isZero()) return l.abs();
        if (l.isZero()) return this.abs();
        var _ = this.clone(), A = l.clone();
        _.negative = 0, A.negative = 0;
        for (var q = 0; _.isEven() && A.isEven(); q++)
          _.iushrn(1), A.iushrn(1);
        do {
          for (; _.isEven(); )
            _.iushrn(1);
          for (; A.isEven(); )
            A.iushrn(1);
          var P = _.cmp(A);
          if (P < 0) {
            var R = _;
            _ = A, A = R;
          } else if (P === 0 || A.cmpn(1) === 0)
            break;
          _.isub(A);
        } while (!0);
        return A.iushln(q);
      }, r.prototype.invm = function(l) {
        return this.egcd(l).a.umod(l);
      }, r.prototype.isEven = function() {
        return (this.words[0] & 1) === 0;
      }, r.prototype.isOdd = function() {
        return (this.words[0] & 1) === 1;
      }, r.prototype.andln = function(l) {
        return this.words[0] & l;
      }, r.prototype.bincn = function(l) {
        f(typeof l == "number");
        var _ = l % 26, A = (l - _) / 26, q = 1 << _;
        if (this.length <= A)
          return this._expand(A + 1), this.words[A] |= q, this;
        for (var P = q, R = A; P !== 0 && R < this.length; R++) {
          var w = this.words[R] | 0;
          w += P, P = w >>> 26, w &= 67108863, this.words[R] = w;
        }
        return P !== 0 && (this.words[R] = P, this.length++), this;
      }, r.prototype.isZero = function() {
        return this.length === 1 && this.words[0] === 0;
      }, r.prototype.cmpn = function(l) {
        var _ = l < 0;
        if (this.negative !== 0 && !_) return -1;
        if (this.negative === 0 && _) return 1;
        this._strip();
        var A;
        if (this.length > 1)
          A = 1;
        else {
          _ && (l = -l), f(l <= 67108863, "Number is too big");
          var q = this.words[0] | 0;
          A = q === l ? 0 : q < l ? -1 : 1;
        }
        return this.negative !== 0 ? -A | 0 : A;
      }, r.prototype.cmp = function(l) {
        if (this.negative !== 0 && l.negative === 0) return -1;
        if (this.negative === 0 && l.negative !== 0) return 1;
        var _ = this.ucmp(l);
        return this.negative !== 0 ? -_ | 0 : _;
      }, r.prototype.ucmp = function(l) {
        if (this.length > l.length) return 1;
        if (this.length < l.length) return -1;
        for (var _ = 0, A = this.length - 1; A >= 0; A--) {
          var q = this.words[A] | 0, P = l.words[A] | 0;
          if (q !== P) {
            q < P ? _ = -1 : q > P && (_ = 1);
            break;
          }
        }
        return _;
      }, r.prototype.gtn = function(l) {
        return this.cmpn(l) === 1;
      }, r.prototype.gt = function(l) {
        return this.cmp(l) === 1;
      }, r.prototype.gten = function(l) {
        return this.cmpn(l) >= 0;
      }, r.prototype.gte = function(l) {
        return this.cmp(l) >= 0;
      }, r.prototype.ltn = function(l) {
        return this.cmpn(l) === -1;
      }, r.prototype.lt = function(l) {
        return this.cmp(l) === -1;
      }, r.prototype.lten = function(l) {
        return this.cmpn(l) <= 0;
      }, r.prototype.lte = function(l) {
        return this.cmp(l) <= 0;
      }, r.prototype.eqn = function(l) {
        return this.cmpn(l) === 0;
      }, r.prototype.eq = function(l) {
        return this.cmp(l) === 0;
      }, r.red = function(l) {
        return new Y(l);
      }, r.prototype.toRed = function(l) {
        return f(!this.red, "Already a number in reduction context"), f(this.negative === 0, "red works only with positives"), l.convertTo(this)._forceRed(l);
      }, r.prototype.fromRed = function() {
        return f(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this);
      }, r.prototype._forceRed = function(l) {
        return this.red = l, this;
      }, r.prototype.forceRed = function(l) {
        return f(!this.red, "Already a number in reduction context"), this._forceRed(l);
      }, r.prototype.redAdd = function(l) {
        return f(this.red, "redAdd works only with red numbers"), this.red.add(this, l);
      }, r.prototype.redIAdd = function(l) {
        return f(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, l);
      }, r.prototype.redSub = function(l) {
        return f(this.red, "redSub works only with red numbers"), this.red.sub(this, l);
      }, r.prototype.redISub = function(l) {
        return f(this.red, "redISub works only with red numbers"), this.red.isub(this, l);
      }, r.prototype.redShl = function(l) {
        return f(this.red, "redShl works only with red numbers"), this.red.shl(this, l);
      }, r.prototype.redMul = function(l) {
        return f(this.red, "redMul works only with red numbers"), this.red._verify2(this, l), this.red.mul(this, l);
      }, r.prototype.redIMul = function(l) {
        return f(this.red, "redMul works only with red numbers"), this.red._verify2(this, l), this.red.imul(this, l);
      }, r.prototype.redSqr = function() {
        return f(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this);
      }, r.prototype.redISqr = function() {
        return f(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this);
      }, r.prototype.redSqrt = function() {
        return f(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this);
      }, r.prototype.redInvm = function() {
        return f(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this);
      }, r.prototype.redNeg = function() {
        return f(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this);
      }, r.prototype.redPow = function(l) {
        return f(this.red && !l.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, l);
      };
      var $ = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
      };
      function V(g, l) {
        this.name = g, this.p = new r(l, 16), this.n = this.p.bitLength(), this.k = new r(1).iushln(this.n).isub(this.p), this.tmp = this._tmp();
      }
      V.prototype._tmp = function() {
        var l = new r(null);
        return l.words = new Array(Math.ceil(this.n / 13)), l;
      }, V.prototype.ireduce = function(l) {
        var _ = l, A;
        do
          this.split(_, this.tmp), _ = this.imulK(_), _ = _.iadd(this.tmp), A = _.bitLength();
        while (A > this.n);
        var q = A < this.n ? -1 : _.ucmp(this.p);
        return q === 0 ? (_.words[0] = 0, _.length = 1) : q > 0 ? _.isub(this.p) : _.strip !== void 0 ? _.strip() : _._strip(), _;
      }, V.prototype.split = function(l, _) {
        l.iushrn(this.n, 0, _);
      }, V.prototype.imulK = function(l) {
        return l.imul(this.k);
      };
      function J() {
        V.call(
          this,
          "k256",
          "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
        );
      }
      p(J, V), J.prototype.split = function(l, _) {
        for (var A = 4194303, q = Math.min(l.length, 9), P = 0; P < q; P++)
          _.words[P] = l.words[P];
        if (_.length = q, l.length <= 9) {
          l.words[0] = 0, l.length = 1;
          return;
        }
        var R = l.words[9];
        for (_.words[_.length++] = R & A, P = 10; P < l.length; P++) {
          var w = l.words[P] | 0;
          l.words[P - 10] = (w & A) << 4 | R >>> 22, R = w;
        }
        R >>>= 22, l.words[P - 10] = R, R === 0 && l.length > 10 ? l.length -= 10 : l.length -= 9;
      }, J.prototype.imulK = function(l) {
        l.words[l.length] = 0, l.words[l.length + 1] = 0, l.length += 2;
        for (var _ = 0, A = 0; A < l.length; A++) {
          var q = l.words[A] | 0;
          _ += q * 977, l.words[A] = _ & 67108863, _ = q * 64 + (_ / 67108864 | 0);
        }
        return l.words[l.length - 1] === 0 && (l.length--, l.words[l.length - 1] === 0 && l.length--), l;
      };
      function ie() {
        V.call(
          this,
          "p224",
          "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
        );
      }
      p(ie, V);
      function ne() {
        V.call(
          this,
          "p192",
          "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
        );
      }
      p(ne, V);
      function le() {
        V.call(
          this,
          "25519",
          "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
        );
      }
      p(le, V), le.prototype.imulK = function(l) {
        for (var _ = 0, A = 0; A < l.length; A++) {
          var q = (l.words[A] | 0) * 19 + _, P = q & 67108863;
          q >>>= 26, l.words[A] = P, _ = q;
        }
        return _ !== 0 && (l.words[l.length++] = _), l;
      }, r._prime = function(l) {
        if ($[l]) return $[l];
        var _;
        if (l === "k256")
          _ = new J();
        else if (l === "p224")
          _ = new ie();
        else if (l === "p192")
          _ = new ne();
        else if (l === "p25519")
          _ = new le();
        else
          throw new Error("Unknown prime " + l);
        return $[l] = _, _;
      };
      function Y(g) {
        if (typeof g == "string") {
          var l = r._prime(g);
          this.m = l.p, this.prime = l;
        } else
          f(g.gtn(1), "modulus must be greater than 1"), this.m = g, this.prime = null;
      }
      Y.prototype._verify1 = function(l) {
        f(l.negative === 0, "red works only with positives"), f(l.red, "red works only with red numbers");
      }, Y.prototype._verify2 = function(l, _) {
        f((l.negative | _.negative) === 0, "red works only with positives"), f(
          l.red && l.red === _.red,
          "red works only with red numbers"
        );
      }, Y.prototype.imod = function(l) {
        return this.prime ? this.prime.ireduce(l)._forceRed(this) : (e(l, l.umod(this.m)._forceRed(this)), l);
      }, Y.prototype.neg = function(l) {
        return l.isZero() ? l.clone() : this.m.sub(l)._forceRed(this);
      }, Y.prototype.add = function(l, _) {
        this._verify2(l, _);
        var A = l.add(_);
        return A.cmp(this.m) >= 0 && A.isub(this.m), A._forceRed(this);
      }, Y.prototype.iadd = function(l, _) {
        this._verify2(l, _);
        var A = l.iadd(_);
        return A.cmp(this.m) >= 0 && A.isub(this.m), A;
      }, Y.prototype.sub = function(l, _) {
        this._verify2(l, _);
        var A = l.sub(_);
        return A.cmpn(0) < 0 && A.iadd(this.m), A._forceRed(this);
      }, Y.prototype.isub = function(l, _) {
        this._verify2(l, _);
        var A = l.isub(_);
        return A.cmpn(0) < 0 && A.iadd(this.m), A;
      }, Y.prototype.shl = function(l, _) {
        return this._verify1(l), this.imod(l.ushln(_));
      }, Y.prototype.imul = function(l, _) {
        return this._verify2(l, _), this.imod(l.imul(_));
      }, Y.prototype.mul = function(l, _) {
        return this._verify2(l, _), this.imod(l.mul(_));
      }, Y.prototype.isqr = function(l) {
        return this.imul(l, l.clone());
      }, Y.prototype.sqr = function(l) {
        return this.mul(l, l);
      }, Y.prototype.sqrt = function(l) {
        if (l.isZero()) return l.clone();
        var _ = this.m.andln(3);
        if (f(_ % 2 === 1), _ === 3) {
          var A = this.m.add(new r(1)).iushrn(2);
          return this.pow(l, A);
        }
        for (var q = this.m.subn(1), P = 0; !q.isZero() && q.andln(1) === 0; )
          P++, q.iushrn(1);
        f(!q.isZero());
        var R = new r(1).toRed(this), w = R.redNeg(), M = this.m.subn(1).iushrn(1), x = this.m.bitLength();
        for (x = new r(2 * x * x).toRed(this); this.pow(x, M).cmp(w) !== 0; )
          x.redIAdd(w);
        for (var L = this.pow(x, q), K = this.pow(l, q.addn(1).iushrn(1)), Q = this.pow(l, q), U = P; Q.cmp(R) !== 0; ) {
          for (var N = Q, F = 0; N.cmp(R) !== 0; F++)
            N = N.redSqr();
          f(F < U);
          var ee = this.pow(L, new r(1).iushln(U - F - 1));
          K = K.redMul(ee), L = ee.redSqr(), Q = Q.redMul(L), U = F;
        }
        return K;
      }, Y.prototype.invm = function(l) {
        var _ = l._invmp(this.m);
        return _.negative !== 0 ? (_.negative = 0, this.imod(_).redNeg()) : this.imod(_);
      }, Y.prototype.pow = function(l, _) {
        if (_.isZero()) return new r(1).toRed(this);
        if (_.cmpn(1) === 0) return l.clone();
        var A = 4, q = new Array(1 << A);
        q[0] = new r(1).toRed(this), q[1] = l;
        for (var P = 2; P < q.length; P++)
          q[P] = this.mul(q[P - 1], l);
        var R = q[0], w = 0, M = 0, x = _.bitLength() % 26;
        for (x === 0 && (x = 26), P = _.length - 1; P >= 0; P--) {
          for (var L = _.words[P], K = x - 1; K >= 0; K--) {
            var Q = L >> K & 1;
            if (R !== q[0] && (R = this.sqr(R)), Q === 0 && w === 0) {
              M = 0;
              continue;
            }
            w <<= 1, w |= Q, M++, !(M !== A && (P !== 0 || K !== 0)) && (R = this.mul(R, q[w]), M = 0, w = 0);
          }
          x = 26;
        }
        return R;
      }, Y.prototype.convertTo = function(l) {
        var _ = l.umod(this.m);
        return _ === l ? _.clone() : _;
      }, Y.prototype.convertFrom = function(l) {
        var _ = l.clone();
        return _.red = null, _;
      }, r.mont = function(l) {
        return new b(l);
      };
      function b(g) {
        Y.call(this, g), this.shift = this.m.bitLength(), this.shift % 26 !== 0 && (this.shift += 26 - this.shift % 26), this.r = new r(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv);
      }
      p(b, Y), b.prototype.convertTo = function(l) {
        return this.imod(l.ushln(this.shift));
      }, b.prototype.convertFrom = function(l) {
        var _ = this.imod(l.mul(this.rinv));
        return _.red = null, _;
      }, b.prototype.imul = function(l, _) {
        if (l.isZero() || _.isZero())
          return l.words[0] = 0, l.length = 1, l;
        var A = l.imul(_), q = A.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), P = A.isub(q).iushrn(this.shift), R = P;
        return P.cmp(this.m) >= 0 ? R = P.isub(this.m) : P.cmpn(0) < 0 && (R = P.iadd(this.m)), R._forceRed(this);
      }, b.prototype.mul = function(l, _) {
        if (l.isZero() || _.isZero()) return new r(0)._forceRed(this);
        var A = l.mul(_), q = A.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), P = A.isub(q).iushrn(this.shift), R = P;
        return P.cmp(this.m) >= 0 ? R = P.isub(this.m) : P.cmpn(0) < 0 && (R = P.iadd(this.m)), R._forceRed(this);
      }, b.prototype.invm = function(l) {
        var _ = this.imod(l._invmp(this.m).mul(this.r2));
        return _._forceRed(this);
      };
    })(c, bn);
  })(bn$1)), bn$1.exports;
}
var browserifyRsa, hasRequiredBrowserifyRsa;
function requireBrowserifyRsa() {
  if (hasRequiredBrowserifyRsa) return browserifyRsa;
  hasRequiredBrowserifyRsa = 1;
  var c = requireBn(), a = requireBrowser$b(), h = requireSafeBuffer$1().Buffer;
  function f(u) {
    var o = u.modulus.byteLength(), t;
    do
      t = new c(a(o));
    while (t.cmp(u.modulus) >= 0 || !t.umod(u.prime1) || !t.umod(u.prime2));
    return t;
  }
  function p(u) {
    var o = f(u), t = o.toRed(c.mont(u.modulus)).redPow(new c(u.publicExponent)).fromRed();
    return { blinder: t, unblinder: o.invm(u.modulus) };
  }
  function r(u, o) {
    var t = p(o), n = o.modulus.byteLength(), e = new c(u).mul(t.blinder).umod(o.modulus), s = e.toRed(c.mont(o.prime1)), d = e.toRed(c.mont(o.prime2)), v = o.coefficient, y = o.prime1, m = o.prime2, B = s.redPow(o.exponent1).fromRed(), E = d.redPow(o.exponent2).fromRed(), S = B.isub(E).imul(v).umod(y).imul(m);
    return E.iadd(S).imul(t.unblinder).umod(o.modulus).toArrayLike(h, "be", n);
  }
  return r.getr = f, browserifyRsa = r, browserifyRsa;
}
var elliptic = {};
const version = "6.6.1", require$$0 = {
  version
};
var utils$2 = {}, utils$1 = {}, hasRequiredUtils$3;
function requireUtils$3() {
  return hasRequiredUtils$3 || (hasRequiredUtils$3 = 1, (function(c) {
    var a = c;
    function h(r, u) {
      if (Array.isArray(r))
        return r.slice();
      if (!r)
        return [];
      var o = [];
      if (typeof r != "string") {
        for (var t = 0; t < r.length; t++)
          o[t] = r[t] | 0;
        return o;
      }
      if (u === "hex") {
        r = r.replace(/[^a-z0-9]+/ig, ""), r.length % 2 !== 0 && (r = "0" + r);
        for (var t = 0; t < r.length; t += 2)
          o.push(parseInt(r[t] + r[t + 1], 16));
      } else
        for (var t = 0; t < r.length; t++) {
          var n = r.charCodeAt(t), e = n >> 8, s = n & 255;
          e ? o.push(e, s) : o.push(s);
        }
      return o;
    }
    a.toArray = h;
    function f(r) {
      return r.length === 1 ? "0" + r : r;
    }
    a.zero2 = f;
    function p(r) {
      for (var u = "", o = 0; o < r.length; o++)
        u += f(r[o].toString(16));
      return u;
    }
    a.toHex = p, a.encode = function(u, o) {
      return o === "hex" ? p(u) : u;
    };
  })(utils$1)), utils$1;
}
var hasRequiredUtils$2;
function requireUtils$2() {
  return hasRequiredUtils$2 || (hasRequiredUtils$2 = 1, (function(c) {
    var a = c, h = requireBn$1(), f = requireMinimalisticAssert(), p = requireUtils$3();
    a.assert = f, a.toArray = p.toArray, a.zero2 = p.zero2, a.toHex = p.toHex, a.encode = p.encode;
    function r(e, s, d) {
      var v = new Array(Math.max(e.bitLength(), d) + 1), y;
      for (y = 0; y < v.length; y += 1)
        v[y] = 0;
      var m = 1 << s + 1, B = e.clone();
      for (y = 0; y < v.length; y++) {
        var E, S = B.andln(m - 1);
        B.isOdd() ? (S > (m >> 1) - 1 ? E = (m >> 1) - S : E = S, B.isubn(E)) : E = 0, v[y] = E, B.iushrn(1);
      }
      return v;
    }
    a.getNAF = r;
    function u(e, s) {
      var d = [
        [],
        []
      ];
      e = e.clone(), s = s.clone();
      for (var v = 0, y = 0, m; e.cmpn(-v) > 0 || s.cmpn(-y) > 0; ) {
        var B = e.andln(3) + v & 3, E = s.andln(3) + y & 3;
        B === 3 && (B = -1), E === 3 && (E = -1);
        var S;
        (B & 1) === 0 ? S = 0 : (m = e.andln(7) + v & 7, (m === 3 || m === 5) && E === 2 ? S = -B : S = B), d[0].push(S);
        var O;
        (E & 1) === 0 ? O = 0 : (m = s.andln(7) + y & 7, (m === 3 || m === 5) && B === 2 ? O = -E : O = E), d[1].push(O), 2 * v === S + 1 && (v = 1 - v), 2 * y === O + 1 && (y = 1 - y), e.iushrn(1), s.iushrn(1);
      }
      return d;
    }
    a.getJSF = u;
    function o(e, s, d) {
      var v = "_" + s;
      e.prototype[s] = function() {
        return this[v] !== void 0 ? this[v] : this[v] = d.call(this);
      };
    }
    a.cachedProperty = o;
    function t(e) {
      return typeof e == "string" ? a.toArray(e, "hex") : e;
    }
    a.parseBytes = t;
    function n(e) {
      return new h(e, "hex", "le");
    }
    a.intFromLE = n;
  })(utils$2)), utils$2;
}
var curve = {}, base$1, hasRequiredBase$1;
function requireBase$1() {
  if (hasRequiredBase$1) return base$1;
  hasRequiredBase$1 = 1;
  var c = requireBn$1(), a = requireUtils$2(), h = a.getNAF, f = a.getJSF, p = a.assert;
  function r(o, t) {
    this.type = o, this.p = new c(t.p, 16), this.red = t.prime ? c.red(t.prime) : c.mont(this.p), this.zero = new c(0).toRed(this.red), this.one = new c(1).toRed(this.red), this.two = new c(2).toRed(this.red), this.n = t.n && new c(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
    var n = this.n && this.p.div(this.n);
    !n || n.cmpn(100) > 0 ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red));
  }
  base$1 = r, r.prototype.point = function() {
    throw new Error("Not implemented");
  }, r.prototype.validate = function() {
    throw new Error("Not implemented");
  }, r.prototype._fixedNafMul = function(t, n) {
    p(t.precomputed);
    var e = t._getDoubles(), s = h(n, 1, this._bitLength), d = (1 << e.step + 1) - (e.step % 2 === 0 ? 2 : 1);
    d /= 3;
    var v = [], y, m;
    for (y = 0; y < s.length; y += e.step) {
      m = 0;
      for (var B = y + e.step - 1; B >= y; B--)
        m = (m << 1) + s[B];
      v.push(m);
    }
    for (var E = this.jpoint(null, null, null), S = this.jpoint(null, null, null), O = d; O > 0; O--) {
      for (y = 0; y < v.length; y++)
        m = v[y], m === O ? S = S.mixedAdd(e.points[y]) : m === -O && (S = S.mixedAdd(e.points[y].neg()));
      E = E.add(S);
    }
    return E.toP();
  }, r.prototype._wnafMul = function(t, n) {
    var e = 4, s = t._getNAFPoints(e);
    e = s.wnd;
    for (var d = s.points, v = h(n, e, this._bitLength), y = this.jpoint(null, null, null), m = v.length - 1; m >= 0; m--) {
      for (var B = 0; m >= 0 && v[m] === 0; m--)
        B++;
      if (m >= 0 && B++, y = y.dblp(B), m < 0)
        break;
      var E = v[m];
      p(E !== 0), t.type === "affine" ? E > 0 ? y = y.mixedAdd(d[E - 1 >> 1]) : y = y.mixedAdd(d[-E - 1 >> 1].neg()) : E > 0 ? y = y.add(d[E - 1 >> 1]) : y = y.add(d[-E - 1 >> 1].neg());
    }
    return t.type === "affine" ? y.toP() : y;
  }, r.prototype._wnafMulAdd = function(t, n, e, s, d) {
    var v = this._wnafT1, y = this._wnafT2, m = this._wnafT3, B = 0, E, S, O;
    for (E = 0; E < s; E++) {
      O = n[E];
      var D = O._getNAFPoints(t);
      v[E] = D.wnd, y[E] = D.points;
    }
    for (E = s - 1; E >= 1; E -= 2) {
      var $ = E - 1, V = E;
      if (v[$] !== 1 || v[V] !== 1) {
        m[$] = h(e[$], v[$], this._bitLength), m[V] = h(e[V], v[V], this._bitLength), B = Math.max(m[$].length, B), B = Math.max(m[V].length, B);
        continue;
      }
      var J = [
        n[$],
        /* 1 */
        null,
        /* 3 */
        null,
        /* 5 */
        n[V]
        /* 7 */
      ];
      n[$].y.cmp(n[V].y) === 0 ? (J[1] = n[$].add(n[V]), J[2] = n[$].toJ().mixedAdd(n[V].neg())) : n[$].y.cmp(n[V].y.redNeg()) === 0 ? (J[1] = n[$].toJ().mixedAdd(n[V]), J[2] = n[$].add(n[V].neg())) : (J[1] = n[$].toJ().mixedAdd(n[V]), J[2] = n[$].toJ().mixedAdd(n[V].neg()));
      var ie = [
        -3,
        /* -1 -1 */
        -1,
        /* -1 0 */
        -5,
        /* -1 1 */
        -7,
        /* 0 -1 */
        0,
        /* 0 0 */
        7,
        /* 0 1 */
        5,
        /* 1 -1 */
        1,
        /* 1 0 */
        3
        /* 1 1 */
      ], ne = f(e[$], e[V]);
      for (B = Math.max(ne[0].length, B), m[$] = new Array(B), m[V] = new Array(B), S = 0; S < B; S++) {
        var le = ne[0][S] | 0, Y = ne[1][S] | 0;
        m[$][S] = ie[(le + 1) * 3 + (Y + 1)], m[V][S] = 0, y[$] = J;
      }
    }
    var b = this.jpoint(null, null, null), g = this._wnafT4;
    for (E = B; E >= 0; E--) {
      for (var l = 0; E >= 0; ) {
        var _ = !0;
        for (S = 0; S < s; S++)
          g[S] = m[S][E] | 0, g[S] !== 0 && (_ = !1);
        if (!_)
          break;
        l++, E--;
      }
      if (E >= 0 && l++, b = b.dblp(l), E < 0)
        break;
      for (S = 0; S < s; S++) {
        var A = g[S];
        A !== 0 && (A > 0 ? O = y[S][A - 1 >> 1] : A < 0 && (O = y[S][-A - 1 >> 1].neg()), O.type === "affine" ? b = b.mixedAdd(O) : b = b.add(O));
      }
    }
    for (E = 0; E < s; E++)
      y[E] = null;
    return d ? b : b.toP();
  };
  function u(o, t) {
    this.curve = o, this.type = t, this.precomputed = null;
  }
  return r.BasePoint = u, u.prototype.eq = function() {
    throw new Error("Not implemented");
  }, u.prototype.validate = function() {
    return this.curve.validate(this);
  }, r.prototype.decodePoint = function(t, n) {
    t = a.toArray(t, n);
    var e = this.p.byteLength();
    if ((t[0] === 4 || t[0] === 6 || t[0] === 7) && t.length - 1 === 2 * e) {
      t[0] === 6 ? p(t[t.length - 1] % 2 === 0) : t[0] === 7 && p(t[t.length - 1] % 2 === 1);
      var s = this.point(
        t.slice(1, 1 + e),
        t.slice(1 + e, 1 + 2 * e)
      );
      return s;
    } else if ((t[0] === 2 || t[0] === 3) && t.length - 1 === e)
      return this.pointFromX(t.slice(1, 1 + e), t[0] === 3);
    throw new Error("Unknown point format");
  }, u.prototype.encodeCompressed = function(t) {
    return this.encode(t, !0);
  }, u.prototype._encode = function(t) {
    var n = this.curve.p.byteLength(), e = this.getX().toArray("be", n);
    return t ? [this.getY().isEven() ? 2 : 3].concat(e) : [4].concat(e, this.getY().toArray("be", n));
  }, u.prototype.encode = function(t, n) {
    return a.encode(this._encode(n), t);
  }, u.prototype.precompute = function(t) {
    if (this.precomputed)
      return this;
    var n = {
      doubles: null,
      naf: null,
      beta: null
    };
    return n.naf = this._getNAFPoints(8), n.doubles = this._getDoubles(4, t), n.beta = this._getBeta(), this.precomputed = n, this;
  }, u.prototype._hasDoubles = function(t) {
    if (!this.precomputed)
      return !1;
    var n = this.precomputed.doubles;
    return n ? n.points.length >= Math.ceil((t.bitLength() + 1) / n.step) : !1;
  }, u.prototype._getDoubles = function(t, n) {
    if (this.precomputed && this.precomputed.doubles)
      return this.precomputed.doubles;
    for (var e = [this], s = this, d = 0; d < n; d += t) {
      for (var v = 0; v < t; v++)
        s = s.dbl();
      e.push(s);
    }
    return {
      step: t,
      points: e
    };
  }, u.prototype._getNAFPoints = function(t) {
    if (this.precomputed && this.precomputed.naf)
      return this.precomputed.naf;
    for (var n = [this], e = (1 << t) - 1, s = e === 1 ? null : this.dbl(), d = 1; d < e; d++)
      n[d] = n[d - 1].add(s);
    return {
      wnd: t,
      points: n
    };
  }, u.prototype._getBeta = function() {
    return null;
  }, u.prototype.dblp = function(t) {
    for (var n = this, e = 0; e < t; e++)
      n = n.dbl();
    return n;
  }, base$1;
}
var short, hasRequiredShort;
function requireShort() {
  if (hasRequiredShort) return short;
  hasRequiredShort = 1;
  var c = requireUtils$2(), a = requireBn$1(), h = requireInherits_browser(), f = requireBase$1(), p = c.assert;
  function r(t) {
    f.call(this, "short", t), this.a = new a(t.a, 16).toRed(this.red), this.b = new a(t.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = this.a.fromRed().cmpn(0) === 0, this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0, this.endo = this._getEndomorphism(t), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4);
  }
  h(r, f), short = r, r.prototype._getEndomorphism = function(n) {
    if (!(!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)) {
      var e, s;
      if (n.beta)
        e = new a(n.beta, 16).toRed(this.red);
      else {
        var d = this._getEndoRoots(this.p);
        e = d[0].cmp(d[1]) < 0 ? d[0] : d[1], e = e.toRed(this.red);
      }
      if (n.lambda)
        s = new a(n.lambda, 16);
      else {
        var v = this._getEndoRoots(this.n);
        this.g.mul(v[0]).x.cmp(this.g.x.redMul(e)) === 0 ? s = v[0] : (s = v[1], p(this.g.mul(s).x.cmp(this.g.x.redMul(e)) === 0));
      }
      var y;
      return n.basis ? y = n.basis.map(function(m) {
        return {
          a: new a(m.a, 16),
          b: new a(m.b, 16)
        };
      }) : y = this._getEndoBasis(s), {
        beta: e,
        lambda: s,
        basis: y
      };
    }
  }, r.prototype._getEndoRoots = function(n) {
    var e = n === this.p ? this.red : a.mont(n), s = new a(2).toRed(e).redInvm(), d = s.redNeg(), v = new a(3).toRed(e).redNeg().redSqrt().redMul(s), y = d.redAdd(v).fromRed(), m = d.redSub(v).fromRed();
    return [y, m];
  }, r.prototype._getEndoBasis = function(n) {
    for (var e = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), s = n, d = this.n.clone(), v = new a(1), y = new a(0), m = new a(0), B = new a(1), E, S, O, D, $, V, J, ie = 0, ne, le; s.cmpn(0) !== 0; ) {
      var Y = d.div(s);
      ne = d.sub(Y.mul(s)), le = m.sub(Y.mul(v));
      var b = B.sub(Y.mul(y));
      if (!O && ne.cmp(e) < 0)
        E = J.neg(), S = v, O = ne.neg(), D = le;
      else if (O && ++ie === 2)
        break;
      J = ne, d = s, s = ne, m = v, v = le, B = y, y = b;
    }
    $ = ne.neg(), V = le;
    var g = O.sqr().add(D.sqr()), l = $.sqr().add(V.sqr());
    return l.cmp(g) >= 0 && ($ = E, V = S), O.negative && (O = O.neg(), D = D.neg()), $.negative && ($ = $.neg(), V = V.neg()), [
      { a: O, b: D },
      { a: $, b: V }
    ];
  }, r.prototype._endoSplit = function(n) {
    var e = this.endo.basis, s = e[0], d = e[1], v = d.b.mul(n).divRound(this.n), y = s.b.neg().mul(n).divRound(this.n), m = v.mul(s.a), B = y.mul(d.a), E = v.mul(s.b), S = y.mul(d.b), O = n.sub(m).sub(B), D = E.add(S).neg();
    return { k1: O, k2: D };
  }, r.prototype.pointFromX = function(n, e) {
    n = new a(n, 16), n.red || (n = n.toRed(this.red));
    var s = n.redSqr().redMul(n).redIAdd(n.redMul(this.a)).redIAdd(this.b), d = s.redSqrt();
    if (d.redSqr().redSub(s).cmp(this.zero) !== 0)
      throw new Error("invalid point");
    var v = d.fromRed().isOdd();
    return (e && !v || !e && v) && (d = d.redNeg()), this.point(n, d);
  }, r.prototype.validate = function(n) {
    if (n.inf)
      return !0;
    var e = n.x, s = n.y, d = this.a.redMul(e), v = e.redSqr().redMul(e).redIAdd(d).redIAdd(this.b);
    return s.redSqr().redISub(v).cmpn(0) === 0;
  }, r.prototype._endoWnafMulAdd = function(n, e, s) {
    for (var d = this._endoWnafT1, v = this._endoWnafT2, y = 0; y < n.length; y++) {
      var m = this._endoSplit(e[y]), B = n[y], E = B._getBeta();
      m.k1.negative && (m.k1.ineg(), B = B.neg(!0)), m.k2.negative && (m.k2.ineg(), E = E.neg(!0)), d[y * 2] = B, d[y * 2 + 1] = E, v[y * 2] = m.k1, v[y * 2 + 1] = m.k2;
    }
    for (var S = this._wnafMulAdd(1, d, v, y * 2, s), O = 0; O < y * 2; O++)
      d[O] = null, v[O] = null;
    return S;
  };
  function u(t, n, e, s) {
    f.BasePoint.call(this, t, "affine"), n === null && e === null ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new a(n, 16), this.y = new a(e, 16), s && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1);
  }
  h(u, f.BasePoint), r.prototype.point = function(n, e, s) {
    return new u(this, n, e, s);
  }, r.prototype.pointFromJSON = function(n, e) {
    return u.fromJSON(this, n, e);
  }, u.prototype._getBeta = function() {
    if (this.curve.endo) {
      var n = this.precomputed;
      if (n && n.beta)
        return n.beta;
      var e = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
      if (n) {
        var s = this.curve, d = function(v) {
          return s.point(v.x.redMul(s.endo.beta), v.y);
        };
        n.beta = e, e.precomputed = {
          beta: null,
          naf: n.naf && {
            wnd: n.naf.wnd,
            points: n.naf.points.map(d)
          },
          doubles: n.doubles && {
            step: n.doubles.step,
            points: n.doubles.points.map(d)
          }
        };
      }
      return e;
    }
  }, u.prototype.toJSON = function() {
    return this.precomputed ? [this.x, this.y, this.precomputed && {
      doubles: this.precomputed.doubles && {
        step: this.precomputed.doubles.step,
        points: this.precomputed.doubles.points.slice(1)
      },
      naf: this.precomputed.naf && {
        wnd: this.precomputed.naf.wnd,
        points: this.precomputed.naf.points.slice(1)
      }
    }] : [this.x, this.y];
  }, u.fromJSON = function(n, e, s) {
    typeof e == "string" && (e = JSON.parse(e));
    var d = n.point(e[0], e[1], s);
    if (!e[2])
      return d;
    function v(m) {
      return n.point(m[0], m[1], s);
    }
    var y = e[2];
    return d.precomputed = {
      beta: null,
      doubles: y.doubles && {
        step: y.doubles.step,
        points: [d].concat(y.doubles.points.map(v))
      },
      naf: y.naf && {
        wnd: y.naf.wnd,
        points: [d].concat(y.naf.points.map(v))
      }
    }, d;
  }, u.prototype.inspect = function() {
    return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
  }, u.prototype.isInfinity = function() {
    return this.inf;
  }, u.prototype.add = function(n) {
    if (this.inf)
      return n;
    if (n.inf)
      return this;
    if (this.eq(n))
      return this.dbl();
    if (this.neg().eq(n))
      return this.curve.point(null, null);
    if (this.x.cmp(n.x) === 0)
      return this.curve.point(null, null);
    var e = this.y.redSub(n.y);
    e.cmpn(0) !== 0 && (e = e.redMul(this.x.redSub(n.x).redInvm()));
    var s = e.redSqr().redISub(this.x).redISub(n.x), d = e.redMul(this.x.redSub(s)).redISub(this.y);
    return this.curve.point(s, d);
  }, u.prototype.dbl = function() {
    if (this.inf)
      return this;
    var n = this.y.redAdd(this.y);
    if (n.cmpn(0) === 0)
      return this.curve.point(null, null);
    var e = this.curve.a, s = this.x.redSqr(), d = n.redInvm(), v = s.redAdd(s).redIAdd(s).redIAdd(e).redMul(d), y = v.redSqr().redISub(this.x.redAdd(this.x)), m = v.redMul(this.x.redSub(y)).redISub(this.y);
    return this.curve.point(y, m);
  }, u.prototype.getX = function() {
    return this.x.fromRed();
  }, u.prototype.getY = function() {
    return this.y.fromRed();
  }, u.prototype.mul = function(n) {
    return n = new a(n, 16), this.isInfinity() ? this : this._hasDoubles(n) ? this.curve._fixedNafMul(this, n) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [n]) : this.curve._wnafMul(this, n);
  }, u.prototype.mulAdd = function(n, e, s) {
    var d = [this, e], v = [n, s];
    return this.curve.endo ? this.curve._endoWnafMulAdd(d, v) : this.curve._wnafMulAdd(1, d, v, 2);
  }, u.prototype.jmulAdd = function(n, e, s) {
    var d = [this, e], v = [n, s];
    return this.curve.endo ? this.curve._endoWnafMulAdd(d, v, !0) : this.curve._wnafMulAdd(1, d, v, 2, !0);
  }, u.prototype.eq = function(n) {
    return this === n || this.inf === n.inf && (this.inf || this.x.cmp(n.x) === 0 && this.y.cmp(n.y) === 0);
  }, u.prototype.neg = function(n) {
    if (this.inf)
      return this;
    var e = this.curve.point(this.x, this.y.redNeg());
    if (n && this.precomputed) {
      var s = this.precomputed, d = function(v) {
        return v.neg();
      };
      e.precomputed = {
        naf: s.naf && {
          wnd: s.naf.wnd,
          points: s.naf.points.map(d)
        },
        doubles: s.doubles && {
          step: s.doubles.step,
          points: s.doubles.points.map(d)
        }
      };
    }
    return e;
  }, u.prototype.toJ = function() {
    if (this.inf)
      return this.curve.jpoint(null, null, null);
    var n = this.curve.jpoint(this.x, this.y, this.curve.one);
    return n;
  };
  function o(t, n, e, s) {
    f.BasePoint.call(this, t, "jacobian"), n === null && e === null && s === null ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new a(0)) : (this.x = new a(n, 16), this.y = new a(e, 16), this.z = new a(s, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one;
  }
  return h(o, f.BasePoint), r.prototype.jpoint = function(n, e, s) {
    return new o(this, n, e, s);
  }, o.prototype.toP = function() {
    if (this.isInfinity())
      return this.curve.point(null, null);
    var n = this.z.redInvm(), e = n.redSqr(), s = this.x.redMul(e), d = this.y.redMul(e).redMul(n);
    return this.curve.point(s, d);
  }, o.prototype.neg = function() {
    return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
  }, o.prototype.add = function(n) {
    if (this.isInfinity())
      return n;
    if (n.isInfinity())
      return this;
    var e = n.z.redSqr(), s = this.z.redSqr(), d = this.x.redMul(e), v = n.x.redMul(s), y = this.y.redMul(e.redMul(n.z)), m = n.y.redMul(s.redMul(this.z)), B = d.redSub(v), E = y.redSub(m);
    if (B.cmpn(0) === 0)
      return E.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
    var S = B.redSqr(), O = S.redMul(B), D = d.redMul(S), $ = E.redSqr().redIAdd(O).redISub(D).redISub(D), V = E.redMul(D.redISub($)).redISub(y.redMul(O)), J = this.z.redMul(n.z).redMul(B);
    return this.curve.jpoint($, V, J);
  }, o.prototype.mixedAdd = function(n) {
    if (this.isInfinity())
      return n.toJ();
    if (n.isInfinity())
      return this;
    var e = this.z.redSqr(), s = this.x, d = n.x.redMul(e), v = this.y, y = n.y.redMul(e).redMul(this.z), m = s.redSub(d), B = v.redSub(y);
    if (m.cmpn(0) === 0)
      return B.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();
    var E = m.redSqr(), S = E.redMul(m), O = s.redMul(E), D = B.redSqr().redIAdd(S).redISub(O).redISub(O), $ = B.redMul(O.redISub(D)).redISub(v.redMul(S)), V = this.z.redMul(m);
    return this.curve.jpoint(D, $, V);
  }, o.prototype.dblp = function(n) {
    if (n === 0)
      return this;
    if (this.isInfinity())
      return this;
    if (!n)
      return this.dbl();
    var e;
    if (this.curve.zeroA || this.curve.threeA) {
      var s = this;
      for (e = 0; e < n; e++)
        s = s.dbl();
      return s;
    }
    var d = this.curve.a, v = this.curve.tinv, y = this.x, m = this.y, B = this.z, E = B.redSqr().redSqr(), S = m.redAdd(m);
    for (e = 0; e < n; e++) {
      var O = y.redSqr(), D = S.redSqr(), $ = D.redSqr(), V = O.redAdd(O).redIAdd(O).redIAdd(d.redMul(E)), J = y.redMul(D), ie = V.redSqr().redISub(J.redAdd(J)), ne = J.redISub(ie), le = V.redMul(ne);
      le = le.redIAdd(le).redISub($);
      var Y = S.redMul(B);
      e + 1 < n && (E = E.redMul($)), y = ie, B = Y, S = le;
    }
    return this.curve.jpoint(y, S.redMul(v), B);
  }, o.prototype.dbl = function() {
    return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
  }, o.prototype._zeroDbl = function() {
    var n, e, s;
    if (this.zOne) {
      var d = this.x.redSqr(), v = this.y.redSqr(), y = v.redSqr(), m = this.x.redAdd(v).redSqr().redISub(d).redISub(y);
      m = m.redIAdd(m);
      var B = d.redAdd(d).redIAdd(d), E = B.redSqr().redISub(m).redISub(m), S = y.redIAdd(y);
      S = S.redIAdd(S), S = S.redIAdd(S), n = E, e = B.redMul(m.redISub(E)).redISub(S), s = this.y.redAdd(this.y);
    } else {
      var O = this.x.redSqr(), D = this.y.redSqr(), $ = D.redSqr(), V = this.x.redAdd(D).redSqr().redISub(O).redISub($);
      V = V.redIAdd(V);
      var J = O.redAdd(O).redIAdd(O), ie = J.redSqr(), ne = $.redIAdd($);
      ne = ne.redIAdd(ne), ne = ne.redIAdd(ne), n = ie.redISub(V).redISub(V), e = J.redMul(V.redISub(n)).redISub(ne), s = this.y.redMul(this.z), s = s.redIAdd(s);
    }
    return this.curve.jpoint(n, e, s);
  }, o.prototype._threeDbl = function() {
    var n, e, s;
    if (this.zOne) {
      var d = this.x.redSqr(), v = this.y.redSqr(), y = v.redSqr(), m = this.x.redAdd(v).redSqr().redISub(d).redISub(y);
      m = m.redIAdd(m);
      var B = d.redAdd(d).redIAdd(d).redIAdd(this.curve.a), E = B.redSqr().redISub(m).redISub(m);
      n = E;
      var S = y.redIAdd(y);
      S = S.redIAdd(S), S = S.redIAdd(S), e = B.redMul(m.redISub(E)).redISub(S), s = this.y.redAdd(this.y);
    } else {
      var O = this.z.redSqr(), D = this.y.redSqr(), $ = this.x.redMul(D), V = this.x.redSub(O).redMul(this.x.redAdd(O));
      V = V.redAdd(V).redIAdd(V);
      var J = $.redIAdd($);
      J = J.redIAdd(J);
      var ie = J.redAdd(J);
      n = V.redSqr().redISub(ie), s = this.y.redAdd(this.z).redSqr().redISub(D).redISub(O);
      var ne = D.redSqr();
      ne = ne.redIAdd(ne), ne = ne.redIAdd(ne), ne = ne.redIAdd(ne), e = V.redMul(J.redISub(n)).redISub(ne);
    }
    return this.curve.jpoint(n, e, s);
  }, o.prototype._dbl = function() {
    var n = this.curve.a, e = this.x, s = this.y, d = this.z, v = d.redSqr().redSqr(), y = e.redSqr(), m = s.redSqr(), B = y.redAdd(y).redIAdd(y).redIAdd(n.redMul(v)), E = e.redAdd(e);
    E = E.redIAdd(E);
    var S = E.redMul(m), O = B.redSqr().redISub(S.redAdd(S)), D = S.redISub(O), $ = m.redSqr();
    $ = $.redIAdd($), $ = $.redIAdd($), $ = $.redIAdd($);
    var V = B.redMul(D).redISub($), J = s.redAdd(s).redMul(d);
    return this.curve.jpoint(O, V, J);
  }, o.prototype.trpl = function() {
    if (!this.curve.zeroA)
      return this.dbl().add(this);
    var n = this.x.redSqr(), e = this.y.redSqr(), s = this.z.redSqr(), d = e.redSqr(), v = n.redAdd(n).redIAdd(n), y = v.redSqr(), m = this.x.redAdd(e).redSqr().redISub(n).redISub(d);
    m = m.redIAdd(m), m = m.redAdd(m).redIAdd(m), m = m.redISub(y);
    var B = m.redSqr(), E = d.redIAdd(d);
    E = E.redIAdd(E), E = E.redIAdd(E), E = E.redIAdd(E);
    var S = v.redIAdd(m).redSqr().redISub(y).redISub(B).redISub(E), O = e.redMul(S);
    O = O.redIAdd(O), O = O.redIAdd(O);
    var D = this.x.redMul(B).redISub(O);
    D = D.redIAdd(D), D = D.redIAdd(D);
    var $ = this.y.redMul(S.redMul(E.redISub(S)).redISub(m.redMul(B)));
    $ = $.redIAdd($), $ = $.redIAdd($), $ = $.redIAdd($);
    var V = this.z.redAdd(m).redSqr().redISub(s).redISub(B);
    return this.curve.jpoint(D, $, V);
  }, o.prototype.mul = function(n, e) {
    return n = new a(n, e), this.curve._wnafMul(this, n);
  }, o.prototype.eq = function(n) {
    if (n.type === "affine")
      return this.eq(n.toJ());
    if (this === n)
      return !0;
    var e = this.z.redSqr(), s = n.z.redSqr();
    if (this.x.redMul(s).redISub(n.x.redMul(e)).cmpn(0) !== 0)
      return !1;
    var d = e.redMul(this.z), v = s.redMul(n.z);
    return this.y.redMul(v).redISub(n.y.redMul(d)).cmpn(0) === 0;
  }, o.prototype.eqXToP = function(n) {
    var e = this.z.redSqr(), s = n.toRed(this.curve.red).redMul(e);
    if (this.x.cmp(s) === 0)
      return !0;
    for (var d = n.clone(), v = this.curve.redN.redMul(e); ; ) {
      if (d.iadd(this.curve.n), d.cmp(this.curve.p) >= 0)
        return !1;
      if (s.redIAdd(v), this.x.cmp(s) === 0)
        return !0;
    }
  }, o.prototype.inspect = function() {
    return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
  }, o.prototype.isInfinity = function() {
    return this.z.cmpn(0) === 0;
  }, short;
}
var mont, hasRequiredMont;
function requireMont() {
  if (hasRequiredMont) return mont;
  hasRequiredMont = 1;
  var c = requireBn$1(), a = requireInherits_browser(), h = requireBase$1(), f = requireUtils$2();
  function p(u) {
    h.call(this, "mont", u), this.a = new c(u.a, 16).toRed(this.red), this.b = new c(u.b, 16).toRed(this.red), this.i4 = new c(4).toRed(this.red).redInvm(), this.two = new c(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two));
  }
  a(p, h), mont = p, p.prototype.validate = function(o) {
    var t = o.normalize().x, n = t.redSqr(), e = n.redMul(t).redAdd(n.redMul(this.a)).redAdd(t), s = e.redSqrt();
    return s.redSqr().cmp(e) === 0;
  };
  function r(u, o, t) {
    h.BasePoint.call(this, u, "projective"), o === null && t === null ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new c(o, 16), this.z = new c(t, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)));
  }
  return a(r, h.BasePoint), p.prototype.decodePoint = function(o, t) {
    return this.point(f.toArray(o, t), 1);
  }, p.prototype.point = function(o, t) {
    return new r(this, o, t);
  }, p.prototype.pointFromJSON = function(o) {
    return r.fromJSON(this, o);
  }, r.prototype.precompute = function() {
  }, r.prototype._encode = function() {
    return this.getX().toArray("be", this.curve.p.byteLength());
  }, r.fromJSON = function(o, t) {
    return new r(o, t[0], t[1] || o.one);
  }, r.prototype.inspect = function() {
    return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
  }, r.prototype.isInfinity = function() {
    return this.z.cmpn(0) === 0;
  }, r.prototype.dbl = function() {
    var o = this.x.redAdd(this.z), t = o.redSqr(), n = this.x.redSub(this.z), e = n.redSqr(), s = t.redSub(e), d = t.redMul(e), v = s.redMul(e.redAdd(this.curve.a24.redMul(s)));
    return this.curve.point(d, v);
  }, r.prototype.add = function() {
    throw new Error("Not supported on Montgomery curve");
  }, r.prototype.diffAdd = function(o, t) {
    var n = this.x.redAdd(this.z), e = this.x.redSub(this.z), s = o.x.redAdd(o.z), d = o.x.redSub(o.z), v = d.redMul(n), y = s.redMul(e), m = t.z.redMul(v.redAdd(y).redSqr()), B = t.x.redMul(v.redISub(y).redSqr());
    return this.curve.point(m, B);
  }, r.prototype.mul = function(o) {
    for (var t = o.clone(), n = this, e = this.curve.point(null, null), s = this, d = []; t.cmpn(0) !== 0; t.iushrn(1))
      d.push(t.andln(1));
    for (var v = d.length - 1; v >= 0; v--)
      d[v] === 0 ? (n = n.diffAdd(e, s), e = e.dbl()) : (e = n.diffAdd(e, s), n = n.dbl());
    return e;
  }, r.prototype.mulAdd = function() {
    throw new Error("Not supported on Montgomery curve");
  }, r.prototype.jumlAdd = function() {
    throw new Error("Not supported on Montgomery curve");
  }, r.prototype.eq = function(o) {
    return this.getX().cmp(o.getX()) === 0;
  }, r.prototype.normalize = function() {
    return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this;
  }, r.prototype.getX = function() {
    return this.normalize(), this.x.fromRed();
  }, mont;
}
var edwards, hasRequiredEdwards;
function requireEdwards() {
  if (hasRequiredEdwards) return edwards;
  hasRequiredEdwards = 1;
  var c = requireUtils$2(), a = requireBn$1(), h = requireInherits_browser(), f = requireBase$1(), p = c.assert;
  function r(o) {
    this.twisted = (o.a | 0) !== 1, this.mOneA = this.twisted && (o.a | 0) === -1, this.extended = this.mOneA, f.call(this, "edwards", o), this.a = new a(o.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new a(o.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new a(o.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), p(!this.twisted || this.c.fromRed().cmpn(1) === 0), this.oneC = (o.c | 0) === 1;
  }
  h(r, f), edwards = r, r.prototype._mulA = function(t) {
    return this.mOneA ? t.redNeg() : this.a.redMul(t);
  }, r.prototype._mulC = function(t) {
    return this.oneC ? t : this.c.redMul(t);
  }, r.prototype.jpoint = function(t, n, e, s) {
    return this.point(t, n, e, s);
  }, r.prototype.pointFromX = function(t, n) {
    t = new a(t, 16), t.red || (t = t.toRed(this.red));
    var e = t.redSqr(), s = this.c2.redSub(this.a.redMul(e)), d = this.one.redSub(this.c2.redMul(this.d).redMul(e)), v = s.redMul(d.redInvm()), y = v.redSqrt();
    if (y.redSqr().redSub(v).cmp(this.zero) !== 0)
      throw new Error("invalid point");
    var m = y.fromRed().isOdd();
    return (n && !m || !n && m) && (y = y.redNeg()), this.point(t, y);
  }, r.prototype.pointFromY = function(t, n) {
    t = new a(t, 16), t.red || (t = t.toRed(this.red));
    var e = t.redSqr(), s = e.redSub(this.c2), d = e.redMul(this.d).redMul(this.c2).redSub(this.a), v = s.redMul(d.redInvm());
    if (v.cmp(this.zero) === 0) {
      if (n)
        throw new Error("invalid point");
      return this.point(this.zero, t);
    }
    var y = v.redSqrt();
    if (y.redSqr().redSub(v).cmp(this.zero) !== 0)
      throw new Error("invalid point");
    return y.fromRed().isOdd() !== n && (y = y.redNeg()), this.point(y, t);
  }, r.prototype.validate = function(t) {
    if (t.isInfinity())
      return !0;
    t.normalize();
    var n = t.x.redSqr(), e = t.y.redSqr(), s = n.redMul(this.a).redAdd(e), d = this.c2.redMul(this.one.redAdd(this.d.redMul(n).redMul(e)));
    return s.cmp(d) === 0;
  };
  function u(o, t, n, e, s) {
    f.BasePoint.call(this, o, "projective"), t === null && n === null && e === null ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new a(t, 16), this.y = new a(n, 16), this.z = e ? new a(e, 16) : this.curve.one, this.t = s && new a(s, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
  }
  return h(u, f.BasePoint), r.prototype.pointFromJSON = function(t) {
    return u.fromJSON(this, t);
  }, r.prototype.point = function(t, n, e, s) {
    return new u(this, t, n, e, s);
  }, u.fromJSON = function(t, n) {
    return new u(t, n[0], n[1], n[2]);
  }, u.prototype.inspect = function() {
    return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
  }, u.prototype.isInfinity = function() {
    return this.x.cmpn(0) === 0 && (this.y.cmp(this.z) === 0 || this.zOne && this.y.cmp(this.curve.c) === 0);
  }, u.prototype._extDbl = function() {
    var t = this.x.redSqr(), n = this.y.redSqr(), e = this.z.redSqr();
    e = e.redIAdd(e);
    var s = this.curve._mulA(t), d = this.x.redAdd(this.y).redSqr().redISub(t).redISub(n), v = s.redAdd(n), y = v.redSub(e), m = s.redSub(n), B = d.redMul(y), E = v.redMul(m), S = d.redMul(m), O = y.redMul(v);
    return this.curve.point(B, E, O, S);
  }, u.prototype._projDbl = function() {
    var t = this.x.redAdd(this.y).redSqr(), n = this.x.redSqr(), e = this.y.redSqr(), s, d, v, y, m, B;
    if (this.curve.twisted) {
      y = this.curve._mulA(n);
      var E = y.redAdd(e);
      this.zOne ? (s = t.redSub(n).redSub(e).redMul(E.redSub(this.curve.two)), d = E.redMul(y.redSub(e)), v = E.redSqr().redSub(E).redSub(E)) : (m = this.z.redSqr(), B = E.redSub(m).redISub(m), s = t.redSub(n).redISub(e).redMul(B), d = E.redMul(y.redSub(e)), v = E.redMul(B));
    } else
      y = n.redAdd(e), m = this.curve._mulC(this.z).redSqr(), B = y.redSub(m).redSub(m), s = this.curve._mulC(t.redISub(y)).redMul(B), d = this.curve._mulC(y).redMul(n.redISub(e)), v = y.redMul(B);
    return this.curve.point(s, d, v);
  }, u.prototype.dbl = function() {
    return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
  }, u.prototype._extAdd = function(t) {
    var n = this.y.redSub(this.x).redMul(t.y.redSub(t.x)), e = this.y.redAdd(this.x).redMul(t.y.redAdd(t.x)), s = this.t.redMul(this.curve.dd).redMul(t.t), d = this.z.redMul(t.z.redAdd(t.z)), v = e.redSub(n), y = d.redSub(s), m = d.redAdd(s), B = e.redAdd(n), E = v.redMul(y), S = m.redMul(B), O = v.redMul(B), D = y.redMul(m);
    return this.curve.point(E, S, D, O);
  }, u.prototype._projAdd = function(t) {
    var n = this.z.redMul(t.z), e = n.redSqr(), s = this.x.redMul(t.x), d = this.y.redMul(t.y), v = this.curve.d.redMul(s).redMul(d), y = e.redSub(v), m = e.redAdd(v), B = this.x.redAdd(this.y).redMul(t.x.redAdd(t.y)).redISub(s).redISub(d), E = n.redMul(y).redMul(B), S, O;
    return this.curve.twisted ? (S = n.redMul(m).redMul(d.redSub(this.curve._mulA(s))), O = y.redMul(m)) : (S = n.redMul(m).redMul(d.redSub(s)), O = this.curve._mulC(y).redMul(m)), this.curve.point(E, S, O);
  }, u.prototype.add = function(t) {
    return this.isInfinity() ? t : t.isInfinity() ? this : this.curve.extended ? this._extAdd(t) : this._projAdd(t);
  }, u.prototype.mul = function(t) {
    return this._hasDoubles(t) ? this.curve._fixedNafMul(this, t) : this.curve._wnafMul(this, t);
  }, u.prototype.mulAdd = function(t, n, e) {
    return this.curve._wnafMulAdd(1, [this, n], [t, e], 2, !1);
  }, u.prototype.jmulAdd = function(t, n, e) {
    return this.curve._wnafMulAdd(1, [this, n], [t, e], 2, !0);
  }, u.prototype.normalize = function() {
    if (this.zOne)
      return this;
    var t = this.z.redInvm();
    return this.x = this.x.redMul(t), this.y = this.y.redMul(t), this.t && (this.t = this.t.redMul(t)), this.z = this.curve.one, this.zOne = !0, this;
  }, u.prototype.neg = function() {
    return this.curve.point(
      this.x.redNeg(),
      this.y,
      this.z,
      this.t && this.t.redNeg()
    );
  }, u.prototype.getX = function() {
    return this.normalize(), this.x.fromRed();
  }, u.prototype.getY = function() {
    return this.normalize(), this.y.fromRed();
  }, u.prototype.eq = function(t) {
    return this === t || this.getX().cmp(t.getX()) === 0 && this.getY().cmp(t.getY()) === 0;
  }, u.prototype.eqXToP = function(t) {
    var n = t.toRed(this.curve.red).redMul(this.z);
    if (this.x.cmp(n) === 0)
      return !0;
    for (var e = t.clone(), s = this.curve.redN.redMul(this.z); ; ) {
      if (e.iadd(this.curve.n), e.cmp(this.curve.p) >= 0)
        return !1;
      if (n.redIAdd(s), this.x.cmp(n) === 0)
        return !0;
    }
  }, u.prototype.toP = u.prototype.normalize, u.prototype.mixedAdd = u.prototype.add, edwards;
}
var hasRequiredCurve;
function requireCurve() {
  return hasRequiredCurve || (hasRequiredCurve = 1, (function(c) {
    var a = c;
    a.base = requireBase$1(), a.short = requireShort(), a.mont = requireMont(), a.edwards = requireEdwards();
  })(curve)), curve;
}
var curves = {}, hash = {}, utils = {}, hasRequiredUtils$1;
function requireUtils$1() {
  if (hasRequiredUtils$1) return utils;
  hasRequiredUtils$1 = 1;
  var c = requireMinimalisticAssert(), a = requireInherits_browser();
  utils.inherits = a;
  function h(b, g) {
    return (b.charCodeAt(g) & 64512) !== 55296 || g < 0 || g + 1 >= b.length ? !1 : (b.charCodeAt(g + 1) & 64512) === 56320;
  }
  function f(b, g) {
    if (Array.isArray(b))
      return b.slice();
    if (!b)
      return [];
    var l = [];
    if (typeof b == "string")
      if (g) {
        if (g === "hex")
          for (b = b.replace(/[^a-z0-9]+/ig, ""), b.length % 2 !== 0 && (b = "0" + b), A = 0; A < b.length; A += 2)
            l.push(parseInt(b[A] + b[A + 1], 16));
      } else for (var _ = 0, A = 0; A < b.length; A++) {
        var q = b.charCodeAt(A);
        q < 128 ? l[_++] = q : q < 2048 ? (l[_++] = q >> 6 | 192, l[_++] = q & 63 | 128) : h(b, A) ? (q = 65536 + ((q & 1023) << 10) + (b.charCodeAt(++A) & 1023), l[_++] = q >> 18 | 240, l[_++] = q >> 12 & 63 | 128, l[_++] = q >> 6 & 63 | 128, l[_++] = q & 63 | 128) : (l[_++] = q >> 12 | 224, l[_++] = q >> 6 & 63 | 128, l[_++] = q & 63 | 128);
      }
    else
      for (A = 0; A < b.length; A++)
        l[A] = b[A] | 0;
    return l;
  }
  utils.toArray = f;
  function p(b) {
    for (var g = "", l = 0; l < b.length; l++)
      g += o(b[l].toString(16));
    return g;
  }
  utils.toHex = p;
  function r(b) {
    var g = b >>> 24 | b >>> 8 & 65280 | b << 8 & 16711680 | (b & 255) << 24;
    return g >>> 0;
  }
  utils.htonl = r;
  function u(b, g) {
    for (var l = "", _ = 0; _ < b.length; _++) {
      var A = b[_];
      g === "little" && (A = r(A)), l += t(A.toString(16));
    }
    return l;
  }
  utils.toHex32 = u;
  function o(b) {
    return b.length === 1 ? "0" + b : b;
  }
  utils.zero2 = o;
  function t(b) {
    return b.length === 7 ? "0" + b : b.length === 6 ? "00" + b : b.length === 5 ? "000" + b : b.length === 4 ? "0000" + b : b.length === 3 ? "00000" + b : b.length === 2 ? "000000" + b : b.length === 1 ? "0000000" + b : b;
  }
  utils.zero8 = t;
  function n(b, g, l, _) {
    var A = l - g;
    c(A % 4 === 0);
    for (var q = new Array(A / 4), P = 0, R = g; P < q.length; P++, R += 4) {
      var w;
      _ === "big" ? w = b[R] << 24 | b[R + 1] << 16 | b[R + 2] << 8 | b[R + 3] : w = b[R + 3] << 24 | b[R + 2] << 16 | b[R + 1] << 8 | b[R], q[P] = w >>> 0;
    }
    return q;
  }
  utils.join32 = n;
  function e(b, g) {
    for (var l = new Array(b.length * 4), _ = 0, A = 0; _ < b.length; _++, A += 4) {
      var q = b[_];
      g === "big" ? (l[A] = q >>> 24, l[A + 1] = q >>> 16 & 255, l[A + 2] = q >>> 8 & 255, l[A + 3] = q & 255) : (l[A + 3] = q >>> 24, l[A + 2] = q >>> 16 & 255, l[A + 1] = q >>> 8 & 255, l[A] = q & 255);
    }
    return l;
  }
  utils.split32 = e;
  function s(b, g) {
    return b >>> g | b << 32 - g;
  }
  utils.rotr32 = s;
  function d(b, g) {
    return b << g | b >>> 32 - g;
  }
  utils.rotl32 = d;
  function v(b, g) {
    return b + g >>> 0;
  }
  utils.sum32 = v;
  function y(b, g, l) {
    return b + g + l >>> 0;
  }
  utils.sum32_3 = y;
  function m(b, g, l, _) {
    return b + g + l + _ >>> 0;
  }
  utils.sum32_4 = m;
  function B(b, g, l, _, A) {
    return b + g + l + _ + A >>> 0;
  }
  utils.sum32_5 = B;
  function E(b, g, l, _) {
    var A = b[g], q = b[g + 1], P = _ + q >>> 0, R = (P < _ ? 1 : 0) + l + A;
    b[g] = R >>> 0, b[g + 1] = P;
  }
  utils.sum64 = E;
  function S(b, g, l, _) {
    var A = g + _ >>> 0, q = (A < g ? 1 : 0) + b + l;
    return q >>> 0;
  }
  utils.sum64_hi = S;
  function O(b, g, l, _) {
    var A = g + _;
    return A >>> 0;
  }
  utils.sum64_lo = O;
  function D(b, g, l, _, A, q, P, R) {
    var w = 0, M = g;
    M = M + _ >>> 0, w += M < g ? 1 : 0, M = M + q >>> 0, w += M < q ? 1 : 0, M = M + R >>> 0, w += M < R ? 1 : 0;
    var x = b + l + A + P + w;
    return x >>> 0;
  }
  utils.sum64_4_hi = D;
  function $(b, g, l, _, A, q, P, R) {
    var w = g + _ + q + R;
    return w >>> 0;
  }
  utils.sum64_4_lo = $;
  function V(b, g, l, _, A, q, P, R, w, M) {
    var x = 0, L = g;
    L = L + _ >>> 0, x += L < g ? 1 : 0, L = L + q >>> 0, x += L < q ? 1 : 0, L = L + R >>> 0, x += L < R ? 1 : 0, L = L + M >>> 0, x += L < M ? 1 : 0;
    var K = b + l + A + P + w + x;
    return K >>> 0;
  }
  utils.sum64_5_hi = V;
  function J(b, g, l, _, A, q, P, R, w, M) {
    var x = g + _ + q + R + M;
    return x >>> 0;
  }
  utils.sum64_5_lo = J;
  function ie(b, g, l) {
    var _ = g << 32 - l | b >>> l;
    return _ >>> 0;
  }
  utils.rotr64_hi = ie;
  function ne(b, g, l) {
    var _ = b << 32 - l | g >>> l;
    return _ >>> 0;
  }
  utils.rotr64_lo = ne;
  function le(b, g, l) {
    return b >>> l;
  }
  utils.shr64_hi = le;
  function Y(b, g, l) {
    var _ = b << 32 - l | g >>> l;
    return _ >>> 0;
  }
  return utils.shr64_lo = Y, utils;
}
var common$1 = {}, hasRequiredCommon$1;
function requireCommon$1() {
  if (hasRequiredCommon$1) return common$1;
  hasRequiredCommon$1 = 1;
  var c = requireUtils$1(), a = requireMinimalisticAssert();
  function h() {
    this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
  }
  return common$1.BlockHash = h, h.prototype.update = function(p, r) {
    if (p = c.toArray(p, r), this.pending ? this.pending = this.pending.concat(p) : this.pending = p, this.pendingTotal += p.length, this.pending.length >= this._delta8) {
      p = this.pending;
      var u = p.length % this._delta8;
      this.pending = p.slice(p.length - u, p.length), this.pending.length === 0 && (this.pending = null), p = c.join32(p, 0, p.length - u, this.endian);
      for (var o = 0; o < p.length; o += this._delta32)
        this._update(p, o, o + this._delta32);
    }
    return this;
  }, h.prototype.digest = function(p) {
    return this.update(this._pad()), a(this.pending === null), this._digest(p);
  }, h.prototype._pad = function() {
    var p = this.pendingTotal, r = this._delta8, u = r - (p + this.padLength) % r, o = new Array(u + this.padLength);
    o[0] = 128;
    for (var t = 1; t < u; t++)
      o[t] = 0;
    if (p <<= 3, this.endian === "big") {
      for (var n = 8; n < this.padLength; n++)
        o[t++] = 0;
      o[t++] = 0, o[t++] = 0, o[t++] = 0, o[t++] = 0, o[t++] = p >>> 24 & 255, o[t++] = p >>> 16 & 255, o[t++] = p >>> 8 & 255, o[t++] = p & 255;
    } else
      for (o[t++] = p & 255, o[t++] = p >>> 8 & 255, o[t++] = p >>> 16 & 255, o[t++] = p >>> 24 & 255, o[t++] = 0, o[t++] = 0, o[t++] = 0, o[t++] = 0, n = 8; n < this.padLength; n++)
        o[t++] = 0;
    return o;
  }, common$1;
}
var sha = {}, common = {}, hasRequiredCommon;
function requireCommon() {
  if (hasRequiredCommon) return common;
  hasRequiredCommon = 1;
  var c = requireUtils$1(), a = c.rotr32;
  function h(e, s, d, v) {
    if (e === 0)
      return f(s, d, v);
    if (e === 1 || e === 3)
      return r(s, d, v);
    if (e === 2)
      return p(s, d, v);
  }
  common.ft_1 = h;
  function f(e, s, d) {
    return e & s ^ ~e & d;
  }
  common.ch32 = f;
  function p(e, s, d) {
    return e & s ^ e & d ^ s & d;
  }
  common.maj32 = p;
  function r(e, s, d) {
    return e ^ s ^ d;
  }
  common.p32 = r;
  function u(e) {
    return a(e, 2) ^ a(e, 13) ^ a(e, 22);
  }
  common.s0_256 = u;
  function o(e) {
    return a(e, 6) ^ a(e, 11) ^ a(e, 25);
  }
  common.s1_256 = o;
  function t(e) {
    return a(e, 7) ^ a(e, 18) ^ e >>> 3;
  }
  common.g0_256 = t;
  function n(e) {
    return a(e, 17) ^ a(e, 19) ^ e >>> 10;
  }
  return common.g1_256 = n, common;
}
var _1, hasRequired_1;
function require_1() {
  if (hasRequired_1) return _1;
  hasRequired_1 = 1;
  var c = requireUtils$1(), a = requireCommon$1(), h = requireCommon(), f = c.rotl32, p = c.sum32, r = c.sum32_5, u = h.ft_1, o = a.BlockHash, t = [
    1518500249,
    1859775393,
    2400959708,
    3395469782
  ];
  function n() {
    if (!(this instanceof n))
      return new n();
    o.call(this), this.h = [
      1732584193,
      4023233417,
      2562383102,
      271733878,
      3285377520
    ], this.W = new Array(80);
  }
  return c.inherits(n, o), _1 = n, n.blockSize = 512, n.outSize = 160, n.hmacStrength = 80, n.padLength = 64, n.prototype._update = function(s, d) {
    for (var v = this.W, y = 0; y < 16; y++)
      v[y] = s[d + y];
    for (; y < v.length; y++)
      v[y] = f(v[y - 3] ^ v[y - 8] ^ v[y - 14] ^ v[y - 16], 1);
    var m = this.h[0], B = this.h[1], E = this.h[2], S = this.h[3], O = this.h[4];
    for (y = 0; y < v.length; y++) {
      var D = ~~(y / 20), $ = r(f(m, 5), u(D, B, E, S), O, v[y], t[D]);
      O = S, S = E, E = f(B, 30), B = m, m = $;
    }
    this.h[0] = p(this.h[0], m), this.h[1] = p(this.h[1], B), this.h[2] = p(this.h[2], E), this.h[3] = p(this.h[3], S), this.h[4] = p(this.h[4], O);
  }, n.prototype._digest = function(s) {
    return s === "hex" ? c.toHex32(this.h, "big") : c.split32(this.h, "big");
  }, _1;
}
var _256, hasRequired_256;
function require_256() {
  if (hasRequired_256) return _256;
  hasRequired_256 = 1;
  var c = requireUtils$1(), a = requireCommon$1(), h = requireCommon(), f = requireMinimalisticAssert(), p = c.sum32, r = c.sum32_4, u = c.sum32_5, o = h.ch32, t = h.maj32, n = h.s0_256, e = h.s1_256, s = h.g0_256, d = h.g1_256, v = a.BlockHash, y = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ];
  function m() {
    if (!(this instanceof m))
      return new m();
    v.call(this), this.h = [
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ], this.k = y, this.W = new Array(64);
  }
  return c.inherits(m, v), _256 = m, m.blockSize = 512, m.outSize = 256, m.hmacStrength = 192, m.padLength = 64, m.prototype._update = function(E, S) {
    for (var O = this.W, D = 0; D < 16; D++)
      O[D] = E[S + D];
    for (; D < O.length; D++)
      O[D] = r(d(O[D - 2]), O[D - 7], s(O[D - 15]), O[D - 16]);
    var $ = this.h[0], V = this.h[1], J = this.h[2], ie = this.h[3], ne = this.h[4], le = this.h[5], Y = this.h[6], b = this.h[7];
    for (f(this.k.length === O.length), D = 0; D < O.length; D++) {
      var g = u(b, e(ne), o(ne, le, Y), this.k[D], O[D]), l = p(n($), t($, V, J));
      b = Y, Y = le, le = ne, ne = p(ie, g), ie = J, J = V, V = $, $ = p(g, l);
    }
    this.h[0] = p(this.h[0], $), this.h[1] = p(this.h[1], V), this.h[2] = p(this.h[2], J), this.h[3] = p(this.h[3], ie), this.h[4] = p(this.h[4], ne), this.h[5] = p(this.h[5], le), this.h[6] = p(this.h[6], Y), this.h[7] = p(this.h[7], b);
  }, m.prototype._digest = function(E) {
    return E === "hex" ? c.toHex32(this.h, "big") : c.split32(this.h, "big");
  }, _256;
}
var _224, hasRequired_224;
function require_224() {
  if (hasRequired_224) return _224;
  hasRequired_224 = 1;
  var c = requireUtils$1(), a = require_256();
  function h() {
    if (!(this instanceof h))
      return new h();
    a.call(this), this.h = [
      3238371032,
      914150663,
      812702999,
      4144912697,
      4290775857,
      1750603025,
      1694076839,
      3204075428
    ];
  }
  return c.inherits(h, a), _224 = h, h.blockSize = 512, h.outSize = 224, h.hmacStrength = 192, h.padLength = 64, h.prototype._digest = function(p) {
    return p === "hex" ? c.toHex32(this.h.slice(0, 7), "big") : c.split32(this.h.slice(0, 7), "big");
  }, _224;
}
var _512, hasRequired_512;
function require_512() {
  if (hasRequired_512) return _512;
  hasRequired_512 = 1;
  var c = requireUtils$1(), a = requireCommon$1(), h = requireMinimalisticAssert(), f = c.rotr64_hi, p = c.rotr64_lo, r = c.shr64_hi, u = c.shr64_lo, o = c.sum64, t = c.sum64_hi, n = c.sum64_lo, e = c.sum64_4_hi, s = c.sum64_4_lo, d = c.sum64_5_hi, v = c.sum64_5_lo, y = a.BlockHash, m = [
    1116352408,
    3609767458,
    1899447441,
    602891725,
    3049323471,
    3964484399,
    3921009573,
    2173295548,
    961987163,
    4081628472,
    1508970993,
    3053834265,
    2453635748,
    2937671579,
    2870763221,
    3664609560,
    3624381080,
    2734883394,
    310598401,
    1164996542,
    607225278,
    1323610764,
    1426881987,
    3590304994,
    1925078388,
    4068182383,
    2162078206,
    991336113,
    2614888103,
    633803317,
    3248222580,
    3479774868,
    3835390401,
    2666613458,
    4022224774,
    944711139,
    264347078,
    2341262773,
    604807628,
    2007800933,
    770255983,
    1495990901,
    1249150122,
    1856431235,
    1555081692,
    3175218132,
    1996064986,
    2198950837,
    2554220882,
    3999719339,
    2821834349,
    766784016,
    2952996808,
    2566594879,
    3210313671,
    3203337956,
    3336571891,
    1034457026,
    3584528711,
    2466948901,
    113926993,
    3758326383,
    338241895,
    168717936,
    666307205,
    1188179964,
    773529912,
    1546045734,
    1294757372,
    1522805485,
    1396182291,
    2643833823,
    1695183700,
    2343527390,
    1986661051,
    1014477480,
    2177026350,
    1206759142,
    2456956037,
    344077627,
    2730485921,
    1290863460,
    2820302411,
    3158454273,
    3259730800,
    3505952657,
    3345764771,
    106217008,
    3516065817,
    3606008344,
    3600352804,
    1432725776,
    4094571909,
    1467031594,
    275423344,
    851169720,
    430227734,
    3100823752,
    506948616,
    1363258195,
    659060556,
    3750685593,
    883997877,
    3785050280,
    958139571,
    3318307427,
    1322822218,
    3812723403,
    1537002063,
    2003034995,
    1747873779,
    3602036899,
    1955562222,
    1575990012,
    2024104815,
    1125592928,
    2227730452,
    2716904306,
    2361852424,
    442776044,
    2428436474,
    593698344,
    2756734187,
    3733110249,
    3204031479,
    2999351573,
    3329325298,
    3815920427,
    3391569614,
    3928383900,
    3515267271,
    566280711,
    3940187606,
    3454069534,
    4118630271,
    4000239992,
    116418474,
    1914138554,
    174292421,
    2731055270,
    289380356,
    3203993006,
    460393269,
    320620315,
    685471733,
    587496836,
    852142971,
    1086792851,
    1017036298,
    365543100,
    1126000580,
    2618297676,
    1288033470,
    3409855158,
    1501505948,
    4234509866,
    1607167915,
    987167468,
    1816402316,
    1246189591
  ];
  function B() {
    if (!(this instanceof B))
      return new B();
    y.call(this), this.h = [
      1779033703,
      4089235720,
      3144134277,
      2227873595,
      1013904242,
      4271175723,
      2773480762,
      1595750129,
      1359893119,
      2917565137,
      2600822924,
      725511199,
      528734635,
      4215389547,
      1541459225,
      327033209
    ], this.k = m, this.W = new Array(160);
  }
  c.inherits(B, y), _512 = B, B.blockSize = 1024, B.outSize = 512, B.hmacStrength = 192, B.padLength = 128, B.prototype._prepareBlock = function(l, _) {
    for (var A = this.W, q = 0; q < 32; q++)
      A[q] = l[_ + q];
    for (; q < A.length; q += 2) {
      var P = Y(A[q - 4], A[q - 3]), R = b(A[q - 4], A[q - 3]), w = A[q - 14], M = A[q - 13], x = ne(A[q - 30], A[q - 29]), L = le(A[q - 30], A[q - 29]), K = A[q - 32], Q = A[q - 31];
      A[q] = e(
        P,
        R,
        w,
        M,
        x,
        L,
        K,
        Q
      ), A[q + 1] = s(
        P,
        R,
        w,
        M,
        x,
        L,
        K,
        Q
      );
    }
  }, B.prototype._update = function(l, _) {
    this._prepareBlock(l, _);
    var A = this.W, q = this.h[0], P = this.h[1], R = this.h[2], w = this.h[3], M = this.h[4], x = this.h[5], L = this.h[6], K = this.h[7], Q = this.h[8], U = this.h[9], N = this.h[10], F = this.h[11], ee = this.h[12], ae = this.h[13], G = this.h[14], z = this.h[15];
    h(this.k.length === A.length);
    for (var fe = 0; fe < A.length; fe += 2) {
      var me = G, xe = z, _e = J(Q, U), Be = ie(Q, U), Ae = E(Q, U, N, F, ee), be = S(Q, U, N, F, ee, ae), Fe = this.k[fe], qe = this.k[fe + 1], Me = A[fe], Te = A[fe + 1], oe = d(
        me,
        xe,
        _e,
        Be,
        Ae,
        be,
        Fe,
        qe,
        Me,
        Te
      ), ce = v(
        me,
        xe,
        _e,
        Be,
        Ae,
        be,
        Fe,
        qe,
        Me,
        Te
      );
      me = $(q, P), xe = V(q, P), _e = O(q, P, R, w, M), Be = D(q, P, R, w, M, x);
      var ge = t(me, xe, _e, Be), we = n(me, xe, _e, Be);
      G = ee, z = ae, ee = N, ae = F, N = Q, F = U, Q = t(L, K, oe, ce), U = n(K, K, oe, ce), L = M, K = x, M = R, x = w, R = q, w = P, q = t(oe, ce, ge, we), P = n(oe, ce, ge, we);
    }
    o(this.h, 0, q, P), o(this.h, 2, R, w), o(this.h, 4, M, x), o(this.h, 6, L, K), o(this.h, 8, Q, U), o(this.h, 10, N, F), o(this.h, 12, ee, ae), o(this.h, 14, G, z);
  }, B.prototype._digest = function(l) {
    return l === "hex" ? c.toHex32(this.h, "big") : c.split32(this.h, "big");
  };
  function E(g, l, _, A, q) {
    var P = g & _ ^ ~g & q;
    return P < 0 && (P += 4294967296), P;
  }
  function S(g, l, _, A, q, P) {
    var R = l & A ^ ~l & P;
    return R < 0 && (R += 4294967296), R;
  }
  function O(g, l, _, A, q) {
    var P = g & _ ^ g & q ^ _ & q;
    return P < 0 && (P += 4294967296), P;
  }
  function D(g, l, _, A, q, P) {
    var R = l & A ^ l & P ^ A & P;
    return R < 0 && (R += 4294967296), R;
  }
  function $(g, l) {
    var _ = f(g, l, 28), A = f(l, g, 2), q = f(l, g, 7), P = _ ^ A ^ q;
    return P < 0 && (P += 4294967296), P;
  }
  function V(g, l) {
    var _ = p(g, l, 28), A = p(l, g, 2), q = p(l, g, 7), P = _ ^ A ^ q;
    return P < 0 && (P += 4294967296), P;
  }
  function J(g, l) {
    var _ = f(g, l, 14), A = f(g, l, 18), q = f(l, g, 9), P = _ ^ A ^ q;
    return P < 0 && (P += 4294967296), P;
  }
  function ie(g, l) {
    var _ = p(g, l, 14), A = p(g, l, 18), q = p(l, g, 9), P = _ ^ A ^ q;
    return P < 0 && (P += 4294967296), P;
  }
  function ne(g, l) {
    var _ = f(g, l, 1), A = f(g, l, 8), q = r(g, l, 7), P = _ ^ A ^ q;
    return P < 0 && (P += 4294967296), P;
  }
  function le(g, l) {
    var _ = p(g, l, 1), A = p(g, l, 8), q = u(g, l, 7), P = _ ^ A ^ q;
    return P < 0 && (P += 4294967296), P;
  }
  function Y(g, l) {
    var _ = f(g, l, 19), A = f(l, g, 29), q = r(g, l, 6), P = _ ^ A ^ q;
    return P < 0 && (P += 4294967296), P;
  }
  function b(g, l) {
    var _ = p(g, l, 19), A = p(l, g, 29), q = u(g, l, 6), P = _ ^ A ^ q;
    return P < 0 && (P += 4294967296), P;
  }
  return _512;
}
var _384, hasRequired_384;
function require_384() {
  if (hasRequired_384) return _384;
  hasRequired_384 = 1;
  var c = requireUtils$1(), a = require_512();
  function h() {
    if (!(this instanceof h))
      return new h();
    a.call(this), this.h = [
      3418070365,
      3238371032,
      1654270250,
      914150663,
      2438529370,
      812702999,
      355462360,
      4144912697,
      1731405415,
      4290775857,
      2394180231,
      1750603025,
      3675008525,
      1694076839,
      1203062813,
      3204075428
    ];
  }
  return c.inherits(h, a), _384 = h, h.blockSize = 1024, h.outSize = 384, h.hmacStrength = 192, h.padLength = 128, h.prototype._digest = function(p) {
    return p === "hex" ? c.toHex32(this.h.slice(0, 12), "big") : c.split32(this.h.slice(0, 12), "big");
  }, _384;
}
var hasRequiredSha;
function requireSha() {
  return hasRequiredSha || (hasRequiredSha = 1, sha.sha1 = require_1(), sha.sha224 = require_224(), sha.sha256 = require_256(), sha.sha384 = require_384(), sha.sha512 = require_512()), sha;
}
var ripemd = {}, hasRequiredRipemd;
function requireRipemd() {
  if (hasRequiredRipemd) return ripemd;
  hasRequiredRipemd = 1;
  var c = requireUtils$1(), a = requireCommon$1(), h = c.rotl32, f = c.sum32, p = c.sum32_3, r = c.sum32_4, u = a.BlockHash;
  function o() {
    if (!(this instanceof o))
      return new o();
    u.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little";
  }
  c.inherits(o, u), ripemd.ripemd160 = o, o.blockSize = 512, o.outSize = 160, o.hmacStrength = 192, o.padLength = 64, o.prototype._update = function(B, E) {
    for (var S = this.h[0], O = this.h[1], D = this.h[2], $ = this.h[3], V = this.h[4], J = S, ie = O, ne = D, le = $, Y = V, b = 0; b < 80; b++) {
      var g = f(
        h(
          r(S, t(b, O, D, $), B[s[b] + E], n(b)),
          v[b]
        ),
        V
      );
      S = V, V = $, $ = h(D, 10), D = O, O = g, g = f(
        h(
          r(J, t(79 - b, ie, ne, le), B[d[b] + E], e(b)),
          y[b]
        ),
        Y
      ), J = Y, Y = le, le = h(ne, 10), ne = ie, ie = g;
    }
    g = p(this.h[1], D, le), this.h[1] = p(this.h[2], $, Y), this.h[2] = p(this.h[3], V, J), this.h[3] = p(this.h[4], S, ie), this.h[4] = p(this.h[0], O, ne), this.h[0] = g;
  }, o.prototype._digest = function(B) {
    return B === "hex" ? c.toHex32(this.h, "little") : c.split32(this.h, "little");
  };
  function t(m, B, E, S) {
    return m <= 15 ? B ^ E ^ S : m <= 31 ? B & E | ~B & S : m <= 47 ? (B | ~E) ^ S : m <= 63 ? B & S | E & ~S : B ^ (E | ~S);
  }
  function n(m) {
    return m <= 15 ? 0 : m <= 31 ? 1518500249 : m <= 47 ? 1859775393 : m <= 63 ? 2400959708 : 2840853838;
  }
  function e(m) {
    return m <= 15 ? 1352829926 : m <= 31 ? 1548603684 : m <= 47 ? 1836072691 : m <= 63 ? 2053994217 : 0;
  }
  var s = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    7,
    4,
    13,
    1,
    10,
    6,
    15,
    3,
    12,
    0,
    9,
    5,
    2,
    14,
    11,
    8,
    3,
    10,
    14,
    4,
    9,
    15,
    8,
    1,
    2,
    7,
    0,
    6,
    13,
    11,
    5,
    12,
    1,
    9,
    11,
    10,
    0,
    8,
    12,
    4,
    13,
    3,
    7,
    15,
    14,
    5,
    6,
    2,
    4,
    0,
    5,
    9,
    7,
    12,
    2,
    10,
    14,
    1,
    3,
    8,
    11,
    6,
    15,
    13
  ], d = [
    5,
    14,
    7,
    0,
    9,
    2,
    11,
    4,
    13,
    6,
    15,
    8,
    1,
    10,
    3,
    12,
    6,
    11,
    3,
    7,
    0,
    13,
    5,
    10,
    14,
    15,
    8,
    12,
    4,
    9,
    1,
    2,
    15,
    5,
    1,
    3,
    7,
    14,
    6,
    9,
    11,
    8,
    12,
    2,
    10,
    0,
    4,
    13,
    8,
    6,
    4,
    1,
    3,
    11,
    15,
    0,
    5,
    12,
    2,
    13,
    9,
    7,
    10,
    14,
    12,
    15,
    10,
    4,
    1,
    5,
    8,
    7,
    6,
    2,
    13,
    14,
    0,
    3,
    9,
    11
  ], v = [
    11,
    14,
    15,
    12,
    5,
    8,
    7,
    9,
    11,
    13,
    14,
    15,
    6,
    7,
    9,
    8,
    7,
    6,
    8,
    13,
    11,
    9,
    7,
    15,
    7,
    12,
    15,
    9,
    11,
    7,
    13,
    12,
    11,
    13,
    6,
    7,
    14,
    9,
    13,
    15,
    14,
    8,
    13,
    6,
    5,
    12,
    7,
    5,
    11,
    12,
    14,
    15,
    14,
    15,
    9,
    8,
    9,
    14,
    5,
    6,
    8,
    6,
    5,
    12,
    9,
    15,
    5,
    11,
    6,
    8,
    13,
    12,
    5,
    12,
    13,
    14,
    11,
    8,
    5,
    6
  ], y = [
    8,
    9,
    9,
    11,
    13,
    15,
    15,
    5,
    7,
    7,
    8,
    11,
    14,
    14,
    12,
    6,
    9,
    13,
    15,
    7,
    12,
    8,
    9,
    11,
    7,
    7,
    12,
    7,
    6,
    15,
    13,
    11,
    9,
    7,
    15,
    11,
    8,
    6,
    6,
    14,
    12,
    13,
    5,
    14,
    13,
    13,
    7,
    5,
    15,
    5,
    8,
    11,
    14,
    14,
    6,
    14,
    6,
    9,
    12,
    9,
    12,
    5,
    15,
    8,
    8,
    5,
    12,
    9,
    12,
    5,
    14,
    6,
    8,
    13,
    6,
    5,
    15,
    13,
    11,
    11
  ];
  return ripemd;
}
var hmac, hasRequiredHmac;
function requireHmac() {
  if (hasRequiredHmac) return hmac;
  hasRequiredHmac = 1;
  var c = requireUtils$1(), a = requireMinimalisticAssert();
  function h(f, p, r) {
    if (!(this instanceof h))
      return new h(f, p, r);
    this.Hash = f, this.blockSize = f.blockSize / 8, this.outSize = f.outSize / 8, this.inner = null, this.outer = null, this._init(c.toArray(p, r));
  }
  return hmac = h, h.prototype._init = function(p) {
    p.length > this.blockSize && (p = new this.Hash().update(p).digest()), a(p.length <= this.blockSize);
    for (var r = p.length; r < this.blockSize; r++)
      p.push(0);
    for (r = 0; r < p.length; r++)
      p[r] ^= 54;
    for (this.inner = new this.Hash().update(p), r = 0; r < p.length; r++)
      p[r] ^= 106;
    this.outer = new this.Hash().update(p);
  }, h.prototype.update = function(p, r) {
    return this.inner.update(p, r), this;
  }, h.prototype.digest = function(p) {
    return this.outer.update(this.inner.digest()), this.outer.digest(p);
  }, hmac;
}
var hasRequiredHash;
function requireHash() {
  return hasRequiredHash || (hasRequiredHash = 1, (function(c) {
    var a = c;
    a.utils = requireUtils$1(), a.common = requireCommon$1(), a.sha = requireSha(), a.ripemd = requireRipemd(), a.hmac = requireHmac(), a.sha1 = a.sha.sha1, a.sha256 = a.sha.sha256, a.sha224 = a.sha.sha224, a.sha384 = a.sha.sha384, a.sha512 = a.sha.sha512, a.ripemd160 = a.ripemd.ripemd160;
  })(hash)), hash;
}
var secp256k1, hasRequiredSecp256k1;
function requireSecp256k1() {
  return hasRequiredSecp256k1 || (hasRequiredSecp256k1 = 1, secp256k1 = {
    doubles: {
      step: 4,
      points: [
        [
          "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a",
          "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"
        ],
        [
          "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508",
          "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"
        ],
        [
          "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739",
          "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"
        ],
        [
          "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640",
          "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"
        ],
        [
          "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c",
          "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"
        ],
        [
          "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda",
          "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"
        ],
        [
          "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa",
          "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"
        ],
        [
          "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0",
          "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"
        ],
        [
          "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d",
          "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"
        ],
        [
          "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d",
          "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"
        ],
        [
          "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1",
          "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"
        ],
        [
          "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0",
          "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"
        ],
        [
          "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047",
          "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"
        ],
        [
          "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862",
          "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"
        ],
        [
          "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7",
          "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"
        ],
        [
          "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd",
          "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"
        ],
        [
          "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83",
          "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"
        ],
        [
          "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a",
          "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"
        ],
        [
          "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8",
          "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"
        ],
        [
          "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d",
          "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"
        ],
        [
          "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725",
          "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"
        ],
        [
          "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754",
          "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"
        ],
        [
          "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c",
          "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"
        ],
        [
          "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6",
          "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"
        ],
        [
          "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39",
          "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"
        ],
        [
          "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891",
          "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"
        ],
        [
          "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b",
          "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"
        ],
        [
          "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03",
          "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"
        ],
        [
          "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d",
          "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"
        ],
        [
          "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070",
          "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"
        ],
        [
          "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4",
          "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"
        ],
        [
          "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da",
          "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"
        ],
        [
          "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11",
          "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"
        ],
        [
          "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e",
          "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"
        ],
        [
          "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41",
          "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"
        ],
        [
          "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef",
          "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"
        ],
        [
          "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8",
          "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"
        ],
        [
          "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d",
          "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"
        ],
        [
          "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96",
          "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"
        ],
        [
          "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd",
          "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"
        ],
        [
          "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5",
          "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"
        ],
        [
          "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266",
          "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"
        ],
        [
          "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71",
          "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"
        ],
        [
          "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac",
          "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"
        ],
        [
          "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751",
          "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"
        ],
        [
          "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e",
          "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"
        ],
        [
          "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241",
          "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"
        ],
        [
          "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3",
          "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"
        ],
        [
          "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f",
          "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"
        ],
        [
          "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19",
          "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"
        ],
        [
          "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be",
          "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"
        ],
        [
          "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9",
          "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"
        ],
        [
          "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2",
          "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"
        ],
        [
          "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13",
          "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"
        ],
        [
          "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c",
          "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"
        ],
        [
          "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba",
          "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"
        ],
        [
          "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151",
          "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"
        ],
        [
          "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073",
          "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"
        ],
        [
          "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458",
          "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"
        ],
        [
          "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b",
          "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"
        ],
        [
          "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366",
          "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"
        ],
        [
          "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa",
          "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"
        ],
        [
          "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0",
          "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"
        ],
        [
          "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787",
          "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"
        ],
        [
          "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e",
          "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"
        ]
      ]
    },
    naf: {
      wnd: 7,
      points: [
        [
          "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9",
          "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"
        ],
        [
          "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4",
          "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"
        ],
        [
          "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc",
          "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"
        ],
        [
          "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe",
          "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"
        ],
        [
          "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb",
          "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"
        ],
        [
          "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8",
          "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"
        ],
        [
          "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e",
          "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"
        ],
        [
          "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34",
          "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"
        ],
        [
          "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c",
          "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"
        ],
        [
          "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5",
          "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"
        ],
        [
          "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f",
          "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"
        ],
        [
          "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714",
          "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"
        ],
        [
          "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729",
          "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"
        ],
        [
          "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db",
          "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"
        ],
        [
          "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4",
          "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"
        ],
        [
          "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5",
          "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"
        ],
        [
          "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479",
          "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"
        ],
        [
          "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d",
          "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"
        ],
        [
          "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f",
          "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"
        ],
        [
          "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb",
          "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"
        ],
        [
          "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9",
          "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"
        ],
        [
          "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963",
          "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"
        ],
        [
          "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74",
          "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"
        ],
        [
          "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530",
          "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"
        ],
        [
          "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b",
          "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"
        ],
        [
          "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247",
          "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"
        ],
        [
          "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1",
          "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"
        ],
        [
          "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120",
          "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"
        ],
        [
          "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435",
          "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"
        ],
        [
          "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18",
          "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"
        ],
        [
          "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8",
          "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"
        ],
        [
          "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb",
          "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"
        ],
        [
          "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f",
          "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"
        ],
        [
          "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143",
          "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"
        ],
        [
          "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba",
          "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"
        ],
        [
          "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45",
          "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"
        ],
        [
          "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a",
          "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"
        ],
        [
          "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e",
          "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"
        ],
        [
          "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8",
          "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"
        ],
        [
          "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c",
          "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"
        ],
        [
          "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519",
          "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"
        ],
        [
          "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab",
          "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"
        ],
        [
          "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca",
          "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"
        ],
        [
          "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf",
          "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"
        ],
        [
          "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610",
          "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"
        ],
        [
          "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4",
          "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"
        ],
        [
          "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c",
          "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"
        ],
        [
          "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940",
          "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"
        ],
        [
          "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980",
          "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"
        ],
        [
          "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3",
          "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"
        ],
        [
          "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf",
          "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"
        ],
        [
          "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63",
          "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"
        ],
        [
          "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448",
          "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"
        ],
        [
          "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf",
          "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"
        ],
        [
          "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5",
          "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"
        ],
        [
          "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6",
          "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"
        ],
        [
          "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5",
          "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"
        ],
        [
          "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99",
          "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"
        ],
        [
          "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51",
          "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"
        ],
        [
          "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5",
          "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"
        ],
        [
          "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5",
          "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"
        ],
        [
          "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997",
          "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"
        ],
        [
          "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881",
          "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"
        ],
        [
          "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5",
          "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"
        ],
        [
          "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66",
          "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"
        ],
        [
          "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726",
          "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"
        ],
        [
          "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede",
          "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"
        ],
        [
          "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94",
          "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"
        ],
        [
          "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31",
          "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"
        ],
        [
          "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51",
          "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"
        ],
        [
          "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252",
          "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"
        ],
        [
          "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5",
          "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"
        ],
        [
          "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b",
          "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"
        ],
        [
          "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4",
          "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"
        ],
        [
          "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f",
          "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"
        ],
        [
          "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889",
          "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"
        ],
        [
          "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246",
          "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"
        ],
        [
          "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984",
          "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"
        ],
        [
          "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a",
          "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"
        ],
        [
          "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030",
          "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"
        ],
        [
          "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197",
          "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"
        ],
        [
          "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593",
          "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"
        ],
        [
          "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef",
          "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"
        ],
        [
          "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38",
          "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"
        ],
        [
          "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a",
          "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"
        ],
        [
          "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111",
          "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"
        ],
        [
          "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502",
          "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"
        ],
        [
          "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea",
          "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"
        ],
        [
          "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26",
          "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"
        ],
        [
          "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986",
          "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"
        ],
        [
          "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e",
          "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"
        ],
        [
          "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4",
          "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"
        ],
        [
          "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda",
          "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"
        ],
        [
          "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859",
          "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"
        ],
        [
          "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f",
          "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"
        ],
        [
          "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c",
          "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"
        ],
        [
          "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942",
          "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"
        ],
        [
          "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a",
          "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"
        ],
        [
          "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80",
          "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"
        ],
        [
          "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d",
          "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"
        ],
        [
          "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1",
          "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"
        ],
        [
          "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63",
          "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"
        ],
        [
          "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352",
          "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"
        ],
        [
          "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193",
          "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"
        ],
        [
          "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00",
          "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"
        ],
        [
          "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58",
          "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"
        ],
        [
          "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7",
          "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"
        ],
        [
          "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8",
          "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"
        ],
        [
          "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e",
          "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"
        ],
        [
          "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d",
          "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"
        ],
        [
          "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b",
          "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"
        ],
        [
          "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f",
          "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"
        ],
        [
          "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6",
          "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"
        ],
        [
          "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297",
          "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"
        ],
        [
          "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a",
          "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"
        ],
        [
          "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c",
          "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"
        ],
        [
          "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52",
          "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"
        ],
        [
          "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb",
          "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"
        ],
        [
          "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065",
          "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"
        ],
        [
          "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917",
          "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"
        ],
        [
          "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9",
          "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"
        ],
        [
          "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3",
          "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"
        ],
        [
          "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57",
          "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"
        ],
        [
          "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66",
          "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"
        ],
        [
          "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8",
          "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"
        ],
        [
          "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721",
          "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"
        ],
        [
          "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180",
          "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"
        ]
      ]
    }
  }), secp256k1;
}
var hasRequiredCurves;
function requireCurves() {
  return hasRequiredCurves || (hasRequiredCurves = 1, (function(c) {
    var a = c, h = requireHash(), f = requireCurve(), p = requireUtils$2(), r = p.assert;
    function u(n) {
      n.type === "short" ? this.curve = new f.short(n) : n.type === "edwards" ? this.curve = new f.edwards(n) : this.curve = new f.mont(n), this.g = this.curve.g, this.n = this.curve.n, this.hash = n.hash, r(this.g.validate(), "Invalid curve"), r(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
    }
    a.PresetCurve = u;
    function o(n, e) {
      Object.defineProperty(a, n, {
        configurable: !0,
        enumerable: !0,
        get: function() {
          var s = new u(e);
          return Object.defineProperty(a, n, {
            configurable: !0,
            enumerable: !0,
            value: s
          }), s;
        }
      });
    }
    o("p192", {
      type: "short",
      prime: "p192",
      p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
      b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
      n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
      hash: h.sha256,
      gRed: !1,
      g: [
        "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
        "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"
      ]
    }), o("p224", {
      type: "short",
      prime: "p224",
      p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
      b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
      n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
      hash: h.sha256,
      gRed: !1,
      g: [
        "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
        "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"
      ]
    }), o("p256", {
      type: "short",
      prime: null,
      p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
      a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
      b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
      n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
      hash: h.sha256,
      gRed: !1,
      g: [
        "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
        "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"
      ]
    }), o("p384", {
      type: "short",
      prime: null,
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
      a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
      b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
      n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
      hash: h.sha384,
      gRed: !1,
      g: [
        "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
        "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"
      ]
    }), o("p521", {
      type: "short",
      prime: null,
      p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
      a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
      b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
      n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
      hash: h.sha512,
      gRed: !1,
      g: [
        "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
        "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"
      ]
    }), o("curve25519", {
      type: "mont",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "76d06",
      b: "1",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: h.sha256,
      gRed: !1,
      g: [
        "9"
      ]
    }), o("ed25519", {
      type: "edwards",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "-1",
      c: "1",
      // -121665 * (121666^(-1)) (mod P)
      d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: h.sha256,
      gRed: !1,
      g: [
        "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
        // 4/5
        "6666666666666666666666666666666666666666666666666666666666666658"
      ]
    });
    var t;
    try {
      t = requireSecp256k1();
    } catch {
      t = void 0;
    }
    o("secp256k1", {
      type: "short",
      prime: "k256",
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
      a: "0",
      b: "7",
      n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
      h: "1",
      hash: h.sha256,
      // Precomputed endomorphism
      beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
      lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
      basis: [
        {
          a: "3086d221a7d46bcde86c90e49284eb15",
          b: "-e4437ed6010e88286f547fa90abfe4c3"
        },
        {
          a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
          b: "3086d221a7d46bcde86c90e49284eb15"
        }
      ],
      gRed: !1,
      g: [
        "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
        "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
        t
      ]
    });
  })(curves)), curves;
}
var hmacDrbg, hasRequiredHmacDrbg;
function requireHmacDrbg() {
  if (hasRequiredHmacDrbg) return hmacDrbg;
  hasRequiredHmacDrbg = 1;
  var c = requireHash(), a = requireUtils$3(), h = requireMinimalisticAssert();
  function f(p) {
    if (!(this instanceof f))
      return new f(p);
    this.hash = p.hash, this.predResist = !!p.predResist, this.outLen = this.hash.outSize, this.minEntropy = p.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
    var r = a.toArray(p.entropy, p.entropyEnc || "hex"), u = a.toArray(p.nonce, p.nonceEnc || "hex"), o = a.toArray(p.pers, p.persEnc || "hex");
    h(
      r.length >= this.minEntropy / 8,
      "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
    ), this._init(r, u, o);
  }
  return hmacDrbg = f, f.prototype._init = function(r, u, o) {
    var t = r.concat(u).concat(o);
    this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
    for (var n = 0; n < this.V.length; n++)
      this.K[n] = 0, this.V[n] = 1;
    this._update(t), this._reseed = 1, this.reseedInterval = 281474976710656;
  }, f.prototype._hmac = function() {
    return new c.hmac(this.hash, this.K);
  }, f.prototype._update = function(r) {
    var u = this._hmac().update(this.V).update([0]);
    r && (u = u.update(r)), this.K = u.digest(), this.V = this._hmac().update(this.V).digest(), r && (this.K = this._hmac().update(this.V).update([1]).update(r).digest(), this.V = this._hmac().update(this.V).digest());
  }, f.prototype.reseed = function(r, u, o, t) {
    typeof u != "string" && (t = o, o = u, u = null), r = a.toArray(r, u), o = a.toArray(o, t), h(
      r.length >= this.minEntropy / 8,
      "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
    ), this._update(r.concat(o || [])), this._reseed = 1;
  }, f.prototype.generate = function(r, u, o, t) {
    if (this._reseed > this.reseedInterval)
      throw new Error("Reseed is required");
    typeof u != "string" && (t = o, o = u, u = null), o && (o = a.toArray(o, t || "hex"), this._update(o));
    for (var n = []; n.length < r; )
      this.V = this._hmac().update(this.V).digest(), n = n.concat(this.V);
    var e = n.slice(0, r);
    return this._update(o), this._reseed++, a.encode(e, u);
  }, hmacDrbg;
}
var key$1, hasRequiredKey$1;
function requireKey$1() {
  if (hasRequiredKey$1) return key$1;
  hasRequiredKey$1 = 1;
  var c = requireBn$1(), a = requireUtils$2(), h = a.assert;
  function f(p, r) {
    this.ec = p, this.priv = null, this.pub = null, r.priv && this._importPrivate(r.priv, r.privEnc), r.pub && this._importPublic(r.pub, r.pubEnc);
  }
  return key$1 = f, f.fromPublic = function(r, u, o) {
    return u instanceof f ? u : new f(r, {
      pub: u,
      pubEnc: o
    });
  }, f.fromPrivate = function(r, u, o) {
    return u instanceof f ? u : new f(r, {
      priv: u,
      privEnc: o
    });
  }, f.prototype.validate = function() {
    var r = this.getPublic();
    return r.isInfinity() ? { result: !1, reason: "Invalid public key" } : r.validate() ? r.mul(this.ec.curve.n).isInfinity() ? { result: !0, reason: null } : { result: !1, reason: "Public key * N != O" } : { result: !1, reason: "Public key is not a point" };
  }, f.prototype.getPublic = function(r, u) {
    return typeof r == "string" && (u = r, r = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), u ? this.pub.encode(u, r) : this.pub;
  }, f.prototype.getPrivate = function(r) {
    return r === "hex" ? this.priv.toString(16, 2) : this.priv;
  }, f.prototype._importPrivate = function(r, u) {
    this.priv = new c(r, u || 16), this.priv = this.priv.umod(this.ec.curve.n);
  }, f.prototype._importPublic = function(r, u) {
    if (r.x || r.y) {
      this.ec.curve.type === "mont" ? h(r.x, "Need x coordinate") : (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") && h(r.x && r.y, "Need both x and y coordinate"), this.pub = this.ec.curve.point(r.x, r.y);
      return;
    }
    this.pub = this.ec.curve.decodePoint(r, u);
  }, f.prototype.derive = function(r) {
    return r.validate() || h(r.validate(), "public point not validated"), r.mul(this.priv).getX();
  }, f.prototype.sign = function(r, u, o) {
    return this.ec.sign(r, this, u, o);
  }, f.prototype.verify = function(r, u, o) {
    return this.ec.verify(r, u, this, void 0, o);
  }, f.prototype.inspect = function() {
    return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
  }, key$1;
}
var signature$1, hasRequiredSignature$1;
function requireSignature$1() {
  if (hasRequiredSignature$1) return signature$1;
  hasRequiredSignature$1 = 1;
  var c = requireBn$1(), a = requireUtils$2(), h = a.assert;
  function f(t, n) {
    if (t instanceof f)
      return t;
    this._importDER(t, n) || (h(t.r && t.s, "Signature without r or s"), this.r = new c(t.r, 16), this.s = new c(t.s, 16), t.recoveryParam === void 0 ? this.recoveryParam = null : this.recoveryParam = t.recoveryParam);
  }
  signature$1 = f;
  function p() {
    this.place = 0;
  }
  function r(t, n) {
    var e = t[n.place++];
    if (!(e & 128))
      return e;
    var s = e & 15;
    if (s === 0 || s > 4 || t[n.place] === 0)
      return !1;
    for (var d = 0, v = 0, y = n.place; v < s; v++, y++)
      d <<= 8, d |= t[y], d >>>= 0;
    return d <= 127 ? !1 : (n.place = y, d);
  }
  function u(t) {
    for (var n = 0, e = t.length - 1; !t[n] && !(t[n + 1] & 128) && n < e; )
      n++;
    return n === 0 ? t : t.slice(n);
  }
  f.prototype._importDER = function(n, e) {
    n = a.toArray(n, e);
    var s = new p();
    if (n[s.place++] !== 48)
      return !1;
    var d = r(n, s);
    if (d === !1 || d + s.place !== n.length || n[s.place++] !== 2)
      return !1;
    var v = r(n, s);
    if (v === !1 || (n[s.place] & 128) !== 0)
      return !1;
    var y = n.slice(s.place, v + s.place);
    if (s.place += v, n[s.place++] !== 2)
      return !1;
    var m = r(n, s);
    if (m === !1 || n.length !== m + s.place || (n[s.place] & 128) !== 0)
      return !1;
    var B = n.slice(s.place, m + s.place);
    if (y[0] === 0)
      if (y[1] & 128)
        y = y.slice(1);
      else
        return !1;
    if (B[0] === 0)
      if (B[1] & 128)
        B = B.slice(1);
      else
        return !1;
    return this.r = new c(y), this.s = new c(B), this.recoveryParam = null, !0;
  };
  function o(t, n) {
    if (n < 128) {
      t.push(n);
      return;
    }
    var e = 1 + (Math.log(n) / Math.LN2 >>> 3);
    for (t.push(e | 128); --e; )
      t.push(n >>> (e << 3) & 255);
    t.push(n);
  }
  return f.prototype.toDER = function(n) {
    var e = this.r.toArray(), s = this.s.toArray();
    for (e[0] & 128 && (e = [0].concat(e)), s[0] & 128 && (s = [0].concat(s)), e = u(e), s = u(s); !s[0] && !(s[1] & 128); )
      s = s.slice(1);
    var d = [2];
    o(d, e.length), d = d.concat(e), d.push(2), o(d, s.length);
    var v = d.concat(s), y = [48];
    return o(y, v.length), y = y.concat(v), a.encode(y, n);
  }, signature$1;
}
var ec, hasRequiredEc;
function requireEc() {
  if (hasRequiredEc) return ec;
  hasRequiredEc = 1;
  var c = requireBn$1(), a = requireHmacDrbg(), h = requireUtils$2(), f = requireCurves(), p = requireBrorand(), r = h.assert, u = requireKey$1(), o = requireSignature$1();
  function t(n) {
    if (!(this instanceof t))
      return new t(n);
    typeof n == "string" && (r(
      Object.prototype.hasOwnProperty.call(f, n),
      "Unknown curve " + n
    ), n = f[n]), n instanceof f.PresetCurve && (n = { curve: n }), this.curve = n.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = n.curve.g, this.g.precompute(n.curve.n.bitLength() + 1), this.hash = n.hash || n.curve.hash;
  }
  return ec = t, t.prototype.keyPair = function(e) {
    return new u(this, e);
  }, t.prototype.keyFromPrivate = function(e, s) {
    return u.fromPrivate(this, e, s);
  }, t.prototype.keyFromPublic = function(e, s) {
    return u.fromPublic(this, e, s);
  }, t.prototype.genKeyPair = function(e) {
    e || (e = {});
    for (var s = new a({
      hash: this.hash,
      pers: e.pers,
      persEnc: e.persEnc || "utf8",
      entropy: e.entropy || p(this.hash.hmacStrength),
      entropyEnc: e.entropy && e.entropyEnc || "utf8",
      nonce: this.n.toArray()
    }), d = this.n.byteLength(), v = this.n.sub(new c(2)); ; ) {
      var y = new c(s.generate(d));
      if (!(y.cmp(v) > 0))
        return y.iaddn(1), this.keyFromPrivate(y);
    }
  }, t.prototype._truncateToN = function(e, s, d) {
    var v;
    if (c.isBN(e) || typeof e == "number")
      e = new c(e, 16), v = e.byteLength();
    else if (typeof e == "object")
      v = e.length, e = new c(e, 16);
    else {
      var y = e.toString();
      v = y.length + 1 >>> 1, e = new c(y, 16);
    }
    typeof d != "number" && (d = v * 8);
    var m = d - this.n.bitLength();
    return m > 0 && (e = e.ushrn(m)), !s && e.cmp(this.n) >= 0 ? e.sub(this.n) : e;
  }, t.prototype.sign = function(e, s, d, v) {
    if (typeof d == "object" && (v = d, d = null), v || (v = {}), typeof e != "string" && typeof e != "number" && !c.isBN(e)) {
      r(
        typeof e == "object" && e && typeof e.length == "number",
        "Expected message to be an array-like, a hex string, or a BN instance"
      ), r(e.length >>> 0 === e.length);
      for (var y = 0; y < e.length; y++) r((e[y] & 255) === e[y]);
    }
    s = this.keyFromPrivate(s, d), e = this._truncateToN(e, !1, v.msgBitLength), r(!e.isNeg(), "Can not sign a negative message");
    var m = this.n.byteLength(), B = s.getPrivate().toArray("be", m), E = e.toArray("be", m);
    r(new c(E).eq(e), "Can not sign message");
    for (var S = new a({
      hash: this.hash,
      entropy: B,
      nonce: E,
      pers: v.pers,
      persEnc: v.persEnc || "utf8"
    }), O = this.n.sub(new c(1)), D = 0; ; D++) {
      var $ = v.k ? v.k(D) : new c(S.generate(this.n.byteLength()));
      if ($ = this._truncateToN($, !0), !($.cmpn(1) <= 0 || $.cmp(O) >= 0)) {
        var V = this.g.mul($);
        if (!V.isInfinity()) {
          var J = V.getX(), ie = J.umod(this.n);
          if (ie.cmpn(0) !== 0) {
            var ne = $.invm(this.n).mul(ie.mul(s.getPrivate()).iadd(e));
            if (ne = ne.umod(this.n), ne.cmpn(0) !== 0) {
              var le = (V.getY().isOdd() ? 1 : 0) | (J.cmp(ie) !== 0 ? 2 : 0);
              return v.canonical && ne.cmp(this.nh) > 0 && (ne = this.n.sub(ne), le ^= 1), new o({ r: ie, s: ne, recoveryParam: le });
            }
          }
        }
      }
    }
  }, t.prototype.verify = function(e, s, d, v, y) {
    y || (y = {}), e = this._truncateToN(e, !1, y.msgBitLength), d = this.keyFromPublic(d, v), s = new o(s, "hex");
    var m = s.r, B = s.s;
    if (m.cmpn(1) < 0 || m.cmp(this.n) >= 0 || B.cmpn(1) < 0 || B.cmp(this.n) >= 0)
      return !1;
    var E = B.invm(this.n), S = E.mul(e).umod(this.n), O = E.mul(m).umod(this.n), D;
    return this.curve._maxwellTrick ? (D = this.g.jmulAdd(S, d.getPublic(), O), D.isInfinity() ? !1 : D.eqXToP(m)) : (D = this.g.mulAdd(S, d.getPublic(), O), D.isInfinity() ? !1 : D.getX().umod(this.n).cmp(m) === 0);
  }, t.prototype.recoverPubKey = function(n, e, s, d) {
    r((3 & s) === s, "The recovery param is more than two bits"), e = new o(e, d);
    var v = this.n, y = new c(n), m = e.r, B = e.s, E = s & 1, S = s >> 1;
    if (m.cmp(this.curve.p.umod(this.curve.n)) >= 0 && S)
      throw new Error("Unable to find sencond key candinate");
    S ? m = this.curve.pointFromX(m.add(this.curve.n), E) : m = this.curve.pointFromX(m, E);
    var O = e.r.invm(v), D = v.sub(y).mul(O).umod(v), $ = B.mul(O).umod(v);
    return this.g.mulAdd(D, m, $);
  }, t.prototype.getKeyRecoveryParam = function(n, e, s, d) {
    if (e = new o(e, d), e.recoveryParam !== null)
      return e.recoveryParam;
    for (var v = 0; v < 4; v++) {
      var y;
      try {
        y = this.recoverPubKey(n, e, v);
      } catch {
        continue;
      }
      if (y.eq(s))
        return v;
    }
    throw new Error("Unable to find valid recovery factor");
  }, ec;
}
var key, hasRequiredKey;
function requireKey() {
  if (hasRequiredKey) return key;
  hasRequiredKey = 1;
  var c = requireUtils$2(), a = c.assert, h = c.parseBytes, f = c.cachedProperty;
  function p(r, u) {
    this.eddsa = r, this._secret = h(u.secret), r.isPoint(u.pub) ? this._pub = u.pub : this._pubBytes = h(u.pub);
  }
  return p.fromPublic = function(u, o) {
    return o instanceof p ? o : new p(u, { pub: o });
  }, p.fromSecret = function(u, o) {
    return o instanceof p ? o : new p(u, { secret: o });
  }, p.prototype.secret = function() {
    return this._secret;
  }, f(p, "pubBytes", function() {
    return this.eddsa.encodePoint(this.pub());
  }), f(p, "pub", function() {
    return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
  }), f(p, "privBytes", function() {
    var u = this.eddsa, o = this.hash(), t = u.encodingLength - 1, n = o.slice(0, u.encodingLength);
    return n[0] &= 248, n[t] &= 127, n[t] |= 64, n;
  }), f(p, "priv", function() {
    return this.eddsa.decodeInt(this.privBytes());
  }), f(p, "hash", function() {
    return this.eddsa.hash().update(this.secret()).digest();
  }), f(p, "messagePrefix", function() {
    return this.hash().slice(this.eddsa.encodingLength);
  }), p.prototype.sign = function(u) {
    return a(this._secret, "KeyPair can only verify"), this.eddsa.sign(u, this);
  }, p.prototype.verify = function(u, o) {
    return this.eddsa.verify(u, o, this);
  }, p.prototype.getSecret = function(u) {
    return a(this._secret, "KeyPair is public only"), c.encode(this.secret(), u);
  }, p.prototype.getPublic = function(u) {
    return c.encode(this.pubBytes(), u);
  }, key = p, key;
}
var signature, hasRequiredSignature;
function requireSignature() {
  if (hasRequiredSignature) return signature;
  hasRequiredSignature = 1;
  var c = requireBn$1(), a = requireUtils$2(), h = a.assert, f = a.cachedProperty, p = a.parseBytes;
  function r(u, o) {
    this.eddsa = u, typeof o != "object" && (o = p(o)), Array.isArray(o) && (h(o.length === u.encodingLength * 2, "Signature has invalid size"), o = {
      R: o.slice(0, u.encodingLength),
      S: o.slice(u.encodingLength)
    }), h(o.R && o.S, "Signature without R or S"), u.isPoint(o.R) && (this._R = o.R), o.S instanceof c && (this._S = o.S), this._Rencoded = Array.isArray(o.R) ? o.R : o.Rencoded, this._Sencoded = Array.isArray(o.S) ? o.S : o.Sencoded;
  }
  return f(r, "S", function() {
    return this.eddsa.decodeInt(this.Sencoded());
  }), f(r, "R", function() {
    return this.eddsa.decodePoint(this.Rencoded());
  }), f(r, "Rencoded", function() {
    return this.eddsa.encodePoint(this.R());
  }), f(r, "Sencoded", function() {
    return this.eddsa.encodeInt(this.S());
  }), r.prototype.toBytes = function() {
    return this.Rencoded().concat(this.Sencoded());
  }, r.prototype.toHex = function() {
    return a.encode(this.toBytes(), "hex").toUpperCase();
  }, signature = r, signature;
}
var eddsa, hasRequiredEddsa;
function requireEddsa() {
  if (hasRequiredEddsa) return eddsa;
  hasRequiredEddsa = 1;
  var c = requireHash(), a = requireCurves(), h = requireUtils$2(), f = h.assert, p = h.parseBytes, r = requireKey(), u = requireSignature();
  function o(t) {
    if (f(t === "ed25519", "only tested with ed25519 so far"), !(this instanceof o))
      return new o(t);
    t = a[t].curve, this.curve = t, this.g = t.g, this.g.precompute(t.n.bitLength() + 1), this.pointClass = t.point().constructor, this.encodingLength = Math.ceil(t.n.bitLength() / 8), this.hash = c.sha512;
  }
  return eddsa = o, o.prototype.sign = function(n, e) {
    n = p(n);
    var s = this.keyFromSecret(e), d = this.hashInt(s.messagePrefix(), n), v = this.g.mul(d), y = this.encodePoint(v), m = this.hashInt(y, s.pubBytes(), n).mul(s.priv()), B = d.add(m).umod(this.curve.n);
    return this.makeSignature({ R: v, S: B, Rencoded: y });
  }, o.prototype.verify = function(n, e, s) {
    if (n = p(n), e = this.makeSignature(e), e.S().gte(e.eddsa.curve.n) || e.S().isNeg())
      return !1;
    var d = this.keyFromPublic(s), v = this.hashInt(e.Rencoded(), d.pubBytes(), n), y = this.g.mul(e.S()), m = e.R().add(d.pub().mul(v));
    return m.eq(y);
  }, o.prototype.hashInt = function() {
    for (var n = this.hash(), e = 0; e < arguments.length; e++)
      n.update(arguments[e]);
    return h.intFromLE(n.digest()).umod(this.curve.n);
  }, o.prototype.keyFromPublic = function(n) {
    return r.fromPublic(this, n);
  }, o.prototype.keyFromSecret = function(n) {
    return r.fromSecret(this, n);
  }, o.prototype.makeSignature = function(n) {
    return n instanceof u ? n : new u(this, n);
  }, o.prototype.encodePoint = function(n) {
    var e = n.getY().toArray("le", this.encodingLength);
    return e[this.encodingLength - 1] |= n.getX().isOdd() ? 128 : 0, e;
  }, o.prototype.decodePoint = function(n) {
    n = h.parseBytes(n);
    var e = n.length - 1, s = n.slice(0, e).concat(n[e] & -129), d = (n[e] & 128) !== 0, v = h.intFromLE(s);
    return this.curve.pointFromY(v, d);
  }, o.prototype.encodeInt = function(n) {
    return n.toArray("le", this.encodingLength);
  }, o.prototype.decodeInt = function(n) {
    return h.intFromLE(n);
  }, o.prototype.isPoint = function(n) {
    return n instanceof this.pointClass;
  }, eddsa;
}
var hasRequiredElliptic;
function requireElliptic() {
  return hasRequiredElliptic || (hasRequiredElliptic = 1, (function(c) {
    var a = c;
    a.version = require$$0.version, a.utils = requireUtils$2(), a.rand = requireBrorand(), a.curve = requireCurve(), a.curves = requireCurves(), a.ec = requireEc(), a.eddsa = requireEddsa();
  })(elliptic)), elliptic;
}
var asn1$1 = {}, asn1 = {}, api = {}, vmBrowserify = {}, hasRequiredVmBrowserify;
function requireVmBrowserify() {
  return hasRequiredVmBrowserify || (hasRequiredVmBrowserify = 1, (function(exports$1) {
    var indexOf = function(c, a) {
      if (c.indexOf) return c.indexOf(a);
      for (var h = 0; h < c.length; h++)
        if (c[h] === a) return h;
      return -1;
    }, Object_keys = function(c) {
      if (Object.keys) return Object.keys(c);
      var a = [];
      for (var h in c) a.push(h);
      return a;
    }, forEach = function(c, a) {
      if (c.forEach) return c.forEach(a);
      for (var h = 0; h < c.length; h++)
        a(c[h], h, c);
    }, defineProp = (function() {
      try {
        return Object.defineProperty({}, "_", {}), function(c, a, h) {
          Object.defineProperty(c, a, {
            writable: !0,
            enumerable: !1,
            configurable: !0,
            value: h
          });
        };
      } catch {
        return function(a, h, f) {
          a[h] = f;
        };
      }
    })(), globals = [
      "Array",
      "Boolean",
      "Date",
      "Error",
      "EvalError",
      "Function",
      "Infinity",
      "JSON",
      "Math",
      "NaN",
      "Number",
      "Object",
      "RangeError",
      "ReferenceError",
      "RegExp",
      "String",
      "SyntaxError",
      "TypeError",
      "URIError",
      "decodeURI",
      "decodeURIComponent",
      "encodeURI",
      "encodeURIComponent",
      "escape",
      "eval",
      "isFinite",
      "isNaN",
      "parseFloat",
      "parseInt",
      "undefined",
      "unescape"
    ];
    function Context() {
    }
    Context.prototype = {};
    var Script = exports$1.Script = function(a) {
      if (!(this instanceof Script)) return new Script(a);
      this.code = a;
    };
    Script.prototype.runInContext = function(c) {
      if (!(c instanceof Context))
        throw new TypeError("needs a 'context' argument.");
      var a = document.createElement("iframe");
      a.style || (a.style = {}), a.style.display = "none", document.body.appendChild(a);
      var h = a.contentWindow, f = h.eval, p = h.execScript;
      !f && p && (p.call(h, "null"), f = h.eval), forEach(Object_keys(c), function(o) {
        h[o] = c[o];
      }), forEach(globals, function(o) {
        c[o] && (h[o] = c[o]);
      });
      var r = Object_keys(h), u = f.call(h, this.code);
      return forEach(Object_keys(h), function(o) {
        (o in c || indexOf(r, o) === -1) && (c[o] = h[o]);
      }), forEach(globals, function(o) {
        o in c || defineProp(c, o, h[o]);
      }), document.body.removeChild(a), u;
    }, Script.prototype.runInThisContext = function() {
      return eval(this.code);
    }, Script.prototype.runInNewContext = function(c) {
      var a = Script.createContext(c), h = this.runInContext(a);
      return c && forEach(Object_keys(a), function(f) {
        c[f] = a[f];
      }), h;
    }, forEach(Object_keys(Script.prototype), function(c) {
      exports$1[c] = Script[c] = function(a) {
        var h = Script(a);
        return h[c].apply(h, [].slice.call(arguments, 1));
      };
    }), exports$1.isContext = function(c) {
      return c instanceof Context;
    }, exports$1.createScript = function(c) {
      return exports$1.Script(c);
    }, exports$1.createContext = Script.createContext = function(c) {
      var a = new Context();
      return typeof c == "object" && forEach(Object_keys(c), function(h) {
        a[h] = c[h];
      }), a;
    };
  })(vmBrowserify)), vmBrowserify;
}
var hasRequiredApi;
function requireApi() {
  return hasRequiredApi || (hasRequiredApi = 1, (function(c) {
    var a = requireAsn1$1(), h = requireInherits_browser(), f = c;
    f.define = function(u, o) {
      return new p(u, o);
    };
    function p(r, u) {
      this.name = r, this.body = u, this.decoders = {}, this.encoders = {};
    }
    p.prototype._createNamed = function(u) {
      var o;
      try {
        o = requireVmBrowserify().runInThisContext(
          "(function " + this.name + `(entity) {
  this._initNamed(entity);
})`
        );
      } catch {
        o = function(n) {
          this._initNamed(n);
        };
      }
      return h(o, u), o.prototype._initNamed = function(n) {
        u.call(this, n);
      }, new o(this);
    }, p.prototype._getDecoder = function(u) {
      return u = u || "der", this.decoders.hasOwnProperty(u) || (this.decoders[u] = this._createNamed(a.decoders[u])), this.decoders[u];
    }, p.prototype.decode = function(u, o, t) {
      return this._getDecoder(o).decode(u, t);
    }, p.prototype._getEncoder = function(u) {
      return u = u || "der", this.encoders.hasOwnProperty(u) || (this.encoders[u] = this._createNamed(a.encoders[u])), this.encoders[u];
    }, p.prototype.encode = function(u, o, t) {
      return this._getEncoder(o).encode(u, t);
    };
  })(api)), api;
}
var base = {}, reporter = {}, hasRequiredReporter;
function requireReporter() {
  if (hasRequiredReporter) return reporter;
  hasRequiredReporter = 1;
  var c = requireInherits_browser();
  function a(f) {
    this._reporterState = {
      obj: null,
      path: [],
      options: f || {},
      errors: []
    };
  }
  reporter.Reporter = a, a.prototype.isError = function(p) {
    return p instanceof h;
  }, a.prototype.save = function() {
    var p = this._reporterState;
    return { obj: p.obj, pathLen: p.path.length };
  }, a.prototype.restore = function(p) {
    var r = this._reporterState;
    r.obj = p.obj, r.path = r.path.slice(0, p.pathLen);
  }, a.prototype.enterKey = function(p) {
    return this._reporterState.path.push(p);
  }, a.prototype.exitKey = function(p) {
    var r = this._reporterState;
    r.path = r.path.slice(0, p - 1);
  }, a.prototype.leaveKey = function(p, r, u) {
    var o = this._reporterState;
    this.exitKey(p), o.obj !== null && (o.obj[r] = u);
  }, a.prototype.path = function() {
    return this._reporterState.path.join("/");
  }, a.prototype.enterObject = function() {
    var p = this._reporterState, r = p.obj;
    return p.obj = {}, r;
  }, a.prototype.leaveObject = function(p) {
    var r = this._reporterState, u = r.obj;
    return r.obj = p, u;
  }, a.prototype.error = function(p) {
    var r, u = this._reporterState, o = p instanceof h;
    if (o ? r = p : r = new h(u.path.map(function(t) {
      return "[" + JSON.stringify(t) + "]";
    }).join(""), p.message || p, p.stack), !u.options.partial)
      throw r;
    return o || u.errors.push(r), r;
  }, a.prototype.wrapResult = function(p) {
    var r = this._reporterState;
    return r.options.partial ? {
      result: this.isError(p) ? null : p,
      errors: r.errors
    } : p;
  };
  function h(f, p) {
    this.path = f, this.rethrow(p);
  }
  return c(h, Error), h.prototype.rethrow = function(p) {
    if (this.message = p + " at: " + (this.path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this, h), !this.stack)
      try {
        throw new Error(this.message);
      } catch (r) {
        this.stack = r.stack;
      }
    return this;
  }, reporter;
}
var buffer = {}, hasRequiredBuffer;
function requireBuffer() {
  if (hasRequiredBuffer) return buffer;
  hasRequiredBuffer = 1;
  var c = requireInherits_browser(), a = requireBase().Reporter, h = requireDist().Buffer;
  function f(r, u) {
    if (a.call(this, u), !h.isBuffer(r)) {
      this.error("Input not Buffer");
      return;
    }
    this.base = r, this.offset = 0, this.length = r.length;
  }
  c(f, a), buffer.DecoderBuffer = f, f.prototype.save = function() {
    return { offset: this.offset, reporter: a.prototype.save.call(this) };
  }, f.prototype.restore = function(u) {
    var o = new f(this.base);
    return o.offset = u.offset, o.length = this.offset, this.offset = u.offset, a.prototype.restore.call(this, u.reporter), o;
  }, f.prototype.isEmpty = function() {
    return this.offset === this.length;
  }, f.prototype.readUInt8 = function(u) {
    return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(u || "DecoderBuffer overrun");
  }, f.prototype.skip = function(u, o) {
    if (!(this.offset + u <= this.length))
      return this.error(o || "DecoderBuffer overrun");
    var t = new f(this.base);
    return t._reporterState = this._reporterState, t.offset = this.offset, t.length = this.offset + u, this.offset += u, t;
  }, f.prototype.raw = function(u) {
    return this.base.slice(u ? u.offset : this.offset, this.length);
  };
  function p(r, u) {
    if (Array.isArray(r))
      this.length = 0, this.value = r.map(function(o) {
        return o instanceof p || (o = new p(o, u)), this.length += o.length, o;
      }, this);
    else if (typeof r == "number") {
      if (!(0 <= r && r <= 255))
        return u.error("non-byte EncoderBuffer value");
      this.value = r, this.length = 1;
    } else if (typeof r == "string")
      this.value = r, this.length = h.byteLength(r);
    else if (h.isBuffer(r))
      this.value = r, this.length = r.length;
    else
      return u.error("Unsupported type: " + typeof r);
  }
  return buffer.EncoderBuffer = p, p.prototype.join = function(u, o) {
    return u || (u = new h(this.length)), o || (o = 0), this.length === 0 || (Array.isArray(this.value) ? this.value.forEach(function(t) {
      t.join(u, o), o += t.length;
    }) : (typeof this.value == "number" ? u[o] = this.value : typeof this.value == "string" ? u.write(this.value, o) : h.isBuffer(this.value) && this.value.copy(u, o), o += this.length)), u;
  }, buffer;
}
var node, hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node;
  hasRequiredNode = 1;
  var c = requireBase().Reporter, a = requireBase().EncoderBuffer, h = requireBase().DecoderBuffer, f = requireMinimalisticAssert(), p = [
    "seq",
    "seqof",
    "set",
    "setof",
    "objid",
    "bool",
    "gentime",
    "utctime",
    "null_",
    "enum",
    "int",
    "objDesc",
    "bitstr",
    "bmpstr",
    "charstr",
    "genstr",
    "graphstr",
    "ia5str",
    "iso646str",
    "numstr",
    "octstr",
    "printstr",
    "t61str",
    "unistr",
    "utf8str",
    "videostr"
  ], r = [
    "key",
    "obj",
    "use",
    "optional",
    "explicit",
    "implicit",
    "def",
    "choice",
    "any",
    "contains"
  ].concat(p), u = [
    "_peekTag",
    "_decodeTag",
    "_use",
    "_decodeStr",
    "_decodeObjid",
    "_decodeTime",
    "_decodeNull",
    "_decodeInt",
    "_decodeBool",
    "_decodeList",
    "_encodeComposite",
    "_encodeStr",
    "_encodeObjid",
    "_encodeTime",
    "_encodeNull",
    "_encodeInt",
    "_encodeBool"
  ];
  function o(n, e) {
    var s = {};
    this._baseState = s, s.enc = n, s.parent = e || null, s.children = null, s.tag = null, s.args = null, s.reverseArgs = null, s.choice = null, s.optional = !1, s.any = !1, s.obj = !1, s.use = null, s.useDecoder = null, s.key = null, s.default = null, s.explicit = null, s.implicit = null, s.contains = null, s.parent || (s.children = [], this._wrap());
  }
  node = o;
  var t = [
    "enc",
    "parent",
    "children",
    "tag",
    "args",
    "reverseArgs",
    "choice",
    "optional",
    "any",
    "obj",
    "use",
    "alteredUse",
    "key",
    "default",
    "explicit",
    "implicit",
    "contains"
  ];
  return o.prototype.clone = function() {
    var e = this._baseState, s = {};
    t.forEach(function(v) {
      s[v] = e[v];
    });
    var d = new this.constructor(s.parent);
    return d._baseState = s, d;
  }, o.prototype._wrap = function() {
    var e = this._baseState;
    r.forEach(function(s) {
      this[s] = function() {
        var v = new this.constructor(this);
        return e.children.push(v), v[s].apply(v, arguments);
      };
    }, this);
  }, o.prototype._init = function(e) {
    var s = this._baseState;
    f(s.parent === null), e.call(this), s.children = s.children.filter(function(d) {
      return d._baseState.parent === this;
    }, this), f.equal(s.children.length, 1, "Root node can have only one child");
  }, o.prototype._useArgs = function(e) {
    var s = this._baseState, d = e.filter(function(v) {
      return v instanceof this.constructor;
    }, this);
    e = e.filter(function(v) {
      return !(v instanceof this.constructor);
    }, this), d.length !== 0 && (f(s.children === null), s.children = d, d.forEach(function(v) {
      v._baseState.parent = this;
    }, this)), e.length !== 0 && (f(s.args === null), s.args = e, s.reverseArgs = e.map(function(v) {
      if (typeof v != "object" || v.constructor !== Object)
        return v;
      var y = {};
      return Object.keys(v).forEach(function(m) {
        m == (m | 0) && (m |= 0);
        var B = v[m];
        y[B] = m;
      }), y;
    }));
  }, u.forEach(function(n) {
    o.prototype[n] = function() {
      var s = this._baseState;
      throw new Error(n + " not implemented for encoding: " + s.enc);
    };
  }), p.forEach(function(n) {
    o.prototype[n] = function() {
      var s = this._baseState, d = Array.prototype.slice.call(arguments);
      return f(s.tag === null), s.tag = n, this._useArgs(d), this;
    };
  }), o.prototype.use = function(e) {
    f(e);
    var s = this._baseState;
    return f(s.use === null), s.use = e, this;
  }, o.prototype.optional = function() {
    var e = this._baseState;
    return e.optional = !0, this;
  }, o.prototype.def = function(e) {
    var s = this._baseState;
    return f(s.default === null), s.default = e, s.optional = !0, this;
  }, o.prototype.explicit = function(e) {
    var s = this._baseState;
    return f(s.explicit === null && s.implicit === null), s.explicit = e, this;
  }, o.prototype.implicit = function(e) {
    var s = this._baseState;
    return f(s.explicit === null && s.implicit === null), s.implicit = e, this;
  }, o.prototype.obj = function() {
    var e = this._baseState, s = Array.prototype.slice.call(arguments);
    return e.obj = !0, s.length !== 0 && this._useArgs(s), this;
  }, o.prototype.key = function(e) {
    var s = this._baseState;
    return f(s.key === null), s.key = e, this;
  }, o.prototype.any = function() {
    var e = this._baseState;
    return e.any = !0, this;
  }, o.prototype.choice = function(e) {
    var s = this._baseState;
    return f(s.choice === null), s.choice = e, this._useArgs(Object.keys(e).map(function(d) {
      return e[d];
    })), this;
  }, o.prototype.contains = function(e) {
    var s = this._baseState;
    return f(s.use === null), s.contains = e, this;
  }, o.prototype._decode = function(e, s) {
    var d = this._baseState;
    if (d.parent === null)
      return e.wrapResult(d.children[0]._decode(e, s));
    var v = d.default, y = !0, m = null;
    if (d.key !== null && (m = e.enterKey(d.key)), d.optional) {
      var B = null;
      if (d.explicit !== null ? B = d.explicit : d.implicit !== null ? B = d.implicit : d.tag !== null && (B = d.tag), B === null && !d.any) {
        var E = e.save();
        try {
          d.choice === null ? this._decodeGeneric(d.tag, e, s) : this._decodeChoice(e, s), y = !0;
        } catch {
          y = !1;
        }
        e.restore(E);
      } else if (y = this._peekTag(e, B, d.any), e.isError(y))
        return y;
    }
    var S;
    if (d.obj && y && (S = e.enterObject()), y) {
      if (d.explicit !== null) {
        var O = this._decodeTag(e, d.explicit);
        if (e.isError(O))
          return O;
        e = O;
      }
      var D = e.offset;
      if (d.use === null && d.choice === null) {
        if (d.any)
          var E = e.save();
        var $ = this._decodeTag(
          e,
          d.implicit !== null ? d.implicit : d.tag,
          d.any
        );
        if (e.isError($))
          return $;
        d.any ? v = e.raw(E) : e = $;
      }
      if (s && s.track && d.tag !== null && s.track(e.path(), D, e.length, "tagged"), s && s.track && d.tag !== null && s.track(e.path(), e.offset, e.length, "content"), d.any ? v = v : d.choice === null ? v = this._decodeGeneric(d.tag, e, s) : v = this._decodeChoice(e, s), e.isError(v))
        return v;
      if (!d.any && d.choice === null && d.children !== null && d.children.forEach(function(ie) {
        ie._decode(e, s);
      }), d.contains && (d.tag === "octstr" || d.tag === "bitstr")) {
        var V = new h(v);
        v = this._getUse(d.contains, e._reporterState.obj)._decode(V, s);
      }
    }
    return d.obj && y && (v = e.leaveObject(S)), d.key !== null && (v !== null || y === !0) ? e.leaveKey(m, d.key, v) : m !== null && e.exitKey(m), v;
  }, o.prototype._decodeGeneric = function(e, s, d) {
    var v = this._baseState;
    return e === "seq" || e === "set" ? null : e === "seqof" || e === "setof" ? this._decodeList(s, e, v.args[0], d) : /str$/.test(e) ? this._decodeStr(s, e, d) : e === "objid" && v.args ? this._decodeObjid(s, v.args[0], v.args[1], d) : e === "objid" ? this._decodeObjid(s, null, null, d) : e === "gentime" || e === "utctime" ? this._decodeTime(s, e, d) : e === "null_" ? this._decodeNull(s, d) : e === "bool" ? this._decodeBool(s, d) : e === "objDesc" ? this._decodeStr(s, e, d) : e === "int" || e === "enum" ? this._decodeInt(s, v.args && v.args[0], d) : v.use !== null ? this._getUse(v.use, s._reporterState.obj)._decode(s, d) : s.error("unknown tag: " + e);
  }, o.prototype._getUse = function(e, s) {
    var d = this._baseState;
    return d.useDecoder = this._use(e, s), f(d.useDecoder._baseState.parent === null), d.useDecoder = d.useDecoder._baseState.children[0], d.implicit !== d.useDecoder._baseState.implicit && (d.useDecoder = d.useDecoder.clone(), d.useDecoder._baseState.implicit = d.implicit), d.useDecoder;
  }, o.prototype._decodeChoice = function(e, s) {
    var d = this._baseState, v = null, y = !1;
    return Object.keys(d.choice).some(function(m) {
      var B = e.save(), E = d.choice[m];
      try {
        var S = E._decode(e, s);
        if (e.isError(S))
          return !1;
        v = { type: m, value: S }, y = !0;
      } catch {
        return e.restore(B), !1;
      }
      return !0;
    }, this), y ? v : e.error("Choice not matched");
  }, o.prototype._createEncoderBuffer = function(e) {
    return new a(e, this.reporter);
  }, o.prototype._encode = function(e, s, d) {
    var v = this._baseState;
    if (!(v.default !== null && v.default === e)) {
      var y = this._encodeValue(e, s, d);
      if (y !== void 0 && !this._skipDefault(y, s, d))
        return y;
    }
  }, o.prototype._encodeValue = function(e, s, d) {
    var v = this._baseState;
    if (v.parent === null)
      return v.children[0]._encode(e, s || new c());
    var E = null;
    if (this.reporter = s, v.optional && e === void 0)
      if (v.default !== null)
        e = v.default;
      else
        return;
    var y = null, m = !1;
    if (v.any)
      E = this._createEncoderBuffer(e);
    else if (v.choice)
      E = this._encodeChoice(e, s);
    else if (v.contains)
      y = this._getUse(v.contains, d)._encode(e, s), m = !0;
    else if (v.children)
      y = v.children.map(function(D) {
        if (D._baseState.tag === "null_")
          return D._encode(null, s, e);
        if (D._baseState.key === null)
          return s.error("Child should have a key");
        var $ = s.enterKey(D._baseState.key);
        if (typeof e != "object")
          return s.error("Child expected, but input is not object");
        var V = D._encode(e[D._baseState.key], s, e);
        return s.leaveKey($), V;
      }, this).filter(function(D) {
        return D;
      }), y = this._createEncoderBuffer(y);
    else if (v.tag === "seqof" || v.tag === "setof") {
      if (!(v.args && v.args.length === 1))
        return s.error("Too many args for : " + v.tag);
      if (!Array.isArray(e))
        return s.error("seqof/setof, but data is not Array");
      var B = this.clone();
      B._baseState.implicit = null, y = this._createEncoderBuffer(e.map(function(D) {
        var $ = this._baseState;
        return this._getUse($.args[0], e)._encode(D, s);
      }, B));
    } else v.use !== null ? E = this._getUse(v.use, d)._encode(e, s) : (y = this._encodePrimitive(v.tag, e), m = !0);
    var E;
    if (!v.any && v.choice === null) {
      var S = v.implicit !== null ? v.implicit : v.tag, O = v.implicit === null ? "universal" : "context";
      S === null ? v.use === null && s.error("Tag could be omitted only for .use()") : v.use === null && (E = this._encodeComposite(S, m, O, y));
    }
    return v.explicit !== null && (E = this._encodeComposite(v.explicit, !1, "context", E)), E;
  }, o.prototype._encodeChoice = function(e, s) {
    var d = this._baseState, v = d.choice[e.type];
    return v || f(
      !1,
      e.type + " not found in " + JSON.stringify(Object.keys(d.choice))
    ), v._encode(e.value, s);
  }, o.prototype._encodePrimitive = function(e, s) {
    var d = this._baseState;
    if (/str$/.test(e))
      return this._encodeStr(s, e);
    if (e === "objid" && d.args)
      return this._encodeObjid(s, d.reverseArgs[0], d.args[1]);
    if (e === "objid")
      return this._encodeObjid(s, null, null);
    if (e === "gentime" || e === "utctime")
      return this._encodeTime(s, e);
    if (e === "null_")
      return this._encodeNull();
    if (e === "int" || e === "enum")
      return this._encodeInt(s, d.args && d.reverseArgs[0]);
    if (e === "bool")
      return this._encodeBool(s);
    if (e === "objDesc")
      return this._encodeStr(s, e);
    throw new Error("Unsupported tag: " + e);
  }, o.prototype._isNumstr = function(e) {
    return /^[0-9 ]*$/.test(e);
  }, o.prototype._isPrintstr = function(e) {
    return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(e);
  }, node;
}
var hasRequiredBase;
function requireBase() {
  return hasRequiredBase || (hasRequiredBase = 1, (function(c) {
    var a = c;
    a.Reporter = requireReporter().Reporter, a.DecoderBuffer = requireBuffer().DecoderBuffer, a.EncoderBuffer = requireBuffer().EncoderBuffer, a.Node = requireNode();
  })(base)), base;
}
var constants = {}, der = {}, hasRequiredDer$2;
function requireDer$2() {
  return hasRequiredDer$2 || (hasRequiredDer$2 = 1, (function(c) {
    var a = requireConstants();
    c.tagClass = {
      0: "universal",
      1: "application",
      2: "context",
      3: "private"
    }, c.tagClassByName = a._reverse(c.tagClass), c.tag = {
      0: "end",
      1: "bool",
      2: "int",
      3: "bitstr",
      4: "octstr",
      5: "null_",
      6: "objid",
      7: "objDesc",
      8: "external",
      9: "real",
      10: "enum",
      11: "embed",
      12: "utf8str",
      13: "relativeOid",
      16: "seq",
      17: "set",
      18: "numstr",
      19: "printstr",
      20: "t61str",
      21: "videostr",
      22: "ia5str",
      23: "utctime",
      24: "gentime",
      25: "graphstr",
      26: "iso646str",
      27: "genstr",
      28: "unistr",
      29: "charstr",
      30: "bmpstr"
    }, c.tagByName = a._reverse(c.tag);
  })(der)), der;
}
var hasRequiredConstants;
function requireConstants() {
  return hasRequiredConstants || (hasRequiredConstants = 1, (function(c) {
    var a = c;
    a._reverse = function(f) {
      var p = {};
      return Object.keys(f).forEach(function(r) {
        (r | 0) == r && (r = r | 0);
        var u = f[r];
        p[u] = r;
      }), p;
    }, a.der = requireDer$2();
  })(constants)), constants;
}
var decoders = {}, der_1$1, hasRequiredDer$1;
function requireDer$1() {
  if (hasRequiredDer$1) return der_1$1;
  hasRequiredDer$1 = 1;
  var c = requireInherits_browser(), a = requireAsn1$1(), h = a.base, f = a.bignum, p = a.constants.der;
  function r(n) {
    this.enc = "der", this.name = n.name, this.entity = n, this.tree = new u(), this.tree._init(n.body);
  }
  der_1$1 = r, r.prototype.decode = function(e, s) {
    return e instanceof h.DecoderBuffer || (e = new h.DecoderBuffer(e, s)), this.tree._decode(e, s);
  };
  function u(n) {
    h.Node.call(this, "der", n);
  }
  c(u, h.Node), u.prototype._peekTag = function(e, s, d) {
    if (e.isEmpty())
      return !1;
    var v = e.save(), y = o(e, 'Failed to peek tag: "' + s + '"');
    return e.isError(y) ? y : (e.restore(v), y.tag === s || y.tagStr === s || y.tagStr + "of" === s || d);
  }, u.prototype._decodeTag = function(e, s, d) {
    var v = o(
      e,
      'Failed to decode tag of "' + s + '"'
    );
    if (e.isError(v))
      return v;
    var y = t(
      e,
      v.primitive,
      'Failed to get length of "' + s + '"'
    );
    if (e.isError(y))
      return y;
    if (!d && v.tag !== s && v.tagStr !== s && v.tagStr + "of" !== s)
      return e.error('Failed to match tag: "' + s + '"');
    if (v.primitive || y !== null)
      return e.skip(y, 'Failed to match body of: "' + s + '"');
    var m = e.save(), B = this._skipUntilEnd(
      e,
      'Failed to skip indefinite length body: "' + this.tag + '"'
    );
    return e.isError(B) ? B : (y = e.offset - m.offset, e.restore(m), e.skip(y, 'Failed to match body of: "' + s + '"'));
  }, u.prototype._skipUntilEnd = function(e, s) {
    for (; ; ) {
      var d = o(e, s);
      if (e.isError(d))
        return d;
      var v = t(e, d.primitive, s);
      if (e.isError(v))
        return v;
      var y;
      if (d.primitive || v !== null ? y = e.skip(v) : y = this._skipUntilEnd(e, s), e.isError(y))
        return y;
      if (d.tagStr === "end")
        break;
    }
  }, u.prototype._decodeList = function(e, s, d, v) {
    for (var y = []; !e.isEmpty(); ) {
      var m = this._peekTag(e, "end");
      if (e.isError(m))
        return m;
      var B = d.decode(e, "der", v);
      if (e.isError(B) && m)
        break;
      y.push(B);
    }
    return y;
  }, u.prototype._decodeStr = function(e, s) {
    if (s === "bitstr") {
      var d = e.readUInt8();
      return e.isError(d) ? d : { unused: d, data: e.raw() };
    } else if (s === "bmpstr") {
      var v = e.raw();
      if (v.length % 2 === 1)
        return e.error("Decoding of string type: bmpstr length mismatch");
      for (var y = "", m = 0; m < v.length / 2; m++)
        y += String.fromCharCode(v.readUInt16BE(m * 2));
      return y;
    } else if (s === "numstr") {
      var B = e.raw().toString("ascii");
      return this._isNumstr(B) ? B : e.error("Decoding of string type: numstr unsupported characters");
    } else {
      if (s === "octstr")
        return e.raw();
      if (s === "objDesc")
        return e.raw();
      if (s === "printstr") {
        var E = e.raw().toString("ascii");
        return this._isPrintstr(E) ? E : e.error("Decoding of string type: printstr unsupported characters");
      } else return /str$/.test(s) ? e.raw().toString() : e.error("Decoding of string type: " + s + " unsupported");
    }
  }, u.prototype._decodeObjid = function(e, s, d) {
    for (var v, y = [], m = 0; !e.isEmpty(); ) {
      var B = e.readUInt8();
      m <<= 7, m |= B & 127, (B & 128) === 0 && (y.push(m), m = 0);
    }
    B & 128 && y.push(m);
    var E = y[0] / 40 | 0, S = y[0] % 40;
    if (d ? v = y : v = [E, S].concat(y.slice(1)), s) {
      var O = s[v.join(" ")];
      O === void 0 && (O = s[v.join(".")]), O !== void 0 && (v = O);
    }
    return v;
  }, u.prototype._decodeTime = function(e, s) {
    var d = e.raw().toString();
    if (s === "gentime")
      var v = d.slice(0, 4) | 0, y = d.slice(4, 6) | 0, m = d.slice(6, 8) | 0, B = d.slice(8, 10) | 0, E = d.slice(10, 12) | 0, S = d.slice(12, 14) | 0;
    else if (s === "utctime") {
      var v = d.slice(0, 2) | 0, y = d.slice(2, 4) | 0, m = d.slice(4, 6) | 0, B = d.slice(6, 8) | 0, E = d.slice(8, 10) | 0, S = d.slice(10, 12) | 0;
      v < 70 ? v = 2e3 + v : v = 1900 + v;
    } else
      return e.error("Decoding " + s + " time is not supported yet");
    return Date.UTC(v, y - 1, m, B, E, S, 0);
  }, u.prototype._decodeNull = function(e) {
    return null;
  }, u.prototype._decodeBool = function(e) {
    var s = e.readUInt8();
    return e.isError(s) ? s : s !== 0;
  }, u.prototype._decodeInt = function(e, s) {
    var d = e.raw(), v = new f(d);
    return s && (v = s[v.toString(10)] || v), v;
  }, u.prototype._use = function(e, s) {
    return typeof e == "function" && (e = e(s)), e._getDecoder("der").tree;
  };
  function o(n, e) {
    var s = n.readUInt8(e);
    if (n.isError(s))
      return s;
    var d = p.tagClass[s >> 6], v = (s & 32) === 0;
    if ((s & 31) === 31) {
      var y = s;
      for (s = 0; (y & 128) === 128; ) {
        if (y = n.readUInt8(e), n.isError(y))
          return y;
        s <<= 7, s |= y & 127;
      }
    } else
      s &= 31;
    var m = p.tag[s];
    return {
      cls: d,
      primitive: v,
      tag: s,
      tagStr: m
    };
  }
  function t(n, e, s) {
    var d = n.readUInt8(s);
    if (n.isError(d))
      return d;
    if (!e && d === 128)
      return null;
    if ((d & 128) === 0)
      return d;
    var v = d & 127;
    if (v > 4)
      return n.error("length octect is too long");
    d = 0;
    for (var y = 0; y < v; y++) {
      d <<= 8;
      var m = n.readUInt8(s);
      if (n.isError(m))
        return m;
      d |= m;
    }
    return d;
  }
  return der_1$1;
}
var pem$1, hasRequiredPem$1;
function requirePem$1() {
  if (hasRequiredPem$1) return pem$1;
  hasRequiredPem$1 = 1;
  var c = requireInherits_browser(), a = requireDist().Buffer, h = requireDer$1();
  function f(p) {
    h.call(this, p), this.enc = "pem";
  }
  return c(f, h), pem$1 = f, f.prototype.decode = function(r, u) {
    for (var o = r.toString().split(/[\r\n]+/g), t = u.label.toUpperCase(), n = /^-----(BEGIN|END) ([^-]+)-----$/, e = -1, s = -1, d = 0; d < o.length; d++) {
      var v = o[d].match(n);
      if (v !== null && v[2] === t)
        if (e === -1) {
          if (v[1] !== "BEGIN")
            break;
          e = d;
        } else {
          if (v[1] !== "END")
            break;
          s = d;
          break;
        }
    }
    if (e === -1 || s === -1)
      throw new Error("PEM section not found for: " + t);
    var y = o.slice(e + 1, s).join("");
    y.replace(/[^a-z0-9\+\/=]+/gi, "");
    var m = new a(y, "base64");
    return h.prototype.decode.call(this, m, u);
  }, pem$1;
}
var hasRequiredDecoders;
function requireDecoders() {
  return hasRequiredDecoders || (hasRequiredDecoders = 1, (function(c) {
    var a = c;
    a.der = requireDer$1(), a.pem = requirePem$1();
  })(decoders)), decoders;
}
var encoders = {}, der_1, hasRequiredDer;
function requireDer() {
  if (hasRequiredDer) return der_1;
  hasRequiredDer = 1;
  var c = requireInherits_browser(), a = requireDist().Buffer, h = requireAsn1$1(), f = h.base, p = h.constants.der;
  function r(n) {
    this.enc = "der", this.name = n.name, this.entity = n, this.tree = new u(), this.tree._init(n.body);
  }
  der_1 = r, r.prototype.encode = function(e, s) {
    return this.tree._encode(e, s).join();
  };
  function u(n) {
    f.Node.call(this, "der", n);
  }
  c(u, f.Node), u.prototype._encodeComposite = function(e, s, d, v) {
    var y = t(e, s, d, this.reporter);
    if (v.length < 128) {
      var E = new a(2);
      return E[0] = y, E[1] = v.length, this._createEncoderBuffer([E, v]);
    }
    for (var m = 1, B = v.length; B >= 256; B >>= 8)
      m++;
    var E = new a(2 + m);
    E[0] = y, E[1] = 128 | m;
    for (var B = 1 + m, S = v.length; S > 0; B--, S >>= 8)
      E[B] = S & 255;
    return this._createEncoderBuffer([E, v]);
  }, u.prototype._encodeStr = function(e, s) {
    if (s === "bitstr")
      return this._createEncoderBuffer([e.unused | 0, e.data]);
    if (s === "bmpstr") {
      for (var d = new a(e.length * 2), v = 0; v < e.length; v++)
        d.writeUInt16BE(e.charCodeAt(v), v * 2);
      return this._createEncoderBuffer(d);
    } else return s === "numstr" ? this._isNumstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : s === "printstr" ? this._isPrintstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(s) ? this._createEncoderBuffer(e) : s === "objDesc" ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: " + s + " unsupported");
  }, u.prototype._encodeObjid = function(e, s, d) {
    if (typeof e == "string") {
      if (!s)
        return this.reporter.error("string objid given, but no values map found");
      if (!s.hasOwnProperty(e))
        return this.reporter.error("objid not found in values map");
      e = s[e].split(/[\s\.]+/g);
      for (var v = 0; v < e.length; v++)
        e[v] |= 0;
    } else if (Array.isArray(e)) {
      e = e.slice();
      for (var v = 0; v < e.length; v++)
        e[v] |= 0;
    }
    if (!Array.isArray(e))
      return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(e));
    if (!d) {
      if (e[1] >= 40)
        return this.reporter.error("Second objid identifier OOB");
      e.splice(0, 2, e[0] * 40 + e[1]);
    }
    for (var y = 0, v = 0; v < e.length; v++) {
      var m = e[v];
      for (y++; m >= 128; m >>= 7)
        y++;
    }
    for (var B = new a(y), E = B.length - 1, v = e.length - 1; v >= 0; v--) {
      var m = e[v];
      for (B[E--] = m & 127; (m >>= 7) > 0; )
        B[E--] = 128 | m & 127;
    }
    return this._createEncoderBuffer(B);
  };
  function o(n) {
    return n < 10 ? "0" + n : n;
  }
  u.prototype._encodeTime = function(e, s) {
    var d, v = new Date(e);
    return s === "gentime" ? d = [
      o(v.getFullYear()),
      o(v.getUTCMonth() + 1),
      o(v.getUTCDate()),
      o(v.getUTCHours()),
      o(v.getUTCMinutes()),
      o(v.getUTCSeconds()),
      "Z"
    ].join("") : s === "utctime" ? d = [
      o(v.getFullYear() % 100),
      o(v.getUTCMonth() + 1),
      o(v.getUTCDate()),
      o(v.getUTCHours()),
      o(v.getUTCMinutes()),
      o(v.getUTCSeconds()),
      "Z"
    ].join("") : this.reporter.error("Encoding " + s + " time is not supported yet"), this._encodeStr(d, "octstr");
  }, u.prototype._encodeNull = function() {
    return this._createEncoderBuffer("");
  }, u.prototype._encodeInt = function(e, s) {
    if (typeof e == "string") {
      if (!s)
        return this.reporter.error("String int or enum given, but no values map");
      if (!s.hasOwnProperty(e))
        return this.reporter.error("Values map doesn't contain: " + JSON.stringify(e));
      e = s[e];
    }
    if (typeof e != "number" && !a.isBuffer(e)) {
      var d = e.toArray();
      !e.sign && d[0] & 128 && d.unshift(0), e = new a(d);
    }
    if (a.isBuffer(e)) {
      var v = e.length;
      e.length === 0 && v++;
      var m = new a(v);
      return e.copy(m), e.length === 0 && (m[0] = 0), this._createEncoderBuffer(m);
    }
    if (e < 128)
      return this._createEncoderBuffer(e);
    if (e < 256)
      return this._createEncoderBuffer([0, e]);
    for (var v = 1, y = e; y >= 256; y >>= 8)
      v++;
    for (var m = new Array(v), y = m.length - 1; y >= 0; y--)
      m[y] = e & 255, e >>= 8;
    return m[0] & 128 && m.unshift(0), this._createEncoderBuffer(new a(m));
  }, u.prototype._encodeBool = function(e) {
    return this._createEncoderBuffer(e ? 255 : 0);
  }, u.prototype._use = function(e, s) {
    return typeof e == "function" && (e = e(s)), e._getEncoder("der").tree;
  }, u.prototype._skipDefault = function(e, s, d) {
    var v = this._baseState, y;
    if (v.default === null)
      return !1;
    var m = e.join();
    if (v.defaultBuffer === void 0 && (v.defaultBuffer = this._encodeValue(v.default, s, d).join()), m.length !== v.defaultBuffer.length)
      return !1;
    for (y = 0; y < m.length; y++)
      if (m[y] !== v.defaultBuffer[y])
        return !1;
    return !0;
  };
  function t(n, e, s, d) {
    var v;
    if (n === "seqof" ? n = "seq" : n === "setof" && (n = "set"), p.tagByName.hasOwnProperty(n))
      v = p.tagByName[n];
    else if (typeof n == "number" && (n | 0) === n)
      v = n;
    else
      return d.error("Unknown tag: " + n);
    return v >= 31 ? d.error("Multi-octet tag encoding unsupported") : (e || (v |= 32), v |= p.tagClassByName[s || "universal"] << 6, v);
  }
  return der_1;
}
var pem, hasRequiredPem;
function requirePem() {
  if (hasRequiredPem) return pem;
  hasRequiredPem = 1;
  var c = requireInherits_browser(), a = requireDer();
  function h(f) {
    a.call(this, f), this.enc = "pem";
  }
  return c(h, a), pem = h, h.prototype.encode = function(p, r) {
    for (var u = a.prototype.encode.call(this, p), o = u.toString("base64"), t = ["-----BEGIN " + r.label + "-----"], n = 0; n < o.length; n += 64)
      t.push(o.slice(n, n + 64));
    return t.push("-----END " + r.label + "-----"), t.join(`
`);
  }, pem;
}
var hasRequiredEncoders;
function requireEncoders() {
  return hasRequiredEncoders || (hasRequiredEncoders = 1, (function(c) {
    var a = c;
    a.der = requireDer(), a.pem = requirePem();
  })(encoders)), encoders;
}
var hasRequiredAsn1$1;
function requireAsn1$1() {
  return hasRequiredAsn1$1 || (hasRequiredAsn1$1 = 1, (function(c) {
    var a = c;
    a.bignum = requireBn$1(), a.define = requireApi().define, a.base = requireBase(), a.constants = requireConstants(), a.decoders = requireDecoders(), a.encoders = requireEncoders();
  })(asn1)), asn1;
}
var certificate, hasRequiredCertificate;
function requireCertificate() {
  if (hasRequiredCertificate) return certificate;
  hasRequiredCertificate = 1;
  var c = requireAsn1$1(), a = c.define("Time", function() {
    this.choice({
      utcTime: this.utctime(),
      generalTime: this.gentime()
    });
  }), h = c.define("AttributeTypeValue", function() {
    this.seq().obj(
      this.key("type").objid(),
      this.key("value").any()
    );
  }), f = c.define("AlgorithmIdentifier", function() {
    this.seq().obj(
      this.key("algorithm").objid(),
      this.key("parameters").optional(),
      this.key("curve").objid().optional()
    );
  }), p = c.define("SubjectPublicKeyInfo", function() {
    this.seq().obj(
      this.key("algorithm").use(f),
      this.key("subjectPublicKey").bitstr()
    );
  }), r = c.define("RelativeDistinguishedName", function() {
    this.setof(h);
  }), u = c.define("RDNSequence", function() {
    this.seqof(r);
  }), o = c.define("Name", function() {
    this.choice({
      rdnSequence: this.use(u)
    });
  }), t = c.define("Validity", function() {
    this.seq().obj(
      this.key("notBefore").use(a),
      this.key("notAfter").use(a)
    );
  }), n = c.define("Extension", function() {
    this.seq().obj(
      this.key("extnID").objid(),
      this.key("critical").bool().def(!1),
      this.key("extnValue").octstr()
    );
  }), e = c.define("TBSCertificate", function() {
    this.seq().obj(
      this.key("version").explicit(0).int().optional(),
      this.key("serialNumber").int(),
      this.key("signature").use(f),
      this.key("issuer").use(o),
      this.key("validity").use(t),
      this.key("subject").use(o),
      this.key("subjectPublicKeyInfo").use(p),
      this.key("issuerUniqueID").implicit(1).bitstr().optional(),
      this.key("subjectUniqueID").implicit(2).bitstr().optional(),
      this.key("extensions").explicit(3).seqof(n).optional()
    );
  }), s = c.define("X509Certificate", function() {
    this.seq().obj(
      this.key("tbsCertificate").use(e),
      this.key("signatureAlgorithm").use(f),
      this.key("signatureValue").bitstr()
    );
  });
  return certificate = s, certificate;
}
var hasRequiredAsn1;
function requireAsn1() {
  if (hasRequiredAsn1) return asn1$1;
  hasRequiredAsn1 = 1;
  var c = requireAsn1$1();
  asn1$1.certificate = requireCertificate();
  var a = c.define("RSAPrivateKey", function() {
    this.seq().obj(
      this.key("version").int(),
      this.key("modulus").int(),
      this.key("publicExponent").int(),
      this.key("privateExponent").int(),
      this.key("prime1").int(),
      this.key("prime2").int(),
      this.key("exponent1").int(),
      this.key("exponent2").int(),
      this.key("coefficient").int()
    );
  });
  asn1$1.RSAPrivateKey = a;
  var h = c.define("RSAPublicKey", function() {
    this.seq().obj(
      this.key("modulus").int(),
      this.key("publicExponent").int()
    );
  });
  asn1$1.RSAPublicKey = h;
  var f = c.define("AlgorithmIdentifier", function() {
    this.seq().obj(
      this.key("algorithm").objid(),
      this.key("none").null_().optional(),
      this.key("curve").objid().optional(),
      this.key("params").seq().obj(
        this.key("p").int(),
        this.key("q").int(),
        this.key("g").int()
      ).optional()
    );
  }), p = c.define("SubjectPublicKeyInfo", function() {
    this.seq().obj(
      this.key("algorithm").use(f),
      this.key("subjectPublicKey").bitstr()
    );
  });
  asn1$1.PublicKey = p;
  var r = c.define("PrivateKeyInfo", function() {
    this.seq().obj(
      this.key("version").int(),
      this.key("algorithm").use(f),
      this.key("subjectPrivateKey").octstr()
    );
  });
  asn1$1.PrivateKey = r;
  var u = c.define("EncryptedPrivateKeyInfo", function() {
    this.seq().obj(
      this.key("algorithm").seq().obj(
        this.key("id").objid(),
        this.key("decrypt").seq().obj(
          this.key("kde").seq().obj(
            this.key("id").objid(),
            this.key("kdeparams").seq().obj(
              this.key("salt").octstr(),
              this.key("iters").int()
            )
          ),
          this.key("cipher").seq().obj(
            this.key("algo").objid(),
            this.key("iv").octstr()
          )
        )
      ),
      this.key("subjectPrivateKey").octstr()
    );
  });
  asn1$1.EncryptedPrivateKey = u;
  var o = c.define("DSAPrivateKey", function() {
    this.seq().obj(
      this.key("version").int(),
      this.key("p").int(),
      this.key("q").int(),
      this.key("g").int(),
      this.key("pub_key").int(),
      this.key("priv_key").int()
    );
  });
  asn1$1.DSAPrivateKey = o, asn1$1.DSAparam = c.define("DSAparam", function() {
    this.int();
  });
  var t = c.define("ECParameters", function() {
    this.choice({
      namedCurve: this.objid()
    });
  }), n = c.define("ECPrivateKey", function() {
    this.seq().obj(
      this.key("version").int(),
      this.key("privateKey").octstr(),
      this.key("parameters").optional().explicit(0).use(t),
      this.key("publicKey").optional().explicit(1).bitstr()
    );
  });
  return asn1$1.ECPrivateKey = n, asn1$1.signature = c.define("signature", function() {
    this.seq().obj(
      this.key("r").int(),
      this.key("s").int()
    );
  }), asn1$1;
}
const require$$1 = {
  "2.16.840.1.101.3.4.1.1": "aes-128-ecb",
  "2.16.840.1.101.3.4.1.2": "aes-128-cbc",
  "2.16.840.1.101.3.4.1.3": "aes-128-ofb",
  "2.16.840.1.101.3.4.1.4": "aes-128-cfb",
  "2.16.840.1.101.3.4.1.21": "aes-192-ecb",
  "2.16.840.1.101.3.4.1.22": "aes-192-cbc",
  "2.16.840.1.101.3.4.1.23": "aes-192-ofb",
  "2.16.840.1.101.3.4.1.24": "aes-192-cfb",
  "2.16.840.1.101.3.4.1.41": "aes-256-ecb",
  "2.16.840.1.101.3.4.1.42": "aes-256-cbc",
  "2.16.840.1.101.3.4.1.43": "aes-256-ofb",
  "2.16.840.1.101.3.4.1.44": "aes-256-cfb"
};
var fixProc, hasRequiredFixProc;
function requireFixProc() {
  if (hasRequiredFixProc) return fixProc;
  hasRequiredFixProc = 1;
  var c = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r+/=]+)[\n\r]+/m, a = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m, h = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r+/=]+)-----END \1-----$/m, f = requireEvp_bytestokey(), p = requireBrowser$6(), r = requireSafeBuffer$1().Buffer;
  return fixProc = function(u, o) {
    var t = u.toString(), n = t.match(c), e;
    if (n) {
      var d = "aes" + n[1], v = r.from(n[2], "hex"), y = r.from(n[3].replace(/[\r\n]/g, ""), "base64"), m = f(o, v.slice(0, 8), parseInt(n[1], 10)).key, B = [], E = p.createDecipheriv(d, m, v);
      B.push(E.update(y)), B.push(E.final()), e = r.concat(B);
    } else {
      var s = t.match(h);
      e = r.from(s[2].replace(/[\r\n]/g, ""), "base64");
    }
    var S = t.match(a)[1];
    return {
      tag: S,
      data: e
    };
  }, fixProc;
}
var parseAsn1, hasRequiredParseAsn1;
function requireParseAsn1() {
  if (hasRequiredParseAsn1) return parseAsn1;
  hasRequiredParseAsn1 = 1;
  var c = requireAsn1(), a = require$$1, h = requireFixProc(), f = requireBrowser$6(), p = requireBrowser$7().pbkdf2Sync, r = requireSafeBuffer$1().Buffer;
  function u(t, n) {
    var e = t.algorithm.decrypt.kde.kdeparams.salt, s = parseInt(t.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), d = a[t.algorithm.decrypt.cipher.algo.join(".")], v = t.algorithm.decrypt.cipher.iv, y = t.subjectPrivateKey, m = parseInt(d.split("-")[1], 10) / 8, B = p(n, e, s, m, "sha1"), E = f.createDecipheriv(d, B, v), S = [];
    return S.push(E.update(y)), S.push(E.final()), r.concat(S);
  }
  function o(t) {
    var n;
    typeof t == "object" && !r.isBuffer(t) && (n = t.passphrase, t = t.key), typeof t == "string" && (t = r.from(t));
    var e = h(t, n), s = e.tag, d = e.data, v, y;
    switch (s) {
      case "CERTIFICATE":
        y = c.certificate.decode(d, "der").tbsCertificate.subjectPublicKeyInfo;
      // falls through
      case "PUBLIC KEY":
        switch (y || (y = c.PublicKey.decode(d, "der")), v = y.algorithm.algorithm.join("."), v) {
          case "1.2.840.113549.1.1.1":
            return c.RSAPublicKey.decode(y.subjectPublicKey.data, "der");
          case "1.2.840.10045.2.1":
            return y.subjectPrivateKey = y.subjectPublicKey, {
              type: "ec",
              data: y
            };
          case "1.2.840.10040.4.1":
            return y.algorithm.params.pub_key = c.DSAparam.decode(y.subjectPublicKey.data, "der"), {
              type: "dsa",
              data: y.algorithm.params
            };
          default:
            throw new Error("unknown key id " + v);
        }
      // throw new Error('unknown key type ' + type)
      case "ENCRYPTED PRIVATE KEY":
        d = c.EncryptedPrivateKey.decode(d, "der"), d = u(d, n);
      // falls through
      case "PRIVATE KEY":
        switch (y = c.PrivateKey.decode(d, "der"), v = y.algorithm.algorithm.join("."), v) {
          case "1.2.840.113549.1.1.1":
            return c.RSAPrivateKey.decode(y.subjectPrivateKey, "der");
          case "1.2.840.10045.2.1":
            return {
              curve: y.algorithm.curve,
              privateKey: c.ECPrivateKey.decode(y.subjectPrivateKey, "der").privateKey
            };
          case "1.2.840.10040.4.1":
            return y.algorithm.params.priv_key = c.DSAparam.decode(y.subjectPrivateKey, "der"), {
              type: "dsa",
              params: y.algorithm.params
            };
          default:
            throw new Error("unknown key id " + v);
        }
      // throw new Error('unknown key type ' + type)
      case "RSA PUBLIC KEY":
        return c.RSAPublicKey.decode(d, "der");
      case "RSA PRIVATE KEY":
        return c.RSAPrivateKey.decode(d, "der");
      case "DSA PRIVATE KEY":
        return {
          type: "dsa",
          params: c.DSAPrivateKey.decode(d, "der")
        };
      case "EC PRIVATE KEY":
        return d = c.ECPrivateKey.decode(d, "der"), {
          curve: d.parameters.value,
          privateKey: d.privateKey
        };
      default:
        throw new Error("unknown key type " + s);
    }
  }
  return o.signature = c.signature, parseAsn1 = o, parseAsn1;
}
const require$$4 = {
  "1.3.132.0.10": "secp256k1",
  "1.3.132.0.33": "p224",
  "1.2.840.10045.3.1.1": "p192",
  "1.2.840.10045.3.1.7": "p256",
  "1.3.132.0.34": "p384",
  "1.3.132.0.35": "p521"
};
var hasRequiredSign;
function requireSign() {
  if (hasRequiredSign) return sign.exports;
  hasRequiredSign = 1;
  var c = requireSafeBuffer$1().Buffer, a = requireBrowser$8(), h = /* @__PURE__ */ requireBrowserifyRsa(), f = requireElliptic().ec, p = requireBn(), r = requireParseAsn1(), u = require$$4, o = 1;
  function t(E, S, O, D, $) {
    var V = r(S);
    if (V.curve) {
      if (D !== "ecdsa" && D !== "ecdsa/rsa")
        throw new Error("wrong private key type");
      return n(E, V);
    } else if (V.type === "dsa") {
      if (D !== "dsa")
        throw new Error("wrong private key type");
      return e(E, V, O);
    }
    if (D !== "rsa" && D !== "ecdsa/rsa")
      throw new Error("wrong private key type");
    if (S.padding !== void 0 && S.padding !== o)
      throw new Error("illegal or unsupported padding mode");
    E = c.concat([$, E]);
    for (var J = V.modulus.byteLength(), ie = [0, 1]; E.length + ie.length + 1 < J; )
      ie.push(255);
    ie.push(0);
    for (var ne = -1; ++ne < E.length; )
      ie.push(E[ne]);
    var le = h(ie, V);
    return le;
  }
  function n(E, S) {
    var O = u[S.curve.join(".")];
    if (!O)
      throw new Error("unknown curve " + S.curve.join("."));
    var D = new f(O), $ = D.keyFromPrivate(S.privateKey), V = $.sign(E);
    return c.from(V.toDER());
  }
  function e(E, S, O) {
    for (var D = S.params.priv_key, $ = S.params.p, V = S.params.q, J = S.params.g, ie = new p(0), ne, le = v(E, V).mod(V), Y = !1, b = d(D, V, E, O); Y === !1; )
      ne = m(V, b, O), ie = B(J, ne, $, V), Y = ne.invm(V).imul(le.add(D.mul(ie))).mod(V), Y.cmpn(0) === 0 && (Y = !1, ie = new p(0));
    return s(ie, Y);
  }
  function s(E, S) {
    E = E.toArray(), S = S.toArray(), E[0] & 128 && (E = [0].concat(E)), S[0] & 128 && (S = [0].concat(S));
    var O = E.length + S.length + 4, D = [
      48,
      O,
      2,
      E.length
    ];
    return D = D.concat(E, [2, S.length], S), c.from(D);
  }
  function d(E, S, O, D) {
    if (E = c.from(E.toArray()), E.length < S.byteLength()) {
      var $ = c.alloc(S.byteLength() - E.length);
      E = c.concat([$, E]);
    }
    var V = O.length, J = y(O, S), ie = c.alloc(V);
    ie.fill(1);
    var ne = c.alloc(V);
    return ne = a(D, ne).update(ie).update(c.from([0])).update(E).update(J).digest(), ie = a(D, ne).update(ie).digest(), ne = a(D, ne).update(ie).update(c.from([1])).update(E).update(J).digest(), ie = a(D, ne).update(ie).digest(), { k: ne, v: ie };
  }
  function v(E, S) {
    var O = new p(E), D = (E.length << 3) - S.bitLength();
    return D > 0 && O.ishrn(D), O;
  }
  function y(E, S) {
    E = v(E, S), E = E.mod(S);
    var O = c.from(E.toArray());
    if (O.length < S.byteLength()) {
      var D = c.alloc(S.byteLength() - O.length);
      O = c.concat([D, O]);
    }
    return O;
  }
  function m(E, S, O) {
    var D, $;
    do {
      for (D = c.alloc(0); D.length * 8 < E.bitLength(); )
        S.v = a(O, S.k).update(S.v).digest(), D = c.concat([D, S.v]);
      $ = v(D, E), S.k = a(O, S.k).update(S.v).update(c.from([0])).digest(), S.v = a(O, S.k).update(S.v).digest();
    } while ($.cmp(E) !== -1);
    return $;
  }
  function B(E, S, O, D) {
    return E.toRed(p.mont(O)).redPow(S).fromRed().mod(D);
  }
  return sign.exports = t, sign.exports.getKey = d, sign.exports.makeKey = m, sign.exports;
}
var verify_1, hasRequiredVerify;
function requireVerify() {
  if (hasRequiredVerify) return verify_1;
  hasRequiredVerify = 1;
  var c = requireSafeBuffer$1().Buffer, a = requireBn(), h = requireElliptic().ec, f = requireParseAsn1(), p = require$$4;
  function r(n, e, s, d, v) {
    var y = f(s);
    if (y.type === "ec") {
      if (d !== "ecdsa" && d !== "ecdsa/rsa")
        throw new Error("wrong public key type");
      return u(n, e, y);
    } else if (y.type === "dsa") {
      if (d !== "dsa")
        throw new Error("wrong public key type");
      return o(n, e, y);
    }
    if (d !== "rsa" && d !== "ecdsa/rsa")
      throw new Error("wrong public key type");
    e = c.concat([v, e]);
    for (var m = y.modulus.byteLength(), B = [1], E = 0; e.length + B.length + 2 < m; )
      B.push(255), E += 1;
    B.push(0);
    for (var S = -1; ++S < e.length; )
      B.push(e[S]);
    B = c.from(B);
    var O = a.mont(y.modulus);
    n = new a(n).toRed(O), n = n.redPow(new a(y.publicExponent)), n = c.from(n.fromRed().toArray());
    var D = E < 8 ? 1 : 0;
    for (m = Math.min(n.length, B.length), n.length !== B.length && (D = 1), S = -1; ++S < m; )
      D |= n[S] ^ B[S];
    return D === 0;
  }
  function u(n, e, s) {
    var d = p[s.data.algorithm.curve.join(".")];
    if (!d)
      throw new Error("unknown curve " + s.data.algorithm.curve.join("."));
    var v = new h(d), y = s.data.subjectPrivateKey.data;
    return v.verify(e, n, y);
  }
  function o(n, e, s) {
    var d = s.data.p, v = s.data.q, y = s.data.g, m = s.data.pub_key, B = f.signature.decode(n, "der"), E = B.s, S = B.r;
    t(E, v), t(S, v);
    var O = a.mont(d), D = E.invm(v), $ = y.toRed(O).redPow(new a(e).mul(D).mod(v)).fromRed().mul(m.toRed(O).redPow(S.mul(D).mod(v)).fromRed()).mod(d).mod(v);
    return $.cmp(S) === 0;
  }
  function t(n, e) {
    if (n.cmpn(0) <= 0)
      throw new Error("invalid sig");
    if (n.cmp(e) >= 0)
      throw new Error("invalid sig");
  }
  return verify_1 = r, verify_1;
}
var browser$3, hasRequiredBrowser$3;
function requireBrowser$3() {
  if (hasRequiredBrowser$3) return browser$3;
  hasRequiredBrowser$3 = 1;
  var c = requireSafeBuffer$1().Buffer, a = requireBrowser$9(), h = requireReadableBrowser(), f = requireInherits_browser(), p = requireSign(), r = requireVerify(), u = require$$6;
  Object.keys(u).forEach(function(s) {
    u[s].id = c.from(u[s].id, "hex"), u[s.toLowerCase()] = u[s];
  });
  function o(s) {
    h.Writable.call(this);
    var d = u[s];
    if (!d)
      throw new Error("Unknown message digest");
    this._hashType = d.hash, this._hash = a(d.hash), this._tag = d.id, this._signType = d.sign;
  }
  f(o, h.Writable), o.prototype._write = function(d, v, y) {
    this._hash.update(d), y();
  }, o.prototype.update = function(d, v) {
    return this._hash.update(typeof d == "string" ? c.from(d, v) : d), this;
  }, o.prototype.sign = function(d, v) {
    this.end();
    var y = this._hash.digest(), m = p(y, d, this._hashType, this._signType, this._tag);
    return v ? m.toString(v) : m;
  };
  function t(s) {
    h.Writable.call(this);
    var d = u[s];
    if (!d)
      throw new Error("Unknown message digest");
    this._hash = a(d.hash), this._tag = d.id, this._signType = d.sign;
  }
  f(t, h.Writable), t.prototype._write = function(d, v, y) {
    this._hash.update(d), y();
  }, t.prototype.update = function(d, v) {
    return this._hash.update(typeof d == "string" ? c.from(d, v) : d), this;
  }, t.prototype.verify = function(d, v, y) {
    var m = typeof v == "string" ? c.from(v, y) : v;
    this.end();
    var B = this._hash.digest();
    return r(m, B, d, this._signType, this._tag);
  };
  function n(s) {
    return new o(s);
  }
  function e(s) {
    return new t(s);
  }
  return browser$3 = {
    Sign: n,
    Verify: e,
    createSign: n,
    createVerify: e
  }, browser$3;
}
var browser$2, hasRequiredBrowser$2;
function requireBrowser$2() {
  if (hasRequiredBrowser$2) return browser$2;
  hasRequiredBrowser$2 = 1;
  var c = requireElliptic(), a = requireBn$1();
  browser$2 = function(u) {
    return new f(u);
  };
  var h = {
    secp256k1: {
      name: "secp256k1",
      byteLength: 32
    },
    secp224r1: {
      name: "p224",
      byteLength: 28
    },
    prime256v1: {
      name: "p256",
      byteLength: 32
    },
    prime192v1: {
      name: "p192",
      byteLength: 24
    },
    ed25519: {
      name: "ed25519",
      byteLength: 32
    },
    secp384r1: {
      name: "p384",
      byteLength: 48
    },
    secp521r1: {
      name: "p521",
      byteLength: 66
    }
  };
  h.p224 = h.secp224r1, h.p256 = h.secp256r1 = h.prime256v1, h.p192 = h.secp192r1 = h.prime192v1, h.p384 = h.secp384r1, h.p521 = h.secp521r1;
  function f(r) {
    this.curveType = h[r], this.curveType || (this.curveType = {
      name: r
    }), this.curve = new c.ec(this.curveType.name), this.keys = void 0;
  }
  f.prototype.generateKeys = function(r, u) {
    return this.keys = this.curve.genKeyPair(), this.getPublicKey(r, u);
  }, f.prototype.computeSecret = function(r, u, o) {
    u = u || "utf8", Buffer.isBuffer(r) || (r = new Buffer(r, u));
    var t = this.curve.keyFromPublic(r).getPublic(), n = t.mul(this.keys.getPrivate()).getX();
    return p(n, o, this.curveType.byteLength);
  }, f.prototype.getPublicKey = function(r, u) {
    var o = this.keys.getPublic(u === "compressed", !0);
    return u === "hybrid" && (o[o.length - 1] % 2 ? o[0] = 7 : o[0] = 6), p(o, r);
  }, f.prototype.getPrivateKey = function(r) {
    return p(this.keys.getPrivate(), r);
  }, f.prototype.setPublicKey = function(r, u) {
    return u = u || "utf8", Buffer.isBuffer(r) || (r = new Buffer(r, u)), this.keys._importPublic(r), this;
  }, f.prototype.setPrivateKey = function(r, u) {
    u = u || "utf8", Buffer.isBuffer(r) || (r = new Buffer(r, u));
    var o = new a(r);
    return o = o.toString(16), this.keys = this.curve.genKeyPair(), this.keys._importPrivate(o), this;
  };
  function p(r, u, o) {
    Array.isArray(r) || (r = r.toArray());
    var t = new Buffer(r);
    if (o && t.length < o) {
      var n = new Buffer(o - t.length);
      n.fill(0), t = Buffer.concat([n, t]);
    }
    return u ? t.toString(u) : t;
  }
  return browser$2;
}
var browser$1 = {}, mgf, hasRequiredMgf;
function requireMgf() {
  if (hasRequiredMgf) return mgf;
  hasRequiredMgf = 1;
  var c = requireBrowser$9(), a = requireSafeBuffer$1().Buffer;
  mgf = function(f, p) {
    for (var r = a.alloc(0), u = 0, o; r.length < p; )
      o = h(u++), r = a.concat([r, c("sha1").update(f).update(o).digest()]);
    return r.slice(0, p);
  };
  function h(f) {
    var p = a.allocUnsafe(4);
    return p.writeUInt32BE(f, 0), p;
  }
  return mgf;
}
var xor, hasRequiredXor;
function requireXor() {
  return hasRequiredXor || (hasRequiredXor = 1, xor = function(a, h) {
    for (var f = a.length, p = -1; ++p < f; )
      a[p] ^= h[p];
    return a;
  }), xor;
}
var withPublic_1, hasRequiredWithPublic;
function requireWithPublic() {
  if (hasRequiredWithPublic) return withPublic_1;
  hasRequiredWithPublic = 1;
  var c = requireBn$1(), a = requireSafeBuffer$1().Buffer;
  function h(f, p) {
    return a.from(f.toRed(c.mont(p.modulus)).redPow(new c(p.publicExponent)).fromRed().toArray());
  }
  return withPublic_1 = h, withPublic_1;
}
var publicEncrypt, hasRequiredPublicEncrypt;
function requirePublicEncrypt() {
  if (hasRequiredPublicEncrypt) return publicEncrypt;
  hasRequiredPublicEncrypt = 1;
  var c = requireParseAsn1(), a = requireBrowser$b(), h = requireBrowser$9(), f = requireMgf(), p = requireXor(), r = requireBn$1(), u = requireWithPublic(), o = /* @__PURE__ */ requireBrowserifyRsa(), t = requireSafeBuffer$1().Buffer;
  publicEncrypt = function(v, y, m) {
    var B;
    v.padding ? B = v.padding : m ? B = 1 : B = 4;
    var E = c(v), S;
    if (B === 4)
      S = n(E, y);
    else if (B === 1)
      S = e(E, y, m);
    else if (B === 3) {
      if (S = new r(y), S.cmp(E.modulus) >= 0)
        throw new Error("data too long for modulus");
    } else
      throw new Error("unknown padding");
    return m ? o(S, E) : u(S, E);
  };
  function n(d, v) {
    var y = d.modulus.byteLength(), m = v.length, B = h("sha1").update(t.alloc(0)).digest(), E = B.length, S = 2 * E;
    if (m > y - S - 2)
      throw new Error("message too long");
    var O = t.alloc(y - m - S - 2), D = y - E - 1, $ = a(E), V = p(t.concat([B, O, t.alloc(1, 1), v], D), f($, D)), J = p($, f(V, E));
    return new r(t.concat([t.alloc(1), J, V], y));
  }
  function e(d, v, y) {
    var m = v.length, B = d.modulus.byteLength();
    if (m > B - 11)
      throw new Error("message too long");
    var E;
    return y ? E = t.alloc(B - m - 3, 255) : E = s(B - m - 3), new r(t.concat([t.from([0, y ? 1 : 2]), E, t.alloc(1), v], B));
  }
  function s(d) {
    for (var v = t.allocUnsafe(d), y = 0, m = a(d * 2), B = 0, E; y < d; )
      B === m.length && (m = a(d * 2), B = 0), E = m[B++], E && (v[y++] = E);
    return v;
  }
  return publicEncrypt;
}
var privateDecrypt, hasRequiredPrivateDecrypt;
function requirePrivateDecrypt() {
  if (hasRequiredPrivateDecrypt) return privateDecrypt;
  hasRequiredPrivateDecrypt = 1;
  var c = requireParseAsn1(), a = requireMgf(), h = requireXor(), f = requireBn$1(), p = /* @__PURE__ */ requireBrowserifyRsa(), r = requireBrowser$9(), u = requireWithPublic(), o = requireSafeBuffer$1().Buffer;
  privateDecrypt = function(d, v, y) {
    var m;
    d.padding ? m = d.padding : y ? m = 1 : m = 4;
    var B = c(d), E = B.modulus.byteLength();
    if (v.length > E || new f(v).cmp(B.modulus) >= 0)
      throw new Error("decryption error");
    var S;
    y ? S = u(new f(v), B) : S = p(v, B);
    var O = o.alloc(E - S.length);
    if (S = o.concat([O, S], E), m === 4)
      return t(B, S);
    if (m === 1)
      return n(B, S, y);
    if (m === 3)
      return S;
    throw new Error("unknown padding");
  };
  function t(s, d) {
    var v = s.modulus.byteLength(), y = r("sha1").update(o.alloc(0)).digest(), m = y.length;
    if (d[0] !== 0)
      throw new Error("decryption error");
    var B = d.slice(1, m + 1), E = d.slice(m + 1), S = h(B, a(E, m)), O = h(E, a(S, v - m - 1));
    if (e(y, O.slice(0, m)))
      throw new Error("decryption error");
    for (var D = m; O[D] === 0; )
      D++;
    if (O[D++] !== 1)
      throw new Error("decryption error");
    return O.slice(D);
  }
  function n(s, d, v) {
    for (var y = d.slice(0, 2), m = 2, B = 0; d[m++] !== 0; )
      if (m >= d.length) {
        B++;
        break;
      }
    var E = d.slice(2, m - 1);
    if ((y.toString("hex") !== "0002" && !v || y.toString("hex") !== "0001" && v) && B++, E.length < 8 && B++, B)
      throw new Error("decryption error");
    return d.slice(m);
  }
  function e(s, d) {
    s = o.from(s), d = o.from(d);
    var v = 0, y = s.length;
    s.length !== d.length && (v++, y = Math.min(s.length, d.length));
    for (var m = -1; ++m < y; )
      v += s[m] ^ d[m];
    return v;
  }
  return privateDecrypt;
}
var hasRequiredBrowser$1;
function requireBrowser$1() {
  return hasRequiredBrowser$1 || (hasRequiredBrowser$1 = 1, (function(c) {
    c.publicEncrypt = requirePublicEncrypt(), c.privateDecrypt = requirePrivateDecrypt(), c.privateEncrypt = function(h, f) {
      return c.publicEncrypt(h, f, !0);
    }, c.publicDecrypt = function(h, f) {
      return c.privateDecrypt(h, f, !0);
    };
  })(browser$1)), browser$1;
}
var browser = {}, hasRequiredBrowser;
function requireBrowser() {
  if (hasRequiredBrowser) return browser;
  hasRequiredBrowser = 1;
  function c() {
    throw new Error(`secure random number generation not supported by this browser
use chrome, FireFox or Internet Explorer 11`);
  }
  var a = requireSafeBuffer$1(), h = requireBrowser$b(), f = a.Buffer, p = a.kMaxLength, r = commonjsGlobal.crypto || commonjsGlobal.msCrypto, u = Math.pow(2, 32) - 1;
  function o(d, v) {
    if (typeof d != "number" || d !== d)
      throw new TypeError("offset must be a number");
    if (d > u || d < 0)
      throw new TypeError("offset must be a uint32");
    if (d > p || d > v)
      throw new RangeError("offset out of range");
  }
  function t(d, v, y) {
    if (typeof d != "number" || d !== d)
      throw new TypeError("size must be a number");
    if (d > u || d < 0)
      throw new TypeError("size must be a uint32");
    if (d + v > y || d > p)
      throw new RangeError("buffer too small");
  }
  r && r.getRandomValues || !process$1.browser ? (browser.randomFill = n, browser.randomFillSync = s) : (browser.randomFill = c, browser.randomFillSync = c);
  function n(d, v, y, m) {
    if (!f.isBuffer(d) && !(d instanceof commonjsGlobal.Uint8Array))
      throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
    if (typeof v == "function")
      m = v, v = 0, y = d.length;
    else if (typeof y == "function")
      m = y, y = d.length - v;
    else if (typeof m != "function")
      throw new TypeError('"cb" argument must be a function');
    return o(v, d.length), t(y, v, d.length), e(d, v, y, m);
  }
  function e(d, v, y, m) {
    if (process$1.browser) {
      var B = d.buffer, E = new Uint8Array(B, v, y);
      if (r.getRandomValues(E), m) {
        process$1.nextTick(function() {
          m(null, d);
        });
        return;
      }
      return d;
    }
    if (m) {
      h(y, function(O, D) {
        if (O)
          return m(O);
        D.copy(d, v), m(null, d);
      });
      return;
    }
    var S = h(y);
    return S.copy(d, v), d;
  }
  function s(d, v, y) {
    if (typeof v > "u" && (v = 0), !f.isBuffer(d) && !(d instanceof commonjsGlobal.Uint8Array))
      throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
    return o(v, d.length), y === void 0 && (y = d.length - v), t(y, v, d.length), e(d, v, y);
  }
  return browser;
}
var hasRequiredCryptoBrowserify;
function requireCryptoBrowserify() {
  if (hasRequiredCryptoBrowserify) return cryptoBrowserify;
  hasRequiredCryptoBrowserify = 1, cryptoBrowserify.randomBytes = cryptoBrowserify.rng = cryptoBrowserify.pseudoRandomBytes = cryptoBrowserify.prng = requireBrowser$b(), cryptoBrowserify.createHash = cryptoBrowserify.Hash = requireBrowser$9(), cryptoBrowserify.createHmac = cryptoBrowserify.Hmac = requireBrowser$8();
  var c = requireAlgos(), a = Object.keys(c), h = [
    "sha1",
    "sha224",
    "sha256",
    "sha384",
    "sha512",
    "md5",
    "rmd160"
  ].concat(a);
  cryptoBrowserify.getHashes = function() {
    return h;
  };
  var f = requireBrowser$7();
  cryptoBrowserify.pbkdf2 = f.pbkdf2, cryptoBrowserify.pbkdf2Sync = f.pbkdf2Sync;
  var p = requireBrowser$5();
  cryptoBrowserify.Cipher = p.Cipher, cryptoBrowserify.createCipher = p.createCipher, cryptoBrowserify.Cipheriv = p.Cipheriv, cryptoBrowserify.createCipheriv = p.createCipheriv, cryptoBrowserify.Decipher = p.Decipher, cryptoBrowserify.createDecipher = p.createDecipher, cryptoBrowserify.Decipheriv = p.Decipheriv, cryptoBrowserify.createDecipheriv = p.createDecipheriv, cryptoBrowserify.getCiphers = p.getCiphers, cryptoBrowserify.listCiphers = p.listCiphers;
  var r = requireBrowser$4();
  cryptoBrowserify.DiffieHellmanGroup = r.DiffieHellmanGroup, cryptoBrowserify.createDiffieHellmanGroup = r.createDiffieHellmanGroup, cryptoBrowserify.getDiffieHellman = r.getDiffieHellman, cryptoBrowserify.createDiffieHellman = r.createDiffieHellman, cryptoBrowserify.DiffieHellman = r.DiffieHellman;
  var u = requireBrowser$3();
  cryptoBrowserify.createSign = u.createSign, cryptoBrowserify.Sign = u.Sign, cryptoBrowserify.createVerify = u.createVerify, cryptoBrowserify.Verify = u.Verify, cryptoBrowserify.createECDH = requireBrowser$2();
  var o = requireBrowser$1();
  cryptoBrowserify.publicEncrypt = o.publicEncrypt, cryptoBrowserify.privateEncrypt = o.privateEncrypt, cryptoBrowserify.publicDecrypt = o.publicDecrypt, cryptoBrowserify.privateDecrypt = o.privateDecrypt;
  var t = requireBrowser();
  return cryptoBrowserify.randomFill = t.randomFill, cryptoBrowserify.randomFillSync = t.randomFillSync, cryptoBrowserify.createCredentials = function() {
    throw new Error(`sorry, createCredentials is not implemented yet
we accept pull requests
https://github.com/browserify/crypto-browserify`);
  }, cryptoBrowserify.constants = {
    DH_CHECK_P_NOT_SAFE_PRIME: 2,
    DH_CHECK_P_NOT_PRIME: 1,
    DH_UNABLE_TO_CHECK_GENERATOR: 4,
    DH_NOT_SUITABLE_GENERATOR: 8,
    NPN_ENABLED: 1,
    ALPN_ENABLED: 1,
    RSA_PKCS1_PADDING: 1,
    RSA_SSLV23_PADDING: 2,
    RSA_NO_PADDING: 3,
    RSA_PKCS1_OAEP_PADDING: 4,
    RSA_X931_PADDING: 5,
    RSA_PKCS1_PSS_PADDING: 6,
    POINT_CONVERSION_COMPRESSED: 2,
    POINT_CONVERSION_UNCOMPRESSED: 4,
    POINT_CONVERSION_HYBRID: 6
  }, cryptoBrowserify;
}
var hasRequiredUtils;
function requireUtils() {
  return hasRequiredUtils || (hasRequiredUtils = 1, requireCryptoBrowserify(), utils$4.linebrk = function(c, a) {
    for (var h = "", f = 0; f + a < c.length; )
      h += c.substring(f, f + a) + `
`, f += a;
    return h + c.substring(f, c.length);
  }, utils$4.detectEnvironment = function() {
    return typeof window < "u" && window && !(process$1 && process$1.title === "node") ? "browser" : "node";
  }, utils$4.get32IntFromBuffer = function(c, a) {
    a = a || 0;
    var h = 0;
    if ((h = c.length - a) > 0) {
      if (h >= 4)
        return c.readUIntBE(a, h);
      for (var f = 0, p = a + h, r = 0; p > a; p--, r += 2)
        f += c[p - 1] * Math.pow(16, r);
      return f;
    } else
      return NaN;
  }, utils$4._ = {
    isObject: function(c) {
      var a = typeof c;
      return !!c && (a == "object" || a == "function");
    },
    isString: function(c) {
      return typeof c == "string" || c instanceof String;
    },
    isNumber: function(c) {
      return typeof c == "number" || !isNaN(parseFloat(c)) && isFinite(c);
    },
    /**
     * Returns copy of `obj` without `removeProp` field.
     * @param obj
     * @param removeProp
     * @returns Object
     */
    omit: function(c, a) {
      var h = {};
      for (var f in c)
        !c.hasOwnProperty(f) || f === a || (h[f] = c[f]);
      return h;
    }
  }, utils$4.trimSurroundingText = function(c, a, h) {
    var f = 0, p = c.length, r = c.indexOf(a);
    r >= 0 && (f = r + a.length);
    var u = c.indexOf(h, r);
    return u >= 0 && (p = u), c.substring(f, p);
  }), utils$4;
}
var jsbn, hasRequiredJsbn;
function requireJsbn() {
  if (hasRequiredJsbn) return jsbn;
  hasRequiredJsbn = 1;
  var c = requireCryptoBrowserify(), a = requireUtils()._, h;
  function f(H, Z) {
    H != null && (typeof H == "number" ? this.fromNumber(H, Z) : Buffer.isBuffer(H) ? this.fromBuffer(H) : Z == null && typeof H != "string" ? this.fromByteArray(H) : this.fromString(H, Z));
  }
  function p() {
    return new f(null);
  }
  function r(H, Z, te, he, Ee, Re) {
    for (var Pe = Z & 16383, De = Z >> 14; --Re >= 0; ) {
      var tr = this[H] & 16383, ir = this[H++] >> 14, Er = De * tr + ir * Pe;
      tr = Pe * tr + ((Er & 16383) << 14) + te[he] + Ee, Ee = (tr >> 28) + (Er >> 14) + De * ir, te[he++] = tr & 268435455;
    }
    return Ee;
  }
  f.prototype.am = r, h = 28, f.prototype.DB = h, f.prototype.DM = (1 << h) - 1, f.prototype.DV = 1 << h;
  var u = 52;
  f.prototype.FV = Math.pow(2, u), f.prototype.F1 = u - h, f.prototype.F2 = 2 * h - u;
  var o = "0123456789abcdefghijklmnopqrstuvwxyz", t = new Array(), n, e;
  for (n = 48, e = 0; e <= 9; ++e) t[n++] = e;
  for (n = 97, e = 10; e < 36; ++e) t[n++] = e;
  for (n = 65, e = 10; e < 36; ++e) t[n++] = e;
  function s(H) {
    return o.charAt(H);
  }
  function d(H, Z) {
    var te = t[H.charCodeAt(Z)];
    return te ?? -1;
  }
  function v(H) {
    for (var Z = this.t - 1; Z >= 0; --Z) H[Z] = this[Z];
    H.t = this.t, H.s = this.s;
  }
  function y(H) {
    this.t = 1, this.s = H < 0 ? -1 : 0, H > 0 ? this[0] = H : H < -1 ? this[0] = H + DV : this.t = 0;
  }
  function m(H) {
    var Z = p();
    return Z.fromInt(H), Z;
  }
  function B(H, Z, te) {
    var he;
    switch (Z) {
      case 2:
        he = 1;
        break;
      case 4:
        he = 2;
        break;
      case 8:
        he = 3;
        break;
      case 16:
        he = 4;
        break;
      case 32:
        he = 5;
        break;
      case 256:
        he = 8;
        break;
      default:
        this.fromRadix(H, Z);
        return;
    }
    this.t = 0, this.s = 0;
    for (var Ee = H.length, Re = !1, Pe = 0; --Ee >= 0; ) {
      var De = he == 8 ? H[Ee] & 255 : d(H, Ee);
      if (De < 0) {
        H.charAt(Ee) == "-" && (Re = !0);
        continue;
      }
      Re = !1, Pe === 0 ? this[this.t++] = De : Pe + he > this.DB ? (this[this.t - 1] |= (De & (1 << this.DB - Pe) - 1) << Pe, this[this.t++] = De >> this.DB - Pe) : this[this.t - 1] |= De << Pe, Pe += he, Pe >= this.DB && (Pe -= this.DB);
    }
    !te && he == 8 && (H[0] & 128) != 0 && (this.s = -1, Pe > 0 && (this[this.t - 1] |= (1 << this.DB - Pe) - 1 << Pe)), this.clamp(), Re && f.ZERO.subTo(this, this);
  }
  function E(H, Z) {
    this.fromString(H, 256, Z);
  }
  function S(H) {
    this.fromString(H, 256, !0);
  }
  function O() {
    for (var H = this.s & this.DM; this.t > 0 && this[this.t - 1] == H; ) --this.t;
  }
  function D(H) {
    if (this.s < 0) return "-" + this.negate().toString(H);
    var Z;
    if (H == 16) Z = 4;
    else if (H == 8) Z = 3;
    else if (H == 2) Z = 1;
    else if (H == 32) Z = 5;
    else if (H == 4) Z = 2;
    else return this.toRadix(H);
    var te = (1 << Z) - 1, he, Ee = !1, Re = "", Pe = this.t, De = this.DB - Pe * this.DB % Z;
    if (Pe-- > 0)
      for (De < this.DB && (he = this[Pe] >> De) > 0 && (Ee = !0, Re = s(he)); Pe >= 0; )
        De < Z ? (he = (this[Pe] & (1 << De) - 1) << Z - De, he |= this[--Pe] >> (De += this.DB - Z)) : (he = this[Pe] >> (De -= Z) & te, De <= 0 && (De += this.DB, --Pe)), he > 0 && (Ee = !0), Ee && (Re += s(he));
    return Ee ? Re : "0";
  }
  function $() {
    var H = p();
    return f.ZERO.subTo(this, H), H;
  }
  function V() {
    return this.s < 0 ? this.negate() : this;
  }
  function J(H) {
    var Z = this.s - H.s;
    if (Z != 0) return Z;
    var te = this.t;
    if (Z = te - H.t, Z != 0) return this.s < 0 ? -Z : Z;
    for (; --te >= 0; ) if ((Z = this[te] - H[te]) != 0) return Z;
    return 0;
  }
  function ie(H) {
    var Z = 1, te;
    return (te = H >>> 16) != 0 && (H = te, Z += 16), (te = H >> 8) != 0 && (H = te, Z += 8), (te = H >> 4) != 0 && (H = te, Z += 4), (te = H >> 2) != 0 && (H = te, Z += 2), (te = H >> 1) != 0 && (H = te, Z += 1), Z;
  }
  function ne() {
    return this.t <= 0 ? 0 : this.DB * (this.t - 1) + ie(this[this.t - 1] ^ this.s & this.DM);
  }
  function le(H, Z) {
    var te;
    for (te = this.t - 1; te >= 0; --te) Z[te + H] = this[te];
    for (te = H - 1; te >= 0; --te) Z[te] = 0;
    Z.t = this.t + H, Z.s = this.s;
  }
  function Y(H, Z) {
    for (var te = H; te < this.t; ++te) Z[te - H] = this[te];
    Z.t = Math.max(this.t - H, 0), Z.s = this.s;
  }
  function b(H, Z) {
    var te = H % this.DB, he = this.DB - te, Ee = (1 << he) - 1, Re = Math.floor(H / this.DB), Pe = this.s << te & this.DM, De;
    for (De = this.t - 1; De >= 0; --De)
      Z[De + Re + 1] = this[De] >> he | Pe, Pe = (this[De] & Ee) << te;
    for (De = Re - 1; De >= 0; --De) Z[De] = 0;
    Z[Re] = Pe, Z.t = this.t + Re + 1, Z.s = this.s, Z.clamp();
  }
  function g(H, Z) {
    Z.s = this.s;
    var te = Math.floor(H / this.DB);
    if (te >= this.t) {
      Z.t = 0;
      return;
    }
    var he = H % this.DB, Ee = this.DB - he, Re = (1 << he) - 1;
    Z[0] = this[te] >> he;
    for (var Pe = te + 1; Pe < this.t; ++Pe)
      Z[Pe - te - 1] |= (this[Pe] & Re) << Ee, Z[Pe - te] = this[Pe] >> he;
    he > 0 && (Z[this.t - te - 1] |= (this.s & Re) << Ee), Z.t = this.t - te, Z.clamp();
  }
  function l(H, Z) {
    for (var te = 0, he = 0, Ee = Math.min(H.t, this.t); te < Ee; )
      he += this[te] - H[te], Z[te++] = he & this.DM, he >>= this.DB;
    if (H.t < this.t) {
      for (he -= H.s; te < this.t; )
        he += this[te], Z[te++] = he & this.DM, he >>= this.DB;
      he += this.s;
    } else {
      for (he += this.s; te < H.t; )
        he -= H[te], Z[te++] = he & this.DM, he >>= this.DB;
      he -= H.s;
    }
    Z.s = he < 0 ? -1 : 0, he < -1 ? Z[te++] = this.DV + he : he > 0 && (Z[te++] = he), Z.t = te, Z.clamp();
  }
  function _(H, Z) {
    var te = this.abs(), he = H.abs(), Ee = te.t;
    for (Z.t = Ee + he.t; --Ee >= 0; ) Z[Ee] = 0;
    for (Ee = 0; Ee < he.t; ++Ee) Z[Ee + te.t] = te.am(0, he[Ee], Z, Ee, 0, te.t);
    Z.s = 0, Z.clamp(), this.s != H.s && f.ZERO.subTo(Z, Z);
  }
  function A(H) {
    for (var Z = this.abs(), te = H.t = 2 * Z.t; --te >= 0; ) H[te] = 0;
    for (te = 0; te < Z.t - 1; ++te) {
      var he = Z.am(te, Z[te], H, 2 * te, 0, 1);
      (H[te + Z.t] += Z.am(te + 1, 2 * Z[te], H, 2 * te + 1, he, Z.t - te - 1)) >= Z.DV && (H[te + Z.t] -= Z.DV, H[te + Z.t + 1] = 1);
    }
    H.t > 0 && (H[H.t - 1] += Z.am(te, Z[te], H, 2 * te, 0, 1)), H.s = 0, H.clamp();
  }
  function q(H, Z, te) {
    var he = H.abs();
    if (!(he.t <= 0)) {
      var Ee = this.abs();
      if (Ee.t < he.t) {
        Z?.fromInt(0), te != null && this.copyTo(te);
        return;
      }
      te == null && (te = p());
      var Re = p(), Pe = this.s, De = H.s, tr = this.DB - ie(he[he.t - 1]);
      tr > 0 ? (he.lShiftTo(tr, Re), Ee.lShiftTo(tr, te)) : (he.copyTo(Re), Ee.copyTo(te));
      var ir = Re.t, Er = Re[ir - 1];
      if (Er !== 0) {
        var ar = Er * (1 << this.F1) + (ir > 1 ? Re[ir - 2] >> this.F2 : 0), qr = this.FV / ar, Rr = (1 << this.F1) / ar, or = 1 << this.F2, sr = te.t, Ar = sr - ir, Br = Z ?? p();
        for (Re.dlShiftTo(Ar, Br), te.compareTo(Br) >= 0 && (te[te.t++] = 1, te.subTo(Br, te)), f.ONE.dlShiftTo(ir, Br), Br.subTo(Re, Re); Re.t < ir; ) Re[Re.t++] = 0;
        for (; --Ar >= 0; ) {
          var Mr = te[--sr] == Er ? this.DM : Math.floor(te[sr] * qr + (te[sr - 1] + or) * Rr);
          if ((te[sr] += Re.am(0, Mr, te, Ar, 0, ir)) < Mr)
            for (Re.dlShiftTo(Ar, Br), te.subTo(Br, te); te[sr] < --Mr; ) te.subTo(Br, te);
        }
        Z != null && (te.drShiftTo(ir, Z), Pe != De && f.ZERO.subTo(Z, Z)), te.t = ir, te.clamp(), tr > 0 && te.rShiftTo(tr, te), Pe < 0 && f.ZERO.subTo(te, te);
      }
    }
  }
  function P(H) {
    var Z = p();
    return this.abs().divRemTo(H, null, Z), this.s < 0 && Z.compareTo(f.ZERO) > 0 && H.subTo(Z, Z), Z;
  }
  function R(H) {
    this.m = H;
  }
  function w(H) {
    return H.s < 0 || H.compareTo(this.m) >= 0 ? H.mod(this.m) : H;
  }
  function M(H) {
    return H;
  }
  function x(H) {
    H.divRemTo(this.m, null, H);
  }
  function L(H, Z, te) {
    H.multiplyTo(Z, te), this.reduce(te);
  }
  function K(H, Z) {
    H.squareTo(Z), this.reduce(Z);
  }
  R.prototype.convert = w, R.prototype.revert = M, R.prototype.reduce = x, R.prototype.mulTo = L, R.prototype.sqrTo = K;
  function Q() {
    if (this.t < 1) return 0;
    var H = this[0];
    if ((H & 1) === 0) return 0;
    var Z = H & 3;
    return Z = Z * (2 - (H & 15) * Z) & 15, Z = Z * (2 - (H & 255) * Z) & 255, Z = Z * (2 - ((H & 65535) * Z & 65535)) & 65535, Z = Z * (2 - H * Z % this.DV) % this.DV, Z > 0 ? this.DV - Z : -Z;
  }
  function U(H) {
    this.m = H, this.mp = H.invDigit(), this.mpl = this.mp & 32767, this.mph = this.mp >> 15, this.um = (1 << H.DB - 15) - 1, this.mt2 = 2 * H.t;
  }
  function N(H) {
    var Z = p();
    return H.abs().dlShiftTo(this.m.t, Z), Z.divRemTo(this.m, null, Z), H.s < 0 && Z.compareTo(f.ZERO) > 0 && this.m.subTo(Z, Z), Z;
  }
  function F(H) {
    var Z = p();
    return H.copyTo(Z), this.reduce(Z), Z;
  }
  function ee(H) {
    for (; H.t <= this.mt2; )
      H[H.t++] = 0;
    for (var Z = 0; Z < this.m.t; ++Z) {
      var te = H[Z] & 32767, he = te * this.mpl + ((te * this.mph + (H[Z] >> 15) * this.mpl & this.um) << 15) & H.DM;
      for (te = Z + this.m.t, H[te] += this.m.am(0, he, H, Z, 0, this.m.t); H[te] >= H.DV; )
        H[te] -= H.DV, H[++te]++;
    }
    H.clamp(), H.drShiftTo(this.m.t, H), H.compareTo(this.m) >= 0 && H.subTo(this.m, H);
  }
  function ae(H, Z) {
    H.squareTo(Z), this.reduce(Z);
  }
  function G(H, Z, te) {
    H.multiplyTo(Z, te), this.reduce(te);
  }
  U.prototype.convert = N, U.prototype.revert = F, U.prototype.reduce = ee, U.prototype.mulTo = G, U.prototype.sqrTo = ae;
  function z() {
    return (this.t > 0 ? this[0] & 1 : this.s) === 0;
  }
  function fe(H, Z) {
    if (H > 4294967295 || H < 1) return f.ONE;
    var te = p(), he = p(), Ee = Z.convert(this), Re = ie(H) - 1;
    for (Ee.copyTo(te); --Re >= 0; )
      if (Z.sqrTo(te, he), (H & 1 << Re) > 0) Z.mulTo(he, Ee, te);
      else {
        var Pe = te;
        te = he, he = Pe;
      }
    return Z.revert(te);
  }
  function me(H, Z) {
    var te;
    return H < 256 || Z.isEven() ? te = new R(Z) : te = new U(Z), this.exp(H, te);
  }
  function xe() {
    var H = p();
    return this.copyTo(H), H;
  }
  function _e() {
    if (this.s < 0) {
      if (this.t == 1) return this[0] - this.DV;
      if (this.t === 0) return -1;
    } else {
      if (this.t == 1) return this[0];
      if (this.t === 0) return 0;
    }
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
  }
  function Be() {
    return this.t == 0 ? this.s : this[0] << 24 >> 24;
  }
  function Ae() {
    return this.t == 0 ? this.s : this[0] << 16 >> 16;
  }
  function be(H) {
    return Math.floor(Math.LN2 * this.DB / Math.log(H));
  }
  function Fe() {
    return this.s < 0 ? -1 : this.t <= 0 || this.t == 1 && this[0] <= 0 ? 0 : 1;
  }
  function qe(H) {
    if (H == null && (H = 10), this.signum() === 0 || H < 2 || H > 36) return "0";
    var Z = this.chunkSize(H), te = Math.pow(H, Z), he = m(te), Ee = p(), Re = p(), Pe = "";
    for (this.divRemTo(he, Ee, Re); Ee.signum() > 0; )
      Pe = (te + Re.intValue()).toString(H).substr(1) + Pe, Ee.divRemTo(he, Ee, Re);
    return Re.intValue().toString(H) + Pe;
  }
  function Me(H, Z) {
    this.fromInt(0), Z == null && (Z = 10);
    for (var te = this.chunkSize(Z), he = Math.pow(Z, te), Ee = !1, Re = 0, Pe = 0, De = 0; De < H.length; ++De) {
      var tr = d(H, De);
      if (tr < 0) {
        H.charAt(De) == "-" && this.signum() === 0 && (Ee = !0);
        continue;
      }
      Pe = Z * Pe + tr, ++Re >= te && (this.dMultiply(he), this.dAddOffset(Pe, 0), Re = 0, Pe = 0);
    }
    Re > 0 && (this.dMultiply(Math.pow(Z, Re)), this.dAddOffset(Pe, 0)), Ee && f.ZERO.subTo(this, this);
  }
  function Te(H, Z) {
    if (typeof Z == "number")
      if (H < 2) this.fromInt(1);
      else
        for (this.fromNumber(H), this.testBit(H - 1) || this.bitwiseTo(f.ONE.shiftLeft(H - 1), C, this), this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(Z); )
          this.dAddOffset(2, 0), this.bitLength() > H && this.subTo(f.ONE.shiftLeft(H - 1), this);
    else {
      var te = c.randomBytes((H >> 3) + 1), he = H & 7;
      he > 0 ? te[0] &= (1 << he) - 1 : te[0] = 0, this.fromByteArray(te);
    }
  }
  function oe() {
    var H = this.t, Z = new Array();
    Z[0] = this.s;
    var te = this.DB - H * this.DB % 8, he, Ee = 0;
    if (H-- > 0)
      for (te < this.DB && (he = this[H] >> te) != (this.s & this.DM) >> te && (Z[Ee++] = he | this.s << this.DB - te); H >= 0; )
        te < 8 ? (he = (this[H] & (1 << te) - 1) << 8 - te, he |= this[--H] >> (te += this.DB - 8)) : (he = this[H] >> (te -= 8) & 255, te <= 0 && (te += this.DB, --H)), (he & 128) != 0 && (he |= -256), Ee === 0 && (this.s & 128) != (he & 128) && ++Ee, (Ee > 0 || he != this.s) && (Z[Ee++] = he);
    return Z;
  }
  function ce(H) {
    var Z = Buffer.from(this.toByteArray());
    if (H === !0 && Z[0] === 0)
      Z = Z.slice(1);
    else if (a.isNumber(H)) {
      if (Z.length > H) {
        for (var te = 0; te < Z.length - H; te++)
          if (Z[te] !== 0)
            return null;
        return Z.slice(Z.length - H);
      } else if (Z.length < H) {
        var he = Buffer.alloc(H);
        return he.fill(0, 0, H - Z.length), Z.copy(he, H - Z.length), he;
      }
    }
    return Z;
  }
  function ge(H) {
    return this.compareTo(H) == 0;
  }
  function we(H) {
    return this.compareTo(H) < 0 ? this : H;
  }
  function Se(H) {
    return this.compareTo(H) > 0 ? this : H;
  }
  function Oe(H, Z, te) {
    var he, Ee, Re = Math.min(H.t, this.t);
    for (he = 0; he < Re; ++he) te[he] = Z(this[he], H[he]);
    if (H.t < this.t) {
      for (Ee = H.s & this.DM, he = Re; he < this.t; ++he) te[he] = Z(this[he], Ee);
      te.t = this.t;
    } else {
      for (Ee = this.s & this.DM, he = Re; he < H.t; ++he) te[he] = Z(Ee, H[he]);
      te.t = H.t;
    }
    te.s = Z(this.s, H.s), te.clamp();
  }
  function j(H, Z) {
    return H & Z;
  }
  function I(H) {
    var Z = p();
    return this.bitwiseTo(H, j, Z), Z;
  }
  function C(H, Z) {
    return H | Z;
  }
  function X(H) {
    var Z = p();
    return this.bitwiseTo(H, C, Z), Z;
  }
  function se(H, Z) {
    return H ^ Z;
  }
  function de(H) {
    var Z = p();
    return this.bitwiseTo(H, se, Z), Z;
  }
  function ve(H, Z) {
    return H & ~Z;
  }
  function Ce(H) {
    var Z = p();
    return this.bitwiseTo(H, ve, Z), Z;
  }
  function Le() {
    for (var H = p(), Z = 0; Z < this.t; ++Z) H[Z] = this.DM & ~this[Z];
    return H.t = this.t, H.s = ~this.s, H;
  }
  function Ie(H) {
    var Z = p();
    return H < 0 ? this.rShiftTo(-H, Z) : this.lShiftTo(H, Z), Z;
  }
  function Ue(H) {
    var Z = p();
    return H < 0 ? this.lShiftTo(-H, Z) : this.rShiftTo(H, Z), Z;
  }
  function $e(H) {
    if (H === 0) return -1;
    var Z = 0;
    return (H & 65535) === 0 && (H >>= 16, Z += 16), (H & 255) === 0 && (H >>= 8, Z += 8), (H & 15) === 0 && (H >>= 4, Z += 4), (H & 3) === 0 && (H >>= 2, Z += 2), (H & 1) === 0 && ++Z, Z;
  }
  function He() {
    for (var H = 0; H < this.t; ++H)
      if (this[H] != 0) return H * this.DB + $e(this[H]);
    return this.s < 0 ? this.t * this.DB : -1;
  }
  function Ke(H) {
    for (var Z = 0; H != 0; )
      H &= H - 1, ++Z;
    return Z;
  }
  function Ye() {
    for (var H = 0, Z = this.s & this.DM, te = 0; te < this.t; ++te) H += Ke(this[te] ^ Z);
    return H;
  }
  function We(H) {
    var Z = Math.floor(H / this.DB);
    return Z >= this.t ? this.s != 0 : (this[Z] & 1 << H % this.DB) != 0;
  }
  function Ze(H, Z) {
    var te = f.ONE.shiftLeft(H);
    return this.bitwiseTo(te, Z, te), te;
  }
  function Xe(H) {
    return this.changeBit(H, C);
  }
  function W(H) {
    return this.changeBit(H, ve);
  }
  function T(H) {
    return this.changeBit(H, se);
  }
  function k(H, Z) {
    for (var te = 0, he = 0, Ee = Math.min(H.t, this.t); te < Ee; )
      he += this[te] + H[te], Z[te++] = he & this.DM, he >>= this.DB;
    if (H.t < this.t) {
      for (he += H.s; te < this.t; )
        he += this[te], Z[te++] = he & this.DM, he >>= this.DB;
      he += this.s;
    } else {
      for (he += this.s; te < H.t; )
        he += H[te], Z[te++] = he & this.DM, he >>= this.DB;
      he += H.s;
    }
    Z.s = he < 0 ? -1 : 0, he > 0 ? Z[te++] = he : he < -1 && (Z[te++] = this.DV + he), Z.t = te, Z.clamp();
  }
  function re(H) {
    var Z = p();
    return this.addTo(H, Z), Z;
  }
  function ue(H) {
    var Z = p();
    return this.subTo(H, Z), Z;
  }
  function pe(H) {
    var Z = p();
    return this.multiplyTo(H, Z), Z;
  }
  function ye() {
    var H = p();
    return this.squareTo(H), H;
  }
  function ke(H) {
    var Z = p();
    return this.divRemTo(H, Z, null), Z;
  }
  function Ve(H) {
    var Z = p();
    return this.divRemTo(H, null, Z), Z;
  }
  function Ne(H) {
    var Z = p(), te = p();
    return this.divRemTo(H, Z, te), new Array(Z, te);
  }
  function ze(H) {
    this[this.t] = this.am(0, H - 1, this, 0, 0, this.t), ++this.t, this.clamp();
  }
  function je(H, Z) {
    if (H !== 0) {
      for (; this.t <= Z; ) this[this.t++] = 0;
      for (this[Z] += H; this[Z] >= this.DV; )
        this[Z] -= this.DV, ++Z >= this.t && (this[this.t++] = 0), ++this[Z];
    }
  }
  function Ge() {
  }
  function Je(H) {
    return H;
  }
  function Qe(H, Z, te) {
    H.multiplyTo(Z, te);
  }
  function er(H, Z) {
    H.squareTo(Z);
  }
  Ge.prototype.convert = Je, Ge.prototype.revert = Je, Ge.prototype.mulTo = Qe, Ge.prototype.sqrTo = er;
  function fr(H) {
    return this.exp(H, new Ge());
  }
  function ur(H, Z, te) {
    var he = Math.min(this.t + H.t, Z);
    for (te.s = 0, te.t = he; he > 0; ) te[--he] = 0;
    var Ee;
    for (Ee = te.t - this.t; he < Ee; ++he) te[he + this.t] = this.am(0, H[he], te, he, 0, this.t);
    for (Ee = Math.min(H.t, Z); he < Ee; ++he) this.am(0, H[he], te, he, 0, Z - he);
    te.clamp();
  }
  function cr(H, Z, te) {
    --Z;
    var he = te.t = this.t + H.t - Z;
    for (te.s = 0; --he >= 0; ) te[he] = 0;
    for (he = Math.max(Z - this.t, 0); he < H.t; ++he)
      te[this.t + he - Z] = this.am(Z - he, H[he], te, 0, 0, this.t + he - Z);
    te.clamp(), te.drShiftTo(1, te);
  }
  function nr(H) {
    this.r2 = p(), this.q3 = p(), f.ONE.dlShiftTo(2 * H.t, this.r2), this.mu = this.r2.divide(H), this.m = H;
  }
  function hr(H) {
    if (H.s < 0 || H.t > 2 * this.m.t) return H.mod(this.m);
    if (H.compareTo(this.m) < 0) return H;
    var Z = p();
    return H.copyTo(Z), this.reduce(Z), Z;
  }
  function dr(H) {
    return H;
  }
  function lr(H) {
    for (H.drShiftTo(this.m.t - 1, this.r2), H.t > this.m.t + 1 && (H.t = this.m.t + 1, H.clamp()), this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); H.compareTo(this.r2) < 0; ) H.dAddOffset(1, this.m.t + 1);
    for (H.subTo(this.r2, H); H.compareTo(this.m) >= 0; ) H.subTo(this.m, H);
  }
  function pr(H, Z) {
    H.squareTo(Z), this.reduce(Z);
  }
  function vr(H, Z, te) {
    H.multiplyTo(Z, te), this.reduce(te);
  }
  nr.prototype.convert = hr, nr.prototype.revert = dr, nr.prototype.reduce = lr, nr.prototype.mulTo = vr, nr.prototype.sqrTo = pr;
  function br(H, Z) {
    var te = H.bitLength(), he, Ee = m(1), Re;
    if (te <= 0) return Ee;
    te < 18 ? he = 1 : te < 48 ? he = 3 : te < 144 ? he = 4 : te < 768 ? he = 5 : he = 6, te < 8 ? Re = new R(Z) : Z.isEven() ? Re = new nr(Z) : Re = new U(Z);
    var Pe = new Array(), De = 3, tr = he - 1, ir = (1 << he) - 1;
    if (Pe[1] = Re.convert(this), he > 1) {
      var Er = p();
      for (Re.sqrTo(Pe[1], Er); De <= ir; )
        Pe[De] = p(), Re.mulTo(Er, Pe[De - 2], Pe[De]), De += 2;
    }
    var ar = H.t - 1, qr, Rr = !0, or = p(), sr;
    for (te = ie(H[ar]) - 1; ar >= 0; ) {
      for (te >= tr ? qr = H[ar] >> te - tr & ir : (qr = (H[ar] & (1 << te + 1) - 1) << tr - te, ar > 0 && (qr |= H[ar - 1] >> this.DB + te - tr)), De = he; (qr & 1) === 0; )
        qr >>= 1, --De;
      if ((te -= De) < 0 && (te += this.DB, --ar), Rr)
        Pe[qr].copyTo(Ee), Rr = !1;
      else {
        for (; De > 1; )
          Re.sqrTo(Ee, or), Re.sqrTo(or, Ee), De -= 2;
        De > 0 ? Re.sqrTo(Ee, or) : (sr = Ee, Ee = or, or = sr), Re.mulTo(or, Pe[qr], Ee);
      }
      for (; ar >= 0 && (H[ar] & 1 << te) === 0; )
        Re.sqrTo(Ee, or), sr = Ee, Ee = or, or = sr, --te < 0 && (te = this.DB - 1, --ar);
    }
    return Re.revert(Ee);
  }
  function yr(H) {
    var Z = this.s < 0 ? this.negate() : this.clone(), te = H.s < 0 ? H.negate() : H.clone();
    if (Z.compareTo(te) < 0) {
      var he = Z;
      Z = te, te = he;
    }
    var Ee = Z.getLowestSetBit(), Re = te.getLowestSetBit();
    if (Re < 0) return Z;
    for (Ee < Re && (Re = Ee), Re > 0 && (Z.rShiftTo(Re, Z), te.rShiftTo(Re, te)); Z.signum() > 0; )
      (Ee = Z.getLowestSetBit()) > 0 && Z.rShiftTo(Ee, Z), (Ee = te.getLowestSetBit()) > 0 && te.rShiftTo(Ee, te), Z.compareTo(te) >= 0 ? (Z.subTo(te, Z), Z.rShiftTo(1, Z)) : (te.subTo(Z, te), te.rShiftTo(1, te));
    return Re > 0 && te.lShiftTo(Re, te), te;
  }
  function gr(H) {
    if (H <= 0) return 0;
    var Z = this.DV % H, te = this.s < 0 ? H - 1 : 0;
    if (this.t > 0)
      if (Z === 0) te = this[0] % H;
      else for (var he = this.t - 1; he >= 0; --he) te = (Z * te + this[he]) % H;
    return te;
  }
  function wr(H) {
    var Z = H.isEven();
    if (this.isEven() && Z || H.signum() === 0) return f.ZERO;
    for (var te = H.clone(), he = this.clone(), Ee = m(1), Re = m(0), Pe = m(0), De = m(1); te.signum() != 0; ) {
      for (; te.isEven(); )
        te.rShiftTo(1, te), Z ? ((!Ee.isEven() || !Re.isEven()) && (Ee.addTo(this, Ee), Re.subTo(H, Re)), Ee.rShiftTo(1, Ee)) : Re.isEven() || Re.subTo(H, Re), Re.rShiftTo(1, Re);
      for (; he.isEven(); )
        he.rShiftTo(1, he), Z ? ((!Pe.isEven() || !De.isEven()) && (Pe.addTo(this, Pe), De.subTo(H, De)), Pe.rShiftTo(1, Pe)) : De.isEven() || De.subTo(H, De), De.rShiftTo(1, De);
      te.compareTo(he) >= 0 ? (te.subTo(he, te), Z && Ee.subTo(Pe, Ee), Re.subTo(De, Re)) : (he.subTo(te, he), Z && Pe.subTo(Ee, Pe), De.subTo(Re, De));
    }
    if (he.compareTo(f.ONE) != 0) return f.ZERO;
    if (De.compareTo(H) >= 0) return De.subtract(H);
    if (De.signum() < 0) De.addTo(H, De);
    else return De;
    return De.signum() < 0 ? De.add(H) : De;
  }
  var rr = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997], _r = (1 << 26) / rr[rr.length - 1];
  function xr(H) {
    var Z, te = this.abs();
    if (te.t == 1 && te[0] <= rr[rr.length - 1]) {
      for (Z = 0; Z < rr.length; ++Z)
        if (te[0] == rr[Z]) return !0;
      return !1;
    }
    if (te.isEven()) return !1;
    for (Z = 1; Z < rr.length; ) {
      for (var he = rr[Z], Ee = Z + 1; Ee < rr.length && he < _r; ) he *= rr[Ee++];
      for (he = te.modInt(he); Z < Ee; ) if (he % rr[Z++] === 0) return !1;
    }
    return te.millerRabin(H);
  }
  function Sr(H) {
    var Z = this.subtract(f.ONE), te = Z.getLowestSetBit();
    if (te <= 0) return !1;
    var he = Z.shiftRight(te);
    H = H + 1 >> 1, H > rr.length && (H = rr.length);
    for (var Ee = p(), Re = 0; Re < H; ++Re) {
      Ee.fromInt(rr[Math.floor(Math.random() * rr.length)]);
      var Pe = Ee.modPow(he, this);
      if (Pe.compareTo(f.ONE) != 0 && Pe.compareTo(Z) != 0) {
        for (var De = 1; De++ < te && Pe.compareTo(Z) != 0; )
          if (Pe = Pe.modPowInt(2, this), Pe.compareTo(f.ONE) === 0) return !1;
        if (Pe.compareTo(Z) != 0) return !1;
      }
    }
    return !0;
  }
  return f.prototype.copyTo = v, f.prototype.fromInt = y, f.prototype.fromString = B, f.prototype.fromByteArray = E, f.prototype.fromBuffer = S, f.prototype.clamp = O, f.prototype.dlShiftTo = le, f.prototype.drShiftTo = Y, f.prototype.lShiftTo = b, f.prototype.rShiftTo = g, f.prototype.subTo = l, f.prototype.multiplyTo = _, f.prototype.squareTo = A, f.prototype.divRemTo = q, f.prototype.invDigit = Q, f.prototype.isEven = z, f.prototype.exp = fe, f.prototype.chunkSize = be, f.prototype.toRadix = qe, f.prototype.fromRadix = Me, f.prototype.fromNumber = Te, f.prototype.bitwiseTo = Oe, f.prototype.changeBit = Ze, f.prototype.addTo = k, f.prototype.dMultiply = ze, f.prototype.dAddOffset = je, f.prototype.multiplyLowerTo = ur, f.prototype.multiplyUpperTo = cr, f.prototype.modInt = gr, f.prototype.millerRabin = Sr, f.prototype.toString = D, f.prototype.negate = $, f.prototype.abs = V, f.prototype.compareTo = J, f.prototype.bitLength = ne, f.prototype.mod = P, f.prototype.modPowInt = me, f.prototype.clone = xe, f.prototype.intValue = _e, f.prototype.byteValue = Be, f.prototype.shortValue = Ae, f.prototype.signum = Fe, f.prototype.toByteArray = oe, f.prototype.toBuffer = ce, f.prototype.equals = ge, f.prototype.min = we, f.prototype.max = Se, f.prototype.and = I, f.prototype.or = X, f.prototype.xor = de, f.prototype.andNot = Ce, f.prototype.not = Le, f.prototype.shiftLeft = Ie, f.prototype.shiftRight = Ue, f.prototype.getLowestSetBit = He, f.prototype.bitCount = Ye, f.prototype.testBit = We, f.prototype.setBit = Xe, f.prototype.clearBit = W, f.prototype.flipBit = T, f.prototype.add = re, f.prototype.subtract = ue, f.prototype.multiply = pe, f.prototype.divide = ke, f.prototype.remainder = Ve, f.prototype.divideAndRemainder = Ne, f.prototype.modPow = br, f.prototype.modInverse = wr, f.prototype.pow = fr, f.prototype.gcd = yr, f.prototype.isProbablePrime = xr, f.int2char = s, f.ZERO = m(0), f.ONE = m(1), f.prototype.square = ye, jsbn = f, jsbn;
}
var schemes = { exports: {} }, pkcs1$1 = { exports: {} }, hasRequiredPkcs1$1;
function requirePkcs1$1() {
  if (hasRequiredPkcs1$1) return pkcs1$1.exports;
  hasRequiredPkcs1$1 = 1;
  var c = requireJsbn(), a = requireCryptoBrowserify(), h = require$$0$1, f = {
    md2: Buffer.from("3020300c06082a864886f70d020205000410", "hex"),
    md5: Buffer.from("3020300c06082a864886f70d020505000410", "hex"),
    sha1: Buffer.from("3021300906052b0e03021a05000414", "hex"),
    sha224: Buffer.from("302d300d06096086480165030402040500041c", "hex"),
    sha256: Buffer.from("3031300d060960864801650304020105000420", "hex"),
    sha384: Buffer.from("3041300d060960864801650304020205000430", "hex"),
    sha512: Buffer.from("3051300d060960864801650304020305000440", "hex"),
    ripemd160: Buffer.from("3021300906052b2403020105000414", "hex"),
    rmd160: Buffer.from("3021300906052b2403020105000414", "hex")
  }, p = {
    ripemd160: "rmd160"
  }, r = "sha256";
  return pkcs1$1.exports = {
    isEncryption: !0,
    isSignature: !0
  }, pkcs1$1.exports.makeScheme = function(u, o) {
    function t(n, e) {
      this.key = n, this.options = e;
    }
    return t.prototype.maxMessageLength = function() {
      return this.options.encryptionSchemeOptions && this.options.encryptionSchemeOptions.padding == h.RSA_NO_PADDING ? this.key.encryptedDataLength : this.key.encryptedDataLength - 11;
    }, t.prototype.encPad = function(n, e) {
      e = e || {};
      var s;
      if (n.length > this.key.maxMessageLength)
        throw new Error("Message too long for RSA (n=" + this.key.encryptedDataLength + ", l=" + n.length + ")");
      if (this.options.encryptionSchemeOptions && this.options.encryptionSchemeOptions.padding == h.RSA_NO_PADDING)
        return s = Buffer.alloc(this.key.maxMessageLength - n.length), s.fill(0), Buffer.concat([s, n]);
      if (e.type === 1)
        return s = Buffer.alloc(this.key.encryptedDataLength - n.length - 1), s.fill(255, 0, s.length - 1), s[0] = 1, s[s.length - 1] = 0, Buffer.concat([s, n]);
      s = Buffer.alloc(this.key.encryptedDataLength - n.length), s[0] = 0, s[1] = 2;
      for (var d = a.randomBytes(s.length - 3), v = 0; v < d.length; v++) {
        for (var y = d[v]; y === 0; )
          y = a.randomBytes(1)[0];
        s[v + 2] = y;
      }
      return s[s.length - 1] = 0, Buffer.concat([s, n]);
    }, t.prototype.encUnPad = function(n, e) {
      e = e || {};
      var s = 0;
      if (this.options.encryptionSchemeOptions && this.options.encryptionSchemeOptions.padding == h.RSA_NO_PADDING) {
        var d;
        return typeof n.lastIndexOf == "function" ? d = n.slice(n.lastIndexOf("\0") + 1, n.length) : d = n.slice(String.prototype.lastIndexOf.call(n, "\0") + 1, n.length), d;
      }
      if (n.length < 4)
        return null;
      if (e.type === 1) {
        if (n[0] !== 0 || n[1] !== 1)
          return null;
        for (s = 3; n[s] !== 0; )
          if (n[s] != 255 || ++s >= n.length)
            return null;
      } else {
        if (n[0] !== 0 || n[1] !== 2)
          return null;
        for (s = 3; n[s] !== 0; )
          if (++s >= n.length)
            return null;
      }
      return n.slice(s + 1, n.length);
    }, t.prototype.sign = function(n) {
      var e = this.options.signingSchemeOptions.hash || r;
      if (this.options.environment === "browser") {
        e = p[e] || e;
        var s = a.createHash(e);
        s.update(n);
        var d = this.pkcs1pad(s.digest(), e), v = this.key.$doPrivate(new c(d)).toBuffer(this.key.encryptedDataLength);
        return v;
      } else {
        var y = a.createSign("RSA-" + e.toUpperCase());
        return y.update(n), y.sign(this.options.rsaUtils.exportKey("private"));
      }
    }, t.prototype.verify = function(n, e, s) {
      if (this.options.encryptionSchemeOptions && this.options.encryptionSchemeOptions.padding == h.RSA_NO_PADDING)
        return !1;
      var d = this.options.signingSchemeOptions.hash || r;
      if (this.options.environment === "browser") {
        d = p[d] || d, s && (e = Buffer.from(e, s));
        var v = a.createHash(d);
        v.update(n);
        var y = this.pkcs1pad(v.digest(), d), m = this.key.$doPublic(new c(e));
        return m.toBuffer().toString("hex") == y.toString("hex");
      } else {
        var B = a.createVerify("RSA-" + d.toUpperCase());
        return B.update(n), B.verify(this.options.rsaUtils.exportKey("public"), e, s);
      }
    }, t.prototype.pkcs0pad = function(n) {
      var e = Buffer.alloc(this.key.maxMessageLength - n.length);
      return e.fill(0), Buffer.concat([e, n]);
    }, t.prototype.pkcs0unpad = function(n) {
      var e;
      return typeof n.lastIndexOf == "function" ? e = n.slice(n.lastIndexOf("\0") + 1, n.length) : e = n.slice(String.prototype.lastIndexOf.call(n, "\0") + 1, n.length), e;
    }, t.prototype.pkcs1pad = function(n, e) {
      var s = f[e];
      if (!s)
        throw Error("Unsupported hash algorithm");
      var d = Buffer.concat([s, n]);
      if (d.length + 10 > this.key.encryptedDataLength)
        throw Error("Key is too short for signing algorithm (" + e + ")");
      var v = Buffer.alloc(this.key.encryptedDataLength - d.length - 1);
      v.fill(255, 0, v.length - 1), v[0] = 1, v[v.length - 1] = 0;
      var y = Buffer.concat([v, d]);
      return y;
    }, new t(u, o);
  }, pkcs1$1.exports;
}
var oaep = { exports: {} }, hasRequiredOaep;
function requireOaep() {
  return hasRequiredOaep || (hasRequiredOaep = 1, (function(c) {
    requireJsbn();
    var a = requireCryptoBrowserify();
    c.exports = {
      isEncryption: !0,
      isSignature: !1
    }, c.exports.digestLength = {
      md4: 16,
      md5: 16,
      ripemd160: 20,
      rmd160: 20,
      sha1: 20,
      sha224: 28,
      sha256: 32,
      sha384: 48,
      sha512: 64
    };
    var h = "sha1";
    c.exports.eme_oaep_mgf1 = function(f, p, r) {
      r = r || h;
      for (var u = c.exports.digestLength[r], o = Math.ceil(p / u), t = Buffer.alloc(u * o), n = Buffer.alloc(4), e = 0; e < o; ++e) {
        var s = a.createHash(r);
        s.update(f), n.writeUInt32BE(e, 0), s.update(n), s.digest().copy(t, e * u);
      }
      return t.slice(0, p);
    }, c.exports.makeScheme = function(f, p) {
      function r(u, o) {
        this.key = u, this.options = o;
      }
      return r.prototype.maxMessageLength = function() {
        return this.key.encryptedDataLength - 2 * c.exports.digestLength[this.options.encryptionSchemeOptions.hash || h] - 2;
      }, r.prototype.encPad = function(u) {
        var o = this.options.encryptionSchemeOptions.hash || h, t = this.options.encryptionSchemeOptions.mgf || c.exports.eme_oaep_mgf1, n = this.options.encryptionSchemeOptions.label || Buffer.alloc(0), e = this.key.encryptedDataLength, s = c.exports.digestLength[o];
        if (u.length > e - 2 * s - 2)
          throw new Error("Message is too long to encode into an encoded message with a length of " + e + " bytes, increaseemLen to fix this error (minimum value for given parameters and options: " + (e - 2 * s - 2) + ")");
        var d = a.createHash(o);
        d.update(n), d = d.digest();
        var v = Buffer.alloc(e - u.length - 2 * s - 1);
        v.fill(0), v[v.length - 1] = 1;
        for (var y = Buffer.concat([d, v, u]), m = a.randomBytes(s), B = t(m, y.length, o), E = 0; E < y.length; E++)
          y[E] ^= B[E];
        for (B = t(y, s, o), E = 0; E < m.length; E++)
          m[E] ^= B[E];
        var S = Buffer.alloc(1 + m.length + y.length);
        return S[0] = 0, m.copy(S, 1), y.copy(S, 1 + m.length), S;
      }, r.prototype.encUnPad = function(u) {
        var o = this.options.encryptionSchemeOptions.hash || h, t = this.options.encryptionSchemeOptions.mgf || c.exports.eme_oaep_mgf1, n = this.options.encryptionSchemeOptions.label || Buffer.alloc(0), e = c.exports.digestLength[o];
        if (u.length < 2 * e + 2)
          throw new Error("Error decoding message, the supplied message is not long enough to be a valid OAEP encoded message");
        for (var s = u.slice(1, e + 1), d = u.slice(1 + e), v = t(d, e, o), y = 0; y < s.length; y++)
          s[y] ^= v[y];
        for (v = t(s, d.length, o), y = 0; y < d.length; y++)
          d[y] ^= v[y];
        var m = a.createHash(o);
        m.update(n), m = m.digest();
        var B = d.slice(0, e);
        if (B.toString("hex") != m.toString("hex"))
          throw new Error("Error decoding message, the lHash calculated from the label provided and the lHash in the encrypted data do not match.");
        for (y = e; d[y++] === 0 && y < d.length; ) ;
        if (d[y - 1] != 1)
          throw new Error("Error decoding message, there is no padding message separator byte");
        return d.slice(y);
      }, new r(f, p);
    };
  })(oaep)), oaep.exports;
}
var pss = { exports: {} }, hasRequiredPss;
function requirePss() {
  if (hasRequiredPss) return pss.exports;
  hasRequiredPss = 1;
  var c = requireJsbn(), a = requireCryptoBrowserify();
  pss.exports = {
    isEncryption: !1,
    isSignature: !0
  };
  var h = "sha1", f = 20;
  return pss.exports.makeScheme = function(p, r) {
    var u = requireSchemes().pkcs1_oaep;
    function o(t, n) {
      this.key = t, this.options = n;
    }
    return o.prototype.sign = function(t) {
      var n = a.createHash(this.options.signingSchemeOptions.hash || h);
      n.update(t);
      var e = this.emsa_pss_encode(n.digest(), this.key.keySize - 1);
      return this.key.$doPrivate(new c(e)).toBuffer(this.key.encryptedDataLength);
    }, o.prototype.verify = function(t, n, e) {
      e && (n = Buffer.from(n, e)), n = new c(n);
      var s = Math.ceil((this.key.keySize - 1) / 8), d = this.key.$doPublic(n).toBuffer(s), v = a.createHash(this.options.signingSchemeOptions.hash || h);
      return v.update(t), this.emsa_pss_verify(v.digest(), d, this.key.keySize - 1);
    }, o.prototype.emsa_pss_encode = function(t, n) {
      var e = this.options.signingSchemeOptions.hash || h, s = this.options.signingSchemeOptions.mgf || u.eme_oaep_mgf1, d = this.options.signingSchemeOptions.saltLength || f, v = u.digestLength[e], y = Math.ceil(n / 8);
      if (y < v + d + 2)
        throw new Error(
          "Output length passed to emBits(" + n + ") is too small for the options specified(" + e + ", " + d + "). To fix this issue increase the value of emBits. (minimum size: " + (8 * v + 8 * d + 9) + ")"
        );
      var m = a.randomBytes(d), B = Buffer.alloc(8 + v + d);
      B.fill(0, 0, 8), t.copy(B, 8), m.copy(B, 8 + t.length);
      var E = a.createHash(e);
      E.update(B), E = E.digest();
      var S = Buffer.alloc(y - m.length - v - 2);
      S.fill(0);
      var O = Buffer.alloc(S.length + 1 + m.length);
      S.copy(O), O[S.length] = 1, m.copy(O, S.length + 1);
      for (var D = s(E, O.length, e), $ = Buffer.alloc(O.length), V = 0; V < D.length; V++)
        $[V] = O[V] ^ D[V];
      var J = 8 * y - n, ie = 255 ^ 255 >> 8 - J << 8 - J;
      $[0] = $[0] & ie;
      var ne = Buffer.alloc($.length + E.length + 1);
      return $.copy(ne, 0), E.copy(ne, $.length), ne[ne.length - 1] = 188, ne;
    }, o.prototype.emsa_pss_verify = function(t, n, e) {
      var s = this.options.signingSchemeOptions.hash || h, d = this.options.signingSchemeOptions.mgf || u.eme_oaep_mgf1, v = this.options.signingSchemeOptions.saltLength || f, y = u.digestLength[s], m = Math.ceil(e / 8);
      if (m < y + v + 2 || n[n.length - 1] != 188)
        return !1;
      var B = Buffer.alloc(m - y - 1);
      n.copy(B, 0, 0, m - y - 1);
      for (var E = 0, S = 0, O = 8 * m - e; S < O; S++)
        E |= 1 << 7 - S;
      if ((B[0] & E) !== 0)
        return !1;
      var D = n.slice(m - y - 1, m - 1), $ = d(D, B.length, s);
      for (S = 0; S < B.length; S++)
        B[S] ^= $[S];
      for (O = 8 * m - e, E = 255 ^ 255 >> 8 - O << 8 - O, B[0] = B[0] & E, S = 0; B[S] === 0 && S < B.length; S++) ;
      if (B[S] != 1)
        return !1;
      var V = B.slice(B.length - v), J = Buffer.alloc(8 + y + v);
      J.fill(0, 0, 8), t.copy(J, 8), V.copy(J, 8 + t.length);
      var ie = a.createHash(s);
      return ie.update(J), ie = ie.digest(), D.toString("hex") === ie.toString("hex");
    }, new o(p, r);
  }, pss.exports;
}
var hasRequiredSchemes;
function requireSchemes() {
  return hasRequiredSchemes || (hasRequiredSchemes = 1, (function(c) {
    c.exports = {
      pkcs1: requirePkcs1$1(),
      pkcs1_oaep: requireOaep(),
      pss: requirePss(),
      /**
       * Check if scheme has padding methods
       * @param scheme {string}
       * @returns {Boolean}
       */
      isEncryption: function(a) {
        return c.exports[a] && c.exports[a].isEncryption;
      },
      /**
       * Check if scheme has sign/verify methods
       * @param scheme {string}
       * @returns {Boolean}
       */
      isSignature: function(a) {
        return c.exports[a] && c.exports[a].isSignature;
      }
    };
  })(schemes)), schemes.exports;
}
var js, hasRequiredJs;
function requireJs() {
  if (hasRequiredJs) return js;
  hasRequiredJs = 1;
  var c = requireJsbn(), a = requireSchemes();
  return js = function(h, f) {
    var p = a.pkcs1.makeScheme(h, f);
    return {
      encrypt: function(r, u) {
        var o, t;
        return u ? (o = new c(p.encPad(r, { type: 1 })), t = h.$doPrivate(o)) : (o = new c(h.encryptionScheme.encPad(r)), t = h.$doPublic(o)), t.toBuffer(h.encryptedDataLength);
      },
      decrypt: function(r, u) {
        var o, t = new c(r);
        return u ? (o = h.$doPublic(t), p.encUnPad(o.toBuffer(h.encryptedDataLength), { type: 1 })) : (o = h.$doPrivate(t), h.encryptionScheme.encUnPad(o.toBuffer(h.encryptedDataLength)));
      }
    };
  }, js;
}
var io, hasRequiredIo;
function requireIo() {
  if (hasRequiredIo) return io;
  hasRequiredIo = 1;
  var c = requireCryptoBrowserify(), a = require$$0$1, h = requireSchemes();
  return io = function(f, p) {
    var r = h.pkcs1.makeScheme(f, p);
    return {
      encrypt: function(u, o) {
        var t;
        if (o)
          return t = a.RSA_PKCS1_PADDING, p.encryptionSchemeOptions && p.encryptionSchemeOptions.padding && (t = p.encryptionSchemeOptions.padding), c.privateEncrypt({
            key: p.rsaUtils.exportKey("private"),
            padding: t
          }, u);
        t = a.RSA_PKCS1_OAEP_PADDING, p.encryptionScheme === "pkcs1" && (t = a.RSA_PKCS1_PADDING), p.encryptionSchemeOptions && p.encryptionSchemeOptions.padding && (t = p.encryptionSchemeOptions.padding);
        var n = u;
        return t === a.RSA_NO_PADDING && (n = r.pkcs0pad(u)), c.publicEncrypt({
          key: p.rsaUtils.exportKey("public"),
          padding: t
        }, n);
      },
      decrypt: function(u, o) {
        var t;
        if (o)
          return t = a.RSA_PKCS1_PADDING, p.encryptionSchemeOptions && p.encryptionSchemeOptions.padding && (t = p.encryptionSchemeOptions.padding), c.publicDecrypt({
            key: p.rsaUtils.exportKey("public"),
            padding: t
          }, u);
        t = a.RSA_PKCS1_OAEP_PADDING, p.encryptionScheme === "pkcs1" && (t = a.RSA_PKCS1_PADDING), p.encryptionSchemeOptions && p.encryptionSchemeOptions.padding && (t = p.encryptionSchemeOptions.padding);
        var n = c.privateDecrypt({
          key: p.rsaUtils.exportKey("private"),
          padding: t
        }, u);
        return t === a.RSA_NO_PADDING ? r.pkcs0unpad(n) : n;
      }
    };
  }, io;
}
var node12, hasRequiredNode12;
function requireNode12() {
  if (hasRequiredNode12) return node12;
  hasRequiredNode12 = 1;
  var c = requireCryptoBrowserify(), a = require$$0$1, h = requireSchemes();
  return node12 = function(f, p) {
    var r = requireJs()(f, p), u = h.pkcs1.makeScheme(f, p);
    return {
      encrypt: function(o, t) {
        if (t)
          return r.encrypt(o, t);
        var n = a.RSA_PKCS1_OAEP_PADDING;
        p.encryptionScheme === "pkcs1" && (n = a.RSA_PKCS1_PADDING), p.encryptionSchemeOptions && p.encryptionSchemeOptions.padding && (n = p.encryptionSchemeOptions.padding);
        var e = o;
        return n === a.RSA_NO_PADDING && (e = u.pkcs0pad(o)), c.publicEncrypt({
          key: p.rsaUtils.exportKey("public"),
          padding: n
        }, e);
      },
      decrypt: function(o, t) {
        if (t)
          return r.decrypt(o, t);
        var n = a.RSA_PKCS1_OAEP_PADDING;
        p.encryptionScheme === "pkcs1" && (n = a.RSA_PKCS1_PADDING), p.encryptionSchemeOptions && p.encryptionSchemeOptions.padding && (n = p.encryptionSchemeOptions.padding);
        var e = c.privateDecrypt({
          key: p.rsaUtils.exportKey("private"),
          padding: n
        }, o);
        return n === a.RSA_NO_PADDING ? u.pkcs0unpad(e) : e;
      }
    };
  }, node12;
}
var encryptEngines, hasRequiredEncryptEngines;
function requireEncryptEngines() {
  if (hasRequiredEncryptEngines) return encryptEngines;
  hasRequiredEncryptEngines = 1;
  var c = requireCryptoBrowserify();
  return encryptEngines = {
    getEngine: function(a, h) {
      var f = requireJs();
      return h.environment === "node" && typeof c.publicEncrypt == "function" && typeof c.privateDecrypt == "function" && (typeof c.privateEncrypt == "function" && typeof c.publicDecrypt == "function" ? f = requireIo() : f = requireNode12()), f(a, h);
    }
  }, encryptEngines;
}
var hasRequiredRsa;
function requireRsa() {
  if (hasRequiredRsa) return rsa;
  hasRequiredRsa = 1;
  var c = requireUtils()._;
  requireCryptoBrowserify();
  var a = requireJsbn(), h = requireUtils(), f = requireSchemes(), p = requireEncryptEngines();
  return rsa.BigInteger = a, rsa.Key = (function() {
    function r() {
      this.n = null, this.e = 0, this.d = null, this.p = null, this.q = null, this.dmp1 = null, this.dmq1 = null, this.coeff = null;
    }
    return r.prototype.setOptions = function(u) {
      var o = f[u.signingScheme], t = f[u.encryptionScheme];
      o === t ? this.signingScheme = this.encryptionScheme = t.makeScheme(this, u) : (this.encryptionScheme = t.makeScheme(this, u), this.signingScheme = o.makeScheme(this, u)), this.encryptEngine = p.getEngine(this, u);
    }, r.prototype.generate = function(u, o) {
      var t = u >> 1;
      this.e = parseInt(o, 16);
      for (var n = new a(o, 16); ; ) {
        for (; this.p = new a(u - t, 1), !(this.p.subtract(a.ONE).gcd(n).compareTo(a.ONE) === 0 && this.p.isProbablePrime(10)); )
          ;
        for (; this.q = new a(t, 1), !(this.q.subtract(a.ONE).gcd(n).compareTo(a.ONE) === 0 && this.q.isProbablePrime(10)); )
          ;
        if (this.p.compareTo(this.q) <= 0) {
          var e = this.p;
          this.p = this.q, this.q = e;
        }
        var s = this.p.subtract(a.ONE), d = this.q.subtract(a.ONE), v = s.multiply(d);
        if (v.gcd(n).compareTo(a.ONE) === 0) {
          if (this.n = this.p.multiply(this.q), this.n.bitLength() < u)
            continue;
          this.d = n.modInverse(v), this.dmp1 = this.d.mod(s), this.dmq1 = this.d.mod(d), this.coeff = this.q.modInverse(this.p);
          break;
        }
      }
      this.$$recalculateCache();
    }, r.prototype.setPrivate = function(u, o, t, n, e, s, d, v) {
      if (u && o && t && u.length > 0 && (c.isNumber(o) || o.length > 0) && t.length > 0)
        this.n = new a(u), this.e = c.isNumber(o) ? o : h.get32IntFromBuffer(o, 0), this.d = new a(t), n && e && s && d && v && (this.p = new a(n), this.q = new a(e), this.dmp1 = new a(s), this.dmq1 = new a(d), this.coeff = new a(v)), this.$$recalculateCache();
      else
        throw Error("Invalid RSA private key");
    }, r.prototype.setPublic = function(u, o) {
      if (u && o && u.length > 0 && (c.isNumber(o) || o.length > 0))
        this.n = new a(u), this.e = c.isNumber(o) ? o : h.get32IntFromBuffer(o, 0), this.$$recalculateCache();
      else
        throw Error("Invalid RSA public key");
    }, r.prototype.$doPrivate = function(u) {
      if (this.p || this.q)
        return u.modPow(this.d, this.n);
      for (var o = u.mod(this.p).modPow(this.dmp1, this.p), t = u.mod(this.q).modPow(this.dmq1, this.q); o.compareTo(t) < 0; )
        o = o.add(this.p);
      return o.subtract(t).multiply(this.coeff).mod(this.p).multiply(this.q).add(t);
    }, r.prototype.$doPublic = function(u) {
      return u.modPowInt(this.e, this.n);
    }, r.prototype.encrypt = function(u, o) {
      var t = [], n = [], e = u.length, s = Math.ceil(e / this.maxMessageLength) || 1, d = Math.ceil(e / s || 1);
      if (s == 1)
        t.push(u);
      else
        for (var v = 0; v < s; v++)
          t.push(u.slice(v * d, (v + 1) * d));
      for (var y = 0; y < t.length; y++)
        n.push(this.encryptEngine.encrypt(t[y], o));
      return Buffer.concat(n);
    }, r.prototype.decrypt = function(u, o) {
      if (u.length % this.encryptedDataLength > 0)
        throw Error("Incorrect data or key");
      for (var t = [], n = 0, e = 0, s = u.length / this.encryptedDataLength, d = 0; d < s; d++)
        n = d * this.encryptedDataLength, e = n + this.encryptedDataLength, t.push(this.encryptEngine.decrypt(u.slice(n, Math.min(e, u.length)), o));
      return Buffer.concat(t);
    }, r.prototype.sign = function(u) {
      return this.signingScheme.sign.apply(this.signingScheme, arguments);
    }, r.prototype.verify = function(u, o, t) {
      return this.signingScheme.verify.apply(this.signingScheme, arguments);
    }, r.prototype.isPrivate = function() {
      return this.n && this.e && this.d && !0 || !1;
    }, r.prototype.isPublic = function(u) {
      return this.n && this.e && !(u && this.d) || !1;
    }, Object.defineProperty(r.prototype, "keySize", {
      get: function() {
        return this.cache.keyBitLength;
      }
    }), Object.defineProperty(r.prototype, "encryptedDataLength", {
      get: function() {
        return this.cache.keyByteLength;
      }
    }), Object.defineProperty(r.prototype, "maxMessageLength", {
      get: function() {
        return this.encryptionScheme.maxMessageLength();
      }
    }), r.prototype.$$recalculateCache = function() {
      this.cache = this.cache || {}, this.cache.keyBitLength = this.n.bitLength(), this.cache.keyByteLength = this.cache.keyBitLength + 6 >> 3;
    }, r;
  })(), rsa;
}
var ber = { exports: {} }, errors$1, hasRequiredErrors$1;
function requireErrors$1() {
  return hasRequiredErrors$1 || (hasRequiredErrors$1 = 1, errors$1 = {
    newInvalidAsn1Error: function(c) {
      var a = new Error();
      return a.name = "InvalidAsn1Error", a.message = c || "", a;
    }
  }), errors$1;
}
var types, hasRequiredTypes;
function requireTypes() {
  return hasRequiredTypes || (hasRequiredTypes = 1, types = {
    EOC: 0,
    Boolean: 1,
    Integer: 2,
    BitString: 3,
    OctetString: 4,
    Null: 5,
    OID: 6,
    ObjectDescriptor: 7,
    External: 8,
    Real: 9,
    // float
    Enumeration: 10,
    PDV: 11,
    Utf8String: 12,
    RelativeOID: 13,
    Sequence: 16,
    Set: 17,
    NumericString: 18,
    PrintableString: 19,
    T61String: 20,
    VideotexString: 21,
    IA5String: 22,
    UTCTime: 23,
    GeneralizedTime: 24,
    GraphicString: 25,
    VisibleString: 26,
    GeneralString: 28,
    UniversalString: 29,
    CharacterString: 30,
    BMPString: 31,
    Constructor: 32,
    Context: 128
  }), types;
}
var assert = { exports: {} }, errors = {}, hasRequiredErrors;
function requireErrors() {
  if (hasRequiredErrors) return errors;
  hasRequiredErrors = 1;
  function c(S) {
    "@babel/helpers - typeof";
    return c = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(O) {
      return typeof O;
    } : function(O) {
      return O && typeof Symbol == "function" && O.constructor === Symbol && O !== Symbol.prototype ? "symbol" : typeof O;
    }, c(S);
  }
  function a(S, O, D) {
    return Object.defineProperty(S, "prototype", { writable: !1 }), S;
  }
  function h(S, O) {
    if (!(S instanceof O))
      throw new TypeError("Cannot call a class as a function");
  }
  function f(S, O) {
    if (typeof O != "function" && O !== null)
      throw new TypeError("Super expression must either be null or a function");
    S.prototype = Object.create(O && O.prototype, { constructor: { value: S, writable: !0, configurable: !0 } }), Object.defineProperty(S, "prototype", { writable: !1 }), O && p(S, O);
  }
  function p(S, O) {
    return p = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function($, V) {
      return $.__proto__ = V, $;
    }, p(S, O);
  }
  function r(S) {
    var O = t();
    return function() {
      var $ = n(S), V;
      if (O) {
        var J = n(this).constructor;
        V = Reflect.construct($, arguments, J);
      } else
        V = $.apply(this, arguments);
      return u(this, V);
    };
  }
  function u(S, O) {
    if (O && (c(O) === "object" || typeof O == "function"))
      return O;
    if (O !== void 0)
      throw new TypeError("Derived constructors may only return object or undefined");
    return o(S);
  }
  function o(S) {
    if (S === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return S;
  }
  function t() {
    if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
    if (typeof Proxy == "function") return !0;
    try {
      return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      })), !0;
    } catch {
      return !1;
    }
  }
  function n(S) {
    return n = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(D) {
      return D.__proto__ || Object.getPrototypeOf(D);
    }, n(S);
  }
  var e = {}, s, d;
  function v(S, O, D) {
    D || (D = Error);
    function $(J, ie, ne) {
      return typeof O == "string" ? O : O(J, ie, ne);
    }
    var V = /* @__PURE__ */ (function(J) {
      f(ne, J);
      var ie = r(ne);
      function ne(le, Y, b) {
        var g;
        return h(this, ne), g = ie.call(this, $(le, Y, b)), g.code = S, g;
      }
      return a(ne);
    })(D);
    e[S] = V;
  }
  function y(S, O) {
    if (Array.isArray(S)) {
      var D = S.length;
      return S = S.map(function($) {
        return String($);
      }), D > 2 ? "one of ".concat(O, " ").concat(S.slice(0, D - 1).join(", "), ", or ") + S[D - 1] : D === 2 ? "one of ".concat(O, " ").concat(S[0], " or ").concat(S[1]) : "of ".concat(O, " ").concat(S[0]);
    } else
      return "of ".concat(O, " ").concat(String(S));
  }
  function m(S, O, D) {
    return S.substr(0, O.length) === O;
  }
  function B(S, O, D) {
    return (D === void 0 || D > S.length) && (D = S.length), S.substring(D - O.length, D) === O;
  }
  function E(S, O, D) {
    return typeof D != "number" && (D = 0), D + O.length > S.length ? !1 : S.indexOf(O, D) !== -1;
  }
  return v("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError), v("ERR_INVALID_ARG_TYPE", function(S, O, D) {
    s === void 0 && (s = requireAssert()), s(typeof S == "string", "'name' must be a string");
    var $;
    typeof O == "string" && m(O, "not ") ? ($ = "must not be", O = O.replace(/^not /, "")) : $ = "must be";
    var V;
    if (B(S, " argument"))
      V = "The ".concat(S, " ").concat($, " ").concat(y(O, "type"));
    else {
      var J = E(S, ".") ? "property" : "argument";
      V = 'The "'.concat(S, '" ').concat(J, " ").concat($, " ").concat(y(O, "type"));
    }
    return V += ". Received type ".concat(c(D)), V;
  }, TypeError), v("ERR_INVALID_ARG_VALUE", function(S, O) {
    var D = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "is invalid";
    d === void 0 && (d = requireUtil$1());
    var $ = d.inspect(O);
    return $.length > 128 && ($ = "".concat($.slice(0, 128), "...")), "The argument '".concat(S, "' ").concat(D, ". Received ").concat($);
  }, TypeError), v("ERR_INVALID_RETURN_VALUE", function(S, O, D) {
    var $;
    return D && D.constructor && D.constructor.name ? $ = "instance of ".concat(D.constructor.name) : $ = "type ".concat(c(D)), "Expected ".concat(S, ' to be returned from the "').concat(O, '"') + " function but got ".concat($, ".");
  }, TypeError), v("ERR_MISSING_ARGS", function() {
    for (var S = arguments.length, O = new Array(S), D = 0; D < S; D++)
      O[D] = arguments[D];
    s === void 0 && (s = requireAssert()), s(O.length > 0, "At least one arg needs to be specified");
    var $ = "The ", V = O.length;
    switch (O = O.map(function(J) {
      return '"'.concat(J, '"');
    }), V) {
      case 1:
        $ += "".concat(O[0], " argument");
        break;
      case 2:
        $ += "".concat(O[0], " and ").concat(O[1], " arguments");
        break;
      default:
        $ += O.slice(0, V - 1).join(", "), $ += ", and ".concat(O[V - 1], " arguments");
        break;
    }
    return "".concat($, " must be specified");
  }, TypeError), errors.codes = e, errors;
}
var assertion_error, hasRequiredAssertion_error;
function requireAssertion_error() {
  if (hasRequiredAssertion_error) return assertion_error;
  hasRequiredAssertion_error = 1;
  function c(R, w) {
    var M = Object.keys(R);
    if (Object.getOwnPropertySymbols) {
      var x = Object.getOwnPropertySymbols(R);
      w && (x = x.filter(function(L) {
        return Object.getOwnPropertyDescriptor(R, L).enumerable;
      })), M.push.apply(M, x);
    }
    return M;
  }
  function a(R) {
    for (var w = 1; w < arguments.length; w++) {
      var M = arguments[w] != null ? arguments[w] : {};
      w % 2 ? c(Object(M), !0).forEach(function(x) {
        h(R, x, M[x]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(R, Object.getOwnPropertyDescriptors(M)) : c(Object(M)).forEach(function(x) {
        Object.defineProperty(R, x, Object.getOwnPropertyDescriptor(M, x));
      });
    }
    return R;
  }
  function h(R, w, M) {
    return w = u(w), w in R ? Object.defineProperty(R, w, { value: M, enumerable: !0, configurable: !0, writable: !0 }) : R[w] = M, R;
  }
  function f(R, w) {
    if (!(R instanceof w))
      throw new TypeError("Cannot call a class as a function");
  }
  function p(R, w) {
    for (var M = 0; M < w.length; M++) {
      var x = w[M];
      x.enumerable = x.enumerable || !1, x.configurable = !0, "value" in x && (x.writable = !0), Object.defineProperty(R, u(x.key), x);
    }
  }
  function r(R, w, M) {
    return w && p(R.prototype, w), Object.defineProperty(R, "prototype", { writable: !1 }), R;
  }
  function u(R) {
    var w = o(R, "string");
    return S(w) === "symbol" ? w : String(w);
  }
  function o(R, w) {
    if (S(R) !== "object" || R === null) return R;
    var M = R[Symbol.toPrimitive];
    if (M !== void 0) {
      var x = M.call(R, w);
      if (S(x) !== "object") return x;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return String(R);
  }
  function t(R, w) {
    if (typeof w != "function" && w !== null)
      throw new TypeError("Super expression must either be null or a function");
    R.prototype = Object.create(w && w.prototype, { constructor: { value: R, writable: !0, configurable: !0 } }), Object.defineProperty(R, "prototype", { writable: !1 }), w && B(R, w);
  }
  function n(R) {
    var w = y();
    return function() {
      var x = E(R), L;
      if (w) {
        var K = E(this).constructor;
        L = Reflect.construct(x, arguments, K);
      } else
        L = x.apply(this, arguments);
      return e(this, L);
    };
  }
  function e(R, w) {
    if (w && (S(w) === "object" || typeof w == "function"))
      return w;
    if (w !== void 0)
      throw new TypeError("Derived constructors may only return object or undefined");
    return s(R);
  }
  function s(R) {
    if (R === void 0)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return R;
  }
  function d(R) {
    var w = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
    return d = function(x) {
      if (x === null || !m(x)) return x;
      if (typeof x != "function")
        throw new TypeError("Super expression must either be null or a function");
      if (typeof w < "u") {
        if (w.has(x)) return w.get(x);
        w.set(x, L);
      }
      function L() {
        return v(x, arguments, E(this).constructor);
      }
      return L.prototype = Object.create(x.prototype, { constructor: { value: L, enumerable: !1, writable: !0, configurable: !0 } }), B(L, x);
    }, d(R);
  }
  function v(R, w, M) {
    return y() ? v = Reflect.construct.bind() : v = function(L, K, Q) {
      var U = [null];
      U.push.apply(U, K);
      var N = Function.bind.apply(L, U), F = new N();
      return Q && B(F, Q.prototype), F;
    }, v.apply(null, arguments);
  }
  function y() {
    if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
    if (typeof Proxy == "function") return !0;
    try {
      return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      })), !0;
    } catch {
      return !1;
    }
  }
  function m(R) {
    return Function.toString.call(R).indexOf("[native code]") !== -1;
  }
  function B(R, w) {
    return B = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(x, L) {
      return x.__proto__ = L, x;
    }, B(R, w);
  }
  function E(R) {
    return E = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(M) {
      return M.__proto__ || Object.getPrototypeOf(M);
    }, E(R);
  }
  function S(R) {
    "@babel/helpers - typeof";
    return S = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(w) {
      return typeof w;
    } : function(w) {
      return w && typeof Symbol == "function" && w.constructor === Symbol && w !== Symbol.prototype ? "symbol" : typeof w;
    }, S(R);
  }
  var O = requireUtil$1(), D = O.inspect, $ = requireErrors(), V = $.codes.ERR_INVALID_ARG_TYPE;
  function J(R, w, M) {
    return (M === void 0 || M > R.length) && (M = R.length), R.substring(M - w.length, M) === w;
  }
  function ie(R, w) {
    if (w = Math.floor(w), R.length == 0 || w == 0) return "";
    var M = R.length * w;
    for (w = Math.floor(Math.log(w) / Math.log(2)); w; )
      R += R, w--;
    return R += R.substring(0, M - R.length), R;
  }
  var ne = "", le = "", Y = "", b = "", g = {
    deepStrictEqual: "Expected values to be strictly deep-equal:",
    strictEqual: "Expected values to be strictly equal:",
    strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
    deepEqual: "Expected values to be loosely deep-equal:",
    equal: "Expected values to be loosely equal:",
    notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
    notStrictEqual: 'Expected "actual" to be strictly unequal to:',
    notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
    notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
    notEqual: 'Expected "actual" to be loosely unequal to:',
    notIdentical: "Values identical but not reference-equal:"
  }, l = 10;
  function _(R) {
    var w = Object.keys(R), M = Object.create(Object.getPrototypeOf(R));
    return w.forEach(function(x) {
      M[x] = R[x];
    }), Object.defineProperty(M, "message", {
      value: R.message
    }), M;
  }
  function A(R) {
    return D(R, {
      compact: !1,
      customInspect: !1,
      depth: 1e3,
      maxArrayLength: 1 / 0,
      // Assert compares only enumerable properties (with a few exceptions).
      showHidden: !1,
      // Having a long line as error is better than wrapping the line for
      // comparison for now.
      // TODO(BridgeAR): `breakLength` should be limited as soon as soon as we
      // have meta information about the inspected properties (i.e., know where
      // in what line the property starts and ends).
      breakLength: 1 / 0,
      // Assert does not detect proxies currently.
      showProxy: !1,
      sorted: !0,
      // Inspect getters as we also check them when comparing entries.
      getters: !0
    });
  }
  function q(R, w, M) {
    var x = "", L = "", K = 0, Q = "", U = !1, N = A(R), F = N.split(`
`), ee = A(w).split(`
`), ae = 0, G = "";
    if (M === "strictEqual" && S(R) === "object" && S(w) === "object" && R !== null && w !== null && (M = "strictEqualObject"), F.length === 1 && ee.length === 1 && F[0] !== ee[0]) {
      var z = F[0].length + ee[0].length;
      if (z <= l) {
        if ((S(R) !== "object" || R === null) && (S(w) !== "object" || w === null) && (R !== 0 || w !== 0))
          return "".concat(g[M], `

`) + "".concat(F[0], " !== ").concat(ee[0], `
`);
      } else if (M !== "strictEqualObject") {
        var fe = process$1.stderr && process$1.stderr.isTTY ? process$1.stderr.columns : 80;
        if (z < fe) {
          for (; F[0][ae] === ee[0][ae]; )
            ae++;
          ae > 2 && (G = `
  `.concat(ie(" ", ae), "^"), ae = 0);
        }
      }
    }
    for (var me = F[F.length - 1], xe = ee[ee.length - 1]; me === xe && (ae++ < 2 ? Q = `
  `.concat(me).concat(Q) : x = me, F.pop(), ee.pop(), !(F.length === 0 || ee.length === 0)); )
      me = F[F.length - 1], xe = ee[ee.length - 1];
    var _e = Math.max(F.length, ee.length);
    if (_e === 0) {
      var Be = N.split(`
`);
      if (Be.length > 30)
        for (Be[26] = "".concat(ne, "...").concat(b); Be.length > 27; )
          Be.pop();
      return "".concat(g.notIdentical, `

`).concat(Be.join(`
`), `
`);
    }
    ae > 3 && (Q = `
`.concat(ne, "...").concat(b).concat(Q), U = !0), x !== "" && (Q = `
  `.concat(x).concat(Q), x = "");
    var Ae = 0, be = g[M] + `
`.concat(le, "+ actual").concat(b, " ").concat(Y, "- expected").concat(b), Fe = " ".concat(ne, "...").concat(b, " Lines skipped");
    for (ae = 0; ae < _e; ae++) {
      var qe = ae - K;
      if (F.length < ae + 1)
        qe > 1 && ae > 2 && (qe > 4 ? (L += `
`.concat(ne, "...").concat(b), U = !0) : qe > 3 && (L += `
  `.concat(ee[ae - 2]), Ae++), L += `
  `.concat(ee[ae - 1]), Ae++), K = ae, x += `
`.concat(Y, "-").concat(b, " ").concat(ee[ae]), Ae++;
      else if (ee.length < ae + 1)
        qe > 1 && ae > 2 && (qe > 4 ? (L += `
`.concat(ne, "...").concat(b), U = !0) : qe > 3 && (L += `
  `.concat(F[ae - 2]), Ae++), L += `
  `.concat(F[ae - 1]), Ae++), K = ae, L += `
`.concat(le, "+").concat(b, " ").concat(F[ae]), Ae++;
      else {
        var Me = ee[ae], Te = F[ae], oe = Te !== Me && (!J(Te, ",") || Te.slice(0, -1) !== Me);
        oe && J(Me, ",") && Me.slice(0, -1) === Te && (oe = !1, Te += ","), oe ? (qe > 1 && ae > 2 && (qe > 4 ? (L += `
`.concat(ne, "...").concat(b), U = !0) : qe > 3 && (L += `
  `.concat(F[ae - 2]), Ae++), L += `
  `.concat(F[ae - 1]), Ae++), K = ae, L += `
`.concat(le, "+").concat(b, " ").concat(Te), x += `
`.concat(Y, "-").concat(b, " ").concat(Me), Ae += 2) : (L += x, x = "", (qe === 1 || ae === 0) && (L += `
  `.concat(Te), Ae++));
      }
      if (Ae > 20 && ae < _e - 2)
        return "".concat(be).concat(Fe, `
`).concat(L, `
`).concat(ne, "...").concat(b).concat(x, `
`) + "".concat(ne, "...").concat(b);
    }
    return "".concat(be).concat(U ? Fe : "", `
`).concat(L).concat(x).concat(Q).concat(G);
  }
  var P = /* @__PURE__ */ (function(R, w) {
    t(x, R);
    var M = n(x);
    function x(L) {
      var K;
      if (f(this, x), S(L) !== "object" || L === null)
        throw new V("options", "Object", L);
      var Q = L.message, U = L.operator, N = L.stackStartFn, F = L.actual, ee = L.expected, ae = Error.stackTraceLimit;
      if (Error.stackTraceLimit = 0, Q != null)
        K = M.call(this, String(Q));
      else if (process$1.stderr && process$1.stderr.isTTY && (process$1.stderr && process$1.stderr.getColorDepth && process$1.stderr.getColorDepth() !== 1 ? (ne = "\x1B[34m", le = "\x1B[32m", b = "\x1B[39m", Y = "\x1B[31m") : (ne = "", le = "", b = "", Y = "")), S(F) === "object" && F !== null && S(ee) === "object" && ee !== null && "stack" in F && F instanceof Error && "stack" in ee && ee instanceof Error && (F = _(F), ee = _(ee)), U === "deepStrictEqual" || U === "strictEqual")
        K = M.call(this, q(F, ee, U));
      else if (U === "notDeepStrictEqual" || U === "notStrictEqual") {
        var G = g[U], z = A(F).split(`
`);
        if (U === "notStrictEqual" && S(F) === "object" && F !== null && (G = g.notStrictEqualObject), z.length > 30)
          for (z[26] = "".concat(ne, "...").concat(b); z.length > 27; )
            z.pop();
        z.length === 1 ? K = M.call(this, "".concat(G, " ").concat(z[0])) : K = M.call(this, "".concat(G, `

`).concat(z.join(`
`), `
`));
      } else {
        var fe = A(F), me = "", xe = g[U];
        U === "notDeepEqual" || U === "notEqual" ? (fe = "".concat(g[U], `

`).concat(fe), fe.length > 1024 && (fe = "".concat(fe.slice(0, 1021), "..."))) : (me = "".concat(A(ee)), fe.length > 512 && (fe = "".concat(fe.slice(0, 509), "...")), me.length > 512 && (me = "".concat(me.slice(0, 509), "...")), U === "deepEqual" || U === "equal" ? fe = "".concat(xe, `

`).concat(fe, `

should equal

`) : me = " ".concat(U, " ").concat(me)), K = M.call(this, "".concat(fe).concat(me));
      }
      return Error.stackTraceLimit = ae, K.generatedMessage = !Q, Object.defineProperty(s(K), "name", {
        value: "AssertionError [ERR_ASSERTION]",
        enumerable: !1,
        writable: !0,
        configurable: !0
      }), K.code = "ERR_ASSERTION", K.actual = F, K.expected = ee, K.operator = U, Error.captureStackTrace && Error.captureStackTrace(s(K), N), K.stack, K.name = "AssertionError", e(K);
    }
    return r(x, [{
      key: "toString",
      value: function() {
        return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
      }
    }, {
      key: w,
      value: function(K, Q) {
        return D(this, a(a({}, Q), {}, {
          customInspect: !1,
          depth: 0
        }));
      }
    }]), x;
  })(/* @__PURE__ */ d(Error), D.custom);
  return assertion_error = P, assertion_error;
}
var isArguments, hasRequiredIsArguments;
function requireIsArguments() {
  if (hasRequiredIsArguments) return isArguments;
  hasRequiredIsArguments = 1;
  var c = Object.prototype.toString;
  return isArguments = function(h) {
    var f = c.call(h), p = f === "[object Arguments]";
    return p || (p = f !== "[object Array]" && h !== null && typeof h == "object" && typeof h.length == "number" && h.length >= 0 && c.call(h.callee) === "[object Function]"), p;
  }, isArguments;
}
var implementation$3, hasRequiredImplementation$3;
function requireImplementation$3() {
  if (hasRequiredImplementation$3) return implementation$3;
  hasRequiredImplementation$3 = 1;
  var c;
  if (!Object.keys) {
    var a = Object.prototype.hasOwnProperty, h = Object.prototype.toString, f = requireIsArguments(), p = Object.prototype.propertyIsEnumerable, r = !p.call({ toString: null }, "toString"), u = p.call(function() {
    }, "prototype"), o = [
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "constructor"
    ], t = function(d) {
      var v = d.constructor;
      return v && v.prototype === d;
    }, n = {
      $applicationCache: !0,
      $console: !0,
      $external: !0,
      $frame: !0,
      $frameElement: !0,
      $frames: !0,
      $innerHeight: !0,
      $innerWidth: !0,
      $onmozfullscreenchange: !0,
      $onmozfullscreenerror: !0,
      $outerHeight: !0,
      $outerWidth: !0,
      $pageXOffset: !0,
      $pageYOffset: !0,
      $parent: !0,
      $scrollLeft: !0,
      $scrollTop: !0,
      $scrollX: !0,
      $scrollY: !0,
      $self: !0,
      $webkitIndexedDB: !0,
      $webkitStorageInfo: !0,
      $window: !0
    }, e = (function() {
      if (typeof window > "u")
        return !1;
      for (var d in window)
        try {
          if (!n["$" + d] && a.call(window, d) && window[d] !== null && typeof window[d] == "object")
            try {
              t(window[d]);
            } catch {
              return !0;
            }
        } catch {
          return !0;
        }
      return !1;
    })(), s = function(d) {
      if (typeof window > "u" || !e)
        return t(d);
      try {
        return t(d);
      } catch {
        return !1;
      }
    };
    c = function(v) {
      var y = v !== null && typeof v == "object", m = h.call(v) === "[object Function]", B = f(v), E = y && h.call(v) === "[object String]", S = [];
      if (!y && !m && !B)
        throw new TypeError("Object.keys called on a non-object");
      var O = u && m;
      if (E && v.length > 0 && !a.call(v, 0))
        for (var D = 0; D < v.length; ++D)
          S.push(String(D));
      if (B && v.length > 0)
        for (var $ = 0; $ < v.length; ++$)
          S.push(String($));
      else
        for (var V in v)
          !(O && V === "prototype") && a.call(v, V) && S.push(String(V));
      if (r)
        for (var J = s(v), ie = 0; ie < o.length; ++ie)
          !(J && o[ie] === "constructor") && a.call(v, o[ie]) && S.push(o[ie]);
      return S;
    };
  }
  return implementation$3 = c, implementation$3;
}
var objectKeys, hasRequiredObjectKeys;
function requireObjectKeys() {
  if (hasRequiredObjectKeys) return objectKeys;
  hasRequiredObjectKeys = 1;
  var c = Array.prototype.slice, a = requireIsArguments(), h = Object.keys, f = h ? function(u) {
    return h(u);
  } : requireImplementation$3(), p = Object.keys;
  return f.shim = function() {
    if (Object.keys) {
      var u = (function() {
        var o = Object.keys(arguments);
        return o && o.length === arguments.length;
      })(1, 2);
      u || (Object.keys = function(t) {
        return a(t) ? p(c.call(t)) : p(t);
      });
    } else
      Object.keys = f;
    return Object.keys || f;
  }, objectKeys = f, objectKeys;
}
var implementation$2, hasRequiredImplementation$2;
function requireImplementation$2() {
  if (hasRequiredImplementation$2) return implementation$2;
  hasRequiredImplementation$2 = 1;
  var c = requireObjectKeys(), a = requireShams$1()(), h = /* @__PURE__ */ requireCallBound$1(), f = /* @__PURE__ */ requireEsObjectAtoms(), p = h("Array.prototype.push"), r = h("Object.prototype.propertyIsEnumerable"), u = a ? f.getOwnPropertySymbols : null;
  return implementation$2 = function(t, n) {
    if (t == null)
      throw new TypeError("target must be an object");
    var e = f(t);
    if (arguments.length === 1)
      return e;
    for (var s = 1; s < arguments.length; ++s) {
      var d = f(arguments[s]), v = c(d), y = a && (f.getOwnPropertySymbols || u);
      if (y)
        for (var m = y(d), B = 0; B < m.length; ++B) {
          var E = m[B];
          r(d, E) && p(v, E);
        }
      for (var S = 0; S < v.length; ++S) {
        var O = v[S];
        if (r(d, O)) {
          var D = d[O];
          e[O] = D;
        }
      }
    }
    return e;
  }, implementation$2;
}
var polyfill$2, hasRequiredPolyfill$2;
function requirePolyfill$2() {
  if (hasRequiredPolyfill$2) return polyfill$2;
  hasRequiredPolyfill$2 = 1;
  var c = requireImplementation$2(), a = function() {
    if (!Object.assign)
      return !1;
    for (var f = "abcdefghijklmnopqrst", p = f.split(""), r = {}, u = 0; u < p.length; ++u)
      r[p[u]] = p[u];
    var o = Object.assign({}, r), t = "";
    for (var n in o)
      t += n;
    return f !== t;
  }, h = function() {
    if (!Object.assign || !Object.preventExtensions)
      return !1;
    var f = Object.preventExtensions({ 1: 2 });
    try {
      Object.assign(f, "xy");
    } catch {
      return f[1] === "y";
    }
    return !1;
  };
  return polyfill$2 = function() {
    return !Object.assign || a() || h() ? c : Object.assign;
  }, polyfill$2;
}
var implementation$1, hasRequiredImplementation$1;
function requireImplementation$1() {
  if (hasRequiredImplementation$1) return implementation$1;
  hasRequiredImplementation$1 = 1;
  var c = function(a) {
    return a !== a;
  };
  return implementation$1 = function(h, f) {
    return h === 0 && f === 0 ? 1 / h === 1 / f : !!(h === f || c(h) && c(f));
  }, implementation$1;
}
var polyfill$1, hasRequiredPolyfill$1;
function requirePolyfill$1() {
  if (hasRequiredPolyfill$1) return polyfill$1;
  hasRequiredPolyfill$1 = 1;
  var c = requireImplementation$1();
  return polyfill$1 = function() {
    return typeof Object.is == "function" ? Object.is : c;
  }, polyfill$1;
}
var callBound, hasRequiredCallBound;
function requireCallBound() {
  if (hasRequiredCallBound) return callBound;
  hasRequiredCallBound = 1;
  var c = /* @__PURE__ */ requireGetIntrinsic(), a = requireCallBind(), h = a(c("String.prototype.indexOf"));
  return callBound = function(p, r) {
    var u = c(p, !!r);
    return typeof u == "function" && h(p, ".prototype.") > -1 ? a(u) : u;
  }, callBound;
}
var defineProperties_1, hasRequiredDefineProperties;
function requireDefineProperties() {
  if (hasRequiredDefineProperties) return defineProperties_1;
  hasRequiredDefineProperties = 1;
  var c = requireObjectKeys(), a = typeof Symbol == "function" && typeof /* @__PURE__ */ Symbol("foo") == "symbol", h = Object.prototype.toString, f = Array.prototype.concat, p = /* @__PURE__ */ requireDefineDataProperty(), r = function(n) {
    return typeof n == "function" && h.call(n) === "[object Function]";
  }, u = /* @__PURE__ */ requireHasPropertyDescriptors()(), o = function(n, e, s, d) {
    if (e in n) {
      if (d === !0) {
        if (n[e] === s)
          return;
      } else if (!r(d) || !d())
        return;
    }
    u ? p(n, e, s, !0) : p(n, e, s);
  }, t = function(n, e) {
    var s = arguments.length > 2 ? arguments[2] : {}, d = c(e);
    a && (d = f.call(d, Object.getOwnPropertySymbols(e)));
    for (var v = 0; v < d.length; v += 1)
      o(n, d[v], e[d[v]], s[d[v]]);
  };
  return t.supportsDescriptors = !!u, defineProperties_1 = t, defineProperties_1;
}
var shim$1, hasRequiredShim$1;
function requireShim$1() {
  if (hasRequiredShim$1) return shim$1;
  hasRequiredShim$1 = 1;
  var c = requirePolyfill$1(), a = requireDefineProperties();
  return shim$1 = function() {
    var f = c();
    return a(Object, { is: f }, {
      is: function() {
        return Object.is !== f;
      }
    }), f;
  }, shim$1;
}
var objectIs, hasRequiredObjectIs;
function requireObjectIs() {
  if (hasRequiredObjectIs) return objectIs;
  hasRequiredObjectIs = 1;
  var c = requireDefineProperties(), a = requireCallBind(), h = requireImplementation$1(), f = requirePolyfill$1(), p = requireShim$1(), r = a(f(), Object);
  return c(r, {
    getPolyfill: f,
    implementation: h,
    shim: p
  }), objectIs = r, objectIs;
}
var implementation, hasRequiredImplementation;
function requireImplementation() {
  return hasRequiredImplementation || (hasRequiredImplementation = 1, implementation = function(a) {
    return a !== a;
  }), implementation;
}
var polyfill, hasRequiredPolyfill;
function requirePolyfill() {
  if (hasRequiredPolyfill) return polyfill;
  hasRequiredPolyfill = 1;
  var c = requireImplementation();
  return polyfill = function() {
    return Number.isNaN && Number.isNaN(NaN) && !Number.isNaN("a") ? Number.isNaN : c;
  }, polyfill;
}
var shim, hasRequiredShim;
function requireShim() {
  if (hasRequiredShim) return shim;
  hasRequiredShim = 1;
  var c = requireDefineProperties(), a = requirePolyfill();
  return shim = function() {
    var f = a();
    return c(Number, { isNaN: f }, {
      isNaN: function() {
        return Number.isNaN !== f;
      }
    }), f;
  }, shim;
}
var isNan, hasRequiredIsNan;
function requireIsNan() {
  if (hasRequiredIsNan) return isNan;
  hasRequiredIsNan = 1;
  var c = requireCallBind(), a = requireDefineProperties(), h = requireImplementation(), f = requirePolyfill(), p = requireShim(), r = c(f(), Number);
  return a(r, {
    getPolyfill: f,
    implementation: h,
    shim: p
  }), isNan = r, isNan;
}
var comparisons, hasRequiredComparisons;
function requireComparisons() {
  if (hasRequiredComparisons) return comparisons;
  hasRequiredComparisons = 1;
  function c(oe, ce) {
    return r(oe) || p(oe, ce) || h(oe, ce) || a();
  }
  function a() {
    throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  function h(oe, ce) {
    if (oe) {
      if (typeof oe == "string") return f(oe, ce);
      var ge = Object.prototype.toString.call(oe).slice(8, -1);
      if (ge === "Object" && oe.constructor && (ge = oe.constructor.name), ge === "Map" || ge === "Set") return Array.from(oe);
      if (ge === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(ge)) return f(oe, ce);
    }
  }
  function f(oe, ce) {
    (ce == null || ce > oe.length) && (ce = oe.length);
    for (var ge = 0, we = new Array(ce); ge < ce; ge++) we[ge] = oe[ge];
    return we;
  }
  function p(oe, ce) {
    var ge = oe == null ? null : typeof Symbol < "u" && oe[Symbol.iterator] || oe["@@iterator"];
    if (ge != null) {
      var we, Se, Oe, j, I = [], C = !0, X = !1;
      try {
        if (Oe = (ge = ge.call(oe)).next, ce !== 0) for (; !(C = (we = Oe.call(ge)).done) && (I.push(we.value), I.length !== ce); C = !0) ;
      } catch (se) {
        X = !0, Se = se;
      } finally {
        try {
          if (!C && ge.return != null && (j = ge.return(), Object(j) !== j)) return;
        } finally {
          if (X) throw Se;
        }
      }
      return I;
    }
  }
  function r(oe) {
    if (Array.isArray(oe)) return oe;
  }
  function u(oe) {
    "@babel/helpers - typeof";
    return u = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(ce) {
      return typeof ce;
    } : function(ce) {
      return ce && typeof Symbol == "function" && ce.constructor === Symbol && ce !== Symbol.prototype ? "symbol" : typeof ce;
    }, u(oe);
  }
  var o = /a/g.flags !== void 0, t = function(ce) {
    var ge = [];
    return ce.forEach(function(we) {
      return ge.push(we);
    }), ge;
  }, n = function(ce) {
    var ge = [];
    return ce.forEach(function(we, Se) {
      return ge.push([Se, we]);
    }), ge;
  }, e = Object.is ? Object.is : requireObjectIs(), s = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
    return [];
  }, d = Number.isNaN ? Number.isNaN : requireIsNan();
  function v(oe) {
    return oe.call.bind(oe);
  }
  var y = v(Object.prototype.hasOwnProperty), m = v(Object.prototype.propertyIsEnumerable), B = v(Object.prototype.toString), E = requireUtil$1().types, S = E.isAnyArrayBuffer, O = E.isArrayBufferView, D = E.isDate, $ = E.isMap, V = E.isRegExp, J = E.isSet, ie = E.isNativeError, ne = E.isBoxedPrimitive, le = E.isNumberObject, Y = E.isStringObject, b = E.isBooleanObject, g = E.isBigIntObject, l = E.isSymbolObject, _ = E.isFloat32Array, A = E.isFloat64Array;
  function q(oe) {
    if (oe.length === 0 || oe.length > 10) return !0;
    for (var ce = 0; ce < oe.length; ce++) {
      var ge = oe.charCodeAt(ce);
      if (ge < 48 || ge > 57) return !0;
    }
    return oe.length === 10 && oe >= Math.pow(2, 32);
  }
  function P(oe) {
    return Object.keys(oe).filter(q).concat(s(oe).filter(Object.prototype.propertyIsEnumerable.bind(oe)));
  }
  function R(oe, ce) {
    if (oe === ce)
      return 0;
    for (var ge = oe.length, we = ce.length, Se = 0, Oe = Math.min(ge, we); Se < Oe; ++Se)
      if (oe[Se] !== ce[Se]) {
        ge = oe[Se], we = ce[Se];
        break;
      }
    return ge < we ? -1 : we < ge ? 1 : 0;
  }
  var w = !0, M = !1, x = 0, L = 1, K = 2, Q = 3;
  function U(oe, ce) {
    return o ? oe.source === ce.source && oe.flags === ce.flags : RegExp.prototype.toString.call(oe) === RegExp.prototype.toString.call(ce);
  }
  function N(oe, ce) {
    if (oe.byteLength !== ce.byteLength)
      return !1;
    for (var ge = 0; ge < oe.byteLength; ge++)
      if (oe[ge] !== ce[ge])
        return !1;
    return !0;
  }
  function F(oe, ce) {
    return oe.byteLength !== ce.byteLength ? !1 : R(new Uint8Array(oe.buffer, oe.byteOffset, oe.byteLength), new Uint8Array(ce.buffer, ce.byteOffset, ce.byteLength)) === 0;
  }
  function ee(oe, ce) {
    return oe.byteLength === ce.byteLength && R(new Uint8Array(oe), new Uint8Array(ce)) === 0;
  }
  function ae(oe, ce) {
    return le(oe) ? le(ce) && e(Number.prototype.valueOf.call(oe), Number.prototype.valueOf.call(ce)) : Y(oe) ? Y(ce) && String.prototype.valueOf.call(oe) === String.prototype.valueOf.call(ce) : b(oe) ? b(ce) && Boolean.prototype.valueOf.call(oe) === Boolean.prototype.valueOf.call(ce) : g(oe) ? g(ce) && BigInt.prototype.valueOf.call(oe) === BigInt.prototype.valueOf.call(ce) : l(ce) && Symbol.prototype.valueOf.call(oe) === Symbol.prototype.valueOf.call(ce);
  }
  function G(oe, ce, ge, we) {
    if (oe === ce)
      return oe !== 0 ? !0 : ge ? e(oe, ce) : !0;
    if (ge) {
      if (u(oe) !== "object")
        return typeof oe == "number" && d(oe) && d(ce);
      if (u(ce) !== "object" || oe === null || ce === null || Object.getPrototypeOf(oe) !== Object.getPrototypeOf(ce))
        return !1;
    } else {
      if (oe === null || u(oe) !== "object")
        return ce === null || u(ce) !== "object" ? oe == ce : !1;
      if (ce === null || u(ce) !== "object")
        return !1;
    }
    var Se = B(oe), Oe = B(ce);
    if (Se !== Oe)
      return !1;
    if (Array.isArray(oe)) {
      if (oe.length !== ce.length)
        return !1;
      var j = P(oe), I = P(ce);
      return j.length !== I.length ? !1 : fe(oe, ce, ge, we, L, j);
    }
    if (Se === "[object Object]" && (!$(oe) && $(ce) || !J(oe) && J(ce)))
      return !1;
    if (D(oe)) {
      if (!D(ce) || Date.prototype.getTime.call(oe) !== Date.prototype.getTime.call(ce))
        return !1;
    } else if (V(oe)) {
      if (!V(ce) || !U(oe, ce))
        return !1;
    } else if (ie(oe) || oe instanceof Error) {
      if (oe.message !== ce.message || oe.name !== ce.name)
        return !1;
    } else if (O(oe)) {
      if (!ge && (_(oe) || A(oe))) {
        if (!N(oe, ce))
          return !1;
      } else if (!F(oe, ce))
        return !1;
      var C = P(oe), X = P(ce);
      return C.length !== X.length ? !1 : fe(oe, ce, ge, we, x, C);
    } else {
      if (J(oe))
        return !J(ce) || oe.size !== ce.size ? !1 : fe(oe, ce, ge, we, K);
      if ($(oe))
        return !$(ce) || oe.size !== ce.size ? !1 : fe(oe, ce, ge, we, Q);
      if (S(oe)) {
        if (!ee(oe, ce))
          return !1;
      } else if (ne(oe) && !ae(oe, ce))
        return !1;
    }
    return fe(oe, ce, ge, we, x);
  }
  function z(oe, ce) {
    return ce.filter(function(ge) {
      return m(oe, ge);
    });
  }
  function fe(oe, ce, ge, we, Se, Oe) {
    if (arguments.length === 5) {
      Oe = Object.keys(oe);
      var j = Object.keys(ce);
      if (Oe.length !== j.length)
        return !1;
    }
    for (var I = 0; I < Oe.length; I++)
      if (!y(ce, Oe[I]))
        return !1;
    if (ge && arguments.length === 5) {
      var C = s(oe);
      if (C.length !== 0) {
        var X = 0;
        for (I = 0; I < C.length; I++) {
          var se = C[I];
          if (m(oe, se)) {
            if (!m(ce, se))
              return !1;
            Oe.push(se), X++;
          } else if (m(ce, se))
            return !1;
        }
        var de = s(ce);
        if (C.length !== de.length && z(ce, de).length !== X)
          return !1;
      } else {
        var ve = s(ce);
        if (ve.length !== 0 && z(ce, ve).length !== 0)
          return !1;
      }
    }
    if (Oe.length === 0 && (Se === x || Se === L && oe.length === 0 || oe.size === 0))
      return !0;
    if (we === void 0)
      we = {
        val1: /* @__PURE__ */ new Map(),
        val2: /* @__PURE__ */ new Map(),
        position: 0
      };
    else {
      var Ce = we.val1.get(oe);
      if (Ce !== void 0) {
        var Le = we.val2.get(ce);
        if (Le !== void 0)
          return Ce === Le;
      }
      we.position++;
    }
    we.val1.set(oe, we.position), we.val2.set(ce, we.position);
    var Ie = qe(oe, ce, ge, Oe, we, Se);
    return we.val1.delete(oe), we.val2.delete(ce), Ie;
  }
  function me(oe, ce, ge, we) {
    for (var Se = t(oe), Oe = 0; Oe < Se.length; Oe++) {
      var j = Se[Oe];
      if (G(ce, j, ge, we))
        return oe.delete(j), !0;
    }
    return !1;
  }
  function xe(oe) {
    switch (u(oe)) {
      case "undefined":
        return null;
      case "object":
        return;
      case "symbol":
        return !1;
      case "string":
        oe = +oe;
      // Loose equal entries exist only if the string is possible to convert to
      // a regular number and not NaN.
      // Fall through
      case "number":
        if (d(oe))
          return !1;
    }
    return !0;
  }
  function _e(oe, ce, ge) {
    var we = xe(ge);
    return we ?? (ce.has(we) && !oe.has(we));
  }
  function Be(oe, ce, ge, we, Se) {
    var Oe = xe(ge);
    if (Oe != null)
      return Oe;
    var j = ce.get(Oe);
    return j === void 0 && !ce.has(Oe) || !G(we, j, !1, Se) ? !1 : !oe.has(Oe) && G(we, j, !1, Se);
  }
  function Ae(oe, ce, ge, we) {
    for (var Se = null, Oe = t(oe), j = 0; j < Oe.length; j++) {
      var I = Oe[j];
      if (u(I) === "object" && I !== null)
        Se === null && (Se = /* @__PURE__ */ new Set()), Se.add(I);
      else if (!ce.has(I)) {
        if (ge || !_e(oe, ce, I))
          return !1;
        Se === null && (Se = /* @__PURE__ */ new Set()), Se.add(I);
      }
    }
    if (Se !== null) {
      for (var C = t(ce), X = 0; X < C.length; X++) {
        var se = C[X];
        if (u(se) === "object" && se !== null) {
          if (!me(Se, se, ge, we)) return !1;
        } else if (!ge && !oe.has(se) && !me(Se, se, ge, we))
          return !1;
      }
      return Se.size === 0;
    }
    return !0;
  }
  function be(oe, ce, ge, we, Se, Oe) {
    for (var j = t(oe), I = 0; I < j.length; I++) {
      var C = j[I];
      if (G(ge, C, Se, Oe) && G(we, ce.get(C), Se, Oe))
        return oe.delete(C), !0;
    }
    return !1;
  }
  function Fe(oe, ce, ge, we) {
    for (var Se = null, Oe = n(oe), j = 0; j < Oe.length; j++) {
      var I = c(Oe[j], 2), C = I[0], X = I[1];
      if (u(C) === "object" && C !== null)
        Se === null && (Se = /* @__PURE__ */ new Set()), Se.add(C);
      else {
        var se = ce.get(C);
        if (se === void 0 && !ce.has(C) || !G(X, se, ge, we)) {
          if (ge || !Be(oe, ce, C, X, we)) return !1;
          Se === null && (Se = /* @__PURE__ */ new Set()), Se.add(C);
        }
      }
    }
    if (Se !== null) {
      for (var de = n(ce), ve = 0; ve < de.length; ve++) {
        var Ce = c(de[ve], 2), Le = Ce[0], Ie = Ce[1];
        if (u(Le) === "object" && Le !== null) {
          if (!be(Se, oe, Le, Ie, ge, we)) return !1;
        } else if (!ge && (!oe.has(Le) || !G(oe.get(Le), Ie, !1, we)) && !be(Se, oe, Le, Ie, !1, we))
          return !1;
      }
      return Se.size === 0;
    }
    return !0;
  }
  function qe(oe, ce, ge, we, Se, Oe) {
    var j = 0;
    if (Oe === K) {
      if (!Ae(oe, ce, ge, Se))
        return !1;
    } else if (Oe === Q) {
      if (!Fe(oe, ce, ge, Se))
        return !1;
    } else if (Oe === L)
      for (; j < oe.length; j++)
        if (y(oe, j)) {
          if (!y(ce, j) || !G(oe[j], ce[j], ge, Se))
            return !1;
        } else {
          if (y(ce, j))
            return !1;
          for (var I = Object.keys(oe); j < I.length; j++) {
            var C = I[j];
            if (!y(ce, C) || !G(oe[C], ce[C], ge, Se))
              return !1;
          }
          return I.length === Object.keys(ce).length;
        }
    for (j = 0; j < we.length; j++) {
      var X = we[j];
      if (!G(oe[X], ce[X], ge, Se))
        return !1;
    }
    return !0;
  }
  function Me(oe, ce) {
    return G(oe, ce, M);
  }
  function Te(oe, ce) {
    return G(oe, ce, w);
  }
  return comparisons = {
    isDeepEqual: Me,
    isDeepStrictEqual: Te
  }, comparisons;
}
var hasRequiredAssert;
function requireAssert() {
  if (hasRequiredAssert) return assert.exports;
  hasRequiredAssert = 1;
  function c(K) {
    "@babel/helpers - typeof";
    return c = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(Q) {
      return typeof Q;
    } : function(Q) {
      return Q && typeof Symbol == "function" && Q.constructor === Symbol && Q !== Symbol.prototype ? "symbol" : typeof Q;
    }, c(K);
  }
  function a(K, Q, U) {
    return Object.defineProperty(K, "prototype", { writable: !1 }), K;
  }
  function h(K, Q) {
    if (!(K instanceof Q))
      throw new TypeError("Cannot call a class as a function");
  }
  var f = requireErrors(), p = f.codes, r = p.ERR_AMBIGUOUS_ARGUMENT, u = p.ERR_INVALID_ARG_TYPE, o = p.ERR_INVALID_ARG_VALUE, t = p.ERR_INVALID_RETURN_VALUE, n = p.ERR_MISSING_ARGS, e = requireAssertion_error(), s = requireUtil$1(), d = s.inspect, v = requireUtil$1().types, y = v.isPromise, m = v.isRegExp, B = requirePolyfill$2()(), E = requirePolyfill$1()(), S = requireCallBound()("RegExp.prototype.test"), O, D;
  function $() {
    var K = requireComparisons();
    O = K.isDeepEqual, D = K.isDeepStrictEqual;
  }
  var V = !1, J = assert.exports = b, ie = {};
  function ne(K) {
    throw K.message instanceof Error ? K.message : new e(K);
  }
  function le(K, Q, U, N, F) {
    var ee = arguments.length, ae;
    if (ee === 0)
      ae = "Failed";
    else if (ee === 1)
      U = K, K = void 0;
    else {
      if (V === !1) {
        V = !0;
        var G = process$1.emitWarning ? process$1.emitWarning : console.warn.bind(console);
        G("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094");
      }
      ee === 2 && (N = "!=");
    }
    if (U instanceof Error) throw U;
    var z = {
      actual: K,
      expected: Q,
      operator: N === void 0 ? "fail" : N,
      stackStartFn: F || le
    };
    U !== void 0 && (z.message = U);
    var fe = new e(z);
    throw ae && (fe.message = ae, fe.generatedMessage = !0), fe;
  }
  J.fail = le, J.AssertionError = e;
  function Y(K, Q, U, N) {
    if (!U) {
      var F = !1;
      if (Q === 0)
        F = !0, N = "No value argument passed to `assert.ok()`";
      else if (N instanceof Error)
        throw N;
      var ee = new e({
        actual: U,
        expected: !0,
        message: N,
        operator: "==",
        stackStartFn: K
      });
      throw ee.generatedMessage = F, ee;
    }
  }
  function b() {
    for (var K = arguments.length, Q = new Array(K), U = 0; U < K; U++)
      Q[U] = arguments[U];
    Y.apply(void 0, [b, Q.length].concat(Q));
  }
  J.ok = b, J.equal = function K(Q, U, N) {
    if (arguments.length < 2)
      throw new n("actual", "expected");
    Q != U && ne({
      actual: Q,
      expected: U,
      message: N,
      operator: "==",
      stackStartFn: K
    });
  }, J.notEqual = function K(Q, U, N) {
    if (arguments.length < 2)
      throw new n("actual", "expected");
    Q == U && ne({
      actual: Q,
      expected: U,
      message: N,
      operator: "!=",
      stackStartFn: K
    });
  }, J.deepEqual = function K(Q, U, N) {
    if (arguments.length < 2)
      throw new n("actual", "expected");
    O === void 0 && $(), O(Q, U) || ne({
      actual: Q,
      expected: U,
      message: N,
      operator: "deepEqual",
      stackStartFn: K
    });
  }, J.notDeepEqual = function K(Q, U, N) {
    if (arguments.length < 2)
      throw new n("actual", "expected");
    O === void 0 && $(), O(Q, U) && ne({
      actual: Q,
      expected: U,
      message: N,
      operator: "notDeepEqual",
      stackStartFn: K
    });
  }, J.deepStrictEqual = function K(Q, U, N) {
    if (arguments.length < 2)
      throw new n("actual", "expected");
    O === void 0 && $(), D(Q, U) || ne({
      actual: Q,
      expected: U,
      message: N,
      operator: "deepStrictEqual",
      stackStartFn: K
    });
  }, J.notDeepStrictEqual = g;
  function g(K, Q, U) {
    if (arguments.length < 2)
      throw new n("actual", "expected");
    O === void 0 && $(), D(K, Q) && ne({
      actual: K,
      expected: Q,
      message: U,
      operator: "notDeepStrictEqual",
      stackStartFn: g
    });
  }
  J.strictEqual = function K(Q, U, N) {
    if (arguments.length < 2)
      throw new n("actual", "expected");
    E(Q, U) || ne({
      actual: Q,
      expected: U,
      message: N,
      operator: "strictEqual",
      stackStartFn: K
    });
  }, J.notStrictEqual = function K(Q, U, N) {
    if (arguments.length < 2)
      throw new n("actual", "expected");
    E(Q, U) && ne({
      actual: Q,
      expected: U,
      message: N,
      operator: "notStrictEqual",
      stackStartFn: K
    });
  };
  var l = /* @__PURE__ */ a(function K(Q, U, N) {
    var F = this;
    h(this, K), U.forEach(function(ee) {
      ee in Q && (N !== void 0 && typeof N[ee] == "string" && m(Q[ee]) && S(Q[ee], N[ee]) ? F[ee] = N[ee] : F[ee] = Q[ee]);
    });
  });
  function _(K, Q, U, N, F, ee) {
    if (!(U in K) || !D(K[U], Q[U])) {
      if (!N) {
        var ae = new l(K, F), G = new l(Q, F, K), z = new e({
          actual: ae,
          expected: G,
          operator: "deepStrictEqual",
          stackStartFn: ee
        });
        throw z.actual = K, z.expected = Q, z.operator = ee.name, z;
      }
      ne({
        actual: K,
        expected: Q,
        message: N,
        operator: ee.name,
        stackStartFn: ee
      });
    }
  }
  function A(K, Q, U, N) {
    if (typeof Q != "function") {
      if (m(Q)) return S(Q, K);
      if (arguments.length === 2)
        throw new u("expected", ["Function", "RegExp"], Q);
      if (c(K) !== "object" || K === null) {
        var F = new e({
          actual: K,
          expected: Q,
          message: U,
          operator: "deepStrictEqual",
          stackStartFn: N
        });
        throw F.operator = N.name, F;
      }
      var ee = Object.keys(Q);
      if (Q instanceof Error)
        ee.push("name", "message");
      else if (ee.length === 0)
        throw new o("error", Q, "may not be an empty object");
      return O === void 0 && $(), ee.forEach(function(ae) {
        typeof K[ae] == "string" && m(Q[ae]) && S(Q[ae], K[ae]) || _(K, Q, ae, U, ee, N);
      }), !0;
    }
    return Q.prototype !== void 0 && K instanceof Q ? !0 : Error.isPrototypeOf(Q) ? !1 : Q.call({}, K) === !0;
  }
  function q(K) {
    if (typeof K != "function")
      throw new u("fn", "Function", K);
    try {
      K();
    } catch (Q) {
      return Q;
    }
    return ie;
  }
  function P(K) {
    return y(K) || K !== null && c(K) === "object" && typeof K.then == "function" && typeof K.catch == "function";
  }
  function R(K) {
    return Promise.resolve().then(function() {
      var Q;
      if (typeof K == "function") {
        if (Q = K(), !P(Q))
          throw new t("instance of Promise", "promiseFn", Q);
      } else if (P(K))
        Q = K;
      else
        throw new u("promiseFn", ["Function", "Promise"], K);
      return Promise.resolve().then(function() {
        return Q;
      }).then(function() {
        return ie;
      }).catch(function(U) {
        return U;
      });
    });
  }
  function w(K, Q, U, N) {
    if (typeof U == "string") {
      if (arguments.length === 4)
        throw new u("error", ["Object", "Error", "Function", "RegExp"], U);
      if (c(Q) === "object" && Q !== null) {
        if (Q.message === U)
          throw new r("error/message", 'The error message "'.concat(Q.message, '" is identical to the message.'));
      } else if (Q === U)
        throw new r("error/message", 'The error "'.concat(Q, '" is identical to the message.'));
      N = U, U = void 0;
    } else if (U != null && c(U) !== "object" && typeof U != "function")
      throw new u("error", ["Object", "Error", "Function", "RegExp"], U);
    if (Q === ie) {
      var F = "";
      U && U.name && (F += " (".concat(U.name, ")")), F += N ? ": ".concat(N) : ".";
      var ee = K.name === "rejects" ? "rejection" : "exception";
      ne({
        actual: void 0,
        expected: U,
        operator: K.name,
        message: "Missing expected ".concat(ee).concat(F),
        stackStartFn: K
      });
    }
    if (U && !A(Q, U, N, K))
      throw Q;
  }
  function M(K, Q, U, N) {
    if (Q !== ie) {
      if (typeof U == "string" && (N = U, U = void 0), !U || A(Q, U)) {
        var F = N ? ": ".concat(N) : ".", ee = K.name === "doesNotReject" ? "rejection" : "exception";
        ne({
          actual: Q,
          expected: U,
          operator: K.name,
          message: "Got unwanted ".concat(ee).concat(F, `
`) + 'Actual message: "'.concat(Q && Q.message, '"'),
          stackStartFn: K
        });
      }
      throw Q;
    }
  }
  J.throws = function K(Q) {
    for (var U = arguments.length, N = new Array(U > 1 ? U - 1 : 0), F = 1; F < U; F++)
      N[F - 1] = arguments[F];
    w.apply(void 0, [K, q(Q)].concat(N));
  }, J.rejects = function K(Q) {
    for (var U = arguments.length, N = new Array(U > 1 ? U - 1 : 0), F = 1; F < U; F++)
      N[F - 1] = arguments[F];
    return R(Q).then(function(ee) {
      return w.apply(void 0, [K, ee].concat(N));
    });
  }, J.doesNotThrow = function K(Q) {
    for (var U = arguments.length, N = new Array(U > 1 ? U - 1 : 0), F = 1; F < U; F++)
      N[F - 1] = arguments[F];
    M.apply(void 0, [K, q(Q)].concat(N));
  }, J.doesNotReject = function K(Q) {
    for (var U = arguments.length, N = new Array(U > 1 ? U - 1 : 0), F = 1; F < U; F++)
      N[F - 1] = arguments[F];
    return R(Q).then(function(ee) {
      return M.apply(void 0, [K, ee].concat(N));
    });
  }, J.ifError = function K(Q) {
    if (Q != null) {
      var U = "ifError got unwanted exception: ";
      c(Q) === "object" && typeof Q.message == "string" ? Q.message.length === 0 && Q.constructor ? U += Q.constructor.name : U += Q.message : U += d(Q);
      var N = new e({
        actual: Q,
        expected: null,
        operator: "ifError",
        message: U,
        stackStartFn: K
      }), F = Q.stack;
      if (typeof F == "string") {
        var ee = F.split(`
`);
        ee.shift();
        for (var ae = N.stack.split(`
`), G = 0; G < ee.length; G++) {
          var z = ae.indexOf(ee[G]);
          if (z !== -1) {
            ae = ae.slice(0, z);
            break;
          }
        }
        N.stack = "".concat(ae.join(`
`), `
`).concat(ee.join(`
`));
      }
      throw N;
    }
  };
  function x(K, Q, U, N, F) {
    if (!m(Q))
      throw new u("regexp", "RegExp", Q);
    var ee = F === "match";
    if (typeof K != "string" || S(Q, K) !== ee) {
      if (U instanceof Error)
        throw U;
      var ae = !U;
      U = U || (typeof K != "string" ? 'The "string" argument must be of type string. Received type ' + "".concat(c(K), " (").concat(d(K), ")") : (ee ? "The input did not match the regular expression " : "The input was expected to not match the regular expression ") + "".concat(d(Q), `. Input:

`).concat(d(K), `
`));
      var G = new e({
        actual: K,
        expected: Q,
        message: U,
        operator: F,
        stackStartFn: N
      });
      throw G.generatedMessage = ae, G;
    }
  }
  J.match = function K(Q, U, N) {
    x(Q, U, N, K, "match");
  }, J.doesNotMatch = function K(Q, U, N) {
    x(Q, U, N, K, "doesNotMatch");
  };
  function L() {
    for (var K = arguments.length, Q = new Array(K), U = 0; U < K; U++)
      Q[U] = arguments[U];
    Y.apply(void 0, [L, Q.length].concat(Q));
  }
  return J.strict = B(L, J, {
    equal: J.strictEqual,
    deepEqual: J.deepStrictEqual,
    notEqual: J.notStrictEqual,
    notDeepEqual: J.notDeepStrictEqual
  }), J.strict.strict = J.strict, assert.exports;
}
var safer_1, hasRequiredSafer;
function requireSafer() {
  if (hasRequiredSafer) return safer_1;
  hasRequiredSafer = 1;
  var c = requireDist(), a = c.Buffer, h = {}, f;
  for (f in c)
    c.hasOwnProperty(f) && (f === "SlowBuffer" || f === "Buffer" || (h[f] = c[f]));
  var p = h.Buffer = {};
  for (f in a)
    a.hasOwnProperty(f) && (f === "allocUnsafe" || f === "allocUnsafeSlow" || (p[f] = a[f]));
  if (h.Buffer.prototype = a.prototype, (!p.from || p.from === Uint8Array.from) && (p.from = function(r, u, o) {
    if (typeof r == "number")
      throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof r);
    if (r && typeof r.length > "u")
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
    return a(r, u, o);
  }), p.alloc || (p.alloc = function(r, u, o) {
    if (typeof r != "number")
      throw new TypeError('The "size" argument must be of type number. Received type ' + typeof r);
    if (r < 0 || r >= 2 * (1 << 30))
      throw new RangeError('The value "' + r + '" is invalid for option "size"');
    var t = a(r);
    return !u || u.length === 0 ? t.fill(0) : typeof o == "string" ? t.fill(u, o) : t.fill(u), t;
  }), !h.kStringMaxLength)
    try {
      h.kStringMaxLength = process$1.binding("buffer").kStringMaxLength;
    } catch {
    }
  return h.constants || (h.constants = {
    MAX_LENGTH: h.kMaxLength
  }, h.kStringMaxLength && (h.constants.MAX_STRING_LENGTH = h.kStringMaxLength)), safer_1 = h, safer_1;
}
var reader, hasRequiredReader;
function requireReader() {
  if (hasRequiredReader) return reader;
  hasRequiredReader = 1;
  var c = requireAssert(), a = requireSafer().Buffer, h = requireTypes(), f = requireErrors$1(), p = f.newInvalidAsn1Error;
  function r(u) {
    if (!u || !a.isBuffer(u))
      throw new TypeError("data must be a node Buffer");
    this._buf = u, this._size = u.length, this._len = 0, this._offset = 0;
  }
  return Object.defineProperty(r.prototype, "length", {
    enumerable: !0,
    get: function() {
      return this._len;
    }
  }), Object.defineProperty(r.prototype, "offset", {
    enumerable: !0,
    get: function() {
      return this._offset;
    }
  }), Object.defineProperty(r.prototype, "remain", {
    get: function() {
      return this._size - this._offset;
    }
  }), Object.defineProperty(r.prototype, "buffer", {
    get: function() {
      return this._buf.slice(this._offset);
    }
  }), r.prototype.readByte = function(u) {
    if (this._size - this._offset < 1)
      return null;
    var o = this._buf[this._offset] & 255;
    return u || (this._offset += 1), o;
  }, r.prototype.peek = function() {
    return this.readByte(!0);
  }, r.prototype.readLength = function(u) {
    if (u === void 0 && (u = this._offset), u >= this._size)
      return null;
    var o = this._buf[u++] & 255;
    if (o === null)
      return null;
    if ((o & 128) === 128) {
      if (o &= 127, o === 0)
        throw p("Indefinite length not supported");
      if (o > 4)
        throw p("encoding too long");
      if (this._size - u < o)
        return null;
      this._len = 0;
      for (var t = 0; t < o; t++)
        this._len = (this._len << 8) + (this._buf[u++] & 255);
    } else
      this._len = o;
    return u;
  }, r.prototype.readSequence = function(u) {
    var o = this.peek();
    if (o === null)
      return null;
    if (u !== void 0 && u !== o)
      throw p("Expected 0x" + u.toString(16) + ": got 0x" + o.toString(16));
    var t = this.readLength(this._offset + 1);
    return t === null ? null : (this._offset = t, o);
  }, r.prototype.readInt = function() {
    return this._readTag(h.Integer);
  }, r.prototype.readBoolean = function() {
    return this._readTag(h.Boolean) !== 0;
  }, r.prototype.readEnumeration = function() {
    return this._readTag(h.Enumeration);
  }, r.prototype.readString = function(u, o) {
    u || (u = h.OctetString);
    var t = this.peek();
    if (t === null)
      return null;
    if (t !== u)
      throw p("Expected 0x" + u.toString(16) + ": got 0x" + t.toString(16));
    var n = this.readLength(this._offset + 1);
    if (n === null || this.length > this._size - n)
      return null;
    if (this._offset = n, this.length === 0)
      return o ? a.alloc(0) : "";
    var e = this._buf.slice(this._offset, this._offset + this.length);
    return this._offset += this.length, o ? e : e.toString("utf8");
  }, r.prototype.readOID = function(u) {
    u || (u = h.OID);
    var o = this.readString(u, !0);
    if (o === null)
      return null;
    for (var t = [], n = 0, e = 0; e < o.length; e++) {
      var s = o[e] & 255;
      n <<= 7, n += s & 127, (s & 128) === 0 && (t.push(n), n = 0);
    }
    return n = t.shift(), t.unshift(n % 40), t.unshift(n / 40 >> 0), t.join(".");
  }, r.prototype._readTag = function(u) {
    c.ok(u !== void 0);
    var o = this.peek();
    if (o === null)
      return null;
    if (o !== u)
      throw p("Expected 0x" + u.toString(16) + ": got 0x" + o.toString(16));
    var t = this.readLength(this._offset + 1);
    if (t === null)
      return null;
    if (this.length > 4)
      throw p("Integer too long: " + this.length);
    if (this.length > this._size - t)
      return null;
    this._offset = t;
    for (var n = this._buf[this._offset], e = 0, s = 0; s < this.length; s++)
      e <<= 8, e |= this._buf[this._offset++] & 255;
    return (n & 128) === 128 && s !== 4 && (e -= 1 << s * 8), e >> 0;
  }, reader = r, reader;
}
var writer, hasRequiredWriter;
function requireWriter() {
  if (hasRequiredWriter) return writer;
  hasRequiredWriter = 1;
  var c = requireAssert(), a = requireSafer().Buffer, h = requireTypes(), f = requireErrors$1(), p = f.newInvalidAsn1Error, r = {
    size: 1024,
    growthFactor: 8
  };
  function u(t, n) {
    c.ok(t), c.equal(typeof t, "object"), c.ok(n), c.equal(typeof n, "object");
    var e = Object.getOwnPropertyNames(t);
    return e.forEach(function(s) {
      if (!n[s]) {
        var d = Object.getOwnPropertyDescriptor(t, s);
        Object.defineProperty(n, s, d);
      }
    }), n;
  }
  function o(t) {
    t = u(r, t || {}), this._buf = a.alloc(t.size || 1024), this._size = this._buf.length, this._offset = 0, this._options = t, this._seq = [];
  }
  return Object.defineProperty(o.prototype, "buffer", {
    get: function() {
      if (this._seq.length)
        throw p(this._seq.length + " unended sequence(s)");
      return this._buf.slice(0, this._offset);
    }
  }), o.prototype.writeByte = function(t) {
    if (typeof t != "number")
      throw new TypeError("argument must be a Number");
    this._ensure(1), this._buf[this._offset++] = t;
  }, o.prototype.writeInt = function(t, n) {
    if (typeof t != "number")
      throw new TypeError("argument must be a Number");
    typeof n != "number" && (n = h.Integer);
    for (var e = 4; ((t & 4286578688) === 0 || (t & 4286578688) === -8388608) && e > 1; )
      e--, t <<= 8;
    if (e > 4)
      throw p("BER ints cannot be > 0xffffffff");
    for (this._ensure(2 + e), this._buf[this._offset++] = n, this._buf[this._offset++] = e; e-- > 0; )
      this._buf[this._offset++] = (t & 4278190080) >>> 24, t <<= 8;
  }, o.prototype.writeNull = function() {
    this.writeByte(h.Null), this.writeByte(0);
  }, o.prototype.writeEnumeration = function(t, n) {
    if (typeof t != "number")
      throw new TypeError("argument must be a Number");
    return typeof n != "number" && (n = h.Enumeration), this.writeInt(t, n);
  }, o.prototype.writeBoolean = function(t, n) {
    if (typeof t != "boolean")
      throw new TypeError("argument must be a Boolean");
    typeof n != "number" && (n = h.Boolean), this._ensure(3), this._buf[this._offset++] = n, this._buf[this._offset++] = 1, this._buf[this._offset++] = t ? 255 : 0;
  }, o.prototype.writeString = function(t, n) {
    if (typeof t != "string")
      throw new TypeError("argument must be a string (was: " + typeof t + ")");
    typeof n != "number" && (n = h.OctetString);
    var e = a.byteLength(t);
    this.writeByte(n), this.writeLength(e), e && (this._ensure(e), this._buf.write(t, this._offset), this._offset += e);
  }, o.prototype.writeBuffer = function(t, n) {
    if (typeof n != "number")
      throw new TypeError("tag must be a number");
    if (!a.isBuffer(t))
      throw new TypeError("argument must be a buffer");
    this.writeByte(n), this.writeLength(t.length), this._ensure(t.length), t.copy(this._buf, this._offset, 0, t.length), this._offset += t.length;
  }, o.prototype.writeStringArray = function(t) {
    if (!t instanceof Array)
      throw new TypeError("argument must be an Array[String]");
    var n = this;
    t.forEach(function(e) {
      n.writeString(e);
    });
  }, o.prototype.writeOID = function(t, n) {
    if (typeof t != "string")
      throw new TypeError("argument must be a string");
    if (typeof n != "number" && (n = h.OID), !/^([0-9]+\.){3,}[0-9]+$/.test(t))
      throw new Error("argument is not a valid OID string");
    function e(y, m) {
      m < 128 ? y.push(m) : m < 16384 ? (y.push(m >>> 7 | 128), y.push(m & 127)) : m < 2097152 ? (y.push(m >>> 14 | 128), y.push((m >>> 7 | 128) & 255), y.push(m & 127)) : m < 268435456 ? (y.push(m >>> 21 | 128), y.push((m >>> 14 | 128) & 255), y.push((m >>> 7 | 128) & 255), y.push(m & 127)) : (y.push((m >>> 28 | 128) & 255), y.push((m >>> 21 | 128) & 255), y.push((m >>> 14 | 128) & 255), y.push((m >>> 7 | 128) & 255), y.push(m & 127));
    }
    var s = t.split("."), d = [];
    d.push(parseInt(s[0], 10) * 40 + parseInt(s[1], 10)), s.slice(2).forEach(function(y) {
      e(d, parseInt(y, 10));
    });
    var v = this;
    this._ensure(2 + d.length), this.writeByte(n), this.writeLength(d.length), d.forEach(function(y) {
      v.writeByte(y);
    });
  }, o.prototype.writeLength = function(t) {
    if (typeof t != "number")
      throw new TypeError("argument must be a Number");
    if (this._ensure(4), t <= 127)
      this._buf[this._offset++] = t;
    else if (t <= 255)
      this._buf[this._offset++] = 129, this._buf[this._offset++] = t;
    else if (t <= 65535)
      this._buf[this._offset++] = 130, this._buf[this._offset++] = t >> 8, this._buf[this._offset++] = t;
    else if (t <= 16777215)
      this._buf[this._offset++] = 131, this._buf[this._offset++] = t >> 16, this._buf[this._offset++] = t >> 8, this._buf[this._offset++] = t;
    else
      throw p("Length too long (> 4 bytes)");
  }, o.prototype.startSequence = function(t) {
    typeof t != "number" && (t = h.Sequence | h.Constructor), this.writeByte(t), this._seq.push(this._offset), this._ensure(3), this._offset += 3;
  }, o.prototype.endSequence = function() {
    var t = this._seq.pop(), n = t + 3, e = this._offset - n;
    if (e <= 127)
      this._shift(n, e, -2), this._buf[t] = e;
    else if (e <= 255)
      this._shift(n, e, -1), this._buf[t] = 129, this._buf[t + 1] = e;
    else if (e <= 65535)
      this._buf[t] = 130, this._buf[t + 1] = e >> 8, this._buf[t + 2] = e;
    else if (e <= 16777215)
      this._shift(n, e, 1), this._buf[t] = 131, this._buf[t + 1] = e >> 16, this._buf[t + 2] = e >> 8, this._buf[t + 3] = e;
    else
      throw p("Sequence too long");
  }, o.prototype._shift = function(t, n, e) {
    c.ok(t !== void 0), c.ok(n !== void 0), c.ok(e), this._buf.copy(this._buf, t + e, t, t + n), this._offset += e;
  }, o.prototype._ensure = function(t) {
    if (c.ok(t), this._size - this._offset < t) {
      var n = this._size * this._options.growthFactor;
      n - this._offset < t && (n += t);
      var e = a.alloc(n);
      this._buf.copy(e, 0, 0, this._offset), this._buf = e, this._size = n;
    }
  }, writer = o, writer;
}
var hasRequiredBer;
function requireBer() {
  return hasRequiredBer || (hasRequiredBer = 1, (function(c) {
    var a = requireErrors$1(), h = requireTypes(), f = requireReader(), p = requireWriter();
    c.exports = {
      Reader: f,
      Writer: p
    };
    for (var r in h)
      h.hasOwnProperty(r) && (c.exports[r] = h[r]);
    for (var u in a)
      a.hasOwnProperty(u) && (c.exports[u] = a[u]);
  })(ber)), ber.exports;
}
var lib, hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  var c = requireBer();
  return lib = {
    Ber: c,
    BerReader: c.Reader,
    BerWriter: c.Writer
  }, lib;
}
var formats = { exports: {} }, pkcs1 = { exports: {} }, hasRequiredPkcs1;
function requirePkcs1() {
  return hasRequiredPkcs1 || (hasRequiredPkcs1 = 1, (function(c) {
    var a = requireLib().Ber, h = requireUtils()._, f = requireUtils();
    const p = "-----BEGIN RSA PRIVATE KEY-----", r = "-----END RSA PRIVATE KEY-----", u = "-----BEGIN RSA PUBLIC KEY-----", o = "-----END RSA PUBLIC KEY-----";
    c.exports = {
      privateExport: function(t, n) {
        n = n || {};
        var e = t.n.toBuffer(), s = t.d.toBuffer(), d = t.p.toBuffer(), v = t.q.toBuffer(), y = t.dmp1.toBuffer(), m = t.dmq1.toBuffer(), B = t.coeff.toBuffer(), E = e.length + s.length + d.length + v.length + y.length + m.length + B.length + 512, S = new a.Writer({ size: E });
        return S.startSequence(), S.writeInt(0), S.writeBuffer(e, 2), S.writeInt(t.e), S.writeBuffer(s, 2), S.writeBuffer(d, 2), S.writeBuffer(v, 2), S.writeBuffer(y, 2), S.writeBuffer(m, 2), S.writeBuffer(B, 2), S.endSequence(), n.type === "der" ? S.buffer : p + `
` + f.linebrk(S.buffer.toString("base64"), 64) + `
` + r;
      },
      privateImport: function(t, n, e) {
        e = e || {};
        var s;
        if (e.type !== "der")
          if (Buffer.isBuffer(n) && (n = n.toString("utf8")), h.isString(n)) {
            var d = f.trimSurroundingText(n, p, r).replace(/\s+|\n\r|\n|\r$/gm, "");
            s = Buffer.from(d, "base64");
          } else
            throw Error("Unsupported key format");
        else if (Buffer.isBuffer(n))
          s = n;
        else
          throw Error("Unsupported key format");
        var v = new a.Reader(s);
        v.readSequence(), v.readString(2, !0), t.setPrivate(
          v.readString(2, !0),
          // modulus
          v.readString(2, !0),
          // publicExponent
          v.readString(2, !0),
          // privateExponent
          v.readString(2, !0),
          // prime1
          v.readString(2, !0),
          // prime2
          v.readString(2, !0),
          // exponent1 -- d mod (p1)
          v.readString(2, !0),
          // exponent2 -- d mod (q-1)
          v.readString(2, !0)
          // coefficient -- (inverse of q) mod p
        );
      },
      publicExport: function(t, n) {
        n = n || {};
        var e = t.n.toBuffer(), s = e.length + 512, d = new a.Writer({ size: s });
        return d.startSequence(), d.writeBuffer(e, 2), d.writeInt(t.e), d.endSequence(), n.type === "der" ? d.buffer : u + `
` + f.linebrk(d.buffer.toString("base64"), 64) + `
` + o;
      },
      publicImport: function(t, n, e) {
        e = e || {};
        var s;
        if (e.type !== "der") {
          if (Buffer.isBuffer(n) && (n = n.toString("utf8")), h.isString(n)) {
            var d = f.trimSurroundingText(n, u, o).replace(/\s+|\n\r|\n|\r$/gm, "");
            s = Buffer.from(d, "base64");
          }
        } else if (Buffer.isBuffer(n))
          s = n;
        else
          throw Error("Unsupported key format");
        var v = new a.Reader(s);
        v.readSequence(), t.setPublic(
          v.readString(2, !0),
          // modulus
          v.readString(2, !0)
          // publicExponent
        );
      },
      /**
       * Trying autodetect and import key
       * @param key
       * @param data
       */
      autoImport: function(t, n) {
        return /^[\S\s]*-----BEGIN RSA PRIVATE KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END RSA PRIVATE KEY-----[\S\s]*$/g.test(n) ? (c.exports.privateImport(t, n), !0) : /^[\S\s]*-----BEGIN RSA PUBLIC KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END RSA PUBLIC KEY-----[\S\s]*$/g.test(n) ? (c.exports.publicImport(t, n), !0) : !1;
      }
    };
  })(pkcs1)), pkcs1.exports;
}
var pkcs8 = { exports: {} }, hasRequiredPkcs8;
function requirePkcs8() {
  return hasRequiredPkcs8 || (hasRequiredPkcs8 = 1, (function(c) {
    var a = requireLib().Ber, h = requireUtils()._, f = "1.2.840.113549.1.1.1", p = requireUtils();
    const r = "-----BEGIN PRIVATE KEY-----", u = "-----END PRIVATE KEY-----", o = "-----BEGIN PUBLIC KEY-----", t = "-----END PUBLIC KEY-----";
    c.exports = {
      privateExport: function(n, e) {
        e = e || {};
        var s = n.n.toBuffer(), d = n.d.toBuffer(), v = n.p.toBuffer(), y = n.q.toBuffer(), m = n.dmp1.toBuffer(), B = n.dmq1.toBuffer(), E = n.coeff.toBuffer(), S = s.length + d.length + v.length + y.length + m.length + B.length + E.length + 512, O = new a.Writer({ size: S });
        O.startSequence(), O.writeInt(0), O.writeBuffer(s, 2), O.writeInt(n.e), O.writeBuffer(d, 2), O.writeBuffer(v, 2), O.writeBuffer(y, 2), O.writeBuffer(m, 2), O.writeBuffer(B, 2), O.writeBuffer(E, 2), O.endSequence();
        var D = new a.Writer({ size: S });
        return D.startSequence(), D.writeInt(0), D.startSequence(), D.writeOID(f), D.writeNull(), D.endSequence(), D.writeBuffer(O.buffer, 4), D.endSequence(), e.type === "der" ? D.buffer : r + `
` + p.linebrk(D.buffer.toString("base64"), 64) + `
` + u;
      },
      privateImport: function(n, e, s) {
        s = s || {};
        var d;
        if (s.type !== "der")
          if (Buffer.isBuffer(e) && (e = e.toString("utf8")), h.isString(e)) {
            var v = p.trimSurroundingText(e, r, u).replace("-----END PRIVATE KEY-----", "").replace(/\s+|\n\r|\n|\r$/gm, "");
            d = Buffer.from(v, "base64");
          } else
            throw Error("Unsupported key format");
        else if (Buffer.isBuffer(e))
          d = e;
        else
          throw Error("Unsupported key format");
        var y = new a.Reader(d);
        y.readSequence(), y.readInt(0);
        var m = new a.Reader(y.readString(48, !0));
        if (m.readOID(6, !0) !== f)
          throw Error("Invalid Public key format");
        var B = new a.Reader(y.readString(4, !0));
        B.readSequence(), B.readString(2, !0), n.setPrivate(
          B.readString(2, !0),
          // modulus
          B.readString(2, !0),
          // publicExponent
          B.readString(2, !0),
          // privateExponent
          B.readString(2, !0),
          // prime1
          B.readString(2, !0),
          // prime2
          B.readString(2, !0),
          // exponent1 -- d mod (p1)
          B.readString(2, !0),
          // exponent2 -- d mod (q-1)
          B.readString(2, !0)
          // coefficient -- (inverse of q) mod p
        );
      },
      publicExport: function(n, e) {
        e = e || {};
        var s = n.n.toBuffer(), d = s.length + 512, v = new a.Writer({ size: d });
        v.writeByte(0), v.startSequence(), v.writeBuffer(s, 2), v.writeInt(n.e), v.endSequence();
        var y = new a.Writer({ size: d });
        return y.startSequence(), y.startSequence(), y.writeOID(f), y.writeNull(), y.endSequence(), y.writeBuffer(v.buffer, 3), y.endSequence(), e.type === "der" ? y.buffer : o + `
` + p.linebrk(y.buffer.toString("base64"), 64) + `
` + t;
      },
      publicImport: function(n, e, s) {
        s = s || {};
        var d;
        if (s.type !== "der") {
          if (Buffer.isBuffer(e) && (e = e.toString("utf8")), h.isString(e)) {
            var v = p.trimSurroundingText(e, o, t).replace(/\s+|\n\r|\n|\r$/gm, "");
            d = Buffer.from(v, "base64");
          }
        } else if (Buffer.isBuffer(e))
          d = e;
        else
          throw Error("Unsupported key format");
        var y = new a.Reader(d);
        y.readSequence();
        var m = new a.Reader(y.readString(48, !0));
        if (m.readOID(6, !0) !== f)
          throw Error("Invalid Public key format");
        var B = new a.Reader(y.readString(3, !0));
        B.readByte(), B.readSequence(), n.setPublic(
          B.readString(2, !0),
          // modulus
          B.readString(2, !0)
          // publicExponent
        );
      },
      /**
       * Trying autodetect and import key
       * @param key
       * @param data
       */
      autoImport: function(n, e) {
        return /^[\S\s]*-----BEGIN PRIVATE KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END PRIVATE KEY-----[\S\s]*$/g.test(e) ? (c.exports.privateImport(n, e), !0) : /^[\S\s]*-----BEGIN PUBLIC KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END PUBLIC KEY-----[\S\s]*$/g.test(e) ? (c.exports.publicImport(n, e), !0) : !1;
      }
    };
  })(pkcs8)), pkcs8.exports;
}
var components = { exports: {} }, hasRequiredComponents;
function requireComponents() {
  return hasRequiredComponents || (hasRequiredComponents = 1, (function(c) {
    requireUtils()._, requireUtils(), c.exports = {
      privateExport: function(a, h) {
        return {
          n: a.n.toBuffer(),
          e: a.e,
          d: a.d.toBuffer(),
          p: a.p.toBuffer(),
          q: a.q.toBuffer(),
          dmp1: a.dmp1.toBuffer(),
          dmq1: a.dmq1.toBuffer(),
          coeff: a.coeff.toBuffer()
        };
      },
      privateImport: function(a, h, f) {
        if (h.n && h.e && h.d && h.p && h.q && h.dmp1 && h.dmq1 && h.coeff)
          a.setPrivate(
            h.n,
            h.e,
            h.d,
            h.p,
            h.q,
            h.dmp1,
            h.dmq1,
            h.coeff
          );
        else
          throw Error("Invalid key data");
      },
      publicExport: function(a, h) {
        return {
          n: a.n.toBuffer(),
          e: a.e
        };
      },
      publicImport: function(a, h, f) {
        if (h.n && h.e)
          a.setPublic(
            h.n,
            h.e
          );
        else
          throw Error("Invalid key data");
      },
      /**
       * Trying autodetect and import key
       * @param key
       * @param data
       */
      autoImport: function(a, h) {
        return h.n && h.e ? h.d && h.p && h.q && h.dmp1 && h.dmq1 && h.coeff ? (c.exports.privateImport(a, h), !0) : (c.exports.publicImport(a, h), !0) : !1;
      }
    };
  })(components)), components.exports;
}
var openssh = { exports: {} }, hasRequiredOpenssh;
function requireOpenssh() {
  return hasRequiredOpenssh || (hasRequiredOpenssh = 1, (function(c) {
    var a = requireUtils()._, h = requireUtils(), f = requireJsbn();
    const p = "-----BEGIN OPENSSH PRIVATE KEY-----", r = "-----END OPENSSH PRIVATE KEY-----";
    c.exports = {
      privateExport: function(t, n) {
        const e = t.n.toBuffer();
        let s = Buffer.alloc(4);
        for (s.writeUInt32BE(t.e, 0); s[0] === 0; ) s = s.slice(1);
        const d = t.d.toBuffer(), v = t.coeff.toBuffer(), y = t.p.toBuffer(), m = t.q.toBuffer();
        let B;
        typeof t.sshcomment < "u" ? B = Buffer.from(t.sshcomment) : B = Buffer.from([]);
        const E = 15 + s.byteLength + 4 + e.byteLength, S = 23 + e.byteLength + 4 + s.byteLength + 4 + d.byteLength + 4 + v.byteLength + 4 + y.byteLength + 4 + m.byteLength + 4 + B.byteLength;
        let O = 43 + // 32bit pubkey length
        E + 4 + //32bit private+checksum+comment+padding length
        S;
        const D = Math.ceil(S / 8) * 8 - S;
        O += D;
        const $ = Buffer.alloc(O), V = { buf: $, off: 0 };
        $.write("openssh-key-v1", "utf8"), $.writeUInt8(0, 14), V.off += 15, o(V, Buffer.from("none")), o(V, Buffer.from("none")), o(V, Buffer.from("")), V.off = V.buf.writeUInt32BE(1, V.off), V.off = V.buf.writeUInt32BE(E, V.off), o(V, Buffer.from("ssh-rsa")), o(V, s), o(V, e), V.off = V.buf.writeUInt32BE(
          O - 47 - E,
          V.off
        ), V.off += 8, o(V, Buffer.from("ssh-rsa")), o(V, e), o(V, s), o(V, d), o(V, v), o(V, y), o(V, m), o(V, B);
        let J = 1;
        for (; V.off < O; )
          V.off = V.buf.writeUInt8(J++, V.off);
        return n.type === "der" ? V.buf : p + `
` + h.linebrk($.toString("base64"), 70) + `
` + r + `
`;
      },
      privateImport: function(t, n, e) {
        e = e || {};
        var s;
        if (e.type !== "der")
          if (Buffer.isBuffer(n) && (n = n.toString("utf8")), a.isString(n)) {
            var d = h.trimSurroundingText(n, p, r).replace(/\s+|\n\r|\n|\r$/gm, "");
            s = Buffer.from(d, "base64");
          } else
            throw Error("Unsupported key format");
        else if (Buffer.isBuffer(n))
          s = n;
        else
          throw Error("Unsupported key format");
        const v = { buf: s, off: 0 };
        if (s.slice(0, 14).toString("ascii") !== "openssh-key-v1")
          throw "Invalid file format.";
        if (v.off += 15, u(v).toString("ascii") !== "none" || u(v).toString("ascii") !== "none" || u(v).toString("ascii") !== "" || (v.off += 4, v.off += 4, u(v).toString("ascii") !== "ssh-rsa") || (u(v), u(v), v.off += 12, u(v).toString("ascii") !== "ssh-rsa"))
          throw Error("Unsupported key type");
        const y = u(v), m = u(v), B = u(v), E = u(v), S = u(v), O = u(v), D = new f(B), $ = new f(O), V = new f(S), J = D.mod(V.subtract(f.ONE)), ie = D.mod($.subtract(f.ONE));
        t.setPrivate(
          y,
          // modulus
          m,
          // publicExponent
          B,
          // privateExponent
          S,
          // prime1
          O,
          // prime2
          J.toBuffer(),
          // exponent1 -- d mod (p1)
          ie.toBuffer(),
          // exponent2 -- d mod (q-1)
          E
          // coefficient -- (inverse of q) mod p
        ), t.sshcomment = u(v).toString("ascii");
      },
      publicExport: function(t, n) {
        let e = Buffer.alloc(4);
        for (e.writeUInt32BE(t.e, 0); e[0] === 0; ) e = e.slice(1);
        const s = t.n.toBuffer(), d = Buffer.alloc(
          e.byteLength + 4 + s.byteLength + 4 + 7 + 4
        ), v = { buf: d, off: 0 };
        o(v, Buffer.from("ssh-rsa")), o(v, e), o(v, s);
        let y = t.sshcomment || "";
        return n.type === "der" ? v.buf : "ssh-rsa " + d.toString("base64") + " " + y + `
`;
      },
      publicImport: function(t, n, e) {
        e = e || {};
        var s;
        if (e.type !== "der")
          if (Buffer.isBuffer(n) && (n = n.toString("utf8")), a.isString(n)) {
            if (n.substring(0, 8) !== "ssh-rsa ")
              throw Error("Unsupported key format");
            let B = n.indexOf(" ", 8);
            B === -1 ? B = n.length : t.sshcomment = n.substring(B + 1).replace(/\s+|\n\r|\n|\r$/gm, "");
            const E = n.substring(8, B).replace(/\s+|\n\r|\n|\r$/gm, "");
            s = Buffer.from(E, "base64");
          } else
            throw Error("Unsupported key format");
        else if (Buffer.isBuffer(n))
          s = n;
        else
          throw Error("Unsupported key format");
        const d = { buf: s, off: 0 }, v = u(d).toString("ascii");
        if (v !== "ssh-rsa")
          throw Error("Invalid key type: " + v);
        const y = u(d), m = u(d);
        t.setPublic(
          m,
          y
        );
      },
      /**
       * Trying autodetect and import key
       * @param key
       * @param data
       */
      autoImport: function(t, n) {
        return /^[\S\s]*-----BEGIN OPENSSH PRIVATE KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END OPENSSH PRIVATE KEY-----[\S\s]*$/g.test(n) ? (c.exports.privateImport(t, n), !0) : /^[\S\s]*ssh-rsa \s*(?=(([A-Za-z0-9+/=]+\s*)+))\1[\S\s]*$/g.test(n) ? (c.exports.publicImport(t, n), !0) : !1;
      }
    };
    function u(t) {
      const n = t.buf.readInt32BE(t.off);
      t.off += 4;
      const e = t.buf.slice(t.off, t.off + n);
      return t.off += n, e;
    }
    function o(t, n) {
      t.buf.writeInt32BE(n.byteLength, t.off), t.off += 4, t.off += n.copy(t.buf, t.off);
    }
  })(openssh)), openssh.exports;
}
var hasRequiredFormats;
function requireFormats() {
  return hasRequiredFormats || (hasRequiredFormats = 1, (function(c) {
    requireUtils()._;
    function a(h) {
      h = h.split("-");
      for (var f = "private", p = { type: "default" }, r = 1; r < h.length; r++)
        if (h[r])
          switch (h[r]) {
            case "public":
              f = h[r];
              break;
            case "private":
              f = h[r];
              break;
            case "pem":
              p.type = h[r];
              break;
            case "der":
              p.type = h[r];
              break;
          }
      return { scheme: h[0], keyType: f, keyOpt: p };
    }
    c.exports = {
      pkcs1: requirePkcs1(),
      pkcs8: requirePkcs8(),
      components: requireComponents(),
      openssh: requireOpenssh(),
      isPrivateExport: function(h) {
        return c.exports[h] && typeof c.exports[h].privateExport == "function";
      },
      isPrivateImport: function(h) {
        return c.exports[h] && typeof c.exports[h].privateImport == "function";
      },
      isPublicExport: function(h) {
        return c.exports[h] && typeof c.exports[h].publicExport == "function";
      },
      isPublicImport: function(h) {
        return c.exports[h] && typeof c.exports[h].publicImport == "function";
      },
      detectAndImport: function(h, f, p) {
        if (p === void 0) {
          for (var r in c.exports)
            if (typeof c.exports[r].autoImport == "function" && c.exports[r].autoImport(h, f))
              return !0;
        } else if (p) {
          var u = a(p);
          if (c.exports[u.scheme])
            u.keyType === "private" ? c.exports[u.scheme].privateImport(h, f, u.keyOpt) : c.exports[u.scheme].publicImport(h, f, u.keyOpt);
          else
            throw Error("Unsupported key format");
        }
        return !1;
      },
      detectAndExport: function(h, f) {
        if (f) {
          var p = a(f);
          if (c.exports[p.scheme])
            if (p.keyType === "private") {
              if (!h.isPrivate())
                throw Error("This is not private key");
              return c.exports[p.scheme].privateExport(h, p.keyOpt);
            } else {
              if (!h.isPublic())
                throw Error("This is not public key");
              return c.exports[p.scheme].publicExport(h, p.keyOpt);
            }
          else
            throw Error("Unsupported key format");
        }
      }
    };
  })(formats)), formats.exports;
}
var NodeRSA$1, hasRequiredNodeRSA;
function requireNodeRSA() {
  if (hasRequiredNodeRSA) return NodeRSA$1;
  hasRequiredNodeRSA = 1;
  var c = requireRsa();
  requireCryptoBrowserify(), requireLib().Ber;
  var a = requireUtils()._, h = requireUtils(), f = requireSchemes(), p = requireFormats();
  return NodeRSA$1 = (function() {
    var r = {
      node10: ["md4", "md5", "ripemd160", "sha1", "sha224", "sha256", "sha384", "sha512"],
      node: ["md4", "md5", "ripemd160", "sha1", "sha224", "sha256", "sha384", "sha512"],
      iojs: ["md4", "md5", "ripemd160", "sha1", "sha224", "sha256", "sha384", "sha512"],
      browser: ["md5", "ripemd160", "sha1", "sha256", "sha512"]
    }, u = "pkcs1_oaep", o = "pkcs1", t = "private", n = {
      private: "pkcs1-private-pem",
      "private-der": "pkcs1-private-der",
      public: "pkcs8-public-pem",
      "public-der": "pkcs8-public-der"
    };
    function e(s, d, v) {
      if (!(this instanceof e))
        return new e(s, d, v);
      a.isObject(d) && (v = d, d = void 0), this.$options = {
        signingScheme: o,
        signingSchemeOptions: {
          hash: "sha256",
          saltLength: null
        },
        encryptionScheme: u,
        encryptionSchemeOptions: {
          hash: "sha1",
          label: null
        },
        environment: h.detectEnvironment(),
        rsaUtils: this
      }, this.keyPair = new c.Key(), this.$cache = {}, Buffer.isBuffer(s) || a.isString(s) ? this.importKey(s, d) : a.isObject(s) && this.generateKeyPair(s.b, s.e), this.setOptions(v);
    }
    return e.prototype.setOptions = function(s) {
      if (s = s || {}, s.environment && (this.$options.environment = s.environment), s.signingScheme) {
        if (a.isString(s.signingScheme)) {
          var d = s.signingScheme.toLowerCase().split("-");
          d.length == 1 ? r.node.indexOf(d[0]) > -1 ? (this.$options.signingSchemeOptions = {
            hash: d[0]
          }, this.$options.signingScheme = o) : (this.$options.signingScheme = d[0], this.$options.signingSchemeOptions = {
            hash: null
          }) : (this.$options.signingSchemeOptions = {
            hash: d[1]
          }, this.$options.signingScheme = d[0]);
        } else a.isObject(s.signingScheme) && (this.$options.signingScheme = s.signingScheme.scheme || o, this.$options.signingSchemeOptions = a.omit(s.signingScheme, "scheme"));
        if (!f.isSignature(this.$options.signingScheme))
          throw Error("Unsupported signing scheme");
        if (this.$options.signingSchemeOptions.hash && r[this.$options.environment].indexOf(this.$options.signingSchemeOptions.hash) === -1)
          throw Error("Unsupported hashing algorithm for " + this.$options.environment + " environment");
      }
      if (s.encryptionScheme) {
        if (a.isString(s.encryptionScheme) ? (this.$options.encryptionScheme = s.encryptionScheme.toLowerCase(), this.$options.encryptionSchemeOptions = {}) : a.isObject(s.encryptionScheme) && (this.$options.encryptionScheme = s.encryptionScheme.scheme || u, this.$options.encryptionSchemeOptions = a.omit(s.encryptionScheme, "scheme")), !f.isEncryption(this.$options.encryptionScheme))
          throw Error("Unsupported encryption scheme");
        if (this.$options.encryptionSchemeOptions.hash && r[this.$options.environment].indexOf(this.$options.encryptionSchemeOptions.hash) === -1)
          throw Error("Unsupported hashing algorithm for " + this.$options.environment + " environment");
      }
      this.keyPair.setOptions(this.$options);
    }, e.prototype.generateKeyPair = function(s, d) {
      if (s = s || 2048, d = d || 65537, s % 8 !== 0)
        throw Error("Key size must be a multiple of 8.");
      return this.keyPair.generate(s, d.toString(16)), this.$cache = {}, this;
    }, e.prototype.importKey = function(s, d) {
      if (!s)
        throw Error("Empty key given");
      if (d && (d = n[d] || d), !p.detectAndImport(this.keyPair, s, d) && d === void 0)
        throw Error("Key format must be specified");
      return this.$cache = {}, this;
    }, e.prototype.exportKey = function(s) {
      return s = s || t, s = n[s] || s, this.$cache[s] || (this.$cache[s] = p.detectAndExport(this.keyPair, s)), this.$cache[s];
    }, e.prototype.isPrivate = function() {
      return this.keyPair.isPrivate();
    }, e.prototype.isPublic = function(s) {
      return this.keyPair.isPublic(s);
    }, e.prototype.isEmpty = function(s) {
      return !(this.keyPair.n || this.keyPair.e || this.keyPair.d);
    }, e.prototype.encrypt = function(s, d, v) {
      return this.$$encryptKey(!1, s, d, v);
    }, e.prototype.decrypt = function(s, d) {
      return this.$$decryptKey(!1, s, d);
    }, e.prototype.encryptPrivate = function(s, d, v) {
      return this.$$encryptKey(!0, s, d, v);
    }, e.prototype.decryptPublic = function(s, d) {
      return this.$$decryptKey(!0, s, d);
    }, e.prototype.$$encryptKey = function(s, d, v, y) {
      try {
        var m = this.keyPair.encrypt(this.$getDataForEncrypt(d, y), s);
        return v == "buffer" || !v ? m : m.toString(v);
      } catch (B) {
        throw Error("Error during encryption. Original error: " + B);
      }
    }, e.prototype.$$decryptKey = function(s, d, v) {
      try {
        d = a.isString(d) ? Buffer.from(d, "base64") : d;
        var y = this.keyPair.decrypt(d, s);
        if (y === null)
          throw Error("Key decrypt method returns null.");
        return this.$getDecryptedData(y, v);
      } catch (m) {
        throw Error("Error during decryption (probably incorrect key). Original error: " + m);
      }
    }, e.prototype.sign = function(s, d, v) {
      if (!this.isPrivate())
        throw Error("This is not private key");
      var y = this.keyPair.sign(this.$getDataForEncrypt(s, v));
      return d && d != "buffer" && (y = y.toString(d)), y;
    }, e.prototype.verify = function(s, d, v, y) {
      if (!this.isPublic())
        throw Error("This is not public key");
      return y = !y || y == "buffer" ? null : y, this.keyPair.verify(this.$getDataForEncrypt(s, v), d, y);
    }, e.prototype.getKeySize = function() {
      return this.keyPair.keySize;
    }, e.prototype.getMaxMessageSize = function() {
      return this.keyPair.maxMessageLength;
    }, e.prototype.$getDataForEncrypt = function(s, d) {
      if (a.isString(s) || a.isNumber(s))
        return Buffer.from("" + s, d || "utf8");
      if (Buffer.isBuffer(s))
        return s;
      if (a.isObject(s))
        return Buffer.from(JSON.stringify(s));
      throw Error("Unexpected data type");
    }, e.prototype.$getDecryptedData = function(s, d) {
      return d = d || "buffer", d == "buffer" ? s : d == "json" ? JSON.parse(s.toString()) : s.toString(d);
    }, e;
  })(), NodeRSA$1;
}
var NodeRSAExports = requireNodeRSA();
const NodeRSA = /* @__PURE__ */ getDefaultExportFromCjs$1(NodeRSAExports), debugKey = "NJHgNB1HDTrHTJc4ERFCBRVBB5HOBEDCjRLChRDIdn8K7EUJD,Vm4C6vC8BpZ6n6G,hxOjYZ{,wYhnJize2rlm9m,6bUcRVbP6sjNbKU8juOWUpukkcV6Cw,Bk2io7{YWJcPnG{1o3GUTpnO:z{kCYHL14HjO8noH1sp[J78k3Y3IcbOSSk97evccx0MdW2uR0f5qhZFQV8e2JCRxxJEBRBC";
function decryptWithDebugKey(c) {
  return decryptWithKey(c, decodeString(debugKey));
}
function decryptWithKey(c, a) {
  const { content: h, sign: f } = c, p = new NodeRSA(a, "pkcs8-public", {
    environment: "browser",
    signingScheme: "pkcs1-md5",
    encryptionScheme: "pkcs1"
  });
  if (!p.verify(h, f, "utf8", "base64"))
    throw new Error("u-space: license verify failed");
  const u = decryptInternal(h, p);
  return JSON.parse(u);
}
function decryptInternal(c, a) {
  const h = c.charCodeAt(0), f = c.substring(1, h), p = c.substring(h), r = parseHeader(f);
  let u = "";
  for (const o of r) {
    const t = p.substring(o.start, o.end);
    let n;
    o.encrypt ? n = a.decryptPublic(t, "utf8") : n = decodeString(t), u += n;
  }
  return u;
}
function parseHeader(c) {
  const a = decodeToBytes(c), f = new DataView(a.buffer).getInt16(0);
  if (f === 1)
    return parseHeaderV1(a.buffer);
  throw new Error(`u-space: content version error, version=${f}`);
}
function parseHeaderV1(c) {
  const a = new DataView(c);
  let h = 2;
  const f = a.getInt16(h);
  h += 2;
  const p = [];
  for (let r = 0; r < f; r++) {
    const u = a.getInt16(h);
    h += 2;
    const o = a.getInt16(h);
    h += 2;
    const t = a.getInt32(h);
    h += 4;
    const n = a.getInt32(h);
    h += 4;
    const e = {
      index: u,
      encrypt: o > 0,
      start: t,
      end: n
    };
    p.push(e);
  }
  return p.sort((r, u) => r.index <= u.index ? -1 : 1), p;
}
const _base64KeyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function decodeToBytes(c) {
  const a = [];
  let h, f, p, r, u, o, t, n = 0;
  for (c = c.replace(/[^A-Za-z0-9+/=]/g, ""); n < c.length; )
    r = _base64KeyStr.indexOf(c.charAt(n++)), u = _base64KeyStr.indexOf(c.charAt(n++)), o = _base64KeyStr.indexOf(c.charAt(n++)), t = _base64KeyStr.indexOf(c.charAt(n++)), h = r << 2 | u >> 4, f = (u & 15) << 4 | o >> 2, p = (o & 3) << 6 | t, a.push(h), o !== 64 && a.push(f), t !== 64 && a.push(p);
  return new Int8Array(a);
}
function decodeString(c) {
  let a = "";
  for (let h = 0; h < c.length; h++) {
    const p = c.charCodeAt(h) - 1;
    a += String.fromCharCode(p);
  }
  return a;
}
const logo = "data:image/webp;base64,UklGRswmAABXRUJQVlA4TMAmAAAvAIVnEA+imJEkqF4DtQTrz3QpKGjbhjHsQhiui4tMGGI1fJLp/2pgpmGafmQX+FcJCpbA5zH0qRRk4CBkwumBoU/XQR7YOg4Ctg2bWk7Mn3Pd/RAiYgLOrwIBqGKLe/j8QQ8k9LxcT5WABkhGMBpgnw8+SRIUpZ93E4h/br9UEHckCdBoBPs8hU9QViMEdtsrD6UAYqu2nufuZiZJxnecsVPL7pbjycwkYzu3E7sk1A+Z23Vsz4d3UTL5kiS2Ezjbz23buR+2Y4/tGW+rtmfNtm3bvsd1r/ZN+///7v5yvC3Lkhxb/ZYgc6gwi0H0gzQR/Z8Ab8+2121s29Zv6N095XZIr6T///9ZaLniGL2qPlHQCxH6IEgfJBAkSET0fwIou7ZVR5I+woqKfkRX5v9/aKcrOPeauB5h+cpXHlhmAEIgUET/J8C3a1t1bdu25W/q1/qEyv//Vu/j4ppTdqrt0Q+gJCHzYIEQFsIR/Z8AWs62120j72FOd7OIpAdPL4juf1uxpf8V2zndcQASP0KIQAUSAol/qIj+T4AkadujNpr2fYgQO8HIGHpadd//ZhJIgi/ZqUS39Tv1US5CJsoZIvo/Ab5d26pr27at8k213fqVXsf/f1a/OuI6hOsbD6AsIfNggRBWEo7o/wT89h99Pq6p+8OXvymldK/1hdHA4/vzu683+Zvq8O53tPR/l7/H/La3ngyG577Ob3jrycAYv/173RQZIrf9eJ9LDJbnd3qLK5lBM67l7W3aGDq37/zeNm0MoZf6xjZtDKS5vqtNG8Nprn7wn/+av1xpq3ktkX/9vX70/adF2RhU8+wB0//Uv91ood7L49/v8fGvQN1HiDdjHvu532T/V+SnPxUZWvdivsF0N3ZGKxeWTUT+CnAFzkA7W5JydfTwJzqGV3cz3kuwtxuTk3hQ5yDfNqG+Cx3YFa1I6r7+aN//2e19braojjZfZZCN1XTdOdxITufBHOguTCEuwMIkJHuIZ+Cfap7tDDNkVwz3zhRz9DszWJBC7UIRShaH0pHMhPYloGmmK4PtWc22BZtdmRhNHOjMBpwhTkRXCpLJGItg1FmKCzdkZ7XLOVxJTmdAfVdKBleiEi+KHkAWQ9MS0G2WxKAbJ5sVppizBzMYMIXagBRizyazAcnF6IsgzlFc2OG2WmwJNrtzMfqgrygjg53YkFdlR3IZYxHoHCuD717sdTnJncXp5J2h7kAdQsloUxTJYmhaBGGGGH4YZ3MVZpjDhRnkrUwF9hAnpTIJSB5GXyYzQ7CbjLUE2126GD2IW0LtGSxEVfKhZCTdGIvAfv4JQuRqq8t5uLQ4mbjOLEALsWd2UgqS09C0AOIMORDxY6rCDHN6MIW2GuqawZXYnKRoAJKH0RfAPQOD8W6oJdjuVmf0IG1nTmAJsWS4KBuSbmhl36g/q+GIu50up7l1Opm0oZQMdmKXLmVH0pDGvtt+vgYk7mYqTnUrD6ZQ1kJtQA0ySYuiSCqycy/ajNeQxFhstAT7Msc7owdhhzIqsBNzpouSgOTZ0Mq8a45LUGK20eU0104n07WFemVwEKfVlYykIY133ebMYYm7iYpTXatOpKszCWghlmyfSkRSkZ11o3ow7gZagt3N+ZnRQFUKtWfwIO43ywOJACQfRtSPa0/MZj6Mu30uZ3OvORtVF7MBW5Dh3WalIZmQ9nF52r/cWTnNj/FjnuIE96oTiapDWTPYid3evSk7koTMwBe8Kocv42qcJdhoAGdGA00t1AakINPbVWUgyYcR9fmYAs3mzTjZ5nI2BM3ZaCpKyeBODHv/FdELyY60pyMNpFSP5oppihMQJCeS9BLqDtRBZAcmJSNZkPnpWANN5tEYLbMEGw3iwWigaFVGBVqQwYGkRCS5GJGejCnQ07wad8Nczo1hcjaCUqg9g4U4zcUDUSgXMj0XaSAjeDaudinOgSE5O0GdScAWZHNiRwqUBTmeiznQ23ybm6yyBFsM5MFoJacOZc7gTAxzsw2hPKDkYUR6Js5Ai3k3RqtcTkaxO42cPdQNSEFmR77ijkxPRB3K5eHYGeVwDhSLs5NTlJLBywhsOpHjiZgD7ebjWE2Sgi0GszBaiWmhNqC+E6fxeRiRmG1ezXn5NGego/q5s1hkcjKOy2nErMrI4BRkY1RHJmUJt32SOpTN/Bw7ixxOwrE4Oy1bqLtQiG9jdEMOZYNG/Rw90NN8Has9UrDDgBZGKymdqcAZZOdURSIhCxT7p9hCPfxdtMfkdCTdSZSkUHsGV+PgVJ6RCckrFOkT1KJk83f8mONwEpLT6ZTszAKkIKP9/LjoXZyGNGWR+ie4Ai3V57lijBTsMKiDGZQMZc1gN9rPHkrxzuSJWJOSOxQbt4WazOdxN8bkdCyd0URHC/UE6iBG/dlJ0urktH38kt00oFWrRTnN73G2xeE0LKfT6ShKyeAUZDduPdgdihPbAx3B92VTpHArluwMMrZQm1CMY9nVARVrCXU338dqicnZDezMaKJiVkYFWpDRll1uUDTqUEr2f9kSh9PQNKcTkUK9MrgabenlAo0K7aFuPwFY7ZDCrWiqU4joTAKWIEddfBsUu7OE2vPPgGyHydkN7szoQUIdSs9gN7otvrxCIzGHMupPAVYzHM6GpzmZhCnUDahhXh5gg6IrU6hT/jmwWyGFG/Akp5BQlDWDu1HMA+QOxWKkoaz5JwFnI0xONMAHowcBZ6hNKMa0nOq1/vOHVFayhFrWj00erTPC4WyIJicTsColgy3Mupx6PN+HP3PFBCncgCg5Bd8S6i4cxrr977ps1ids82dcTTA50SAfjB7wuvJegS0+Yfw03B4tmuBwbky7c6OrofYMdhf0EHucDZDCPTAtTkS3MwkI6uQl9zoDTE4x0IXRAO5dmTN4L4467XgQFqcBDiejupwNWwt1E8biWEMfwS+8FF5TPuXipF4N90C1OBHboZQMNl0c4V9+QTTO674J1anXnGKwC6MB2RZqE4pU+/NjF+lU79XJuC5nQ9aV9wxe6liXTcB83eThpFwN94HrdCKwFOouvFwLkaCvQ1IApZPnq1xzvg34YDTgupgKBHXtjVdDGH81AOYsTVRudjqy7jRYdSg9g1nCAR8nC4tqNdwHstPZYbVQF6AOGYcpyrKq1pxh0AejFVVR1gw2FXIoWZRdtdnp2GangTpDPYUi5oBdklOzGm7D1pwd1KqUDCYVdNgFYVGsQRVbdbRCSqE24RR12AV5KDY7u4GfnQapK6MCQWUdohxXvWq4DV1zXojqUK4MdmlXnBhZrwZVdNVRRHuoCajD6/xX6En5UejulVDF2PSand3gH84D0JvSM7ip1ylKb8q70rdfQicFi1Y13A3f5HQ8LdRNKAKvnFJUrRoU8CXnG8+qrBlsKvDwkOKj1exEI/BgNKHZQm3CvliuXxqQheiUquFuFExOR9OVtyyeiyVvPzj9glCFyEo1KFCwON9gUjzOcf81FsuPbr8g4JQhKjU70UgsjCYs+wNRvcI1cxRuqwzUqYZ703A5Hct4LDb3KdyK4Rp00LA4BUqLh1qFHi4yVJVmpxiRhdEDSXko3aTex2w13EzF5WQgWzzUS+zNZjuhg4rTKUDmh1JM7MGJcNWoO8XIHIweMFI81Cb4stWGk+noToZxPZRRBV8y2ku4iY7TKSjqeCjdVlfdGUboYPQAscVDDZKvGm04nZJX5wZRHsppq6sz3ERJcyKGpA+1ra+6M4zS6miAcEIphqPuqzqM1eyVBz/e6UOZ73T5ZWA4nZT86mwIDoV6A9njK9558CfzADvDbbQ0JyLoWAKQ9Us6JV6HKi3V0eBeVagvk30fkw3nZcQezubehuUSfleLneE2aiYnundDKSb8LhbrUKUmORqca1A26XdabDgvI/dwmnN23W84lFFFwwVAhSI+lHkJd6Nncnb33nELtdvnav/u3sUjQIcMVZkOBXqSo5WAzhwfrDvS3WLDiUbwm9PwpVBPk36bDEWXl3A3ii5nx7czTfo9KCN07VCgaHG0wntThkm/iwynMsOJRnJxGroWapZ+M2XMupzh3jRdzo5uZYL024XodOnQQdPmKLgl1N2E30whr7q8O8WIHk7C1pkk/S5SVFXOcDNV3enQ6lCKCb9KKWdVOnRQdToD2hTqJvzKKYWDqsUpRvZg9IGsMFX47ZQyq7KEm+nqTgd2htrtw1Vv1n4t9KY8efVm20krxUyq/AUlur45A9jKTID2L+nFg98KPSm/F7pbt1e+VVpr+rbsoOl3OR+qvDnD6K6OJlgp1GiA8rSrxdjRyoOi9Ka8K71byTsbLXo3ds/kBBk0uYXbCcuz02FdTIPkrkZ+uKJg2ihnA00v6EFZcwqqOpRhkm9yFHRXpTjDKK+OTqBaqFnyrRslXTW5hdtJy6uTQRUmCL6OshZNLqjRdncKpi3U1cTeFClrhKYFqrQlRydInXlIvfKltFdNbuG+jPjDyYhSqMVkXrk6ijtpckGNurtTEO3MLfKG70Z5T2haoEpdcnQC9M5UeTd9IkXuNLmF+zLyi/PE00LtJulKfVwvG6WeNLmgJ32XE/GszCWbvjT0CU3foEDfzdGAZgk1mmiqtHTS5BZuNAYW54mmM209MmhyQU8OXE4EU0P9rquRDE0LFDiwORqw7Ey31ciqyS3caCwczhNLYcJq5ISmF3TzoDsRykuop61GkioFmnhwOlqRrExbjxRNbuEWY+JwGpAUajEfxUx/tkPTC8pc6M4LSGfu9cigSoEmLpyOVhh1MGE1skPTFG4xLlaowWihdluNDKrcocyGPDs7jMJcq5Edqh5Q4kNztILYQi22GhlUSeEO42OFGoiZaauRDqreoc6IPDs7hhTqd12LuKLLAT04cXcGhovpthb5QNUU7jBOJkcThMFMa5ETut6hzop8OB1BC/U0cFNReschc6oyB9R4cXcGgoNp6Hal+BQ5O3RNAVdeJEeTe1uow9CdUs4VZe7Qbsw8nO5eZ+61yAPKHlDjxuUM52o8yDGtJS5QNgVcuXFz9OHan49Cz5WEK9rcod3Y+eZk18pvNg9oe0BPflzOl2Mtfq/poG0KOPDj5ujh1vp7TYS6dygaQ9+d7FTQVc026HNAT450pzjVPwI/3ulDme90+QnwgLop4MCRF0cnh+r4CBSlN+Vd6f3/f1foe4eisXQ42aFN1zQ7FD6gJ0+68+VQkTkJtFgUSgFPPDkdPZxJKme2+J0FCt+hYjyt0ObMS9CUWjlkboLGB/QPU/LsRFeCChrRLhDbJmicAp648s3R4EgWNNd674hNULlBxbhaoacbdQiaUU8AW6HzDGW25NmJbjQVNIXBCq4VOteAL77cHQ1ORElTGeRorVD6GzSMrwl6unApN16+pNuXLWL4jpWboPUMdcbkw4kudHbktKmHsZmT+bLcRDKktgla14AfnLk7Wt8vKD/c1cgP1/PsjE5ANRPU/gYN42yC2vvdH7K0/WD/woIYDzj9vKD3DHXW5MPZ3698xvbwMSkzSShdCvSuASfeXI5WmbA+B1ndgALpCs2bVHlzg9rbdTi3YIjS5IKQe0D1V2g35r45+9vZdGE97DOxf4IL0Dw1ogCKE1SvATfuXI7WtyPxAEhPQXHWbIJnf0H3JlXu3KAmEvLsVTxBGi7B2R7QfoZ2Y++bs8uExhXDs2tKcmjyAO1rwL/4050hE/LQMp4ojU8LLtsH+jcp8OfF0SQTLi3ACdLiAEseYMAZ+m0MHk6XCQnrhiar2pACE/eABWvATw51Z8iEfFCjwnmXdp8Qub5gwiYFDr04mmRCoyZDo6TtBMdlgBFfoWgshrpMqANqhkZJ63XAIldYsQb85NHsDJmQOzMuQ6PEwikAkSvs2KSJR83RJBM2ZQ+GRomVU0IhV1hyhr6MxxXKn4eLmAOrA/lfLK9Ev+yHHsi2YusTBLnClDXgf5iUZ6d8Hur9T/An5Zed3Op8ue0fftnP3QuD2Kt6n9sHGLNJE5eao8fH4Yl3Lp/E5iH0up/1BXPOUDEuJygLoeVdbI+9rekmWPQdymzK350igrJYi/1V6mPb/oBNXwK++HR3dBJAT5W4WaaeFbsJZu3Qt/E5QVn6zLESd9/H3tTs6wDLDqgzKn93vmTPqMTxqgj9J3frAOOeASdO7Y4GKTLaF07bWnxYFeNsn9Laeyxfro8JFu7Qt3H6Bj2lyG5cWzxuivLMq9V7PCWbT6L/7+DdJaVPrTD0gDqr8pvz+33q3//B7dMn6R73DDjx6i9Hw9vcCrisgrpUebVAz7c5Ealr4XrXw9jMgAfFkT85A3oZs4sT+ZaU4l+eQvW4vzkDbtzqjga27SSd3uK6v+lS5dYJbWw71yED2o3dwzlXfWfAjV/d0brm61Lg1wm1Nd+AojEc2ld8Z8Abx2ZH63qvS4FjDWoSpB7XFm/idvDMu4p5sjgaPB78u19TqnWw0YC6cbxCL2ZNn4nxyvp1fPfDdHwKtP6otT/3eJO7T33Z5gx4YlmeHa1UnY7YZ2JtH8nsqXRtUiOdjFpfPvvr5vKpdunQP8bzb1CjKrvxzSXzISSXYnKoeprpaMf8Zb5ONhlOqUyrUKdqcuPFpt9+hJxj7UiZ6G4XkXT7+jLHS7iTcf27M4gq5kZjU/YlZFa4UD3R5Y7687K+bNGdZmy/O5poSm6MyqbgT8gwWFdk7Gckl4clBtOM7wnqJJ3mxt/GJusehYx2VYmOdxvZXAcr3AL9OozzhzMoGtWNUhlVh09hqCzazux3JC/VBn8huRrr745e9IzJnBiHMcqSV+E8WJPT/R5A/qwW+JPowZh/e2LKYW78MlZZ8yqksuSJGJDnqt85Pux8BuP/NJRSqcnVnBjJmGXNr1DZUCfCQJ6rdnbXbSdbiGlDjXgj6cHm/lNnsP//4pAdxatQWRCIBHlW5YJr7SfG/U7V5t//yNnsp9MgaJycWSvLKIGgau2JYJB5+H8KjdN+zt2fwfh+bPsJ7y4o5l1LT8SD7F6/FnxyUTCbWlGEhO4xLsDUxjCDQl5eowKMLQTCwu0YFeDQWCQw5FLGBFJTA7HhVkcEqBpK6JDXEYGlmZL4MJfRAKpGFoTYTKMBSxMlIeK2jgVQNZBAIj9jAcGsIkzcRwL4YJQDxb2MA5yMFqT4U0YBFpMdoeJPGQPgg0EEi7GMASiDhBZjGQF4MiBcjOX9L+i9A8b4/ke9AjHu73/vWifIuI8KJMz4efeLdwA8RgQy1LZpPICoMb5Gf7iM//Az/sNp/Kcpoz/cx394jP9sZfSHy/gP6/jPWUZ/mH6N+vAx3/94+jnn13+XbINwv//89WL+cynFt3tgf33zIt1xy8TrAa1rj/s5j2faiXTlO/5P8muoKc9/iXCR7f+7d13MP5XhyRejXfJgdm3aJ60aHHaI84iWHSg5aus2rvhvEFbR9v756x5z8SBgah50bdxh2fAdEiHrpyhqG/0EkuLm97UvETjDWLbYX8acYJX7g5e0eWIlrPC0zip4+OooioB17YmAOYyxWk1SbYXUOQ1c3u4nVsAqSWM6efncbsiNAyobTlLNCzM3cOHcdpHVsEHRal3elrScUDugWE0nqcWNaONO2hAQFQ2PBJUoz+vyQfmAytaThbyNwUXaJBRSx5roKVE7WJcLuo4nVvOZ1bmFOydaI2RSxR52StRO1uVBT8dT9gBr9w3kDRRYJ0SSwxI3q2k/W+r45MbhxMEDzMLEdAM/sZKQoNPwTE3u2tVy49N9PLVeYO3AAnezMqNwMidiotPuPr/B03k4ueIFZolKXGU5RuYk7DxcA5TmHn9ueJpHE2+eYBX6yGmRlpiRE7DraHXDxjBBPx1dT0dT4wtWmXMDF2lCNDANu4/WjRltwi4RnOo4mNj7glVEHXeSbspFmYb3ozUhvU7oX+AUj6bWGywhOxdJnXJSOlZ0sPobo4cJvoJTCyDIlnL+YAfROYGKqI6yY/VoZUPGz4QfOjbNACLsUOuty3Lx8If2CswNfOOcGA2Iw8bB6gNxt+lgiNiUAtvf1i4K1fqDBUALlzmOc0EMjwfrJyOO6WOL2PpbkAPQf51Em0fYBQzuxnwR92Rk7KNjdRtxTC9bhCY3Ah1Q7o08fHpEO+XuXMdMkGMk7DlWbhDG9LNFaGrBDsDNidN5hCW5yOkL5QZpIAaWDpUbL+CYnn4iND0BD2WRpvGJdorpBialk74jGpaPVBwGHNPXFqGpBDzgcLJw8AhLcoE7IZfIjTAN13F6f4x4T2/bgtZXyEOJstx9osklzm3kRFXC2O3c6z0QbRkx9Q9nho5MboQ8oBVl9wnrYpmzjVSU1gau3dJeqx2E+LwZcnR9wCc03WEPrSSNVwyxlw3kTSyx5wbCbn/tpZWtOkAr3PSiDqcPuUJTDntoBeHgE/YipY5Lm3hgbQNz976b3QjItr9NH/SApmv3brxTaF17R3UPWkEOrzjEvnBjEzescnm3sDHxQx91i9B62rvpNvk1ivbuJvlVSRcvcnRaJf7XWD34Ita5tgnRX7G0W2UidU9czDk/peScz1j9mPoNmdzYuTvP8iNG1kqbHNdZYU5schY3cOE69uw2mHDilzrS61+X5+68eUFTDHvoxXCW+XNqKBPTwvUNnLiKfXZbRGTRw7u2/3s6K23e0HSGPSQpOBjHbEVSFhtc3UDFFWrOvZt4SGKXtLRzap3VOjTNsIcoxdM8ZifoLnZxjlviR6jv9hDhUGVs33HkTpoXtp7C3lOKZCD7iZPEImcn9nhwQftuLw9Z4DL0XUfuoJmhqY6ghyxEZyG7MUFMN5Cx6MGA3G6Zhi+d015953GCAja5sPcUIptodO8Cl6ghDxtku4uGJuzT9c2Tw8wvbGpBD1GGxkSWvUtcoC4fLCIZO2koorZbBjOmdWyaQe8uA220vMtco5oXF5KwREOkhLWZLB0yEzilkFeEKCay6tvJWYSqFwMZ2F8sFEFrl9HhIK2D6yPgYZHhaaMI2eXUcZ1J8rIhDessREiS3XEzZgInN/bp23B0/nIP0N2jMiQBO1eZn/ywCEyjw0ZCEXPIdGO0Dk5tnw5HD14CNMtw+EQHPnGFiZ5cQMcqC5ExZLwhZkKn5/+VI0BoREg+kYHJ2UkMeRqAHRskLCGHzDdEg6cS7rI/3ZAT0MIdxOWLAQFbJDREEsBImANeX8Eu+ZNjlBtZuUQ0b7Kc0U0cjE6oQjgcQfDkxqcXMStycYHo3iSxjD0kTAFDh2CrA2aEpzvUPb3pgnQkcgYkeRvE7thLggO0tYG8CBc+5U8uDTIRbVyUy/6Y2MAyB0vAWzBPQHNA16eWIaa7sYG7yzmPslTBxMEJeIRz1O3m7UBPn1ka5A4lrooNeZyEptEnCXW71oFYAVQH5MbnlSLoCWWuiE2fgtCBJQ6Wtv8S1Hu75oHip5XUIVVpzk6p5pOdMjt2c/DTdkVY13YzeqAzwCUvKl3QiTnukOpeHTIB6xzE7QYYa9slS5Gj+RllnKJWxXduF0ryepcxOmwcaPMitGu7YGlUTk/BLXvPyF3UNrmDC0LZLyeSsYuDst2AY22z2Q1Z6hj1Edoav0nPLXC27SdnQs4vOyUubHCQdivCO7lsySZHLrDNFPHQKfExiu1exMJlkWmeHxIDWxyE3RIgDVgyZSdHLazdZXjqBLcvROXuIp1q2C5RqCIObPeFqGOnLYsczaDWhoPvhrxzQ2RQ1VEqMI1+OIhY2BC/YM3YqBylkOZkgA88xoxcEflK9Z2yc92BvRwc2AtJBzW7LUud01c4uzMUNKM2zKZANvr8hB3rdixykLCFqWPZmE2O3AhmWYboAc2wgTsEdsrdFKvrAiYOBlWEeWKvNTs5aqFspozZfo9xE7cLOCrdNFBlndEnCYGqoNRRyZxFjp5A1grRWa9PA2curHs1OqpelM01GUskGD1QVeq091Y5KkGsp5A347n0QnO2rlNNVSPW11zYnxxFVNc3z1Ln9BTCshRP253D2I7LqwZVVVUbVdcMrHOQMaHO1ARgkyM3wtdBKYvlXHnRdy6tMrq/GVRZU6iwURRg6XfATo7u4FWcFBvs9j6Nf3BjzYGdbzplc9k0+uLoPHIWOcqha6GU2Ww9D/Nwcm3NTrnb24n1ZQc2SLhTCVegMoRRObrCVqKYyWyK0wctmM0VhUoPtFB12Y4tEtJfGUud01PIulPOw25SzYNXub5sGh0f7VRZFqiiXyA2OaojXPUUtFhO6nnQOrcvu6imjz9RFhcZ/ZD04qrfB2scxWDVO0EibCe9T1jk3LJB1Scndi3J2EtSxpW+E+Y4OgPV3VHQznxSTCj9itkyo/sTDdRYcmHxF8noHM0gdaOohwdID2pwH5d8ws5niWpLKiaSEq76vbAE6ik8lYWyFi9QHKDEpSU75W7PM2VxQaHOH5/w3bDJUR+h6XCUNcIPVBMnc2NJodIC/Updz06j068Taxy5sDQvlPbmC+rfMMq1BdHouGRQ49mBZRo6deFyVERijqMWkOaW8vbeIE1MwCw+u6imSy+qPUvYbzRk6sRltKCMztEMRcdCgRt4hCZl5/qzQNVFr5TFJ4EKG0sF1vldsQRSCkDlaBuK3HlFT5CDq09ejO6LtFDXE6MvHiI1YWWqgbEJ6l8CzvysR2ojxe69Qn0xXjj35MDOZZUKjyI2eFAso0rUicYaR258VP4zwi/kGFowOx9Vyt2WH5Q9umOLiEa9qMb3xhxH7ai4+YZORuU+PipUWnFi+UGliogIVEVVqIRndI6eg6J4hwqic+lBNDqvUEelB4WqTFSqgZpGv3gsgXQdEgv8ow5C5MKDi2q6dqfCm9Pol4lEzYjpwjIgm6CejohDtbTBGGPnKRO0Ye1BoMaqTNmbA4tMZOzCFLCOyBpHbhwPDVSTWp5WWX0QBqZkZsPovkqxrKqJamJiYnWXlrYugmSOo/t4uJnoz+nsIGVC4qaZTWyuG1RS1UCdVGjbSmmPns0eUKNzlI8GV8xkNvI7pw9A5pqZNcrd1l9UUFWjExdjs7ZHdbMXlCWQ5sGQYCizcWOUAcpVM+vULhApOzVimYtrsz72p2jzjMomqKdjodjKLGMqIWAalkRnAW3UoRcmLuJmyvsTtxMsaxzVcSS0sJY9FF2Anbssb9VUslK7ViqQoX2z/rY3SZs/wMxxFI+E2V7WKA1wcNncVkOkU+5WqIuNezPlvYnbvchG5+g8DjoYbHRIB5xcHNq6i7xSNo2+2Zjb9bEvRdsvZJZASE/misVsQlS204JpbjZF1FEVW2ys7XTui9uubNBsHi8JJrN3SAZUzm2lN9mdwovYMLed0p482v4CZ+1oaYrRTkgEdG7zXejwrPLxANyOrA6I6MwdLHcY7TtEgOldFlLPXj4WQHk/orYvgjf6oZJhNaOk7bR51lQ6+BX5sBugshdZwBefpUOlt1uFTMDwbIglr5oImYQ+9qGIuByweaB0sFuEZMDlWReLXp2MWAfIjT1InfDIA2uHSVMCQPbsVUybT4mSTFDbgeFEzD6YO0qeCADql7vJD58yJQuh5t1wIpbNidGPkQ6Wc/sRvNqB7pMosYZQ82w4IYcXlg6RpphO+5G8ysCrR4GUxVDzajghy+aGzSOkh+XSjhw+NSWLPxcp1hi6hz/JiTkcsXZ8JJjuJ8pFOH0ayO7PzcqCyC1fShezyBNzR0eG7RylENR51JHDn8WKNYj65UcWdfgy+rHhiu2WqAlRPZrI6U0RLesdIp2Dt6KoRb5YOjZ62K5hDNn9cTfW+VJ5sYxRLbSnC5u9sXlk3GG7ImplTH92KPkyiBkVI92LVJy4z+aOteOihe3eOiYytHuToexLJMa+g6S2KCsK3JZD5o6KBbYbTtgMuX1pSjc/mpixmyS1RShR6CSPVj8mYrFdquJekMeXgQ0/Hm5WR0lxjm3WU8UOm0tWDommwHIji7wgxZeOXX4kbmzCpH7P8V+tJ4reolP2HBCuh+FWfhe5GtWXiU0/Mjl20/7s2lP+xSj5rvLwlVfWDgfXw2zlcYKfmOhHUb54IXZG9eCvY4xnzi1GJ1+fza/hDoathzkyeOWco5OHFyb7sW+g+nDSY8kb/0t3zNb7oeB62AP4u2EvPy7A9OHiR69XUZ4pm0shyfXwqcYZfhhw+HATpOrTkG96rd0C0tbDqxLHnA83wZwHnSEFj+rmnaqxZzhqeniVe4GbDz8hTl4RRT3482z+9WALwSgW+NUkTR8WovAqR4ofb0I/AFrNVg5ES4FfVSMvD6oxeYMkxeZL6NsRULZ1C0MtNPZtoqzzTsiNiywpNk/Cb9sx0GuqD0J3+FY09s37DnloTTQpNj9C346CqiXE8ON6eFeCPTyDJtpDlOLHi9C349CDpVvwyQXelQ2ecDfFOiwxpdh8CH07EFrNUHGBJ0Ftx9wLj3swDZap0goePH07FMqG0Aad5gn/el+8SFuYCRNX+u3EV/Xdv336MjS7gNMWeFgyfoZVwy7WyZZU0Q0dD1U7SMGmOaC6W9M8LLCTYw6V+NL4ICtRiJq534Kd0gSarsDHpvk4YBfoREXCFAOup2+QTnP6vZnBEWTiE9o7Nc1Px3qBL1IRY+oXqi+Z3EKyp2wHbXhxN+jv0vs38/RE3aQ30uBMuhuiEDdUEYBeOyWGlq7Ay1x6+TpRD8kip4g19QtOS7K6gSKI1Qx6F1TaGSZ06Hwzb7+gFipzbt6kHLA8a8M1MPRgBn1AaWcY0Z1azOcKqoZOmEfMSe8HR8kyzBWBXM0M7qFkn2FGZ3p+M69v0MmyDimdPPXUMJQh01xGoWwHqwsgWzvDkL60ZZ4/oO+wm/GJYk/6LTV7Zcg4dgnnawe9Cx3NrcCUjry3Zd4nkMEnokX9AEg9NVtlyDx1Cmm1gzkGjeWANd1wc7z2kHPTFqFF/QxIGsHOkzeAUOhQerCD0gWLeCuwpw/lSraTEfPQrHJn18+BFK9moby/CyJTBXY1O8CzCRHxNsOkDjxfSzgzZuEa1br8PiaS7tq+V72iUBLtFtxsCUguMCy3GVZ9oYX6xg3rN0o1/MWUdOrPg6SYwne5n/UCKvdJXYBfUyjJBYOcnrDs+kA6zyvdUYh/YtTEsyRX6qHf9yMjqed0tn3q/RTbWakxujCnZgnAffG/ZklPmHd9JZwj/1PYUyYO8zEn0ZxP/e6PtH/27F9XTtcZ/1WPMT9l2A7PtP7KUb/h/U27ZwQo6+J8Lea0PvGLffn7ZIFxriktB5jblNJaK97wAQ==";
class Watermarker extends Scene {
  viewer;
  camera;
  mesh;
  overlayPass;
  constructor(a) {
    super(), this.viewer = a, this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1), this.camera.position.z = 0.5, this.mesh = new Mesh(
      new PlaneGeometry(1.8, 1.8),
      new MeshBasicNodeMaterial({
        color: 16777215,
        opacity: 0.5,
        transparent: !0
      })
    ), this.add(this.mesh), this.overlayPass = pass(this, this.camera);
  }
  enable() {
    this.mesh.material.map || (this.mesh.material.map = TextureLoaderManager.textureLoader.load(logo)), this.viewer.renderPipeline.addOverlayPass(this.overlayPass);
  }
  disable() {
    this.viewer.renderPipeline.removeOverlayPass(this.overlayPass);
  }
  dispose() {
    this.overlayPass.dispose(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.mesh.material.map?.dispose();
  }
}
const _m4 = new Matrix4();
class SceneParser {
  viewer;
  path;
  manager;
  constructor(a, h, f) {
    this.viewer = a, this.path = h, this.manager = f;
  }
  /**
   *
   * @param treeData
   * @param cachedIds mutated to add loaded ids
   * @param _options
   * @returns
   */
  async parseAsync(a, h, f) {
    const p = new Group(), r = async (u, o = null) => {
      const t = await this.parseTreeNode(u);
      if (t) {
        const { id: n, sid: e } = u;
        this.viewer.objectManager.add(n, t), this.viewer.objectManager.add(e, t), h.add(n), h.add(e), o ? o.add(t) : p.add(t);
      }
      await Promise.all(u.children.map((n) => r(n, t)));
    };
    return await Promise.all(a.map((u) => r(u, p))), p;
  }
  async parseTreeNode(a) {
    const { name: h, renderType: f, path: p, visible: r, matrix: u, shape: o, extra: t } = a;
    let n = null;
    if (f === "3D" && p) {
      const e = this.path + p, s = new Model();
      this.manager.itemStart(e), await s.loadAsync({
        url: e
      }), this.manager.itemEnd(e), n = s;
    } else if (f === "GROUP" || f === "STUB")
      n = new Group();
    else if (f === "POLYGON" && o?.points) {
      const e = ShapeMesh.createFromPoints(o.points);
      e.material.color.set("blue"), e.material.transparent = !0, e.material.opacity = 0.5, n = e;
    } else if (f === "CIRCLE" && o?.radius) {
      const e = new CircleMesh({
        geometryParameters: {
          radius: o.radius
        }
      });
      e.material.color.set("blue"), e.material.transparent = !0, e.material.opacity = 0.5, n = e;
    } else if (f === "AREA" || f === "FLOOR" || f === "ROOM") {
      const e = ExtrudeMesh.createFromPoints(o?.points, {
        geometryParameters: { options: { depth: o?.depth, bevelEnabled: !1 } }
      });
      e.material.color.set(t?.color ?? "blue"), e.material.transparent = !0, e.material.opacity = t?.opacity ?? 0.5, n = e;
    }
    if (n) {
      n.name = h, n.visible = r, _m4.fromArray(u).decompose(n.position, n.quaternion, n.scale);
      const s = { ...a };
      Reflect.deleteProperty(s, "children"), Object.assign(n.userData, s);
    }
    return n;
  }
}
class SceneLoader extends Loader {
  viewer;
  key = "";
  cachedIds = /* @__PURE__ */ new Set();
  #r = null;
  #e = [];
  #t;
  constructor(a) {
    super(), this.viewer = a, this.#t = new Watermarker(a), this.manager = new LoadingManager();
  }
  setKey(a) {
    return this.key = a, this;
  }
  async loadAsync(a = {}) {
    if (!this.path)
      throw new Error("u-space SceneLoader: path is not set");
    this.manager.itemStart(this.path);
    const h = () => {
      this.manager.itemError(this.path), this.manager.itemEnd(this.path);
    }, f = new BaseFileLoader(this), p = await f.loadAsync(META_DATA_FILE_PATH);
    if (p.version < 1.5)
      throw h(), new Error("u-space SceneLoader: Only support version 1.5 and above");
    if (!this.key && p.authority === "OFFICIAL")
      throw h(), new Error("u-space SceneLoader: options.key is required when authority is OFFICIAL");
    this.key && p.authority === "TRIAL" && console.warn("u-space SceneLoader: options.key is not used when authority is TRIAL");
    const r = await f.loadAsync(p.resource), u = this.#r !== r;
    if (this.#r = r, u)
      if (p.encryptWith === "DEBUG")
        try {
          this.#e = decryptWithDebugKey(r);
        } catch {
          throw h(), new Error("u-space SceneLoader: decrypt with debug key failed");
        }
      else if (p.encryptWith === "SCENE" || p.encryptWith === "COMPANY")
        try {
          this.#e = decryptWithKey(r, this.key);
        } catch {
          throw h(), new Error("u-space SceneLoader: decrypt with authorized key failed");
        }
      else p.encryptWith || (this.#e = r);
    const t = await new SceneParser(this.viewer, this.path, this.manager).parseAsync(this.#e, this.cachedIds, a);
    return this.manager.itemEnd(this.path), t;
  }
  clearCache() {
    this.cachedIds.forEach((a) => {
      this.viewer.objectManager.removeById(a);
    }), this.cachedIds.clear();
  }
  dispose() {
    this.clearCache(), this.#t.dispose();
  }
}
class AnimationsLoader extends Loader {
  constructor() {
    super(), this.manager = new LoadingManager();
  }
  async loadAsync() {
    return await new BaseFileLoader(this).loadAsync(ANIMATIONS_DATA_FILE_PATH);
  }
}
class AnimationsParser extends EventDispatcher {
  viewer;
  target;
  tweenSet;
  _initialTransformSymbol = /* @__PURE__ */ Symbol("initialTransform");
  constructor(a, h) {
    super(), this.viewer = a, this.target = h, this.tweenSet = /* @__PURE__ */ new Set();
  }
  initTransform(a) {
    const { position: h, rotation: f, scale: p } = this.target, r = a ?? {
      x: h.x,
      y: h.y,
      z: h.z,
      rotationX: f.x,
      rotationY: f.y,
      rotationZ: f.z,
      scaleX: p.x,
      scaleY: p.y,
      scaleZ: p.z
    };
    return Reflect.set(this.target, this._initialTransformSymbol, r), r;
  }
  getInitialTransform() {
    return Reflect.get(this.target, this._initialTransformSymbol);
  }
  async play(a) {
    let h = this.getInitialTransform();
    h || (h = this.initTransform());
    for (let f = 0; f < a.length; f++) {
      let p = a[f - 1];
      p || (p = h);
      const r = a[f], u = r.delay ?? 0, o = r.duration ?? 1e3, t = r.easing, n = r.repeat === -1 ? 1 / 0 : r.repeat ?? 0, e = r.yoyo ?? !1;
      await tweenAnimation(
        this.viewer,
        {
          ...p
        },
        {
          ...r
        },
        { delay: u, duration: o, mode: t, repeat: n, yoyo: e },
        (s, d) => {
          const { x: v, y, z: m, rotationX: B, rotationY: E, rotationZ: S, scaleX: O, scaleY: D, scaleZ: $ } = s;
          this.target.position.set(v, y, m), this.target.rotation.set(B, E, S), this.target.scale.set(O, D, $), this.dispatchEvent({ type: "update", source: s, tween: d });
        },
        (s) => {
          this.tweenSet.add(s), this.dispatchEvent({ type: "start", tween: s });
        }
      );
    }
  }
  stop() {
    this.tweenSet.forEach((a) => a.stop()), this.tweenSet.clear();
  }
  reset() {
    const a = this.getInitialTransform();
    if (a) {
      const { x: h, y: f, z: p, rotationX: r, rotationY: u, rotationZ: o, scaleX: t, scaleY: n, scaleZ: e } = a;
      this.target.position.set(h, f, p), this.target.rotation.set(r, u, o), this.target.scale.set(t, n, e), this.viewer.render();
    }
  }
  dispose() {
    this.stop(), this.reset(), Reflect.deleteProperty(this.target, this._initialTransformSymbol);
  }
}
class TopologyParser {
  parse(a) {
    const {
      name: h,
      position: f,
      rotation: p,
      scale: r,
      nodes: u,
      nodeRadius: o = 0.2,
      nodeColor: t = "#0000ff",
      linkWidth: n = 0.1,
      // Legacy support
      linkColor: e = ["#00ff00"]
    } = a, s = new Topology({
      nodeRadius: o,
      nodeColor: t,
      edgeRadius: n,
      edgeColor: e[0],
      pathRadius: n + 0.05
    });
    return s.name = h, s.position.set(f.x, f.y, f.z), s.rotation.set(p.x, p.y, p.z), s.scale.set(r.x, r.y, r.z), u.forEach((d) => {
      const v = new Vector3().copy(d.position);
      s.addNode(d.id, v);
    }), u.forEach((d) => {
      d.graphs.forEach((v) => {
        s.addEdge(d.id, v.targetNodeId);
      });
    }), s.renderGraph(), Object.assign(s.userData, a), s;
  }
}
class TopologiesLoader extends Loader {
  constructor() {
    super(), this.manager = new LoadingManager();
  }
  async loadAsync() {
    if (!this.path)
      throw new Error("u-manager TopologiesLoader: path is not set");
    const h = await new BaseFileLoader(this).loadAsync(TOPOLOGY_DATA_FILE_PATH), f = new TopologyParser(), p = [];
    return h.forEach((r) => {
      const u = f.parse(r);
      p.push(u);
    }), p;
  }
}
class PropertiesLoader extends Loader {
  constructor() {
    super(), this.manager = new LoadingManager();
  }
  async loadAsync() {
    return await new BaseFileLoader(this).loadAsync(PROPERTIES_DATA_FILE_PATH);
  }
}
class VisionsLoader extends Loader {
  constructor() {
    super(), this.manager = new LoadingManager();
  }
  async loadAsync() {
    return await new BaseFileLoader(this).loadAsync(VISIONS_DATA_FILE_PATH);
  }
}
class VisionsParser {
  viewer;
  constructor(a) {
    this.viewer = a;
  }
  async flyToPrimary(a, h = !0) {
    const f = a.find((p) => p.primary);
    return f ? (await this.flyTo(f, h), !0) : !1;
  }
  async flyTo(a, h = !0) {
    const { camera: f, position: p, target: r, zoom: u = this.viewer.camera.zoom } = a;
    f === "P" ? this.viewer.setCameraByType("perspective") : f === "O" && this.viewer.setCameraByType("orthographic");
    const { x: o, y: t, z: n } = p, { x: e, y: s, z: d } = r;
    await Promise.all([
      this.viewer.controls.setLookAt(o, t, n, e, s, d, h),
      this.viewer.controls.zoomTo(u, h)
    ]);
  }
}
class Edge {
  id;
  source;
  target;
  sourceHandle;
  constructor(a) {
    this.id = a.id, this.source = a.source, this.target = a.target, this.sourceHandle = a.sourceHandle;
  }
}
function objectHandle(c, a) {
  return Array.isArray(c) ? c.map(a) : a(c);
}
function sleep(c) {
  return new Promise((a) => setTimeout(a, c));
}
function parseNodeByType(c, a) {
  switch (a.type) {
    case "START":
      return new StartNode(c, a);
    case "COLOR":
      return new ColorNode(c, a);
    case "NUMBER":
      return new NumberNode(c, a);
    case "HIGHLIGHT":
      return new HighlightNode(c, a);
    case "UN_HIGHLIGHT":
      return new UnHighlightNode(c, a);
    case "OPACITY":
      return new OpacityNode(c, a);
    case "UN_OPACITY":
      return new UnOpacityNode(c, a);
    case "EMISSIVE":
      return new EmissiveNode(c, a);
    case "UN_EMISSIVE":
      return new UnEmissiveNode(c, a);
    // 获取对象
    case "MESH":
      return new MeshNode(c, a);
    case "MESHES":
      return new MeshesNode(c, a);
    case "MODEL":
      return new ModelNode(c, a);
    case "MODELS":
      return new ModelsNode(c, a);
    case "SPACE":
      return new SpaceNode(c, a);
    case "SPACES":
      return new SpacesNode(c, a);
    case "POIS":
      return new POIsNode(c, a);
    case "POI":
      return new POINode(c, a);
    case "PATH":
      return new PathNode(c, a);
    case "PATHS":
      return new PathsNode(c, a);
    // 逻辑节点
    case "DELAY":
      return new DelayNode(c, a);
    case "CONDITION_NODE":
      return new ConditionNode(c, a);
    // 显示隐藏
    case "SHOW":
      return new ShowNode(c, a);
    case "HIDE":
      return new HideNode(c, a);
    // 动画相关
    case "CLIP_ANIMATION":
      return new ClipAnimationNode(c, a);
    case "UN_CLIP_ANIMATION":
      return new UnClipAnimationNode(c, a);
    case "TWEEN_ANIMATION":
      return new TweenAnimationNode(c, a);
    case "UN_TWEEN_ANIMATION":
      return new UnTweenAnimationNode(c, a);
    case "COMPONENT_TWEEN_ANIMATION":
      return new ComponentTweenAnimationNode(c, a);
    case "UN_COMPONENT_TWEEN_ANIMATION":
      return new UnComponentTweenAnimationNode(c, a);
    // 移动
    case "TRANSLATE":
      return new TranslateNode(c, a);
    case "ROTATE":
      return new RotateNode(c, a);
    case "SCALE":
      return new ScaleNode(c, a);
    case "FLY_TO":
      return new FlyToNode(c, a);
    // 数据处理节点
    case "DATA_EXTRACTION":
      return new DataExtractionNode(c, a);
    case "DATA_FILTER":
      return new DataFilterNode(c, a);
    case "USER_DATA_NODE":
      return new UserDataNode(c, a);
    default:
      return new Node(c, a);
  }
}
function parseValue(c) {
  return JSON.parse(c);
}
async function waitFor(c, a) {
  a ? await c() : c();
}
function getObjectByIds(c, a) {
  return a.map((h) => c.objectManager.getById(h)).filter(Boolean);
}
function getObjectById(c, a, h) {
  const f = c.objectManager.getById(a);
  if (f)
    return f;
  {
    const p = c.scene;
    return getMeshByUserDataUuid(h ?? p, a);
  }
}
function getMeshByUserDataUuid(c, a) {
  if (c.userData.key === a || c.uuid === a) return c;
  for (let h = 0, f = c.children.length; h < f; h++) {
    const p = c.children[h], r = getMeshByUserDataUuid(p, a);
    if (r !== null)
      return r;
  }
  return null;
}
let count = 0;
const preloadNodes = [
  "MESH",
  "MESHES",
  "MODEL",
  "MODELS",
  "POI",
  "POIS",
  "SPACE",
  "SPACES",
  "PATH",
  "PATHS",
  "COLOR",
  "NUMBER",
  "DATA_EXTRACTION",
  "DATA_FILTER",
  "USER_DATA_NODE",
  "CONDITION_NODE",
  "START"
];
class Node {
  parser;
  viewer;
  id;
  type;
  props;
  // 前置节点
  prevNodes = [];
  // 后置节点
  postNodes = [];
  // 执行顺序
  execOrder = 0;
  // 当前上下文对象
  ctx;
  // 运行结果
  promise;
  resolve;
  reject;
  // 清空队列回调
  cleanSets = /* @__PURE__ */ new Set();
  // 前置钩子
  onBefore = null;
  // 后置钩子
  onAfter = null;
  rejected;
  constructor(a, h) {
    this.parser = a, this.viewer = a.viewer, this.id = h.id, this.type = h.type, this.props = h.props, this.rejected = !1, this.init();
  }
  init() {
    this.ctx = {}, this.promise = new Promise((a, h) => {
      this.resolve = a, this.reject = (f) => {
        this.rejected = !0, h(f);
      };
    });
  }
  readContext(a) {
    return this.ctx[a];
  }
  writeContext(a, h) {
    this.ctx[a] = h;
  }
  findProp(a, h) {
    if (h instanceof Array)
      for (const f of h) {
        const p = this.findProp(a, f);
        if (p) return p;
      }
    else
      return this.props.find((f) => f.name === a && f.type === h);
  }
  /**
   * 等待前置节点执行完毕
   */
  async waitForPrevNodes() {
    return await Promise.all(this.prevNodes.map((a) => a.promise));
  }
  /**
   * 合并上下文
   */
  mergeContext() {
    this.prevNodes.forEach((a) => {
      Object.assign(this.ctx, a.ctx);
    }), this._mergeUserDataMap();
  }
  /**
   * 执行节点逻辑
   * @param global
   */
  async exec(a) {
  }
  /**
   * 运行节点
   * @param global
   * @param options
   */
  async run(a, h = { preload: !1 }) {
    const { preload: f } = h;
    try {
      if (await this.waitForPrevNodes(), this.rejected) throw new Error();
      this.mergeContext(), await (this.onBefore ?? this.parser.onNodeBefore)?.(this);
      try {
        (!f || preloadNodes.includes(this.type)) && (this.execOrder = ++count, await this.exec(a));
      } catch (p) {
        throw this.reject(p), p;
      }
      await (this.onAfter ?? this.parser.onNodeAfter)?.(this), this.resolve();
    } catch (p) {
      this.reject(p);
    }
  }
  // 清空节点逻辑
  cleanup() {
    this.cleanSets.forEach((a) => a()), this.cleanSets.clear();
  }
  getValue(a, h) {
    if (a.type === "READ_CTX")
      return this.readContext(parseValue(a.value));
    if (a.type === "LOCAL") {
      const { scene: f } = this.viewer;
      return a.name === "objects" || a.name === "models" || a.name === "meshs" ? parseValue(a.value).map((p) => getObjectById(this.viewer, p, h ?? f)) : a.name === "object" || a.name === "model" || a.name === "mesh" ? getObjectById(this.viewer, parseValue(a.value), h ?? f) : parseValue(a.value);
    }
  }
  _mergeUserDataMap() {
    if (this.prevNodes.some((a) => a.ctx._userDataMap)) this.ctx._userDataMap = /* @__PURE__ */ new Map();
    else return;
    this.prevNodes.forEach((a) => {
      a.ctx._userDataMap && a.ctx._userDataMap.forEach((h, f) => {
        this.ctx._userDataMap.set(f, Object.assign({}, h));
      });
    });
  }
}
class StartNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
}
class ColorNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("color", "LOCAL"), h = this.findProp("out", "WRITE_CTX");
    a && h && this.writeContext(parseValue(h.value), parseValue(a.value));
  }
}
class NumberNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("number", "LOCAL"), h = this.findProp("out", "WRITE_CTX");
    a && h && this.writeContext(parseValue(h.value), parseValue(a.value));
  }
}
class HighlightNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const h = this.findProp("objects", ["READ_CTX", "LOCAL"]), f = this.findProp("color", ["READ_CTX", "LOCAL"]), p = this.findProp("opacity", ["READ_CTX", "LOCAL"]), r = await a.getTarget?.(this);
    if (h && f && p) {
      const u = this.getValue(h, r), o = this.getValue(f), t = this.getValue(p);
      u && (MaterialEffects.highlightColor(u, { color: o, opacity: t }), this.cleanSets.add(() => {
        MaterialEffects.removeHighlightColor(u);
      }));
    }
  }
}
class UnHighlightNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  filterUnHighlightObject(a) {
    const h = [];
    return objectHandle(a, (f) => {
      h.push(f);
    }), h;
  }
  async exec(a) {
    const h = this.findProp("objects", ["READ_CTX", "LOCAL"]), f = await a.getTarget?.(this);
    if (h) {
      const p = this.getValue(h, f);
      p && MaterialEffects$1.removeHighlightColor(p);
    }
  }
}
class OpacityNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const h = this.findProp("objects", ["READ_CTX", "LOCAL"]), f = this.findProp("color", ["READ_CTX", "LOCAL"]), p = this.findProp("opacity", ["READ_CTX", "LOCAL"]), r = await a.getTarget?.(this);
    if (h && f && p) {
      const u = this.getValue(h, r), o = this.getValue(f), t = this.getValue(p);
      if (u) {
        const n = objectHandle(u, (e) => e);
        MaterialEffects.highlightColor(n, { color: o, opacity: t, overwrite: !0 }), this.cleanSets.add(() => {
          MaterialEffects.removeHighlightColor(n);
        });
      }
    }
  }
}
class UnOpacityNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const h = this.findProp("objects", ["READ_CTX", "LOCAL"]), f = await a.getTarget?.(this);
    if (h) {
      const p = this.getValue(h, f);
      p && MaterialEffects$1.removeHighlightColor(p);
    }
  }
}
class EmissiveNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const h = this.findProp("objects", ["READ_CTX", "LOCAL"]), f = this.findProp("color", ["READ_CTX", "LOCAL"]), p = this.findProp("baseColor", ["READ_CTX", "LOCAL"]), r = this.findProp("minOpacity", ["READ_CTX", "LOCAL"]), u = this.findProp("maxOpacity", ["READ_CTX", "LOCAL"]), o = this.findProp("duration", ["READ_CTX", "LOCAL"]), t = await a.getTarget?.(this);
    if (h && f && p && r && u && o) {
      const n = this.getValue(h, t), e = this.getValue(f), s = this.getValue(u);
      n && (MaterialEffects$1.breatheColor(n, {
        color: e,
        intensity: s
      }), this.cleanSets.add(() => {
        MaterialEffects$1.removeBreatheColor(n);
      }));
    }
  }
}
class UnEmissiveNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  filterUnEmissiveObject(a) {
    const h = [];
    return objectHandle(a, (f) => {
      h.push(f);
    }), h;
  }
  async exec(a) {
    const h = this.findProp("objects", ["READ_CTX", "LOCAL"]), f = await a.getTarget?.(this);
    h && this.getValue(h, f);
  }
}
const meshCacheSymbol = /* @__PURE__ */ Symbol("meshCache");
class MeshNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const { scene: h } = this.viewer, f = await a.getTarget?.(this) || h;
    a[meshCacheSymbol] || (a[meshCacheSymbol] = {});
    const p = this.findProp("mesh", "LOCAL"), r = this.findProp("out", "WRITE_CTX");
    if (p && r) {
      let u = null;
      const o = parseValue(p.value), t = parseValue(r.value), n = a[meshCacheSymbol][o];
      if (n) {
        u = n;
        return;
      }
      const e = getMeshByUserDataUuid(f, o);
      e && (u = e, a[meshCacheSymbol][o] = e), this.writeContext(t, u);
    }
  }
}
const meshesCacheSymbol = /* @__PURE__ */ Symbol("meshesCache");
class MeshesNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const { scene: h } = this.viewer, f = await a.getTarget?.(this) || h;
    a[meshesCacheSymbol] || (a[meshesCacheSymbol] = {});
    const p = this.findProp("meshes", "LOCAL"), r = this.findProp("out", "WRITE_CTX");
    if (p && r) {
      const u = [], o = parseValue(p.value), t = parseValue(r.value);
      o.forEach((n) => {
        const e = a[meshesCacheSymbol][n];
        if (e) {
          u.push(e);
          return;
        }
        const s = getMeshByUserDataUuid(f, n);
        s && (u.push(s), a[meshesCacheSymbol][n] = s);
      }), this.writeContext(t, u);
    }
  }
}
class ModelNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("model", "LOCAL"), h = this.findProp("out", "WRITE_CTX");
    if (a && h) {
      const f = parseValue(a.value), p = parseValue(h.value);
      this.writeContext(p, getObjectById(this.viewer, f));
    }
  }
}
class ModelsNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("models", "LOCAL"), h = this.findProp("out", "WRITE_CTX");
    if (a && h) {
      const f = parseValue(a.value), p = parseValue(h.value);
      this.writeContext(p, getObjectByIds(this.viewer, f));
    }
  }
}
class DelayNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("delay", "LOCAL");
    if (a) {
      const h = parseValue(a.value);
      await sleep(h);
    }
  }
}
class ConditionNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  execFn(a) {
    return new Function("sourceData", a)(this.ctx);
  }
  async exec() {
    const a = this.findProp("conditaion_node", "LOCAL");
    if (a) {
      const h = parseValue(a.value), f = this.parser.edges.filter((p) => p.source === this.id);
      h.forEach((p) => {
        try {
          if (this.execFn(p.value) !== !0) throw new Error();
        } catch {
          const u = f.find((t) => t.sourceHandle == String(p.id));
          if (!u) return;
          this.postNodes.find((t) => t.id === u.target)?.reject();
        }
      });
    }
  }
}
class ShowNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  filterShowObject(a) {
    const h = [];
    return objectHandle(a, (f) => {
      f.visible === !1 && h.push(f);
    }), h;
  }
  async exec(a) {
    const h = this.findProp("objects", ["READ_CTX", "LOCAL"]), f = await a.getTarget?.(this);
    if (h) {
      const p = this.getValue(h, f);
      if (p) {
        const r = this.filterShowObject(p), u = (o) => {
          objectHandle(r, (t) => {
            t.visible = o;
          }), this.viewer.render();
        };
        u(!0), this.cleanSets.add(() => u(!1));
      }
    }
  }
}
class HideNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  filterHideObject(a) {
    const h = [];
    return objectHandle(a, (f) => {
      f.visible === !0 && h.push(f);
    }), h;
  }
  async exec(a) {
    const h = this.findProp("objects", ["READ_CTX", "LOCAL"]), f = await a.getTarget?.(this);
    if (h) {
      const p = this.getValue(h, f);
      if (p) {
        const r = this.filterHideObject(p), u = (o) => {
          objectHandle(r, (t) => {
            t.visible = o;
          }), this.viewer.render();
        };
        u(!1), this.cleanSets.add(() => u(!0));
      }
    }
  }
}
class TranslateNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const h = this.findProp("objects", ["READ_CTX", "LOCAL"]), f = this.findProp("axis", ["READ_CTX", "LOCAL"]), p = this.findProp("translate", ["READ_CTX", "LOCAL"]), r = await a.getTarget?.(this);
    if (h && f && p) {
      const u = this.getValue(h, r), o = this.getValue(f), t = this.getValue(p);
      if (u) {
        const n = [];
        objectHandle(u, (v) => {
          n.push(v.position.clone());
        });
        const s = (v, y) => {
          switch (o) {
            case "x":
              v.setX(y.x);
              break;
            case "y":
              v.setY(y.y);
              break;
            case "z":
              v.setZ(y.z);
              break;
          }
        };
        await (async () => {
          const v = objectHandle(u, async (y) => {
            const m = y.position.clone();
            switch (o) {
              case "x":
                await tweenAnimation(
                  this.viewer,
                  m,
                  new Vector3().set(m.x + t, m.y, m.z),
                  { duration: 800 },
                  (B) => s(y.position, B)
                );
                break;
              case "y":
                await tweenAnimation(
                  this.viewer,
                  m,
                  new Vector3().set(m.x, m.y + t, m.z),
                  { duration: 800 },
                  (B) => s(y.position, B)
                );
                break;
              case "z":
                await tweenAnimation(
                  this.viewer,
                  m,
                  new Vector3().set(m.x, m.y, m.z + t),
                  { duration: 800 },
                  (B) => s(y.position, B)
                );
                break;
            }
          });
          v instanceof Array ? await Promise.all(v) : await v, this.viewer.render();
        })(), this.cleanSets.add(() => {
          let v = 0;
          objectHandle(u, (y) => {
            y.position.copy(n[v++]);
          });
        });
      }
    }
  }
}
class ScaleNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const h = this.findProp("objects", ["READ_CTX", "LOCAL"]), f = this.findProp("axis", ["READ_CTX", "LOCAL"]), p = this.findProp("scale", ["READ_CTX", "LOCAL"]), r = await a.getTarget?.(this);
    if (h && f && p) {
      const u = this.getValue(h, r), o = this.getValue(f), t = this.getValue(p);
      if (u) {
        const n = [];
        objectHandle(u, (v) => {
          n.push(v.scale.clone());
        });
        const s = (v, y) => {
          switch (o) {
            case "x":
              v.setX(y.x);
              break;
            case "y":
              v.setY(y.y);
              break;
            case "z":
              v.setZ(y.z);
              break;
          }
        };
        await (async () => {
          const v = objectHandle(u, async (y) => {
            const m = y.scale.clone();
            switch (o) {
              case "x":
                await tweenAnimation(this.viewer, m, new Vector3().set(m.x * t, m.y, m.z), { duration: 800 }, (B) => s(y.scale, B));
                break;
              case "y":
                await tweenAnimation(this.viewer, m, new Vector3().set(m.x, m.y * t, m.z), { duration: 800 }, (B) => s(y.scale, B));
                break;
              case "z":
                await tweenAnimation(this.viewer, m, new Vector3().set(m.x, m.y, m.z * t), { duration: 800 }, (B) => s(y.scale, B));
                break;
            }
          });
          v instanceof Array ? await Promise.all(v) : await v, this.viewer.render();
        })(), this.cleanSets.add(() => {
          let v = 0;
          objectHandle(u, (y) => {
            y.scale.copy(n[v++]);
          });
        });
      }
    }
  }
}
class RotateNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const h = this.findProp("objects", ["READ_CTX", "LOCAL"]), f = this.findProp("axis", ["READ_CTX", "LOCAL"]), p = this.findProp("rotation", ["READ_CTX", "LOCAL"]), r = await a.getTarget?.(this);
    if (h && f && p) {
      const u = this.getValue(h, r), o = this.getValue(f), t = this.getValue(p);
      if (u) {
        const n = [];
        objectHandle(u, (v) => {
          n.push(v.rotation.clone());
        });
        const s = (v, y) => {
          switch (o) {
            case "x":
              v.x = y.x;
              break;
            case "y":
              v.y = y.y;
              break;
            case "z":
              v.z = y.z;
              break;
          }
        };
        await (async () => {
          const v = t / 180 * Math.PI, y = objectHandle(u, async (m) => {
            const B = m.rotation.clone();
            switch (o) {
              case "x":
                await tweenAnimation(
                  this.viewer,
                  B,
                  new Euler().set(B.x + v, B.y, B.z),
                  { duration: 800 },
                  (E) => s(m.rotation, E)
                );
                break;
              case "y":
                await tweenAnimation(
                  this.viewer,
                  B,
                  new Euler().set(B.x, B.y + v, B.z),
                  { duration: 800 },
                  (E) => s(m.rotation, E)
                );
                break;
              case "z":
                await tweenAnimation(
                  this.viewer,
                  B,
                  new Euler().set(B.x, B.y, B.z + v),
                  { duration: 800 },
                  (E) => s(m.rotation, E)
                );
                break;
            }
          });
          y instanceof Array ? await Promise.all(y) : await y, this.viewer.render();
        })(), this.cleanSets.add(() => {
          let v = 0;
          objectHandle(u, (y) => {
            y.rotation.copy(n[v++]);
          });
        });
      }
    }
  }
}
class FlyToNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("viewpoint", ["READ_CTX", "LOCAL"]);
    if (a) {
      const h = parseValue(this.getValue(a));
      h && this.viewer.controls.setCameraViewpoint(h, !0);
    }
  }
}
class SpaceNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("space", "LOCAL"), h = this.findProp("out", "WRITE_CTX");
    if (a && h) {
      const f = parseValue(a.value), p = parseValue(h.value);
      this.writeContext(p, getObjectById(this.viewer, f));
    }
  }
}
class SpacesNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("spaces", "LOCAL"), h = this.findProp("out", "WRITE_CTX");
    if (a && h) {
      const f = parseValue(a.value), p = parseValue(h.value), r = f.map((u) => getObjectById(this.viewer, u));
      this.writeContext(p, r);
    }
  }
}
class POINode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const h = this.findProp("poi", "LOCAL"), f = this.findProp("out", "WRITE_CTX");
    if (h && f) {
      const p = parseValue(h.value), r = parseValue(f.value);
      this.writeContext(r, getObjectById(this.viewer, p));
    }
  }
}
class POIsNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const h = this.findProp("pois", "LOCAL"), f = this.findProp("out", "WRITE_CTX");
    if (h && f) {
      const p = parseValue(h.value), r = parseValue(f.value), u = p.map((o) => getObjectById(this.viewer, o));
      this.writeContext(r, u);
    }
  }
}
class DataExtractionNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("value", "LOCAL"), h = this.findProp("object", "LOCAL"), f = this.findProp("out", "WRITE_CTX"), p = this.findProp("extraction", "LOCAL");
    if (a && f && p && h) {
      const r = parseValue(p.value), u = parseValue(f.value), o = parseValue(h.value), t = this.getValue(h);
      let n = parseValue(a.value);
      if (this.ctx._userDataMap) {
        const e = this.ctx._userDataMap.get(o);
        e && (n = e[r]);
      } else if (t && t.userData.properties) {
        const e = t.userData.properties.find((s) => s.key === r);
        e && e.value !== void 0 && (n = e.value);
      }
      this.writeContext(u, n);
    }
  }
}
class DataFilterNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("model", "LOCAL");
    if (a) {
      const h = parseValue(a.value), f = new Function("sourceData", h);
      for (const p in this.ctx) {
        const r = f(this.ctx[p]);
        (r == null || r === !1) && delete this.ctx[p];
      }
    }
  }
}
class PathNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("path", "LOCAL"), h = this.findProp("out", "WRITE_CTX");
    if (a && h) {
      const f = parseValue(a.value), p = parseValue(h.value);
      this.writeContext(p, getObjectById(this.viewer, f));
    }
  }
}
class PathsNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("paths", "LOCAL"), h = this.findProp("out", "WRITE_CTX");
    if (a && h) {
      const f = parseValue(a.value), p = parseValue(h.value), r = f.map((u) => getObjectById(this.viewer, u));
      this.writeContext(p, r);
    }
  }
}
class UserDataNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("object", ["READ_CTX", "LOCAL"]), h = this.findProp("data", "LOCAL"), f = this.findProp("source", "WRITE_CTX");
    if (a && h && f) {
      let p = parseValue(a.value);
      const r = parseValue(h.value), u = parseValue(f.value);
      if (u && (p = u), p && r) {
        this.ctx._userDataMap || (this.ctx._userDataMap = /* @__PURE__ */ new Map());
        const o = this.ctx._userDataMap.get(p);
        o ? Object.assign(o, r) : this.ctx._userDataMap.set(p, r);
      }
    }
  }
}
class ClipAnimationNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    let h = await a.getTarget?.(this);
    if (!h) {
      const p = this.findProp("model", ["READ_CTX", "LOCAL"]);
      p && (h = this.getValue(p));
    }
    const f = this.findProp("animation", ["READ_CTX", "LOCAL"]);
    if (h && f) {
      let p;
      if (f.type === "READ_CTX") {
        const u = this.parser.getVariableNameById(parseValue(f.value));
        p = this.readContext(u);
      } else
        p = parseValue(f.value);
      h.playAnimation(p);
      const r = ({ delta: u }) => {
        h.updateAnimation(u);
      };
      this.viewer.addEventListener("beforeRender", r), this.cleanSets.add(() => {
        h.stopAnimation(p), this.viewer.removeEventListener("beforeRender", r);
      });
    }
  }
}
class UnClipAnimationNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    let h = await a.getTarget?.(this);
    if (!h) {
      const p = this.findProp("model", ["READ_CTX", "LOCAL"]);
      p && (h = this.getValue(p));
    }
    const f = this.findProp("animation", ["READ_CTX", "LOCAL"]);
    if (h && f) {
      let p;
      if (f.type === "READ_CTX") {
        const r = this.parser.getVariableNameById(parseValue(f.value));
        p = this.readContext(r);
      } else
        p = parseValue(f.value);
      h.stopAnimation(p);
    }
  }
}
const tweenCache$1 = /* @__PURE__ */ new Map();
async function playTweenAnimation(c, a, h) {
  const { id: f, keyframes: p } = h, r = new AnimationsParser(c, a);
  tweenCache$1.has(f) || tweenCache$1.set(f, /* @__PURE__ */ new Set()), tweenCache$1.get(f)?.add(r), await r.play(p);
}
function stopTweenAnimation(c) {
  tweenCache$1.get(c)?.forEach((a) => a.stop()), tweenCache$1.get(c)?.clear();
}
class TweenAnimationNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const h = this.findProp("model", ["READ_CTX", "LOCAL"]), f = this.findProp("animation", "LOCAL"), p = this.findProp("wait", "LOCAL");
    if (h && f && p) {
      const r = this.getValue(h), u = parseValue(f.value), o = parseValue(p.value);
      if (r) {
        const t = await a.getAnimations?.(this, r, u);
        if (t) {
          const n = t.find((e) => e.id === u);
          n && await waitFor(async () => {
            const e = r.matrix.clone();
            await playTweenAnimation(this.viewer, r, n), this.cleanSets.add(() => {
              stopTweenAnimation(n.id), r && e.decompose(r.position, r.quaternion, r.scale);
            });
          }, o);
        }
      }
    }
  }
}
class UnTweenAnimationNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("animation", "LOCAL");
    if (a) {
      const h = parseValue(a.value);
      stopTweenAnimation(h);
    }
  }
}
const tweenCache = /* @__PURE__ */ new Map();
async function playComponentTweenAnimation(c, a, h) {
  const { id: f, keyframes: p } = h, r = new AnimationsParser(c, a);
  tweenCache.has(f) || tweenCache.set(f, /* @__PURE__ */ new Set()), tweenCache.get(f)?.add(r), await r.play(p);
}
function stopComponentTweenAnimation(c) {
  tweenCache.get(c)?.forEach((a) => a.stop()), tweenCache.get(c)?.clear();
}
class ComponentTweenAnimationNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec(a) {
    const h = this.findProp("mesh", ["READ_CTX", "LOCAL"]), f = this.findProp("animation", "LOCAL"), p = this.findProp("wait", "LOCAL");
    if (h && f && p) {
      const r = this.getValue(h), u = parseValue(f.value), o = parseValue(p.value);
      if (r) {
        const t = await a.getComponentAnimations?.(this, r, u);
        if (t) {
          const n = t.find((e) => e.id === u);
          if (n) {
            let e = null;
            h.valueType === "Mesh" ? e = r : h.valueType === "Model" && (e = getMeshByUserDataUuid(r, n.refId)), e && await waitFor(async () => {
              if (e) {
                const s = e.matrix.clone();
                await playComponentTweenAnimation(this.viewer, e, n), this.cleanSets.add(() => {
                  stopComponentTweenAnimation(n.id), e && s.decompose(e.position, e.quaternion, e.scale);
                });
              }
            }, o);
          }
        }
      }
    }
  }
}
class UnComponentTweenAnimationNode extends Node {
  constructor(a, h) {
    super(a, h);
  }
  async exec() {
    const a = this.findProp("animation", "LOCAL");
    if (a) {
      const h = parseValue(a.value);
      stopComponentTweenAnimation(h);
    }
  }
}
class FlowParser extends EventDispatcher {
  viewer;
  flow;
  nodes;
  nodesMap;
  edges;
  edgesMap;
  onNodeBefore = null;
  onNodeAfter = null;
  constructor(a, h) {
    super(), this.viewer = a, this.flow = h, this.nodes = [], this.nodesMap = /* @__PURE__ */ new Map(), this.edges = [], this.edgesMap = /* @__PURE__ */ new Map();
  }
  addNode(a) {
    this.nodes.push(a), this.nodesMap.set(a.id, a);
  }
  addEdge(a) {
    this.edges.push(a), this.edgesMap.set(a.id, a);
  }
  getNodeById(a) {
    return this.nodesMap.get(a);
  }
  getEdgeById(a) {
    return this.edgesMap.get(a);
  }
  clear() {
    this.nodes.length = 0, this.nodesMap.clear(), this.edges.length = 0, this.edgesMap.clear();
  }
  /**
   * 解析流程
   */
  parse() {
    this.clear();
    const { nodes: a, edges: h } = this.flow;
    a.forEach((f) => {
      const p = parseNodeByType(this, f);
      this.addNode(p);
    }), h.forEach((f) => {
      const p = new Edge(f);
      this.addEdge(p);
      const r = this.getNodeById(f.source), u = this.getNodeById(f.target);
      r && u && (r.postNodes.push(u), u.prevNodes.push(r));
    });
  }
  /**
   * 执行流程
   * @param startNode 
   * @param ctx 
   */
  async run(a = {}, h = { preload: !1 }) {
    const { preload: f } = h, r = this.nodes.filter((u) => u.prevNodes.length || u.postNodes.length).map((u) => u.run(a, { preload: f }));
    await Promise.allSettled(r);
  }
  /**
   * 调试流程
   */
  async debug(a = {}, h = 1500) {
    const f = this.onNodeAfter;
    this.onNodeAfter = async (p) => {
      await sleep(h), f?.(p);
    }, await this.run(a);
  }
  /**
   * 停止流程
   */
  stop() {
    this.nodes.forEach((a) => a.reject(new Error("Flow stopped")));
  }
  /**
   * 清理流程
   */
  cleanup() {
    this.nodes.sort((a, h) => h.execOrder - a.execOrder).forEach((a) => a.cleanup());
  }
  getVariableNameById(a) {
    const h = this.nodes.find((f) => f.id === a);
    if (h) {
      const f = h.props.find((p) => p.name === "out");
      return f ? parseValue(f.value) : null;
    }
    return null;
  }
  dispose() {
    this.stop(), this.cleanup();
  }
}
class ComponentFlowParser extends FlowParser {
  flow;
  constructor(a, h) {
    super(a, h), this.flow = h;
  }
}
export {
  AnimationsLoader,
  AnimationsParser,
  ComponentFlowParser,
  FlowParser,
  Node,
  PropertiesLoader,
  SceneLoader,
  TopologiesLoader,
  TopologyParser,
  VisionsLoader,
  VisionsParser
};
