import Scene from '../components/Scene';
import GameProvider from '../providers/GameProvider';

const Game = () => {
    return (
        <GameProvider>
            <Scene />
        </GameProvider>
    );
};

export default Game;
