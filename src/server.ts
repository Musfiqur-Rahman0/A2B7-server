import app from "./app";
import config from "./config";
import { initDB } from "./db";
import globalErrorHandler from "./middleware/globalErrorHandler";
import routeNotFoundHandler from "./middleware/routeNotFoundHandler";

const port = config.port || 3000;

const main = () => {
  initDB();
  app.listen(port, () => {
    console.log(`Server changed is running at http://localhost:${port}`);
  });
};

app.use(routeNotFoundHandler);
app.use(globalErrorHandler);

main();
