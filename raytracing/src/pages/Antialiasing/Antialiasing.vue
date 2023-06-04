<template>
    <nano_raytracing_page :prop_des_data="desData" @Init="Init" @Render="Render" ref="page" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import nano_raytracing_page from '../nano_raytracing_page.vue'
import {resize_canvas_to_display_size,draw_point_by_uv_with_samples, draw_point_by_uv} from '../../engine/utils/RenderUtils';
import Ray from './Engine/Ray';
import { hit_record } from "./Engine/Hittable";
import hittable_list from "./Engine/HittableList"
import Sphere from "./Engine/Sphere"
import Box from "./Engine/Box"
import Cylinder from './Engine/Cylinder'
import {math_random_number} from '../../engine/math/Random'
import uiSetting from '.././ui-setting';
import {vec3Add,vec3Sub} from '../../engine/math/Vectors'


const desData = {
    category: "Antialiasing",
    name: "Antialiasing",
    buttonContent: "查看源码",
    title: "Antialiasing",
    content: "Antialiasing."
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
            "circleCenter":[10,50,0],
            "bgCircleCenter":[.5,100.5,10],
            "radius":50,
            "bgColor":[0,0,0],
            "origin":[50,50,100],
            "samples_per_pixel":1,
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
                    type: "slider-vector", id: "origin", value: sectionParams.origin, min: { 0: -500, 1: -500,2:-500}, max: { 0: 500, 1: 500,2:500 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"origin") 
                },
            )
            page.value.addUIItem(
                { 
                    type: "slider-vector", id: "circleCenter", value: sectionParams.circleCenter, min: { 0: 0, 1: 0,2:0}, max: { 0: 100, 1: 100,2:100 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"circleCenter") 
                },
            )
            page.value.addUIItem(
                { 
                    type: "slider", id: "radius", value: sectionParams.radius, min: 0, max: 100, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"radius") 
                },
            )
            page.value.addUIItem(
                { 
                    type: "slider", id: "samples_per_pixel", value: sectionParams.samples_per_pixel, min: 1, max: 20, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"samples_per_pixel") 
                },
            )

        }



        const Render = () => {
            let pixel_color = [0,0,0];

            //——————{UI
            resize_canvas_to_display_size(canvas);
            const width = canvas.width;
            const height = canvas.height;
            const bgCircleCenter =  JSON.parse(JSON.stringify(sectionParams.bgCircleCenter));
            const bgColor =  JSON.parse(JSON.stringify(sectionParams.bgColor));
            const circleCenter =  (JSON.parse(JSON.stringify(sectionParams.circleCenter)));
            const origin = JSON.parse(JSON.stringify(sectionParams.origin))
            Object.keys(origin).forEach((key) => {
                origin[key] /= 100;
            });
            Object.keys(circleCenter).forEach((key) => {
                circleCenter[key] /= 100;
            });
            const radius = JSON.parse(JSON.stringify(sectionParams.radius))/100;
            const samples_per_pixel = JSON.parse(JSON.stringify(sectionParams.samples_per_pixel));
            //——————UI}

            const aspectRatio = width/height;
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


            //ray color.
            let rec = new hit_record();
            let normal;
            const ray_color = (r:Ray): number[] => {
                if(world.hit(r, 0, 9999, rec)){
                    normal = rec.normal;
                    return [(normal[0]+1)*128,(normal[1]+1)*128,(normal[2]+1)*128];
                }else{
                    return bgColor;
                }
            }


            //——————{trace
            const du = 1/width, dv = 1/height;
            let u = 0.5/width, v = .5/height;
            let c;
            for (let x = 0; x < width; x++) {
                u += du; v = .5/height;;
                for (let y = 0; y < height; y++) {
                    v+=dv;
                    pixel_color = [0,0,0];
                    for (let sample = 0; sample < samples_per_pixel ;sample++){
                        if(samples_per_pixel == 1) r.setDirection([aspectRatio*(u-r.origin[0]),v-r.origin[1],-r.origin[2]]);
                        else r.setDirection([aspectRatio*(u-r.origin[0]+math_random_number(0,.001)),v-r.origin[1]+math_random_number(0,.001),-r.origin[2]]);
                        c = ray_color(r);
                        pixel_color[0] += c[0]; pixel_color[1] += c[1];pixel_color[2] += c[2];
                        draw_point_by_uv_with_samples(imgData, x, y, pixel_color,samples_per_pixel);
                    }
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