import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
const app = express();
const port = 3001; // default port to listen

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// define a route handler for the default home page
app.get("/", (req, res) => {
  // render the index template
  res.render("index");
});

//graphql
app.use('/docs', graphqlHTTP({
  schema: buildSchema(`
  type RootQuery{
    events:[String!]!
  }

  type RootMutations{
    createEvent(name:String):String
  }
    schema{
      query:RootQuery
      mutation:RootMutations
    }
  `),
  rootValue: {
    events: () => {
      return ['Romantic', 'Cooking']
    },
    createEvent: (args: { name: String }) => {
      const eventName = args.name;
      return eventName;
    }
  },
  graphiql: true
}))

// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});