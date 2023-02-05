let videoLoaded = false;
let rawDataset = [];
let preparedDataset = []; 
const wheel = getWheel();
const timer = new Timer();
onresize = onResize;

loadVideo();
calculateMaxItemWidthAndAdjustAmountOfItemsDispleyed();
selectDataset.call(datasetsList.childNodes[1].firstChild).then(() => wheel.updateAndDraw(timer, context));

function onResize(){
    calculateMaxItemWidthAndAdjustAmountOfItemsDispleyed();
    wrapTitleAndAdjustFontSize(preparedDataset);
}

function spin(){
    this.className = 'absolute centered-self no-display';
    playVideo();
    let duration = 22;
    if(videoLoaded) duration = video.duration;
    wheel.startTheSpin(5, 3, duration, easeInOutSine, timer);
}

function getWheel(){
    let wheel = new Wheel2(0, 300, 203);
    wheel.onNewSelection = setDiscription;
    return wheel;
}

async function selectDataset(){
    return await loadDataset(`data/${this.value}.json`)
    .then(dataset => {
        rawDataset = dataset;
        preparedDataset = JSON.parse(JSON.stringify(rawDataset));
        setEdit();
        
        wrapTitleAndAdjustFontSize(preparedDataset);
        setItemsOnTheWheel();
    })
    .catch(e => console.error(e));
}

function setItemsOnTheWheel(){
    wheel.setItems(shuffle(quantifyDataset(preparedDataset)));
}

function playVideo(){
    video.className = 'fadein';
    setVolume.call(volume);
    video.play();
    fadeInAudio(0, 2);
    setTimeout(() => {video.className = 'fadeout'; fadeOutAudio(0, 2);}, 1000 * (video.duration - 2));
}

function loadVideo(){
    videoLoaded = false;
    video.src = `videos/vid_${randomInt(1, 84)}.mp4`;
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

function setEdit(){
    let editList = document.querySelector('.scrollview ul');
    editList.innerHTML = "";
    for (let i = 0; i < rawDataset.length; i++) {
        const element = rawDataset[i];
        let li = document.createElement('li');
        li.innerHTML = `<input id="${i}" type="checkbox" value="${element.title}" onclick="checkItem.call(this)" checked>
        <label for="${i}">${element.title}</label>`
        editList.appendChild(li);
    }
}

function checkItem(){
    for (let i = 0; i < rawDataset.length; i++) {
        const rawItem = rawDataset[i];
        const preperedItem = preparedDataset[i];
        if(rawItem.title === this.value){
            rawItem.excluded = !this.checked;
            preperedItem.excluded = !this.checked;
        }
    }
    rawDataset.forEach(element => {
        if(element.title === this.value){
            element.excluded = !this.checked;
        }
    });
}

function applyConfiguration(){
    editShield.className = 'edit-shield absolute centered-self no-display';
    setItemsOnTheWheel();
}

function openEdit(){
    editShield.className = 'edit-shield absolute centered-self';
}
