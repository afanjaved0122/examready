

const express = require("express");
const multer = require("multer");
const {  importMcqsFromXlsx, getSubjectMcqs, deleteAllMcqs, getAllMcqs } = require("../Controller/mcqsController");
const { signUp, signIn, tokenVerification } = require("../Controller/AuthController");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

//Auth
router.post('/signUp',signUp)
router.post('/signIn',signIn)
router.post('/tokenVerification',tokenVerification)


//MCQS 
router.post("/import-xlsx", upload.single("file"), importMcqsFromXlsx);
router.post('/getSubject',getSubjectMcqs)
router.delete('/deleteData',deleteAllMcqs)
router.get('/getAllMcqs' , getAllMcqs)




module.exports = router;

