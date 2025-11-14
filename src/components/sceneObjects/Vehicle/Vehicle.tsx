import { RaycastVehiclePublicApi, Triplet, useRaycastVehicle, WheelInfoOptions } from "@react-three/cannon";

import { useFrame } from "@react-three/fiber";
import { /*ControlsContext,*/ useControls } from "@/hooks/useControls";
import { /*useContext, useEffect,*/ useEffect, useRef, useState } from "react";
import { Object3D, Vector3 } from "three";
import Chassis from "./Chassis";
import Wheel from "./Wheel";
import { PLAYER_1, PLAYER_2} from "../const";

const Vehicle = ({
  playerIndex = PLAYER_1,
  wheelRadius = 0.6,
  wheelDepth = 1.2,
  wheelAxisWidth = 1.5,
  wheelAxisHeight = 0.28,
  frontFirstAxis = 1.5,
  frontSecondAxis = 0.65,
  rearFirstAxis = -0.55,
  rearSecondAxis = -1.4,
  maxSteerAxisesRad = 0.1, // ~ 5.7 deg
  // maxSteerAxisesRad = 0.2, // ~ 11.459 deg
  // maxSteerAxisesRad = 0.25, // ~ 14.3 deg
  engineForce = 5000,
  maxBrake = 100,
  // maxBrake = 50,

  position = [0, 0, 0] as Triplet,
  velocity = [0, 0, 0] as Triplet,
  angularVelocity = [0, 0, 0] as Triplet,
  rotation = [0, 0, 0] as Triplet,
  ...props
}) => {
  const [cameraPosition, setCameraPosition] = useState([0,-15,-10])
  const distanceToRotationCenter = frontFirstAxis * Math.tan(maxSteerAxisesRad);

  const steerFrontFirstAxisesRad = Math.atan(
    distanceToRotationCenter / frontFirstAxis
  );
  const steerFrontSecondAxisAngleRad = Math.atan(
    distanceToRotationCenter / frontSecondAxis
  );

  const steerReaFirstrAxisesRad = Math.atan(
    distanceToRotationCenter / rearFirstAxis
  );
  const steerRearSecondAxisAngleRad = Math.atan(
    distanceToRotationCenter / rearSecondAxis
  );

  const chassisRef = useRef<Object3D<Event>>(null);
  // const chassisRef: React.RefObject<Object3D<Event>> = useRef(null);

  const wheelFrontFirstAxisLeftRef = useRef<Object3D<Event>>(null);
  // const wheelFrontFirstLeftRef: Ref<Object3D<Event>> = useRef<Object3D<Event>>(null);
  const wheelFrontFirstAxisRightRef = useRef<Object3D<Event>>(null);
  const wheelFrontSecondAxisLeftRef = useRef<Object3D<Event>>(null);
  const wheelFrontSecondAxisRightRef = useRef<Object3D<Event>>(null);

  const wheelRearFirstAxisLeftRef = useRef<Object3D<Event>>(null);
  const wheelRearFirstAxisRightRef = useRef<Object3D<Event>>(null);
  const wheelRearSecondAxisLeftRef = useRef<Object3D<Event>>(null);
  const wheelRearSecondAxisRightRef = useRef<Object3D<Event>>(null);

  const wheelInfo = {
    radius: wheelRadius,
    // directionLocal: [0, 0, 0] as Triplet,
    directionLocal: [0, -1.239, 0] as Triplet,
    suspensionStiffness: 30, //
    // suspensionRestLength: 1, //
    maxSuspensionForce: 1e5,
    maxSuspensionTravel: 0.9,
    // maxSuspensionTravel: 1,
    // dampingRelaxation: 4,
    dampingRelaxation: 6,
    // dampingRelaxation: 10,
    dampingCompression: 2.2,
    axleLocal: [-1, 0, 0] as Triplet,
    // chassisConnectionPointLocal: [1, 0, 1] as Triplet,
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: 6,
    // customSlidingRotationalSpeed: 2,
    // customSlidingRotationalSpeed: 30,
    frictionSlip: 2
    // frictionSlip: .01
    // frictionSlip: 2
  };

  // front axises
  const wheelFrontFirstAxisLeftInfo: WheelInfoOptions = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [
      -wheelAxisWidth / 2,
      wheelAxisHeight,
      frontFirstAxis
    ]
  };
  const wheelFrontFirstAxisRightInfo: WheelInfoOptions = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [
      +wheelAxisWidth / 2,
      wheelAxisHeight,
      frontFirstAxis
    ]
  };
  const wheelFrontSecondAxisLeftInfo: WheelInfoOptions = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [
      -wheelAxisWidth / 2,
      wheelAxisHeight,
      frontSecondAxis
    ]
  };
  const wheelFrontSecondAxisRightInfo: WheelInfoOptions = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [
      +wheelAxisWidth / 2,
      wheelAxisHeight,
      frontSecondAxis
    ]
  };
  //// rear axises
  const wheelRearFirstAxisLeftInfo: WheelInfoOptions = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [
      -wheelAxisWidth / 2,
      wheelAxisHeight,
      rearFirstAxis
    ]
  };
  const wheelRearFirstAxisRightInfo: WheelInfoOptions = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [
      +wheelAxisWidth / 2,
      wheelAxisHeight,
      rearFirstAxis
    ]
  };
  const wheelRearSecondAxisLeftInfo: WheelInfoOptions = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [
      -wheelAxisWidth / 2,
      wheelAxisHeight,
      rearSecondAxis
    ]
  };
  const wheelRearSecondAxisRightInfo: WheelInfoOptions = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [
      +wheelAxisWidth / 2,
      wheelAxisHeight,
      rearSecondAxis
    ]
  };

  const raycastVehicleParams = {
    chassisBody: chassisRef,
    wheels: [
      wheelFrontFirstAxisLeftRef,
      wheelFrontFirstAxisRightRef,
      wheelFrontSecondAxisLeftRef,
      wheelFrontSecondAxisRightRef,

      wheelRearFirstAxisLeftRef,
      wheelRearFirstAxisRightRef,
      wheelRearSecondAxisLeftRef,
      wheelRearSecondAxisRightRef
    ],
    wheelInfos: [
      wheelFrontFirstAxisLeftInfo,
      wheelFrontFirstAxisRightInfo,
      wheelFrontSecondAxisLeftInfo,
      wheelFrontSecondAxisRightInfo,

      wheelRearFirstAxisLeftInfo,
      wheelRearFirstAxisRightInfo,
      wheelRearSecondAxisLeftInfo,
      wheelRearSecondAxisRightInfo
    ]

    // indexForwardAxis: 2,
    // indexRightAxis: 0,
    // indexUpAxis: 1
  };
  const [vehicle, api] = useRaycastVehicle(() => raycastVehicleParams);

  // for debug ---------------------------------------
  window.vehicle = vehicle;
  const vehicleApi:RaycastVehiclePublicApi = api;
  window.vehicleApi = vehicleApi
  window.vehiclewheelRefs = raycastVehicleParams.wheels;
  window.vehiclewheelInfos = raycastVehicleParams.wheelInfos;
  window.Vector3 = Vector3;
  // /for debug --------------------------------------

  // const controls = useContext(ControlsContext);
  const controls = useControls();
  const actualVelocity = useRef<Vector3>(null)
  const totalVelocity = useRef<number>(0)
  const turnFactor = useRef(1)
  // const turnAmountT = useRef(0)
  useEffect(() => {
    // @ts-ignore
    (chassisRef?.current?.api).velocity.subscribe((v) => {

      const vec3 = new Vector3(v[0], v[1], v[2])
      const euclideanDist = vec3.length()
      // set turn factor as an eighth of the velocity
      turnFactor.current = euclideanDist/8;
  })
  }, [])
  useFrame(() => {
    if (!controls) {
      return;
    }

    let {
      forward,
      backward,
      left,
      right,
      brake,
      reset
    } = controls.playerUnit;
    const { forward: coopForward, backward: coopBackward, left: coopLeft, right: coopRight, brake: coopBrake } = controls.coopPlayerUnit
    // moving
    if (playerIndex === PLAYER_2) {
      forward = coopForward
      backward = coopBackward;
      left = coopLeft
      right = coopRight;
      brake = coopBrake;
    }
    let turnAmount = 0.5*turnFactor.current
    for (let e = 0; e < 8; e++) {
      api.applyEngineForce(
        forward || backward
          ? engineForce * (forward && !backward ? -1 : +1)
          : 0,
        e
      );
    }
    // /moving

    // steering
    // front axises
    // first front axis
    for (let s = 0; s < 2; s++) {
      api.setSteeringValue(
        left || right
          ? steerFrontSecondAxisAngleRad * (left && !right ? +turnAmount : -turnAmount)
          : 0,
        s
      );
    }
    // second front axis
    for (let s = 2; s < 4; s++) {
      api.setSteeringValue(
        left || right
          ? steerFrontFirstAxisesRad * (left && !right ? +turnAmount : -turnAmount)
          : 0,
        s
      );
    }
    //
    // rear axises
    // first rear axis
    for (let s = 4; s < 6; s++) {
      api.setSteeringValue(
        left || right
          ? steerRearSecondAxisAngleRad * (left && !right ? +turnAmount : -turnAmount)
          : 0,
        s
      );
    }
    // second rear axis
    for (let s = 6; s < 8; s++) {
      api.setSteeringValue(
        left || right
          ? steerReaFirstrAxisesRad * (left && !right ? +turnAmount : -turnAmount)
          : 0,
        s
      );
    }
    // /steering

    // breaks
    for (let b = 0; b < 8; b++) {
      // for (let b = 4; b < 8; b++) {
      api.setBrake(brake ? maxBrake : 0, b);
    }
    // /breaks

    if (reset) {
      if (chassisRef && chassisRef.current) {
        const [x,_y,z] = chassisRef.current.api.position
        chassisRef.current.api.position.set([x, position[1], z]);
        chassisRef.current.api.velocity.set(...velocity);
        chassisRef.current.api.angularVelocity.set(...angularVelocity);
        chassisRef.current.api.rotation.set(...rotation);
      }
    }
  });

  const getChassisConnectionPointLocal = (wheelIndex: number) => {
    if (raycastVehicleParams.wheelInfos[wheelIndex]) {
      return raycastVehicleParams.wheelInfos[wheelIndex]
        .chassisConnectionPointLocal;
    }

    return new Vector3();
  };

  // const [showAxesHelpers, setShowAxesHelpers] = useState(true);
  const [showAxesHelpers, setShowAxesHelpers] = useState(false);

  return (
    <group ref={vehicle || undefined} name="vehicle">
      <Chassis
      cameraPosition={cameraPosition}
        ref={chassisRef}
        rotation={rotation}
        position={position}
        angularVelocity={angularVelocity}
        velocity={velocity}
        printCollisionInfo={true} /////////////////////////////////
        color={props?.color}
        playerIndex={playerIndex}
      />

      {showAxesHelpers && (
        <axesHelper name="chassis-position" position={position} />
      )}

      {showAxesHelpers && (
        <>
          {/* wheels chassis connection point */}
          <axesHelper
            name="helper-wheel-front-first-axis-left"
            position={getChassisConnectionPointLocal(0)}
          />
          <axesHelper
            name="helper-wheel-front-first-axis-right"
            position={getChassisConnectionPointLocal(1)}
          />
          <axesHelper
            name="helper-wheel-front-second-axis-left"
            position={getChassisConnectionPointLocal(2)}
          />
          <axesHelper
            name="helper-wheel-front-second-axis-right"
            position={getChassisConnectionPointLocal(3)}
          />

          <axesHelper
            name="helper-wheel-rear-first-axis-left"
            position={getChassisConnectionPointLocal(4)}
          />
          <axesHelper
            name="helper-wheel-rear-first-axis-right"
            position={getChassisConnectionPointLocal(5)}
          />
          <axesHelper
            name="helper-wheel-rear-second-axis-left"
            position={getChassisConnectionPointLocal(6)}
          />
          <axesHelper
            name="helper-wheel-rear-second-axis-right"
            position={getChassisConnectionPointLocal(7)}
          />
          {/* /wheels chassis connection point */}
        </>
      )}

      <Wheel
        ref={wheelFrontFirstAxisLeftRef}
        radius={wheelRadius}
        depth={wheelDepth}
        leftSide
        name="wheel-front-first-axis-left"
        printCollisionInfo={true} /////////////////////////////////
      />
      <Wheel
        ref={wheelFrontFirstAxisRightRef}
        radius={wheelRadius}
        depth={wheelDepth}
        name="wheel-front-first-axis-right"
      />

      <Wheel
        ref={wheelFrontSecondAxisLeftRef}
        radius={wheelRadius}
        depth={wheelDepth}
        leftSide
        name="wheel-front-second-axis-left"
      />
      <Wheel
        ref={wheelFrontSecondAxisRightRef}
        radius={wheelRadius}
        depth={wheelDepth}
        name="wheel-front-second-axis-right"
      />

      <Wheel
        ref={wheelRearFirstAxisLeftRef}
        radius={wheelRadius}
        depth={wheelDepth}
        leftSide
        name="wheel-rear-first-axis-left"
      />
      <Wheel
        ref={wheelRearFirstAxisRightRef}
        radius={wheelRadius}
        depth={wheelDepth}
        name="wheel-rear-first-axis-right"
      />

      <Wheel
        ref={wheelRearSecondAxisLeftRef}
        radius={wheelRadius}
        depth={wheelDepth}
        leftSide
        name="wheel-rear-second-axis-left"
      />
      <Wheel
        ref={wheelRearSecondAxisRightRef}
        radius={wheelRadius}
        depth={wheelDepth}
        name="wheel-rear-second-axis-right"
      />
    </group>
  );
};

export default Vehicle;
