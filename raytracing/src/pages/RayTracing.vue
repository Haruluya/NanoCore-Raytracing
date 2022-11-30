<template>
    <div id="RayTracing">
        <canvas class="show" ref="canvas" :width="canvasWidth" :height="canvasHeight"/>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref,onMounted} from 'vue';
import { vec3Normalize } from '../engine/math/math';

import { Vector3 } from '../engine/math/vector3';
import { resize_canvas_to_display_size, draw_point_by_uv,  } from '../engine/utils/RenderUtils';
import Ray from '../engine/core/Ray';
import Hitrecord from '../engine/core/Hitrecord';
import Hitable from '../engine/core/Hitable';
import HitableList from '../engine/components/HitableList';
import Sphere from '../engine/components/Sphere';
import Camera from '../engine/components/Camera';
import { math_random_number, random_in_unit_sphere } from '../engine/utils/Random';



export default defineComponent({
  name: 'RayTracing',
  setup(){
    // const engine:Application = new Application();
    let canvasWidth = ref<number>(800);
    let canvasHeight = ref<number>(800);
    let canvas = ref<HTMLCanvasElement>();
    let ctx:CanvasRenderingContext2D | null | undefined;
    let imgData:ImageData;
    let camera:Camera;
    let samples_per_pixel:number;
    let max_depth:number;

    let aspect_ratio:number;
    let world:HitableList;

    const init = ()=>{
      ctx = canvas.value?.getContext('2d');
      if(ctx){
        imgData = ctx.createImageData(canvasWidth.value,canvasHeight.value);
      }else{
        console.log("context not found!")
      }

      //aspect.
      aspect_ratio = canvasWidth.value / canvasHeight.value;
      samples_per_pixel = 1;
      max_depth = 50;
      // World
      world = new HitableList();
      world.add(new Sphere(new Vector3(0,0,-1),.5));
      world.add(new Sphere(new Vector3(0,-100.5,-1), 100));


      // Camera
      camera = new Camera(aspect_ratio);

      render();
    }

    const render = ()=>{
        const beginTime = Date.now()
        if(!canvas.value){
          console.log("Canvas Not Found!");
          return;
        }
        let pixel_color = new Vector3(0,0,0);
        let r:Ray;
        resize_canvas_to_display_size(canvas.value);
        for(let i = 0; i < canvasWidth.value; i++){
          for(let j = 0; j < canvasHeight.value; j++){
            pixel_color.X = 0; pixel_color.Y = 0; pixel_color.Z = 0;
            for(let s = 0; s < samples_per_pixel; s++){
                const u = (i) / (canvasWidth.value-1);
                const v = (j ) / (canvasHeight.value-1);
                r = camera.get_ray(u, v);
                pixel_color = pixel_color.add(ray_color(r, world,max_depth));

                draw_point_by_uv(imgData,u,v,pixel_color);
            }
          }
        }

      ctx?.putImageData(imgData,0,0);
      console.log("FPS::::",1000 / (Date.now() - beginTime));
    }

    const ray_color = (ray:Ray,world:Hitable, depth:number):Vector3=>{
      if (depth <= 0)
        return new Vector3(0,0,0);
      const {hit,rec} = world.hit(ray,0.001,Infinity)
      if(hit){
        const target = rec.p.add(rec.normal).add(random_in_unit_sphere());
        return  ray_color(new Ray(rec.p, target.sub(rec.p)), world,depth-1).mutiply(.5);
      }
      const unit_direction = vec3Normalize(ray.direction);
      const t = (unit_direction.Y+1.) *.5
      return new Vector3(1.0, 1.0, 1.0).mutiply((1.0-t)).add(new Vector3(0.5, 0.7, 1.0).mutiply(t)) ;

    }

    onMounted(()=>{
        init();
    })
    return{
      canvasWidth,
      canvasHeight,
      canvas,
    }
  }
})
</script>
<style lang="less" scoped>
canvas{
  width: 800;
  height: 800;
  margin: 0 auto;
  margin-top: 100px;
  background-color: seashell;
}
</style>