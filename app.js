const express = require("express")
const https = require("https")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")

const app = express()
dotenv.config()

// this code serves the statuc files like css and js files
app.use(express.static("public"))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))


app.get("/", function (req, res) {
    res.render("index")
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
                const place = weatherData.name
                const lat = weatherData.coord.lat;
                const lon = weatherData.coord.lon;
                const weatherDescription = weatherData.weather[0].description
                const icon = weatherData.weather[0].icon
                const iconUrl =
                    "http://openweathermap.org/img/wn/" + icon + ".png"


                res.render("result", {
                    place: place,
                    latitude: lat,
                    longitude: lon,
                    temp: temp,
                    description: weatherDescription,
                    iconUrl: iconUrl
                })
            })
        } else {
            res.render('failure')
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
