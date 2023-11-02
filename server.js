const express = require('express');
const app = express();
const morgan = require("morgan");
const PORT = 8000

//body passing middleware
// this one use qs(Query String) library to parse the data
//it can pass nested obj within the form data. it is useful when you
//have form fields with [] indicating nested data
app.use(express.urlencoded({extended:true}));
//app.request(express.urlencoded({extended:false}));
// when extended: false, it only parses simple data structures and
// does not support nested obj or complex data
app.use(express.json())

//API Routes
app.use('/api', require('./api'));

// app.use('/',(req,res)=>{
//     res.redirect("/api")
// })

// error handling middleware
app.use((err,req,res,next) => {
    const status2 = err.status ?? 500;
    const message = err.message ?? 'internal server error'

    res.status(status2).json(message);
});

app.listen(PORT, ()=>{
    console.log(`server listening on ${PORT}`)
})