import { RigidBody } from '@react-three/rapier';
import { FC } from 'react';
import { Group, Object3DEventMap } from 'three';

const ClawMachine: FC<{
    obj: Group<Object3DEventMap>
}> = ({ obj }) => {
    return (
        <RigidBody type="fixed" colliders="trimesh">
            <primitive object={obj} />
        </RigidBody>
    )
}

export default ClawMachine;
