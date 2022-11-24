<template>
    <div id="RayTracing">
        <canvas class="show" ref="canvas" :width="canvasWidth" :height="canvasHeight"/>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref,onMounted} from 'vue';
import { vec3Dot, vec3Normalize } from '../engine/math/math';

import { Vector3 } from '../engine/math/vector3';
import { DrawPointByImgData, resizeCanvasToDisplaySize } from '../engine/utils/RenderUtils';
// /// <reference path="../engine/core/Application.ts" />
// import Application = NanoRayTracing.Application


export default defineComponent({
  name: 'RayTracing',
  setup(){
    // const engine:Application = new Application();
    let canvasWidth = ref<number>(800);
    let canvasHeight = ref<number>(800);
    let canvas = ref<HTMLCanvasElement>();
    let ctx:CanvasRenderingContext2D;
    let imgData:ImageData;

    const Init = ()=>{
      ctx = canvas.value?.getContext('2d');
      imgData = ctx.createImageData(canvasWidth.value,canvasHeight.value);
      Render();
    }
    
    const perPixel = (coord:{x:number,y:number}):Vector3=>{
      let rayOrigin = new Vector3(.0,.0,1.0);
      let rayDirection = new Vector3(coord.x,coord.y,-1.);
      let radius = .5;

      let a = vec3Dot(rayDirection,rayDirection);
      let b = 2.0 * vec3Dot(rayDirection,rayOrigin);
      let c = vec3Dot(rayOrigin,rayOrigin) - radius*radius;

      let discriminant  = b*b - 4*a*c;
      // if(discriminant >= 0){
      //   return [255,0,0]
      // }

      if(discriminant < 0){
        return new Vector3(0,0,0);
      }
      let closestT = (-b - Math.sqrt(discriminant)) / (2.0 * a);
      let t0 = (-b + Math.sqrt(discriminant)) / (2.0 * a); // Second hit distance (currently unused)

      let hitPoint = rayOrigin.add(rayDirection.mutiply(closestT));
      let normal = vec3Normalize(hitPoint);

      let lightDir = vec3Normalize(new Vector3(-10,-1,-10));
      let lightIntensity = Math.max(vec3Dot(normal,lightDir.mutiply(-1)),.0);

      let sphereColor = new Vector3(255,0,255);
      sphereColor = sphereColor.mutiply(lightIntensity);


      return sphereColor;
    }

    const Render = ()=>{
        resizeCanvasToDisplaySize(canvas.value);
        for(let i = 0; i < canvasWidth.value; i++){
        for(let j = 0; j < canvasHeight.value; j++){
          let coord = {
            x: i/canvasWidth.value*2.0 - 1.0,
            y: j/canvasHeight.value*2.0 - 1.0
          }
          let color = perPixel(coord);
          DrawPointByImgData(imgData,i,j,color);
        }
      }

      ctx.putImageData(imgData,0,0);
    }

    onMounted(()=>{
        // engine.Run();
        Init();
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