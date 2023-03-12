const express = require('express');

const app = express();

// Middleware to parse JSON request body
app.use(express.json());

app.get('/', function (req, res) {
    res.send("hello world!");
})
// Define API endpoint
app.post('/api/savings', async (req, res) => {
    try {

        // Extract user input from request body
        const { target, monthlyIncome, mothlySpending, curSaving } = req.body;

        //calculae time needed to save up
        const mothlyNetSaving = monthlyIncome - mothlySpending;
        const remaining = target - curSaving;
        const timeNeeded = (target - curSaving) / mothlyNetSaving;

        // Return response as JSON
        res.status(200).json({
            timeNeeded,
            mothlyNetSaving,
            remaining
        })
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


//Api to count how many days to the next public holiday
app.get('/api/showCalendar', async function(req, res){
    try {
        // const t = await getHoliday();
        // console.log(t);
        const t = filterCurrentYearHoliday()
        res.send(t);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});


//get holidays from google calandar API, however the return JSON not only contains current year holidays 
async function getHoliday(){
    const BASE_CALENDAR_URL = "https://www.googleapis.com/calendar/v3/calendars";
    const BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY =
      "holiday@group.v.calendar.google.com"; // Calendar Id. This is public but apparently not documented anywhere officialy.
    const API_KEY = "AIzaSyBg0IiUjXv79hXM_V5aYxKAd6erKPPYvCU";
    const CALENDAR_REGION = "en.irish"; // This variable refers to region whose holidays do we need to fetch

    const url = `${BASE_CALENDAR_URL}/${CALENDAR_REGION}%23${BASE_CALENDAR_ID_FOR_PUBLIC_HOLIDAY}/events?key=${API_KEY}`

    const response = await fetch(url);
    const data = await response.json();
    const holidays = data.items;
    return holidays;
}

//filter the holidays to get only current year holiday
async function filterCurrentYearHoliday(){
    const holidays = await getHoliday();
   
    var holidaysAndDate = [];
    for(var i in holidays){
        var singleItem = holidays[i];
        holidaysAndDate.push({ 
            "summary" : singleItem.summary,
            "time"  : singleItem.start.date,
        });
    }
    
    const currentYear = new Date().getFullYear()  // returns the current year
}





// Start the server
const port = process.env.PORT || 8383;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});