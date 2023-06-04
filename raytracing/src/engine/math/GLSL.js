export const clamp = ()=>{
    if (x > max)
        return max;
    if (x < min)
        return min;
    return x;
}

export const smoothstep = (t1,t2,x)=>{
    x = clamp((x - t1) / (t2 - t1), 0.0, 1.0); 
    return x * x * (3 - 2 * x);
}

