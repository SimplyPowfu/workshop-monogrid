import { Object3D } from 'three';
import gsap from 'gsap';

export class Configurator3D {
    private lampshades: Object3D[] = [];
    private bottles: Object3D[] = [];
    
    private currentLampIndex: number = 1;
    private currentBottleIndex: number = 0;

    constructor(lampshadeModel: Object3D, bottleModel: Object3D) {
        ["lampshade0", "lampshade1", "lampshade2", "lampshade3"].forEach(name => {
            const obj = lampshadeModel.getObjectByName(name);
            if (obj) this.lampshades.push(obj);
        });

        ["jack", "jager", "vodka"].forEach(name => {
            const obj = bottleModel.getObjectByName(name);
            if (obj)
                this.bottles.push(obj);
        });

        this.applyVisibility();
    }

    public switchLamp(index: number) {
        if (index < 0 || index >= this.lampshades.length) return;
        this.currentLampIndex = index;
        this.applyVisibility();
        const current = this.lampshades[index]
        if (!current) return ;
        this.animateIn(current);
    }

    public switchBottle(index: number) {
        if (index < 0 || index >= this.bottles.length) return;
        this.currentBottleIndex = index;
        this.applyVisibility();
        const current = this.bottles[index]
        if (!current) return ;
        this.animateIn(current);
    }

    private applyVisibility() {
        this.lampshades.forEach((shade, i) => {
            shade.visible = (i === this.currentLampIndex);
        });

        this.bottles.forEach((bottle, i) => {
            bottle.visible = (i === this.currentBottleIndex);
        });
    }

    private animateIn(obj: Object3D) {
        gsap.from(obj.scale, {
            x: 0.8, y: 0.8, z: 0.8,
            duration: 0.3,
            ease: "back.out(2)"
        });
    }
}