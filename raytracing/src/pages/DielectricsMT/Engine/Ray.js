import { vec3Add, vec3Mutiply } from "../../../engine/math/Vectors";


export default class Ray{
    constructor(origin,direction){
        this.m_origin = origin;
        this.m_direction = direction;
    }

    get origin(){
        return this.m_origin;
    }
    get direction(){
        return this.m_direction;
    }

    setDirection(direction){
        this.m_direction = direction
    }

    setOrigin(origin){
        this.m_origin = origin
    }

    at(t){
        return vec3Add(this.m_origin,vec3Mutiply(this.m_direction,t));
    }


}