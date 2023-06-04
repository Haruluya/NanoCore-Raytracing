import {vec3Sub,vec3Add,vec3Normalize} from '../../../engine/math/Vectors'
import {random_in_unit_sphere} from '../../../engine/math/Random'
import Ray from './Ray'
import { hit_record } from "./Hittable";
import hittable_list from "./HittableList"
import Sphere from "./Sphere"
import Box from "./Box"
import Cylinder from './Cylinder'

let rec = new hit_record();
let target;
let nray = new Ray(origin,origin);
let p,n,ra,color;
let world = new hittable_list([]);

const ray_color = (r, depth) => {
    if (depth <= 0)
        return [0,0,0];
    if(world.hit(r, 0.001, 99999, rec)){
        //法线半球随机一条光线。
        // target = vec3Add(vec3Add(rec.p,rec.normal),random_in_unit_sphere());
        p = rec.p, n = rec.normal,ra = random_in_unit_sphere();
        target = [p[0]+n[0]+ra[0],p[1]+n[1]+ra[1],p[2]+n[2]+ra[2]]
        nray.setOrigin(rec.p);
        nray.setDirection(vec3Sub(target,rec.p));
        color = ray_color(nray,depth-1);
        return [color[0]*.5,color[1]*.5,color[2]*.5];
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
    world.add(new Sphere(vec3Add(bgCircleCenter,vec3Sub(origin,[.5,.5,1])),100))
    world.add(new Sphere(vec3Add(circleCenter,vec3Sub(origin,[.5,.5,1])),radius))
    world.add(new Box(vec3Sub(circleCenter,[.4,.1,0]),vec3Add(circleCenter,[radius-.3,radius,radius])));
    world.add(new Cylinder(vec3Add(circleCenter,[.3,-.1,0]),radius,.2));

    let offset = 0;
    if(startX == width/2 && startY == height/2){offset = -width/2}

    // 处理图像数据
    const colorData = new Uint8ClampedArray((endX - startX) * (endY - startY)*4);
    for (let x = startX; x < endX; x++) {
        const u = (x + 0.5 + offset) * du;
        for (let y = startY; y < endY; y++) {
        const v = (y + 0.5) * dv;
        pixel_color = [0, 0, 0];
        for (let sample = 0; sample < samples_per_pixel; sample++) {
            r.setDirection([aspectRatio * (u - r.origin[0]), v - r.origin[1], -r.origin[2]]);
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