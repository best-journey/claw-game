import { forwardRef } from '@chakra-ui/react';
import { ForwardRefRenderFunction } from 'react';
import { Group } from 'three';
import { InteractiveObject3DEventMap } from 'three/examples/jsm/Addons.js';

const Claw: ForwardRefRenderFunction<
    any,
    { obj: Group<InteractiveObject3DEventMap> }
> = ({ obj }, ref) => {
    return <primitive ref={ref} rotation={[-0.25, 0, 0]} object={obj} />
}

export default forwardRef(Claw);
