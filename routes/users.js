const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/userController");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/addApp", userCtrl.userAddApp);
router.post("/delUserApp", userCtrl.delUserApp);
router.post("/emailSendApp", userCtrl.emailSendApp);
router.post("/forgotPasswordApp", userCtrl.forgotPasswordApp);
module.exports = router;
