# wishlistR
Add your wishlist, share it with your friends and strategize your next gift to your friends.



## Docker
* Run `docker-compose up` or `docker-compose up --build`
* Will start the app on localhost:8080, postgresdb:5432 and pgAdmin on localhost:5555


## Scripts
`npm run start:dev`
Starts the application in development using nodemon and ts-node to do cold reloading.

`npm run build`
Builds the app at build, cleaning the folder first.

`npm run start`
Starts the app in production by first building the project with npm run build, and then executing the compiled JavaScript at dist/server.js.