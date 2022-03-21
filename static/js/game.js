//TODO: get question from backend
var question = "Get 3 into register 4.";
var instructions_allowed = ["move", "add"];
var values_allowed = [3,4];
var registers_allowed = ["a", "b", "c", "d"];
var NUM_INSTRUCTIONS = 10;

var initGame = function() {
    let questionDiv = document.getElementById("question");
    questionDiv.innerHTML = question;

    let submit = document.getElementById("submit");
    submit.innerHTML = "Submit";
    submit.addEventListener("click", () => {
        let s = compile();

        //TODO: post to backend
        var response = "";
    });

    
}

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

initGame();
let ticks = 0;
const ctx = animateSetup();
const chef = chefSetup();
requestAnimationFrame(animate);