var express = require("express");
var multer = require("multer");
var fs = require("fs");

var bodyParser = require("body-parser");
var app = express();

const repo = require("./repository/FileRepository");
const useme = require("./util/useme");
const { exit } = require("process");

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/upload", (req, res) => {
    res.render("upload");
});

app.get("/messenger", async (req, res) => {
    const messages = await repo.getRecords();
    res.render("messenger", { messages: useme.getMessageUiModels(messages) });
});

function getAddress(addr) {
    let arr = addr.split("::");
    return arr[arr.length - 1];
}

app.post("/messenger", urlencodedParser, async (req, res) => {
    const { message } = req.body;
    if (message) {
        const clientAddress =
            req.headers["x-forwarded-for"]?.split(",").shift() ||
            req.socket?.remoteAddress ||
            "unknown";
        const sendDate = Date();
        const addedRecord = await repo.createNewRecord({
            address: getAddress(clientAddress),
            message,
            sendDate,
        });

        console.log(`Sent message :
      ${JSON.stringify(addedRecord, null, 4)}`);
    }
    res.redirect("/messenger");
});

app.get("/send", (req, res) => {
    createAndWrite(messageFileName, "hello");
});

app.get("/list", (req, res) => {
    var files = showFiles("./uploads");
    res.render("list", { files: files });
});

app.get("/list/:name", (req, res) => {
    const file = `${__dirname}/uploads/${req.params.name}`;
    res.download(file);
});

function showFiles(foldername) {
    return fs.readdirSync(foldername);
}

function writeFile(filename, message) {
    var data = fs.readFile(filename, "utf-8");
    console.log(data);
    var newData = data + "\n" + message;
    fs.writeFileSync(filename, newData, "utf-8");
    console.log("complete");
}
function createAndWrite(filename, message) {
    fs.open(filename, "w", function (err, fd) {
        if (err) {
            fs.writeFile(filename, "", function (err) {
                if (err) {
                    console.log(err);
                }
                console.log("The file was saved!");
                writeFile(filename, message);
            });
        } else {
            console.log("The file exists!");
            writeFile(filename, message);
        }
    });
}

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = "./uploads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    },
});
var upload = multer({ storage: storage }).array("files", 12);
app.post("/upload", function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong:(");
        }
        res.redirect("/");
    });
});

app.listen(7777);
