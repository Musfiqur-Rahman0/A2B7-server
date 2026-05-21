import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Auth route is working",
  });
});

const authRoute = router;
export default authRoute;
