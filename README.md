# assemblet

Setting up the database:
- On your preferred operating system, download PostgreSQL and create a databast named assemblet.
- Make a user named postgres (if they didn't exist already) and set their password to root.
- Give the postgres user priviliges to the assemblet database.
- Import the assembletPS.sql file into the assemblet database.

How to run:
- Download python and pip
- In terminal, go into assemblet folder `cd PATH_TO_ASSEMBLET`
- Install requirements `pip install -r requirements.txt`
- Run flask `python app.py`
- Open browser, go to localhost:5000
- To create your own puzzles, sign up and add that username to the admin table in postgres.

## Note: Deploying it with the instructions above will result in a site with no puzzles. 
## The application is already deployed on https://assemblet.patchouli.dev/ which has puzzles created.

# basic structure of program (as of now)
- flask (python) is used to run the server
- html/css/js files have the actual pages
- database will be run in the background separately, but keep in repository for now

# link to software design description
https://docs.google.com/document/d/1Lgr2LjtCBOfm8wJsKoURJN13T4ueE46bc9b1HsUNxU0/edit?usp=sharing
