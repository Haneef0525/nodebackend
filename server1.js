const http = require("http");
const url = require("url");
const fs = require("fs");
const {MongoClient, ObjectId} = require("mongodb");
const { log } = require("console");

const server = http.createServer(async(req,res)=>{
    const path = url.parse(req.url).pathname;

    const client = new MongoClient("mongodb://127.0.0.1:27017/");
    const db = await client.db("NodeDBJS");
    const collections = await db.collection("user");

    if(path =="/"){
        res.writeHead(200,{"content-type":"text/html"});
        res.end(fs.readFileSync("./index.html"));
    }else if(path=="/about"){
        res.writeHead(200,{"content-type":"text/html"});
        res.end(fs.readFileSync("./about.html")); 
        
    }else if (path=="/style") {
        res.writeHead(200,{"content-type":"text/css"});
        res.end(fs.readFileSync("./style.css")); 
    }

if(path=="/register"&& req.method == "POST"){
    let body="";
    req.on ("data",(chunks)=>{
        body+=chunks.toString();
    });

    req.on("end",async() =>{
        const obj = JSON.parse(body);
        console.log(obj);
        

     const data = await collections.insertOne(obj);
     if(data){
        res.writeHead(201,{"content-type":"text/plain"});
        res.end("data created successfully hurreeeiii");
     } else{
         res.writeHead(500,{"content-type":"text/plain"});
        res.end("not successfully ayyoooiii");
     }  
    });
}
if (path == "/getalldata" && req.method == "GET"){
    const data = await collections.find().toArray();

    if(data){
        res.writeHead(200,{"content-type":"text/json"});
        res.end(JSON.stringify(data));
     } else{
         res.writeHead(404,{"content-type":"text/plain"});
        res.end("data not found");
     }  

}
if(path=="/updatedata"&& req.method == "PUT"){
    let body="";
    req.on ("data",(chunks)=>{
        body+=chunks.toString();
    });

    req.on("end",async() =>{
        const obj = JSON.parse(body);
        console.log(obj);
        

     const data = await collections.updateOne(
         {_id: new ObjectId(obj.id)},
        {
            $set: {
                email: obj.email,
                password: obj.password,
            },
        },
    );
     if(data){
        res.writeHead(200,{"content-type":"text/plain"});
        res.end("data created successfully hurreeeiii");
     } else{
         res.writeHead(500,{"content-type":"text/plain"});
        res.end("not successfully ayyoooiii");
     }  
    });
}

if(path=="/deletedata"&& req.method == "DELETE"){
    let body="";
    req.on ("data",(chunks)=>{
        body+=chunks.toString();
    });

    req.on("end",async() =>{
        const obj = JSON.parse(body);
        console.log(obj);
        

     const data = await collections.deleteOne(
        {_id: new ObjectId(obj.id)});
     if(data){
        res.writeHead(200,{"content-type":"text/plain"});
        res.end("data created successfully hurreeeiii");
     } else{
         res.writeHead(500,{"content-type":"text/plain"});
        res.end("not successfully ayyoooiii");
     }  
    });
}

});
server.listen(4444,()=>{
    
    console.log("server created at http://localhost:4444/");
    
});