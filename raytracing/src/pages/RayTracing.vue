<!-- <template>
  <nano_raytracing_page 
      :prop_des_data="desData" 
      ref="page" 
  /> 
</template>
<script lang="ts">
import { defineComponent, ref,onMounted} from 'vue';
import { vec3Mutiply, vec3Normalize } from '../engine/math/Vectors';
import nano_raytracing_page from './nano_raytracing_page.vue'
import { Vector3 } from '../engine/math/vector3';
import { resize_canvas_to_display_size, draw_point_by_uv,  } from '../engine/utils/RenderUtils';
import Ray from '../engine/core/Ray';
import Hitrecord from '../engine/core/Hitrecord';
import Hitable from '../engine/core/Hitable';
import HitableList from '../engine/components/HitableList';
import Sphere from '../engine/components/Sphere';
import Camera from '../engine/engine-ts/Camera';
import { math_random_number, random_in_hemisphere, random_in_unit_sphere, random_unit_vector } from '../engine/utils/Random';
import Lambertian from '../engine/components/Lambertian';
import Metal from '../engine/components/Metal';
import Dielectric from '../engine/engine-ts/Dielectric';

const desData = {
    category: "Raytracing",
    name: "Raytracing",
    buttonContent: "查看源码",
    title: "Raytracing",
    content: "Raytracing."
}

export default defineComponent({
  name: 'RayTracing',
  components:{nano_raytracing_page},
  setup(){
    //store. 
    const page = ref();

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
      const material_ground = new Lambertian(new Vector3(0.8, 0.8, 0.0));
      // const material_center = new Lambertian(new Vector3(0.7, 0.3, 0.3));
      // const material_left   = new Metal(new Vector3(0.8, 0.8, 0.8),0.3);
      const material_center = new Dielectric(1.5);
      const material_left   = new Dielectric(1.5);
      
      const material_right  = new Metal(new Vector3(0.8, 0.6, 0.2),1.0);

      world.add(new Sphere(new Vector3( 0.0, -100.5, -1.0), 100.0, material_ground));
      world.add(new Sphere(new Vector3( 0.0,    0.0, -1.0),   0.5, material_center));
      world.add(new Sphere(new Vector3(-1.0,    0.0, -1.0),   0.5, material_left));
      world.add(new Sphere(new Vector3( 1.0,    0.0, -1.0),   0.5, material_right));


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
        // const target = rec.p.add(rec.normal) .add(random_unit_vector());
        // const target = rec.p.add(rec.normal).add(random_in_unit_sphere());
        // const target = rec.p.add(rec.normal).add(random_in_hemisphere(rec.normal));
        // return  ray_color(new Ray(rec.p, target.sub(rec.p)), world,depth-1).mutiply(.5);
        const {scatter,attenuation,scattered} = rec.material.scatter(ray, rec)

        if (scatter)
            return vec3Mutiply(attenuation,(ray_color(scattered, world, depth-1)));
        return new Vector3(0,0,0);
      }
      const unit_direction = vec3Normalize(ray.direction);
      const t = (unit_direction.Y+1.) *.5
      return new Vector3(1.0, 1.0, 1.0).mutiply((1.0-t)).add(new Vector3(0.5, 0.7, 1.0).mutiply(t)) ;

    }

    onMounted(()=>{
        // init();
    })
    return{
      desData,
      page,
      canvasWidth,
      canvasHeight,
      canvas,
    }
  }
})
</script>
<style lang="less" scoped>

</style> -->