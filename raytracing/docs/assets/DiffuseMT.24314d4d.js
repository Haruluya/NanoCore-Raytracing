import{d as it,n as at,r as st,u as k,_ as nt,o as rt,c as ot,a as lt}from"./index.c9ddb6cf.js";import{r as ct,b as dt}from"./RenderUtils.1dc0c613.js";import{v as N,a as R,g,e as u,f as E,b as q}from"./Vectors.edfcf4f8.js";import{r as ht}from"./Random.16a9fda4.js";class K{constructor(t,i){this.m_origin=t,this.m_direction=i}get origin(){return this.m_origin}get direction(){return this.m_direction}setDirection(t){this.m_direction=t}setOrigin(t){this.m_origin=t}at(t){return N(this.m_origin,R(this.m_direction,t))}}class ut{constructor(t,i,n,e){this.p=t,this.normal=i,this.t=n,this.front_face=e}set_face_normal(t,i){front_face=g(t.direction,i)<0,normal=front_face?i:-i}}class L{hit(t,i,n,e){}}class pt extends L{constructor(t){super(),this.objects=t}add(t){this.objects.push(t)}clear(){this.objects=[]}hit(t,i,n,e){let o=!1,a=n;return this.objects.forEach(d=>{d.hit(t,i,a,e)&&(o=!0,a=e.t)}),o}}class Q extends L{constructor(t,i){super(),this.center=t,this.radius=i}hit(t,i,n,e){let o=u(t.origin,this.center),a=E(t.direction),d=g(o,t.direction),r=E(o)-this.radius*this.radius,m=d*d-a*r;if(m>0){let c=Math.sqrt(m),l=(-d-c)/a;if(l<n&&l>i)return e.t=l,e.p=t.at(e.t),e.normal=R(u(e.p,this.center),1/this.radius),!0;if(l=(-d+c)/a,l<n&&l>i)return e.t=l,e.p=t.at(e.t),e.normal=R(u(e.p,this.center),1/this.radius),!0}return!1}}class mt extends L{constructor(t,i){super(),this.min=t,this.max=i}hit(t,i,n,e){let o,a,d=1/t.direction[0],r=1/t.direction[1],m=1/t.direction[2],c=(this.min[0]-t.origin[0])*d,l=(this.max[0]-t.origin[0])*d;if(o=Math.min(c,l),a=Math.max(c,l),c=(this.min[1]-t.origin[1])*r,l=(this.max[1]-t.origin[1])*r,o=Math.max(o,Math.min(c,l)),a=Math.min(a,Math.max(c,l)),c=(this.min[2]-t.origin[2])*m,l=(this.max[2]-t.origin[2])*m,o=Math.max(o,Math.min(c,l)),a=Math.min(a,Math.max(c,l)),a<o)return!1;if(o>i&&a<n)e.t=o;else if(a>i&&a<n)e.t=a;else return!1;e.p=[t.origin[0]+e.t*t.direction[0],t.origin[1]+e.t*t.direction[1],t.origin[2]+e.t*t.direction[2]];let p=[0,0,0];return e.p[0]<this.min[0]+1e-4?p[0]=-1:e.p[0]>this.max[0]-1e-4&&(p[0]=1),e.p[1]<this.min[1]+1e-4?p[1]=-1:e.p[1]>this.max[1]-1e-4&&(p[1]=1),e.p[2]<this.min[2]+1e-4?p[2]=-1:e.p[2]>this.max[2]-1e-4&&(p[2]=1),e.normal=p,!0}}class gt extends L{constructor(t,i,n){super(),this.center=t,this.radius=i,this.height=n}hit(t,i,n,e){const o=u(t.origin,this.center),a=E(t.direction)-Math.pow(g(t.direction,this.axis()),2),d=g(o,t.direction)-g(o,this.axis())*g(t.direction,this.axis()),r=E(o)-Math.pow(g(o,this.axis()),2)-Math.pow(this.radius,2),m=Math.pow(d,2)-a*r;if(m>0){let c=Math.sqrt(m),l=(-d-c)/a;if(l<n&&l>i&&this.isWithinBounds(l,t)){e.t=l,e.p=t.at(e.t);const p=q(u(u(e.p,this.center),R(this.axis(),g(u(e.p,this.center),this.axis()))));return e.normal=p,!0}if(l=(-d+c)/a,l<n&&l>i&&this.isWithinBounds(l,t)){e.t=l,e.p=t.at(e.t);const p=q(u(u(e.p,this.center),R(this.axis(),g(u(e.p,this.center),this.axis()))));return e.normal=p,!0}}return!1}axis(){return[0,1,0]}isWithinBounds(t,i){const n=i.origin[1]+t*i.direction[1];return n>=this.center[1]&&n<=this.center[1]+this.height}}function ft(){return new Worker(""+new URL("Worker.a2a17c54.js",import.meta.url).href)}const _t={category:"DiffuseMT",name:"DiffuseMT",buttonContent:"\u67E5\u770B\u6E90\u7801",title:"DiffuseMT",content:"Lambert(1760)"},xt=it({name:"DiffuseMT",components:{nano_raytracing_page:at},setup(){const s=st();let t,i,n,e=[.5,.5,1],o=new K(e,e),a=new pt([]),d,r={circleCenter:[50,50,0],bgCircleCenter:[.5,99,-18],radius:10,origin:[50,50,100],samples_per_pixel:1,max_depth:20,use_worker:!1};const m=4,c=[];for(let f=0;f<m;f++){const _=new ft;c.push(_)}return{desData:_t,page:s,Render:()=>{let f=[0,0,0];ct(t);const _=t.width,C=t.height,P=JSON.parse(JSON.stringify(r.bgCircleCenter)),v=JSON.parse(JSON.stringify(r.circleCenter));Object.keys(v).forEach(h=>{v[h]/=100});const U=JSON.parse(JSON.stringify(r.origin));Object.keys(U).forEach(h=>{U[h]/=100});const y=JSON.parse(JSON.stringify(r.radius))/100,$=JSON.parse(JSON.stringify(r.samples_per_pixel)),A=JSON.parse(JSON.stringify(r.max_depth)),tt=_/C;a.clear(),a.add(new Q(N(P,u([.5,.5,1],[.5,.5,1])),100)),a.add(new Q(N(v,u([.5,.5,1],[.5,.5,1])),y)),a.add(new mt(u(v,[.4,.1,0]),N(v,[y-.3,y,y]))),a.add(new gt(N(v,[.3,-.1,0]),y,.2));let O=new ut,F,z=new K([.5,.5,1],[.5,.5,1]),J,W,j,B;const G=(h,w)=>{if(w<=0)return[0,0,0];if(a.hit(h,.001,99999,O))return J=O.p,W=O.normal,j=ht(),F=[J[0]+W[0]+j[0],J[1]+W[1]+j[1],J[2]+W[2]+j[2]],z.setOrigin(O.p),z.setDirection(u(F,O.p)),B=G(z,w-1),[B[0]*.5,B[1]*.5,B[2]*.5];{let x=(q(h.direction)[1]+1)*.5;return[255*(1-.5*x),255*(1-.3*x),255]}};if(o.setOrigin(U),r.use_worker){d=Date.now();for(let h=0;h<m;h++){c[h].onmessage=function(S){const{partImageData:b,startX:D,startY:Z,endX:H,endY:et}=S.data;for(let V=D;V<H;V++)for(let X=Z;X<et;X++){const Y=(X*_+V)*4,T=((X-Z)*(H-D)+V-D)*4;n.data[Y]=b[T],n.data[Y+1]=b[T+1],n.data[Y+2]=b[T+2],n.data[Y+3]=b[T+3]}i==null||i.putImageData(n,0,0),s.value.debugLog("Worker FPS",1e3/(Date.now()-d))};const w=h%2*(t.width/2),I=h<2?0:1*(t.height/2),x=w+t.width/2,M=I+t.height/2;c[h].postMessage({width:_,height:C,max_depth:A,origin:U,bgCircleCenter:P,circleCenter:v,radius:y,samples_per_pixel:$,startX:w,startY:I,endX:x,endY:M})}}else{const h=1/_,w=1/C;let I=.5/_,x=.5/C,M;for(let S=0;S<_;S++){I+=h,x=.5/C;for(let b=0;b<C;b++){x+=w,f=[0,0,0];for(let D=0;D<$;D++)o.setDirection([tt*(I-o.origin[0]),x-o.origin[1],-o.origin[2]]),M=G(o,A),f[0]+=M[0],f[1]+=M[1],f[2]+=M[2],dt(n,S,b,f,$)}}}i==null||i.putImageData(n,0,0)},Init:()=>{t=s.value.getCanvas(),i=s.value.getContext(),i?n=i.createImageData(t.width,t.height):console.log("context not found!"),s.value.addUIItem({type:"slider-vector",id:"bgCircleCenter",value:r.bgCircleCenter,min:{0:0,1:0,2:0},max:{0:255,1:255,2:255},callback:k.globalUiCallbacks.updateVector3(r,s.value.Render,"bgCircleCenter")}),s.value.addUIItem({type:"slider-vector",id:"circleCenter",value:r.circleCenter,min:{0:0,1:0,2:0},max:{0:100,1:100,2:100},callback:k.globalUiCallbacks.updateVector3(r,s.value.Render,"circleCenter")}),s.value.addUIItem({type:"slider",id:"radius",value:r.radius,min:0,max:100,callback:k.globalUiCallbacks.updateVector3(r,s.value.Render,"radius")}),s.value.addUIItem({type:"slider-vector",id:"origin",value:r.origin,min:{0:-500,1:-500,2:-500},max:{0:500,1:500,2:500},callback:k.globalUiCallbacks.updateVector3(r,s.value.Render,"origin")}),s.value.addUIItem({type:"slider",id:"samples_per_pixel",value:r.samples_per_pixel,min:1,max:100,callback:k.globalUiCallbacks.updateVector3(r,s.value.Render,"samples_per_pixel")}),s.value.addUIItem({type:"slider",id:"max_depth",value:r.max_depth,min:1,max:100,callback:k.globalUiCallbacks.updateVector3(r,s.value.Render,"max_depth")}),s.value.addUIItem({type:"checkbox",id:"use_worker",value:r.use_worker,default:!1,callback:k.globalUiCallbacks.updateValue(r,s.value.Render,"use_worker")})}}}});function bt(s,t,i,n,e,o){const a=lt("nano_raytracing_page");return rt(),ot(a,{prop_des_data:s.desData,onInit:s.Init,onRender:s.Render,ref:"page"},null,8,["prop_des_data","onInit","onRender"])}const yt=nt(xt,[["render",bt]]);export{yt as default};
