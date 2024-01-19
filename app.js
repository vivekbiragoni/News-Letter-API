
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const secrets = require("./secrets");

// new instance of express
const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
  res.sendFile(__dirname +"/signup.html");
});

app.post("/", function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    
    'members':[
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ],
  }
  var jsonData = JSON.stringify(data)

  console.log(firstName, lastName, email);


var jsonData = JSON.stringify(data);
const url = "https://us21.api.mailchimp.com/3.0/lists/"+secrets["list-id"];

const options = {
  method:"POST",
  auth:"vivek:" + secrets["api-key"]
}

const request = https.request(url, options, function(response){
  if (response.statusCode === 200){
    res.sendFile(__dirname + "/success.html");
    
  }else {
    res.sendFile(__dirname + "/failure.html");

  }
})

request.write(jsonData);
request.end();
});


app.post("/failure", function (req, res){
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
console.log("Server is running in port 3000")
});