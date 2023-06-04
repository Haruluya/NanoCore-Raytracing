// import Hitrecord from "../core/Hitrecord";
// import Material from "../core/Material"
// import Ray from "../core/Ray";
// import { vec3NearZero } from "../math/math";
// import { Vector3 } from "../math/vector3"
// import { random_unit_vector } from "../utils/Random";

// export default class Lambertian extends Material {
//     public albedo:Vector3;


//     constructor(color:Vector3){
//         super();
//         this.albedo = color;
//     }

//     scatter(r_in: Ray, rec: Hitrecord): 
//                 {scatter:boolean,scattered:Ray,attenuation:Vector3} {
//         let scatter_direction = rec.normal.add(random_unit_vector());
        
//         // Catch degenerate scatter direction
//         if (vec3NearZero(scatter_direction))
//             scatter_direction = rec.normal;
        
//         const scattered = new Ray(rec.p, scatter_direction);
//         const attenuation = this.albedo;

//         return {scatter:true,scattered,attenuation};
//     }


// };