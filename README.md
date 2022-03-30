# assemblet

How to install:
- download python, download pip
- in terminal, go into assemblet folder `cd PATH_TO_ASSEMBLET`
- install requirements `pip install -r requirements.txt`
- run flask `python app.py`
- open browser, go to localhost:5000

# how to pull / push into git (faster way of committing changes)
- open terminal
- `cd PATH_TO_ASSEMBLET` (maybe this is something like `cd C:\Users\jiayang\assemblet`
- to pull (get new changes) `git pull`
- to push (put your new changes onto the internet) `git add .` and then `git commit -m "just a message"`, finally, `git push`


# how to work on database
- install xampp
- go to mysql -> config 
- click my.ini
- go to datadir=
- put the path of the database in there

# basic structure of program (as of now)

- flask (python) is used to run the server
- html/css/js files have the actual pages
- database will be run in the background separately, but keep in repository for now

