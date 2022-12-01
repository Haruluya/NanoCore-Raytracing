import Hitrecord from "../core/Hitrecord";
import Material from "../core/Material"
import Ray from "../core/Ray";
import { vec3Dot, vec3Normalize, vec3Reflect } from "../math/math";
import { Vector3 } from "../math/vector3"


export default class Metal extends Material {
    public albedo:Vector3;


    constructor(color:Vector3){
        super();
        this.albedo = color;
    }

    scatter(r_in: Ray, rec: Hitrecord): 
                {scatter:boolean,scattered:Ray,attenuation:Vector3} {
        const reflected = vec3Reflect(vec3Normalize(r_in.direction), rec.normal);
        
        const scattered = new Ray(rec.p, reflected);
        const attenuation = this.albedo;
        
        const scatter = (vec3Dot(scattered.direction, rec.normal) > 0) 
        return {scatter,scattered,attenuation};
    }


};