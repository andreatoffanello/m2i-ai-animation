var qe = Object.defineProperty;
var Be = (l, t, n) => t in l ? qe(l, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : l[t] = n;
var xe = (l, t, n) => Be(l, typeof t != "symbol" ? t + "" : t, n);
import * as p from "three";
import { Ray as Ke, Plane as Ze, MathUtils as Qe, EventDispatcher as $e, Vector3 as I, MOUSE as F, TOUCH as W, Quaternion as Pe, Spherical as Ie, Vector2 as O, Loader as Je, FileLoader as et, ShapePath as tt, ExtrudeGeometry as ot } from "three";
const we = { type: "change" }, ne = { type: "start" }, Ae = { type: "end" }, Z = new Ke(), Oe = new Ze(), nt = Math.cos(70 * Qe.DEG2RAD);
class it extends $e {
  constructor(t, n) {
    super(), this.object = t, this.domElement = n, this.domElement.style.touchAction = "none", this.enabled = !0, this.target = new I(), this.cursor = new I(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minTargetRadius = 0, this.maxTargetRadius = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: F.ROTATE, MIDDLE: F.DOLLY, RIGHT: F.PAN }, this.touches = { ONE: W.ROTATE, TWO: W.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this.getPolarAngle = function() {
      return r.phi;
    }, this.getAzimuthalAngle = function() {
      return r.theta;
    }, this.getDistance = function() {
      return this.object.position.distanceTo(this.target);
    }, this.listenToKeyEvents = function(o) {
      o.addEventListener("keydown", te), this._domElementKeyEvents = o;
    }, this.stopListenToKeyEvents = function() {
      this._domElementKeyEvents.removeEventListener("keydown", te), this._domElementKeyEvents = null;
    }, this.saveState = function() {
      e.target0.copy(e.target), e.position0.copy(e.object.position), e.zoom0 = e.object.zoom;
    }, this.reset = function() {
      e.target.copy(e.target0), e.object.position.copy(e.position0), e.object.zoom = e.zoom0, e.object.updateProjectionMatrix(), e.dispatchEvent(we), e.update(), s = i.NONE;
    }, this.update = function() {
      const o = new I(), a = new Pe().setFromUnitVectors(t.up, new I(0, 1, 0)), y = a.clone().invert(), E = new I(), P = new Pe(), U = new I(), N = 2 * Math.PI;
      return function(Ge = null) {
        const Me = e.object.position;
        o.copy(Me).sub(e.target), o.applyQuaternion(a), r.setFromVector3(o), e.autoRotate && s === i.NONE && j(Re(Ge)), e.enableDamping ? (r.theta += u.theta * e.dampingFactor, r.phi += u.phi * e.dampingFactor) : (r.theta += u.theta, r.phi += u.phi);
        let b = e.minAzimuthAngle, C = e.maxAzimuthAngle;
        isFinite(b) && isFinite(C) && (b < -Math.PI ? b += N : b > Math.PI && (b -= N), C < -Math.PI ? C += N : C > Math.PI && (C -= N), b <= C ? r.theta = Math.max(b, Math.min(C, r.theta)) : r.theta = r.theta > (b + C) / 2 ? Math.max(b, r.theta) : Math.min(C, r.theta)), r.phi = Math.max(e.minPolarAngle, Math.min(e.maxPolarAngle, r.phi)), r.makeSafe(), e.enableDamping === !0 ? e.target.addScaledVector(v, e.dampingFactor) : e.target.add(v), e.target.sub(e.cursor), e.target.clampLength(e.minTargetRadius, e.maxTargetRadius), e.target.add(e.cursor), e.zoomToCursor && V || e.object.isOrthographicCamera ? r.radius = J(r.radius) : r.radius = J(r.radius * c), o.setFromSpherical(r), o.applyQuaternion(y), Me.copy(e.target).add(o), e.object.lookAt(e.target), e.enableDamping === !0 ? (u.theta *= 1 - e.dampingFactor, u.phi *= 1 - e.dampingFactor, v.multiplyScalar(1 - e.dampingFactor)) : (u.set(0, 0, 0), v.set(0, 0, 0));
        let B = !1;
        if (e.zoomToCursor && V) {
          let Y = null;
          if (e.object.isPerspectiveCamera) {
            const H = o.length();
            Y = J(H * c);
            const K = H - Y;
            e.object.position.addScaledVector(D, K), e.object.updateMatrixWorld();
          } else if (e.object.isOrthographicCamera) {
            const H = new I(_.x, _.y, 0);
            H.unproject(e.object), e.object.zoom = Math.max(e.minZoom, Math.min(e.maxZoom, e.object.zoom / c)), e.object.updateProjectionMatrix(), B = !0;
            const K = new I(_.x, _.y, 0);
            K.unproject(e.object), e.object.position.sub(K).add(H), e.object.updateMatrixWorld(), Y = o.length();
          } else
            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), e.zoomToCursor = !1;
          Y !== null && (this.screenSpacePanning ? e.target.set(0, 0, -1).transformDirection(e.object.matrix).multiplyScalar(Y).add(e.object.position) : (Z.origin.copy(e.object.position), Z.direction.set(0, 0, -1).transformDirection(e.object.matrix), Math.abs(e.object.up.dot(Z.direction)) < nt ? t.lookAt(e.target) : (Oe.setFromNormalAndCoplanarPoint(e.object.up, e.target), Z.intersectPlane(Oe, e.target))));
        } else e.object.isOrthographicCamera && (e.object.zoom = Math.max(e.minZoom, Math.min(e.maxZoom, e.object.zoom / c)), e.object.updateProjectionMatrix(), B = !0);
        return c = 1, V = !1, B || E.distanceToSquared(e.object.position) > h || 8 * (1 - P.dot(e.object.quaternion)) > h || U.distanceToSquared(e.target) > 0 ? (e.dispatchEvent(we), E.copy(e.object.position), P.copy(e.object.quaternion), U.copy(e.target), B = !1, !0) : !1;
      };
    }(), this.dispose = function() {
      e.domElement.removeEventListener("contextmenu", Ee), e.domElement.removeEventListener("pointerdown", ve), e.domElement.removeEventListener("pointercancel", k), e.domElement.removeEventListener("wheel", ye), e.domElement.removeEventListener("pointermove", ee), e.domElement.removeEventListener("pointerup", k), e._domElementKeyEvents !== null && (e._domElementKeyEvents.removeEventListener("keydown", te), e._domElementKeyEvents = null);
    };
    const e = this, i = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let s = i.NONE;
    const h = 1e-6, r = new Ie(), u = new Ie();
    let c = 1;
    const v = new I(), d = new O(), S = new O(), M = new O(), x = new O(), m = new O(), g = new O(), w = new O(), A = new O(), R = new O(), D = new I(), _ = new O();
    let V = !1;
    const f = [], X = {};
    function Re(o) {
      return o !== null ? 2 * Math.PI / 60 * e.autoRotateSpeed * o : 2 * Math.PI / 60 / 60 * e.autoRotateSpeed;
    }
    function G() {
      return Math.pow(0.95, e.zoomSpeed);
    }
    function j(o) {
      u.theta -= o;
    }
    function q(o) {
      u.phi -= o;
    }
    const se = function() {
      const o = new I();
      return function(y, E) {
        o.setFromMatrixColumn(E, 0), o.multiplyScalar(-y), v.add(o);
      };
    }(), ae = function() {
      const o = new I();
      return function(y, E) {
        e.screenSpacePanning === !0 ? o.setFromMatrixColumn(E, 1) : (o.setFromMatrixColumn(E, 0), o.crossVectors(e.object.up, o)), o.multiplyScalar(y), v.add(o);
      };
    }(), L = function() {
      const o = new I();
      return function(y, E) {
        const P = e.domElement;
        if (e.object.isPerspectiveCamera) {
          const U = e.object.position;
          o.copy(U).sub(e.target);
          let N = o.length();
          N *= Math.tan(e.object.fov / 2 * Math.PI / 180), se(2 * y * N / P.clientHeight, e.object.matrix), ae(2 * E * N / P.clientHeight, e.object.matrix);
        } else e.object.isOrthographicCamera ? (se(y * (e.object.right - e.object.left) / e.object.zoom / P.clientWidth, e.object.matrix), ae(E * (e.object.top - e.object.bottom) / e.object.zoom / P.clientHeight, e.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), e.enablePan = !1);
      };
    }();
    function $(o) {
      e.object.isPerspectiveCamera || e.object.isOrthographicCamera ? c /= o : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), e.enableZoom = !1);
    }
    function re(o) {
      e.object.isPerspectiveCamera || e.object.isOrthographicCamera ? c *= o : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), e.enableZoom = !1);
    }
    function ce(o) {
      if (!e.zoomToCursor)
        return;
      V = !0;
      const a = e.domElement.getBoundingClientRect(), y = o.clientX - a.left, E = o.clientY - a.top, P = a.width, U = a.height;
      _.x = y / P * 2 - 1, _.y = -(E / U) * 2 + 1, D.set(_.x, _.y, 1).unproject(e.object).sub(e.object.position).normalize();
    }
    function J(o) {
      return Math.max(e.minDistance, Math.min(e.maxDistance, o));
    }
    function le(o) {
      d.set(o.clientX, o.clientY);
    }
    function be(o) {
      ce(o), w.set(o.clientX, o.clientY);
    }
    function he(o) {
      x.set(o.clientX, o.clientY);
    }
    function Ce(o) {
      S.set(o.clientX, o.clientY), M.subVectors(S, d).multiplyScalar(e.rotateSpeed);
      const a = e.domElement;
      j(2 * Math.PI * M.x / a.clientHeight), q(2 * Math.PI * M.y / a.clientHeight), d.copy(S), e.update();
    }
    function _e(o) {
      A.set(o.clientX, o.clientY), R.subVectors(A, w), R.y > 0 ? $(G()) : R.y < 0 && re(G()), w.copy(A), e.update();
    }
    function Ne(o) {
      m.set(o.clientX, o.clientY), g.subVectors(m, x).multiplyScalar(e.panSpeed), L(g.x, g.y), x.copy(m), e.update();
    }
    function ze(o) {
      ce(o), o.deltaY < 0 ? re(G()) : o.deltaY > 0 && $(G()), e.update();
    }
    function De(o) {
      let a = !1;
      switch (o.code) {
        case e.keys.UP:
          o.ctrlKey || o.metaKey || o.shiftKey ? q(2 * Math.PI * e.rotateSpeed / e.domElement.clientHeight) : L(0, e.keyPanSpeed), a = !0;
          break;
        case e.keys.BOTTOM:
          o.ctrlKey || o.metaKey || o.shiftKey ? q(-2 * Math.PI * e.rotateSpeed / e.domElement.clientHeight) : L(0, -e.keyPanSpeed), a = !0;
          break;
        case e.keys.LEFT:
          o.ctrlKey || o.metaKey || o.shiftKey ? j(2 * Math.PI * e.rotateSpeed / e.domElement.clientHeight) : L(e.keyPanSpeed, 0), a = !0;
          break;
        case e.keys.RIGHT:
          o.ctrlKey || o.metaKey || o.shiftKey ? j(-2 * Math.PI * e.rotateSpeed / e.domElement.clientHeight) : L(-e.keyPanSpeed, 0), a = !0;
          break;
      }
      a && (o.preventDefault(), e.update());
    }
    function de() {
      if (f.length === 1)
        d.set(f[0].pageX, f[0].pageY);
      else {
        const o = 0.5 * (f[0].pageX + f[1].pageX), a = 0.5 * (f[0].pageY + f[1].pageY);
        d.set(o, a);
      }
    }
    function pe() {
      if (f.length === 1)
        x.set(f[0].pageX, f[0].pageY);
      else {
        const o = 0.5 * (f[0].pageX + f[1].pageX), a = 0.5 * (f[0].pageY + f[1].pageY);
        x.set(o, a);
      }
    }
    function ue() {
      const o = f[0].pageX - f[1].pageX, a = f[0].pageY - f[1].pageY, y = Math.sqrt(o * o + a * a);
      w.set(0, y);
    }
    function Le() {
      e.enableZoom && ue(), e.enablePan && pe();
    }
    function Ue() {
      e.enableZoom && ue(), e.enableRotate && de();
    }
    function me(o) {
      if (f.length == 1)
        S.set(o.pageX, o.pageY);
      else {
        const y = oe(o), E = 0.5 * (o.pageX + y.x), P = 0.5 * (o.pageY + y.y);
        S.set(E, P);
      }
      M.subVectors(S, d).multiplyScalar(e.rotateSpeed);
      const a = e.domElement;
      j(2 * Math.PI * M.x / a.clientHeight), q(2 * Math.PI * M.y / a.clientHeight), d.copy(S);
    }
    function fe(o) {
      if (f.length === 1)
        m.set(o.pageX, o.pageY);
      else {
        const a = oe(o), y = 0.5 * (o.pageX + a.x), E = 0.5 * (o.pageY + a.y);
        m.set(y, E);
      }
      g.subVectors(m, x).multiplyScalar(e.panSpeed), L(g.x, g.y), x.copy(m);
    }
    function ge(o) {
      const a = oe(o), y = o.pageX - a.x, E = o.pageY - a.y, P = Math.sqrt(y * y + E * E);
      A.set(0, P), R.set(0, Math.pow(A.y / w.y, e.zoomSpeed)), $(R.y), w.copy(A);
    }
    function Fe(o) {
      e.enableZoom && ge(o), e.enablePan && fe(o);
    }
    function We(o) {
      e.enableZoom && ge(o), e.enableRotate && me(o);
    }
    function ve(o) {
      e.enabled !== !1 && (f.length === 0 && (e.domElement.setPointerCapture(o.pointerId), e.domElement.addEventListener("pointermove", ee), e.domElement.addEventListener("pointerup", k)), Ve(o), o.pointerType === "touch" ? Ye(o) : je(o));
    }
    function ee(o) {
      e.enabled !== !1 && (o.pointerType === "touch" ? He(o) : ke(o));
    }
    function k(o) {
      Xe(o), f.length === 0 && (e.domElement.releasePointerCapture(o.pointerId), e.domElement.removeEventListener("pointermove", ee), e.domElement.removeEventListener("pointerup", k)), e.dispatchEvent(Ae), s = i.NONE;
    }
    function je(o) {
      let a;
      switch (o.button) {
        case 0:
          a = e.mouseButtons.LEFT;
          break;
        case 1:
          a = e.mouseButtons.MIDDLE;
          break;
        case 2:
          a = e.mouseButtons.RIGHT;
          break;
        default:
          a = -1;
      }
      switch (a) {
        case F.DOLLY:
          if (e.enableZoom === !1) return;
          be(o), s = i.DOLLY;
          break;
        case F.ROTATE:
          if (o.ctrlKey || o.metaKey || o.shiftKey) {
            if (e.enablePan === !1) return;
            he(o), s = i.PAN;
          } else {
            if (e.enableRotate === !1) return;
            le(o), s = i.ROTATE;
          }
          break;
        case F.PAN:
          if (o.ctrlKey || o.metaKey || o.shiftKey) {
            if (e.enableRotate === !1) return;
            le(o), s = i.ROTATE;
          } else {
            if (e.enablePan === !1) return;
            he(o), s = i.PAN;
          }
          break;
        default:
          s = i.NONE;
      }
      s !== i.NONE && e.dispatchEvent(ne);
    }
    function ke(o) {
      switch (s) {
        case i.ROTATE:
          if (e.enableRotate === !1) return;
          Ce(o);
          break;
        case i.DOLLY:
          if (e.enableZoom === !1) return;
          _e(o);
          break;
        case i.PAN:
          if (e.enablePan === !1) return;
          Ne(o);
          break;
      }
    }
    function ye(o) {
      e.enabled === !1 || e.enableZoom === !1 || s !== i.NONE || (o.preventDefault(), e.dispatchEvent(ne), ze(o), e.dispatchEvent(Ae));
    }
    function te(o) {
      e.enabled === !1 || e.enablePan === !1 || De(o);
    }
    function Ye(o) {
      switch (Se(o), f.length) {
        case 1:
          switch (e.touches.ONE) {
            case W.ROTATE:
              if (e.enableRotate === !1) return;
              de(), s = i.TOUCH_ROTATE;
              break;
            case W.PAN:
              if (e.enablePan === !1) return;
              pe(), s = i.TOUCH_PAN;
              break;
            default:
              s = i.NONE;
          }
          break;
        case 2:
          switch (e.touches.TWO) {
            case W.DOLLY_PAN:
              if (e.enableZoom === !1 && e.enablePan === !1) return;
              Le(), s = i.TOUCH_DOLLY_PAN;
              break;
            case W.DOLLY_ROTATE:
              if (e.enableZoom === !1 && e.enableRotate === !1) return;
              Ue(), s = i.TOUCH_DOLLY_ROTATE;
              break;
            default:
              s = i.NONE;
          }
          break;
        default:
          s = i.NONE;
      }
      s !== i.NONE && e.dispatchEvent(ne);
    }
    function He(o) {
      switch (Se(o), s) {
        case i.TOUCH_ROTATE:
          if (e.enableRotate === !1) return;
          me(o), e.update();
          break;
        case i.TOUCH_PAN:
          if (e.enablePan === !1) return;
          fe(o), e.update();
          break;
        case i.TOUCH_DOLLY_PAN:
          if (e.enableZoom === !1 && e.enablePan === !1) return;
          Fe(o), e.update();
          break;
        case i.TOUCH_DOLLY_ROTATE:
          if (e.enableZoom === !1 && e.enableRotate === !1) return;
          We(o), e.update();
          break;
        default:
          s = i.NONE;
      }
    }
    function Ee(o) {
      e.enabled !== !1 && o.preventDefault();
    }
    function Ve(o) {
      f.push(o);
    }
    function Xe(o) {
      delete X[o.pointerId];
      for (let a = 0; a < f.length; a++)
        if (f[a].pointerId == o.pointerId) {
          f.splice(a, 1);
          return;
        }
    }
    function Se(o) {
      let a = X[o.pointerId];
      a === void 0 && (a = new O(), X[o.pointerId] = a), a.set(o.pageX, o.pageY);
    }
    function oe(o) {
      const a = o.pointerId === f[0].pointerId ? f[1] : f[0];
      return X[a.pointerId];
    }
    e.domElement.addEventListener("contextmenu", Ee), e.domElement.addEventListener("pointerdown", ve), e.domElement.addEventListener("pointercancel", k), e.domElement.addEventListener("wheel", ye, { passive: !1 }), this.update();
  }
}
const z = {
  // Animation timing constants
  SCENE_ANIMATION_DURATION: 2,
  // Durata dell'animazione di entrata/uscita della scena completa (in secondi)
  MOVEMENT_TIME: 0.6,
  // Tempo impiegato per il movimento delle parole (in secondi)
  PROCESSING_TIME: 2.5,
  // Durata della fase di elaborazione/stasi (in secondi)
  PULSE_SPEED: 2,
  // Velocità della pulsazione della sfera interna (più alto = più veloce)
  PULSE_AMPLITUDE: 0.1,
  // Ampiezza della pulsazione (quanto grande diventa la sfera durante la pulsazione)
  // Scene geometry constants
  PARTICLE_SIZE: 5e-3,
  // Dimensione delle singole particelle nella sfera esterna
  PARTICLE_COUNT: 3e4,
  // Numero totale di particelle nella sfera esterna
  SPHERE_RADIUS: 2,
  // Raggio della sfera di particelle
  TEXT_SPHERE_RADIUS: 2.3,
  // Raggio della sfera dove appaiono le parole
  TEXT_MIN_RADIUS: 0.1,
  // Raggio minimo quando le parole sono al centro
  // Color palette
  PROCESSING_COLORS: [
    "#FBD23D",
    // Giallo - Colore primario per le particelle e il testo
    "#3EECFF",
    // Azzurro - Colore secondario
    "#EF6F34",
    // Arancione - Colore terziario
    "#5C20DD"
    // Viola - Colore quaternario
  ],
  DEFAULT_TEXT_COLOR: "#3EECFF",
  // Colore di default per il testo
  // Word animation timing
  WORD_ANIMATION: {
    MOVE_OUT_DURATION: 1,
    // Tempo per l'animazione dal centro alla superficie (in secondi)
    SURFACE_DURATION: 2,
    // Tempo di permanenza sulla superficie (in secondi)
    MOVE_IN_DURATION: 1,
    // Tempo per l'animazione dalla superficie al centro (in secondi)
    TYPING_SPEED: 0.5
    // Velocità dell'effetto di digitazione delle lettere
  },
  // Word behavior
  MAX_ACTIVE_WORDS: 20,
  // Numero massimo di parole animate contemporaneamente
  WORD_DELAY: 100,
  // Ritardo tra l'animazione di una parola e la successiva (in millisecondi)
  // Noise effect parameters
  NOISE: {
    AMPLITUDE: 0.1,
    // Intensità dell'effetto di distorsione del noise
    FREQUENCY: 1
    // Frequenza dell'effetto noise (più alto = più dettagliato)
  }
};
function st(l = {}) {
  return {
    ...z,
    ...l,
    WORD_ANIMATION: {
      ...z.WORD_ANIMATION,
      ...l.WORD_ANIMATION || {}
    },
    NOISE: {
      ...z.NOISE,
      ...l.NOISE || {}
    }
  };
}
const at = `uniform float time;
uniform float noiseAmplitude;
uniform float noiseFrequency;
uniform float pulseTime;
uniform float particleSize;
varying vec3 vColor;

//
// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
}

void main() {
    vColor = color;
    vec3 pos = position;
    
    float noiseVal = cnoise(pos * noiseFrequency + time * 0.4);
    float displacement = noiseVal * noiseAmplitude;
    
    float pulse = 1.0 + sin(pulseTime * 0.8) * 0.05;
    
    pos *= pulse;
    pos += normal * displacement;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = particleSize * (1000.0 / -mvPosition.z);
}
`, rt = `varying vec3 vColor;

void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = 1.0 - smoothstep(0.45, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha);
}
`, ct = `varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
    vPosition = position;
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`, lt = `uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

// Funzione per il rumore di Perlin 3D semplificato
float noise(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
}

void main() {
    // Base color mixing con transizioni più morbide
    vec3 baseColor = mix(
        mix(color1, color2, sin(time * 0.5 + vPosition.x * 2.0) * 0.5 + 0.5),
        mix(color3, color4, cos(time * 0.5 + vPosition.y * 2.0) * 0.5 + 0.5),
        sin(time + vPosition.z * 2.0) * 0.5 + 0.5
    );
    
    // Effetto Fresnel migliorato
    vec3 viewDirection = normalize(vViewPosition);
    float fresnelTerm = pow(1.0 - abs(dot(viewDirection, vNormal)), 3.0);
    
    // Rumore per l'effetto opale più dettagliato
    float noiseVal = noise(vPosition * 8.0 + time * 0.2); // Aumentato la frequenza
    float darkSpots = smoothstep(0.3, 0.7, noiseVal); // Allargato il range
    
    // Aggiungi riflessi scuri più profondi
    vec3 darkReflection = vec3(0.05, 0.05, 0.1) * (1.0 - darkSpots);
    
    // Aggiungi riflessi chiari più brillanti
    vec3 brightReflection = vec3(1.0, 0.98, 0.95) * fresnelTerm * noiseVal * 1.5;
    
    // Effetto iridescente potenziato
    float iridescenceStrength = 0.3; // Aumentato da 0.1 a 0.3
    vec3 iridescence = vec3(
        sin(fresnelTerm * 6.28318 + time),
        sin(fresnelTerm * 6.28318 + time + 2.0944), // 2π/3
        sin(fresnelTerm * 6.28318 + time + 4.18879) // 4π/3
    ) * iridescenceStrength;
    
    // Combina tutti gli effetti
    vec3 finalColor = baseColor;
    finalColor += brightReflection * 0.8; // Aumentato l'effetto dei riflessi chiari
    finalColor *= (1.0 - darkReflection);
    finalColor += iridescence * fresnelTerm; // Aggiunge l'iridescenza modulata dal Fresnel
    
    // Regola l'opacità per mantenere la trasparenza ai bordi
    float alpha = mix(0.2, 0.9, (1.0 - fresnelTerm * 0.7) * (1.0 - darkSpots * 0.4));
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;
function Q(l) {
  return l.toString();
}
class ht extends p.Scene {
  constructor(t, n = {}) {
    super(), this.options = n, this.clock = new p.Clock(), this.wordManager = t, this.wordMeshes = [], this.setInitialState();
  }
  setInitialState() {
    console.log("set initial state"), this.initialScale = 0, this.initialOpacity = 0;
  }
  hideAll() {
    this.wordMeshes && this.wordMeshes.length > 0 && this.wordMeshes.forEach((t) => {
      t.scale.set(0, 0, 0), t.visible = !1;
    });
  }
  // Semplifichiamo questo metodo rimuovendo la griglia
  updateWordMeshes(t) {
    this.wordMeshes = t;
  }
  update(t) {
  }
}
class dt {
  constructor(t = 2.2, n = 1, e = {}) {
    this.options = { ...z, ...e }, this.geometry = new p.IcosahedronGeometry(t, n), this.material = new p.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        noiseFrequency: { value: 0.5 },
        noiseAmplitude: { value: 0.05 },
        color1: { value: new p.Color(this.options.PROCESSING_COLORS[0]) },
        color2: { value: new p.Color(this.options.PROCESSING_COLORS[1]) },
        color3: { value: new p.Color(this.options.PROCESSING_COLORS[2]) },
        color4: { value: new p.Color(this.options.PROCESSING_COLORS[3]) }
      },
      vertexShader: `
                uniform float time;
                uniform float noiseFrequency;
                uniform float noiseAmplitude;
                
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                // Funzioni di rumore
                vec3 mod289(vec3 x) {
                    return x - floor(x * (1.0 / 289.0)) * 289.0;
                }
                
                vec4 mod289(vec4 x) {
                    return x - floor(x * (1.0 / 289.0)) * 289.0;
                }
                
                vec4 permute(vec4 x) {
                    return mod289(((x*34.0)+1.0)*x);
                }
                
                vec4 taylorInvSqrt(vec4 r) {
                    return 1.79284291400159 - 0.85373472095314 * r;
                }
                
                float snoise(vec3 v) {
                    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                    
                    vec3 i  = floor(v + dot(v, C.yyy));
                    vec3 x0 = v - i + dot(i, C.xxx);
                    
                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 i1 = min(g.xyz, l.zxy);
                    vec3 i2 = max(g.xyz, l.zxy);
                    
                    vec3 x1 = x0 - i1 + C.xxx;
                    vec3 x2 = x0 - i2 + C.yyy;
                    vec3 x3 = x0 - D.yyy;
                    
                    i = mod289(i);
                    vec4 p = permute(permute(permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                        
                    float n_ = 0.142857142857;
                    vec3 ns = n_ * D.wyz - D.xzx;
                    
                    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                    
                    vec4 x_ = floor(j * ns.z);
                    vec4 y_ = floor(j - 7.0 * x_);
                    
                    vec4 x = x_ *ns.x + ns.yyyy;
                    vec4 y = y_ *ns.x + ns.yyyy;
                    vec4 h = 1.0 - abs(x) - abs(y);
                    
                    vec4 b0 = vec4(x.xy, y.xy);
                    vec4 b1 = vec4(x.zw, y.zw);
                    
                    vec4 s0 = floor(b0)*2.0 + 1.0;
                    vec4 s1 = floor(b1)*2.0 + 1.0;
                    vec4 sh = -step(h, vec4(0.0));
                    
                    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
                    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
                    
                    vec3 p0 = vec3(a0.xy, h.x);
                    vec3 p1 = vec3(a0.zw, h.y);
                    vec3 p2 = vec3(a1.xy, h.z);
                    vec3 p3 = vec3(a1.zw, h.w);
                    
                    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
                    p0 *= norm.x;
                    p1 *= norm.y;
                    p2 *= norm.z;
                    p3 *= norm.w;
                    
                    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                    m = m * m;
                    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
                }
                
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    
                    // Usa i parametri uniformi per il noise
                    vec3 noisePos = position * noiseFrequency + time * 0.2;
                    float noiseValue = snoise(noisePos);
                    
                    // Applica il noise con l'ampiezza controllata
                    vec3 newPosition = position + normal * noiseValue * noiseAmplitude;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                }
            `,
      fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                uniform vec3 color4;
                
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    float t = (vPosition.y + 1.0) * 0.5 + sin(time * 0.2) * 0.2;
                    
                    vec3 color;
                    if (t < 0.33) {
                        color = mix(color1, color2, smoothstep(0.0, 0.33, t));
                    } else if (t < 0.66) {
                        color = mix(color2, color3, smoothstep(0.33, 0.66, t));
                    } else {
                        color = mix(color3, color4, smoothstep(0.66, 1.0, t));
                    }
                    
                    float fresnel = pow(1.0 + dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                    color = mix(color, vec3(1.0), fresnel * 0.3);
                    
                    gl_FragColor = vec4(color, 0.3);
                }
            `,
      transparent: !0,
      wireframe: !0
    }), console.log("Icosahedron vertices:", this.geometry.attributes.position.count), this.geometry.index ? console.log("Icosahedron faces:", this.geometry.index.count / 3) : console.log("Icosahedron faces:", this.geometry.attributes.position.count / 3), this.mesh = new p.Mesh(this.geometry, this.material), this.rotationSpeed = {
      x: (Math.random() - 0.5) * 1e-3,
      // 5 volte più veloce
      y: (Math.random() - 0.5) * 2e-3,
      // 10 volte più veloce
      z: (Math.random() - 0.5) * 15e-4
      // 7.5 volte più veloce
    }, this.directionChangeInterval = 3e3, this.lastDirectionChange = 0, this.accelerationFactor = {
      x: 1 + Math.random() * 0.5,
      y: 1 + Math.random() * 0.5,
      z: 1 + Math.random() * 0.5
    }, this.mesh.scale.setScalar(1);
  }
  update(t) {
    this.material.uniforms.time.value = t, t - this.lastDirectionChange > this.directionChangeInterval && (this.targetRotation = {
      x: Math.random() * Math.PI * 4,
      // Raddoppiato il range di rotazione
      y: Math.random() * Math.PI * 4,
      z: Math.random() * Math.PI * 4
    }, this.accelerationFactor = {
      x: 1 + Math.random() * 0.5,
      y: 1 + Math.random() * 0.5,
      z: 1 + Math.random() * 0.5
    }, this.lastDirectionChange = t), this.mesh.rotation.x += this.rotationSpeed.x * this.accelerationFactor.x, this.mesh.rotation.y += this.rotationSpeed.y * this.accelerationFactor.y, this.mesh.rotation.z += this.rotationSpeed.z * this.accelerationFactor.z;
  }
  dispose() {
    this.geometry && this.geometry.dispose(), this.material && this.material.dispose();
  }
}
let T;
function pt(l, t) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? (T = new it(l, t.domElement), T.enableDamping = !0, T.dampingFactor = 0.05, T.minDistance = 5, T.maxDistance = 15, T.minPolarAngle = Math.PI / 4, T.maxPolarAngle = Math.PI / 1.5, T.enablePan = !1, T.rotateSpeed = 0.5, t.domElement.style.touchAction = "none", function() {
    T.update();
  }) : null;
}
class ut {
  constructor(t, n = {}) {
    this.options = { ...z, ...n }, this.wordManager = t, this.scene = new ht(this.wordManager, this.options), this.camera = null, this.renderer = null, this.particles = null, this.innerSphere = null, this.uniforms = null, this.container = null, this.renderContainer = null, this.icosahedron = null, this.targetRotationX = 0, this.targetRotationY = 0, this.mouseX = 0, this.mouseY = 0, this.windowHalfX = 0, this.windowHalfY = 0, this.noiseUniforms = {
      noiseAmplitude: { value: this.options.NOISE.AMPLITUDE },
      noiseFrequency: { value: this.options.NOISE.FREQUENCY }
    }, this.updateControls = null;
  }
  init(t) {
    this.container = t, this.renderContainer = document.createElement("div"), this.renderContainer.style.width = "100%", this.renderContainer.style.height = "100%", this.renderContainer.style.aspectRatio = "1/1", this.container.appendChild(this.renderContainer);
    const n = this.renderContainer.getBoundingClientRect(), e = n.width, i = n.height;
    this.setupCamera(e, i), this.setupRenderer(e, i), this.setupMouseControls(), this.setupParticles(), this.setupInnerSphere(), this.setupIcosahedron(), this.updateControls = pt(this.camera, this.renderer), this.setVisibility(!1), this.scene.scale.setScalar(0), this.renderContainer.appendChild(this.renderer.domElement);
  }
  setupCamera(t, n) {
    this.camera = new p.PerspectiveCamera(75, 1, 0.1, 1e3), this.camera.position.z = 5, this.windowHalfX = t / 2, this.windowHalfY = n / 2;
  }
  setupRenderer(t, n) {
    this.renderer = new p.WebGLRenderer({
      alpha: !0,
      antialias: !0
    }), this.renderer.setSize(t, n), this.renderer.setClearColor(0, 0), this.renderer.setPixelRatio(window.devicePixelRatio);
  }
  setupMouseControls() {
    document.addEventListener("mousemove", this.onMouseMove.bind(this)), document.addEventListener("mouseleave", this.onMouseLeave.bind(this));
  }
  onMouseMove(t) {
    const n = window.innerWidth / 2, e = window.innerHeight / 2;
    this.mouseX = (t.clientX - n) / n, this.mouseY = (t.clientY - e) / e, this.targetRotationY = this.mouseX * Math.PI, this.targetRotationX = this.mouseY * Math.PI / 2;
    const i = Math.sqrt(this.mouseX * this.mouseX + this.mouseY * this.mouseY);
    if (i < 1) {
      const s = Math.pow(1 - i, 3);
      this.uniforms.noiseFrequency.value = this.options.NOISE.FREQUENCY + (4 - this.options.NOISE.FREQUENCY) * s, this.uniforms.noiseAmplitude.value = this.options.NOISE.AMPLITUDE + (0.8 - this.options.NOISE.AMPLITUDE) * s, this.icosahedron && this.icosahedron.material.uniforms && (this.icosahedron.material.uniforms.noiseFrequency.value = this.options.NOISE.FREQUENCY / 2 + (2 - this.options.NOISE.FREQUENCY / 2) * s, this.icosahedron.material.uniforms.noiseAmplitude.value = this.options.NOISE.AMPLITUDE / 2 + (0.2 - this.options.NOISE.AMPLITUDE / 2) * s);
    } else
      this.uniforms.noiseFrequency.value = this.options.NOISE.FREQUENCY, this.uniforms.noiseAmplitude.value = this.options.NOISE.AMPLITUDE, this.icosahedron && this.icosahedron.material.uniforms && (this.icosahedron.material.uniforms.noiseFrequency.value = this.options.NOISE.FREQUENCY / 2, this.icosahedron.material.uniforms.noiseAmplitude.value = this.options.NOISE.AMPLITUDE / 2);
  }
  onMouseLeave() {
    const n = this.scene.rotation.x, e = this.scene.rotation.y, i = performance.now(), s = (h) => {
      const r = h - i, u = Math.min(r / 1e3, 1), v = ((d) => d * (2 - d))(u);
      this.scene.rotation.x = n * (1 - v), this.scene.rotation.y = e * (1 - v), u < 1 && requestAnimationFrame(s);
    };
    requestAnimationFrame(s);
  }
  updateRotation() {
    const n = this.targetRotationX - this.scene.rotation.x, e = this.targetRotationY - this.scene.rotation.y;
    this.scene.rotation.x += n * 0.3, this.scene.rotation.y += e * 0.3;
  }
  setupParticles() {
    const t = new p.SphereGeometry(this.options.SPHERE_RADIUS, 64, 64);
    t.attributes.position.array, t.attributes.normal.array;
    const n = new Float32Array(this.options.PARTICLE_COUNT * 3), e = new Float32Array(this.options.PARTICLE_COUNT * 3), i = new Float32Array(this.options.PARTICLE_COUNT * 3), s = new p.Color(this.options.PROCESSING_COLORS[0]), h = new p.Color(this.options.PROCESSING_COLORS[1]), r = new p.Color(this.options.PROCESSING_COLORS[2]), u = new p.Color(this.options.PROCESSING_COLORS[3]);
    for (let d = 0; d < this.options.PARTICLE_COUNT; d++) {
      const S = Math.random(), M = Math.random(), x = 2 * Math.PI * S, m = Math.acos(2 * M - 1), g = this.options.SPHERE_RADIUS * Math.sin(m) * Math.cos(x), w = this.options.SPHERE_RADIUS * Math.sin(m) * Math.sin(x), A = this.options.SPHERE_RADIUS * Math.cos(m);
      e[d * 3] = g, e[d * 3 + 1] = w, e[d * 3 + 2] = A;
      const R = new p.Vector3(g, w, A).normalize();
      i[d * 3] = R.x, i[d * 3 + 1] = R.y, i[d * 3 + 2] = R.z;
      const D = new p.Color().lerpColors(
        s.clone().lerp(h, (g + this.options.SPHERE_RADIUS) / (2 * this.options.SPHERE_RADIUS)),
        r.clone().lerp(u, (w + this.options.SPHERE_RADIUS) / (2 * this.options.SPHERE_RADIUS)),
        (A + this.options.SPHERE_RADIUS) / (2 * this.options.SPHERE_RADIUS)
      );
      n[d * 3] = D.r, n[d * 3 + 1] = D.g, n[d * 3 + 2] = D.b;
    }
    const c = new p.BufferGeometry();
    c.setAttribute("position", new p.Float32BufferAttribute(e, 3)), c.setAttribute("normal", new p.Float32BufferAttribute(i, 3)), c.setAttribute("color", new p.Float32BufferAttribute(n, 3)), this.uniforms = {
      time: { value: 1 },
      noiseAmplitude: { value: this.options.NOISE.AMPLITUDE },
      noiseFrequency: { value: this.options.NOISE.FREQUENCY },
      pulseTime: { value: 0 },
      particleSize: { value: this.options.PARTICLE_SIZE }
    };
    const v = new p.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: Q(at),
      fragmentShader: Q(rt),
      transparent: !0,
      vertexColors: !0
    });
    this.particles = new p.Points(c, v), this.scene.add(this.particles);
  }
  setupInnerSphere() {
    const t = new p.SphereGeometry(0.8, 64, 64), n = new p.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new p.Color(this.options.PROCESSING_COLORS[0]) },
        color2: { value: new p.Color(this.options.PROCESSING_COLORS[1]) },
        color3: { value: new p.Color(this.options.PROCESSING_COLORS[2]) },
        color4: { value: new p.Color(this.options.PROCESSING_COLORS[3]) }
      },
      vertexShader: Q(ct),
      fragmentShader: Q(lt),
      transparent: !0,
      blending: p.AdditiveBlending,
      side: p.DoubleSide
    });
    this.innerSphere = new p.Mesh(t, n), this.scene.add(this.innerSphere);
  }
  setupIcosahedron() {
    this.icosahedron = new dt(2.2, 1, this.options), this.scene.add(this.icosahedron.mesh);
  }
  updateParticlesScale(t) {
    const n = this.particles.geometry.attributes.position.array;
    for (let e = 0; e < n.length; e += 3) {
      const i = new p.Vector3(
        n[e],
        n[e + 1],
        n[e + 2]
      ).normalize(), s = t * this.options.SPHERE_RADIUS;
      n[e] = i.x * s, n[e + 1] = i.y * s, n[e + 2] = i.z * s;
    }
    this.particles.geometry.attributes.position.needsUpdate = !0;
  }
  updateInnerSphereScale(t) {
    this.innerSphere.scale.setScalar(t), this.innerSphere.material.opacity = t;
  }
  updatePulsation(t) {
    this.uniforms.time.value = t, this.uniforms.pulseTime.value = t * this.options.PULSE_SPEED, this.innerSphere.material.uniforms.time.value = t * this.options.PULSE_SPEED;
    const n = 1 + Math.sin(t * this.options.PULSE_SPEED) * this.options.PULSE_AMPLITUDE;
    this.innerSphere.scale.setScalar(n), this.icosahedron && this.icosahedron.update(t);
  }
  onResize(t, n) {
    const e = Math.min(t, n);
    this.windowHalfX = e / 2, this.windowHalfY = e / 2, this.camera.aspect = 1, this.camera.updateProjectionMatrix(), this.renderer.setSize(e, e);
  }
  render() {
    this.updateControls ? this.updateControls() : this.updateRotation(), this.renderer.render(this.scene, this.camera);
  }
  dispose() {
    this.particles.geometry.dispose(), this.particles.material.dispose(), this.innerSphere.geometry.dispose(), this.innerSphere.material.dispose(), this.scene.remove(this.particles), this.scene.remove(this.innerSphere), this.icosahedron && (this.icosahedron.dispose(), this.scene.remove(this.icosahedron.mesh)), this.renderContainer && this.renderContainer.parentNode && this.renderContainer.parentNode.removeChild(this.renderContainer), this.renderContainer = null, this.container = null, document.removeEventListener("mousemove", this.onMouseMove), document.removeEventListener("mouseleave", this.onMouseLeave);
  }
  setVisibility(t) {
    this.particles && (this.particles.visible = t), this.innerSphere && (this.innerSphere.visible = t), this.scene.wordMeshes && this.scene.wordMeshes.forEach((n) => n.visible = t), this.icosahedron && (this.icosahedron.mesh.visible = t);
  }
}
const ie = 1.70158, Te = ie + 1;
function mt(l) {
  return 1 + Te * Math.pow(l - 1, 3) + ie * Math.pow(l - 1, 2);
}
function ft(l) {
  return Te * l * l * l - ie * l * l;
}
class gt {
  constructor(t = {}) {
    this.options = t, this.isSceneEntering = !1, this.isSceneExiting = !1, this.sceneAnimationProgress = 0, this.sceneManager = null, this.wordManager = null;
  }
  init(t, n) {
    this.sceneManager = t, this.wordManager = n;
  }
  update() {
    const t = performance.now() * 1e-3;
    (this.isSceneEntering || this.isSceneExiting) && this.updateSceneAnimation(), this.sceneManager.updatePulsation(t), this.wordManager.updateWords(t);
  }
  updateSceneAnimation() {
    if (this.sceneAnimationProgress += 0.016 / this.options.SCENE_ANIMATION_DURATION, this.sceneAnimationProgress >= 1) {
      this.isSceneExiting ? (this.sceneManager.setVisibility(!1), this.sceneManager.scene.scale.setScalar(0)) : this.sceneManager.scene.scale.setScalar(1), this.isSceneEntering = !1, this.isSceneExiting = !1;
      return;
    }
    const t = this.isSceneEntering ? mt(this.sceneAnimationProgress) : 1 - ft(this.sceneAnimationProgress);
    this.sceneManager.scene.scale.setScalar(t), this.wordManager && this.wordManager.updateWordsAnimation(t, this.isSceneEntering);
  }
  startEnterAnimation() {
    this.isSceneEntering = !0, this.isSceneExiting = !1, this.sceneAnimationProgress = 0, this.sceneManager.setVisibility(!0), this.sceneManager.scene.scale.setScalar(0), this.wordManager && this.wordManager.isInitialized() && this.wordManager.createTextSphere();
  }
  startExitAnimation() {
    this.isSceneExiting = !0, this.isSceneEntering = !1, this.sceneAnimationProgress = 0;
  }
  dispose() {
    this.sceneManager = null, this.wordManager = null;
  }
}
class vt extends Je {
  constructor(t) {
    super(t);
  }
  load(t, n, e, i) {
    const s = this, h = new et(this.manager);
    h.setPath(this.path), h.setRequestHeader(this.requestHeader), h.setWithCredentials(this.withCredentials), h.load(t, function(r) {
      const u = s.parse(JSON.parse(r));
      n && n(u);
    }, e, i);
  }
  parse(t) {
    return new yt(t);
  }
}
class yt {
  constructor(t) {
    this.isFont = !0, this.type = "Font", this.data = t;
  }
  generateShapes(t, n = 100) {
    const e = [], i = Et(t, n, this.data);
    for (let s = 0, h = i.length; s < h; s++)
      e.push(...i[s].toShapes());
    return e;
  }
}
function Et(l, t, n) {
  const e = Array.from(l), i = t / n.resolution, s = (n.boundingBox.yMax - n.boundingBox.yMin + n.underlineThickness) * i, h = [];
  let r = 0, u = 0;
  for (let c = 0; c < e.length; c++) {
    const v = e[c];
    if (v === `
`)
      r = 0, u -= s;
    else {
      const d = St(v, i, r, u, n);
      r += d.offsetX, h.push(d.path);
    }
  }
  return h;
}
function St(l, t, n, e, i) {
  const s = i.glyphs[l] || i.glyphs["?"];
  if (!s) {
    console.error('THREE.Font: character "' + l + '" does not exists in font family ' + i.familyName + ".");
    return;
  }
  const h = new tt();
  let r, u, c, v, d, S, M, x;
  if (s.o) {
    const m = s._cachedOutline || (s._cachedOutline = s.o.split(" "));
    for (let g = 0, w = m.length; g < w; )
      switch (m[g++]) {
        case "m":
          r = m[g++] * t + n, u = m[g++] * t + e, h.moveTo(r, u);
          break;
        case "l":
          r = m[g++] * t + n, u = m[g++] * t + e, h.lineTo(r, u);
          break;
        case "q":
          c = m[g++] * t + n, v = m[g++] * t + e, d = m[g++] * t + n, S = m[g++] * t + e, h.quadraticCurveTo(d, S, c, v);
          break;
        case "b":
          c = m[g++] * t + n, v = m[g++] * t + e, d = m[g++] * t + n, S = m[g++] * t + e, M = m[g++] * t + n, x = m[g++] * t + e, h.bezierCurveTo(d, S, M, x, c, v);
          break;
      }
  }
  return { offsetX: s.ha * t, path: h };
}
class Mt extends ot {
  constructor(t, n = {}) {
    const e = n.font;
    if (e === void 0)
      super();
    else {
      const i = e.generateShapes(t, n.size);
      n.depth = n.height !== void 0 ? n.height : 50, n.bevelThickness === void 0 && (n.bevelThickness = 10), n.bevelSize === void 0 && (n.bevelSize = 8), n.bevelEnabled === void 0 && (n.bevelEnabled = !1), super(i, n);
    }
    this.type = "TextGeometry";
  }
}
class xt {
  constructor(t, n = {}) {
    if (!t)
      throw new Error("TextManager is required");
    this.textManager = t, this.options = { ...z, ...n }, this.text = "", this.scene = null, this.wordMeshes = [], this.wordStates = /* @__PURE__ */ new Map(), this.activeWords = /* @__PURE__ */ new Set(), this.font = null, this.MAX_ACTIVE_WORDS = this.options.MAX_ACTIVE_WORDS, this.PROCESSING_COLORS = this.options.PROCESSING_COLORS, this.WORD_ANIMATION = this.options.WORD_ANIMATION, this._isInitialized = !1, this.words = [], this.activeWords = [], this.currentIndex = 0, this.isAnimating = !1, this.delayBetweenWords = this.options.WORD_DELAY;
  }
  init(t) {
    return console.log("WordManager init"), this.scene = t, this.loadFont().then(() => {
      console.log("Font loaded"), this._isInitialized = !0;
    });
  }
  isInitialized() {
    return this._isInitialized;
  }
  getWords() {
    return console.log("WordManager getting words"), this.textManager.getText();
  }
  async loadFont() {
    const t = new vt();
    return new Promise((n) => {
      t.load(
        "https://threejs.org/examples/fonts/droid/droid_sans_mono_regular.typeface.json",
        (e) => {
          this.font = e, n();
        }
      );
    });
  }
  update(t) {
    this.wordMeshes && this.wordMeshes.length > 0 && this.updateWords(t);
  }
  updateWords(t) {
    this.activeWords.size < this.MAX_ACTIVE_WORDS && this.wordMeshes.forEach((n) => {
      !this.wordStates.get(n).active && Math.random() < 0.01 && this.activateWord(n);
    }), this.activeWords.forEach((n) => {
      const e = this.wordStates.get(n);
      e.active && this.updateWordAnimation(n, e, t);
    });
  }
  updateWordAnimation(t, n, e) {
    const i = this.WORD_ANIMATION.MOVE_OUT_DURATION + this.WORD_ANIMATION.SURFACE_DURATION + this.WORD_ANIMATION.MOVE_IN_DURATION;
    n.progress += 0.016;
    const s = n.progress;
    if (s >= i) {
      this.deactivateWord(t, n);
      return;
    }
    if (s < this.WORD_ANIMATION.MOVE_OUT_DURATION) {
      const h = s / this.WORD_ANIMATION.MOVE_OUT_DURATION, r = this.easeOutBack(h), u = this.options.TEXT_MIN_RADIUS + (this.options.TEXT_SPHERE_RADIUS - this.options.TEXT_MIN_RADIUS) * r;
      t.position.setFromSphericalCoords(
        u,
        n.originalPosition.theta,
        n.originalPosition.phi
      ), t.scale.setScalar(r);
      const c = Math.floor(n.letters.length * 0.3);
      n.letters.forEach((v, d) => {
        d < c ? v.material.opacity = r * 0.5 : v.material.opacity = 0;
      });
    } else if (s < this.WORD_ANIMATION.MOVE_OUT_DURATION + this.WORD_ANIMATION.SURFACE_DURATION) {
      const h = (s - this.WORD_ANIMATION.MOVE_OUT_DURATION) / this.WORD_ANIMATION.SURFACE_DURATION, r = Math.floor(h * n.letters.length);
      n.letters.forEach((u, c) => {
        c <= r ? u.material.opacity = 0.75 : u.material.opacity = 0;
      });
    } else {
      const h = (s - (this.WORD_ANIMATION.MOVE_OUT_DURATION + this.WORD_ANIMATION.SURFACE_DURATION)) / this.WORD_ANIMATION.MOVE_IN_DURATION, r = this.easeInBack(h), u = this.options.TEXT_SPHERE_RADIUS - (this.options.TEXT_SPHERE_RADIUS - this.options.TEXT_MIN_RADIUS) * r;
      t.position.setFromSphericalCoords(
        u,
        n.originalPosition.theta,
        n.originalPosition.phi
      ), n.letters.forEach((c) => {
        c.material.opacity = 0.5 * (1 - r);
      });
    }
    t.lookAt(0, 0, 0), t.rotateY(Math.PI);
  }
  activateWord(t) {
    const n = this.wordStates.get(t);
    n.active = !0, n.progress = 0, t.position.setFromSphericalCoords(
      this.options.TEXT_MIN_RADIUS,
      n.originalPosition.theta,
      n.originalPosition.phi
    ), t.scale.set(0, 0, 0), this.activeWords.add(t);
  }
  deactivateWord(t, n) {
    n.active = !1, n.progress = 0, this.activeWords.delete(t), n.letters.forEach((e) => {
      e.material.opacity = 0;
    }), t.position.setFromSphericalCoords(
      this.options.TEXT_MIN_RADIUS,
      n.originalPosition.theta,
      n.originalPosition.phi
    ), t.scale.set(0, 0, 0);
  }
  easeOutBack(t) {
    return 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);
  }
  easeInBack(t) {
    return 2.70158 * t * t * t - 1.70158 * t * t;
  }
  updateText(t) {
    console.log("Updating text:", t), this.text = t, this.wordMeshes && this.wordMeshes.length > 0 && this.wordMeshes.forEach((n) => {
      this.scene && this.scene.remove(n), n.geometry && n.geometry.dispose(), n.material && (Array.isArray(n.material) ? n.material.forEach((e) => e.dispose()) : n.material.dispose());
    }), this.wordMeshes = [], this.wordStates.clear(), this.activeWords = /* @__PURE__ */ new Set(), this._isInitialized && this.scene && this.createTextSphere();
  }
  createTextSphere() {
    let t = this.text.split(" ").filter((i) => i.length > 4).map((i) => i.trim()).filter((i) => i);
    t.length === 0 && (t = this.textManager.getText());
    const n = 200, e = [];
    for (; e.length < n; ) {
      const i = n - e.length, s = t.slice(0, Math.min(t.length, i));
      e.push(...s);
    }
    this.shuffleArray(e), this.words = [], e.forEach((i, s) => {
      try {
        const h = i.split(""), r = [];
        let u = 0;
        const c = new p.Group(), v = new p.Color(
          this.options.PROCESSING_COLORS[Math.floor(Math.random() * this.options.PROCESSING_COLORS.length)]
        );
        h.forEach((S) => {
          const M = new Mt(S, {
            font: this.font,
            size: 0.3,
            height: 0.01
          }), x = new p.MeshBasicMaterial({
            color: v,
            // Usa il colore random
            transparent: !0,
            opacity: 0
          }), m = new p.Mesh(M, x);
          M.computeBoundingBox();
          const g = M.boundingBox.max.x - M.boundingBox.min.x;
          m.position.x = u, u += g * 1.1, r.push(m), c.add(m);
        }), c.children.forEach((S) => {
          S.position.x -= u / 2;
        });
        const d = this.getRandomSpherePosition();
        c.position.setFromSphericalCoords(
          this.options.TEXT_MIN_RADIUS,
          d.theta,
          d.phi
        ), c.lookAt(0, 0, 0), c.rotateY(Math.PI), this.wordStates.set(c, {
          active: !1,
          progress: 0,
          letters: r,
          originalPosition: d,
          hasCreatedLine: !1,
          isOnSurface: !1
        }), this.wordMeshes.push(c), this.words.push(c), this.scene && this.scene.add(c);
      } catch (h) {
        console.warn(`Failed to create word mesh for "${i}"`, h);
      }
    }), this.scene && this.scene.updateWordMeshes(this.wordMeshes), this.currentIndex = 0, this.isAnimating = !1, this.startWordAnimation();
  }
  shuffleArray(t) {
    for (let n = t.length - 1; n > 0; n--) {
      const e = Math.floor(Math.random() * (n + 1));
      [t[n], t[e]] = [t[e], t[n]];
    }
    return t;
  }
  getRandomSpherePosition() {
    const t = (1 + Math.sqrt(5)) / 2, n = this.wordMeshes.length, e = 200, i = 2 * Math.PI * n / t, s = Math.acos(1 - 2 * (n + 0.5) / e), h = 0.1, r = (Math.random() - 0.5) * h, u = (Math.random() - 0.5) * h, c = (i + r) % (2 * Math.PI), v = Math.max(0.1, Math.min(Math.PI - 0.1, s + u)), d = Math.random() * Math.PI * 2;
    return {
      theta: c + d,
      phi: v
    };
  }
  updateWordsAnimation(t, n) {
    if (!(!this.wordMeshes || this.wordMeshes.length === 0)) {
      if (n && t > 0.5 && this.activeWords.size === 0) {
        const e = Math.floor(this.MAX_ACTIVE_WORDS * 0.5);
        let i = 0;
        this.wordMeshes.forEach((s) => {
          i < e && Math.random() < 0.5 && (this.activateWord(s), i++);
        });
      }
      !n && t < 0.5 && this.activeWords.forEach((e) => {
        const i = this.wordStates.get(e);
        i && this.deactivateWord(e, i);
      }), this.wordMeshes.forEach((e) => {
        if (!this.activeWords.has(e)) {
          e.visible = n, e.scale.setScalar(0);
          const i = this.wordStates.get(e);
          i && i.letters.forEach((s) => {
            s.material.opacity = 0;
          });
        }
      });
    }
  }
  processText(t) {
  }
  activateNextWordGroup() {
    if (this.currentIndex >= this.words.length || this.isAnimating)
      return !1;
    this.isAnimating = !0;
    const t = this.words[this.currentIndex];
    this.activeWords.add(t);
    const n = t.position.y;
    let e = [t], i = this.currentIndex + 1;
    for (; i < this.words.length && Math.abs(this.words[i].position.y - n) < 0.1; )
      e.push(this.words[i]), this.activeWords.add(this.words[i]), i++;
    return e.forEach((s, h) => {
      setTimeout(() => {
        this.activateWord(s), h === e.length - 1 && (this.isAnimating = !1);
      }, h * this.options.WORD_DELAY);
    }), this.currentIndex = i, !0;
  }
  dispose() {
    this.wordMeshes && this.wordMeshes.forEach((t) => {
      this.scene && this.scene.remove(t), t.geometry && t.geometry.dispose(), t.material && (Array.isArray(t.material) ? t.material.forEach((n) => n.dispose()) : t.material.dispose());
    });
  }
  // Nuovo metodo per avviare l'animazione sequenziale
  startWordAnimation() {
    const t = () => {
      this.activateNextWordGroup() && setTimeout(t, this.options.WORD_DELAY);
    };
    t();
  }
}
class Pt {
  constructor(t = {}) {
    this.options = { ...z, ...t }, this.placeholderText = [
      "Three.js",
      "WebGL",
      "Creative",
      "Development",
      "Interactive",
      "Experience",
      "Digital",
      "Art"
    ];
  }
  getText() {
    console.log("TextManager getText called");
    const t = document.querySelector(".content-text");
    if (console.log("Content text element:", t), t && t.textContent.trim()) {
      const n = t.textContent.trim().split(/\s+/).filter((e) => e.length > 3).slice(0, 8);
      if (console.log("Found words:", n), n.length >= 4)
        return n;
    }
    return console.log("Using placeholder"), this.placeholderText;
  }
}
class Ot {
  constructor(t = {}) {
    xe(this, "animate", () => {
      requestAnimationFrame(this.animate), this.animationManager.update(), this.sceneManager.render();
    });
    console.log("AiAnimation constructor started", t);
    const { containerId: n = "ai_animation", options: e = {}, onInitialized: i } = t;
    if (this.container = document.getElementById(n), !this.container)
      throw new Error(`Container element with id "${n}" not found`);
    console.log("Container found:", this.container), this.options = st(e), this.onInitialized = i, console.log("Options initialized:", this.options), this.textManager = new Pt(this.options), this.wordManager = new xt(this.textManager, this.options), this.sceneManager = new ut(this.wordManager, this.options), this.animationManager = new gt(this.options), console.log("Managers created"), this.init();
  }
  async init() {
    console.log("Starting initialization...");
    try {
      console.log("Initializing scene..."), this.sceneManager.init(this.container), console.log("Scene initialized"), console.log("Initializing word manager..."), await this.wordManager.init(this.sceneManager.scene), console.log("Word manager initialized"), console.log("Initializing animation manager..."), this.animationManager.init(this.sceneManager, this.wordManager), console.log("Animation manager initialized"), this.animate(), console.log("Animation loop started"), this.onInitialized && (console.log("Calling onInitialized callback"), this.onInitialized());
    } catch (t) {
      throw console.error("Initialization error:", t), t;
    }
  }
  startAnimation(t) {
    if (console.log("Starting animation with text:", t), !t || typeof t != "string")
      throw new Error("Text parameter is required and must be a string");
    this.wordManager.updateText(t), this.animationManager.startEnterAnimation();
  }
  stopAnimation() {
    console.log("Stopping animation"), this.animationManager.startExitAnimation();
  }
  dispose() {
    this.sceneManager.dispose(), this.animationManager.dispose(), this.wordManager.dispose();
  }
}
export {
  Ot as AiAnimation,
  Ot as default
};
