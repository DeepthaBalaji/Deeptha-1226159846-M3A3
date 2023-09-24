const express = require('express');

const app = express();
const students = []; // array of students objects acting as storage

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const makeUpperCase = (req, res, next) => {
    const student = req.body;
    if (req.body.fname == undefined || req.body.mname == undefined || req.body.lname == undefined) {
        return res.send("Please enter a valid names");
    }

    req.body.fname = student.fname.toUpperCase();
    req.body.mname = student.mname.toUpperCase();
    req.body.lname = student.lname.toUpperCase();
    next();

}
//Authentication middleware
const checkAdmin = (req, res, next) => {
    if(req.query.admin === 'true') {
        next();
    } else {
        res.status(400).send('Should be admin');
    }
}
app.use(makeUpperCase);

const getSpecificStudent = (req, res) => {
    const id = req.params.id;

    const currentStudent = students.find(student => student.id === id);
    if(currentStudent == undefined){
        res.send(`Student with the ${id} is not found`);
    }
    res.send(`Student with the ${id} is ${currentStudent.fname} ${currentStudent.lname}`);
}

const getStudents = (req, res) => {
    res.send(students);
}

const addStudent = (req, res) => {
    const student = req.body;
    students.push(student);
    res.send(`Student with the name ${student.fname} ${student.mname} ${student.lname} is added to the database`);
}

const updateStudent = (req, res) => {
    const id = req.params.id;
    const student = req.body;
    students[id] = student;
    res.send(`Student with the id ${id} has been updated.`);
}

const deleteStudent = (req, res) => {
    const id = req.params.id;
    students.splice(id, 1);
    res.send(`Student with the id ${id} has been deleted.`);
}

app.get('/students/:id', checkAdmin, getSpecificStudent);
app.get('/students', getStudents); // get all students function
app.post('/students', addStudent); // add student function

app.put('/students/:id', updateStudent); // update student function
app.delete("/students/:id",checkAdmin, deleteStudent); // delete student function
app.use('/*', function(req, res, next) {
    console.log('Request Url:' + req.url);
    res.send("Hello");
});

app.listen(3200, () => {
    console.log('Server is running on port 3200');
});

