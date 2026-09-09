"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Windows hero wallpaper: the Bloom — one wide cobalt satin ribbon wrapped
 * in nested layers around a leaning axis, every top edge rolling over so
 * the rims catch the light and the creases fall into navy.
 *
 * Geometry: nine wraps, each a parametric sheet (angle × height) whose
 * cross-section is a cubic that flares at the base, leans in, then curls
 * out and over at the rim. Outer wraps are lower, open arcs whose free
 * ends taper and curl harder, so layered folds show from every side.
 * Shading: vertex colours bake occlusion (deep in the folds, bright on
 * the rolled rims), a physical material with sheen + a soft clearcoat
 * takes a room environment, and the key light casts real shadows into
 * the creases.
 *
 * Interaction: the bloom can be grabbed. Pointer events are read on the
 * window (the hero text sits above the canvas), a raycast against a
 * hidden proxy decides whether the pointer is on the ribbon, and
 * interactive elements are never hijacked. Drag spins it with inertia
 * and a little tilt that springs back; released, it resumes its slow
 * turn. Pauses off-screen and when the tab is hidden.
 */

const NO_GRAB =
  "a, button, [role=button], input, select, textarea, summary, label, nav, header, footer, .win, [data-no-grab]";

/* Wraps, inner to outer: radius, rim height, span (turns), start (turns), curl, phase. */
const WRAPS: Array<[number, number, number, number, number, number]> = [
  [0.4, 4.1, 1.0, 0.0, 0.5, 0.0],
  [0.63, 3.96, 1.0, 0.32, 0.6, 1.3],
  [0.87, 3.74, 1.0, 0.61, 0.72, 2.7],
  [1.11, 3.46, 0.97, 0.14, 0.84, 4.0],
  [1.36, 3.16, 0.92, 0.5, 0.94, 5.3],
  [1.61, 2.86, 0.86, 0.83, 1.02, 0.8],
  [1.87, 2.56, 0.78, 0.26, 1.08, 2.2],
  [2.13, 2.26, 0.7, 0.6, 1.14, 3.6],
  [2.39, 1.96, 0.6, 0.93, 1.2, 5.0],
];

const REST_X = -0.08;
const REST_Y = 0.35;
const REST_Z = 0.14;
const IDLE_SPIN = 0.045; // rad/s
const DRAG = 0.0075; // rad/px

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

function smooth(a: number, b: number, x: number) {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

type P2 = [number, number];
function bez(t: number, p0: P2, p1: P2, p2: P2, p3: P2): P2 {
  const s = 1 - t;
  const a = s * s * s;
  const b = 3 * s * s * t;
  const c = 3 * s * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
}

function buildBloom() {
  const U = 144;
  const V = 24;
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const deep = new THREE.Color("#071f6e");
  const base = new THREE.Color("#1c5af0");
  const bright = new THREE.Color("#3f7dff");
  const c = new THREE.Color();
  let off = 0;

  WRAPS.forEach(([r, top, span, start, curl, phase], i) => {
    const depth = i / (WRAPS.length - 1);
    const partial = span < 0.98;
    const cx = 0.035 * i * Math.cos(i * 1.1);
    const cz = 0.035 * i * Math.sin(i * 1.1);

    for (let iu = 0; iu <= U; iu++) {
      const u = iu / U;
      const th = (start + u * span) * Math.PI * 2;
      // Free ends of the open wraps thin out and roll harder.
      const fade = partial ? smooth(0, 0.16, u) * smooth(0, 0.16, 1 - u) : 1;
      const rim = top * (1 + 0.045 * Math.sin(2.1 * th + phase)) * (0.62 + 0.38 * fade);
      const rad0 = r + 0.035 * Math.sin(3 * th + phase * 1.7);
      const k = curl * (0.8 + 0.2 * Math.sin(1.4 * th + phase)) * (1 + 0.4 * (1 - fade));

      for (let iv = 0; iv <= V; iv++) {
        const v = iv / V;
        // Cross-section: flare at the base, lean in, roll out and drape over the rim.
        const [rho, h] = bez(v, [0.1, -0.05], [-0.05, 0.46], [0.06 + 0.16 * k, 1.04], [0.36 * k, 0.78 - 0.2 * k]);
        const rad = rad0 + rho;
        pos.push(cx + rad * Math.cos(th), h * rim - 0.05 * i, cz + rad * Math.sin(th));

        // Baked occlusion: deep low and inside, bright on the fold.
        const ao = smooth(0, 0.72, v) * (0.78 + 0.22 * depth);
        c.copy(deep).lerp(base, ao);
        if (v > 0.8) c.lerp(bright, ((v - 0.8) / 0.2) * 0.35);
        col.push(c.r, c.g, c.b);
      }
    }

    for (let iu = 0; iu < U; iu++) {
      for (let iv = 0; iv < V; iv++) {
        const a = off + iu * (V + 1) + iv;
        const b = a + V + 1;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
    off += (U + 1) * (V + 1);
  });

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export default function Bloom({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    el.appendChild(canvas);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    pmrem.dispose();
    room.dispose();

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
    camera.position.set(0.5, 2.7, 9.8);
    camera.lookAt(0.2, 1.55, 0);

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      vertexColors: true,
      roughness: 0.5,
      metalness: 0,
      sheen: 0.35,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color(0x3d7bff),
      clearcoat: 0.12,
      clearcoatRoughness: 0.45,
      envMapIntensity: 0.3,
      side: THREE.DoubleSide,
    });

    const geometry = buildBloom();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const group = new THREE.Group();
    group.add(mesh);
    group.position.set(0, 0, 0);
    scene.add(group);

    // Hover proxy: what "on the ribbon" means for the pointer.
    const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(2.6, 1.8, 6, 16), new THREE.MeshBasicMaterial());
    proxy.position.set(0, 2.1, 0);
    proxy.visible = false;
    group.add(proxy);

    scene.add(new THREE.HemisphereLight(0xdfe9f8, 0x2d4a86, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(-4, 8.5, 5.5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    const sc = key.shadow.camera;
    sc.left = sc.bottom = -4.2;
    sc.right = sc.top = 4.2;
    sc.near = 2;
    sc.far = 24;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.04;
    key.target.position.set(0, 1.55, 0);
    scene.add(key, key.target);
    const fill = new THREE.DirectionalLight(0xc7dbff, 0.45);
    fill.position.set(5, 2, 4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x8db6ff, 0.9);
    rim.position.set(2.5, 3.5, -5);
    scene.add(rim);

    // Motion state.
    let raf = 0;
    let running = false;
    let visible = true;
    let last = performance.now();
    let rotY = REST_Y;
    let velY = 0;
    let tiltX = 0;
    let parX = 0;
    let parY = 0;
    let mx = 0;
    let my = 0;

    // Pointer state.
    let dragging = false;
    let over = false;
    let blocked = false;
    let moved = false;
    let px = -1;
    let py = -1;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;

    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hit = () => {
      const r = canvas.getBoundingClientRect();
      if (px < r.left || px > r.right || py < r.top || py > r.bottom) return false;
      ndc.set(((px - r.left) / r.width) * 2 - 1, -((py - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      return ray.intersectObject(proxy, false).length > 0;
    };
    const setCursor = (c: string) => {
      if (document.body.style.cursor !== c) document.body.style.cursor = c;
    };

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();

    const frame = (now: number) => {
      raf = 0;
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (moved && !dragging) {
        moved = false;
        const o = !blocked && hit();
        if (o !== over) {
          over = o;
          setCursor(over ? "grab" : "");
        }
      }

      if (!dragging) {
        velY *= Math.exp(-2.4 * dt);
        rotY += (IDLE_SPIN + velY) * dt;
        const k = 1 - Math.exp(-4 * dt);
        tiltX += (0 - tiltX) * k;
        parX += (mx - parX) * 0.04;
        parY += (my - parY) * 0.04;
      }

      group.rotation.set(REST_X + tiltX + parY * 0.04, rotY, REST_Z + parX * 0.05);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (over && !dragging) {
        over = false;
        setCursor("");
      }
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      moved = true;
      blocked = e.target instanceof Element && !!e.target.closest(NO_GRAB);
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dts = Math.max(1, e.timeStamp - lastT) / 1000;
      rotY += dx * DRAG;
      velY = velY * 0.5 + ((dx * DRAG) / dts) * 0.5;
      tiltX = clamp(tiltX + dy * DRAG * 0.5, -0.32, 0.32);
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || !running) return;
      px = e.clientX;
      py = e.clientY;
      blocked = e.target instanceof Element && !!e.target.closest(NO_GRAB);
      if (blocked || !hit()) return;
      e.preventDefault();
      dragging = true;
      over = true;
      velY = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      setCursor("grabbing");
      document.body.style.userSelect = "none";
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.userSelect = "";
      velY = clamp(velY, -6, 6);
      over = running && !blocked && hit();
      setCursor(over ? "grab" : "");
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    const onVis = () => (document.hidden ? stop() : start());
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onUp);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp);
      setCursor("");
      document.body.style.userSelect = "";
      geometry.dispose();
      proxy.geometry.dispose();
      (proxy.material as THREE.Material).dispose();
      material.dispose();
      env.dispose();
      renderer.dispose();
      el.removeChild(canvas);
    };
  }, []);

  return <div ref={host} aria-hidden className={className} />;
}
