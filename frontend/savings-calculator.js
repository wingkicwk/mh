const baseUrl = 'http://localhost:8383'

const submitBtn = document.getElementById('submit')
const targetInput = document.getElementById('targetInput')
const monthlyIncomeInput = document.getElementById('monthlyIncomeInput')
const monthlySpendingInput = document.getElementById('monthlySpendingInput')
const curSavingInput = document.getElementById('curSavingInput')

const targetError = document.getElementById('targetError')
const monthlyIncomeError = document.getElementById('monthlyIncomeError')
const monthlySpendingError = document.getElementById('monthlySpendingError')
const curSavingError = document.getElementById('curSavingError')

const result = document.getElementById('result')

function isInputValid (input, error) {
  const value = input.value.trim()
  const dataType = input.getAttribute('data-type')
  let errorMessage = ''

  if (!value) {
    errorMessage = 'This field is required.'
  } else if (dataType === 'currency' && isNaN(value.replace(/,/g, ''))) {
    errorMessage = 'Please enter a valid currency amount.'
  } else if (
    dataType === 'currency' &&
    parseFloat(value.replace(/,/g, '')) <= 0
  ) {
    errorMessage = 'Please enter an amount greater than zero.'
  } else if (
    input === monthlyIncomeInput &&
    parseFloat(value.replace(/,/g, '')) <=
      parseFloat(monthlySpendingInput.value.replace(/,/g, ''))
  ) {
    errorMessage = 'Monthly income must be greater than monthly spending.'
  } else if (
    input === monthlySpendingInput &&
    parseFloat(value.replace(/,/g, '')) >=
      parseFloat(monthlyIncomeInput.value.replace(/,/g, ''))
  ) {
    errorMessage = 'Monthly spending must be less than monthly income.'
  }

  if (errorMessage.length > 0) {
    error.textContent = errorMessage
    error.style.color = 'red'
    // set the validity state of the input to invalid
    input.setCustomValidity(errorMessage)
    return false
  } else return true
}

function isAllInputsValid () {
  let isValid = true
  const inputs = [
    targetInput,
    monthlyIncomeInput,
    monthlySpendingInput,
    curSavingInput
  ]
  const errors = [
    targetError,
    monthlyIncomeError,
    monthlySpendingError,
    curSavingError
  ]
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]
    const error = errors[i]
    if (!isInputValid(input, error)) isValid = false
  }
  // run isInputValid for all inputs before returning, so the error messages for all invalid inputs will be displayed at once
  return isValid
}

function clearResultAndError () {
  result.textContent = ''
  targetError.textContent = ''
  monthlyIncomeError.textContent = ''
  curSavingError.textContent = ''
  monthlySpendingError.textContent = ''
}

submitBtn.addEventListener('click', event => {
  event.preventDefault() // to prevent default action so can define own event behavior

  clearResultAndError()

  // only submit if all inputs are valid
  if (isAllInputsValid()) {
    const data = {
      target: targetInput.value,
      monthlyIncome: monthlyIncomeInput.value,
      monthlySpending: monthlySpendingInput.value,
      curSaving: curSavingInput.value
    }
    submitData(data)
  }
})

function submitData (data) {
  fetch(baseUrl + '/api/savings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      result.textContent = `You will need ${data.timeNeeded} more month(s) to save up to your target of ${data.target}. Remaining amount to save up is $ ${data.remaining}. `
    })
    .catch(error => console.error('Error:', error))
}
