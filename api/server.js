"use strict";

var path = require("path"),
    bodyParser = require("body-parser"),
    cors = require('cors'),
    express = require("express");
var driveApi = require("./driveApi");

    
const app = express();
const port = process.env.PORT || 3000;
    
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/drive", driveApi);

app.listen(port, function(err) {
    if (err) {
        console.error(err);
        return;
    }

    console.log("Server running on port " + port);
});