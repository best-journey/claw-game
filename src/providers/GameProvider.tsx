import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { IJoystick, IPosition } from "../interfaces";

export interface IGame {
    joystickPos?: IJoystick;
    setJoystickPos?: (joystick: IJoystick) => void;
    position?: IPosition;
    setPosition?: (position: IPosition) => void;
}

export const GameContext = createContext<IGame>({});

const GameProvider: FC<{
    children: ReactNode,
}> = ({ children }) => {
    const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });

    useEffect(() => {
        const timerId = setInterval(() => {
            setPosition(prev => {
                let x = prev.x + joystickPos.x * 0.0001;
                x = Math.max(-0.62, Math.min(0.48, x));
                let z = prev.z + joystickPos.y * 0.0001;
                z = Math.max(-0.95, Math.min(0.6, z));
                return { x, y: prev.y, z };
            });
        }, 16.6667);
        return () => clearInterval(timerId);
    }, [joystickPos]);

    return (
        <GameContext.Provider value={{ joystickPos, setJoystickPos, position, setPosition }}>
            {children}
        </GameContext.Provider>
    )
}

export default GameProvider;