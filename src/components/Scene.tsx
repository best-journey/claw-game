import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { createRef, forwardRef, ForwardRefRenderFunction, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Vector3 } from 'three';
import OBJ from '../components/OBJ';
import { angleToRadian, clonePosition, cloneRotation, cloneScale, getPosition, getRotation, getScale, loadOBJ } from '../utils';
import Ball from './Ball';

interface IState {
    position: any;
    rotation: any;
    scale: any;
}

interface IStateMap {
    [key: string]: IState;
}

const stateMap: IStateMap = {};

const Scene: ForwardRefRenderFunction<
    any,
    {
        setIsLoading: (isLoading: boolean) => void;
        setProgress: (progress: number) => void;
    }
> = ({ setIsLoading, setProgress, }, ref) => {
    useImperativeHandle(ref, () => ({ onPick, onJoystick }));

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
    const animationQueueRef = useRef<any[]>([]);
    const selectedIndexRef = useRef<number | null>(null);
    const ballRefs = useRef(Array.from({ length: 18 }, () => createRef<any>()));

    const joystickRef = useRef<any>({ x: 0, z: 0 });
    const onJoystick = (x: number, z: number) => {
        joystickRef.current.x = x;
        joystickRef.current.z = z;
    }

    const catchBall = () => {
        const x1 = clawRest1Ref.current.position.x;
        const z1 = clawRestRef.current.position.z;
        ballRefs.current.map((ballRef, index) => {
            const translation = ballRef.current?.translation();
            const x2 = translation.x;
            const z2 = translation.z;
            const d = Math.hypot(x2 - x1, z2 - z1);
            if (d < 0.115) {
                selectedIndexRef.current = index;
            }
        });

        if (selectedIndexRef.current) {
            ballRefs.current[selectedIndexRef.current].current.setGravityScale(0);
        }
    };

    const releaseBall = () => {
        if (selectedIndexRef.current) {
            ballRefs.current[selectedIndexRef.current].current.setGravityScale(1);
            selectedIndexRef.current = null;
        }
    }

    const spreadClawAnimation = useMemo(() => {
        return [
            { ref: claw1Ref, name: 'claw1', rotation: [0, 0, 0], start: 0, duration: 0.3 },
            { ref: claw2Ref, name: 'claw2', rotation: [0, 0, 0], start: 0, duration: 0.3 },
            { ref: claw3Ref, name: 'claw3', rotation: [0, 0, 0], start: 0, duration: 0.3 },
        ];
    }, []);

    const releaseAnimationSet = useMemo(() => {
        return [
            { ref: clawRest1Ref, name: 'clawRest1', position: [-0.6, 0, 0], start: 0, duration: 1.5 },
            { ref: clawRestRef, name: 'clawRest', position: [0, 0, 0.5], start: 0, duration: 1.5 },
            { ref: claw1Ref, name: 'claw1', rotation: [0, 0, 0], start: 1.7, duration: 0.3 },
            { ref: claw2Ref, name: 'claw2', rotation: [0, 0, 0], start: 1.7, duration: 0.3 },
            { ref: claw3Ref, name: 'claw3', rotation: [0, 0, 0], start: 1.7, duration: 0.3, cb: releaseBall },
            { ref: clawRest1Ref, name: 'clawRest1', position: [0, 0, 0], start: 2.2, duration: 1.5 },
            { ref: clawRestRef, name: 'clawRest', position: [0, 0, 0], start: 2.2, duration: 1.5 },
        ]
    }, []);

    const playNextAnimation = useCallback(() => {
        setTimeout(() => {
            if (selectedIndexRef.current) {
                animationQueueRef.current.push({ animationSet: releaseAnimationSet, startTime: 0, isPlaying: false });
            } else {
                animationQueueRef.current.push({ animationSet: spreadClawAnimation, startTime: 0, isPlaying: false });
            }
        }, 200);
    }, [releaseAnimationSet, spreadClawAnimation]);

    const catchAnimationSet = useMemo(() => {
        return [
            { ref: clawRest2Ref, name: 'clawRest2', scale: [1, 8, 1], start: 0, duration: 1.5 },
            { ref: clawRest3Ref, name: 'clawRest3', position: [0, -1.4, 0], start: 0, duration: 1.5, cb: catchBall },
            { ref: claw1Ref, name: 'claw1', rotation: [0.35, 0, 0], start: 1.7, duration: 0.3 },
            { ref: claw2Ref, name: 'claw2', rotation: [0.35, 0, 0], start: 1.7, duration: 0.3 },
            { ref: claw3Ref, name: 'claw3', rotation: [0.35, 0, 0], start: 1.7, duration: 0.3 },
            { ref: clawRest2Ref, name: 'clawRest2', scale: [1, 1, 1], start: 2.2, duration: 1.5 },
            { ref: clawRest3Ref, name: 'clawRest3', position: [0, 0, 0], start: 2.2, duration: 1.5, cb: playNextAnimation },
        ];
    }, [playNextAnimation]);

    const onPick = () => {
        animationQueueRef.current.push({ animationSet: catchAnimationSet, startTime: 0, isPlaying: false });
        playNextAnimation();
    }

    const initGame = useCallback(async () => {
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
    }, [setIsLoading, setProgress]);

    useEffect(() => {
        initGame();
    }, [initGame]);

    useFrame(({ clock }) => {
        if (clawRestRef.current && clawRest1Ref.current) {
            let z = clawRestRef.current.position.z + joystickRef.current.z * 0.0001;
            let x = clawRest1Ref.current.position.x + joystickRef.current.x * 0.0001;
            z = Math.max(-1.25, Math.min(0.75, z));
            x = Math.max(-0.85, Math.min(0.85, x));
            clawRestRef.current.position.z = z;
            clawRest1Ref.current.position.x = x;
        }

        if (selectedIndexRef.current) {
            const x = clawRest1Ref.current.position.x;
            const y = clawRest3Ref.current.position.y;
            const z = clawRestRef.current.position.z;
            const ball = ballRefs.current[selectedIndexRef.current].current;
            ball.setTranslation(new Vector3(x, y + 1.02, z));
        }

        animationQueueRef.current = animationQueueRef.current.filter((item) => item.animationSet.length > 0);
        animationQueueRef.current = animationQueueRef.current.map((item) => {
            let startTime = item.startTime;
            if (!item.isPlaying) {
                startTime = clock.elapsedTime;
            }
            const elapsedTime = clock.elapsedTime - startTime;
            let animationSet = item.animationSet;
            animationSet = animationSet.filter((animation: any) => {
                const valid = elapsedTime < animation.start + animation.duration;
                if (!valid) {
                    animation.cb?.();
                }
                if (!valid && stateMap[animation.name]) {
                    delete stateMap[animation.name];
                }
                return valid;
            });
            animationSet.map((animation: any) => {
                if (elapsedTime > animation.start) {
                    const object = animation.ref.current;
                    let state = stateMap[animation.name];
                    if (!state) {
                        state = {
                            position: clonePosition(object.position),
                            rotation: cloneRotation(object.rotation),
                            scale: cloneScale(object.scale),
                        };
                        stateMap[animation.name] = state;
                    }

                    const p = (elapsedTime - animation.start) / (animation.duration);

                    if (animation.position) {
                        const { x, y, z } = getPosition(state.position, animation.position, p);
                        object.position.x = x;
                        object.position.y = y;
                        object.position.z = z;
                    }

                    if (animation.rotation) {
                        const { x, y, z } = getRotation(state.rotation, animation.rotation, p);
                        object.rotation.x = x;
                        object.rotation.y = y;
                        object.rotation.z = z;
                    }

                    if (animation.scale) {
                        const { x, y, z } = getScale(state.scale, animation.scale, p);
                        object.scale.x = x;
                        object.scale.y = y;
                        object.scale.z = z;
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
                <OBJ obj={wall} />
                <OBJ obj={floor} />
                <group ref={clawRestRef}>
                    <group position={[0, 1.28, 0]}>
                        <OBJ obj={clawRest} />
                        <group ref={clawRest1Ref} >
                            <OBJ obj={clawRest1} />
                            <OBJ ref={clawRest2Ref} obj={clawRest2} position={[0, 0.36, 0]} />
                            <group ref={clawRest3Ref}>
                                <OBJ obj={clawRest3} />
                                <group rotation={[0, -2.0944, 0]}>
                                    <OBJ ref={claw1Ref} position={[0, 0, 0.113]} obj={claw3} />
                                </group>
                                <group>
                                    <OBJ ref={claw2Ref} position={[0, 0, 0.113]} obj={claw1} />
                                </group>
                                <group rotation={[0, 2.0944, 0]}>
                                    <OBJ ref={claw3Ref} position={[0, 0, 0.113]} obj={claw2} />
                                </group>
                            </group>
                        </group>
                    </group>
                </group>
                <Physics>
                    {Array.from({ length: 18 }).map((_, index) => {
                        const x = Math.floor((index % 9) / 3) * 0.3;
                        const y = Math.floor(index / 9) * 0.3;
                        const z = -0.6 + (index % 3) * 0.3;
                        return <Ball key={index} ref={ballRefs.current[index]} obj={balls?.[index % 6]} position={[x, y, z]} />
                    })}
                    <RigidBody ccd type="fixed" colliders="trimesh">
                        <OBJ obj={clawMachine} />
                    </RigidBody>
                </Physics >
                <OrbitControls
                    minAzimuthAngle={angleToRadian(-20)}
                    maxAzimuthAngle={angleToRadian(20)}
                    minPolarAngle={angleToRadian(65)}
                    maxPolarAngle={angleToRadian(85)}
                    minDistance={2.5}
                    maxDistance={5.5}
                    enablePan={false}
                />
            </>
        )
    }
    return <></>
}

export default forwardRef(Scene);
