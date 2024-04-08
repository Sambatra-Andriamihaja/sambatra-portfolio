"use client";

import { Controls, Player } from "@lottiefiles/react-lottie-player";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function MeshComponent() {
  const fileUrl = "/objects/modern_gadgets_updated.glb";
  const mesh = useRef<Mesh>(null!);
  const model = useLoader(GLTFLoader, fileUrl);

  // Scale the model
  model.scene.scale.set(10, 10, 10);

  useFrame(() => {
    mesh.current.rotation.y += 0.0025;
  });

  return (
    <mesh ref={mesh}>
      <primitive object={model.scene} />
    </mesh>
  );
}

export const ModelViewer = () => {
  const controlsRef = useRef(null);

  return (
    <div
      className="flex justify-center items-center"
      style={{ overscrollBehavior: "none" }}
    >
      {/* Import 3D object */}
      <Canvas className="h-2xl w-2xl">
        <OrbitControls
          ref={controlsRef}
          maxDistance={10} // to set the maximum zoom out distance
          minDistance={7} // to set the minimum zoom in distance
        />
        <ambientLight intensity={2.5} />
        <pointLight position={[10, 10, 10]} />
        <MeshComponent />
      </Canvas>
    </div>
  );
};
