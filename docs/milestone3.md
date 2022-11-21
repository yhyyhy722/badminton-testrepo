## Milestone 3 Docs

# Database Documentation
Our database is a collection containing two types of documents: Users and Games. They are described below
```javascript
    user document {  
        _id: <ObjectId>,            //ObjectId provided by MongoDB  
        email: String,              //Email of the user  
        name: String,               //Name of the user
        password: String,           //Password of the user  
        avatar: String,             //Acatar url link of the user  
        level: String,              //Badminton skill level of the user (Ex: ["low", "intermediate", "advanced", "elite"]) 
        score: Number,              //The user's game scores that will increase or decrease after each game over
        createAt: Date,             //Time of user sign up
    } 
```  

```javascript
    game document {  
        _id: <ObjectId>,           //ObjectId provided by MongoDB  
        user: <User>,              //Home player in the game 
        opponent: <User>,          //Away player in the game
        address: String,           //Address od the game  
        userScore: Number,         //Home players score after the game over
        opponentScore: Number,     //Away players score after the game over
        status: String,            //Status of the current game (Ex: ["preparing", "inputting", "over"])
        gameTime: Date,            //Start time of the game  
        createAt: Date,            //Create time of the game
    } 
```

# *Rough* Breakdown of Work
1. Mongodb Atlas的创建，用户以及IP权限的设置.
2. db.js中连接到Mongodb，secrets.json的创建和设置.
3. 用户登录，注册，及更新.
4. 排名，历史记录的查询.
5. 创建比赛，查询，更新比赛.
