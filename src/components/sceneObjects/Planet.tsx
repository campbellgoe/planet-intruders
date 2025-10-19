// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from '@react-three/drei'
import { Mesh } from 'three'
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

export default function Planet({ size = 1.5, millisecondsPerLoop = 10000, detail = 1, wireframe = false, rotationSpeed = 0 }) {
  const ref = useRef<Mesh>(null)
  useFrame(() => {
    const timeSize = (Math.cos(performance.now()/millisecondsPerLoop)/2+0.5)*size+size/2
    if(ref.current) {
      const mesh = ref.current
      if(rotationSpeed) (mesh.rotation.y = performance.now()*rotationSpeed);
      mesh.scale.set(timeSize, timeSize, timeSize)
    } 
  })
return (
      <mesh ref={ref}>
        <dodecahedronGeometry args={[size, detail]} />
        <meshStandardMaterial wireframe={wireframe} />
      </mesh>
);
}