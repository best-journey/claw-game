import { DoubleSide, Group, Object3DEventMap } from "three";
import { MTLLoader, OBJLoader } from "three/examples/jsm/Addons.js";

export const angleToRadian = (a: number) => {
    return Math.PI * a / 180;
}

export const loadOBJ = async (objPath: string, mtlPath: string) => {
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    const mtl = await new Promise<MTLLoader.MaterialCreator>((resolve) => mtlLoader.load(mtlPath, (materials: any) => resolve(materials)));

    if (mtl) {
        mtl.preload();
        for (const materialName in mtl.materials) {
            const material = mtl.materials[materialName];
            material.side = DoubleSide;
        }
        objLoader.setMaterials(mtl);
    }

    const obj = await new Promise<Group<Object3DEventMap>>((resolve) => objLoader.load(objPath, (object: any) => resolve(object)));

    obj.traverse((child: any) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return obj;
}
