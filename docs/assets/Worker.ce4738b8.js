(function(){"use strict";const _=(i,t,n)=>(n=n||new Float32Array(3),n[0]=i[0]+t[0],n[1]=i[1]+t[1],n[2]=i[2]+t[2],n),d=(i,t)=>[i[0]-t[0],i[1]-t[1],i[2]-t[2]],I=i=>{var t=Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2]);return t>1e-5?[i[0]/t,i[1]/t,i[2]/t]:[0,0,0]},f=(i,t)=>i[0]*t[0]+i[1]*t[1]+i[2]*t[2],b=i=>i[0]*i[0]+i[1]*i[1]+i[2]*i[2],M=(i,t)=>[i[0]*t,i[1]*t,i[2]*t],g=(i,t)=>i!=null&&t!=null?i+(t-i)*Math.random():Math.random(),U=(i,t)=>i&&t?[g(i,t),g(i,t),g(i,t)]:[g(),g(),g()],Z=()=>{for(;;){let i=U(-1,1);if(!(Math.pow(i[0]*i[0]+i[1]*i[1]+i[2]*i[2],2)>=1))return i}};class R{constructor(t,n){this.m_origin=t,this.m_direction=n}get origin(){return this.m_origin}get direction(){return this.m_direction}setDirection(t){this.m_direction=t}setOrigin(t){this.m_origin=t}at(t){return _(this.m_origin,M(this.m_direction,t))}}class G{constructor(t,n,o,e){this.p=t,this.normal=n,this.t=o,this.front_face=e}set_face_normal(t,n){front_face=f(t.direction,n)<0,normal=front_face?n:-n}}class C{hit(t,n,o,e){}}class H extends C{constructor(t){super(),this.objects=t}add(t){this.objects.push(t)}clear(){this.objects=[]}hit(t,n,o,e){let a=!1,r=o;return this.objects.forEach(l=>{l.hit(t,n,r,e)&&(a=!0,r=e.t)}),a}}class S extends C{constructor(t,n){super(),this.center=t,this.radius=n}hit(t,n,o,e){let a=d(t.origin,this.center),r=b(t.direction),l=f(a,t.direction),m=b(a)-this.radius*this.radius,c=l*l-r*m;if(c>0){let h=Math.sqrt(c),s=(-l-h)/r;if(s<o&&s>n)return e.t=s,e.p=t.at(e.t),e.normal=M(d(e.p,this.center),1/this.radius),!0;if(s=(-l+h)/r,s<o&&s>n)return e.t=s,e.p=t.at(e.t),e.normal=M(d(e.p,this.center),1/this.radius),!0}return!1}}class J extends C{constructor(t,n){super(),this.min=t,this.max=n}hit(t,n,o,e){let a,r,l=1/t.direction[0],m=1/t.direction[1],c=1/t.direction[2],h=(this.min[0]-t.origin[0])*l,s=(this.max[0]-t.origin[0])*l;if(a=Math.min(h,s),r=Math.max(h,s),h=(this.min[1]-t.origin[1])*m,s=(this.max[1]-t.origin[1])*m,a=Math.max(a,Math.min(h,s)),r=Math.min(r,Math.max(h,s)),h=(this.min[2]-t.origin[2])*c,s=(this.max[2]-t.origin[2])*c,a=Math.max(a,Math.min(h,s)),r=Math.min(r,Math.max(h,s)),r<a)return!1;if(a>n&&r<o)e.t=a;else if(r>n&&r<o)e.t=r;else return!1;e.p=[t.origin[0]+e.t*t.direction[0],t.origin[1]+e.t*t.direction[1],t.origin[2]+e.t*t.direction[2]];let u=[0,0,0];return e.p[0]<this.min[0]+1e-4?u[0]=-1:e.p[0]>this.max[0]-1e-4&&(u[0]=1),e.p[1]<this.min[1]+1e-4?u[1]=-1:e.p[1]>this.max[1]-1e-4&&(u[1]=1),e.p[2]<this.min[2]+1e-4?u[2]=-1:e.p[2]>this.max[2]-1e-4&&(u[2]=1),e.normal=u,!0}}class K extends C{constructor(t,n,o){super(),this.center=t,this.radius=n,this.height=o}hit(t,n,o,e){const a=d(t.origin,this.center),r=b(t.direction)-Math.pow(f(t.direction,this.axis()),2),l=f(a,t.direction)-f(a,this.axis())*f(t.direction,this.axis()),m=b(a)-Math.pow(f(a,this.axis()),2)-Math.pow(this.radius,2),c=Math.pow(l,2)-r*m;if(c>0){let h=Math.sqrt(c),s=(-l-h)/r;if(s<o&&s>n&&this.isWithinBounds(s,t)){e.t=s,e.p=t.at(e.t);const u=I(d(d(e.p,this.center),M(this.axis(),f(d(e.p,this.center),this.axis()))));return e.normal=u,!0}if(s=(-l+h)/r,s<o&&s>n&&this.isWithinBounds(s,t)){e.t=s,e.p=t.at(e.t);const u=I(d(d(e.p,this.center),M(this.axis(),f(d(e.p,this.center),this.axis()))));return e.normal=u,!0}}return!1}axis(){return[0,1,0]}isWithinBounds(t,n){const o=n.origin[1]+t*n.direction[1];return o>=this.center[1]&&o<=this.center[1]+this.height}}let w=new G,z,O=new R(origin,origin),j,B,q,A,x=new H([]);const E=(i,t)=>{if(t<=0)return[0,0,0];if(x.hit(i,.001,99999,w))return j=w.p,B=w.normal,q=Z(),z=[j[0]+B[0]+q[0],j[1]+B[1]+q[1],j[2]+B[2]+q[2]],O.setOrigin(w.p),O.setDirection(d(z,w.p)),A=E(O,t-1),[A[0]*.5,A[1]*.5,A[2]*.5];{let o=(I(i.direction)[1]+1)*.5;return[255*(1-.5*o),255*(1-.3*o),255]}};self.onmessage=function(i){const{width:t,height:n,max_depth:o,origin:e,bgCircleCenter:a,circleCenter:r,radius:l,samples_per_pixel:m,startX:c,startY:h,endX:s,endY:u}=i.data;let p;const P=1/t,Q=1/n,T=t/n;let N,y=new R(e,e);x.clear(),x.add(new S(_(a,d(e,[.5,.5,1])),100)),x.add(new S(_(r,d(e,[.5,.5,1])),l)),x.add(new J(d(r,[.4,.1,0]),_(r,[l-.3,l,l]))),x.add(new K(_(r,[.3,-.1,0]),l,.2));let F=0;c==t/2&&h==n/2&&(F=-t/2);const D=new Uint8ClampedArray((s-c)*(u-h)*4);for(let W=c;W<s;W++){const V=(W+.5+F)*P;for(let X=h;X<u;X++){const $=(X+.5)*Q;p=[0,0,0];for(let L=0;L<m;L++)y.setDirection([T*(V-y.origin[0]),$-y.origin[1],-y.origin[2]]),N=E(y,o),p[0]+=N[0],p[1]+=N[1],p[2]+=N[2];const Y=(W-c+(X-h)*(s-c))*4;D[Y+0]=p[0]/m,D[Y+1]=p[1]/m,D[Y+2]=p[2]/m,D[Y+3]=255}}self.postMessage({partImageData:D,startX:c,startY:h,endX:s,endY:u})}})();