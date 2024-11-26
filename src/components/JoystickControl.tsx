import { Box } from "@chakra-ui/react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { DownIcon, LeftIcon, RightIcon, UpIcon } from "./icons";

const JoystickControl: FC<{
    onJoystick: (x: number, z: number) => void;
}> = ({ onJoystick }) => {
    const ref = useRef<any>();
    const [isDragging, setIsDragging] = useState(false);
    const [joystickPos, setJoystickPos] = useState({ x: 0, z: 0 });

    const updateJoystickPos = useCallback((clientX: number, clientY: number) => {
        const rect = ref.current.getBoundingClientRect();
        const relativeX = clientX - rect.left;
        const relativeY = clientY - rect.top;

        let x = relativeX - rect.width / 2;
        let z = relativeY - rect.height / 2;

        const d = Math.hypot(x, z);
        if (d > 50) {
            x *= 50 / d;
            z *= 50 / d;
        }

        setJoystickPos({ x, z });
        onJoystick(x, z);
    }, [onJoystick]);

    const handleStart = (e: any) => {
        setIsDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        updateJoystickPos(clientX, clientY);
    };

    const handleMove = useCallback((e: any) => {
        if (isDragging) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            updateJoystickPos(clientX, clientY);
        }
    }, [isDragging, updateJoystickPos]);

    const handleEnd = useCallback(() => {
        setIsDragging(false);
        setJoystickPos({ x: 0, z: 0 });
        onJoystick(0, 0);
    }, [onJoystick]);

    useEffect(() => {
        window.addEventListener("mouseup", handleEnd);
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchend", handleEnd);
        window.addEventListener("touchmove", handleMove);

        return () => {
            window.removeEventListener("mouseup", handleEnd);
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchend", handleEnd);
            window.removeEventListener("touchmove", handleMove);
        };
    }, [handleMove, handleEnd]);

    return (
        <Box
            ref={ref}
            position='absolute'
            zIndex={10}
            left={{ base: '16px', lg: '64px' }}
            bottom={{ base: '16px', lg: '64px' }}
            w='160px'
            h='160px'
            bg='#0004'
            rounded='full'
            cursor='pointer'
            onMouseDown={handleStart}
            onTouchStart={handleStart}
        >
            <Box
                position='absolute'
                left='calc(50% - 30px)'
                top='calc(50% - 30px)'
                w='60px'
                h='60px'
                bg='white'
                p={1}
                rounded='full'
                style={{ transform: `translate(${joystickPos?.x}px, ${joystickPos?.z}px)` }}
            >
                <Box w='full' h='full' bg='white' border='1px solid #0004' rounded='full' />
            </Box>
            <LeftIcon position='absolute' left={2} top='calc(50% - 6px)' />
            <RightIcon position='absolute' right={2} top='calc(50% - 6px)' />
            <UpIcon position='absolute' top={2} left='calc(50% - 6px)' />
            <DownIcon position='absolute' bottom={2} left='calc(50% - 6px)' />
        </Box>
    );
};

export default JoystickControl;