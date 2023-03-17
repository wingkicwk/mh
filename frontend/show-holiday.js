const holidayResult = document.getElementById('holidayResult');
const baseUrl = 'http://127.0.0.1:8383';
document.addEventListener("DOMContentLoaded", function (event) {
    const holidayUrl = `${baseUrl}/api/showCalendar`;
    fetch(holidayUrl, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
    })
    .then(response => response.json())
    .then(data => {
    if(data[0].date > 0){
        holidayResult.textContent = `Till next holiday ${data[0].summary} is ${data[0].date} days left`;
    }else{
        holidayResult.textContent = `Today is ${data[0].summary}`;
    }
    })
    .catch(error => console.error('Error:', error));
});
