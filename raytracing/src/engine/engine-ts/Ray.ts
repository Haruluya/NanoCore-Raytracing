// import { Vector3 } from "../math/vector3";

// export default class Ray{
//     private m_origin:Vector3;
//     private m_direction:Vector3;
//     private m_time?:number;

//     constructor(origin:Vector3,direction:Vector3,time?:number){
//         this.m_origin = origin;this.m_direction = direction;
//         if(time){
//             this.m_time = time
//         };
//     }

//     get origin():Vector3{
//         return this.m_origin;
//     }

//     get direction():Vector3{
//         return this.m_direction;
//     }

//     get time():number{
//         if(this.m_time){
//             return this.m_time;
//         }
//         else{
//             return -1;
//         }
//     }

//     public setDirection(d:number[]){
//         this.m_direction.X = d[0];
//         this.m_direction.Y = d[1];
//         this.m_direction.Z = d[2];
//     }

//     public setOrigin(o:Vector3){
//         this.m_origin = o;
//     }
    
//     public at(t:number):Vector3{
//         return this.m_origin.add(this.m_direction.mutiply(t));
//     }
// }