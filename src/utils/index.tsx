export const angleToRadian = (a: number) => {
    return Math.PI * a / 180;
}

export const clonePosition = (p: any) => [p.x, p.y, p.z];
export const cloneRotation = (r: any) => [r.x, r.y, r.z];
export const cloneScale = (s: any) => [s.x, s.y, s.z];

export const getPosition = (p1: any, p2: any, a: any) => {
    return {
        x: p1[0] + (p2[0] - p1[0]) * a,
        y: p1[1] + (p2[1] - p1[1]) * a,
        z: p1[2] + (p2[2] - p1[2]) * a,
    }
}

export const getRotation = (r1: any, r2: any, a: any) => {
    return {
        x: r1[0] + (r2[0] - r1[0]) * a,
        y: r1[1] + (r2[1] - r1[1]) * a,
        z: r1[2] + (r2[2] - r1[2]) * a,
    }
}

export const getScale = (s1: any, s2: any, a: any) => {
    return {
        x: s1[0] + (s2[0] - s1[0]) * a,
        y: s1[1] + (s2[1] - s1[1]) * a,
        z: s1[2] + (s2[2] - s1[2]) * a,
    }
}
