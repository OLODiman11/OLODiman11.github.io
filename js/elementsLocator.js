const canvas = document.querySelector('.wheel-container canvas');
const context = getCanvasContext();
const volume = document.querySelector('#volume');
const video = getVideo();
const description = document.querySelector('.description');
const datasetsList = document.querySelector('.datasets ul');
const spinBtn = document.querySelector('.video-container button');
const editShield = document.querySelector('.edit-shield');

function getCanvasContext(){
    let context = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    return context;
}

function getVideo(){
    let video = document.querySelector('.video-container video');
    video.onloadedmetadata = function(){videoLoaded = true;}
    video.onended = function(){ loadVideo(); spinBtn.className = "absolute centered-self";};
    return video;
}

function setDiscription(selection){
    description.innerHTML = wheel.items[selection].description;
}

function adjustCanvas(){
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
}