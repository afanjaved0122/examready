const XLSX = require("xlsx");
const fs = require("fs");
const mongoose = require("mongoose");
const mcqsData = require('../Model/mcqsModel')

const importMcqsFromXlsx = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        status: "error",
        message: "No file uploaded. Please upload an XLSX file.",
      });
    }
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const mcqs = data.map((row) => (
      {
        question: row.Question,
        optionA: row.OptionA,
        optionB: row.OptionB,
        optionC: row.OptionC,
        optionD: row.OptionD,
        answer: row.Answer,
        subject: row.Subject,
        topic: row.Topic,
        difficulty: row.Difficulty,
      }));
    const savedMcqs = await mcqsData.create({ mcqs })

    res.status(201).send({
      status: "success",
      message: "MCQs imported successfully",
      data: savedMcqs,
    });
  } catch (error) {
    console.error("Error importing MCQs:", error);

    res.status(500).send({
      status: "error",
      message: "Failed to import MCQs",
      error: error.message,
    });
  }
};

const getAllMcqs = async (req, res) => {
  try {
    const { subject } = req.query; // Get subject from query params (e.g., ?subject=Math)

    const filter = subject ? { subject } : {}; // Apply filter only if subject is provided
    const mcqs = await mcqsData.find(filter);

    res.status(200).send({
      status: "success",
      data: mcqs,
    });
  } catch (error) {
    console.error("Error fetching MCQs:", error);

    res.status(500).send({
      status: "error",
      message: "Failed to fetch MCQs",
      error: error.message,
    });
  }
};


const getSubjectMcqs = async (req, res) => {
  try {
    const { subject } = req.body;

    console.log(subject, 'subject');

    if (!subject) {
      return res.status(400).send({
        status: "400",
        message: "Subject parameter is required",
      });
    }

    const mcqsData1 = await mcqsData.findOne(); 
    console.log(mcqsData1.mcqs , 'mcqsData')

    const data = mcqsData1.mcqs

    const filteredMcqs = data.filter(mcq => mcq.subject.toLowerCase() === subject.toLowerCase());
    console.log(filteredMcqs , 'filteredMcqs')

    if (filteredMcqs.length === 0) {
      return res.status(400).send({
        status: "400",
        message: "No MCQs found for the given subject",
      });
    }

    res.status(200).send({
      status: "200",
      data: filteredMcqs,
    });

  } catch (error) {
    console.error("Error fetching subject MCQs:", error);

    res.status(500).send({
      status: "500",
      message: "Failed to fetch MCQs",
      error: error.message,
    });
  }
};

const deleteAllMcqs = async (req, res) => {
  try {

    const collections = await mongoose.connection.db.listCollections().toArray();

    console.log(collections, 'collections')
    const collectionExists = collections.some(col => col.name === "mcqs");

    if (collectionExists) {
      await mcqsData.collection.drop();
      res.status(200).json({ message: "MCQs collection deleted successfully" });
    } else {
      res.status(404).json({ message: "MCQs collection does not exist" });
    }
  } catch (error) {
    console.error("Error deleting MCQs collection:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { importMcqsFromXlsx, getSubjectMcqs, deleteAllMcqs, getAllMcqs };
