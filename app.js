const express = require("express");
const app=express();
const path=require("path");

const http=require("http");
const socketio=require("socket.io");//runs on http and it establishes a bidirectional connection between server and client
 

const server=http.createServer(app);// this creates server

const io=socketio(server);

app.set("view engine","ejs");//to use EJS as the tool to create and show web pages to users.
app.use(express.static(path.join(__dirname,"public")));//to use the public folder to store static files like images, CSS, and JavaScript files.

io.on("connection", function (socket) {//to establish a connection between server and client
    socket.on("send-location", function (data) {//to get the location of the user
        io.emit("receive-location",{ id: socket.id, ...data });//to send the location of the user to all the users
    });
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id);//to emit the event when the user is disconnected
    })
});

app.get("/",function(req,res){
    res.render("index");//to render index page
});
server.listen(3001);
