// import { vec3Dot } from "../math/math";
// import { Vector3 } from "../math/vector3";
// import Material from "./Material";
// import Ray from "./Ray";

// export default class Hitrecord{
//     private m_p:Vector3;
//     private m_normal:Vector3;
//     private m_t:number;
//     private m_front_face:boolean = true;
//     private m_material:Material;

//     constructor(p:Vector3 = new Vector3(0,0,0),
//                 normal:Vector3 = new Vector3(0,0,0),
//                 t:number = 0
//     ){
//         this.m_p = p; this.m_normal = normal; this.m_t = t;
//     }
//     public set_face_normal(r:Ray, outward_normal:Vector3) {
//         this.m_front_face = vec3Dot(r.direction, outward_normal) < 0;
//         this.m_normal = this.m_front_face ? outward_normal :outward_normal.mutiply(-1);
//     }

//     get p():Vector3{
//         return this.m_p;
//     }
//     set p(p:Vector3){
//         this.m_p = p;
//     }
//     get normal():Vector3{
//         return this.m_normal;
//     }
//     get material():Material{
//         return this.m_material;
//     }
//     set normal(normal:Vector3){
//         this.m_normal = normal;
//     }
//     get t():number{
//         return this.m_t;
//     }
//     set t(t:number){
//         this.m_t = t;
//     }
//     set material(m:Material){
//         this.m_material = m;
//     }
//     get front_face(){
//         return this.m_front_face
//     }
//     set front_face(f:boolean){
//         this.m_front_face = f;
//     }
    
// }