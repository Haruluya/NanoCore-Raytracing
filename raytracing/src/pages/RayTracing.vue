<template>
    <div id="RayTracing">
        <canvas class="show" ref="canvas" width="800" height="800"/>
        <canvas class="textureCanvas" ref="texture" width="1024" height="1024">
        </canvas>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref,onMounted} from 'vue';

/// <reference path="../engine/core/Application.ts" />
import Application = NanoRayTracing.Application


export default defineComponent({
  name: 'RayTracing',
  setup(){
    const engine:Application = ref<Application>(new Application());


    onMounted(()=>{
        engine.Run();

    })
  }
})
</script>
<style lang="less" scoped>

</style>