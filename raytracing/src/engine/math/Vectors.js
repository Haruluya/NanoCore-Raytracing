

export const vec3Add = (a, b, dst)=>{
    dst = dst || new Float32Array(3);
    dst[0] = a[0] + b[0];
    dst[1] = a[1] + b[1];
    dst[2] = a[2] + b[2];
    return dst;
}

// 向量相减，
export const vec3Sub = (a, b)=>{
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export const vec3Normalize = (v)=>{
    var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    // make sure we don't divide by 0.
    if (length > 0.00001) {
      return [v[0] / length, v[1] / length, v[2] / length];
    } else {
      return [0, 0, 0];
    }
}

export const vec3Dot = (v1,v2)=>{
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2] 
}

export const vec3Len2 = (v)=>{
    return v[0]*v[0] + v[1]*v[1] +v[2]*v[2]; 
}

export const vec3Mutiply = (v,k)=>{
    return [v[0]*k,v[1]*k,v[2]*k]; 
}

export const vec3NearZero = (v)=>{
    const s = 1e-8;
    return (Math.abs(v[0]) < s) && (Math.abs(v[1]) < s) && (Math.abs(v[2]) < s);
}




export const vec3Refract = (uv, n, etai_over_etat)=>{
    let cos_theta = vec3Dot(vec3Mutiply(uv,-1),n) < 1.0 ? vec3Dot(vec3Mutiply(uv,-1),n):1.0;
    let r_out_perp = vec3Mutiply(etai_over_etat,vec3Add(uv,vec3Mutiply(n,cos_theta)));
    let r_out_parallel = vec3Mutiply(n,-Math.sqrt(Math.abs(1.0 - vec3Len2(r_out_perp)))); 
    return vec3Add(r_out_perp,r_out_parallel);
}



export const vec3Reflect = (v, n)=>{
    return vec3Sub(v,vec3Mutiply(n,2*vec3Dot(v,n)));
}

export const vec3MutiplyVec3 = (v1, v2)=>{
    return [v1[0]*v2[0], v1[1]*v2[1],v1[2]*v2[2]];
}

export const scaleVector = (v, s, dst)=>{
    dst = dst || new Float32Array(3);
    dst[0] = v[0] * s;
    dst[1] = v[1] * s;
    dst[2] = v[2] * s;
    return dst;
  }


export const  radToDeg = (r)=> {
    return r * 180 / Math.PI;
}

export const  degToRad = (d)=> {
    return d * Math.PI / 180;
}

export const vec3Cross = (a, b)=>{
    return [a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
}