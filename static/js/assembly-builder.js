// build the assembly for the interpreter

var init = function() {

    // Setup the instruction list where the user will take instructions to put in their script
    instructions_allowed.forEach((instructionName) => {
        INSTRUCTION_LIST.appendChild(setupInstruction(instructionName));
    });

    registers_allowed.forEach((registerName) => {
        GAME_REGISTERS.appendChild(setupRegister(registerName));
    });

    values_allowed.forEach((value) => {
        GAME_VALUES.appendChild(setupValue(value));
    })

    Sortable.create(ASSEMBLY_BUILDER, {
        group: {
            name: 'assembly_builder',
            put: ['instructions']
        },
        ghostClass: '.ghost-instruction',
        animation: 150
    });
    Sortable.create(INSTRUCTION_LIST, {
        sort: false,
        group: {
            name: 'instructions',
            pull: 'clone'
        },
        onClone: function(evt) {
            evt.clone.name = evt.item.name;
            evt.clone.isInstruction = true;
            while (evt.clone.children.length > 1) {
                evt.clone.removeChild(evt.clone.lastChild);
            }
            makeParameters(evt.clone, evt.item.name);
        },
    });

    Sortable.create(GAME_VALUES, {
        group: {
            name: 'values',
            put: function(to, from, el) {
                return el.isValue;
            }
        },
        
    });

    Sortable.create(GAME_REGISTERS, {
        group: {
            name: 'registers',
            pull: 'clone'
        },
        onClone: function(evt) {
            evt.clone.innerHTML = evt.item.innerHTML;
            evt.clone.isRegister = evt.item.isRegister;
            evt.clone.value = evt.item.value;
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
            name: "trash",
            put: true
        },
        onAdd: function (evt) {
            var el = evt.item;
            if (el.isValue) {
                GAME_VALUES.appendChild(el);
            } else if (el.isInstruction) {
                el.childNodes.forEach((input) => {
                    if (input.children.length == 1 && input.childNodes[0].isValue) {
                        GAME_VALUES.appendChild(input.childNodes[0]);
                    }
                el.remove();
                });

            } else {
                el.remove();
            }
        },
        ghostClass: "hidden"
    });

    

}

var highlightInstruction = function(pc) {
    ASSEMBLY_BUILDER.childNodes.forEach((node) => {
        node.classList.remove("highlight");
    });
    ASSEMBLY_BUILDER.childNodes[pc].classList.add("highlight");
}

var compile = function() {
    let compiled = [];
    let failed = false;
    ASSEMBLY_BUILDER.childNodes.forEach((instruction) => {
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
    });
    return failed ? null : compiled.join('\n').toUpperCase();
}






init();