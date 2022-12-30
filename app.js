const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));
app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    //creating json object from the inputs
    const data ={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
   
    //Request constant data
    const url = "https://us21.api.mailchimp.com/3.0/lists/a7fd89b452";
    const options = {
        method: "POST",
        auth: "russell1:99bd5084fbd0d2dafb76756d2eac2c63-us21"
    }
    
    // Request to the mailchimp server
    const request = https.request(url, options, function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
       if(response.statusCode == 200) {
        res.sendFile(__dirname + "/success.html");
       } else {
        res.sendFile(__dirname + "/failure.html");
       }
    });

    //Sending the data to server
    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
})




app.listen(process.env.PORT || 3000,function(){
    console.log("Server Running on Port 3000.")
})