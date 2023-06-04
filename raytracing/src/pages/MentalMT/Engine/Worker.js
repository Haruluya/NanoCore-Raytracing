import {vec3MutiplyVec3,vec3Sub,vec3Add,vec3Normalize} from '../../../engine/math/Vectors'
import {math_random_number} from '../../../engine/math/Random'
import Ray from './Ray'
import { hit_record } from "./Hittable";
import hittable_list from "./HittableList"
import Sphere from "./Sphere"
import Box from "./Box"
import Cylinder from './Cylinder'
import Lambertian from './Lambertian';
import Metal from './Metal';


let world = new hittable_list([]);
let rec = new hit_record();
const ray_color = (r, depth) => {
    if (depth <= 0)
        return [0,0,0];
    if(world.hit(r, 0.001, 99999, rec)){
        const {scatter,scattered,attenuation} = rec.mat_ptr.scatter(r,rec);
        if (scatter)
            return  vec3MutiplyVec3(attenuation,ray_color(scattered, depth-1)) ;
        return [0,0,0];
    }else{
        let unit_direction = vec3Normalize(r.direction);
        let t = (unit_direction[1]+1)*.5;
        return [255*(1-.5*t),255*(1-.3*t),255];
    }
}


self.onmessage = function (event) {
    const { width, height, max_depth, origin, bgCircleCenter, circleCenter, radius, samples_per_pixel, startX, startY, endX, endY } = event.data;
    let pixel_color;
    const du = 1 / width, dv = 1 / height;
    const aspectRatio = width / height;
    let c;
    let r = new Ray(origin, origin);
  
    //world.
    world.clear();
    world.add(new Sphere(vec3Add(bgCircleCenter,vec3Sub(origin,[.5,.5,1])),100,new Lambertian([.8,.8,0])))
    world.add(new Sphere(vec3Add(circleCenter,vec3Sub(origin,[.5,.5,1])),radius,new Lambertian([0.7,0.3,.3])))
    world.add(new Box(vec3Sub(circleCenter,[.4,.1,0]),vec3Add(circleCenter,[radius-.3,radius,radius]),new Metal([.8,.8,.8],1)));
    world.add(new Cylinder(vec3Add(circleCenter,[.3,-.1,0]),radius,.2,new Metal([.8,.6,.2],1)));
    // 处理图像数据
    const colorData = new Uint8ClampedArray((endX - startX) * (endY - startY)*4);
    for (let x = startX; x < endX; x++) {
        const u = (x + 0.5) * du;
        for (let y = startY; y < endY; y++) {
        const v = (y + 0.5) * dv;
        pixel_color = [0, 0, 0];
        for (let sample = 0; sample < samples_per_pixel; sample++) {
            r.setDirection([aspectRatio*(u-r.origin[0]+math_random_number(0,.001)),v-r.origin[1]+math_random_number(0,.001),-r.origin[2]]);
            c = ray_color(r, max_depth);
            pixel_color[0] += c[0]; pixel_color[1] += c[1]; pixel_color[2] += c[2];
        }

        // 将 pixel_color 添加到 colorData
        const pixelIndex = (x-startX+(y-startY)*(endX - startX))*4;
        colorData[pixelIndex+0] = pixel_color[0] / samples_per_pixel ;
        colorData[pixelIndex+1] = pixel_color[1] / samples_per_pixel;
        colorData[pixelIndex+2] = pixel_color[2] / samples_per_pixel;
        colorData[pixelIndex+3] = 255;
    }
    }
    self.postMessage(
      {partImageData:colorData,startX,startY,endX,endY}
    )
}