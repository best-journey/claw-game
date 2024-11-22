import { forwardRef, ForwardRefRenderFunction } from 'react';
import { Group } from 'three';
import { InteractiveObject3DEventMap } from 'three/examples/jsm/Addons.js';

const OBJ: ForwardRefRenderFunction<
    any,
    {
        obj: Group<InteractiveObject3DEventMap>,
        position?: any;
        rotation?: any;
    }
> = ({ obj, position, rotation }, ref) => {
    return <primitive ref={ref} object={obj} position={position} rotation={rotation} />
}

export default forwardRef(OBJ);
