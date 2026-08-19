import express from "express";
import { login,logout,reductCredit,UpdateAfterPayment} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/login", login);
router.get("/logout", logout);
router.post("/updateUser", UpdateAfterPayment); // Add this line to handle the updateUser route
router.post("/reduct",reductCredit)

export default router;