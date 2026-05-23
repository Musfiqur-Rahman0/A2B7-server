import express, { Application, Request, Response } from "express";
import userRoute from "./modules/user/userRoute";
import authRoute from "./modules/auth/authRoute";
import issuesRoute from "./modules/issues/issues.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import routeNotFoundHandler from "./middleware/routeNotFoundHandler";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hellow form the server! all setup ok ");
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/issues",  issuesRoute);

app.use(routeNotFoundHandler);
app.use(globalErrorHandler);

export default app;
