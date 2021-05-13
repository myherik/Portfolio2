# Portfolio2 - Snake - Group 5

## Implementing game mechanics
___

Technology chosen: Node.js backend with html/css/javascript for graphics and socket.io for networking 

The first thing we had to do was obviously to set up a basic gameboard where we figured using canvas with the p5 library was the best solution. Then we pieced together every function of the game we needed one by one. The snake itself was the natural starting point. Then came adding movement, food, growing and so on.

Once we had the most basic implementation of a snake game we thought it'd be nice to start adding the multiplayer functionality with websockets. We started by registering our snake to the server and for others to retrieve other registered snakes. In theory this makes it possible for an infinte ammount of players.

Now that we had a functioning multiplayer snake we added features that is not totally necessary but nice to have in the game. This includes dying when hitting other snake, dead snakes turning into food and scores to mention some of them.

Now that we had completed all the expected features we started on the stretch goals. The natural first stretch goal to start with was a database to store scores on. We used mongodb to implement this. We figured creating users was also nice for having personal best scores and improving on top score whilst noone else could have that name.

Having users also made it natural to implement API so that we have a starting page for login and instructions while the game itself could be its own thing. Other stretch goals we have implemented are https with openssl (self signed certification on port 8081), google authentication, scrolling the game, allowing for >10 players, password hashing with bcrypt and [WHEN PROMETHEUS DONE INSERT HERE] 

We decided not to implement bots on purpose as we thought it would not be good for the game. 



## Running the project
___

Deployment with docker is necessary. To start hosting here is the command.

```
docker compose up --build
```

Alternatively you could run the project with seperate docker containers with these commands

```
docker network create skynet
docker build -t snake-server . 
docker run --network skynet --name mongodb -v $(pwd)/mongodb/data:/data/db -e MONGO_INITDB_ROOT_PASSWORD=root -e MONGO_INITDB_USERNAME=root -d mongo
docker run --network skynet -p 8080:8080 -p 8081:8081 snake-server
```

Now if you enter a browser ant type in localhost:8080 or alternatively for openssl you can do https://localhost:8081 you should be able to get to the login page. If you enter with the https you have to approove it yourself as most browsers will not say it is a valid certification.

We have also used the OsloMet linux VM to host for testing purposes so that we could test within the group without being on the same network. This gave us the address os13.vlab.cs.hioa.no:8081 where anyone on the internet could come in and try. This was very useful in testing the multiplayer mechanics as we have not been able to meet in person a lot due to the world conditions.

## Interaction with the end product
___

When on the login page you will get instructions on how to play the game as well here.

To start the game you have to options. You can log in with a user or through google. If you do not have a user/google account and/or do not wish to use google you can easily create a user by clicking the 'Register' button. When Having clicked the register button you can fill in the input field with a username of and password of your choice as long as username is not already registered in the database.

Test user is already created for testing where you can input admin as both username and password.

Once logged in you are immediately placed in the game, but you have no movement. You can start moving in any of direction by pressing either the arrowkeys or the 'wasd' keys on your keyboard. The entirety of the game is played with these keys, but there are a few additional keys available. You can press the 'c' key if you are not happy with the colour of your snake, and you'll be given another random colour. If you want the game zoomed more in or out you can press the keys '-' or '+' respectively. [We also have the keypress 'h' for help].

When moving the goal of the game is to get the highest possible score. Move towards the red or green circles and you will get bigger and get a higher score. If you hit the white walls or another snake you will die and your score will reset. You know you have died when a large red text in the middle of the screen pops up saying "You Died!". To start over again all you have to do is press the green button that also showed up when you died. If you die or disconnect (by for example closing the browser) your score will be saved if it beats your previous score. If your score is higher than any other players score then it will show under "All time high score".

## Goals we believe we have succeeded in implementing into the project
___

### User stories goals:

- Starting the program and easily start playing alone with noone else connected

- Moving the snake around the board using the keyboard

- Dead players turning into food

- Game tells you what keys to use so that you do not have to refer to documentation

- Running into walls and other players will kill you

- Very clear indication of death

- Scrolling is automatic when no outer wall is visible

- A clear list of connected players

- Snake grows by running into "food"

- Points given for getting bigger and ammount of points are clearly visible

### Requirements

- Minimum of 2 players supported

### Stretch Goals

- Secure all communication with TLS (https with openssl)

- [ADD PROMETHEUS HERE WHEN DONE]

- Allowed for >10 players or unlimited players

- Follow up from previous where scrolling is implemented. The game board revolves around your snake and not the snake just moving around in the game board.

- Persistent high score list with a database backend (mongodb)

### Other Goals

- Password hashing (more secure login)
- Google authentication (option of google login)

## Screenshots of end product and output
___

## Libraries used making this project and sources
___
