import { Box, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useEffect, useState } from 'react';
import { angleToRadian, loadOBJ } from '../utils';
import Ball from './Ball';
import ClawMachine from './ClawMachine';
import ProgressBar from './ProgressBar';

const Scene = () => {
    const [showScene, setShowScene] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [clawMachine, setClawMachine] = useState<any>();
    const [ball, setBall] = useState<any>();

    const load = async () => {
        const clawMachine = await loadOBJ('/clawMachine.obj', '/clawMachine.mtl');
        setClawMachine(clawMachine);
        const ball = await loadOBJ('/ball.obj', '/ball.mtl');
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
        <Box w='100vw' h='100vh'>
            <Modal isOpen={isLoading} onClose={() => { }}>
                <ModalOverlay bg='linear-gradient(135deg, #6f00ff, #00ffcc)' />
                <ModalContent my={0} py='120px' h='full' display='flex' justifyContent='end' alignItems='center' bg='none' shadow='none'>
                    <ProgressBar progress={progress} />
                </ModalContent>
            </Modal>
            {showScene && (
                <Canvas style={{ background: '#ffffff' }}>
                    <ambientLight intensity={4} />
                    <pointLight position={[-2, 5, 8]} intensity={100} />
                    <pointLight position={[2, -2, 8]} intensity={10} />
                    <Physics timeStep="vary">
                        <ClawMachine obj={clawMachine} />
                        <Ball obj={ball} position={[-0.3, 1, -0.6]} />
                        {/* <Ball obj={ball} position={[-0.3, 1, -0.3]} />
                        <Ball obj={ball} position={[0, 1, -0.6]} />
                        <Ball obj={ball} position={[0, 1, -0.3]} />
                        <Ball obj={ball} position={[0, 1, 0]} />
                        <Ball obj={ball} position={[0, 1, 0.3]} />
                        <Ball obj={ball} position={[0, 1, 0.6]} />
                        <Ball obj={ball} position={[0.3, 1, -0.6]} />
                        <Ball obj={ball} position={[0.3, 1, -0.3]} />
                        <Ball obj={ball} position={[0.3, 1, 0]} />
                        <Ball obj={ball} position={[0.3, 1, 0.3]} />
                        <Ball obj={ball} position={[0.3, 1, 0.6]} />
                        <Ball obj={ball} position={[-0.3, 1, -0.6]} />
                        <Ball obj={ball} position={[-0.3, 1, -0.3]} />
                        <Ball obj={ball} position={[0, 1.3, -0.6]} />
                        <Ball obj={ball} position={[0, 1.3, -0.3]} />
                        <Ball obj={ball} position={[0, 1.3, 0]} />
                        <Ball obj={ball} position={[0, 1.3, 0.3]} />
                        <Ball obj={ball} position={[0, 1.3, 0.6]} />
                        <Ball obj={ball} position={[0.3, 1.3, -0.6]} />
                        <Ball obj={ball} position={[0.3, 1.3, -0.3]} />
                        <Ball obj={ball} position={[0.3, 1.3, 0]} />
                        <Ball obj={ball} position={[0.3, 1.3, 0.3]} />
                        <Ball obj={ball} position={[0.3, 1.3, 0.6]} /> */}
                    </Physics>
                    <OrbitControls
                        minAzimuthAngle={angleToRadian(-30)}
                        maxAzimuthAngle={angleToRadian(30)}
                        minPolarAngle={angleToRadian(65)}
                        maxPolarAngle={angleToRadian(85)}
                        minDistance={3.5}
                        maxDistance={5.5}
                        enablePan={false}
                    />
                </Canvas>
            )}
        </Box>
    );
};

export default Scene;
