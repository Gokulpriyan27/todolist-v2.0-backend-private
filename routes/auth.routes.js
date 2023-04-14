const express = require("express");
const router = express.Router();

const {register,login,forgetPassword,verifyandUpdatePassword} =  require("../controllers/auth.controller")

router.post("/register",register);
router.post("/login",login);
router.post("/forgetpassword",forgetPassword);
router.post("/changepassword",verifyandUpdatePassword);

module.exports = router;