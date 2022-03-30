//TODO: get question from backend
var question = "Get 3 into register 4.";
var instructions_allowed = ["move", "add"];
var values_allowed = [3,4];
var registers_allowed = ["a", "b", "c", "d"];
var NUM_INSTRUCTIONS = 10;
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
                let nextStep = response.shift();
                REGISTER_VALUES.innerHTML = nextStep.join(" || ");
            }
        );
    });

    STEP.addEventListener("click", () => {
        let nextStep = response.shift();
        let pc = nextStep.shift();
        REGISTER_VALUES.innerHTML = nextStep.join(" || ");
        highlightInstruction(pc);
        if (response.length == 0) {
            STEP.classList.add("hidden");
        }
    });
}


initGame();
