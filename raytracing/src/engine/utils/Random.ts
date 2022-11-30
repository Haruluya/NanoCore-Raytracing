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

const random_in_unit_sphere = ()=>{
    while (true) {
        let p = math_random_vector3(-1,1);
        if (Math.pow(p.length(),2) >= 1) continue;
        return p;
    }
}


export {
    math_random_number,
    math_random_vector3,
    random_in_unit_sphere
}