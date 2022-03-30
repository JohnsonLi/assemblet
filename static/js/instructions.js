//Instruction Name: num params
const INSTRUCTIONS = {
    'move': [0,1], 
    'add': [0,1],
    'sub': [0,1]
};



var setupInstruction = function(instructionName) {
    let instruction = document.createElement("div");
    instruction.classList.add("instruction", "unselectable");
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
        let input = document.createElement("div");
        input.classList.add("instruction-parameter");
        div.appendChild(input);
        div.parameters.push(input);
        input.registerOnly = INSTRUCTIONS[name][i] == 1 ? true : false;
        Sortable.create(input, {
            group: {
                name: "input",
                put: function(to, from, el) {
                    if (to.el.children.length != 0) {
                        let current = to.el.childNodes[0];
                        current.classList.add("hidden");
                        input.hiddenElement = current;
                    }
                    return (to.el.parentNode.parentNode != INSTRUCTION_LIST) && (el.isRegister || (!input.registerOnly && el.isValue));
                },
                pull: ["values", "input", "trash"],
            },
            onAdd: function(evt) {
                if (input.hiddenElement) {
                    input.hiddenElement.classList.remove("hidden");
                    if (input.hiddenElement.isValue) {
                        GAME_VALUES.appendChild(input.hiddenElement);
                    } else {
                        input.hiddenElement.remove();
                    }
                    input.hiddenElement = undefined;
                }
            }
        });     
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
    registerDiv.value = register;

    return registerDiv;
}