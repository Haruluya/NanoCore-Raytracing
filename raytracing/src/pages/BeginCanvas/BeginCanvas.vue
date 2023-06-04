<template>
    <nano_raytracing_page :prop_des_data="desData" @Init="Init" @Render="Render" ref="page" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import nano_raytracing_page from '../nano_raytracing_page.vue'
import { resize_canvas_to_display_size, draw_point_by_uv, } from '../../engine/utils/RenderUtils';
import uiSetting from '../ui-setting';

const desData = {
    category: "Raytracing",
    name: "Raytracing",
    buttonContent: "查看源码",
    title: "Begin",
    content: "Begin raytracing from blending two colors."
}

export default defineComponent({
    name: 'BeginCanvas',
    components: { nano_raytracing_page },
    setup() {
        //store. 
        const page = ref();
        let canvas: HTMLCanvasElement;
        let ctx: CanvasRenderingContext2D;
        let imgData: ImageData;

        //ui items.
        let sectionParams = {
            "color1":[255,255,255],
            "color2":[128,180,255],
            "blendDir":true
        };

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
                    type: "slider-vector", id: "color1", value: sectionParams.color1, min: { 0: 0, 1: 0,2:0}, max: { 0: 255, 1: 255,2:255 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"color1") 
                },
            )
            page.value.addUIItem(
                { 
                    type: "slider-vector", id: "color2", value: sectionParams.color2, min: { 0: 0, 1: 0,2:0}, max: { 0: 255, 1: 255,2:255 }, 
                    callback: uiSetting.globalUiCallbacks.updateVector3(sectionParams,page.value.Render,"color2") 
                },
            )
            page.value.addUIItem(
                {
                    type:"checkbox",id:"blendDir", value:sectionParams.blendDir,default:false,
                    callback: uiSetting.globalUiCallbacks.updateValue(sectionParams,page.value.Render,"blendDir")
                },
            )
        }

        //my way.
        const Render = () => {
            let pixel_color = [];
            resize_canvas_to_display_size(canvas);
            
            const width = canvas.width;
            const height = canvas.height;
            const blendDir = sectionParams.blendDir;
            const color1 =  JSON.parse(JSON.stringify(sectionParams.color1));
            const color2 =  JSON.parse(JSON.stringify(sectionParams.color2));
            
            const du = 1/width, dv = 1/height;
            let u = 0.5/width, v = 1/height;

            //——————{Dangerous
            for (let x = 0; x < width; x++) {
                u += du; v = 0;
                for (let y = 0; y < height; y++) {
                    v+=dv;
                    pixel_color = ray_color( blendDir ? u : v,color1,color2);
                    draw_point_by_uv(imgData, x, y, pixel_color);
                }
            }
            //——————}
            
            ctx?.putImageData(imgData, 0, 0);
        }

        const ray_color = (t: number, color1:number[],color2:number[]): number[] => {
            return [color1[0]* (1-t) + color2[0]*t,
                    color1[1]* (1-t) + color2[1]*t,
                    color1[2]* (1-t)+  color2[2]*t]
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