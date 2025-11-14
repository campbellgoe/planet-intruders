import Cube from "@/components/sceneObjects/Cube";
import Pillar from "@/components/sceneObjects/Pillar";
import TestAreaBlockWalls from "@/components/sceneObjects/TestAreaBlockWalls";
import TestAreaBrickWallWithColumns from "@/components/sceneObjects/TestAreaBrickWallWithColumns";
import TestAreaGroundBlocks from "@/components/sceneObjects/TestAreaGroundBlocks";
import TestAreaSurface from "@/components/sceneObjects/TestAreaSurface";
import Vehicle from "@/components/sceneObjects/Vehicle/Vehicle";
import { useMemo } from "react";
import Heightfield, { generateHeightmap } from "@/components/sceneObjects/HeightField";

const PhysicsScene = () => {
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

      <Vehicle playerIndex={0} rotation={[0, -Math.PI / 4, 0]} position={[-2,  2, 0]} engineForce={7000} color={0x9999ff}/>

       <Vehicle playerIndex={1} rotation={[0, -Math.PI / 4, 0]} position={[2, 2, 0]} engineForce={7000} color={0xff9999}/>

      {/* debug vehicle wheels */}
      {/* <Cube type='Static'position={[0, 0, 0]} args={[1, 2, 1]} /> */}
    </>
  );
};

export default PhysicsScene;
