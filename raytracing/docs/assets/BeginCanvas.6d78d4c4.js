import{d as h,n as D,r as C,u as p,_ as k,o as R,c as B,a as x}from"./index.0bb16d7e.js";import{r as U,d as w}from"./RenderUtils.1dc0c613.js";const S={category:"Raytracing",name:"Raytracing",buttonContent:"\u67E5\u770B\u6E90\u7801",title:"Begin",content:"Begin raytracing from blending two colors."},J=h({name:"BeginCanvas",components:{nano_raytracing_page:D},setup(){const e=C();let t,o,c,a={color1:[255,255,255],color2:[128,180,255],blendDir:!0};const g=()=>{t=e.value.getCanvas(),o=e.value.getContext(),o?c=o.createImageData(t.width,t.height):console.log("context not found!"),e.value.addUIItem({type:"slider-vector",id:"color1",value:a.color1,min:{0:0,1:0,2:0},max:{0:255,1:255,2:255},callback:p.globalUiCallbacks.updateVector3(a,e.value.Render,"color1")}),e.value.addUIItem({type:"slider-vector",id:"color2",value:a.color2,min:{0:0,1:0,2:0},max:{0:255,1:255,2:255},callback:p.globalUiCallbacks.updateVector3(a,e.value.Render,"color2")}),e.value.addUIItem({type:"checkbox",id:"blendDir",value:a.blendDir,default:!1,callback:p.globalUiCallbacks.updateValue(a,e.value.Render,"blendDir")})},s=()=>{let n=[];U(t);const r=t.width,l=t.height,v=a.blendDir,b=JSON.parse(JSON.stringify(a.color1)),f=JSON.parse(JSON.stringify(a.color2)),y=1/r,I=1/l;let _=.5/r,i=1/l;for(let d=0;d<r;d++){_+=y,i=0;for(let u=0;u<l;u++)i+=I,n=m(v?_:i,b,f),w(c,d,u,n)}o==null||o.putImageData(c,0,0)},m=(n,r,l)=>[r[0]*(1-n)+l[0]*n,r[1]*(1-n)+l[1]*n,r[2]*(1-n)+l[2]*n];return{desData:S,page:e,Render:s,Init:g}}});function N(e,t,o,c,a,g){const s=x("nano_raytracing_page");return R(),B(s,{prop_des_data:e.desData,onInit:e.Init,onRender:e.Render,ref:"page"},null,8,["prop_des_data","onInit","onRender"])}const V=k(J,[["render",N]]);export{V as default};