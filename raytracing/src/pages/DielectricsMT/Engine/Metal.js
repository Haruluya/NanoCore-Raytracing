import {vec3Add,vec3Normalize,vec3Dot,vec3Mutiply,vec3Reflect} from '../../../engine/math/Vectors';
import {random_in_unit_sphere} from '../../../engine/math/Random'
import Material  from './Material';
import Ray from './Ray';


export default class Metal extends Material {
    constructor(color,fuzz){
        super();
        this.albedo = color;
        this.fuzz = fuzz < 1? fuzz:1;
    }

    scatter(r_in, rec) {
        const reflected = vec3Reflect(vec3Normalize(r_in.direction), rec.normal);
        
        const scattered = new Ray(rec.p, vec3Add(reflected,vec3Mutiply(random_in_unit_sphere(),this.fuzz)));
        const attenuation = this.albedo;
        
        const scatter = (vec3Dot(scattered.direction, rec.normal) > 0) 
        return {scatter,scattered,attenuation};
    }


};