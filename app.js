require('dotenv').config()
const express= require('express');
const md5 = require('md5');
const bodyparser=require('body-parser');
const ejs=require('ejs');
const app=express();
const mongoose= require('mongoose')
const encrypt=require('mongoose-encryption')
mongoose.connect('mongodb://localhost/userDB', {useNewUrlParser: true,useUnifiedTopology: true});

app.use(bodyparser.urlencoded({extended:false}))
app.use(express.static('public'))
app.set('view engine','ejs')

const userSchema=new mongoose.Schema(
    {
        username:String,
        password:String
    })

    //collection 
const User=mongoose.model("User",userSchema)
app.get('/',function(req, res)
{
    res.render("home");
})
app.get('/register',function(req, res)
{
    res.render("register");
})
app.get('/login',function(req, res)
{
    res.render("login");
});
app.post('/register',function(req, res)
{   
    const uname=req.body.username;
    const pass=md5(req.body.password);
    const newUser= new User({
        username:uname,
        password:pass
    })
    newUser.save(function(err,results)
    {
        if(!err)
        {
            res.render('secrets');
        }
        else
        {
            console.log(err);
        }
    })

})
app.post('/login', function(req, res)
{
    const uname=req.body.username;
    const pass=req.body.password
    User.findOne({username:uname},function(err,results)
    {
        if(!err)
        {
            if(results.password===pass)
            {
                res.render("secrets")
                console.log("secrets rendered");
            }
            else
            {
                res.send("passowrd incorrect")
            }
        }
    })
    
})


app.listen("3000", function(req, res)
{
    console.log("server is running");
})