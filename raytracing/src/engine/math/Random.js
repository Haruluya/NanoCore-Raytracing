import { vec3Dot, vec3Normalize } from "./Vectors";
const pi = 3.1415926535897932385;

const math_random_number = (min,max)=>{
    //[min,max)
    if(min != undefined && max != undefined){
        return min + (max-min)*Math.random();
    }
    //[0,1)
    return Math.random();
}

const math_random_vector3 = (min,max)=>{
    //[min,max)
    if(min && max){
        return [math_random_number(min,max),math_random_number(min,max),math_random_number(min,max)];
    }
    //[0,1)
    return [math_random_number(),math_random_number(),math_random_number()];
}

//单元球内向量。
const random_in_unit_sphere = ()=>{
    while (true) {
        let p = math_random_vector3(-1,1);
        if (Math.pow(p[0]*p[0]+p[1]*p[1]+p[2]*p[2],2) >= 1) continue;
        return p;
    }
}

//随机单位向量。
const random_unit_vector = ()=>{
    const a = math_random_number(0, 2*pi);
    const z = math_random_number(-1, 1);
    const r = Math.sqrt(1 - z*z);
    return [r*Math.cos(a), r*Math.sin(a), z];
    // return vec3Normalize(random_in_unit_sphere());
}

//半球内向量。
const random_in_hemisphere = (normal)=> {
    const in_unit_sphere = random_in_unit_sphere();
    if (vec3Dot(in_unit_sphere, normal) > 0.0) 
        return in_unit_sphere;
    else
        return in_unit_sphere.mutiply(-1);
}

export {
    math_random_number,
    math_random_vector3,
    random_in_unit_sphere,
    random_unit_vector,
    random_in_hemisphere
}