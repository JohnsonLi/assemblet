// build the assembly for the interpreter

var init = function() {

    // Setup the instruction list where the user will take instructions to put in their script
    INSTRUCTION_LIST.innerHTML = "";
    instructions_allowed.forEach((instructionName) => {
        INSTRUCTION_LIST.appendChild(setupInstruction(instructionName));
    });


    Sortable.create(ASSEMBLY_BUILDER, {
        group: {
            name: 'assembly_builder',
            put: ['instructions']
        },
        ghostClass: 'ghost-instruction',
        animation: 150,
        onAdd: function(evt) {
            makeParameters(evt.item, evt.item.name);
            if (ASSEMBLY_BUILDER.children.length >= INSTRUCTION_NUMBERS.children.length) {
                let number = document.createElement("div");
                number.classList.add("instruction-number", "z-depth-0");
                let span = document.createElement("span");
                span.innerHTML = INSTRUCTION_NUMBERS.children.length;
                number.appendChild(span);
                INSTRUCTION_NUMBERS.appendChild(number);
            }
        },
        onStart: function(evt) {
            INSTRUCTION_LIST.childNodes.forEach((instr) => {
                instr.classList.add("fade");
            });
            TRASH.classList.remove("hidden");
        },
        onEnd: function(evt) {
            INSTRUCTION_LIST.childNodes.forEach((instr) => {
                instr.classList.remove("fade");
            });
            
            TRASH.classList.add("hidden");
        }
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
            
        },
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
        sort: false,
        group: {
            name: "trash",
            put: true,
            pull: false
        },
        onAdd: function (evt) {
            evt.item.remove();
        },
        ghostClass: "hidden",
        handle: '.handle'
    });

    for (let i = 0; i < 10; i++) {
        let number = document.createElement("div");
        number.classList.add("instruction-number", "z-depth-0");
        let span = document.createElement("span");
        span.innerHTML = i;
        number.appendChild(span);
        INSTRUCTION_NUMBERS.appendChild(number);
    }

}

var highlightInstruction = function(pc) {
    ASSEMBLY_BUILDER.childNodes.forEach((node) => {
        node.classList.remove("highlight");
    });
    if (pc == -1) return;
    ASSEMBLY_BUILDER.childNodes[pc].classList.add("highlight");
}

var compile = function() {
    let compiled = [];
    let failed = false;
    ASSEMBLY_BUILDER.childNodes.forEach((instruction) => {
        let s = instruction.name;
        instruction.parameters.forEach((parameter) => {
            if (parameter.value == "") {
                $(instruction).css({"border-color": "red", "border-width": "2px"});
                setTimeout(() => {
                    $(instruction).css({"border-color": "black", "border-width": "1px"})
                }, 500);
                failed = true;
            } else {  
                s += " " + parameter.value;   
            }
        });
        compiled.push(s);
    });
    return failed ? null : compiled.join('\n').toUpperCase();
}






init();