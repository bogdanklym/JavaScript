const apiKey = ''; 
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

let isCelsius = true;

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        showLoading();
        getWeather(city);
    }
});

document.getElementById('location-btn').addEventListener('click', () => {
    showLoading();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
        });
    } else {
        alert('Geolocalización no soportada');
        hideLoading();
    }
});

document.getElementById('unit-toggle').addEventListener('click', () => {
    isCelsius = !isCelsius;
    const tempElement = document.getElementById('temperature');
    const feelsElement = document.getElementById('feels-like');
    const temp = parseFloat(tempElement.textContent);
    const feels = parseFloat(feelsElement.textContent);
    if (isCelsius) {
        tempElement.textContent = Math.round((temp - 32) * 5/9);
        feelsElement.textContent = Math.round((feels - 32) * 5/9);
        document.getElementById('unit-toggle').textContent = 'Cambiar a °F';
    } else {
        tempElement.textContent = Math.round(temp * 9/5 + 32);
        feelsElement.textContent = Math.round(feels * 9/5 + 32);
        document.getElementById('unit-toggle').textContent = 'Cambiar a °C';
    }
});

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('weather-info').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

async function getWeather(city) {
    try {
        const response = await fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric&lang=es`);
        const data = await response.json();
        if (data.cod === 200) {
            displayWeather(data);
            getForecast(data.coord.lat, data.coord.lon);
        } else {
            alert('Ciudad no encontrada');
            hideLoading();
        }
    } catch (error) {
        console.error('Error:', error);
        hideLoading();
    }
}

async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`);
        const data = await response.json();
        displayWeather(data);
        getForecast(lat, lon);
    } catch (error) {
        console.error('Error:', error);
        hideLoading();
    }
}

function displayWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('temperature').textContent = Math.round(data.main.temp);
    document.getElementById('description').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('wind-speed').textContent = data.wind.speed;
    document.getElementById('feels-like').textContent = Math.round(data.main.feels_like);
    document.getElementById('pressure').textContent = data.main.pressure;
    document.getElementById('visibility').textContent = (data.visibility / 1000).toFixed(1);
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('weather-info').style.display = 'block';
    document.getElementById('unit-toggle').textContent = 'Cambiar a °F';
    isCelsius = true;
    hideLoading();
}

async function getForecast(lat, lon) {
    try {
        const response = await fetch(`${forecastUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`);
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
    forecastContainer.classList.add('fade-in');
    const dailyForecasts = {};

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = item;
        }
    });

    Object.values(dailyForecasts).slice(0, 5).forEach((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        dayElement.style.animationDelay = `${index * 0.1}s`;
        dayElement.innerHTML = `
            <p>${new Date(day.dt * 1000).toLocaleDateString('es-ES', { weekday: 'short' })}</p>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
            <p>${Math.round(day.main.temp)}°C</p>
            <p>${day.weather[0].description}</p>
        `;
        forecastContainer.appendChild(dayElement);
    });
}
