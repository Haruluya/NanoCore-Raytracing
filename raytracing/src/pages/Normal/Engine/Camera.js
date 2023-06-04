import {degToRad,vec3Cross,vec3Normalize,vec3Add,vec3Sub,scaleVector, vec3Mutiply} from '../../../engine/math/Vectors'
import Ray from './Ray';

export default class Camera{
    yaw = 90;
    pitch = 0;
    speed = .01;
    sensitivity = .3;
    zoom = 45.0;
    cameraData = null;
    front = null;
    right = null;
    up = null;
    worldUp = null;
    canvas = null;
    lockView = false;

    constructor(canvas,cameraData){
        this.worldUp = cameraData.up;
        this.cameraData = cameraData;
        this.canvas = canvas;
        if (!this.canvas){
            throw new Error("camera init failed!");
        }

        this.updateCameraVectors();
    }

    setCameraPos(cameraPos){
        this.cameraData.position = cameraPos;
        updateCameraVectors();
    }

    shootRay(pixelX, pixelY) {
        // Convert pixel coordinates to NDC coordinates
        let ndcX = (2 * pixelX) / this.canvas.clientWidth - 1;
        const ndcY = 1 - (2 * pixelY) / this.canvas.clientHeight;

        // Adjust ndcX based on aspect ratio
        const aspectRatio = this.canvas.clientWidth / this.canvas.clientHeight;
        ndcX = ndcX * aspectRatio;

        // Calculate ray direction in camera space
        const rayDirCameraSpace = [
            ndcX * Math.tan(degToRad(this.zoom / 2)),
            ndcY * Math.tan(degToRad(this.zoom / 2)),
            -1,  // Assuming the camera is looking towards the negative z-axis
        ];

        // Transform ray direction from camera space to world space
        const rayDirWorldSpace = [
            rayDirCameraSpace[0] * this.right[0] + rayDirCameraSpace[1] * this.up[0] + rayDirCameraSpace[2] * this.front[0],
            rayDirCameraSpace[0] * this.right[1] + rayDirCameraSpace[1] * this.up[1] + rayDirCameraSpace[2] * this.front[1],
            rayDirCameraSpace[0] * this.right[2] + rayDirCameraSpace[1] * this.up[2] + rayDirCameraSpace[2] * this.front[2],
        ];

        // Normalize the ray direction
        const rayDirNormalized = vec3Normalize(rayDirWorldSpace);

        // Set ray origin as the camera position
        const rayOrigin = this.cameraData.position;

        // Create and return the ray instance
        return new Ray(rayOrigin, rayDirNormalized);
    }

    updateCameraVectors(){

        let front = [0,0,0];
        front[0] = Math.cos(degToRad(this.yaw)) * Math.cos(degToRad(this.pitch));
        front[1] = Math.sin(degToRad(this.pitch));
        front[2] = Math.sin(degToRad(this.yaw)) * Math.cos(degToRad(this.pitch));

        this.front = vec3Normalize(front);
        this.right = vec3Normalize(vec3Cross(this.front,this.worldUp));
        this.up = vec3Normalize(vec3Cross(this.right,this.front));
        this.cameraData.target =  vec3Sub(this.cameraData.position,this.front);

    }

}