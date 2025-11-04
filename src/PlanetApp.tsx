"use client";
import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from '@react-three/drei'
// import PlanetMesh from "./components/sceneObjects/Planet";
import { useCallback, useState } from "react";
import { PlanetScene } from "./components/scenes/PlanetScene";
// import { type DirectionalLight } from "three";
const initialPositions = [
    [Math.random()*12-6, Math.random()*12-6, Math.random()*12-6, 0xffff00],
    [Math.random()*12-6, Math.random()*12-6, Math.random()*12-6, 0xff9900],
    [Math.random()*12-6, Math.random()*12-6, Math.random()*12-6, 0x00ff00],
    [Math.random()*12-6, Math.random()*12-6, Math.random()*12-6, 0x0000ff],
    [Math.random()*12-6, Math.random()*12-6, Math.random()*12-6, 0xff0000]
  ]

export default function App() {
  const [energy, setEnergy] = useState(1)
  const [heal, setHeal] = useState(0.0098)
  const [positions, setPositions] = useState<number[][]>(initialPositions)
  const props = {energy, heal, setEnergy, positions, setPositions}
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
        <PlanetScene {...props}/>
      </Canvas>
      </div>
  );
}