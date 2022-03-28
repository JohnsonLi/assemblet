var drawSprite = function(image, index, tileWidth, tileHeight, destX, destY, scale) {
    let imageWidth = image.width;
    let tilesPerRow = imageWidth / tileWidth;
    
    let left = tileWidth * (index % tilesPerRow);
    let top = tileHeight * Math.floor(index / tilesPerRow);
    
    ctx.drawImage(image, left, top, tileWidth, tileHeight, destX, destY, tileWidth * scale, tileHeight * scale);
}

var drawChef = function(ticks) {
    let animIndexes = [14,15,16,17];
    let frame = animIndexes[Math.floor((ticks % 40) / 10)];
    drawSprite(chef, frame, 48, 56, chef.X, chef.Y, 1)
}

var animateSetup = function() {
    let canvas = document.getElementById("game");
    let ctx = canvas.getContext('2d');
    ticks = 0;
    return ctx;
}

var chefSetup = function() {
    let chef = new Image();
    chef.src = "assets/ChefSheet.png";
    chef.X = 50;
    chef.Y = 50;
    return chef;
}

var drawScene = function(ticks) {
    drawChef(ticks);
}

var update = function() {
    chef.X++;
}

var animate = function() {
    ticks++;
    ctx.clearRect(0, 0, 300, 300);
    update();
    drawScene(ticks);
    requestAnimationFrame(animate);
}

let ticks = 0;
const ctx = animateSetup();
const chef = chefSetup();
//requestAnimationFrame(animate);