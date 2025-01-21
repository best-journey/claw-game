import { RigidBody, RigidBodyTypeString } from '@react-three/rapier';
import { forwardRef, ForwardRefRenderFunction, useEffect, useState } from 'react';
import { Group } from 'three';
import { InteractiveObject3DEventMap } from 'three/examples/jsm/Addons.js';

interface Props {
    obj: Group<InteractiveObject3DEventMap>;
    position?: any;
    type?: RigidBodyTypeString,
}

const Ball: ForwardRefRenderFunction<any, Props> = ({ type, obj, position }, ref) => {
    const [ball, setBall] = useState<any>();

    useEffect(() => {
        setBall(obj.clone());
    }, [obj]);

    if (ball) {
        return (
            <RigidBody ref={ref} ccd type={type} colliders="ball" position={position}>
                <primitive object={ball} />
            </RigidBody>
        )
    }
    return <></>
}

export default forwardRef(Ball);
