"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei'
import PlanetMesh from "./components/sceneObjects/Planet";
import { useCallback, useState } from "react";
// import { type DirectionalLight } from "three";
const initialPositions = [
    [Math.random()*12-6, Math.random()*12-6, Math.random()*12-6, 0xffff00],
    [Math.random()*12-6, Math.random()*12-6, Math.random()*12-6, 0xff9900],
    [Math.random()*12-6, Math.random()*12-6, Math.random()*12-6, 0x00ff00],
    [Math.random()*12-6, Math.random()*12-6, Math.random()*12-6, 0x0000ff],
    [Math.random()*12-6, Math.random()*12-6, Math.random()*12-6, 0xff0000]
  ]
const SceneLighting = ({ positions, setPositions }) => {
  
  
  useFrame(() => {
    setPositions(positions => positions.map(([x, y, z, color], i) => {
      return [x+Math.random()*Math.cos(x)*0.1, y+Math.random()*Math.cos(x)+Math.sin(z)*0.1, z+Math.random()*Math.sin(x)*0.1, color+Math.random()*0.1-0.05]
    }))
  })
  return <>
    <ambientLight intensity={0.04} />
    <directionalLight position={positions[0]} color="#ffff00" />
    <directionalLight position={positions[1]} color="#ff9900" />
    <directionalLight position={positions[2]} color="green" />
    <directionalLight position={positions[3]} color="blue" />
    
    <directionalLight position={positions[4]} color="red" />
    {/* <directionalLight position={[0, 10, 0]} color="green" /> */}
  </>
}
const SetEnergy = ({ setEnergy,heal = 0 }: { setEnergy: any; heal: number }) => {
  useFrame(() => {
    setEnergy((energy: number) => Math.max(0, energy-0.01+heal))
  })
  return null
}
export default function App() {
  const [energy, setEnergy] = useState(1)
  const [heal, setHeal] = useState(0.0098)
  const [positions, setPositions] = useState<number[][]>(initialPositions)
  const healFn = useCallback(() => {
setEnergy(energy => energy + 0.1)
setPositions(initialPositions)
  }, [])
  return (
    <div className="w-full h-full">
      {energy == 0 && <button className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] p-2 rounded bg-pink-500 text-pink-900"
      onClick={() => {
        healFn()
      }}
      >
        Click to revive
      </button>}
      <Canvas style={{width: '100%',height: '100dvh'}} onClick={() => {
        healFn()
      }}>
        <SetEnergy setEnergy={setEnergy} heal={heal}/>
        {(energy > 0) && <PlanetMesh wireframe={false} rotationSpeed={0.0001} energy={energy}/>}
        <SceneLighting positions={positions} setPositions={setPositions}/>
        <OrbitControls enablePan={false} />
      </Canvas>
      </div>
  );
}