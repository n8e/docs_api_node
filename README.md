# docms2
Document Management System (Node, Express, Mongo)

##  Models
The models contained are `users`, `documents` and `roles`. A document belongs to a `User` and is related to them using the `ownerId`. A `Role` is related to the `User` using the `id` field. Each `Document` has restrictions on the roles. A `Role` also relates to the `Document` using the `title`.

## Testing
Testing is done using the `superagent` node module which is installed via `npm` when you install all the other node modules in `package.json`. `superagent` is used to make requests to the api routes and receive responses. The tests are run on terminal using the command `jasmine-node`. We use `faker` node package to generate dummy users to be used for tests.

## Express Routes
The routes are created using `express` routers. The server needs to be started using the terminal command `nodemon server.js`. Our server file is called `server.js`. The routes are defined in the `./server/routes/api.js` file.


@3nj0y!