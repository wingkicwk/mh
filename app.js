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

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});