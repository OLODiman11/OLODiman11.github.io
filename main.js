var wheel;

loadJson('data/events-data.json')
    .then(json => {
        wheel = new Wheel(800, 600, 203, jsonToData(json));
        document.querySelector('#spin').addEventListener('click', () => wheel.spin(10));
        wheel.update(wheel);
    })
    .catch(error => {
        console.error(error);
    });


loadDataListener('events');
loadDataListener('clennedj');
loadDataListener('points');
loadDataListener('ganres');
loadDataListener('punishments');
loadDataListener('coins');
loadDataListener('items');
loadDataListener('friends');

function loadDataListener(elementId) {
    let element = document.getElementById(elementId);
    element.addEventListener('change', function() {
        if(element.checked){
            loadJson('data/' + element.value + '.json')
            .then(json => wheel.data = jsonToData(json))
            .catch(e => console.error(e));
        }
    })
}
