function loadData(path) {
    loadJson(path)
    .then(json => {return jsonToData(json)})
    .catch(e => console.error(e));
}

async function loadJson(path){
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error('Network response was not ok. Status code: ' + response.status);
    }

    return await response.json();
}

function jsonToData(json){
    let data = [];

    for (let i = 0; i < json.length; i++) {
        if(json[i].excluded){
            continue;
        }
        const quantity = json[i].quantity || 1;
        for (let j = 0; j < quantity; j++) {
            data.push(json[i])
        }
    }

    return data
}