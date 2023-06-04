// worker.js
import Ray from './Engine/Ray';
import {vec3Len2,vec3Sub,vec3Dot} from '../../engine/math/Vectors'
import Camera from './Engine/Camera';


let camera;

const ray_color = (r,d,circleCol,circleCenter,radius) => {
  const color1 = [255,255,255],color2 = [0.5*255,0.7*255,255];  
  if(hit_sphere(circleCenter,radius,r) != -1.0){
        return circleCol
    }else{
        return [color1[0]* (1-d) + color2[0]*d,
            color1[1]* (1-d) + color2[1]*d,
            color1[2]* (1-d)+  color2[2]*d]
    }
}

const hit_sphere = (center, radius,r)=>{
    let oc = vec3Sub(r.origin,center);
    let a = vec3Len2(r.direction);
    let b = 2*vec3Dot(oc, r.direction);
    let c = vec3Len2(oc) - radius*radius;
    let discriminant = b*b - 4*a*c;
    
    if (discriminant < 0) {
        return -1.0;
    } else {
        return (-b - Math.sqrt(discriminant) ) / (2*a);
    }
}

let origin = [0.5, 0.5, 1];
let r = new Ray(origin, origin);

self.onmessage = function (event) {
  const {width,height,cameraData,circleCol,circleCenter,radius} =event.data;
  if(!camera) camera = new Camera({width,height},cameraData);
  const du = 1.0 / width;
  const dv = 1.0 / height;
  // 处理图像数据
  let colorData = [];
  for (let x = 0; x < width; x++) {
    let u = (x + 0.5) * du;
    let v = 0;
    for (let y = 0; y < height; y++) {
      v += dv;
      r = camera.shootRay(x,y);
      const pixel_color = ray_color(r,u,circleCol,circleCenter,radius); 
      // 将 pixel_color 发送回主线程
      colorData.push({x,y,pixel_color});
    }
  }
  self.postMessage(
    colorData
  );
};
