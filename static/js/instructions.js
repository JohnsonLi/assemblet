//Instruction Name: num params
const INSTRUCTIONS = {
    'move': [0,1], 
    'add': [0,1]
};

var move = function(div, x, y) {
    div.style.left = x + "px";
    div.style.top = y + "px";
}

window.addEventListener("mousemove", function(event) {
    if (window.moving) {
        let newX = event.clientX - window.movingDiv.clickX;
        let newY = event.clientY - window.movingDiv.clickY;
        move(window.movingDiv, newX, newY);
    }
});

window.addEventListener("mouseup", function(event) {
    if (window.moving) {
        window.movingDiv.moving = false;
        window.moving = false;
        move(window.movingDiv, 0, 0);
        window.movingDiv.classList.remove("instruction-moving");
        delete window.movingDiv;
    }
});

var setupInstruction = function(instructionName) {
    let instruction = document.createElement("div");
    instruction.classList.add("instruction", "unselectable");
    instruction.name = instructionName;
    instruction.isInstruction = true;
    instruction.baseInstruction = true;
    instruction.canDelete = false;
    instruction.home = INSTRUCTION_LIST;

    let name = document.createElement("span");
    name.classList.add("unselectable");
    name.innerHTML = instructionName;
    instruction.appendChild(name);

    makeParameters(instruction, instructionName);

    

    instruction.addEventListener("mousedown",function(event) {
        event.currentTarget.moving = true;
        event.currentTarget.classList.add("instruction-moving");
        event.currentTarget.clickX = event.clientX;
        event.currentTarget.clickY = event.clientY;
        window.moving = true;
        window.movingDiv = event.currentTarget;
    });

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
        input.addEventListener("mouseup", function(event) {
            if (window.moving && (window.movingDiv.isRegister)) {
                let newRegister = window.movingDiv;
                if (event.currentTarget.children.length != 0) {
                    let old = event.currentTarget.childNodes[0];
                    deleteDiv(old);
                }
                if (window.movingDiv.baseRegister) {
                    newRegister = setupRegister(window.movingDiv.value);
                    newRegister.baseRegister = false;
                    newRegister.canDelete = true;
                }
                event.currentTarget.appendChild(newRegister);

            } else if (window.moving && (window.movingDiv.isValue && !event.currentTarget.registerOnly)) {
                if (event.currentTarget.children.length != 0) {
                    let old = event.currentTarget.childNodes[0];
                    deleteDiv(old);
                }
                event.currentTarget.appendChild(window.movingDiv);
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
    valueDiv.home = GAME_VALUES;
    valueDiv.canDelete = false;

    valueDiv.addEventListener("mousedown", function(event) {
        event.currentTarget.moving = true;
        event.currentTarget.classList.add("instruction-moving");
        event.currentTarget.clickX = event.clientX;
        event.currentTarget.clickY = event.clientY;
        window.moving = true;
        window.movingDiv = event.currentTarget;

        event.stopPropagation();
    });

    return valueDiv;
}

var setupRegister = function(register) {
    let registerDiv = document.createElement("div");
    registerDiv.classList.add("game-register", "unselectable");
    registerDiv.innerHTML = register;
    registerDiv.baseRegister = true;
    registerDiv.canDelete = false;
    registerDiv.isRegister = true;
    registerDiv.value = register;
    registerDiv.home = GAME_REGISTERS;

    registerDiv.addEventListener("mousedown", function(event) {
        event.currentTarget.moving = true;
        event.currentTarget.classList.add("instruction-moving");
        event.currentTarget.clickX = event.clientX;
        event.currentTarget.clickY = event.clientY;
        window.moving = true;
        window.movingDiv = event.currentTarget;

        event.stopPropagation();
    });

    return registerDiv;
}