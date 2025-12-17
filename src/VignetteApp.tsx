"use client";
// import { useLoader } from '@react-three/fiber'
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { OrbitControls, Stats } from "@react-three/drei";
import "./style.css";
import { useTrimesh } from "@react-three/cannon";
import { useRef } from "react";

// import { SmallBox, Wall, Box, Ball, Ground } from "./scene";

function Effects() {
  return (
    <EffectComposer>
      <Vignette
        offset={0.75}
        darkness={0.5}
        // Eskil's vignette technique works from the outside inwards rather
        // than the inside outwards, so if this is 'true' set the offset
        // to a value greater than 1.
        // See frag for details - https://github.com/vanruesc/postprocessing/blob/main/src/effects/glsl/vignette/shader.frag
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

export const VignetteApp = () => {
  const { scene, nodes } = useGLTF('/snowy_mountain_-_terrain.glb')
  console.log('Mountain nodes', nodes)
  const levelProps = {}
  const [ref, api] = useTrimesh(
    () => ({
      args: [
        nodes.Object_2.geometry.attributes.position.array,
        nodes.Object_2.geometry.index.array,
      ],
      mass: 0,
      ...levelProps,
    }),
    useRef(null)
  )
  return (
    <Canvas
      
    >
      <directionalLight position={[2.5, 5, 5]} />
      {/* <SmallBox /> */}
      {/* <Box />
      <Ball />
      <Wall />
      <Ground /> */}
      
      <OrbitControls />
      <Stats />
      <Effects />
      {/* mountain gltf terrain mesh */}
      <primitive object={scene} scale={10} ref={ref}/>
    </Canvas>
  );
};