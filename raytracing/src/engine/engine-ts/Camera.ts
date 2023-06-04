// import Ray from "../core/Ray";
// import { Vector3 } from "../math/vector3";

// export default class camera {
//     private m_origin:Vector3;
//     private m_lower_left_corner:Vector3;
//     private m_horizontal:Vector3;
//     private m_vertical:Vector3;
//     constructor(aspect_ratio:number) {
//         const viewport_height = 2.0;
//         const viewport_width = aspect_ratio * viewport_height;
//         const focal_length = 1.0;

//         this.m_origin = new Vector3(0, 0, 0);
//         this.m_horizontal = new Vector3(viewport_width, 0.0, 0.0);
//         this.m_vertical = new Vector3(0.0, viewport_height, 0.0);
//         this.m_lower_left_corner = this.m_origin.sub(this.m_horizontal.mutiply(.5))
//                                         .sub(this.m_vertical.mutiply(.5)).sub(new Vector3(0, 0, focal_length));
//     }

//     public get_ray(u:number, v:number):Ray {
//         return new Ray(this.m_origin, this.m_lower_left_corner.add(this.m_horizontal.mutiply(u)).add(this.m_vertical.mutiply(v)).sub(this.m_origin));
//     }

// };