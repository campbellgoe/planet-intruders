import { useMemo, useRef } from "react";
import { DayTime, DayTimes } from "./MainScene";
// import Heightfield, { generateHeightmap } from "../sceneObjects/HeightField";
import { Color, ColorRepresentation, Object3D } from "three";
import { PerspectiveCamera, Plane } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function LoadingScene(){
// const sideScale = 512;
  
//     const heightMapParameters = useMemo(
//       () => ({
//         width: sideScale,
//         height: sideScale,
//         amountOfSeedPoints: 100,
//         scale: 1
//       }),
//       []
//     );
    // const heights = useMemo(() => generateHeightmap(heightMapParameters), [
    //   heightMapParameters
    // ]);
     const dayTime:DayTime = DayTimes.night as DayTime
    
      const fogColors = {
        morning: 0xEEEEF7,
        day: 0xF6F6F6,
        evening: 0xFFECE1,
        night: 0x171720
      };
    
      type WeatherState = {
        fog: {
          color: ColorRepresentation;
          near?: number | undefined;
          far?: number | undefined;
        };
      };
      const weatherState: WeatherState = {
        fog: { color: fogColors[dayTime], near: 10, far: 50 }
      };
      const fogArgs: [color: ColorRepresentation, near?: number | undefined, far?: number | undefined] = [
        weatherState.fog.color,
        weatherState.fog.near,
        weatherState.fog.far
      ];
      const backgroundColor = weatherState.fog.color;
      const globalIlluminationIntensity = dayTime === DayTimes.day ? 0.3 : 0.05
      const planeRef = useRef<Object3D>(null)
      useFrame(() => {
        if(!planeRef.current) return
planeRef.current.rotation.set(performance.now()/1000, performance.now()/3000, performance.now()/7000)
      })
    return (
    <> <PerspectiveCamera
        position={[0, 6, -24]}
        fov={50}
      />
<fog attach="fog" args={fogArgs} />
      {/* <color attach="background" args={["#ffffff"]} /> */}
      <color attach="background" args={["#4422ce"]} />
      <ambientLight intensity={globalIlluminationIntensity} />
      <Plane ref={planeRef}/>
      </>
    )
}