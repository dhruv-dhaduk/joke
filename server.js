const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((req, res) => {
    res.statusCode = 200;

    if (req.url == "/") {
        res.setHeader("Content-Type", "text/html");

        fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
            if (err) {
                res.setHeader("Content-Type", "text/plain");
                res.end("Error occured while fetching the file.");
            } else {
                res.end(data);
            }
        });
    } else if (req.url == "/random") {
        res.setHeader("Content-Type", "application/json");
        const jsonData = {};

        getRandomJoke()
            .then((joke) => {
                if (joke !== null) jsonData.joke = joke;
                res.end(JSON.stringify(jsonData));
            })
            .catch((err) => {
                res.end(JSON.stringify(jsonData));
            });
    } else {
        res.setHeader("Content-Type", "text/plain");
        res.end("Invalid path in URL");
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on PORT : ${PORT}`);
});

async function getRandomJoke() {
    const response = await fetch("https://v2.jokeapi.dev/joke/Any");
    const json = await response.json();

    if (json.type === "single") return json.joke;
    else if (json.type === "twopart") return `${json.setup}\n${json.delivery}`;
    else return null;
}
