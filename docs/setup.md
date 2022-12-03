# Accessing the Project
You can use Heroku url to access our app or run server in browser via "localhost:${portnumber}"

## Accessing from Heroku
Go to the url: https://sigma-badminton.herokuapp.com/

## Heroku Deployment setting
Add secret keys to access database.
Set the password as environment var in Heroku before we deploy project

## Accessing from terminal
Navigate to the root directory for the project.  
Type the command: node server.js  
This will start the server, then simply go to http://localhost:3000/ in your browser and the index page will show.
We also directly go to http://localhost:3000/signin http://localhost:3000/signup http://localhost:3000/user/id:
http://localhost:3000/matching http://localhost:3000/updateScore http://localhost:3000/ranking to test webpages

## MongoDB setup
We creat a MongoDB Atlas account and store badminton.users and badminton.games data in the database. The data is stored as json files and can be accessed dirctly from MongoDB.
