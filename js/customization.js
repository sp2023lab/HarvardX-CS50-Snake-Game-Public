document.getElementById('saveButton').addEventListener('click', function () {
    const snakeColor = document.getElementById('snakeColor').value;
    const foodColor = document.getElementById('foodColor').value;
    const backgroundColor = document.getElementById('backgroundColor').value;
    const powerupColor = document.getElementById('powerupColor').value;

    // Save customization to localStorage
    localStorage.setItem('snakeColor', snakeColor);
    localStorage.setItem('foodColor', foodColor);
    localStorage.setItem('backgroundColor', backgroundColor);
    localStorage.setItem('powerupColor', powerupColor);

    alert('Settings and customization saved!'); // Optional confirmation
});

document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = 'popup.html'; // Redirect back to the game page
});
