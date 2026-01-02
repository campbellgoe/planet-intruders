"use client";
import { CameraControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import HUD from "./components/HUD/HUD";
import { InfoRecordsProvider } from "./components/HUD/InfoPanelContext";
// import Scene from "./components/scenes/MainScene";
import { CameraIdProvider, useCameraId } from "./components/sceneObjects/CameraContext";
import { ControlsContext, useControls } from "./hooks/useControls";
import { lazy, Suspense, useRef, useState } from "react";
import { Mesh, Object3D, Vector3 } from "three";
import "./style.css";
import LoadingScene from "./components/scenes/LoadingScene";


// import ThreeApp from './Scene'
const MainScene = lazy(() => import("./components/scenes/MainScene"))
const App = () => {
  // const [cameraFOV, setCameraFOV] = useState(75);
  const [cameraFOV, setCameraFOV] = useState(50);
  const [cameraPosition, setCameraPosition] = useState<Vector3>(
    new Vector3(0, 5, 0)
    // new Vector3(0.5, 2, 20.5)
  );
  const [cameraTarget, setCameraTarget] = useState(new Vector3(0, 0, 0));
  const CameraControlsRef = useRef<CameraControls>(null);
const currentCameraId = useCameraId()
  const onChangeCamera = (e?: any) => {
    if (!e) {
      return;
    }
    if(currentCameraId !== "static"){
      const eventTarget = e.target as CameraControls;
      setTimeout(() => {

    
      // @ts-ignore
      setCameraPosition(cameraPosition => eventTarget.getPosition(new Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z)));
      // @ts-ignore
      setCameraTarget(cameraTarget => eventTarget.getTarget(cameraTarget));
        }, 120)
    }
  };

  const CanvasRef = useRef(null);
  const controls = useControls();
  const myIndexRef = useRef<number>(0)
   
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw"
      }}
    >
      <ControlsContext.Provider value={controls}>
        <Suspense fallback={null}>
          <CameraIdProvider>
            <InfoRecordsProvider>
              <Canvas
                ref={CanvasRef}
                onClick={() => {
                  
myIndexRef.current = (myIndexRef.current+1)%2;
                }}
                // shadows
                // shadows="basic"
                // shadows="percentage"
                shadows="soft"
                // shadows="variance"
                dpr={[1, 1.5]}
                camera={{
                  fov: cameraFOV
                }}
                gl={{ antialias: true }}
              // gl={{ antialias: true, logarithmicDepthBuffer: true }}
              >
                {/* <PerspectiveCamera
                fov={cameraFOV}
                makeDefault={true}
                position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
              /> */}
                <Suspense fallback={<LoadingScene />}>
                  <CameraControls
                    ref={CameraControlsRef}
                    onEnd={onChangeCamera}
                  />
                  <MainScene
                    cameraControlsRef={CameraControlsRef}
                    cameraPosition={cameraPosition}
                    cameraTarget={cameraTarget}
                    cameraFOV={cameraFOV}
                    myIndexRef={myIndexRef}
                  />
                  
                </Suspense>
              </Canvas>
              <HUD
                cameraPosition={cameraPosition}
                cameraTarget={cameraTarget}
              />
            </InfoRecordsProvider>
          </CameraIdProvider>
        </Suspense>
      </ControlsContext.Provider>
    </div >
  );
};

export default App;
