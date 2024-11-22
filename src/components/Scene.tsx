import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { forwardRef, ForwardRefRenderFunction, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import Claw from '../components/Claw';
import OBJ from '../components/OBJ';
import { loadOBJ } from '../utils';
import Ball from './Ball';
import ClawMachine from './ClawMachine';

const pickAnimationSet = [
    { name: 'clawRest2', scale: [1, 8, 1], start: 0, duration: 2 },
    { name: 'clawRest3', position: [0, -1.3, 0], start: 0, duration: 2 },
    { name: 'claw1', rotation: [0, 0, 0], start: 2.5, duration: 0.5 },
    { name: 'claw2', rotation: [0, 0, 0], start: 2.5, duration: 0.5 },
    { name: 'claw3', rotation: [0, 0, 0], start: 2.5, duration: 0.5 },
    { name: 'clawRest2', scale: [1, 1, 1], start: 3.5, duration: 1.5 },
    { name: 'clawRest3', position: [0, 0, 0], start: 3.5, duration: 1.5 },
    { name: 'clawRest1', position: [-0.55, 0, 0], start: 5.5, duration: 2 },
    { name: 'clawRest', position: [0, 0, 0.35], start: 5.5, duration: 2 },
    { name: 'claw1', rotation: [-0.25, 0, 0], start: 8, duration: 0.5 },
    { name: 'claw2', rotation: [-0.25, 0, 0], start: 8, duration: 0.5 },
    { name: 'claw3', rotation: [-0.25, 0, 0], start: 8, duration: 0.5 },
    { name: 'clawRest1', position: [0, 0, 0], start: 9, duration: 2 },
    { name: 'clawRest', position: [0, 0, 0], start: 9, duration: 2 },
];

let animationQueue: any[] = [];

interface IState {
    position: any;
    rotation: any;
    scale: any;
}

interface IStateMap {
    [key: string]: IState;
}

interface IObjectMap {
    [key: string]: any;
}

const stateMap: IStateMap = {};

const clonePosition = (p: any) => [p.x, p.y, p.z];
const cloneRotation = (r: any) => [r.x, r.y, r.z];
const cloneScale = (s: any) => [s.x, s.y, s.z];

const animatePosition = (p: any, p1: any, p2: any, a: any) => {
    p.x = p1[0] + (p2[0] - p1[0]) * a;
    p.y = p1[1] + (p2[1] - p1[1]) * a;
    p.z = p1[2] + (p2[2] - p1[2]) * a;
}

const animateRotation = (r: any, r1: any, r2: any, a: any) => {
    r.x = r1[0] + (r2[0] - r1[0]) * a;
    r.y = r1[1] + (r2[1] - r1[1]) * a;
    r.z = r1[2] + (r2[2] - r1[2]) * a;
}

const animateScale = (s: any, s1: any, s2: any, a: any) => {
    s.x = s1[0] + (s2[0] - s1[0]) * a;
    s.y = s1[1] + (s2[1] - s1[1]) * a;
    s.z = s1[2] + (s2[2] - s1[2]) * a;
}

const Scene: ForwardRefRenderFunction<
    any,
    {
        setIsLoading: (isLoading: boolean) => void;
        setProgress: (progress: number) => void;
    }
> = (
    {
        setIsLoading,
        setProgress,
    },
    ref
) => {
        useImperativeHandle(ref, () => ({ onPick, onJoystick }));

        const [isPicking, setIsPicking] = useState(false);
        const onPick = () => {
            if (!isPicking) {
                setIsPicking(true);
                animationQueue.push({
                    animationSet: pickAnimationSet, startTime: 0, isPlaying: false, onEnd: () => {
                        setIsPicking(false);
                    }
                });
            }
        }
        const joystickRef = useRef<any>({ x: 0, z: 0 });
        const onJoystick = (x: number, z: number) => {
            joystickRef.current.x = x;
            joystickRef.current.z = z;
        }

        const [showScene, setShowScene] = useState<any>();
        const [wall, setWall] = useState<any>();
        const [clawMachine, setClawMachine] = useState<any>();
        const [clawRest, setClawRest] = useState<any>();
        const [clawRest1, setClawRest1] = useState<any>();
        const [clawRest2, setClawRest2] = useState<any>();
        const [clawRest3, setClawRest3] = useState<any>();
        const [claw1, setClaw1] = useState<any>();
        const [claw2, setClaw2] = useState<any>();
        const [claw3, setClaw3] = useState<any>();
        const [floor, setFloor] = useState<any>();
        const [balls, setBalls] = useState<any[]>();
        const clawRestRef = useRef<any>();
        const clawRest1Ref = useRef<any>();
        const clawRest2Ref = useRef<any>();
        const clawRest3Ref = useRef<any>();
        const claw1Ref = useRef<any>();
        const claw2Ref = useRef<any>();
        const claw3Ref = useRef<any>();

        const objects = useMemo<IObjectMap>(() => {
            return {
                'clawRest': clawRestRef,
                'clawRest1': clawRest1Ref,
                'clawRest2': clawRest2Ref,
                'clawRest3': clawRest3Ref,
                'claw1': claw1Ref,
                'claw2': claw2Ref,
                'claw3': claw3Ref,
            };
        }, []);

        const initGame = async () => {
            const wall = await loadOBJ('/wall.obj', '/wall.mtl');
            setWall(wall);
            const floor = await loadOBJ('/floor.obj', '/floor.mtl');
            setFloor(floor);
            const clawRest = await loadOBJ('/clawRest.obj', '/clawRest.mtl');
            setClawRest(clawRest);
            const clawRest1 = await loadOBJ('/clawRest1.obj', '/clawRest.mtl');
            setClawRest1(clawRest1);
            const clawRest2 = await loadOBJ('/clawRest2.obj', '/clawRest.mtl');
            setClawRest2(clawRest2);
            const clawRest3 = await loadOBJ('/clawRest3.obj', '/clawRest.mtl');
            setClawRest3(clawRest3);
            const claw1 = await loadOBJ('/claw1.obj', '/claw1.mtl');
            setClaw1(claw1);
            const claw2 = await loadOBJ('/claw2.obj', '/claw2.mtl');
            setClaw2(claw2);
            const claw3 = await loadOBJ('/claw3.obj', '/claw3.mtl');
            setClaw3(claw3);
            const clawMachine = await loadOBJ('/clawMachine.obj', '/clawMachine.mtl');
            setClawMachine(clawMachine);
            const red = await loadOBJ('/ball.obj', '/red.mtl');
            const green = await loadOBJ('/ball.obj', '/green.mtl');
            const blue = await loadOBJ('/ball.obj', '/blue.mtl');
            const yellow = await loadOBJ('/ball.obj', '/yellow.mtl');
            const pink = await loadOBJ('/ball.obj', '/pink.mtl');
            const orange = await loadOBJ('/ball.obj', '/orange.mtl');
            setBalls([red, green, blue, yellow, pink, orange]);
            setShowScene(true);
            setProgress(100);
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }

        useEffect(() => {
            initGame();
            const timerId = setInterval(() => {
                if (clawRestRef.current && clawRest1Ref.current) {
                    const z = clawRestRef.current.position.z + joystickRef.current.z * 0.0001;
                    const x = clawRest1Ref.current.position.x + joystickRef.current.x * 0.0001;
                    clawRestRef.current.position.z = Math.max(-0.95, Math.min(0.6, z));
                    clawRest1Ref.current.position.x = Math.max(-0.62, Math.min(0.48, x));
                }
            }, 16.6667);
            return () => clearInterval(timerId);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        useFrame(({ clock }) => {
            animationQueue = animationQueue.filter((item) => {
                if (item.animationSet.length == 0) {
                    item.onEnd?.();
                    return false;
                }
                return true;
            });
            animationQueue = animationQueue.map((item) => {
                let startTime = item.startTime;
                if (!item.isPlaying) {
                    startTime = clock.elapsedTime;
                }
                const elapsedTime = clock.elapsedTime - startTime;
                let animationSet = item.animationSet;
                animationSet = animationSet.filter((animation: any) => {
                    const valid = elapsedTime < animation.start + animation.duration;
                    if (!valid && stateMap[animation.name]) {
                        delete stateMap[animation.name];
                    }
                    return valid;
                });
                animationSet.map((animation: any) => {
                    if (elapsedTime > animation.start) {
                        const object = objects[animation.name];
                        let state = stateMap[animation.name];
                        if (!state) {
                            state = {
                                position: clonePosition(object.current?.position),
                                rotation: cloneRotation(object.current?.rotation),
                                scale: cloneScale(object.current?.scale),
                            };
                            stateMap[animation.name] = state;
                        }

                        const p = (elapsedTime - animation.start) / (animation.duration);

                        if (animation.position) {
                            animatePosition(object.current!.position, state.position, animation.position, p);
                        }

                        if (animation.rotation) {
                            animateRotation(object.current!.rotation, state.rotation, animation.rotation, p);
                        }

                        if (animation.scale) {
                            animateScale(object.current!.scale, state.scale, animation.scale, p);
                        }
                    }
                });
                return { ...item, animationSet, startTime, isPlaying: true };
            });
        });

        if (showScene) {
            return (
                <>
                    <ambientLight intensity={4} />
                    <pointLight position={[-2, 5, 8]} intensity={100} castShadow />
                    <OBJ obj={wall} position={[0, 1.6, 0]} />
                    <OBJ obj={floor} />
                    <Physics timeStep="vary">
                        <group ref={clawRestRef}>
                            <group position={[0, 1.28, 0]}>
                                <OBJ obj={clawRest} />
                                <group ref={clawRest1Ref} >
                                    <OBJ obj={clawRest1} />
                                    <OBJ ref={clawRest2Ref} obj={clawRest2} position={[0, 0.36, 0]} />
                                    <group ref={clawRest3Ref}>
                                        <OBJ obj={clawRest3} />
                                        <group rotation={[0, 2.0944, 0]}>
                                            <group position={[0, 0, 0.113]}>
                                                <RigidBody ccd colliders="hull">
                                                    <Claw ref={claw1Ref} obj={claw1} />
                                                </RigidBody>
                                            </group>
                                        </group>
                                        <group rotation={[0, 0, 0]}>
                                            <group position={[0, 0, 0.113]}>
                                                <RigidBody ccd colliders="hull">
                                                    <Claw ref={claw2Ref} obj={claw2} />
                                                </RigidBody>
                                            </group>
                                        </group>
                                        <group rotation={[0, -2.0944, 0]}>
                                            <group position={[0, 0, 0.113]}>
                                                <RigidBody ccd colliders="hull">
                                                    <Claw ref={claw3Ref} obj={claw3} />
                                                </RigidBody>
                                            </group>
                                        </group>
                                    </group>
                                </group>
                            </group>
                        </group>
                        {Array.from({ length: 27 }).map((_, index) => {
                            const x = Math.floor((index % 9) / 3) * 0.28;
                            const y = Math.floor(index / 9) * 0.28;
                            const z = -0.56 + (index % 3) * 0.28;
                            return <Ball key={index} obj={balls?.[index % 6]} position={[x, y, z]} />
                        })}
                        <ClawMachine obj={clawMachine} />
                    </Physics>
                    <OrbitControls
                    // minAzimuthAngle={angleToRadian(-20)}
                    // maxAzimuthAngle={angleToRadian(20)}
                    // minPolarAngle={angleToRadian(65)}
                    // maxPolarAngle={angleToRadian(85)}
                    // minDistance={2.5}
                    // maxDistance={4.5}
                    // enablePan={false}
                    />
                </>
            )
        }
        return <></>
    }

export default forwardRef(Scene);
