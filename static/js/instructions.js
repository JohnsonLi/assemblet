//Instruction Name: num params
const INSTRUCTIONS = {
    'move': [0,1], 
    'add': [0,1],
    'sub': [0,1]
};



var setupInstruction = function(instructionName) {
    let instruction = document.createElement("div");
    instruction.classList.add("instruction", "unselectable", "card-panel");
    instruction.name = instructionName;
    instruction.isInstruction = true;

    let name = document.createElement("span");
    name.classList.add("unselectable");
    name.innerHTML = instructionName;
    instruction.appendChild(name);

    

    makeParameters(instruction, instructionName);

    return instruction;
}

var makeParameters = function(div, name, base) {
    div.parameters = [];
    for (let i = 0; i < INSTRUCTIONS[name].length; i++) {
        let inputDiv = document.createElement("div");
        let input = document.createElement("input");
        inputDiv.appendChild(input);
        inputDiv.classList.add("instruction-parameter");
        input.type = "text";
        div.appendChild(inputDiv);
        div.parameters.push(input);
        let k = registers_allowed;
        if (INSTRUCTIONS[name][i] != 1) {
            k = k.concat(values_allowed);
        }

        input.a = k.map(x => x.charCodeAt(0));

        input.maxLength = 1;
        input.addEventListener('keypress', function (e) {
            let key = e.which || e.keyCode;
            if (!(e.target.a.includes(key))) {
                e.preventDefault();
            }
        });
    }
}