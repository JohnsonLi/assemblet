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
const STEP = document.getElementById("step");
const SUBMIT = document.getElementById("submit");

const REGISTER_VALUES = document.getElementById("register-values");

var parseResponse = function(s) {
    console.log(s);
    ans = [];
    s.trim().split("\n").forEach((stage) => {
        let b = [];
        let n = stage.split(",");
        for (let i = 0; i < 11; i++) {
            b.push(parseInt(n[i]));
        }
        b.push(n.slice(11));
        ans.push(b);
    });

    return ans;
}

var win = function () {
    DISPLAY_WINNING.click();
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
                response = parseResponse(data);
                $.post("/checksolution", 
                {
                    solution: response[response.length-1][11].join(","),
                    id: game_id
                },
                function(data,status) {
                    if (data == "good") {
                        win();
                    } else {

                    }
                }),
                DEBUG.classList.remove("collapsible-body")
                STEP.click();
            }
        );
    });

    registers_allowed.forEach((name) => {
        let registerDiv = document.createElement("div");
        registerDiv.classList.add("register-value");
        registerDiv.innerHTML = "0";
        registerDiv.registerName = name;
        REGISTER_VALUES.appendChild(registerDiv);
    });

    STEP.addEventListener("click", () => {
        let nextStep = response.shift();
        let pc = nextStep.shift();

        values = {};
        s = ['a','b','c','d','e','f','x','y','z'];
        s.forEach((registerName, i) => {
            values[registerName] = nextStep[i];
        });
        REGISTER_VALUES.childNodes.forEach((register) => {
            register.innerHTML = values[register.registerName];
        });


        if (response.length == 0) {
            highlightInstruction(-1);
        } else {
            highlightInstruction(pc);
        }
    });

    // setTimeout(()=>{DISPLAY_TUTORIAL.click();}, 500);
}

class Box {
    constructor(context, x, y, width, height) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    highlight() {
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#F00";
        this.context.strokeRect(this.x, this.y, this.width, this.height);
    }

    unhighlight() {
        this.context.strokeStyle = "#000";
        this.context.strokeRect(this.x, this.y, this.width, this.height);
    }

    draw() {
        console.log("drawing box");
        this.context.lineWidth = 2;
        this.context.strokeStyle = "#000";
        this.context.strokeRect(this.x, this.y, this.width, this.height);
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

    draw() {
        context.fillStyle = "#7df196";
        context.fillRect(this.x, this.y, this.width, this.height);
        context.font = "20px Nunito";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#000";
        context.fillText(this.value, this.x + (this.width / 2), this.y + (this.height / 2));
    }

}

var bw = 270;
var bh = 180;
var b2w = bw;
var b2h = bh + 90 + 30;
var size = 90

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
function drawGrid(){
    for (var x = 0; x < bw; x += size) {
        for (var y = 0; y < bh; y += size) {
            var box = new Box(context, x + 1, y + 10, size, size);
            boxes.push(box);
            box.draw();
        }
    }

    for (var x = 0; x < b2w; x += size) {
        for (var y = bh + 30; y < b2h; y += size) {
            var box = new Box(context, x + 1, y + 10, size, size);
            boxes.push(box);
            box.draw();
        }
    }
}

// draw letter in top left of each box
var count = 0;
function drawLetters(){
    context.font = "16px Nunito";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#000";
    for (var y = 0; y < bh; y += size) {
        for (var x = 0; x < bw; x += size) {
            context.fillText(registers_letters[count], x + 10, y + 20);
            count++;
        }
    }
    
    for(var y = bh + 30; y < b2h; y += size) {
        for(var x = 0; x < b2w; x += size) {
            context.fillText(registers_letters[count], x + 10, y + 20);
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
    for (var y = bh + 30; y < b2h; y += size) {
        midpts.push([x + (size / 2) + 1, y + (size / 2) + 10]);
    }
}

// make sqaure with value in center in canvas
var blockSize = size - 20;
function createBlock(register, value){
    var blockIndex = registers_letters.indexOf(register);
    var mid = midpts[blockIndex];
    var block = new Block(context, mid[0] - blockSize / 2, mid[1] - blockSize / 2, blockSize, blockSize, value);
    if(blocks[blockIndex] != null){
        blocks[blockIndex].erase();
    }
    blocks[blockIndex] = block;
    block.draw();
}

createBlock("Y", 1);

drawGrid();
drawLetters();
initGame();