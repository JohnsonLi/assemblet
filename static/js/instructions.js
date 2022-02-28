//Instruction Name: num params
const INSTRUCTIONS = {
    'mov': 2, 
    'add': 2
};

var setupInstruction = function(instructionName) {
    let instruction = document.createElement("div");
    instruction.classList.add("instruction", "unselectable");
    instruction.name = instructionName;

    let name = document.createElement("span");
    name.classList.add("unselectable");
    name.innerHTML = instructionName;
    instruction.appendChild(name);

    makeParameters(instruction, instructionName);

    var move = function(div, x, y) {
        div.style.left = x + "px";
        div.style.top = y + "px";
    }

    instruction.onmousedown = function(event) {
        event.currentTarget.moving = true;
        event.currentTarget.classList.add("instruction-moving");
        event.currentTarget.clickX = event.clientX;
        event.currentTarget.clickY = event.clientY;
        window.moving = true;
        window.movingInstruction = event.currentTarget;
    };

    window.onmousemove = function(event) {
        if (window.moving) {
            let newX = event.clientX - window.movingInstruction.clickX;
            let newY = event.clientY - window.movingInstruction.clickY;
            move(window.movingInstruction, newX, newY);
        }
    }

    window.onmouseup = function(event) {
        if (window.moving) {
            window.movingInstruction.moving = false;
            window.moving = false;
            move(window.movingInstruction, 0, 0);
            window.movingInstruction.classList.remove("instruction-moving");
            delete window.movingInstruction;
        }
    }



    return instruction;
}

var makeParameters = function(div, name) {
    div.parameters = [];
    for (let i = 0; i < INSTRUCTIONS[name]; i++) {
        let input = document.createElement("input");
        input.classList.add("instruction-parameter");
        div.appendChild(input);
        div.parameters.push(input);
    }
}