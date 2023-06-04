import { vec3Dot } from "../../../engine/math/Vectors";
import Ray from "./Ray";

export class hit_record {
    constructor(p,normal,t,front_face){
        this.p = p;this.normal = normal;
        this.t = t;this.front_face = front_face;
    }

    set_face_normal(r, outward_normal) {
        front_face = vec3Dot(r.direction, outward_normal) < 0;
        normal = front_face ? outward_normal :-outward_normal;
    }
};

export class hittable{
    hit(r, t_min, t_max, rec){};
}