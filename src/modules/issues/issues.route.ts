import { Router } from "express";
import { issuesController } from "./issues.controller";

const router = Router();

router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssue);

const issuesRoute = router;
export default issuesRoute;
