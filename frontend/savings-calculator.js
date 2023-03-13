
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

const result = document.getElementById('result');

submitBtn.addEventListener('click', (event) => {
    event.preventDefault(); // to prevent default action so can define own event behavior

    clearResultAndError()

    // only submit if all inputs are valid
    if (isAllInputsValid()) {
        const data = {
            target: targetInput.value,
            monthlyIncome: monthlyIncomeInput.value,
            monthlySpending: monthlySpendingInput.value,
            curSaving: curSavingInput.value
        };
        submitData(data);
    }
});


function submitData(data) {
    fetch(baseUrl + "/api/savings", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            result.textContent = `You will need ${data.timeNeeded} more month(s) to save up to your target of ${data.target}. Remaining amount to save up is $ ${data.remaining}. `;
        })
        .catch(error => console.error('Error:', error));
}