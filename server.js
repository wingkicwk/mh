const express = require('express');

const app = express();

app.use(express.static('frontend'));

// Middleware to parse JSON request body
app.use(express.json());

// Define API endpoint
app.post('/api/savings', async (req, res) => {
    try {
        // Extract user input from request body
        const { target, monthlyIncome, monthlySpending, curSaving } = req.body;

        //calculae time needed to save up
        const monthlyNetSaving = monthlyIncome - monthlySpending;
        const remaining = target - curSaving;
        const timeNeeded = remaining / monthlyNetSaving;

        // Return response as JSON
        res.status(200).json({
            timeNeeded,
            target,
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
        const t = await calculateDateToNextHoliday()
        console.log(t);
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

//filter the holidays to get only current year holidays with only holiday time and name information
async function filterCurrentYearHoliday(){
    const holidays = await getHoliday();
    const currentYear = new Date().getFullYear()  // returns the current year
   
    var holidaysAndDate = [];   
    for(var i in holidays){
        var singleItem = holidays[i];
        var summay = singleItem.summary;
        var time = singleItem.start.date;
        var timeToCompare = time.split('-')[0];

        if(timeToCompare == currentYear){ //add holidays only within current year
            holidaysAndDate.push({   //if the holidays are current years', add the name and time into the result
                "summary" : summay,
                "time"  : time,
            });
            if(summay == "New Year's Eve"){
                break;
            }
        }
    }
    return holidaysAndDate;
}


//calculate how many days between next holiday and current date
async function calculateDateToNextHoliday(){
    const holidays = await filterCurrentYearHoliday();
    const currentDate = new Date().toISOString().slice(0, 10);
    const res = [];

    for(let i= holidays.length-1; i>0 ; i--){
        var singleHoliday = holidays[i];
        var singleHolidayTime = singleHoliday.time;
        var dateNumber = 0;

        const currentDateParse = Date.parse(currentDate);
        const singleHolidayTimeParse = Date.parse(singleHolidayTime);
        const preHolidayParse = Date.parse(holidays[i-1].time)

        if(singleHolidayTimeParse == currentDateParse || (singleHolidayTimeParse>currentDateParse && preHolidayParse < currentDateParse)){
            dateNumber = (singleHolidayTimeParse - currentDateParse)/(1000 * 3600 * 24);
            res.push({
                "summary" : singleHoliday.summary,
                "time"  : singleHoliday.time,
                "date" : dateNumber,
            })
        }
    }
    return res;
}



// Start the server
const port = process.env.PORT || 8383;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});