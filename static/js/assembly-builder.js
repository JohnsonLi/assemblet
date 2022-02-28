// build the assembly for the interpreter
const ASSEMBLY_BUILDER = document.getElementById("assembly-builder");
const INSTRUCTION_LIST = document.getElementById("instruction-list");

var init = function() {
    const NUM_INSTRUCTIONS = 10;
    ASSEMBLY_BUILDER.instructions = [];
    // Setup the assembly builder where the user will create their script
    
    for (let i = 0; i < NUM_INSTRUCTIONS; i++) {
        let instructionEntry = document.createElement("div");
        instructionEntry.classList.add("instruction-entry");
        ASSEMBLY_BUILDER.appendChild(instructionEntry);
        ASSEMBLY_BUILDER.instructions.push(instructionEntry);
        instructionEntry.onmouseup = function(event) {
            if (window.moving && event.currentTarget.children.length == 0) {
                window.movingInstruction.parentElement.removeChild(window.movingInstruction);
                event.currentTarget.appendChild(window.movingInstruction);
            }
        }

        
    }

    // Setup the instruction list where the user will take instructions to put in their script
    
    Object.keys(INSTRUCTIONS).forEach((instructionName) => {
        INSTRUCTION_LIST.appendChild(setupInstruction(instructionName));
    });
}

var compile = function() {
    let compiled = [];
    ASSEMBLY_BUILDER.instructions.forEach((instructionEntry) => {
        if (instructionEntry.children.length != 0) {
            let instruction = instructionEntry.children[0];
            let s = instruction.name;
            instruction.parameters.forEach((parameter) => {
                if (parameter.value == "") {
                    $(instruction).css({"border-color": "red", "border-width": "2px"});
                    setTimeout(() => {
                        $(instruction).css({"border-color": "black", "border-width": "1px"})
                    }, 500);
                }    
                s += " " + parameter.value;
            });
            compiled.push(s);
        }
    });
    console.log(compiled);
}






init();