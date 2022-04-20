//Instruction Name: num params
const INSTRUCTIONS = {
    'move': [0,1], 
    'add': [0,1],
    'sub': [0,1],
    'out': [1],
    'jne': [2,0,1],
    'ge': [1],
    'gt': [1],
    'le': [1],
    'lt': [1]
};



var setupInstruction = function(instructionName) {
    let instruction = document.createElement("div");
    instruction.classList.add("instruction", "unselectable", "card-panel", "valign-wrapper", "center-align", "z-depth-0");
    instruction.name = instructionName;
    instruction.isInstruction = true;

    let name = document.createElement("span");
    name.classList.add("unselectable");
    name.innerHTML = instructionName;
    instruction.appendChild(name);

    

    //makeParameters(instruction, instructionName);

    return instruction;
}

var makeParameters = function(div, name, base) {
    div.parameters = [];
    for (let i = 0; i < INSTRUCTIONS[name].length; i++) {
        let input = document.createElement("input");
        input.classList.add("instruction-parameter");
        input.type = "text";
        div.appendChild(input);
        div.parameters.push(input);
        let k;
        input.maxLength = 1;
        if (INSTRUCTIONS[name][i] == 0) {
            k = registers_allowed;
            k = k.concat(values_allowed);
        }
        if (INSTRUCTIONS[name][i] == 1) {
            k = registers_allowed;
        }
        if (INSTRUCTIONS[name][i] == 2) {
            input.maxLength = 2;
            k = ["0","1","2","3","4","5","6","7","8","9"];
        }
        input.a = k.map(x => x.charCodeAt(0));
        
        input.addEventListener('keypress', function (e) {
            let key = e.which || e.keyCode;
            if (!(e.target.a.includes(key))) {
                e.preventDefault();
            }
        });
    }
}