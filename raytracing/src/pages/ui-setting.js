/*
    Just to make source code shorter.
*/
import AnimEvent from "../plugins/anim-event/anim-event.min.js"
import LeaderLine from "../plugins/leader-line/leader-line.min.js";

// dragable.
let dragPosition = {
    x: 0,
    y: 0,
    maxX: 10000,
    maxY: 400
};

// node line.
const nodeLines = {
    mainPanelLine: null,
    debugPanelLine: null
}

// drag callback.
const panelDrag = (sidePanelPos, panelID, e) => {
    dragPosition.x = e.clientX;
    dragPosition.y = e.clientY;
    nodeLines.mainPanelLine.show("draw");
    // scroll not support now.
    if (window.scrollY === 0) {
        document.body.style.overflow = 'hidden'
        Object.values(nodeLines).forEach(element => {
            if (element) {
                element.position();
            }
        });
        document.onmousemove = AnimEvent.add((e) => {
            const evt = e || event;
            const offsetX = evt.clientX - dragPosition.x;
            const offsetY = evt.clientY - dragPosition.y;
            if (!(sidePanelPos[panelID].y > dragPosition.maxY && offsetY > 0)) {
                sidePanelPos[panelID].x += offsetX;
                sidePanelPos[panelID].y += offsetY;
                dragPosition.x = evt.clientX;
                dragPosition.y = evt.clientY;
                Object.values(nodeLines).forEach(element => {
                    if (element) {
                        element.position();
                    }
                });
            }
        });
        document.onmouseup = () => {
            document.onmousemove = null;
            document.body.style.overflow = 'visible'
        };

    }




};


// page default ui.
const setDefaultUI = (slotID) => {
    let options = {
        startSocket: 'right',
        endSocket: 'top',
        color: 'rgba(255, 255, 0, 0.9)',
    };
    nodeLines.mainPanelLine = new LeaderLine(
        document.getElementById(slotID.MAIN_PANEL_SLOT_ID),
        document.getElementById(slotID.CORE_SLOT_TOP_ID),
        options,
    );

    Object.values(nodeLines).forEach(element => {
        if (element) {
            element.hide("none");
        }
    });

}


const setDebugPanelCon = (slotID) => {
    let options = {
        startSocket: 'right',
        endSocket: 'left',
        color: 'rgba(0, 255, 0, 0.9)',
    };

    nodeLines.debugPanelLine = new LeaderLine(
        document.getElementById(slotID.DEBUG_OUT_SLOT_ID),
        document.getElementById(slotID.DEBUG_IN_SLOT_ID),
        options,
    );
    nodeLines.debugPanelLine.hide('none');
}


// some normal callbacks for param.
const globalUiCallbacks = {
    updatePoint: (sectionParams, Render,pointName) => {
        return function (event,ui) {
            sectionParams[pointName] = ui.value;
            requestAnimationFrame(Render()) 
        }
    },
    updateValue: (sectionParams, Render,valueName) => {
        return function (event,ui) {
            sectionParams[valueName] = ui.value;
            Render()
        }
    },
    updateVector3:(sectionParams, Render,vector3Name,)=>{
        return function(event, ui){
            sectionParams[vector3Name] = ui.value;
            Render()
        }
    },
    updateChildVector3:(sectionParams, Render,childName,vector3Name,)=>{
        return function(event, ui){
            sectionParams[childName][vector3Name] = ui.value;
            Render()
        }
    },
    updatePointArray:(sectionParams, Render,index) =>{
        return function (event, ui){
            sectionParams[valueName][index] = ui.value;
            Render()
        }
    }

}

const updateSlot = () => {
    Object.values(nodeLines).forEach(element => {
        if (element) {
            element.position();
        }
    });
}

const destroy = () => {
    Object.values(nodeLines).forEach(element => {
        if (element) {
            element.remove();
        }
    });
}

// draw grid as canvas`s background.
const drawGrid = (component) => {
    const CanvasWidth = component.canvas.width;
    const CanvasHeight = component.canvas.height;
    const girdSize = component.sectionParams.girdSize;
    const ctx = component.ctx;
    var xLineTotals = Math.floor(CanvasHeight / girdSize);
    var yLineTotals = Math.floor(CanvasWidth / girdSize);
    for (var i = 0; i < xLineTotals; i++) {
        ctx.beginPath();
        ctx.moveTo(0, girdSize * i);
        ctx.lineTo((yLineTotals - 1) * girdSize, girdSize * i);
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
    }
    for (var j = 0; j < yLineTotals; j++) {
        ctx.beginPath();
        ctx.moveTo(girdSize * j, 0);
        ctx.lineTo(girdSize * j, (xLineTotals - 1) * girdSize);
        ctx.strokeStyle = "#ccc";
        ctx.stroke();
    }

}


// draw line in grid by Bresenham.
const drawPointInGrid = (component, gridx, gridy, color) => {

    const girdSize = component.sectionParams.girdSize;
    // cant overflow.
    if (gridx > parseInt(component.canvas.width / girdSize) - 2 ||
        gridy > parseInt(component.canvas.height) / girdSize - 2)
        return;

    const rectx = gridx * girdSize;
    const recty = gridy * girdSize;
    component.ctx.fillStyle = color;
    component.ctx.fillRect(rectx, recty, girdSize, girdSize);

}

const drawLine = (ctx, beginPoint, endPoint, color) => {
    ctx.beginPath();
    ctx.moveTo(beginPoint.x, beginPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = color;
    ctx.stroke();
}

// draw line in grid with bresenham.
const drawLineInGrid = (component, beginPoint, endPoint, color) => {
    let temp = null;
    let m, x, y = 0;
    let e = -0.5;
    //Horizontal line.
    if (beginPoint.y == endPoint.y) {
        if (beginPoint.x > endPoint.x) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        for (x = beginPoint.x; x < endPoint.x; x++)
            drawPointInGrid(component, x, beginPoint.y, color);
        return;
    }
    //Vertical line.
    if (beginPoint.x == endPoint.x) {
        if (beginPoint.y > endPoint.y) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        for (y = beginPoint.y; y < endPoint.y; y++)
            drawPointInGrid(component, beginPoint.x, y, color);
        return;
    }

    m = (endPoint.y - beginPoint.y) / (endPoint.x - beginPoint.x);
    if (m > 0 && m <= 1) {
        if (beginPoint.x > endPoint.x) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = -0.5;
        x = beginPoint.x;
        y = beginPoint.y;
        while (x < endPoint.x) {
            drawPointInGrid(component, x, y, color);
            e = e + m;
            if (e > 0) {
                y++;
                e = e - 1;
            }
            x++;
        }
    } else if (m >= -1 && m < 0) {
        if (beginPoint.x > endPoint.x) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = 0.5;
        x = beginPoint.x;
        y = beginPoint.y;
        while (x < endPoint.x) {
            drawPointInGrid(component, x, y, color);
            e = e + m;
            if (e < 0) {
                y--;
                e = e + 1;
            }
            x++;
        }
    } else if (m > 1) {
        if (beginPoint.y > endPoint.y) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = -0.5;
        x = beginPoint.x;
        y = beginPoint.y;
        while (y < endPoint.y) {
            drawPointInGrid(component, x, y, color);
            e = e + 1 / m;
            if (e > 0) {
                x = x + 1;
                e = e - 1;
            }
            y++;
        }
    } else {
        if (beginPoint.y > endPoint.y) {
            temp = beginPoint;
            beginPoint = endPoint;
            endPoint = temp;
        }
        e = 0.5;
        x = beginPoint.x;
        y = beginPoint.y;
        while (y < endPoint.y) {
            drawPointInGrid(component, x, y, color);
            e = e + 1 / m;
            if (e < 0) {
                x--;
                e = e + 1;
            }
            y++;
        }
    }
}
const resizeCanvasToDisplaySize = (canvas, multiplier)=>{
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


export default {
    panelDrag,
    setDefaultUI,
    setDebugPanelCon,
    nodeLines,
    globalUiCallbacks,
    updateSlot,
    destroy,
    drawGrid,
    drawPointInGrid,
    drawLine,
    drawLineInGrid,
    resizeCanvasToDisplaySize
}