require('dotenv').config();         //----- MUST be at the top of file (based on dotenv documentation)
var express= require("express");
var bodyParser= require("body-parser");
var request= require("request");

var app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); //provides path to static files like css stylesheet

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    var firstName= req.body.first;  //based off name given in html form
    var lastName= req.body.last;
    var email= req.body.email;
    var data= {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }
    var jsonData= JSON.stringify(data);

    var options= {
        url: "https://us4.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID,
        method: "POST",
        headers: {    //---IMPORTANT step for authorization/identification with server
            "Authorization": process.env.KEY + " " + process.env.API_KEY
        },
        body: jsonData
    };

    request(options, function(error, response, body) {
        if (error) {
            res.sendFile(__dirname + "/failure.html");
            console.log(error);
        } else {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        }
    });
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});





app.listen(process.env.PORT || 3000, function() {
    console.log("server has started");
}); 
