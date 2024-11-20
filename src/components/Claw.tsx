import { FC } from 'react';
import { Group } from 'three';
import { InteractiveObject3DEventMap } from 'three/examples/jsm/Addons.js';

const Claw: FC<{
    obj: Group<InteractiveObject3DEventMap>,
}> = ({ obj }) => {
    return <primitive rotation={[-0.25, 0, 0]} object={obj} />
}

export default Claw;
