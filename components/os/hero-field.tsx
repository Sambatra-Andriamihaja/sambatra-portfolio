"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A quiet field of points behind the hero — the canvas every scenario is
 * drawn on. All motion lives in the vertex shader (one uniform per frame),
 * so the CPU cost is a single draw call. Pauses when scrolled away or when
 * the tab is hidden; recolours when the OS theme flips.
 */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uDpr;
  varying float vA;
  void main() {
    vec3 p = position;
    float w = sin(p.x * 0.45 + uTime * 0.35) * cos(p.y * 0.55 - uTime * 0.25);
    p.z += w * 0.9;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.6 + (w + 1.0) * 0.9) * uDpr * (9.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vA = 0.18 + 0.45 * (w + 1.0) * 0.5;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float m = 1.0 - smoothstep(0.35, 0.5, d);
    gl_FragColor = vec4(uColor, m * vA * uOpacity);
  }
`;

function accent(): THREE.Color {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--c-accent").trim();
  const [r, g, b] = raw.split(/\s+/).map((n) => Number(n) / 255);
  return new THREE.Color(r || 0.9, g || 0.33, b || 0.13);
}

export default function HeroField({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 1.6, 15);
    camera.lookAt(0, 0, 0);

    const cols = 110;
    const rows = 56;
    const pos = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        pos[i++] = (x / (cols - 1) - 0.5) * 34;
        pos[i++] = (y / (rows - 1) - 0.5) * 16;
        pos[i++] = 0;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const light = document.documentElement.classList.contains("light");
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uDpr: { value: dpr },
        uColor: { value: accent() },
        uOpacity: { value: light ? 0.55 : 0.7 },
      },
    });
    const points = new THREE.Points(geo, mat);
    points.rotation.x = -0.9;
    points.position.y = -2.2;
    scene.add(points);

    let raf = 0;
    let running = false;
    let visible = true;
    let t0 = performance.now();
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;

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
      mat.uniforms.uTime.value = (now - t0) / 1000;
      mx += (tx - mx) * 0.04;
      my += (ty - my) * 0.04;
      points.rotation.z = mx * 0.05;
      points.rotation.x = -0.9 + my * 0.04;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      t0 = performance.now() - mat.uniforms.uTime.value * 1000;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
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
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const mo = new MutationObserver(() => {
      mat.uniforms.uColor.value = accent();
      mat.uniforms.uOpacity.value = document.documentElement.classList.contains("light") ? 0.55 : 0.7;
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} aria-hidden className={className} />;
}
