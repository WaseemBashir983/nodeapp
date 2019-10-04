const express = require('express');
const hbs = require('hbs');
const path = require('path');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const publicPath = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, '../views/partials');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

app.use(express.static(publicPath));

app.get('', function(req, res) {
    res.render('index', {
        title: 'Weather App'
    });
})

app.get('/help', function(req, res) {
    res.render('help', {
        title: 'Help'
    });
})


app.get('/about', function(req, res) {
    res.render('about', {
        title: 'Waseem bashir'
    });
})

app.get('/weather', function(req, res) {
    if (!req.query.address) {
        res.render('weather', {
            error: 'Please Provide Address',
            title: 'weather'
        });
        return
    }

    geocode(req.query.address, (error, { latitude, longitude, location }) => {
        if (error) {
            res.render('weather', {
                error,
                title: 'weather'
            });
            return
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                res.render('weather', {
                    error,
                    title: 'weather'
                });
                return
            }

            res.render('weather', {
                forcaset: forecastData,
                location: req.query.address,
                title: 'weather'
            });

        })

    })

    // res.render('weather', {
    //     forcaset: 'Raining',
    //     location: req.query.address,
    //     title: 'weather'
    // });


})


app.get('*', function(req, res) {
    res.render('404', {
        title: 'Waseem bashir'
    });
})

app.listen(port, () => {
    console.log('App is up and running');
});