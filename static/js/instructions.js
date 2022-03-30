//Instruction Name: num params
const INSTRUCTIONS = {
    'move': [0,1], 
    'add': [0,1]
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
                    return (to.el.parentNode.parentNode != INSTRUCTION_LIST) && (el.isRegister || (!input.registerOnly && el.isValue)) && to.el.children.length == 0;
                },
                pull: ["values", "input", "trash"],
            },
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

    return registerDiv;
}