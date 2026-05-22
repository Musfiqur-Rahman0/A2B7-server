import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/", issuesController.getAllIssues);
router.post(
  "/",
  auth("contributor", "maintainer"),
  issuesController.createIssue,
);
router.get("/:id", issuesController.getSingleIssue);
router.put("/:id", issuesController.updateIssue);
router.delete("/:id", auth("maintainer"), issuesController.deleteIssue);

const issuesRoute = router;
export default issuesRoute;
