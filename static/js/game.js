var question = document.getElementById("question").innerHTML;
var values_allowed = GAME_VALUES.innerHTML.split(", ");
var instructions_allowed = INSTRUCTION_LIST.innerHTML.split(",");
var registers_allowed = GAME_REGISTERS.innerHTML.split(", ");
var game_id = document.getElementById("game-id").innerHTML;
var attempts = parseInt(ATTEMPTS_SPAN.innerHTML);
var time_taken = parseInt(TIME_TAKEN_SPAN.innerHTML);
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


initGame();

var registers_letters = ['A','B','C','D','E','F','G','X','Y','Z'];
var boxes = [];

// class for outline box
class Box {
    constructor(context, x, y, width, height, color) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        console.log("drawing box");
        this.context.lineWidth = 2;
        this.context.strokeStyle = this.color;
        this.context.strokeRect(this.x, this.y, this.width, this.height);
    }
}


// Box width
var bw = 270;
// Box height
var bh = 180;
// Box size
var size = 90
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
function drawGrid(){
    for (var x = 0; x < bw; x += size) {
        for (var y = 0; y < bh; y += size) {
            var box = new Box(context, x + 1, y + 10, size, size, "#000");
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
}

// middle of each box
midpts = []
for (var x = 0; x < bw; x += size) {
    for (var y = 0; y < bh; y += size) {
        midpts.push([x + (size / 2) + 1, y + (size / 2) + 10]);
    }
}

// make sqaure with value in center in canvas
var blockSize = size - 2;
function createBlock(value, x, y){
    context.fillStyle = "#7df196";
    context.fillRect(x, y, size, size);
    context.font = "16px Nunito";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#000";
    context.fillText(value, x + (size / 2), y + (size / 2) + 10);
}

createBlock(0, 0, 0);

// // draw a circle in the middle of each box
// function drawCircles(){
//     context.lineWidth = 2;
//     context.strokeStyle = "#000";
//     for(var i = 0; i < midpts.length; i++){
//         context.beginPath();
//         context.arc(midpts[i][0], midpts[i][1], 20, 0, 2 * Math.PI);
//         context.stroke();
//     }
// }

drawGrid();
drawLetters();