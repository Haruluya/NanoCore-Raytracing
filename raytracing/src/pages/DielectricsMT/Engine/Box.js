import { hittable } from "./Hittable";

export default class Box extends hittable {
  constructor(min, max,m) {
    super();
    this.min = min;
    this.max = max;
    this.mat_ptr = m;
  }

  hit(r, t_min, t_max, rec) {
    let tmin, tmax;
    let invDirX = 1 / r.direction[0];
    let invDirY = 1 / r.direction[1];
    let invDirZ = 1 / r.direction[2];

    let t1 = (this.min[0] - r.origin[0]) * invDirX;
    let t2 = (this.max[0] - r.origin[0]) * invDirX;
    tmin = Math.min(t1, t2);
    tmax = Math.max(t1, t2);

    t1 = (this.min[1] - r.origin[1]) * invDirY;
    t2 = (this.max[1] - r.origin[1]) * invDirY;
    tmin = Math.max(tmin, Math.min(t1, t2));
    tmax = Math.min(tmax, Math.max(t1, t2));

    t1 = (this.min[2] - r.origin[2]) * invDirZ;
    t2 = (this.max[2] - r.origin[2]) * invDirZ;
    tmin = Math.max(tmin, Math.min(t1, t2));
    tmax = Math.min(tmax, Math.max(t1, t2));

    if (tmax < tmin) {
      return false;
    }

    if (tmin > t_min && tmax < t_max) {
      rec.t = tmin;
    } else if (tmax > t_min && tmax < t_max) {
      rec.t = tmax;
    } else {
      return false;
    }

    rec.p = [
      r.origin[0] + rec.t * r.direction[0],
      r.origin[1] + rec.t * r.direction[1],
      r.origin[2] + rec.t * r.direction[2]
    ];

    let normal = [0,0,0];

    if (rec.p[0] < this.min[0] + 0.0001) {
      normal[0] = -1;
    } else if (rec.p[0] > this.max[0] - 0.0001) {
      normal[0] = 1;
    }

    if (rec.p[1] < this.min[1] + 0.0001) {
      normal[1] = -1;
    } else if (rec.p[1] > this.max[1] - 0.0001) {
      normal[1] = 1;
    }

    if (rec.p[2] < this.min[2] + 0.0001) {
      normal[2] = -1;
    } else if (rec.p[2] > this.max[2] - 0.0001) {
      normal[2] = 1;
    }

    rec.normal = normal;
    rec.mat_ptr = this.mat_ptr;
    return true;
  }
}
