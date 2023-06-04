<template>
    <nano_raytracing_page :prop_des_data="desData" @Init="Init" @Render="Render" ref="page" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import nano_raytracing_page from '../nano_raytracing_page.vue'
import {resize_canvas_to_display_size,draw_point_by_uv} from '../../engine/utils/RenderUtils';
import uiSetting from '.././ui-setting';
import Ray from './Engine/Ray';
import {vec3Len2,vec3Sub,vec3Dot, vec3Add} from '../../engine/math/Vectors'
import Camera from './Engine/Camera';

const desData = {
    category: "Raytracing",
    name: "HitObjects",
    buttonContent: "查看源码",
    title: "Hit Objects",
    content: "Let`s hit some objects."
}

export default defineComponent({
    name: 'HitObjects',
    components: { nano_raytracing_page },
    setup() {
        //store. 
        const page = ref();
        let canvas: HTMLCanvasElement;
        let ctx: CanvasRenderingContext2D;
        let imgData: ImageData;

        let cameraData = {
            target: [0, 0, 0],
            position: [0.5, 0.5, 1],
            up: [0, -1, 0]
        }
        //ui items.
        let sectionParams = {
            "circleCol":[255,0,0],
            "circleCenter":[50,50,0],
            "radius":10,
            "objectType":0,
        };
        const objectTypes = ["Sphere","Box","Cylinder"]

        let camera;
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
                    type: "slider-vector", id: "circleCol", value: sectionParams.circleCol, min: { 0: 0, 1: 0,2:0}, max: { 0: 255, 1: 255,2:255 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"circleCol") 
                },
            );
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



        }

        const Render = () => {
            //——————{UI
            resize_canvas_to_display_size(canvas);
            const width = canvas.width;
            const height = canvas.height;
            const circleCol =  JSON.parse(JSON.stringify(sectionParams.circleCol));
            const circleCenter =  (JSON.parse(JSON.stringify(sectionParams.circleCenter)));
            Object.keys(circleCenter).forEach((key) => {
                circleCenter[key] /= 100;
            });
            const radius = JSON.parse(JSON.stringify(sectionParams.radius))/100;
            

            const ray_color = (r:Ray,d:number,circleCol:number[],circleCenter:number[],radius:number) => {
                const color1 = [255,255,255],color2 = [0.5*255,0.7*255,255];  
                let hit = 0;
                if(sectionParams.objectType == 0){
                    hit = hit_sphere(circleCenter,radius,r);

                }else if(sectionParams.objectType == 1){
                    hit = hit_box(circleCenter,vec3Add(circleCenter,[radius,radius,radius]),r);

                }else if(sectionParams.objectType == 2){
                    hit = hit_cylinder(circleCenter,radius,.3,r);
                }
                if(hit != -1.0){
                        return circleCol
                }else{
                    return [color1[0]* (1-d) + color2[0]*d,
                        color1[1]* (1-d) + color2[1]*d,
                        color1[2]* (1-d)+  color2[2]*d]
                }
            }

            const hit_sphere = (center:number[], radius:number,r:Ray)=>{
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

            const hit_box = (boxMin: number[], boxMax: number[], r: Ray) => {
                let tmin = (boxMin[0] - r.origin[0]) / r.direction[0];
                let tmax = (boxMax[0] - r.origin[0]) / r.direction[0];

                if (tmin > tmax) {
                    let temp = tmin;
                    tmin = tmax;
                    tmax = temp;
                }

                let tymin = (boxMin[1] - r.origin[1]) / r.direction[1];
                let tymax = (boxMax[1] - r.origin[1]) / r.direction[1];

                if (tymin > tymax) {
                    let temp = tymin;
                    tymin = tymax;
                    tymax = temp;
                }

                if ((tmin > tymax) || (tymin > tmax)) {
                    return -1.0;
                }

                if (tymin > tmin) {
                    tmin = tymin;
                }

                if (tymax < tmax) {
                    tmax = tymax;
                }

                let tzmin = (boxMin[2] - r.origin[2]) / r.direction[2];
                let tzmax = (boxMax[2] - r.origin[2]) / r.direction[2];

                if (tzmin > tzmax) {
                    let temp = tzmin;
                    tzmin = tzmax;
                    tzmax = temp;
                }

                if ((tmin > tzmax) || (tzmin > tmax)) {
                    return -1.0;
                }

                if (tzmin > tmin) {
                    tmin = tzmin;
                }

                if (tzmax < tmax) {
                    tmax = tzmax;
                }

                return tmin;
            }

            const hit_cylinder = (center: number[], radius: number, height: number, r: Ray) => {
                let oc = vec3Sub(r.origin, center);

                let a = vec3Len2(r.direction) - r.direction[1] * r.direction[1];
                let b = 2 * (vec3Dot(oc, r.direction) - oc[1] * r.direction[1]);
                let c = vec3Len2(oc) - oc[1] * oc[1] - radius * radius;

                let discriminant = b * b - 4 * a * c;

                if (discriminant < 0) {
                    return -1.0;
                }

                let t = (-b - Math.sqrt(discriminant)) / (2 * a);
                let y = r.origin[1] + t * r.direction[1];

                if (y < center[1] || y > center[1] + height) {
                    return -1.0;
                }

                return t;
            }

            camera = new Camera({width,height},cameraData);
            const du = 1.0 / width;
            const dv = 1.0 / height;
            // 处理图像数据
            let pixel_color = [];
            let r = new Ray(origin,origin);
            for (let x = 0; x < width; x++) {
                let u = (x + 0.5) * du;
                let v = 0;
                for (let y = 0; y < height; y++) {
                    v += dv;
                    r = camera.shootRay(x,y);
                    pixel_color = ray_color(r,u,circleCol,circleCenter,radius); 
                    draw_point_by_uv(imgData, x, y, pixel_color);
                }
            }
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