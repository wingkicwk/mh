const express = require('express')

const app = express()

app.use(express.static('frontend'))

// Middleware to parse JSON request body
app.use(express.json())

// Define API endpoint
app.post('/api/savings', async (req, res) => {
  try {
    // Extract user input from request body
    const { target, monthlyIncome, monthlySpending, curSaving } = req.body

    // calculae time needed to save up
    const monthlyNetSaving = monthlyIncome - monthlySpending
    const remaining = target - curSaving
    const timeNeeded = remaining / monthlyNetSaving

    // Return response as JSON
    res.status(200).json({
      timeNeeded,
      target,
      remaining
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
})

// Start the server
const port = process.env.PORT || 8383
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
