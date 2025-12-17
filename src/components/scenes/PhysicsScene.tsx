import Cube from "@/components/sceneObjects/Cube";
import Pillar from "@/components/sceneObjects/Pillar";
import TestAreaBlockWalls from "@/components/sceneObjects/TestAreaBlockWalls";
import TestAreaBrickWallWithColumns from "@/components/sceneObjects/TestAreaBrickWallWithColumns";
import TestAreaGroundBlocks from "@/components/sceneObjects/TestAreaGroundBlocks";
import TestAreaSurface from "@/components/sceneObjects/TestAreaSurface";
import Vehicle from "@/components/sceneObjects/Vehicle/Vehicle";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import Heightfield, { generateHeightmap } from "@/components/sceneObjects/HeightField";
import { useGLTF } from "@react-three/drei";
import { useTrimesh } from "@react-three/cannon";
import { BufferAttribute, Mesh, Object3D, Vector3 } from "three";

const PhysicsScene = ({ myIndex = 0 }: {myIndex: number}) => {

  const sideScale = 2048;

  const heightMapParameters = useMemo(
    () => ({
      width: 128,
      height: 128,
      amountOfSeedPoints: 10,
      scale: 1,

    }),
    []
  );
  const heights = useMemo(() => generateHeightmap(heightMapParameters), [
    heightMapParameters
  ]);
const { scene, nodes } = useGLTF('/snowy_mountain_-_terrain.glb')
    console.log('Mountain nodes', nodes)
    const levelProps = {}
    // const [meshes, setMeshes] = useState<{ Mesh: Mesh, points: any, indices: any}[]>([])
    // console.log('meshes', meshes)
    
    const items =useMemo(() => {
      let v = new Vector3();
      let meshes: Mesh[] = []
      scene.traverse((e: Object3D<any>)=>e.isMesh && meshes.push(e));
      
      return meshes.map(mesh=>{
      let g = mesh.geometry;
        let points = g.attributes.position.array || [];
        let indices = g.index?.array || [];
        return {
          Mesh: mesh,
          points,
          indices: indices,

        }
      })
    }, [scene])
    const [ref, api] = useTrimesh(
      () => ({
        args: [
          items?.[2]?.points || [],
          items?.[2]?.indices || [],
        ],
        mass: 0,
        ...levelProps,
      }),
      useRef(null)
    )
  return (
    <>
      <Heightfield
        elementSize={(sideScale * 1) / heightMapParameters.width}
        heights={heights}
        position={[-sideScale / 2, -20, sideScale / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      {/* <Heightfield
        elementSize={(sideScale * 1) / heightMapParameters.width}
        heights={heights}
        position={[-sideScale / 2 - sideScale, -300, sideScale / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Heightfield
        elementSize={(sideScale * 1) / heightMapParameters.width}
        heights={heights}
        position={[-sideScale / 2, -300, sideScale / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      /> */}

      {/* TestAreaSurface commented due implementing Heightfield */}
      {/* <TestAreaSurface width={5} height={5} /> */}

      <Pillar position={[-5, 0, -6]} userData={{ id: "pillar-1" }} />
      <Pillar position={[0, 0, -6]} userData={{ id: "pillar-2" }} />
      <Pillar position={[5, 0, -6]} userData={{ id: "pillar-3" }} />

      {/* pillars blocks */}
      <Cube position={[-2.5, 4, -6.5]} args={[5, 0.5, 0.5]} />
      <Cube position={[-2.5, 4, -6.0]} args={[5, 0.5, 0.5]} />
      <Cube position={[-2.5, 4, -5.5]} args={[5, 0.5, 0.5]} />

      <Cube position={[+2.5, 4, -6.5]} args={[5, 0.5, 0.5]} />
      <Cube position={[+2.5, 4, -6.0]} args={[5, 0.5, 0.5]} />
      <Cube position={[+2.5, 4, -5.5]} args={[5, 0.5, 0.5]} />
      {/* /pillars blocks */}

      {/* column */}
      <Cube position={[5, -1.5, 0]} args={[1, 2, 1]} />
      {/* /column */}

      {/* brick column */}
      {/* <Cube position={[-7, -3, 0]} args={[0.5, 0.5, 1]} />
      <Cube position={[-7, -1.5, 0]} args={[0.5, 0.5, 1]} />
      <Cube position={[-7, -1, 0]} args={[0.5, 0.5, 1]} />
      <Cube position={[-7, -0.5, 0]} args={[0.5, 0.5, 1]} />
      <Cube position={[-7, 0, 0]} args={[0.5, 0.5, 1]} />
      <Cube position={[-7, 0.5, 0]} args={[0.5, 0.5, 1]} />
      <Cube position={[-7, 1, 0]} args={[0.5, 0.5, 1]} /> */}
      {/* /brick column */}

      {/* vvv /disabled due perfomance of collision detection */}
      {/* <TestAreaBrickWallWithColumns />

      <TestAreaBlockWalls />
      <TestAreaGroundBlocks /> */}
      {/* ^^^ /disabled due perfomance of collision detection */}

      {/* <Vehicle rotation={[0, -Math.PI / 4, 0]} angularVelocity={[0, 0.5, 0]} /> */}

      <Vehicle cameraIndex={myIndex} playerIndex={0} rotation={[0, -Math.PI / 4, 0]} position={[-2,  2, 0]} engineForce={4000} color={0xff0000}/>

       <Vehicle cameraIndex={myIndex}  playerIndex={1} rotation={[0, -Math.PI / 4, 0]} position={[2, 2, 0]} engineForce={4000} color={0x00ff44}/>

      {/* debug vehicle wheels */}
      {/* <Cube type='Static'position={[0, 0, 0]} args={[1, 2, 1]} /> */}
      {/* gltf */}
      <primitive object={scene} scale={1000} ref={ref} position={[0.04, 0.04,0.04]}/>
    </>
  );
};

export default PhysicsScene;
