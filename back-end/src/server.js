import express from 'express';
import { routes } from './routes';
import { Connection } from './config/mongo';

const PORT = process.env.PORT || 8080;

const app = express();

// Middleware to access the body of POST/PUT
// requests in our route handlers (as req.body)
app.use(express.json());

// Add all the routes to the Express server
// exported from routes/index.js
routes.forEach((route) => {
  app[route.method](route.path, ...route.handlers);
});

// Connect to the database, then start the server.
// This prevents us from having to create a new DB
// connection for every request.
Connection.connectToMongo()
  .then(() => {
    // Listen on port env.port
    app.listen(process.env.PORT, () => {
      console.log(`Listening on Port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
