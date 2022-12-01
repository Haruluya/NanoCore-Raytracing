import { vec3Dot, vec3Normalize } from "../math/math";
import { Vector3 } from "../math/vector3";


const math_random_number = (min?:number,max?:number)=>{
    //[min,max)
    if(min && max){
        return min + (max-min)*Math.random();
    }
    //[0,1)
    return Math.random();
}

const math_random_vector3 = (min?:number,max?:number)=>{
    //[min,max)
    if(min && max){
        return new Vector3(math_random_number(min,max),math_random_number(min,max),math_random_number(min,max));
    }
    //[0,1)
    return new Vector3(math_random_number(),math_random_number(),math_random_number());
}

//单元球内向量。
const random_in_unit_sphere = ()=>{
    while (true) {
        let p = math_random_vector3(-1,1);
        if (Math.pow(p.length(),2) >= 1) continue;
        return p;
    }
}

//随机单位向量。
const random_unit_vector = ()=>{
    return vec3Normalize(random_in_unit_sphere());
}

//半球内向量。
const random_in_hemisphere = (normal:Vector3)=> {
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