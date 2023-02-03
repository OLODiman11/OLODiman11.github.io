var amountOfItemsDisplayed = MAX_AMOUNT_OF_ITEMS_DISPLAYED;
let maxWidth = getMaxItemWidth();

function calculateMaxItemWidthAndAdjustAmountOfItemsDispleyed(){
    adjustCanvas();
    amountOfItemsDisplayed = MAX_AMOUNT_OF_ITEMS_DISPLAYED;
    maxWidth = getMaxItemWidth();
    while(maxWidth < MIN_ITEM_WIDTH && amountOfItemsDisplayed > 1){
        amountOfItemsDisplayed--;
        maxWidth = getMaxItemWidth();
    }
}

function getMaxItemWidth(){
    if(amountOfItemsDisplayed === 1) return canvas.offsetWidth;
    let rad = Math.PI / (amountOfItemsDisplayed - 1);
    return canvas.width / ((1 + MIN_ITEM_SCALE) / Math.sin(rad) + 1);
}

function wrapTitleAndAdjustFontSize(dataset){
    for (let i = 0; i < dataset.length; i++) {
        let item = dataset[i];
        let fontSize = MAX_TITLE_FONT_SIZE;
        setContextFontSize(context, fontSize);
        if(Array.isArray(item.title)){
            item.title = item.title.join(' ');
        }
        let lines = wrapText(item.title, maxWidth);
        while(lines.length > MAX_TITLE_LINES && fontSize > MIN_TITLE_FONT_SIZE){
            fontSize--;
            setContextFontSize(context, fontSize);
            lines = wrapText(item.title, maxWidth);
        }
        item.fontSize = fontSize;
        item.title = lines.slice(0, MAX_TITLE_LINES);
    }
}

function wrapText(text, maxWidth){
    let words = text.split(' ');
    let lines = [];
    let currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        let word = words[i];
        if(context.measureText(word).width > maxWidth) {
               return Array.apply(null, Array(MAX_TITLE_LINES + 1)).map(function () {});
        }
        let width = context.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function setContextFontSize(context, size){
    context.font = `${size}px ${ITEMS_FONT_FAMILY}`;
}
function setContextFillStyle(context, color, alpha){
    context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}