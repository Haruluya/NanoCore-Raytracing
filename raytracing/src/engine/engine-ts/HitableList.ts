// import { Vector3 } from "../math/vector3";
// import Hitable from "../core/Hitable"
// import Hitrecord from "../core/Hitrecord";
// import Ray from "../core/Ray";
// import { vec3Dot } from "../math/math";
// export default class HitableList implements Hitable{
//     private objects:Array<Hitable> = [];
//     constructor(object?:Hitable) { if(object){this.add(object);} }

//     public clear() { this.objects = []; }
//     public add(object:Hitable) { this.objects.push(object); }

//     hit(r:Ray, t_min:number, t_max:number):{hit:boolean,rec:Hitrecord}{
//         let hit_anything = false;
//         let closest_so_far = t_max;
//         let out_rec:Hitrecord = new Hitrecord();
//         this.objects.forEach(object=>{
//             const {hit,rec} = object.hit(r, t_min, closest_so_far)
//             if (hit) {
//                 hit_anything = true;
//                 closest_so_far = rec.t;
//                 out_rec = rec;
//             }
//         }) 
//         return {hit:hit_anything,rec:out_rec};
//     };

// }