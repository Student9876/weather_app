const express = require("express")
const https = require("https")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const { dir } = require("console")

const app = express()
dotenv.config()

// this code serves the statuc files like css and js files
app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true }))

// const server = https.createServer((req, res) => {
//     if (req.url == "/") {
//         return setHomePage(req, res);
//     }
// });

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})
app.post("/", function (req, res) {
    const query = req.body.cityName
    const appID = process.env.API_KEY
    const units = "metric"
    const url =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        query +
        "&appid=" +
        appID +
        "&units=" +
        units
    https.get(url, function (response) {
        // checking the statuscode for error or to redirect to result website
        if (response.statusCode == 200) {
            response.on("data", function (data) {
                const weatherData = JSON.parse(data)
                const temp = weatherData.main.temp
                const weatherDescription = weatherData.weather[0].description
                const icon = weatherData.weather[0].icon
                const iconUrl =
                    "http://openweathermap.org/img/wn/" + icon + ".png"

                res.write(
                    `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css">
                <link rel="stylesheet" href="styles2.css">
                <title>Result</title>
                </head>
                <body>
                <div class="jumbotron">
                <h1 class="display-4">Weather report!</h1>
                <hr class= "my-4"> 
                <p>The temperature in <strong>` +
                        query +
                        `</strong> is <em><u> ` +
                        temp +
                        `</u></em> degrees Celcius.</p> <p>The weather is currently <strong>` +
                        weatherDescription +
                        `</strong></p>
                <img src="` +
                        iconUrl +
                        `" width="70" height="70"> </div >
                <form action="/re" method="post">
                    <button class="btn btn-lg btn-primary" type="submit"
                        name="button">Start again </button>
                </form>       
                </body>
                </html>`
                )
                res.send()
                // We can have multiple "res.write" is a single app method
                // res.write("<div class=" + "jumbotron>" + "<h1 class=" + "display-4>" + "Weather report!</h1>" + "<hr class=" + "my-4>");
                // res.write(" <p>The temperature in " + query + " is " + temp + " degrees Celcius.</p>");
                // res.write("<p>The weather is currently " + weatherDescription + "</p>" + "<img src=" + iconUrl + " width=" + 70 + " height=" + 70 + ">" + " </div>");
                // res.send();
            })
        } else {
            res.sendFile(__dirname + "/pages/failure.html")
        }
    })
})

app.post("/re", function (req, res) {
    res.redirect("/")
})

app.post("/failure", function (req, res) {
    res.redirect("/")
})

// default port for local hosting : 3000
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port " + process.env.PORT)
})
