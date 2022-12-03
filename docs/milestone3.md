## Milestone 3 Docs

# Database Documentation
Our database is a collection containing two types of documents: Users and Games. They are described as below
```javascript
    user document {  
        _id: <ObjectId>,            //ObjectId provided by MongoDB  
        email: String,              //Email of the users  
        name: String,               //Name of the users
        password: String,           //Password of the users   
        avatar: String,             //Avatar url link of the users 
        level: String,              //Badminton skill level of the user (Ex: ["low", "intermediate", "advanced", "elite"]) 
        score: Number,              //The user's game scores that will increase or decrease after each game
        createAt: Date,             //Signup times of users
    } 
```  

```javascript
    game document {  
        _id: <ObjectId>,           //ObjectId provided by MongoDB  
        user: <User>,              //Home player in the game 
        opponent: <User>,          //Away player in the game
        address: String,           //Address where the game starts
        userScore: Number,         //Home players score after the game
        opponentScore: Number,     //Away players score after the game
        status: String,            //Status of the current game (Ex: ["preparing", "inputting", "over"])
        gameTime: Date,            //Start time of the game  
        createAt: Date,            //Create time of the game
    } 
```



# Division of Labor:

Walid Hamade:
Server revisions&updates, and ranking, get GameHistory part
API revisions&updates
GameHistory.html, Home.html revisions&updates
Ranking front end file revisions&updates
CSS revisions&updates
Provides the insight of the ELO Ranking Algorithm (The main algorithm to rank the users of this project)

Huayang Yu:
Server.js: signin signup, matching part, and manage users' level
API revisions&updates
SignIn signup front end files revisions&updates
New front end file "common" added (Mainly for fetching user information)
CSS revisions&updates
Deployment on Heroku
Database Implementation including add secret keys to db.js

Zhengrui Yang:
Server main part: UpdataScore and matching
API revisions&updates
Matchmaking.html, Ranking.html revisions&updates
GameHistory front end file revisions&updates
Database Implementation: connect to MongoDB, our team use Zhengrui's mongoDB account
