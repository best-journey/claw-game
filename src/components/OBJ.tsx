import { FC } from 'react';
import { Group } from 'three';
import { InteractiveObject3DEventMap } from 'three/examples/jsm/Addons.js';

const OBJ: FC<{
    obj: Group<InteractiveObject3DEventMap>,
    position?: any;
}> = ({ obj, position }) => {
    return <primitive object={obj} position={position} />
}

export default OBJ;
