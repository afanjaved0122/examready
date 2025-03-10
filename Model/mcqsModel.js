const mongoose = require("mongoose")


const mcqsData = new mongoose.Schema({
    mcqs: {
        type: Array,
        default:[]
      },
})


module.exports = mongoose.model("mcqs",mcqsData)