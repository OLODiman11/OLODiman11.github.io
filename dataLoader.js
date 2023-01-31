async function loadJson(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Network response was not ok. Status code: ' + response.status);
    }

    return await response.json();
}

function jsonToData(json){
    let data = [];

    for (let i = 0; i < json.length; i++) {
        const quantity = json[i].quantity || 1;
        for (let j = 0; j < quantity; j++) {
            data.push(json[i])
        }
    }

    return data
}