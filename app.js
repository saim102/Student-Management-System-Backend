const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch((error) => {
        console.log("Connection Failed: ", error);
    });

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`)
    })

// Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    course: String
});

// Student Model
const Student = mongoose.model("Student", studentSchema);


// ==================== CREATE STUDENT ====================
app.post("/student", async (req, res) => {
    try {
        const newStudent = new Student({
            name: req.body.name,
            email: req.body.email,
            course: req.body.course
        });

        const saveStudent = await newStudent.save();

        res.status(201).json(saveStudent);
    } catch (error) {
        res.status(500).json({
            message: "Student creation failed",
            error: error.message
        });
    }
});


// ==================== READ STUDENTS ====================
app.get("/student", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message
        });
    }
});


// ==================== UPDATE STUDENT ====================
app.put("/student/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                course: req.body.course
            },
            {
                new: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not Found!"
            });
        }

        res.json(student);

    } catch (error) {
        res.status(500).json({
            message: "Student update failed",
            error: error.message
        });
    }
});


// ==================== DELETE STUDENT ====================
app.delete("/student/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not Found!"
            });
        }

        res.json({
            message: "Student Deleted Successfully!",
            student: student
        });

    } catch (error) {
        res.status(500).json({
            message: "Student deletion failed",
            error: error.message
        });
    }
});


// ==================== START SERVER ====================
app.listen(process.env.PORT, () => {
    console.log(`Server running on: ${process.env.PORT}`);
});