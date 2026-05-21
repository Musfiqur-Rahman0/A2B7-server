import { Router } from "express";
import { userController } from "./userController";
import auth from "../../middleware/auth";

const router = Router();

// router.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "User route is working",
//   });
// });

router.get("/", userController.getAllUsers);

const userRoute = router;
export default userRoute;
