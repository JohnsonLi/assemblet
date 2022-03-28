//Instruction Name: num params
const INSTRUCTIONS = {
    'move': 2, 
    'add': 2
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

var makeParameters = function(div, name) {
    div.parameters = [];
    for (let i = 0; i < INSTRUCTIONS[name]; i++) {
        let input = document.createElement("div");
        input.classList.add("instruction-parameter");
        div.appendChild(input);
        div.parameters.push(input);

        input.addEventListener("mouseup", function(event) {
            if (window.moving && event.currentTarget.children.length == 0 && window.movingDiv.isValue) {
                window.movingDiv.parentElement.removeChild(window.movingDiv);
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