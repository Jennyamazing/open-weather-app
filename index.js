const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3006;
const API_KEY = 'a061376bf49f3182bfa7a0d9f223c850';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/get-weather', async (req, res) => {
    const city = req.body.city;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await axios.get(url);
        const data = response.data;

        if (!data || data.cod !== 200) {
            res.send("City not found!");
            return;
        }
        res.render('weather.ejs', { data });
    } catch (error) {
        console.error("Error fetching weather:", error);
        res.send("Error fetching weather!");
    }
});

app.post('/select-country', async (req, res) => {
    const city = req.body.city;
    const country = req.body.country;
    const url = `http://api.openweathermap.org/data/2.5/find?q=${city},${country}&appid=${API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);
        const cities = response.data.list;

        if (!Array.isArray(cities) || cities.length === 0) {
            throw new Error("City list is empty or not an array!");
        }

        res.render('select.ejs', { city, cities });
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.send("City not found!");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
