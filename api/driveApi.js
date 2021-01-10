"use strict";

var fs = require("fs"),
    multer = require("multer"),
    request = require("request"),
    express = require("express"),
    router = express.Router();

let clientSecret = "g1SkmGtdc6Ubk_WKEWRO7c06";
let clientId = "961383984487-nd3vhaa2qb1p99pstrsglh80opo51i7e.apps.googleusercontent.com";
let token = "";
let redirect_uri = "http://localhost:4200/upload"

var upload = multer({
    dest: "uploads/"
}).single("image");


router.post("/getToken", (req, res) => {
    // var session = req.session;
    var code = req.body.code;

    // retrieve access_token by sending authorization code
    var url = "https://www.googleapis.com/oauth2/v4/token";
    request(
        {
            uri: url,
            method: "POST",
            form: {
                code: code,
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "authorization_code",
                redirect_uri: redirect_uri,
                scope:"https://www.googleapis.com/auth/drive"
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        },
        (err, response, body) => {
            if (err) {
                console.error(err);
                res.send({success:false})

            }

            // set the access_token
            var json = JSON.parse(body);
            token = json.access_token;
            // session["tokens"] = body;
            res.send({success:true})
        }
    );
});


router.post("/upload", upload, (req, res) => {
    var file = req.file;

    // upload request
    var url = "https://www.googleapis.com/upload/drive/v3/files";
    request(
        {
            uri: url,
            qs: {
                uploadType: "multipart"
            },
            method: "POST",
            headers: {
                "Content-Type": "multipart/related",
                Authorization: "Bearer " + token
            },
            multipart: [
                {
                    "Content-Type": "application/json; charset=UTF-8",
                    body: JSON.stringify({
                        name: file.originalname
                    })
                },
                {
                    "Content-Type": file.mimetype,
                    body: fs.createReadStream(file.path)
                }
            ]
        },
        (error, response, body) => {
            if (error) {
                console.error(error);
                let result = {
                    success:true,
                    status:500,
                    errror:error
                }
                res.send(result);
             
            }

            fs.unlink(file.path,function(err){
                console.log(err);
            });

            let result = {
                success:true,
                status:200
            }
            res.send(result);
        }
    );
});

module.exports = router;