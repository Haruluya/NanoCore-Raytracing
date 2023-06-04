import { hittable } from "./Hittable";
import { vec3Len2, vec3Sub, vec3Dot, vec3Mutiply,vec3Normalize  } from '../../../engine/math/Vectors';

export default class Cylinder extends hittable {
    constructor(center, radius, height,m) {
        super();
        this.center = center;
        this.radius = radius;
        this.height = height;
        this.mat_ptr = m;
    }

    hit(r, t_min, t_max, rec) {
        const oc = vec3Sub(r.origin, this.center);
        const a = vec3Len2(r.direction) - Math.pow(vec3Dot(r.direction, this.axis()), 2);
        const b = vec3Dot(oc, r.direction) - vec3Dot(oc, this.axis()) * vec3Dot(r.direction, this.axis());
        const c = vec3Len2(oc) - Math.pow(vec3Dot(oc, this.axis()), 2) - Math.pow(this.radius, 2);

        const discriminant = Math.pow(b, 2) - a * c;

        if (discriminant > 0) {
            let root = Math.sqrt(discriminant);

            let temp = (-b - root) / a;
            if (temp < t_max && temp > t_min && this.isWithinBounds(temp,r)) {
                rec.t = temp;
                rec.p = r.at(rec.t);
                const outwardNormal = vec3Normalize(vec3Sub(vec3Sub(rec.p, this.center), vec3Mutiply(this.axis(), vec3Dot(vec3Sub(rec.p, this.center), this.axis()))));
                rec.normal =  outwardNormal;
                rec.mat_ptr = this.mat_ptr;
                return true;
            }

            temp = (-b + root) / a;
            if (temp < t_max && temp > t_min && this.isWithinBounds(temp,r)) {
                rec.t = temp;
                rec.p = r.at(rec.t);
                const outwardNormal = vec3Normalize(vec3Sub(vec3Sub(rec.p, this.center), vec3Mutiply(this.axis(), vec3Dot(vec3Sub(rec.p, this.center), this.axis()))));
                rec.normal = outwardNormal;
                rec.mat_ptr = this.mat_ptr;
                return true;
            }
        }

        return false;
    }

    axis() {
        return [0, 1, 0]; // Cylinder轴向，可以根据需求修改
    }

    isWithinBounds(t,r) {
        const y = r.origin[1] + t * r.direction[1];
        return y >= this.center[1] && y <= this.center[1] + this.height;
    }
};
