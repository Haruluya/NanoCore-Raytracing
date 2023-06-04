import {random_unit_vector} from '../../../engine/math/Random'
import {vec3Add,vec3NearZero} from '../../../engine/math/Vectors'
import Material  from './Material';
import Ray from './Ray';

export default class Lambertian extends Material {
    constructor(color){
        super();
        this.albedo = color;
    }

    scatter(r_in,rec){
        let scatter_direction = vec3Add(rec.normal,random_unit_vector());
        
        // Catch degenerate scatter direction
        // if (vec3NearZero(scatter_direction))
        //     scatter_direction = rec.normal;
        
        const scattered = new Ray(rec.p, scatter_direction);
        const attenuation = this.albedo;

        return {scatter:true,scattered,attenuation};
    }


};