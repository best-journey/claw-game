import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { createRef, forwardRef, ForwardRefRenderFunction, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Vector3 } from 'three';
import { angleToRadian, clonePosition, cloneRotation, cloneScale, getPosition, getRotation, getScale } from '../utils';
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

    const floor = useGLTF("/floor.glb");
    const clawMachine = useGLTF("/clawMachine.glb");
    const clawRest = useGLTF("/clawRest.glb");
    const clawRest1 = useGLTF("/clawRest1.glb");
    const clawRest2 = useGLTF("/clawRest2.glb");
    const clawRest3 = useGLTF("/clawRest3.glb");
    const claw1 = useGLTF("/claw1.glb");
    const claw2 = useGLTF("/claw2.glb");
    const claw3 = useGLTF("/claw3.glb");
    const blueBall = useGLTF("/ball-blue.glb");
    const greenBall = useGLTF("/ball-green.glb");
    const pinkBall = useGLTF("/ball-pink.glb");
    const redBall = useGLTF("/ball-red.glb");
    const yellowBall = useGLTF("/ball-yellow.glb");

    const balls = [blueBall, greenBall, pinkBall, redBall, yellowBall]

    const [showScene, setShowScene] = useState<any>();
    const [isPicking, setIsPicking] = useState(false);
    const clawRestRef = useRef<any>();
    const clawRest1Ref = useRef<any>();
    const clawRest2Ref = useRef<any>();
    const clawRest3Ref = useRef<any>();
    const claw1Ref = useRef<any>();
    const claw2Ref = useRef<any>();
    const claw3Ref = useRef<any>();
    const animationQueueRef = useRef<any[]>([]);
    const selectedIndexRef = useRef<number | null>(null);
    const ballRefs = useRef(Array.from({ length: 54 }, () => createRef<any>()));

    const joystickRef = useRef<any>({ x: 0, z: 0 });
    const onJoystick = (x: number, z: number) => {
        joystickRef.current.x = x;
        joystickRef.current.z = z;
    }

    const catchBall = () => {
        const x1 = clawRest1Ref.current.position.x;
        const z1 = clawRestRef.current.position.z;
        const distances = ballRefs.current.map((ballRef, index) => {
            const translation = ballRef.current?.translation();
            const x2 = translation.x;
            const y2 = translation.y;
            const z2 = translation.z;
            return {
                distance: Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - 2) * (y2 - 2) + (z2 - z1) * (z2 - z1)),
                index,
                translation,
            };
        });

        distances.sort((d1, d2) => d1.distance - d2.distance);
        selectedIndexRef.current = distances[0].index;

        if (selectedIndexRef.current != null) {
            const selectedBall = ballRefs.current[selectedIndexRef.current].current;
            selectedBall.setGravityScale(0);
        }
    };

    const releaseBall = () => {
        if (selectedIndexRef.current != null) {
            const selectedBall = ballRefs.current[selectedIndexRef.current].current;
            selectedBall.setGravityScale(1);
            selectedIndexRef.current = null;
        }
    }

    const spreadClawAnimation = useMemo(() => {
        return [
            { ref: claw1Ref, name: 'claw1', rotation: [0, 0, 0], start: 0, duration: 0.3 },
            { ref: claw2Ref, name: 'claw2', rotation: [0, 0, 0], start: 0, duration: 0.3 },
            { ref: claw3Ref, name: 'claw3', rotation: [0, 0, 0], start: 0, duration: 0.3, cb: () => setIsPicking(false) },
        ];
    }, []);

    const releaseAnimationSet = useMemo(() => {
        return [
            { ref: clawRest1Ref, name: 'clawRest1', position: [-0.75, 0, 0], start: 0, duration: 1.5 },
            { ref: clawRestRef, name: 'clawRest', position: [0, 0, 0.5], start: 0, duration: 1.5 },
            { ref: claw1Ref, name: 'claw1', rotation: [0, 0, 0], start: 1.7, duration: 0.3 },
            { ref: claw2Ref, name: 'claw2', rotation: [0, 0, 0], start: 1.7, duration: 0.3 },
            { ref: claw3Ref, name: 'claw3', rotation: [0, 0, 0], start: 1.7, duration: 0.3, cb: releaseBall },
            { ref: clawRest1Ref, name: 'clawRest1', position: [0, 0, 0], start: 2.2, duration: 1.5 },
            { ref: clawRestRef, name: 'clawRest', position: [0, 0, 0], start: 2.2, duration: 1.5, cb: () => setIsPicking(false) },
        ]
    }, []);

    const playNextAnimation = useCallback(() => {
        setTimeout(() => {
            if (selectedIndexRef.current != null) {
                const selectedBall = ballRefs.current[selectedIndexRef.current].current;
                selectedBall.setLinvel({ x: 0, y: 0, z: 0 });
                animationQueueRef.current.push({ animationSet: releaseAnimationSet, startTime: 0, isPlaying: false });
            } else {
                animationQueueRef.current.push({ animationSet: spreadClawAnimation, startTime: 0, isPlaying: false });
            }
        }, 200);
    }, [releaseAnimationSet, spreadClawAnimation]);

    const catchAnimationSet = useMemo(() => {
        return [
            { ref: clawRest2Ref, name: 'clawRest2', scale: [1, 8, 1], start: 0, duration: 1.5 },
            { ref: clawRest3Ref, name: 'clawRest3', position: [0, -1.2, 0], start: 0, duration: 1.5, cb: catchBall },
            { ref: claw1Ref, name: 'claw1', rotation: [0.35, 0, 0], start: 1.7, duration: 0.3 },
            { ref: claw2Ref, name: 'claw2', rotation: [0.35, 0, 0], start: 1.7, duration: 0.3 },
            { ref: claw3Ref, name: 'claw3', rotation: [0.35, 0, 0], start: 1.7, duration: 0.3 },
            { ref: clawRest2Ref, name: 'clawRest2', scale: [1, 1, 1], start: 2.2, duration: 1.5 },
            { ref: clawRest3Ref, name: 'clawRest3', position: [0, 0, 0], start: 2.2, duration: 1.5, cb: playNextAnimation },
        ];
    }, [playNextAnimation]);

    const onPick = () => {
        if (isPicking) return;
        setIsPicking(true);
        animationQueueRef.current.push({ animationSet: catchAnimationSet, startTime: 0, isPlaying: false });
    }

    const initGame = useCallback(async () => {
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
            z = Math.max(-0.75, Math.min(0.45, z));
            x = Math.max(-0.82, Math.min(0.8, x));
            clawRestRef.current.position.z = z;
            clawRest1Ref.current.position.x = x;
        }

        if (selectedIndexRef.current != null) {
            const x = clawRest1Ref.current.position.x;
            const y = clawRest3Ref.current.position.y;
            const z = clawRestRef.current.position.z;
            const ball = ballRefs.current[selectedIndexRef.current].current;
            ball.setTranslation(new Vector3(x, y + 3.05, z));
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

    return (
        <>
            <Environment
                files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr"
            />
            <ambientLight intensity={2} />
            <pointLight position={[-2, 5, 8]} intensity={50} castShadow />
            <primitive object={floor.scene} receiveShadow position={[0, -0.25, 0]} />
            <group ref={clawRestRef}>
                <group position={[0, 3.28, 0]}>
                    <primitive object={clawRest.scene} />
                    <group ref={clawRest1Ref} >
                        <primitive object={clawRest1.scene} />
                        <primitive ref={clawRest2Ref} object={clawRest2.scene} position={[0, 0.36, 0]} />
                        <group ref={clawRest3Ref}>
                            <primitive object={clawRest3.scene} />
                            <group rotation={[0, -2.0944, 0]}>
                                <primitive ref={claw1Ref} object={claw3.scene} position={[0, 0, 0.113]} />
                            </group>
                            <group>
                                <primitive ref={claw2Ref} object={claw1.scene} position={[0, 0, 0.113]} />
                            </group>
                            <group rotation={[0, 2.0944, 0]}>
                                <primitive ref={claw3Ref} object={claw2.scene} position={[0, 0, 0.113]} />
                            </group>
                        </group>
                    </group>
                </group>
            </group>
            <Physics>
                {showScene && Array.from({ length: 54 }).map((_, index) => {
                    const x = 0.25 + Math.floor((index % 9) / 3) * 0.3;
                    const y = 2 + Math.floor(index / 9) * 0.3;
                    const z = -0.5 + (index % 3) * 0.3;
                    return <Ball key={index} ref={ballRefs.current[index]} obj={balls[index % 5].scene} position={[x, y, z]} />
                })}
                <RigidBody ccd type="fixed" colliders="trimesh">
                    <primitive object={clawMachine.scene} castShadow />
                </RigidBody>
            </Physics >
            <OrbitControls
                minAzimuthAngle={angleToRadian(-10)}
                maxAzimuthAngle={angleToRadian(10)}
                minPolarAngle={angleToRadian(65)}
                maxPolarAngle={angleToRadian(85)}
                minDistance={2.5}
                maxDistance={5.5}
                target={[0.0, 2.4, 0.0]}
                enablePan={false}
            />
        </>
    )
}

export default forwardRef(Scene);
