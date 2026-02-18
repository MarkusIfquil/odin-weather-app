import "./style.css";
import "@fontsource/jetbrains-mono";
import nightSky from "./pictures/night.jpg";
import sunnySky from "./pictures/sunny_clear.jpg";
import spinner from "./pictures/spinner.gif";

let useFahrenheit = false;

async function get_data(latitude, longitude) {
    return await (
        await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?key=JTK8CPH3A3YRGP4AH6TAG33ET`,
        )
    ).json();
}

async function locationSuccess(position) {
    console.log(position);
    let data = await get_data(
        position.coords.latitude,
        position.coords.longitude,
    );
    useData(data);
}

async function getDataFromInput(loc) {
    return await (
        await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?key=JTK8CPH3A3YRGP4AH6TAG33ET`,
        )
    ).json();
}

function useData(data) {
    console.log(data);
    loading.src = "";
    displayDayData(data.currentConditions);
    setBackgroundOnTime(data.currentConditions);
}

function locationFail(error) {
    console.log(error);
}

function setBackgroundOnTime(day) {
    let currentHour = day.datetime.substring(0, 2);
    let sunriseHour = day.sunrise.substring(0, 2);
    let sunsetHour = day.sunset.substring(0, 2);

    let body = document.querySelector("body");
    if (currentHour >= sunriseHour && currentHour <= sunsetHour) {
        body.style.backgroundImage = `url(${sunnySky})`;
        body.style.color = "black";
        body.style.borderColor = "black";
    } else {
        body.style.color = "white";
        body.style.borderColor = "white";
        body.style.backgroundImage = `url(${nightSky})`;
    }
}

function fahrenheitToCelsius(temp) {
    let celsius = ((temp - 32) / 1.8).toFixed(2);
    temp = `${celsius} °C`;
    return temp;
}

function formatTemp(temp) {
    let tempString = "";
    if (!useFahrenheit) {
        tempString = fahrenheitToCelsius(temp);
    } else {
        tempString = `${temp} °F`;
    }
    return tempString;
}

function displayDayData(day) {
    let temp = formatTemp(day.temp);
    let feelsLikeTemp = formatTemp(day.feelslike);
    let div = document.createElement("div");
    div.className = "card";
    let temperature = document.createElement("p");
    temperature.id = "temperature";
    temperature.innerHTML = temp;
    let feelsLike = document.createElement("p");
    feelsLike.id = "feels-like";
    feelsLike.innerHTML = `feels like: ${feelsLikeTemp}`;
    let wind = document.createElement("p");
    wind.id = "wind";
    wind.innerHTML = `wind speed: ${day.windspeed} kmph`;
    let humidity = document.createElement("p");
    humidity.id = "humidity";
    humidity.innerHTML = `humidity: ${day.humidity}%`;
    let icon = document.createElement("img");
    icon.className = `icon ${day.icon}`;
    div.appendChild(temperature);
    div.appendChild(feelsLike);
    div.appendChild(wind);
    div.appendChild(humidity);
    div.appendChild(icon);

    let days = document.querySelector("#days");
    days.innerHTML = "";
    days.appendChild(div);
}

let button = document.querySelector("button");
button.onclick = setUnit;
function setUnit() {
    useFahrenheit = !useFahrenheit;
    navigator.geolocation.getCurrentPosition(locationSuccess, locationFail);
}

let form = document.querySelector("form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("hello");
    let input = document.querySelector("input");
    let loc = input.value;
    let data = await getDataFromInput(loc);
    useData(data);
});

let loading = document.createElement("img");
loading.src = spinner;
let container = document.querySelector("#container");
container.appendChild(loading);
navigator.geolocation.getCurrentPosition(locationSuccess, locationFail);
