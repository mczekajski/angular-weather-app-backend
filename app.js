// Imports
require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const rateLimit = require("express-rate-limit");
var cors = require("cors");
const app = express();
let port = process.env.PORT || 80;

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.set('trust proxy', 1);

// Rate limiting 
const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1, // limit each IP to 1 requests per windowMs
});

// //  apply to all requests
app.use(limiter);

// Allow CORS from any origin
app.use(cors());

// Routes

// Test route
app.get("/", (req, res) => res.send("Angular-Weather-App-Backend is working!"));

// Weather route
app.get("/api/city", async (req, res) => {
  try {
    const searchString = `q=${req.query.q}`;
  
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?${searchString}&appid=${process.env.WEATHER_API_KEY}&lang=en`
    );
    const results = await response.json();

    return res.json({
      success: true,
      results,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
