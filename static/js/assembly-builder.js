// build the assembly for the interpreter

var init = function() {

    // Setup the instruction list where the user will take instructions to put in their script
    instructions_allowed.forEach((instructionName) => {
        INSTRUCTION_LIST.appendChild(setupInstruction(instructionName));
    });

    Sortable.create(ASSEMBLY_BUILDER, {
        group: {
            name: 'assembly_builder',
            put: ['instructions']
        },
        ghostClass: 'ghost-instruction'
    });
    Sortable.create(INSTRUCTION_LIST, {
        group: {
            name: 'instructions',
            pull: 'clone'
        }
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
    TRASH.appendChild(trashImg);

    Sortable.create(TRASH, {
        group: {
            put: ['assembly_builder']
        },
        onAdd: function (evt) {
            var el = evt.item;
            el.parentNode.removeChild(el);
        },
        ghostClass: "hidden"
    });

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