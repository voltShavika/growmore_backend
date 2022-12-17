const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const connectDB = require("./db.js");
const UserRouter = require("./routers/user.router");
const QuestionRouter = require("./routers/question.router");
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use("/users", UserRouter);
app.use("/questions",QuestionRouter);

app.use((err, req, res, next) => {
    const code = err.code || 500;
    res.status(code).json({
        msg: err.msg,
        errors: err.errors
    })
    return;
});


const port = process.env.PORT || 8000;
app.listen(port,()=>{
  console.log("i am listening");
});
