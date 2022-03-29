//Instruction Name: num params
const INSTRUCTIONS = {
    'move': [0,1], 
    'add': [0,1]
};



var setupInstruction = function(instructionName) {
    let instruction = document.createElement("li");
    instruction.classList.add("instruction", "unselectable");
    instruction.name = instructionName;


    let name = document.createElement("span");
    name.classList.add("unselectable");
    name.innerHTML = instructionName;
    instruction.appendChild(name);

    makeParameters(instruction, instructionName);

    return instruction;
}

var deleteDiv = function(div) {
    if (div.canDelete) {
        if (div.isInstruction) {
            div.parameters.forEach((input) => {
                if (input.children.length == 1) {
                    deleteDiv(input.childNodes[0]);
                }
            });
        }
        div.remove();
    } else {
        if (div.home != div.parentNode) {
            div.home.appendChild(div);
        }
    }
}

var makeParameters = function(div, name) {
    div.parameters = [];
    for (let i = 0; i < INSTRUCTIONS[name].length; i++) {
        let input = document.createElement("div");
        input.classList.add("instruction-parameter");
        div.appendChild(input);
        div.parameters.push(input);
        input.registerOnly = INSTRUCTIONS[name][i] == 1 ? true : false;

        
    }
}

var setupValue = function(value) {
    let valueDiv = document.createElement("div");
    valueDiv.classList.add("game-value", "unselectable");
    valueDiv.innerHTML = value;
    valueDiv.value = value;
    valueDiv.isValue = true;


    return valueDiv;
}

var setupRegister = function(register) {
    let registerDiv = document.createElement("div");
    registerDiv.classList.add("game-register", "unselectable");
    registerDiv.innerHTML = register;
    registerDiv.isRegister = true;

    return registerDiv;
}