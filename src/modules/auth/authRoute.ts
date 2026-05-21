import { Router } from "express";
import { authController } from "./authController";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auth route is working",
  });
});

router.post("/signup", authController.signUpUser);
router.post("/login", authController.loginUser);

const authRoute = router;
export default authRoute;
