import { RigidBody } from '@react-three/rapier';
import { FC, useEffect, useState } from 'react';
import { Group } from 'three';
import { InteractiveObject3DEventMap } from 'three/examples/jsm/Addons.js';

const Ball: FC<{
    obj: Group<InteractiveObject3DEventMap>,
    position?: any,
}> = ({ obj, position }) => {
    const [ball, setBall] = useState<any>();

    useEffect(() => {
        setBall(obj.clone());
    }, [obj]);

    if (ball) {
        return (
            <RigidBody ccd colliders="ball" position={position}>
                <primitive object={ball} />
            </RigidBody>
        )
    }
    return <></>
}

export default Ball;
