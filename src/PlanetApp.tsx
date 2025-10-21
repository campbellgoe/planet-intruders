"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei'
import PlanetMesh from "./components/sceneObjects/Planet";
const SceneLighting = () => {
  return <>
    <ambientLight intensity={0.04} />
    <directionalLight position={[0, 10, 0]} color="#ffff00" />
    <directionalLight position={[-5, 10, -8]} color="#ff9900" />
    <directionalLight position={[12, -10, -4]} color="green" />
    <directionalLight position={[-15, -4, 12]} color="blue" />
    
    <directionalLight position={[-5, 12, -6]} color="red" />
    {/* <directionalLight position={[0, 10, 0]} color="green" /> */}
  </>
}
export default function App() {
return (
  <div className="w-full h-full">
    <Canvas style={{width: '100%',height: '100dvh'}}>
      <PlanetMesh wireframe={false} rotationSpeed={0.0001}/>
      <SceneLighting />
      <OrbitControls enablePan={false} />
    </Canvas>
    </div>
);
}