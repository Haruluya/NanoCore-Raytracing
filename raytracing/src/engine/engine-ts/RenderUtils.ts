// import Ray from "../core/Ray";
// import { vec3Dot } from "../math/math";
// import { Vector3 } from "../math/vector3";

// export const resize_canvas_to_display_size = (canvas:HTMLCanvasElement, multiplier?:number)=>{
//     multiplier = multiplier || 1;
//     const width  = canvas.clientWidth  * multiplier | 0;
//     const height = canvas.clientHeight * multiplier | 0;
//     if (canvas.width !== width ||  canvas.height !== height) {
//     canvas.width  = width;
//     canvas.height = height;
//     return true;
//     }
//     return false;
// }


// export const draw_point_by_uv = (
//     imgData:ImageData,
//     x:number,y:number,
//     color:number[],
//     )=>{
    

//     // let x = u * imgData.width;
    
//     // //y ==> -y.
//     // let y = imgData.height - v * imgData.height;
    
//     let pixelData = imgData.data;
//     // if (x > imgData.width || x < 0 || y > imgData.height || y < 0){
//     //     return;
//     // }

//     // x = Math.floor(x);
//     // y = Math.floor(y);

//     const pixelIndex = (x+y*imgData.width)*4;
//     //Gamma Correction. 
    
 
//     pixelData[pixelIndex+0] = color[0] ;
//     pixelData[pixelIndex+1] = color[1] ;
//     pixelData[pixelIndex+2] = color[2] ;
//     pixelData[pixelIndex+3] = 255;

// }




// export const hit_sphere = (center:number[],radius:number, r:Ray):number =>{
//     let oc = r.origin.sub(center);
//     let a = Math.pow(r.direction.length(),2);
//     let half_b = vec3Dot(oc, r.direction);
//     let c = Math.pow(oc.length(),2) - radius*radius;
//     let discriminant = half_b*half_b - 4*a*c;
    
//     if (discriminant < 0) {
//         return -1.0;
//     } else {
//         return (-half_b - Math.sqrt(discriminant) ) / a;
//     }
// }

