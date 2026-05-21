import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "User route is working",
  });
});

const userRoute = router;
export default userRoute;
