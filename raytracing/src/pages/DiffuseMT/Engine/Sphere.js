import { hittable } from "./Hittable"
import {vec3Len2,vec3Sub,vec3Dot, vec3Mutiply} from '../../../engine/math/Vectors'

export default class Sphere extends hittable {
    constructor(cen,r){
        super();
        this.center = cen;this.radius = r;
    }

    hit(r, t_min, t_max, rec){
        let oc = vec3Sub(r.origin,this.center);
        let a = vec3Len2(r.direction);
        let half_b = vec3Dot(oc, r.direction);
        let c = vec3Len2(oc) - this.radius*this.radius;
        let discriminant = half_b*half_b - a*c;
        if (discriminant > 0) {
            let root = Math.sqrt(discriminant);

            let temp = (-half_b - root)/a;
            if (temp < t_max && temp > t_min) {
                rec.t = temp;
                rec.p = r.at(rec.t);
                rec.normal = vec3Mutiply(vec3Sub(rec.p,this.center),1/this.radius);
                return true;
            }
            temp = (-half_b + root) / a;
            if (temp < t_max && temp > t_min) {
                rec.t = temp;
                rec.p = r.at(rec.t);
                rec.normal = vec3Mutiply(vec3Sub(rec.p,this.center),1/this.radius);
                return true;
            }
        } 
        return false;
    }
};
