export const resize_canvas_to_display_size = (canvas, multiplier)=>{

    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {

        canvas.width  = width;
        canvas.height = height;
        return true;
    }
    return false;
}

export const deBug_Darw_Rect = (imgData,rect)=>{
    let pixelData = imgData.data;
    for(let x = rect[0]; x < rect[1]; x++){
        for(let y = rect[2]; y < rect[3]; y++){
            const pixelIndex = (x+y*imgData.width)*4;
            pixelData[pixelIndex+0] = 255 ;
            pixelData[pixelIndex+1] = 0 ;
            pixelData[pixelIndex+2] = 0 ;
            pixelData[pixelIndex+3] = 255;
        }
    }
}


export const draw_point_by_uv = (
    imgData,
    x,y,
    color,
    )=>{
    
    let pixelData = imgData.data;
    const pixelIndex = (x+y*imgData.width)*4;
    pixelData[pixelIndex+0] = color[0] ;
    pixelData[pixelIndex+1] = color[1] ;
    pixelData[pixelIndex+2] = color[2] ;
    pixelData[pixelIndex+3] = 255;

}


export const draw_point_by_uv_with_samples = (
    imgData,
    x,y,
    color,
    samples,
    )=>{
    let pixelData = imgData.data;
    const pixelIndex = (x+y*imgData.width)*4;
    pixelData[pixelIndex+0] = color[0]/samples;
    pixelData[pixelIndex+1] = color[1] /samples;
    pixelData[pixelIndex+2] = color[2] /samples;
    pixelData[pixelIndex+3] = 255;

}

export const draw_point_by_uv_with_samples_with_Gamma = (
    imgData,
    x,y,
    color,
    samples,
    )=>{
    let pixelData = imgData.data;
    const pixelIndex = (x+y*imgData.width)*4;
    pixelData[pixelIndex+0] = color[0] / samples ;
    pixelData[pixelIndex+1] = color[1] /samples;
    pixelData[pixelIndex+2] = color[2] /samples;
    pixelData[pixelIndex+3] = 255;

}