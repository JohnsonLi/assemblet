var question = document.getElementById("question").innerHTML;
var values_allowed = GAME_VALUES.innerHTML.split(",");
var instructions_allowed = INSTRUCTION_LIST.innerHTML.split(",");
var registers_allowed = GAME_REGISTERS.innerHTML.split(",");
//=============================


var response;
const STEP = document.getElementById("step");
const SUBMIT = document.getElementById("submit");

//TEMPORARY
const REGISTER_VALUES = document.getElementById("register-values");

var parseResponse = function(s) {
    ans = [];
    s.trim().split("\n").forEach((stage) => {
        ans.push(stage.split(",").map(x => parseInt(x)));
    });

    return ans;
}

var initGame = function() {
    let questionDiv = document.getElementById("question");
    questionDiv.innerHTML = question;

    SUBMIT.addEventListener("click", () => {

        //TODO: post to backend
        let s = compile();
        if (s==null) return;

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
                STEP.classList.remove("hidden");
                STEP.click();
            }
        );
    });

    STEP.addEventListener("click", () => {
        let nextStep = response.shift();
        let pc = nextStep.shift();
        REGISTER_VALUES.innerHTML = nextStep.join(" || ");
        if (response.length == 0) {
            STEP.classList.add("hidden");
            highlightInstruction(-1);
        } else {
            highlightInstruction(pc);
        }
    });
}


initGame();
