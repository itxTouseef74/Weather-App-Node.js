const http = require("http");
const fs = require("fs");
const requests = require("requests");
const PORT = 7000;

const weatherTemplate = fs.readFileSync("weather.html", 'utf8');
 const replaceVal = (tempVal, orgVal) => {
        let temperature = tempVal.replace("{%tempval%}", `${(orgVal.main.temp - 273.15).toFixed(2)}°C`);
        temperature = temperature.replace("{%tempmin%}", `${(orgVal.main.temp_min - 273.15).toFixed(2)}°C`);
        temperature = temperature.replace("{%tempmax%}", `${(orgVal.main.temp_max - 273.15).toFixed(2)}°C`);
        temperature = temperature.replace("{%location%}", orgVal.name);
        temperature = temperature.replace("{%country%}", orgVal.sys.country);
        return temperature;
    }
    

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Bahawalpur&appid=e243762de30ee439a49d7977894e8673")
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const realTimeData = replaceVal(weatherTemplate, objData) ;
                console.log(realTimeData);
               res.end(realTimeData);
            })
            .on('end', () => {
                console.log('Request completed.');
            })
            .on('error', (err) => {
                console.log('Connection closed due to errors', err);
              
            });
    }
});

server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
