function map(value, old1, old2, new1, new2){
    return new1 + (value - old1) / (old2 - old1) * (new2 - new1);
}

function radians(degrees){
    return degrees * (Math.PI/180);
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

function clamp(value, min, max){
    return Math.max(Math.min(value, max), min);
}

function clamp01(value){
    return clamp(value, 0, 1);
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

function randomInt(start, end){
    return Math.round(start + Math.random() * (end - start));
}