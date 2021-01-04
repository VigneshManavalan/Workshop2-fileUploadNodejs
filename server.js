const express = require("express") 
const path = require("path") 
const fs = require('fs');
const multer = require("multer") 
const methodOverride = require("method-override")
const app = express() 
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(methodOverride('_method'))       
app.set("views",path.join(__dirname,"views")) 
app.set("view engine","ejs") 

    
var storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 

        cb(null, "files") 
    }, 
    filename: function (req, file, cb) { 
        const id = Date.now()+".jpg"
      cb(null,id) 
    } 
  }) 

const maxSize = 1 * 1000 * 1000; 
    
var upload = multer({  
    storage: storage, 
    limits: { fileSize: maxSize }, 
    fileFilter: function (req, file, cb){ 

        var filetypes = /jpeg|jpg|png/; 
        var mimetype = filetypes.test(file.mimetype); 
  
        var extname = filetypes.test(path.extname( 
                    file.originalname).toLowerCase()); 
        
        if (mimetype && extname) { 
            return cb(null, true); 
        } 
      
        cb("Invalid File Type, upload only- " + filetypes); 
      }  

}).single("fileToUpload");        
  
app.get("/",function(req,res){ 
    res.render("fileUpload"); 
}) 
    
app.put("/uploadFile",function (req, res, next) { 
        

    upload(req,res,function(err) { 
  
        if(err) { 
            res.send(err) 
        } 
        else { 
            res.send(Date.now()+".jpg") 
        } 
    }) 
}) 
app.delete("/file",(req,res)=>{
    try{
    let filePath =path.join(__dirname,"files",req.body.fileId+".jpg"); 
    fs.unlinkSync(filePath);
    res.send("Deleted")}
    catch(err){
        res.send("ERROR ! Such file does not exist")
    }
})
app.post("/file",(req,res)=>{
    try
    {
    let filePath =path.join(__dirname,"files",req.body.fileId+".jpg"); 
    let newFilePath =path.join(__dirname,"files",req.body.newFileId+".jpg"); 
    fs.rename(filePath, newFilePath, function(err) {
        res.send("ERROR ! Such file does not exist")
    });
    res.send("Renamed !")
    }
    catch(err){
        res.send("ERROR ! Such file does not exist")
    }
})
app.listen(8080,function(error) { 
    if(error) throw error 
        console.log("Server created Successfully on PORT 8080") 
}) 