import Material from "./Material";
import Ray from "./Ray";
import { vec3Dot, vec3Normalize, vec3Mutiply,vec3Reflect, vec3Refract } from '../../../engine/math/Vectors'

export default class Dielectric extends Material {

    constructor(index_of_refraction){
        super();
        this.m_ir = index_of_refraction;
    }

    scatter(r_in, rec) {
        let attenuation = [1.0, 1.0, 1.0];
        let refraction_ratio = rec.front_face ? (1.0/this.m_ir) : this.m_ir;

        let unit_direction = vec3Normalize(r_in.direction);
        let cos_theta = Math.min(vec3Dot(vec3Mutiply(unit_direction,-1),rec.normal),1.0);
        let sin_theta = Math.sqrt(1.0 - cos_theta*cos_theta);

        let cannot_refract = refraction_ratio*sin_theta > 1.0;
        let direction;
        if(cannot_refract || Dielectric.reflectance(cos_theta,refraction_ratio)){
            direction = vec3Reflect(unit_direction,rec.normal);
        }else{
            direction = vec3Refract(unit_direction,rec.normal,refraction_ratio);
        }

        let scattered = new Ray(rec.p, direction);
        return {scatter:true,scattered,attenuation};
    }

    static reflectance(cosine,ref_idx){
        let r0 = (1-ref_idx) / (1+ref_idx);
        r0 = r0*r0;
        return r0 + (1-r0)*Math.pow((1 - cosine),5);
    }
}