const app = require("./app");
const port = process.env.PORT || 5000;
const { connectDatabase } = require("./config/database");

// connecting datatbase
connectDatabase();

app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});
