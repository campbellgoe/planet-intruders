import KeymapInfo from "./KeymapInfo/KeymapInfo";
import CameraInfo from "./CameraInfo";
import { Vector3 } from "three";
import { useControls } from "@/hooks/useControls";
import InfoRecords from "./InfoRecords";

type ScreenInterfaceProps = {
  cameraPosition: Vector3;
  cameraTarget: Vector3;
};

const HUD = ({ cameraPosition, cameraTarget }: ScreenInterfaceProps) => {
  const { showCameraInfo } = useControls();

  return (
    <>
      <InfoRecords />
      <KeymapInfo />
      {showCameraInfo && (
        <CameraInfo
          cameraPosition={cameraPosition}
          cameraTarget={cameraTarget}
        />
      )}
    </>
  );
};

export default HUD;
