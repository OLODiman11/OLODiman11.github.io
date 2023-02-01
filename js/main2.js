let videoLoaded = false;

let dataset = []; 
const volume = document.querySelector('#volume');
const wheel = new Wheel2(0, 300, 203);
wheel.onNewSelection = setDiscription;
const timer = new Timer();
const video = document.querySelector('video');
video.onloadedmetadata = function(){videoLoaded = true;}
video.onended = function(){loadVideo();}

loadVideo();

const desc = document.querySelector('#description');
selectDataSet.call(document.querySelector('#events')).then(() => 
    window.requestAnimationFrame(() => wheel.updateAndDraw(timer, document.querySelector('#wheel').getContext('2d'))));

function spin(){
    playVideo();
    let duration = 22;
    if(videoLoaded) duration = video.duration;
    wheel.startTheSpin(5, 3, duration, easeInOutSine, timer);
}

async function selectDataSet(){

    return await loadJson(`data/${this.value}.json`)
    .then(json => {
        dataset = json;
        setEdit();
        setItemsOnTheWheel();
    })
    .catch(e => console.error(e));
}

function setItemsOnTheWheel(){
    wheel.setItems(shuffle(jsonToData(dataset)));
}

function playVideo(){
    video.className = 'fadein';
    setVolume.call(document.querySelector('#volume'));
    video.play();
    fadeInAudio(0, 2);
    setTimeout(() => {video.className = 'fadeout'; fadeOutAudio(0, 2);}, 1000 * (video.duration - 2));
}

function loadVideo(){
    videoLoaded = false;
    video.src = `videos/vid_${randomInt(1, 85)}.mp4`;
    video.load();
}

function fadeOutAudio(elapsed, duration){
    elapsed += timer.deltaTime;
    let factor = clamp01(elapsed / duration);
    if(factor < 1){
        window.requestAnimationFrame(() => fadeOutAudio(elapsed, duration));
    }
    video.volume = (1 - factor) * volume.value / 100;
}

function fadeInAudio(elapsed, duration){
    elapsed += timer.deltaTime;
    let factor = clamp01(elapsed / duration);
    if(factor < 1){
        window.requestAnimationFrame(() => fadeInAudio(elapsed, duration));
    }
    video.volume = factor * volume.value / 100;
}

function setVolume(){
    video.volume = this.value / 100;
}

function setDiscription(selection){
    console.log(selection);
    desc.innerHTML = wheel.items[selection].description;
}

function setEdit(){
    let editList = document.querySelector('#scrollviewUl');
    editList.innerHTML = "";
    for (let i = 0; i < dataset.length; i++) {
        const element = dataset[i];
        let li = document.createElement('li');
        li.innerHTML = `<input id="${i}" type="checkbox" value="${element.title}" onclick="checkItem.call(this)" checked>
        <label for="${i}">${element.title}</label>`
        editList.appendChild(li);
    }
}

function checkItem(){
    dataset.forEach(element => {
        if(element.title === this.value){
            element.excluded = !this.checked;
        }
    });
}

function applyConfiguration(){
    let edit = document.querySelector('#edit');
    edit.className = 'hidden';
    setItemsOnTheWheel();
}

function openEdit(){
    let edit = document.querySelector('#edit');
    edit.className = '';
}
