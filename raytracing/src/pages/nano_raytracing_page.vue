<template>
    <div class="pageContainer">
        <div class="webglContainer" id="canvasSlot">
            <div ref="nanoCanvasContainer">
            <nano_raytracing_canvas ref="nanoCanvas"/>
            </div>
        </div>
        <div class="desPanel">
            <nano_webgl_des_panel
                :prop_category="prop_des_data.category"
                :prop_name="prop_des_data.name"
                :prop_button_content="prop_des_data.buttonContent"
                :prop_title="prop_des_data.title"
                :prop_content="prop_des_data.content"
                :prop_core_slot_id="slotID.CORE_SLOT_TOP_ID"
                @handleClick="pageCallback().handleClick"
            />
        </div>

        <div class="sidePanel" ref="sidePanel"
            >
            <div class="mainPanel"
                :style="{left:sidePanelPos.mainPanel.x + 'px',top:sidePanelPos.mainPanel.y + 'px'}"
                @mousedown="uiSetting.panelDrag(sidePanelPos,'mainPanel',$event)" >
                <nano_param_panel
                    :prop_ui_setter="uiSetter"
                    :prop_panel_slot_id="slotID.MAIN_PANEL_SLOT_ID"
                    :prop_debug_slot_id="slotID.DEBUG_OUT_SLOT_ID"
                    @showDebug="pageCallback().showDebugPanel"
                    @updateSlot="uiSetting.updateSlot"
                />
            </div>
            <transition name="debugPanelTransition">
                <div class="debugPanel"
                    v-show="showDebug"
                    :style="{left:sidePanelPos.debugPanel.x + 'px',top:sidePanelPos.debugPanel.y + 'px'}"
                    @mousedown="uiSetting.panelDrag(sidePanelPos,'debugPanel',$event)">
                    <nano_param_output_panel
                        prop_title="Debug"
                        :prop_slot_id="slotID.DEBUG_IN_SLOT_ID"
                        :prop_content="debugContent"
                    />
                </div>
            </transition>
        </div>
    </div>

</template>
<script lang="ts">
import { defineComponent, reactive, ref,onMounted, computed,nextTick} from 'vue';
import uiSetting from "./ui-setting"
import nano_raytracing_canvas from '../components/nano_raytracing_canvas/nano_raytracing_canvas.vue';
/*
    @author:haruluya.
    @des:This component is used to make the source code more concise.
*/
export default defineComponent({
    name: 'raytracing',
    components:{
        nano_raytracing_canvas
    },
    props:{
        prop_des_data:{
            type:Object,
            default:{
                category:"None",
                name:"None",
                buttonContent:"None",
                title:"None",
                content:"None"
            },
            required:true
        },
        prop_page_config:{
            type:Object,
            default:{
                mutiMode:true,
                offset:true,
            }
        }
    },
    setup(props,context){
        //origin canvas. 
        let nanoCanvas = ref();
        let nanoCanvasContainer = ref();

        //canvas context.
        let canvas:HTMLCanvasElement;
        let ctx:CanvasRenderingContext2D;
        let imgData:ImageData;

        // basic params.
        let sectionParams:{[index:string]:any} = reactive({
        });

        let showDebug = ref<boolean>(false);
        let debugContent = ref([{}]);
        const slotID = {
            MAIN_PANEL_SLOT_ID : 1,
            DEBUG_IN_SLOT_ID : 2,
            DEBUG_OUT_SLOT_ID : 3,
            CORE_SLOT_TOP_ID : 4
        }
        const sidePanelPos = reactive({
            mainPanel:{ x: 1050, y: 150 },
            debugPanel:{x:1200, y:400}
        });

       
        //ui
        let sectionUI = ref<Array<UIItem>>([]);

        //basic init. 
        const Init = ()=>{
            //canvas.
            canvas = nanoCanvas.value.$refs.canvas;
            if (!canvas){console.log("canvas not found!"); return;}
            //context.
            ctx = canvas.getContext('2d');
            if (!ctx){console.log("ctx not found!");return;}
            //image data.
            imgData = ctx.createImageData(canvas.width,canvas.height);
            // set canvas pixel.
            uiSetting.resizeCanvasToDisplaySize(getCanvas());
            //section init.
            context.emit('Init');
            // requestFrame();
            Render()
        }

        //basic render.
        const Render = ()=>{
            uiSetting.resizeCanvasToDisplaySize(getCanvas());
            debugContent.value = [{}];
            //fps.
            const beforeTime = Date.now();
            ctx.clearRect(0,0,canvas.width,canvas.height)


            //section render.   
            context.emit("Render");
            //debug.
            debugLog("FPS",1000 / (Date.now() - beforeTime) + '')
            // requestFrame();
        }

        //set pageui.
        const SetUI = ()=>{
            uiSetting.setDefaultUI(slotID);
        }

        // ui configuration.
        let uiSetter = computed(()=>{
                        //ui.   
            let ui:Array<UIItem> = [
            ]
            sectionUI.value.forEach((e)=>{
                ui.push(e);
            })
    
            return ui;
        })


        onMounted(()=>{
            Init();
            SetUI();
        });

        //utils.
        const pageCallback = ()=>{
            return {
                handleClick: () => {
                    window.location.href =
                        "https://github.com/Haruluya/NanoCore-Raytracing/tree/master/raytracing/src/pages/"+props.prop_des_data.name+"/"+props.prop_des_data.name+".vue";
                },
                showDebugPanel: () => {
                    showDebug.value = !showDebug.value;
                    if (showDebug.value) {
                        nextTick(() => {
                            uiSetting.setDebugPanelCon(slotID);
                            uiSetting.nodeLines.debugPanelLine.show("draw");
                        });
                    }
                    else {
                        uiSetting.nodeLines.debugPanelLine.hide("draw");
                        uiSetting.nodeLines.debugPanelLine.remove();
                        uiSetting.nodeLines.debugPanelLine = null;
                    }
                },
            };
        };


        const getCanvas = ()=>{
            return canvas;
        }

        const getContext = ()=>{
            return ctx;
        }

        const getSectionParams = ()=>{
            return sectionParams;
        }

        const getImgData = ()=>{
            return imgData;
        }

        const debugLog = (title:string,content:string)=>{
            for(let i = 0; i < debugContent.value.length; i++){
                if(debugContent.value[i].title == title){
                    return;
                }
            }
            debugContent.value.push({
                title,
                content
            })
        };

        const addUIItem = (uiItem:UIItem)=>{
            sectionUI.value.push(uiItem);
        }
        const addParam = (param:{name:string,value:any})=>{
            sectionParams[param.name] = param.value;
        }
     
        return{
            sectionParams,
            uiSetting,
            uiSetter,
            slotID,
            sidePanelPos,
            nanoCanvas,
            nanoCanvasContainer,
            showDebug,
            debugContent,
            debugLog,
            Render,
            pageCallback,
            getCanvas,
            getContext,
            getImgData,
            addUIItem,
            addParam,
            getSectionParams
        }
    }
})

</script>

<style lang="less" scoped>
@import "./index.less";
</style>