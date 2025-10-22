import Cube from "@/components/sceneObjects/Cube";
import Pillar from "@/components/sceneObjects/Pillar";
import TestAreaBlockWalls from "@/components/sceneObjects/TestAreaBlockWalls";
import TestAreaBrickWallWithColumns from "@/components/sceneObjects/TestAreaBrickWallWithColumns";
import TestAreaGroundBlocks from "@/components/sceneObjects/TestAreaGroundBlocks";
import TestAreaSurface from "@/components/sceneObjects/TestAreaSurface";
import Vehicle from "@/components/sceneObjects/Vehicle/Vehicle";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Heightfield, { generateHeightmap } from "@/components/sceneObjects/HeightField";
import { SpriteMaterial, TextureLoader, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
export const CELL_SIZE = 100;
const cellSize = CELL_SIZE;
// chunks for sprites to spawn in
const chunkStart = -2
const chunkEnd = 2
export const MAPS = {
  MAP_0: [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1]
  ]
};
const PhysicsScene = ({ cameraPosition }: any) => {
  const sideScale = 100;
const initialRegionKey = useMemo(() => 0 + "," + 0, [])
  const [spritesData, setSpritesData] = useState<any>(null)
  const heightMapParameters = useMemo(
    () => ({
      width: 512,
      height: 512,
      amountOfSeedPoints: 100,
      scale: 1
    }),
    []
  );
  
  const heights = useMemo(() => generateHeightmap(heightMapParameters), [
    heightMapParameters
  ]);
   const wall = {
    depth: 30,
    width: 30,
    height: 10,
    thickness: 1
  }
  const box = {
    depth: 4,
    width: 4,
    height: 4,
  }
 const generatePlant = useCallback((spriteKey: string, regionKey: string, { src, scale, isSmall }: any, { spreadX = 128, spreadZ = spreadX, ox = 0, oz = 0 }: any) => {
    const numberOfCols = Math.floor((wall.depth * wall.thickness) / box.depth);
    const numberOfRows = Math.floor((wall.width * wall.thickness) / box.width);
    const numberOfLayers = Math.floor((wall.height * wall.thickness) / box.height);
    const halfSpreadX = spreadX / 2
    const x = Math.random() * spreadX - halfSpreadX - (ox * spreadX)
    const halfSpreadZ = spreadZ / 2
    const z = Math.random() * spreadZ - halfSpreadZ - (oz * spreadZ)
    const y = isSmall ? -3 : 0
    const startFrame = Math.floor(Math.random() * 24) % 24
    const frame = startFrame
    return {
      src,
      regionKey,
      key: spriteKey,
      scale,
      //position
      position: [x, y, z],
      distance: 0,
      posObject: new Vector3(),
      startFrame,
      frame
    }
  }, [])
  const [[ox, oz], setOffset] = useState([0, 0])
 const spriteRefs = useRef({})
  const createColor = () => 0x00ffff * Math.random() + 0x004400 + 0x220000
   const colors = useMemo(() => {
     const colors = []
     for (let i = 0; i < 64; i++) {
       colors.push(createColor())
     }
     return colors
   }, [])
   const chunks = useMemo(() => {
     const chunkWidth = MAPS.MAP_0[0].length;
     const chunkHeight = MAPS.MAP_0.length;
 
     let chunks = [];
     const cSize = 1
     let index = 0
     for (let x = -2 + ox; x < 2 + ox; x++) {
       for (let z = -2 + oz; z < 2 + oz; z++) {
         // Horizontal distance between chunks
         const offsetX = x * chunkWidth * cSize * Math.sqrt(3); // Horizontal offset
         // Vertical distance between chunks, with row staggering
         const offsetZ =
           (z * chunkHeight * cSize * 1.5 +
             (x % 2 !== 0 ? (cSize * 1.5) * 2 : 0)); // Vertical offset with stagger
 
         chunks.push({
           key: `instance_${offsetX},${offsetZ}`,
           color: colors[index % colors.length],
           map: MAPS.MAP_0,
           position: [offsetX, 1, offsetZ] // Position based on the correct chunk offsets
         });
         index++
       }
     }
     return chunks;
   }, [ox, oz]);
   const prevOx = useRef(0)
     const prevOz = useRef(0)
     useFrame((state) => {
       if (cameraPosition) {
         let newOx = 0
         let newOz = 0
         try {
           const [x, y, z] = cameraPosition.toArray();
   
   
           // if has changed chunk
           newOx = -Math.floor((x / CELL_SIZE / MAPS.MAP_0.length) / Math.sqrt(3))
           newOz = -Math.floor((z / CELL_SIZE / MAPS.MAP_0.length) / 1.5)
           setOffset([newOx, newOz])
           // generatePlants(iox, ioz)
           // changed chunk
           // const initialSpritesData = useMemo(() => Array.from({ length: 100 }, (_, index) => {
           //   const isSmall = Math.random() > 0.33
           //   const scale = isSmall ? 10 +Math.random()*2 : 14 + Math.random() * 4
           //   const src = isSmall ? '/images/SmallPlant/PalmSmall_' : '/images/BigBush/Monsterra_'
           //   return generatePlant(index+""+src, { src, scale, isSmall }, { spread: 256, ox, oz})
           // }), [])
   
   
           setSpritesData((spritesDataChunks: any) => {
             const newSpriteDataChunks = { ...spritesDataChunks }
             for (let ix = chunkStart; ix < chunkEnd; ix++) {
               for (let iz = chunkStart; iz < chunkEnd; iz++) {
                 const regionKey = (newOx + ix) + "," + (newOz + iz)
                 newSpriteDataChunks[regionKey] = spritesDataChunks?.[regionKey] || Array.from({ length: Math.abs(Math.cos((newOx + ix) / (chunkEnd - chunkStart) * Math.PI * 2) * 32) }, (_, index) => {
                   const existingTree = spritesDataChunks?.[regionKey]?.[index]
                   // const sprite = spriteRefs.current[spriteData.key]
                   // sprite.visible = false
                   if (existingTree) return existingTree
                   const isSmall = Math.random() > 0.33
                   const scale = isSmall ? 10 + Math.random() * 2 : 14 + Math.random() * 4
                   const src = isSmall ? '/images/SmallPlant/PalmSmall_' : '/images/BigBush/Monsterra_'
                   const spriteKey = regionKey + "_" + index + "_" + src
                   return generatePlant(spriteKey, regionKey, { src, scale, isSmall }, { spreadX: (CELL_SIZE * MAPS.MAP_0.length * Math.sqrt(3)), spreadZ: (CELL_SIZE * MAPS.MAP_0.length * 1.5), ox: newOx + ix, oz: newOz + iz })
                 })
               }
             }
   
             return newSpriteDataChunks
   
           })
   
   
         } catch (err) {
           console.error(err)
         }
         try {
   
   
           setSpritesData((spritesDataChunks: any) => {
             const newSpritesData: any = {}
             for (let ix = chunkStart; ix < chunkEnd; ix++) {
               for (let iz = chunkStart; iz < chunkEnd; iz++) {
                 const regionKey = (newOx + ix) + "," + (newOz + iz)
                 newSpritesData[regionKey] = spritesDataChunks[regionKey].map((spriteData: any, i: number) => {
                   // @ts-ignore
                   const sprite = spriteRefs.current[spriteData.key]
                   if (sprite) {
                     // // first calculate angle between camera and sprite
                     // // sprite is a drei Html component
   
                     sprite.getWorldPosition(spriteData.posObject);
   
   
   
                     state.camera.getWorldPosition(posCamera as Vector3 as any);
   
                     const xDist = posCamera.x - spriteData.posObject.x;
                     const zDist = posCamera.z - spriteData.posObject.z;
                     const dist = Math.sqrt(xDist * xDist + zDist * zDist)
                     // console.log('dist', dist)
                     const angleRadians = Math.atan2(zDist, xDist);
   
                     // const angleRadians = posSprite.angleTo(posCamera);
                     const angle = angleRadians//Math.atan2(state.camera.position.x - sprite.position.x, state.camera.position.z - sprite.position.z)
                     let newFrame;
                     if (dist > 100) {
                       newFrame = spriteData.startFrame
                     } else {
                       newFrame = Math.floor((-angle / (Math.PI * 2) + 0.5) * 24 + spriteData.startFrame) % 24
                     }
                     if (dist > 200) {
                       sprite.visible = false
                     } else if (sprite.visible === false) {
                       sprite.visible = true
                     }
   
                     // if(dist > 300) {
   
                     // }
                     spriteData.frame = newFrame
                     spriteData.distance = dist
                     // let distanceFactor = dist / 200;
                     let alpha = 1;//- distanceFactor;
   
                     // Clamp alpha to be between 0 and 1
                     alpha = Math.max(0, Math.min(1, alpha));
   
                     let distanceFactor = dist / 200;
                     distanceFactor = Math.max(0, Math.min(1, distanceFactor)); // Ensure it stays between 0 and 1
                     spriteData.color = 0xffffff;
                     // // Assuming spriteData.color is an RGB value like 0xRRGGBB
                     // let r = (spriteData.color >> 16) & 0xff;
                     // let g = (spriteData.color >> 8) & 0xff;
                     // let b = spriteData.color & 0xff;
                     // const blendAmount = 1 - distanceFactor
                     // // Darken the color by blending with black (0x000000)
                     // r = Math.floor(r * blendAmount);
                     // g = Math.floor(g * blendAmount);
                     // b = Math.floor(b * blendAmount);
   
                     // // Combine the new RGB values back into a single color value
                     // spriteData.color = (r << 16) | (g << 8) | b;
                     // Assuming spriteData.color is an object with r, g, b, a properties or something similar
                     spriteData.alpha = alpha;
                     // sprite.userData = {
                     //   ...sprite.userData || {},
                     //   frame: newFrame,
                     //   distance: dist
                     // }
                   }
                   return spriteData
                 })
               }
             }
             return newSpritesData
   
   
           })
   
           // const angle = Math.atan2(state.camera.position.x, state.camera.position.z)
           // console.log('angle', angle)
           // const frame = Math.floor((angle/(Math.PI*2))*24)%24
   
   
   
         } catch (err) {
           console.error(err)
         }
       }
   
       return true
     })
     const [plants, setPlants] = useState<any[]>([])
     useEffect(() => {
       const savePlantMaterials = async () => {
         const treeHeight = 128
         const treeHeightRange = 32
         const materialSources = [{
           src: '/dark-tree-',
           count: 2,
           calculateScale: () => Math.random() * treeHeightRange + treeHeight - (treeHeightRange / 2)
         }, {
           src: '/light-green-tree-',
           count: 1,
           alculateScale: () => Math.random() * treeHeightRange + treeHeight - (treeHeightRange / 2)
         }]
         const loader = new TextureLoader();
         const plantsWithMaterials = await Promise.all(materialSources.map(async ({ src, count, calculateScale }) => {
           const textureMaps = []
           for (let i = 0; i < count; i++) {
             // instantiate a loader
             textureMaps.push((
               new Promise((resolve, reject) => {
                 loader.load(src + (i).toString() + '.png', (map) => {
                   resolve(new SpriteMaterial({ map: map, color: 0xffffff, visible: true, opacity: 1, depthWrite: true, alphaTest: 0.5, transparent: true }))
                 }, undefined, (err: any) => {
                   reject(err)
                   // resolve(new SpriteMaterial({color: 0xff0000, visible: true, opacity: 1 ,depthWrite: true }))
                 })
               })
             ));
   
           }
           const readyTextureMapsForPlant = await Promise.all(textureMaps)
   
           return { src, textureMaps: readyTextureMapsForPlant, calculateScale }
         }))
         return plantsWithMaterials
   
       }
       console.log('saving plant materials')
       savePlantMaterials().then(plants => {
         console.log('plants:', plants)
         setPlants(plants)
        //  onReady(plants)
       })
         .catch(err => {
           console.error('error loading plant material', err)
         })
     }, [])
     const regionKey = ox + "," + oz
  return (
    <>
      {chunks.map((chunk, i) => (
        <Heightfield
          key={chunk.position[0]+","+chunk.position[2]}
          elementSize={(sideScale * 1) / heightMapParameters.width}
          heights={heights}
          position={[chunk.position[0] - sideScale / 2, chunk.position[1] - 10, chunk.position[0] - sideScale / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      ))}

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

      <Vehicle rotation={[0, -Math.PI / 4, 0]} position={[0, 2, 0]} />

      {/* debug vehicle wheels */}
      {/* <Cube type='Static'position={[0, 0, 0]} args={[1, 2, 1]} /> */}
    </>
  );
};

export default PhysicsScene;
