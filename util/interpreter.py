import ply.lex as lex
from prettytable import PrettyTable

tokens = ("LABEL", "INSTRUCTION", "NUMBER", "REGISTER")

# Tokens
t_LABEL = r"\w+:"
t_INSTRUCTION = r"\s*(IN|OUT|MOVE|ADD|SUB|MULT|DIV|MOD|JUMP|JE|JNE|GT|GTE|LT|LTE)"
t_REGISTER = r"\s*(A|B|C|D|E|F|G|X|Y|Z)"
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
with open("fib.mrtl") as f:
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
    G = 6
    X = 7
    Y = 8
    Z = 9

class Interpreter:

    def __init__(self, program):
        self.program = program
        self.registers = [0] * len(Register)
        self.pc = 0

    def handle_label(self):
        self.pc += 1

    def handle_instruction(self, line):
        # line: [Instruction, arg1, arg2]

        if line[0] == "MOVE":
            self._handle_move(line[1:])

        if line[0] == "OUT":
            self._handle_out(line[1:])

        if line[0] == "JUMP":
            self._handle_jump(line[1:])
        
        if line[0] == "JE":
            self._handle_je(line[1:])
        
        if line[0] == "JNE":
            self._handle_jne(line[1:])

        if line[0] == "ADD":
            self._handle_add(line[1:])
        
        if line[0] == "SUB":
            self._handle_sub(line[1:])

        if line[0] == "MULT":
            self._handle_mult(line[1:])
        
        if line[0] == "DIV":
            self._handle_div(line[1:])
        
        if line[0] == "MOD":
            self._handle_mod(line[1:])

        if line[0] == "GT":
            self._handle_gt(line[1:])
        
        if line[0] == "GTE":
            self._handle_gte(line[1:])
        
        if line[0] == "LT":
            self._handle_lt(line[1:])
        
        if line[0] == "LTE":
            self._handle_lte(line[1:])
        
        # Increment PC unless jump
        if line[0] != "JUMP" and line[0] != "JE" and line[0] != "JNE":
            self.pc += 1

    def _handle_move(self, args):
        # syntax is : MOVE reg|num reg
        if isinstance(args[0], int):
            # immediate to register
            self.registers[Register[args[1]].value] = args[0]
        else:
            # register to register
            self.registers[Register[args[1]].value] = self.registers[Register[args[0]].value]
         
    def _handle_out(self, args):
        # syntax is : OUT reg
        print(self.registers[Register[args[0]].value])

    def _handle_jump(self, args):
        # syntax is : JUMP linenum
        self.pc = args[0] - 1 # -1 because index starts at 0

    def _handle_add(self, args):
        # syntax is : ADD reg|num reg
        if isinstance(args[0], int):
            # add immediate to register
            self.registers[Register[args[1]].value] += args[0]
        else:
            # add register to register
            self.registers[Register[args[1]].value] += self.registers[Register[args[0]].value]

    def _handle_sub(self, args):
        # syntax is : SUB reg|num reg
        if isinstance(args[0], int):
            # sub immediate from register
            self.registers[Register[args[1]].value] -= args[0]
        else:
            # sub register from register
            self.registers[Register[args[1]].value] -= self.registers[Register[args[0]].value]

    def _handle_mult(self, args):
        # syntax is : MULT reg|num reg

        if isinstance(args[0], int):
            # mult immediate to register
            self.registers[Register[args[1]].value] *= args[0]
        else:
            # mult register to register
            self.registers[Register[args[1]].value] *= self.registers[Register[args[0]].value]
    
    def _handle_div(self, args):
        # syntax is : DIV reg|num reg
        if isinstance(args[0], int):
            # div immediate from register
            self.registers[Register[args[1]].value] /= args[0]
        else:
            # div register from register
            self.registers[Register[args[1]].value] /= self.registers[Register[args[0]].value]

    def _handle_mod(self, args):
        # syntax is : MOD reg|num reg
        if isinstance(args[0], int):
            # mod immediate from register
            self.registers[Register[args[1]].value] %= args[0]
        else:
            # mod register from register
            self.registers[Register[args[1]].value] %= self.registers[Register[args[0]].value]

    def _handle_je(self, args):
        # syntax is : JE linenum reg|num reg
        if isinstance(args[1], int):
            # compare immediate to register
            if args[1] == self.registers[Register[args[2]].value]:
                self._handle_jump([args[0]])
        # compare register to register
        elif self.registers[Register[args[1]].value] == self.registers[Register[args[2]].value]:
            self._handle_jump([args[0]])
        
        self.pc += 1
    
    def _handle_jne(self, args):
        # syntax is : JNE linenum reg|num reg
        if isinstance(args[1], int):
            # compare immediate to register
            if args[1] != self.registers[Register[args[2]].value]:
                self._handle_jump([args[0]])
        # compare register to register
        elif self.registers[Register[args[1]].value] != self.registers[Register[args[2]].value]:
            self._handle_jump([args[0]])
        
        self.pc += 1

    def _handle_gt(self, args):
        # syntax is : GT linenum reg|num reg
        # If reg|num > reg, set register Z to 1 else 0
        if isinstance(args[0], int):
            # compare immediate to register
            if args[0] > self.registers[Register[args[1]].value]:
                self.registers[Register.Z.value] = 1
            else:
                self.registers[Register.Z.value] = 0
        else:
            # compare register to register
            if self.registers[Register[args[0]].value] > self.registers[Register[args[1]].value]:
                self.registers[Register.Z.value] = 1
            else:
                self.registers[Register.Z.value] = 0
    
    def _handle_gte(self, args):
        # syntax is : GTE linenum reg|num reg
        # If reg|num >= reg, set register Z to 1 else 0
        if isinstance(args[0], int):
            # compare immediate to register
            if args[0] >= self.registers[Register[args[1]].value]:
                self.registers[Register.Z.value] = 1
            else:
                self.registers[Register.Z.value] = 0
        else:
            # compare register to register
            if self.registers[Register[args[0]].value] >= self.registers[Register[args[1]].value]:
                self.registers[Register.Z.value] = 1
            else:
                self.registers[Register.Z.value] = 0
    
    def _handle_lt(self, args):
        # syntax is : LT linenum reg|num reg
        # If reg|num < reg, set register Z to 1 else 0
        if isinstance(args[0], int):
            # compare immediate to register
            if args[0] < self.registers[Register[args[1]].value]:
                self.registers[Register.Z.value] = 1
            else:
                self.registers[Register.Z.value] = 0
        else:
            # compare register to register
            if self.registers[Register[args[0]].value] < self.registers[Register[args[1]].value]:
                self.registers[Register.Z.value] = 1
            else:
                self.registers[Register.Z.value] = 0
    
    def _handle_lte(self, args):
        # syntax is : LTE linenum reg|num reg
        # If reg|num <= reg, set register Z to 1 else 0
        if isinstance(args[0], int):
            # compare immediate to register
            if args[0] <= self.registers[Register[args[1]].value]:
                self.registers[Register.Z.value] = 1
            else:
                self.registers[Register.Z.value] = 0
        else:
            # compare register to register
            if self.registers[Register[args[0]].value] <= self.registers[Register[args[1]].value]:
                self.registers[Register.Z.value] = 1
            else:
                self.registers[Register.Z.value] = 0

    def execute(self):
        while self.pc < len(self.program):
            self.step()

    def step(self):
        if self.pc < len(program):
            line = program[self.pc]

            if line[0] == "LABEL":
                self.handle_label()
            
            elif line[0] == "INSTRUCTION":
                self.handle_instruction(line[1:])

    def __repr__(self):
        string = "PC: " + str(self.pc) + "\n"
        
        try:
            string += "Current instruction: " + str(self.program[self.pc]) + "\n"
        except:
            string += "Current instruction: None\n"

        table = PrettyTable()
        table.field_names = [i for i in Register.__members__.keys()]
        table.add_row(self.registers)

        string += table.get_string()

        return string

# ============================================================================= #

a = Interpreter(program)
print(a)
a.execute()
print(a)