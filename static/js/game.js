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
                STEP.classList.remove("hidden");
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
        s = ['a','b','c','d','e','f','g','x','y','z'];
        s.forEach((registerName, i) => {
            values[registerName] = nextStep[i];
        });
        REGISTER_VALUES.childNodes.forEach((register) => {
            register.innerHTML = values[register.registerName];
        });


        if (response.length == 0) {
            STEP.classList.add("hidden");
            highlightInstruction(-1);
        } else {
            highlightInstruction(pc);
        }
    });
}


initGame();
