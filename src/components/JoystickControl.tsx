import { Box } from "@chakra-ui/react";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { DownIcon, LeftIcon, RightIcon, UpIcon } from "./icons";

const JoystickControl: FC<{
    onJoystick: (x: number, z: number) => void;
}> = ({ onJoystick }) => {
    const ref = useRef<any>();
    const [isDragging, setIsDragging] = useState(false);
    const [joystickPos, setJoystickPos] = useState({ x: 0, z: 0 });

    const updateMousePos = useCallback((e: any) => {
        const rect = ref.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;

        let x = relativeX - rect.width / 2;
        let z = relativeY - rect.height / 2;

        x = Math.min(x, x);
        z = Math.min(z, z);

        const d = Math.hypot(x, z);
        if (d > 80) {
            x *= 80 / d;
            z *= 80 / d;
        }

        setJoystickPos({ x, z });
        onJoystick(x, z);
    }, [onJoystick]);

    const handleMouseDown = (e: any) => {
        setIsDragging(true);
        updateMousePos(e);
    };

    const handleMouseMove = useCallback((e: any) => {
        if (isDragging)
            updateMousePos(e);
    }, [isDragging, updateMousePos]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setJoystickPos({ x: 0, z: 0 });
        onJoystick(0, 0);
    }, [onJoystick]);

    useEffect(() => {
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseMove, handleMouseUp]);

    return (
        <Box ref={ref} position='absolute' zIndex={10} left='64px' bottom='64px' w='160px' h='160px' bg='#0004' rounded='full' cursor='pointer' onMouseDown={handleMouseDown}>
            <Box position='absolute' left='calc(50% - 30px)' top='calc(50% - 30px)' w='60px' h='60px' bg='white' p={1} rounded='full' style={{ transform: `translate(${joystickPos?.x}px, ${joystickPos?.z}px)` }}>
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
