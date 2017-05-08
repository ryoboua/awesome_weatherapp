var APIPrefix = "http://api.openweathermap.org/data/2.5/forecast/daily?q="
var APIKey = "e088f9ea8ecf5826cbe251b88a835822";
var countrySelected = '';
var citySelected = '';

$(document).ready(function(){
  listenForCountrySelect();
  listenForFormSubmit();
  listenForClick();
})

// This function waits for the user to select a country
// Sending a GET request with a country allows for a faster and more accurate response from the API
// I also hide the city input field and only show it once a contry is selected
function listenForCountrySelect(){
  $('#select-country').change(function(){
    countrySelected = this.value;

    if(countrySelected !== '') {
      $('form').show();
    } else {
        $('form').hide();
    }

  })
}
// Event listenner set on the form (search button)
function listenForFormSubmit(){
  $('form').on('submit',handleSubmit);
}
// handleSubmit passes the citySelected and countrySelected to getWeather which will send off the resquest
// I also make sure a city is entered
function handleSubmit(e){
  e.preventDefault();
  reset();
  citySelected = $(".input_text")[0].value;

  if(citySelected === ''){
    alert('Please enter a city');
  }
  else{
    getWeather(citySelected,countrySelected);
      }
}

function getWeather(city,country){
  $.ajax({
    method: 'GET',
    url: APIPrefix + citySelected + ',' + countrySelected + '&cnt=7&units=metric&APPID=' + APIKey
  })
  .done(weatherResult)
  .error(function(error){
    alert(error.responseText + 'Please contact your network administrator');
    console.log(error);
  })
}
// The purpose of weatherResult is to catch the results provided by the API
// From there I store all relevant data into variables to be use later on
function weatherResult (weather){
var cityName = weather.city.name;
var countryName = weather.city.country;
var forecastInfo = [];

  for(i=0; i<7;i++){
    var day = {
      dayHigh: Math.round(weather.list[i].temp.max),
      dayLow: Math.round(weather.list[i].temp.min),
      description: weather.list[i].weather[0].description,
      icon: weather.list[i].weather[0].icon,
      pressure: Math.round(weather.list[i].pressure),
      humidity: weather.list[i].humidity,
      morning: Math.round(weather.list[i].temp.morn),
      afternoon: Math.round(weather.list[i].temp.day),
      evening: Math.round(weather.list[i].temp.eve),
      overnight: Math.round(weather.list[i].temp.night),
      time: weather.list[i].dt
    }
    forecastInfo.push(day);
  }

showForecast(cityName,countryName,forecastInfo);
}
// showForecast appends all the saved data from the API to the DOM
// I also add classes to the elements as they are created
function showForecast(city,country,forecast){

  var d = new Date();
  var month = d.getMonth() + 1;
  var sevenday = $('<h2>').addClass('seven').appendTo('.city_info').text('7 Day Forcast');
  var $cityName = $('<h2>').addClass('city_title').appendTo('.city_info').text(city +','+ country);

forecast.forEach(function(cast){

  var $day = $('<li>').addClass('day_weather').appendTo('.forecast_list');

  var temp = dateStamp(cast.time);


  var $dateWrap = $('<div>').addClass('date_wrap').appendTo($day);
  var $jour = $('<p>').appendTo($dateWrap).text(temp[0]);
  var $date = $('<p>').appendTo($dateWrap).text(month +'/'+ temp[1]);

  var $weatherWrap = $('<div>').addClass('weather').appendTo($day);
  var $image = $('<img>').attr('src','http://openweathermap.org/img/w/'+ cast.icon +'.png').addClass("weather_image").appendTo($weatherWrap);

  var $tempWrap = $('<div>').addClass('temp_wrap').appendTo($weatherWrap);
  var $high = $('<p>').addClass('high').appendTo($tempWrap).text(cast.dayHigh+'°C');
  var $low = $('<p>').addClass('low').appendTo($tempWrap).text(cast.dayLow+'°C');
  var $description = $('<p>').addClass('weather_description').appendTo($tempWrap).text(cast.description);

  var $atmosphere = $('<div>').addClass('atmosphere').appendTo($day);
  var $pressure = $('<p>').addClass('atmosphere_text').appendTo($atmosphere).text(cast.pressure +' hPa');
  var $humidity = $('<p>').addClass('atmosphere_text').appendTo($atmosphere).text('Humidity '+cast.humidity +'%');


  var $details = $('<div>').addClass('details').appendTo($day);

  var $morning = $('<p>').addClass('day_temp').appendTo($details).text('Morn ' + cast.morning+'°C');
  var $afternoon = $('<p>').addClass('day_temp').appendTo($details).text('Day ' + cast.afternoon+'°C');
  var $evening = $('<p>').addClass('day_temp').appendTo($details).text('Eve ' + cast.evening+'°C');
  var $overnight = $('<p>').addClass('day_temp').appendTo($details).text('Night ' + cast.overnight+'°C');
});

      var $averagePressure = $('<h3>').addClass('average_pressure').appendTo('.city_info').text("Average Weekly Pressure "+averageWeeklyPressure(forecast)+' hPa');
      $('.day_weather:first-child').addClass('selected').find(".details").slideDown();
}

function listenForClick(){
   $('.forecast_list').on('click','.day_weather',weatherSlideToggle);
}

function weatherSlideToggle(){
  $('.details').slideUp();
  $('.day_weather').removeClass('selected');
  ($(this).find(".details").is(':visible')) ? $(this).find(".details").slideUp() && $(this).removeClass('selected') : $(this).find(".details").slideDown() && $(this).addClass('selected');
}

function reset(){
  $('.city_info').empty();
  $('.forecast_list').empty();
}
// Calculating the average pressure of the week YAAYY BONUS!!!!
function averageWeeklyPressure(forecast){
  var pressure = 0;
  for(i=0;i<7;i++){
    pressure += forecast[i].pressure;
    }
  return Math.round(pressure / 7);
}

// dateStamp captures the time of which the data was forecasted for and converts it into a usable string
function dateStamp(date){
  var myDate = new Date(date *1000);

  var timeOfDataForecasted = myDate.toGMTString();
  var result = timeOfDataForecasted.split(',');

  var res = result[1].slice(1,3);

  if (res.charAt(0) === '0') res = res.charAt(1);

  return [result[0],res];
}

// THE END
