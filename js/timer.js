class Timer{
    #lastTime = Date.now();
    #deltaTime = 0;

    constructor(){
        this.#update(Date.now());
    }

    #update(now){
        this.#deltaTime = (now - this.#lastTime) / 1000;
        this.#lastTime = now;

        window.requestAnimationFrame(n => this.#update.call(this, n));
    }

    get deltaTime(){
        return this.#deltaTime;
    }
}