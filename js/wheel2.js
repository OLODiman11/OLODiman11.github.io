const AMOUNT_OF_ITEMS_DISPLAYED = 7;
const OFFSET = Math.floor(AMOUNT_OF_ITEMS_DISPLAYED / 2);

class Wheel2{

    items = [];
    
    #spinning = false;
    #currentValue = 0;
    #scrollingSpeed = 0; // items per sec
    #prevSelection = -1;

    #x = 0;
    #y = 0;
    #radius = 0;

    constructor(x, y, radius){
        this.#x = x;
        this.#y = y;
        this.#radius = radius;
    }

    onNewSelection = function(selection) {};

    getCurrentSelection(){
        return mod(Math.round(this.#currentValue), this.items.length);
    }
    
    setItems(items){
        this.items = items;
    }

    spin(speed){
        this.#scrollingSpeed = speed;
    }

    startTheSpin(targetSpeed, accelarationTime, spinDuration, easingFunction, timer){
        this.setItems(shuffle(this.items));
        this.#startTheSpinUtil(
            0, 
            targetSpeed, 
            accelarationTime, 
            spinDuration, 
            easingFunction, 
            timer);
    }

    #startTheSpinUtil(elapsed, targetSpeed, accelarationTime, spinDuration, easingFunction, timer){
        elapsed += timer.deltaTime;
        let factor1 = clamp01(elapsed / accelarationTime);
        let factor2 = clamp01((spinDuration - elapsed) / accelarationTime);
        let factor = Math.min(factor1, factor2);
        let newSpeed = targetSpeed * easingFunction(factor);
        this.spin(newSpeed);
        if(factor2 !== 0) {
            window.requestAnimationFrame(() => 
                this.#startTheSpinUtil(
                    elapsed, 
                    targetSpeed, 
                    accelarationTime, 
                    spinDuration,
                    easingFunction, 
                    timer));
        }
        else{
            this.#spinTowardsSelectedItem();
        }
    }

    #spinTowardsSelectedItem(){
        let newSpeed = this.getCurrentSelection() - this.#currentValue;
        if(Math.abs(newSpeed) > 0.01){
            window.requestAnimationFrame(() => this.#spinTowardsSelectedItem());
        }
        else{
            newSpeed = 0;
        }
        this.spin(3 * newSpeed);
    }
    
    updateAndDraw(timer, context){
        context.clearRect(0, 0, 800, 600);

        this.#currentValue += this.#scrollingSpeed * timer.deltaTime;
        this.#currentValue = mod(this.#currentValue, this.items.length);
        
        let lowerBound = this.#currentValue - OFFSET;
        let upperBound = this.#currentValue + OFFSET;
        let currentItemIndex = Math.round(this.#currentValue);
        for (let i = currentItemIndex - OFFSET; i <= currentItemIndex + OFFSET; i++) {
            var factor = map(i, lowerBound, upperBound, 0, 1);
            let x = this.#x + this.#radius * Math.cos(Math.PI * (0.5 - factor));
            let y = this.#y + this.#radius * Math.sin(Math.PI * (0.5 - factor));
            factor = (1 - Math.abs(2 * factor - 1));
            context.font = `${(0.5 + factor) * 23}px serif`;
            context.fillStyle = `rgba(255, 255, 255, ${factor})`;
            if(mod(Math.round(i), this.items.length) === this.getCurrentSelection()){
                context.fillStyle = `rgba(192, 137, 35, ${factor})`;
            }
            context.textBaseline = 'middle';
            context.fillText(this.items[mod(Math.round(i), this.items.length)].title, x, y);
        }

        let selection = this.getCurrentSelection();
        if(this.#prevSelection !== selection){
            this.#prevSelection = selection;
            this.onNewSelection(selection);
        }
        window.requestAnimationFrame(() => this.updateAndDraw.call(this, timer, context));
    }
}