import ply.lex as lex

tokens = ("LABEL", "INSTRUCTION", "NUMBER", "REGISTER")

# Tokens
t_LABEL = r"\w+:"
t_INSTRUCTION = r"\s*(IN|OUT|ADD|MOVE|SUBSTRACT|MULTIPLY|DIVIDE|GOTO)"
t_REGISTER = r"\s*(A|B|C|D|E|F)"
t_ignore = " \t"

def t_NUMBER(t):
    r"\d+"
    try:
        t.value = int(t.value)
    except ValueError:
        print("Integer value too large %d", t.value)
        t.value = 0
    return t

def t_newline(t):
    r"\n+"
    t.lexer.lineno += t.value.count("\n")

def t_error(t):
    print("Illegal character '%s'" % t.value[0])
    t.lexer.skip(1)

lexer = lex.lex()
with open("sample.mrtl") as f:
    data = f.read()

program = []

lexer.input(data)
for token in lexer:
    if token.lineno <= len(program):
        program[token.lineno - 1].append(token.value)
    else:
        program.append([token.type, token.value])

# ============================================================================= #

from enum import Enum

class Register(Enum):
    A = 0
    B = 1
    C = 2
    D = 3
    E = 4
    F = 5

class Interpreter:

    def __init__(self, program):
        self.program = program
        self.registers = [0] * 6
        self.pc = 0

    def handle_label(self):
        pass

    def handle_instruction(self, line):
        # line: [Instruction, arg1, arg2]

        if line[0] == "MOVE":
            self._handle_move(line[1:])

        if line[0] == "OUT":
            self._handle_out(line[1:])

    def _handle_move(self, args):
        # syntax is : MOVE reg|num reg
        
        # immediate to register
        if isinstance(args[0], int):
            self.registers[Register[args[1]].value] = args[0]
    
    def _handle_out(self, args):
        # syntax is : OUT reg

        print(self.registers[Register[args[0]].value])

    def execute(self):
        while self.pc < len(program):
            line = program[self.pc]

            if line[0] == "LABEL":
                self.handle_label()
            
            elif line[0] == "INSTRUCTION":
                self.handle_instruction(line[1:])
            
            self.pc += 1

    def __repr__(self):
        return f"{self.program}\n registers={self.registers}\n pc={self.pc}"

# ============================================================================= #

a = Interpreter(program)
a.execute()