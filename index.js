import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

var userlist=[];
var pwdlist=[];

var app=express();
const port=3000 || process.env.PORT;

fs.readFile("info.txt","utf-8",(err,data)=>{
     if (err) throw err;
    var lines=data.split("\n");
    for(var i=0;i<lines.length;i++){
        var [user,pass]=lines[i].split(" ");
        userlist.push(user);
        pwdlist.push(pass);
    }
})

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/public/index.html");
});

app.post("/signup",(req,res)=>{
        for(var i=0;i<userlist.length;i++){
            if(req.body.username===userlist[i]){
                res.sendFile(__dirname+"/public/userExists.html");
                return;
            }
        }
        fs.appendFile("info.txt",req.body.username+" "+req.body.password+"\n",(err)=>{
            if (err) throw err;
            userlist.push(req.body.username);
            pwdlist.push(req.body.password);
            console.log("saved successfully");
        });
        console.log(req.body);
        res.sendFile(__dirname+"/public/login.html");
});

app.post("/login",(req,res)=>{
    for(var i=0;i<userlist.length;i++){
        if(req.body.username===userlist[i]){
            if(req.body.password===pwdlist[i]){
                res.send("welcome "+req.body.username);
            }
            else{
                res.sendFile(__dirname+"/public/pwdnotfound.html");
            }
            return;
        }
    }
    res.sendFile(__dirname+"/public/usernotfound.html");
});

app.listen(port,()=>{
    console.log("server running on port "+port);
});