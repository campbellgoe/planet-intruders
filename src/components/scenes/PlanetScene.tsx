import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei'
import PlanetMesh from "@/components/sceneObjects/Planet";
const SceneLighting = ({ positions, setPositions }: { positions: number[], setPositions: any }) => {
  useFrame(() => {
    setPositions((positions: any) => positions.map(([x, y, z, color]: any[]) => {
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
export const PlanetScene = ({ energy, heal, positions, setEnergy, setPositions }: { energy: number, heal: number, positions: number[], setEnergy: any, setPositions: any}) => {
  return <>
  <SetEnergy setEnergy={setEnergy} heal={heal} />
    {(energy > 0) && <PlanetMesh wireframe={false} rotationSpeed={0.0001} energy={energy} />}
    <SceneLighting positions={positions} setPositions={setPositions} />
    <OrbitControls enablePan={false} />
  </>
}