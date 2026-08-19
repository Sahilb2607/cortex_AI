import { Router } from "express";
import { CreateOrder,VerifyPayment} from "../controllers/payment.controllers.js";
const router = Router();

router.post("/createOrder", CreateOrder);
router.post("/verifyPayment", VerifyPayment);
export default router;