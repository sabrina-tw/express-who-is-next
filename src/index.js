const app = require("./app");
const PORT = 3004;
require("./utils/db");

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}...`);
});
