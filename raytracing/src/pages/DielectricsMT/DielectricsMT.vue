<template>
    <nano_raytracing_page :prop_des_data="desData" @Init="Init" @Render="Render" ref="page" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import nano_raytracing_page from '../nano_raytracing_page.vue'
import {resize_canvas_to_display_size,draw_point_by_uv_with_samples_with_Gamma} from '../../engine/utils/RenderUtils';
import {vec3MutiplyVec3,vec3Add,vec3Sub,vec3Normalize} from '../../engine/math/Vectors'
import Ray from './Engine/Ray';
import { hit_record } from "./Engine/Hittable";
import hittable_list from "./Engine/HittableList"
import Sphere from "./Engine/Sphere"
import Box from "./Engine/Box"
import Cylinder from './Engine/Cylinder'
import {math_random_number} from '../../engine/math/Random'
import uiSetting from '.././ui-setting';
import RTWorker from "./Engine/Worker.js?worker"
import Lambertian from './Engine/Lambertian';
import Metal from './Engine/Metal';
import Dielectrics from './Engine/Dielectrics'

const desData = {
    category: "DielectricsMT",
    name: "DielectricsMT",
    buttonContent: "查看源码",
    title: "DielectricsMT",
    content: "Glass needs dielectrics"
}

export default defineComponent({
    name: 'DielectricsMT',
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
        let lastTime:number;

        //ui items.
        let sectionParams = {
            "circleCenter":[50,50,0],
            "bgCircleCenter":[.5,99.0,-18],
            "radius":10,
            "origin":[50,50,100],
            "samples_per_pixel":1,
            "max_depth":20,
            "use_worker":false
        };


        //——————Main shading——————.
        const numWorkers = 4; // 假设有 4 个 Web Worker
        const workers:any = []; // 存储 Web Worker 实例的数组
        for (let i = 0; i < numWorkers; i++){
            const worker = new RTWorker();
            workers.push(worker);
        }

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
                    type: "slider-vector", id: "bgCircleCenter", value: sectionParams.bgCircleCenter, min: { 0: 0, 1: 0,2:0}, max: { 0: 255, 1: 255,2:255 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"bgCircleCenter") 
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
                    type: "slider", id: "samples_per_pixel", value: sectionParams.samples_per_pixel, min: 1, max: 100, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"samples_per_pixel") 
                },
            )
            page.value.addUIItem(
                { 
                    type: "slider", id: "max_depth", value: sectionParams.max_depth, min: 1, max: 100, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"max_depth") 
                },
            )
            page.value.addUIItem(
                {
                    type:"checkbox",id:"use_worker", value:sectionParams.use_worker,default:false,
                    callback: uiSetting.globalUiCallbacks.updateValue(sectionParams,page.value.Render,"use_worker")
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
            const circleCenter =  (JSON.parse(JSON.stringify(sectionParams.circleCenter)));
            Object.keys(circleCenter).forEach((key) => {
                circleCenter[key] /= 100;
            });
            const origin = JSON.parse(JSON.stringify(sectionParams.origin))
            Object.keys(origin).forEach((key) => {
                origin[key] /= 100;
            });
            const radius = JSON.parse(JSON.stringify(sectionParams.radius))/100;
            const samples_per_pixel = JSON.parse(JSON.stringify(sectionParams.samples_per_pixel));
            const max_depth = JSON.parse(JSON.stringify(sectionParams.max_depth));
            //——————UI}
            const aspectRatio = width/height;

            //world.
            world.clear();
            world.add(new Sphere(vec3Add(bgCircleCenter,vec3Sub([.5,.5,1],[.5,.5,1])),100,new Lambertian([.8,.8,0])))
            world.add(new Sphere(vec3Add(circleCenter,vec3Sub([.5,.5,1],[.5,.5,1])),radius+.05,new Dielectrics(1.5)))
            world.add(new Box(vec3Sub(circleCenter,[.4,.1,0]),vec3Add(circleCenter,[radius-.3,radius,radius]),new Lambertian([.8,.8,.8])));
            world.add(new Cylinder(vec3Add(circleCenter,[.3,-.1,0]),radius,.2,new Metal([.8,.6,.2],1)));
            //ray color.
            let rec = new hit_record();
            const ray_color = (r:Ray, depth:number): number[] => {
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
            r.setOrigin(origin)
            if(!sectionParams.use_worker) {
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
                            r.setDirection([aspectRatio*(u-r.origin[0]+math_random_number(0,.001)),v-r.origin[1]+math_random_number(0,.001),-r.origin[2]]);
                            c = ray_color(r,max_depth);
                            pixel_color[0] += c[0]; pixel_color[1] += c[1];pixel_color[2] += c[2];
                            draw_point_by_uv_with_samples_with_Gamma(imgData, x, y, pixel_color,samples_per_pixel);
                        }
                    }
                }
                //——————trace}
            }else{
                lastTime = Date.now();
                for (let i = 0; i < numWorkers; i++) {
                    // 监听 Web Worker 的消息
                    workers[i].onmessage = function (event) {

                        const { partImageData, startX, startY,endX,endY } = event.data;
                        // 合并 imgData 数据到 mergedImageData
                        for(let x = startX; x < endX; x++){
                            for(let y = startY; y < endY; y++){
                                const sourceIndex = (y * width + x) * 4;
                                const dataIndex = ((y-startY)*(endX-startX)+x-startX)*4;
                                imgData.data[sourceIndex] = partImageData[dataIndex]; // R
                                imgData.data[sourceIndex + 1] = partImageData[(dataIndex + 1)]; // G
                                imgData.data[sourceIndex + 2] = partImageData[(dataIndex + 2)]; // B
                                imgData.data[sourceIndex + 3] = partImageData[(dataIndex + 3)]; // A
                            }
                        }
                        ctx?.putImageData(imgData, 0, 0);
                        page.value.debugLog("Worker FPS", 1000 / (Date.now() - lastTime));
                    };

                    const startX = (i % 2) * (canvas.width / 2);
                    const startY = i < 2 ?0 :1 * (canvas.height / 2);
                    const endX = startX + canvas.width / 2;
                    const endY = startY + canvas.height / 2;

                    workers[i].postMessage({
                        width,
                        height,
                        max_depth,
                        origin,
                        bgCircleCenter,
                        circleCenter,
                        radius,
                        samples_per_pixel,
                        startX,
                        startY,
                        endX,
                        endY,
                    });
                
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