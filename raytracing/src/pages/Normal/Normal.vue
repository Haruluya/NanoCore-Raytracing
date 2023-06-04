<template>
    <nano_raytracing_page :prop_des_data="desData" @Init="Init" @Render="Render" ref="page" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import nano_raytracing_page from '../nano_raytracing_page.vue'
import {resize_canvas_to_display_size,draw_point_by_uv} from '../../engine/utils/RenderUtils';
import {vec3Mutiply,vec3Add,vec3Sub} from '../../engine/math/Vectors'
import Ray from './Engine/Ray';
import { hit_record } from "./Engine/Hittable";
import hittable_list from "./Engine/HittableList"
import Sphere from "./Engine/Sphere"
import Box from "./Engine/Box"
import Cylinder from './Engine/Cylinder'
import uiSetting from '.././ui-setting';



const desData = {
    category: "Raytracing",
    name: "Normal",
    buttonContent: "查看源码",
    title: "Normal",
    content: "Normals bring objects to life."
}

export default defineComponent({
    name: 'Normal',
    components: { nano_raytracing_page },
    setup() {
        //store. 
        const page = ref();
        let canvas: HTMLCanvasElement;
        let ctx: CanvasRenderingContext2D;
        let imgData: ImageData;

        let origin = [0.5, 0.5, 1];
        let r: Ray = new Ray(origin, origin);
        let world:hittable_list = new hittable_list([]);

        //ui items.
        let sectionParams = {
            "circleCenter":[50,50,0],
            "bgCircleCenter":[.5,100.5,10],
            "radius":10,
            "bgColor":[0,0,0],
            "origin":[50,50,100],
            "objectType":0,
        };
        const objectTypes = ["Sphere","Box","Cylinder"]
        const Init = () => {
            canvas = page.value.getCanvas();
            ctx = page.value.getContext();
            if (ctx) {
                imgData = ctx.createImageData(canvas.width, canvas.height);
            } else {
                console.log("context not found!")
            }
            //section ui.
            page.value.addUIItem(
                {
                    type:"select",id:"objectType",default:sectionParams.objectType, value:objectTypes,
                    callback: uiSetting.globalUiCallbacks.updateValue(sectionParams,Render,"objectType")
                },
            )
            page.value.addUIItem(
                { 
                    type: "slider-vector", id: "bgCircleCenter", value: sectionParams.bgCircleCenter, min: { 0: 0, 1: 0,2:0}, max: { 0: 255, 1: 255,2:255 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"bgCircleCenter") 
                },
            );
            page.value.addUIItem(
                { 
                    type: "slider-vector", id: "bgColor", value: sectionParams.bgColor, min: { 0: 0, 1: 0,2:0}, max: { 0: 255, 1: 255,2:255 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"bgColor") 
                },
            );
            page.value.addUIItem(
                { 
                    type: "slider-vector", id: "circleCenter", value: sectionParams.circleCenter, min: { 0: 0, 1: 0,2:0}, max: { 0: 100, 1: 100,2:100 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"circleCenter") 
                },
            ),
            page.value.addUIItem(
                { 
                    type: "slider-vector", id: "origin", value: sectionParams.origin, min: { 0: -500, 1: -500,2:-500}, max: { 0: 500, 1: 500,2:500 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"origin") 
                },
            ),
            page.value.addUIItem(
                { 
                    type: "slider", id: "radius", value: sectionParams.radius, min: 0, max: 100, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"radius") 
                },
            )

        }

  
        const Render = () => {
            let pixel_color = [];
            //——————{UI
            resize_canvas_to_display_size(canvas);
            const width = canvas.width;
            const height = canvas.height;
            const bgCircleCenter =  JSON.parse(JSON.stringify(sectionParams.bgCircleCenter));
            const bgColor =  JSON.parse(JSON.stringify(sectionParams.bgColor));
            const origin = JSON.parse(JSON.stringify(sectionParams.origin))
            Object.keys(origin).forEach((key) => {
                origin[key] /= 100;
            });
            const circleCenter =  (JSON.parse(JSON.stringify(sectionParams.circleCenter)));
            Object.keys(circleCenter).forEach((key) => {
                circleCenter[key] /= 100;
            });
            const radius = JSON.parse(JSON.stringify(sectionParams.radius))/100;
            const aspectRatio = width/height;

            //——————UI}
            //world.
            world.clear();
            world.add(new Sphere(vec3Add(bgCircleCenter,vec3Sub(origin,[.5,.5,1])),100))
            if(sectionParams.objectType == 0){
                world.add(new Sphere(vec3Add(circleCenter,vec3Sub(origin,[.5,.5,1])),radius))
            }else if(sectionParams.objectType == 1){
                world.add(new Box(circleCenter,vec3Add(circleCenter,[radius,radius,radius])));
            }else if(sectionParams.objectType == 2){
                world.add(new Cylinder(circleCenter,radius,.2));
            }

            const ray_color = (r:Ray): number[] => {
                let rec = new hit_record();
                if(world.hit(r, 0, 9999, rec)){
                    return vec3Mutiply(vec3Add(rec.normal,[1,1,1]),0.5*255)
                }else{
                    return bgColor;
                }
            }

            //——————{trace
            const du = 1/width, dv = 1/height;
            let u = 0.5/width, v = .5/height;
            for (let x = 0; x < width; x++) {
                u += du; v = .5/height;;
                for (let y = 0; y < height; y++) {
                    v+=dv;
                    r.setOrigin(origin);
                    r.setDirection([aspectRatio*(u-r.origin[0]),v-r.origin[1],-r.origin[2]]);
                    pixel_color = ray_color(r);
                    draw_point_by_uv(imgData, x, y, pixel_color);
                }
            }
            //——————trace}

            ctx?.putImageData(imgData, 0, 0);
        }

        return {
            desData,
            page,
            Render,
            Init,
        }
    }
})
</script>
<style lang="less" scoped></style>