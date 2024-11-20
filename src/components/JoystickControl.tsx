import { Box } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "../providers/GameProvider";
import { DownIcon, LeftIcon, RightIcon, UpIcon } from "./icons";

const JoystickControl = () => {
    const [isDragging, setIsDragging] = useState(false);
    const ref = useRef<any>();

    const { joystickPos, setJoystickPos } = useContext(GameContext);

    const updateMousePos = useCallback((e: any) => {
        const rect = ref.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;

        let x = relativeX - rect.width / 2;
        let y = relativeY - rect.height / 2;

        x = Math.min(x, x);
        y = Math.min(y, y);

        const d = Math.hypot(x, y);
        if (d > 80) {
            x *= 80 / d;
            y *= 80 / d;
        }

        setJoystickPos?.({ x, y });
    }, [setJoystickPos]);

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
        setJoystickPos?.({ x: 0, y: 0 });
    }, [setJoystickPos]);

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
            <Box position='absolute' left='calc(50% - 30px)' top='calc(50% - 30px)' w='60px' h='60px' bg='white' p={1} rounded='full' style={{ transform: `translate(${joystickPos?.x}px, ${joystickPos?.y}px)` }}>
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
