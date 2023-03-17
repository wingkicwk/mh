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
    input == monthlyIncomeInput &&
    parseFloat(value.replace(/,/g, '')) <=
      parseFloat(monthlySpendingInput.value.replace(/,/g, ''))
  ) {
    errorMessage = 'Monthly income must be greater than monthly spending.'
  } else if (
    input == monthlySpendingInput &&
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
