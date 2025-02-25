import { Box, Modal, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import { Canvas } from '@react-three/fiber';
import { useRef, useState } from 'react';
import ButtonsControl from '../components/ButtonsControl';
import JoystickControl from '../components/JoystickControl';
import ProgressBar from '../components/ProgressBar';
import Scene from '../components/Scene';

const Game = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const ref = useRef<any>();

    return (
        <Box position='relative' w='100vw' h='100vh'>
            <Modal isOpen={isLoading} onClose={() => { }}>
                <ModalOverlay bg='linear-gradient(135deg, #6f00ff, #00ffcc)' />
                <ModalContent my={0} py='120px' h='full' display='flex' justifyContent='end' alignItems='center' bg='none' shadow='none'>
                    <ProgressBar progress={progress} />
                    <Text fontSize='xx-large' color='#dd3c6e'>
                        Loading...
                    </Text>
                </ModalContent>
            </Modal>
            <JoystickControl onJoystick={(x, z) => ref.current?.onJoystick(x, z)} />
            <ButtonsControl onStart={() => { }} onPick={() => ref.current?.onPick()} />
            <Canvas shadows='soft'>
                <Scene ref={ref} setIsLoading={setIsLoading} setProgress={setProgress} />
            </Canvas>
        </Box>
    );
};

export default Game;
