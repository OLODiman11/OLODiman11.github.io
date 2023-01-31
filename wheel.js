class Wheel{
    #canvas; #ctx; #radius;

    #displayedCount = 7;
    #firstDisplayedElement = 0;
    #offset = 0.5;
    #maxSpeed = 7;
    #speed = 0;
    #fontSize = 23;
    #isMouseDown = false;
    #mousePrevY = 0;
    #mouseDeltaY = 0;
    #mouseOriginY = 0;
    #spinning = false;

    #lastTime = Date.now();
    #deltaTime = 0;

    data = [];

    constructor(width, height, radius, data){
        this.data = data;
        this.#radius = radius;
        this.#canvas = document.querySelector('#wheel');
        this.#canvas.width = width;
        this.#canvas.height = height;
        this.#ctx = this.#canvas.getContext('2d');

        document.onmousedown = (e) => this.#onMouseDown(this, e);
        document.onmouseup   = (e) => this.#onMouseUp(this, e);
        document.onmousemove = (e) => this.#onMouseMove(this, e);
    }

    /**
     * @param {any[]} data
     */
    set data(newData){
        this.data = newData;
    }

    update(wheel){
        wheel.#updateTime(wheel);
        wheel.#ctx.clearRect(0, 0, wheel.#canvas.width, wheel.#canvas.height);

        for (let i = 0; i < wheel.#displayedCount; i++) {
            let rad = radians(map(i + wheel.#offset, 0, wheel.#displayedCount - 1, 90, -90));
            let x = wheel.#radius * Math.cos(rad);
            let y = wheel.#canvas.height / 2 + wheel.#radius * Math.sin(rad);
            let index = (i + wheel.#firstDisplayedElement) % wheel.data.length;
            let factor = map(x, 0, wheel.#radius, 0, 1);
            wheel.#ctx.fillStyle = `rgba(255, 255, 255, ${factor})`;
            wheel.#ctx.font = (0.7 * factor + 1) * wheel.#fontSize + "px serif";
            wheel.#ctx.fillText(wheel.data[index].title, x,  y);
        }
        if(wheel.#isMouseDown){
            wheel.#offset = wheel.#mouseDeltaY;
            wheel.#offset = clamp(wheel.#offset, -0.5, 0.5);
        }
        else {
            wheel.#offset += wheel.#speed * wheel.#deltaTime;
        }

        if(wheel.#offset < -0.5){
            wheel.#offset = 0.5;
            wheel.#firstDisplayedElement += 1;
            document.querySelector('#description').innerHTML = wheel.data[wheel.#getCurrentSelection(wheel)].description;
        }
        else if(wheel.#offset > 0.5){
            wheel.#offset = -0.5;
            wheel.#firstDisplayedElement -= 1;
            document.querySelector('#description').innerHTML = wheel.data[wheel.#getCurrentSelection(wheel)].description;
        }
        wheel.#firstDisplayedElement = mod(wheel.#firstDisplayedElement, wheel.data.length);

        window.requestAnimationFrame(() => wheel.update(wheel));
    }


    #getCurrentSelection(wheel) {
        return mod(wheel.#firstDisplayedElement + Math.floor(wheel.#displayedCount / 2), wheel.data.length);
    }

    #updateTime(wheel){
        let now = Date.now();
        wheel.#deltaTime = (now - wheel.#lastTime) / 1000;
        wheel.#lastTime = now;
    }

    spin(duration){
        this.data = shuffle(this.data);
        this.#isMouseDown = false;
        this.#spinning = true;
        this.#speed = -this.#maxSpeed;
        setTimeout(() => {this.#speed = 0; this.#spinning = false;}, duration * 1000)
    }

    #onMouseMove(wheel, event){
        if(wheel.#spinning){
            return;
        }
        if(!wheel.#isMouseDown){
            return;
        }
        wheel.#speed = -(event.clientY - wheel.#mousePrevY) / wheel.#deltaTime / 100;
        wheel.#mousePrevY = event.clientY;
        wheel.#mouseDeltaY = -(event.clientY - wheel.#mouseOriginY) / 100;
    }

    #onMouseDown(wheel, event){
        if(wheel.#spinning){
            return;
        }
        wheel.#isMouseDown = true;
        wheel.#mousePrevY = event.clientY;
        wheel.#mouseOriginY = event.clientY;
        wheel.#mouseDeltaY = 0;
    }

    #onMouseUp(wheel, event){
        if(wheel.#spinning){
            return;
        }
        wheel.#isMouseDown = false;
    }
}
