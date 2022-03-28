// build the assembly for the interpreter
const ASSEMBLY_BUILDER = document.getElementById("assembly-builder");
const INSTRUCTION_LIST = document.getElementById("instruction-list");
const GAME_VALUES = document.getElementById("game-values");
const GAME_REGISTERS = document.getElementById("game-registers");
const TRASH = document.getElementById("trash");

var init = function() {
    ASSEMBLY_BUILDER.instructions = [];
    // Setup the assembly builder where the user will create their script
    
    for (let i = 0; i < NUM_INSTRUCTIONS; i++) {
        let instructionEntry = document.createElement("div");
        instructionEntry.classList.add("instruction-entry");
        ASSEMBLY_BUILDER.appendChild(instructionEntry);
        ASSEMBLY_BUILDER.instructions.push(instructionEntry);
        instructionEntry.addEventListener("mouseup", function(event) {
            if (window.moving && event.currentTarget.children.length == 0 && window.movingDiv.isInstruction) {
                let newInstruction = window.movingDiv;
                if (window.movingDiv.baseInstruction) {
                    newInstruction = setupInstruction(window.movingDiv.name);
                    newInstruction.canDelete = true;
                    newInstruction.baseInstruction = false;
                }
                event.currentTarget.appendChild(newInstruction);
            }  else if (window.moving && event.currentTarget.children.length == 1 && window.movingDiv.isInstruction && window.movingDiv.canDelete) {
                let old = event.currentTarget.childNodes[0];
                let movingDivParent = window.movingDiv.parentNode;
                event.currentTarget.appendChild(window.movingDiv);
                movingDivParent.appendChild(old);
            }
        });
 
        
    }

    GAME_VALUES.addEventListener("mouseup", function(event) {
        if (window.moving && window.movingDiv.isValue) {
            GAME_VALUES.appendChild(window.movingDiv);
        }
    });

    GAME_REGISTERS.addEventListener("mouseup", function(event) {
        if (window.moving && window.movingDiv.isRegister) {
            GAME_REGISTERS.appendChild(window.movingDiv);
        }
    });

    // Setup the instruction list where the user will take instructions to put in their script
    instructions_allowed.forEach((instructionName) => {
        let instruction = setupInstruction(instructionName);
        instruction.canDelete = false;
        INSTRUCTION_LIST.appendChild(instruction);
    });



    values_allowed.forEach((value) => {
        GAME_VALUES.appendChild(setupValue(value));
    });

    registers_allowed.forEach((value) => {
        GAME_REGISTERS.appendChild(setupRegister(value));
    });


    //Setup trashcan
    let trashImg = document.createElement("img");
    trashImg.base = "/static/assets/trash-light.png";
    trashImg.alt = "/static/assets/trash-dark.png";
    trashImg.src = trashImg.base;
    trashImg.addEventListener("mouseover", function(event) {
        event.currentTarget.src = event.currentTarget.alt;
    });
    trashImg.addEventListener("mouseout", function(event) {
        event.currentTarget.src = event.currentTarget.base;
    });
    TRASH.addEventListener("mouseup", function(event) {
        if (window.moving && window.movingDiv.isInstruction && window.movingDiv.canDelete) {
            window.movingDiv.remove();
        }
    });
    TRASH.appendChild(trashImg);


}

var compile = function() {
    let compiled = [];
    let failed = false;
    ASSEMBLY_BUILDER.instructions.forEach((instructionEntry) => {
        if (instructionEntry.children.length != 0) {
            let instruction = instructionEntry.children[0];
            let s = instruction.name;
            instruction.parameters.forEach((parameter) => {
                if (parameter.childNodes.length == 0) {
                    $(instruction).css({"border-color": "red", "border-width": "2px"});
                    setTimeout(() => {
                        $(instruction).css({"border-color": "black", "border-width": "1px"})
                    }, 500);
                    failed = true;
                } else {  
                    s += " " + parameter.childNodes[0].value;
                }
            });
            compiled.push(s);
        }
    });
    return failed ? null : compiled.join('\n').toUpperCase();
}






init();