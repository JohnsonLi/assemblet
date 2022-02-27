import ply.lex as lex
import ply.yacc as yacc

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

lexer.input(data)
for tok in lexer:
    print(tok)