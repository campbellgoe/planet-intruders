// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from '@react-three/drei'
import { DoubleSide, Mesh, TextureLoader } from 'three'
import { useFrame, useLoader  } from "@react-three/fiber";
import { useRef } from "react";
export default function Planet({
  energy = 0,
  size = 1.5,
  millisecondsPerLoop = 10000,
  detail = 1,
  wireframe = false,
  rotationSpeed = 0
}) {
  // @ts-ignore
  const colorMap = useLoader(TextureLoader, 'light-green-tree-0.png')
  const ref = useRef<Mesh>(null)
  useFrame(() => {
    const timeSize = (Math.cos(performance.now()/millisecondsPerLoop)/2+0.5)*size+size/2
    if(ref.current) {
      const mesh = ref.current
      if(rotationSpeed) (mesh.rotation.y = performance.now()*rotationSpeed);
      mesh.scale.set(timeSize*energy, timeSize*energy, timeSize*energy)
    } 
  })
return (
      <mesh ref={ref}>
        <dodecahedronGeometry args={[size, detail]} />
        {/*@ts-ignore*/}
        <meshStandardMaterial offset={[1,performance.now()/100,4]} map={colorMap} transparent={true} opacity={energy} wireframe={wireframe} side={DoubleSide} />
      </mesh>
);
}