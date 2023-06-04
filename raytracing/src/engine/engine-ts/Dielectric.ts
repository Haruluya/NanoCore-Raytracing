// import Hitrecord from "../core/Hitrecord";
// import Material from "../core/Material";
// import Ray from "../core/Ray";
// import { vec3Dot, vec3Normalize, vec3Reflect, vec3Refract } from "../math/math";
// import { Vector3 } from "../math/vector3";

// export default class Dielectric extends Material {
//     public m_ir:number;

//     constructor(index_of_refraction:number){
//         super();
//         this.m_ir = index_of_refraction;
//     }

//     scatter(r_in: Ray, rec: Hitrecord): { scatter: boolean; scattered: Ray; attenuation: Vector3; } {
//         let attenuation = new Vector3(1.0, 1.0, 1.0);
//         let refraction_ratio = rec.front_face ? (1.0/this.m_ir) : this.m_ir;

//         let unit_direction = vec3Normalize(r_in.direction);
//         let cos_theta = Math.min(vec3Dot(unit_direction.mutiply(-1),rec.normal),1.0);
//         let sin_theta = Math.sqrt(1.0 - cos_theta*cos_theta);

//         let cannot_refract = refraction_ratio*sin_theta > 1.0;
//         let direction;
//         if(cannot_refract || Dielectric.reflectance(cos_theta,refraction_ratio)){
//             direction = vec3Reflect(unit_direction,rec.normal);
//         }else{
//             direction = vec3Reflect(unit_direction,rec.normal);
//         }

//         let scattered = new Ray(rec.p, direction);
//         return {scatter:true,scattered,attenuation};
//     }

//     static reflectance(cosine:number,ref_idx:number){
//         let r0 = (1-ref_idx) / (1+ref_idx);
//         r0 = r0*r0;
//         return r0 + (1-r0)*Math.pow((1 - cosine),5);
//     }
// }