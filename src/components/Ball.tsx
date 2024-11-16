import { RigidBody } from '@react-three/rapier';
import { FC } from 'react';
import { Group } from 'three';
import { InteractiveObject3DEventMap } from 'three/examples/jsm/Addons.js';

const Ball: FC<{
    obj: Group<InteractiveObject3DEventMap>,
    position?: any,
}> = ({ obj, position }) => {
    return (
        <RigidBody colliders="ball" position={position}>
            <primitive object={obj} />
        </RigidBody>
    )
}

export default Ball;
