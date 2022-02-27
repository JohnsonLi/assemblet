// build the assembly for the interpreter


var init = function() {
    const NUM_INSTRUCTIONS = 10;

    // Setup the assembly builder where the user will create their script
    const ASSEMBLY_BUILDER = document.getElementById("assembly-builder");
    for (let i = 0; i < NUM_INSTRUCTIONS; i++) {
        let instructionEntry = document.createElement("div");
        instructionEntry.classList.add("instruction-entry");
        ASSEMBLY_BUILDER.appendChild(instructionEntry);

        let name = document.createElement("span");
        name.classList.add("unselectable");
        instructionEntry.appendChild(name);
        instructionEntry.nameSpan = name;

        instructionEntry.onmouseup = function(event) {
            if (window.moving) {
                instructionEntry.nameSpan.innerHTML = window.movingInstruction.name;
            }
        }
    }

    var move = function(div, x, y) {
        div.x = x;
        div.y = y;
        div.style.left = div.x + "px";
        div.style.top = div.y + "px";
    }

    var setupInstruction = function(instructionName) {
        let instruction = document.createElement("div");
        instruction.classList.add("instruction");
        instruction.name = instructionName;
        instruction.x = 0;
        instruction.y = 0;

        let name = document.createElement("span");
        name.classList.add("unselectable");
        name.innerHTML = instructionName;
        instruction.appendChild(name);

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
            window.movingInstruction.moving = false;
            window.moving = false;
            move(window.movingInstruction, 0, 0);
            window.movingInstruction.classList.remove("instruction-moving");
            delete window.movingInstruction;
        }



        return instruction;
    }


    // Setup the instruction list where the user will take instructions to put in their script
    const INSTRUCTION_LIST = document.getElementById("instruction-list");
    INSTRUCTIONS.forEach((instructionName) => {
        INSTRUCTION_LIST.appendChild(setupInstruction(instructionName));

    });

}

init();