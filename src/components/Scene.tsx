import { Box, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { useContext, useEffect, useState } from 'react';
import Claw from '../components/Claw';
import JoystickControl from '../components/JoystickControl';
import OBJ from '../components/OBJ';
import ProgressBar from '../components/ProgressBar';
import { GameContext } from '../providers/GameProvider';
import { angleToRadian, loadOBJ } from '../utils';
import Ball from './Ball';
import ButtonsControl from './ButtonsControl';
import ClawMachine from './ClawMachine';

const Scene = () => {
    const [showScene, setShowScene] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [wall, setWall] = useState<any>();
    const [clawMachine, setClawMachine] = useState<any>();
    const [clawRest, setClawRest] = useState<any>();
    const [clawRest1, setClawRest1] = useState<any>();
    const [clawRest2, setClawRest2] = useState<any>();
    const [clawRest3, setClawRest3] = useState<any>();
    const [claw1, setClaw1] = useState<any>();
    const [claw2, setClaw2] = useState<any>();
    const [claw3, setClaw3] = useState<any>();
    const [ball, setBall] = useState<any>();
    const [floor, setFloor] = useState<any>();

    const { position } = useContext(GameContext);

    const load = async () => {
        const wall = await loadOBJ('/wall.obj', '/wall.mtl', false, true);
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
        const clawMachine = await loadOBJ('/clawMachine.obj', '/clawMachine.mtl', true);
        setClawMachine(clawMachine);
        const ball = await loadOBJ('/ball.obj', '/ball.mtl', true, true);
        setBall(ball);
        setShowScene(true);
        setProgress(100);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <Box position='relative' w='100vw' h='100vh'>
            <Modal isOpen={isLoading} onClose={() => { }}>
                <ModalOverlay bg='linear-gradient(135deg, #6f00ff, #00ffcc)' />
                <ModalContent my={0} py='120px' h='full' display='flex' justifyContent='end' alignItems='center' bg='none' shadow='none'>
                    <ProgressBar progress={progress} />
                </ModalContent>
            </Modal>
            <JoystickControl />
            <ButtonsControl />
            {showScene && (
                <Canvas shadows='soft'>
                    <ambientLight intensity={4} />
                    <pointLight
                        position={[-2, 5, 8]} intensity={100} castShadow
                        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
                    />
                    <pointLight
                        position={[2, -2, 8]} intensity={10} castShadow
                        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
                    />
                    <OBJ obj={wall} position={[0, 1.6, 0]} />
                    <OBJ obj={floor} />
                    <Physics timeStep="vary">
                        <group position={[0, 1.28, position?.z || 0]}>
                            <OBJ obj={clawRest} />
                            <group position={[position?.x || 0, 0, 0]}>
                                <OBJ obj={clawRest1} />
                                <OBJ obj={clawRest2} position={[0, 0.36, 0]} />
                                <OBJ obj={clawRest3} />
                                <group rotation={[0, 2.0944, 0]}>
                                    <group position={[0, 0, 0.113]}>
                                        <RigidBody type='fixed' ccd colliders="trimesh">
                                            <Claw obj={claw1} />
                                        </RigidBody>
                                    </group>
                                </group>
                                <group rotation={[0, 0, 0]}>
                                    <group position={[0, 0, 0.113]}>
                                        <RigidBody type='fixed' ccd colliders="trimesh">
                                            <Claw obj={claw2} />
                                        </RigidBody>
                                    </group>
                                </group>
                                <group rotation={[0, -2.0944, 0]}>
                                    <group position={[0, 0, 0.113]}>
                                        <RigidBody type='fixed' ccd colliders="trimesh">
                                            <Claw obj={claw3} />
                                        </RigidBody>
                                    </group>
                                </group>
                            </group>
                        </group>
                        <ClawMachine obj={clawMachine} />
                        {Array.from({ length: 27 }).map((_, index) => {
                            const x = Math.floor((index % 9) / 3) * 0.28;
                            const y = Math.floor(index / 9) * 0.28;
                            const z = -0.28 + (index % 3) * 0.28;
                            return <Ball key={index} obj={ball} position={[x, y, z]} />
                        })}
                    </Physics>
                    <OrbitControls
                        // minAzimuthAngle={angleToRadian(-20)}
                        // maxAzimuthAngle={angleToRadian(20)}
                        minPolarAngle={angleToRadian(65)}
                        maxPolarAngle={angleToRadian(85)}
                        // minDistance={3.5}
                        maxDistance={5.5}
                        enablePan={false}
                    />
                </Canvas>
            )}
        </Box>
    )
}

export default Scene;
