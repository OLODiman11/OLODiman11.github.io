
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

    get offset(){
        return Math.floor(amountOfItemsDisplayed / 2);
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
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        this.#currentValue += this.#scrollingSpeed * timer.deltaTime;
        this.#currentValue = mod(this.#currentValue, this.items.length);
        
        let lowerBound = this.#currentValue - this.offset;
        let upperBound = this.#currentValue + this.offset;
        let currentItemIndex = Math.round(this.#currentValue);
        let y = canvas.height / 2;
        for (let i = currentItemIndex - this.offset; i <= currentItemIndex +  this.offset; i++) {
            let wrappedIndex = mod(Math.round(i), this.items.length);
            let item = this.items[wrappedIndex];
            let factor = Math.sin(map(i, lowerBound, upperBound, -Math.PI / 2, Math.PI / 2));
            let x = canvas.width / 2 + 0.5 * (canvas.width - maxWidth * MIN_ITEM_SCALE) * factor;  //0.5 * canvas.width * (1 + factor * (1 - MIN_ITEM_SCALE));
            let scaleFactor = 1 - Math.abs(factor);
            setContextFontSize(context, (MIN_ITEM_SCALE + (1 - MIN_ITEM_SCALE) * scaleFactor) * item.fontSize);
            setContextFillStyle(context, ITEMS_COLOR, scaleFactor);
            if(wrappedIndex === this.getCurrentSelection()){
                setContextFillStyle(context, SELECTED_ITEM_COLOR, scaleFactor);
            };
            let measures = context.measureText(item.title[0]);
            let lineHeight = measures.actualBoundingBoxAscent + measures.actualBoundingBoxDescent;
            for (let j = 0; j < item.title.length; j++) {
                let line = item.title[j];
                let offset = j - Math.floor(item.title.length / 2) + (1 - item.title.length % 2) / 2;
                context.fillText(line, x, y + offset * lineHeight);
            }
        }

        let selection = this.getCurrentSelection();
        if(this.#prevSelection !== selection){
            this.#prevSelection = selection;
            this.onNewSelection(selection);
        }
        window.requestAnimationFrame(() => this.updateAndDraw.call(this, timer, context));
    }
}