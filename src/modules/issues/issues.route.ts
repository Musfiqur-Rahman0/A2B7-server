import { Router } from "express";
import { issuesController } from "./issues.controller";

const router = Router();

router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssue);
router.put("/:id", issuesController.updateIssue);

const issuesRoute = router;
export default issuesRoute;
