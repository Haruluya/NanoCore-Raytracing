import { Vector3 } from "../math/vector3";
import Hitable from "../core/Hitable"
import Hitrecord from "../core/Hitrecord";
import Ray from "../core/Ray";
import { vec3Dot } from "../math/math";
export default class Sphere implements Hitable{
    private m_center:Vector3;
    private m_radius:number;
    constructor(cen:Vector3,r:number){
        this.m_center = cen;this.m_radius = r;
    }
    hit(ray: Ray, t_min: number, t_max: number): {hit:boolean,rec:Hitrecord} {
        let oc = ray.origin.sub(this.m_center);
        let a = Math.pow(ray.direction.length(),2);
        let half_b = vec3Dot(oc, ray.direction);
        let c = Math.pow(oc.length(),2)- this.m_radius*this.m_radius;
    
        let discriminant = half_b*half_b - a*c;
        if (discriminant < 0) return {hit:false,rec:new Hitrecord()};
        let sqrtd = Math.sqrt(discriminant);
    
        // Find the nearest root that lies in the acceptable range.
        let root = (-half_b - sqrtd) / a;
        if (root < t_min || t_max < root) {
            root = (-half_b + sqrtd) / a;
            if (root < t_min || t_max < root)
                return {hit:false,rec:new Hitrecord()};
        }
        const hit_record = new Hitrecord();
        hit_record.t = root;
        hit_record.p = ray.at(hit_record.t);
        let outward_normal = (hit_record.p.sub(this.m_center)).mutiply(1/this.m_radius);
        hit_record.set_face_normal(ray, outward_normal);

        hit_record.normal = (hit_record.p.sub(this.m_center)).mutiply(1/this.m_radius);

        return {hit:true,rec:hit_record};
    }

}