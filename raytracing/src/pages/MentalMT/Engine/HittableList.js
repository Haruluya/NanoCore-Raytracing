
import { hittable } from "./Hittable";
import { hit_record } from "./Hittable";

export default class hittable_list extends hittable {
    constructor(objects){
        super();
        this.objects = objects;
    }

    add(object){
        this.objects.push(object);
    }
    clear(){
        this.objects = []
    }

    hit(r, t_min, t_max, rec){
        let hit_anything = false;
        let closest_so_far = t_max;

        this.objects.forEach(object => {
            if (object.hit(r, t_min, closest_so_far, rec)) {
                hit_anything = true;
                closest_so_far = rec.t;
            }
        });
    
        return hit_anything;
    
    }


};

