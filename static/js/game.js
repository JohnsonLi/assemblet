var question = document.getElementById("question").innerHTML;
var values_allowed = GAME_VALUES.innerHTML.split(", ");
var instructions_allowed = INSTRUCTION_LIST.innerHTML.split(",");
var registers_allowed = GAME_REGISTERS.innerHTML.split(", ");
var game_id = document.getElementById("game-id").innerHTML;
var attempts = parseInt(ATTEMPTS_SPAN.innerHTML);
var time_taken = parseInt(TIME_TAKEN_SPAN.innerHTML);
var registers_letters = ['A','B','C','D','E','F','X','Y','Z'];
var boxes = [];
var blocks = [null, null, null, null, null, null, null, null, null];
var midpts = [];
//=============================

var response;
var totalLength; var current;
const STEP = document.getElementById("step");
const AUTOPLAY = document.getElementById("autoplay");
const SUBMIT = document.getElementById("submit");

const REGISTER_VALUES = document.getElementById("register-values");

var parseResponse = function(s) {
    console.log(s);
    ans = [];
    s.trim().split("\n").forEach((stage) => {
        let b = [];
        let n = stage.split(",");
        for (let i = 0; i < registers_letters.length + 1; i++) {
            b.push(parseInt(n[i]));
        }
        b.push(n.slice(registers_letters.length + 1));
        ans.push(b);
    });

    return ans;
}

var win = function () {
    DISPLAY_WINNING.click();
    DEBUG_MSG.innerHTML = "Congratulations! You solved the puzzle."
    SOLVED_SPAN.classList.remove("hidden");
    $.post('/succeedattempt', {
        user: USER.innerHTML,
        id: game_id,
    })
}


var initGame = function() {
    let questionDiv = document.getElementById("question");
    questionDiv.innerHTML = question;

    setInterval(() => {
        time_taken++;
    }, 1000);

    AUTOPLAY.addEventListener("click", () => {
        STEP.classList.add("disabled");
        clearInterval(AUTOPLAY.interval);
        AUTOPLAY.interval = setInterval(() => {
            STEP.click();
            if (response.length == 0) {
                clearInterval(AUTOPLAY.interval);
                AUTOPLAY.classList.add("disabled");
            }

        }, 1000);
    });

    SUBMIT.addEventListener("click", () => {

        //TODO: post to backend
        let s = compile();
        attempts++;
        ATTEMPTS_SPAN.innerHTML = attempts;
        TIME_TAKEN_SPAN.innerHTML = time_taken;
    
        if (s==null) return;
        $.post("/updateattempt", {
            user: USER.innerHTML,
            id: game_id,
            timeTaken: time_taken,
            attempts: attempts
        })
        $.post("/interpret",
            {
                code: s
            },
            function(data, status) {
                if (status != "success") {
                    console.log("bad api call");
                    return;
                }
                if(data["error"] != null) {
                    DEBUG_MSG.innerHTML = data["error"];
                    return;
                }
                response = parseResponse(data);
                console.log(response[response.length-1][registers_letters.length + 1].join(","));
                $.post("/checksolution", 
                {
                    solution: response[response.length-1][registers_letters.length + 1].join(","),
                    id: game_id
                },
                function(data,status) {
                    if (data == "good") {
                        win();
                    } else {
                        DEBUG_MSG.innerHTML = "The answer you submitted was incorrect. Step through to review your solution."
                    }
                }),
                DEBUG.classList.remove("collapsible-body");
                totalLength = response.length - 1;
                current = -1;
                STEP.classList.remove("disabled");
                AUTOPLAY.classList.remove("disabled");
                STEP.click();
            }
        );
    });


    var old = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'X': 0, 'Y': 0, 'Z': 0};
    STEP.addEventListener("click", () => {
        let nextStep = response.shift();
        let pc = nextStep.shift();

        values = {};

        registers_letters.forEach((registerName, i) => {
            values[registerName] = nextStep[i];
            if(old[registerName] != nextStep[i]){
                createBlock(registerName.toUpperCase(), nextStep[i], true);
            } else {
                createBlock(registerName.toUpperCase(), nextStep[i], false);
            }
        });


        drawLetters();

        old = values;

        if (response.length == 0) {
            highlightInstruction(-1);
            STEP.classList.add("disabled");
        } else {
            highlightInstruction(pc);
        }

        current++;
        PROGRESS_BAR.style.width = current / totalLength * 100 + "%";
    });

    setTimeout(()=>{DISPLAY_TUTORIAL.click();}, 100);
    STUCK.addEventListener("click", () => {
        DISPLAY_TUTORIAL.click();
    });

    

}

class Box {
    constructor(context, x, y, width, height) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.highlighted = false;
    }

    highlight() {

        this.highlighted = true;
    }

    unhighlight() {

        this.highlighted = false;
    }

    isHighlighted() {
        return this.highlighted;
    }

    draw() {
    }
}

class Block {
    constructor(context, x, y, width, height, value) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = value;
    }
    
    erase() {
        this.context.clearRect(this.x, this.y, this.width, this.height);
        blocks[blocks.indexOf(this)] = null;
    }

    draw(changed = false) {
        if (changed) {
            context.fillStyle = "#7eaaaa";
        } else {
            context.fillStyle = "#c7f9cc";
        }
        context.fillRect(this.x, this.y, this.width, this.height);
        context.font = "20px Nunito";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#000";
        context.fillText(this.value, this.x + (this.width / 2), this.y + (this.height / 2));
    }

}

var bw = 300;
var bh = 180;
var b2w = bw;
var b2h = bh + 90 + 60;
var size = 100

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
function drawGrid(){
    for (var y = 0; y < bh; y += size) {
        for (var x = 0; x < bw; x += size) {
            var box = new Box(context, x + 1, y + 10, size, size);
            boxes.push(box);
            box.draw();
        }
    }

    for (var x = 0; x < b2w; x += size) {
        for (var y = bh + 60; y < b2h; y += size) {
            var box = new Box(context, x + 1, y + 10, size, size);
            boxes.push(box);
            box.draw();
        }
    }

    registers_letters.forEach((registerName, i) => {
        createBlock(registerName.toUpperCase(), 0);
    });


}

// draw letter in top left of each box

function drawLetters(){
    var count = 0;
    context.font = "16px Nunito";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#000";
    for (var y = 0; y < bh; y += size) {
        for (var x = 0; x < bw; x += size) {
            context.fillText(registers_letters[count], x + 15, y + 25);
            count++;
        }
    }
    
    for(var y = bh + 60; y < b2h; y += size) {
        for(var x = 0; x < b2w; x += size) {
            context.fillText(registers_letters[count], x + 15, y + 25);
            count++;
        }
    }
}

// middle of each box
for (var y = 0; y < bh; y += size) {
    for (var x = 0; x < bw; x += size) {
        midpts.push([x + (size / 2) + 1, y + (size / 2) + 10]);
    }
}

for (var x = 0; x < b2w; x += size) {
    for (var y = bh + 60; y < b2h; y += size) {
        midpts.push([x + (size / 2) + 1, y + (size / 2) + 10]);
    }
}

// make sqaure with value in center in canvas
var blockSize = size-5;
function createBlock(register, value, changed = false){
    var blockIndex = registers_letters.indexOf(register);
    var mid = midpts[blockIndex];
    var block = new Block(context, mid[0] - blockSize / 2, mid[1] - blockSize / 2, blockSize, blockSize, value);
    if(blocks[blockIndex] != null){
        blocks[blockIndex].erase();
    }
    blocks[blockIndex] = block;
    block.draw(changed);
}


function deleteBlock(register){
    var blockIndex = registers_letters.indexOf(register);
    if(blocks[blockIndex] != null){
        blocks[blockIndex].erase();
        blocks[blockIndex] = null;
    }
}

// createBlock("Y", 1);
$(document).ready(function() {
    drawGrid();
    drawLetters();
    initGame();
});

