import express, { Application, Request, Response } from "express";
import userRoute from "./modules/user/userRoute";
import authRoute from "./modules/auth/authRoute";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hellow form the server! all setup ok ");
});

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

export default app;
