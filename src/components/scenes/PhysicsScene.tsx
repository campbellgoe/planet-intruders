import Cube from "@/components/sceneObjects/Cube";
import Pillar from "@/components/sceneObjects/Pillar";
// import TestAreaBlockWalls from "@/components/sceneObjects/TestAreaBlockWalls";
// import TestAreaBrickWallWithColumns from "@/components/sceneObjects/TestAreaBrickWallWithColumns";
// import TestAreaGroundBlocks from "@/components/sceneObjects/TestAreaGroundBlocks";
// import TestAreaSurface from "@/components/sceneObjects/TestAreaSurface";
import Vehicle from "@/components/sceneObjects/Vehicle/Vehicle";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import Heightfield, { generateHeightmap } from "@/components/sceneObjects/HeightField";
import { Merged, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { useTrimesh } from "@react-three/cannon";
import { BufferAttribute, Mesh, MOUSE, Object3D, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

const PhysicsScene = ({ cameraRef, currentCameraIndex = 0 }: { cameraRef: RefObject<typeof PerspectiveCamera[]>, currentCameraIndex: number }) => {

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
  const { scene: mountainScene, nodes: mountainNodes, materials: mountainMaterials } = useGLTF('/snowy_mountain_-_terrain.glb')
  console.log('materials', mountainMaterials)
  const mountainMaterial = mountainMaterials.material_0

  //  const data = mountainNodes..geometry
  //   const [duckRef, api] = useTrimesh(() => ({ 
  //     mass: 2, position: [2, 5, 0],
  //     args: [data.attributes.position.array,  data.index.array] }), useRef<Mesh>(null))

    const scale = 1000
    const meshes = useRef<Mesh[]>([])
    
  const [meshesList, setMeshesList] = useState<Mesh[]>([])
  useEffect(() => {
    // mountainNodes.Object_2.scale.set(scale, scale, scale)
    // mountainNodes.Object_3.scale.set(scale, scale, scale)
    // mountainNodes.Object_4.scale.set(scale, scale, scale)
    // mountainNodes.Object_2.position.set(0,80,0)
    // mountainNodes.Object_3.position.set(0,80,0)
    // mountainNodes.Object_4.position.set(0,80,0)
      mountainScene.traverse((obj: Object3D)=>{
      // @ts-ignore
      if (obj.isMesh) {
        obj.scale.set(scale,scale,scale)
        
        obj.position.set(0,-40,0)
        meshes.current.push(obj as Mesh)
      }
    })
    setMeshesList(meshes.current)
  }, [])
  console.log('Mountain nodes', mountainNodes)
  const levelProps = {}
  // const [meshes, setMeshes] = useState<{ Mesh: Mesh, points: any, indices: any}[]>([])
  // console.log('meshes', meshes)

  // const items =useMemo(() => {
  //   let v = new Vector3();
  //   let meshes: Mesh[] = []
  //   mountainScene.traverse((obj: Object3D)=>{
  //     // obj.scale.set(10,10,10)
  //     // @ts-ignore
  //     if (obj.isMesh) meshes.push(obj)
  // });

  //   return meshes.map(mesh=>{
  //   let g = mesh.geometry;
  //     let points = (g.attributes.position  as BufferAttribute).array || [];
  //     let indices = g.index?.array || [];
  //     return {
  //       Mesh: mesh,
  //       points,
  //       indices: indices,

  //     }
  //   })
  // }, [mountainScene])
  // @ts-ignore
  //   const [duckRef, api] = useTrimesh(() => ({ 
  //     mass: 2, position: [2, 5, 0],
  //     args: [data.attributes.position.array,  data.index.array] }), useRef<Mesh>(null))
  //   return (
  const mountainGeometry = useMemo(() => meshesList?.[0]?.geometry, [meshesList])
  
  const [mountainRef, mountainApi] = useTrimesh(
    () => ({
      args: [mountainGeometry?.attributes.position.array ||[], mountainGeometry?.index.array|| []],
      mass: 0,
      position: [0, -80, 0],
      ...levelProps,
    }),
    useRef<Mesh>(null)
  )
  useEffect(() =>{

    //  mountainApi.allowSleep.set(false)
  }, [])
  const [camTarget, setCamTarget] = useState([0, -20, 0])
  //     function convertConvexHullToTrimesh() {
  //     const shape = CannonUtils.CreateTrimesh(convexHull.geometry)
  //     body = new CANNON.Body({ mass: 1 })
  //     body.allowSleep = true
  //     body.addShape(shape)
  //     body.position.x = monkey.position.x
  //     body.position.y = monkey.position.y
  //     body.position.z = monkey.position.z
  //     body.quaternion.x = monkey.quaternion.x
  //     body.quaternion.y = monkey.quaternion.y
  //     body.quaternion.z = monkey.quaternion.z
  //     body.quaternion.w = monkey.quaternion.w
  //     world.addBody(body)
  // }
  // const Duck = () => {
  //   const { nodes, materials }= useGLTF("/duck.glb");
  //   const data = nodes.LOD3spShape.geometry
  //   const [duckRef, api] = useTrimesh(() => ({ 
  //     mass: 2, position: [2, 5, 0],
  //     args: [data.attributes.position.array,  data.index.array] }), useRef<Mesh>(null))
  //   return (
  //     <mesh ref={duckRef} scale={0.01}
  //       geometry={nodes.LOD3spShape.geometry}
  //       material={materials["blinn3-fx"]}
  //     />
  //   )
  // }
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

      <Vehicle cameraIndex={currentCameraIndex} playerIndex={0} rotation={[0, -Math.PI / 4, 0]} position={[-2, 2, 0]} engineForce={1600} color={0xff0000} />

      <Vehicle cameraIndex={currentCameraIndex} playerIndex={1} rotation={[0, -Math.PI / 4, 0]} position={[2, 2, 0]} engineForce={1600} color={0x0044ff} />
      {/* <OrbitControls camera={cameraRef} enablePan={false} target={camTarget}/> */}
      {/* debug vehicle wheels */}
      {/* <Cube type='Static'position={[0, 0, 0]} args={[1, 2, 1]} /> */}
      {/* gltf */}
      <primitive ref={mountainRef} object={mountainScene}/>
    </>
  );
};

export default PhysicsScene;
