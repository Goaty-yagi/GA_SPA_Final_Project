const express = require("express")
const path = require("path")
const port = process.env.PORT || 5000

const app = express()

// middleware to read static file
app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")))


app.get("/*", (req, res) => {
    res.sendFile(path.resolve("frontend", "index.html")) //like FS
    console.log("API",req.url)
})

app.listen(port, () => console.log("server is listenning"))