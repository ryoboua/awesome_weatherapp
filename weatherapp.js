// function countryList (citylist,pick){
//
// selectedCountry = citylist.filter(function(x){
//   return x.country === pick
// })
// var cityselected = selectedCountry.filter(function(y){
//   return y.name === "Toronto"
// })
// console.log(cityselected)
// };
// countryList(city,"CA")

//api.openweathermap.org/data/2.5/forecast/daily?q={city name},{country code}&cnt={cnt}
var APIPrefix = "http://api.openweathermap.org/data/2.5/forecast/daily?q="
var APIKey = "e088f9ea8ecf5826cbe251b88a835822";
var countrySelected = '';
var citySelected = '';
$(document).ready(function(){
  listenForFormSubmit();

})


$('#select-country').change(function(){
  countrySelected = this.value;
  console.log(countrySelected);
})

function listenForFormSubmit(){
  $('form').on('submit',handleSubmit);
}

function handleSubmit(e){
  e.preventDefault();

  citySelected = $(".input_text")[0].value;
  console.log(citySelected);

  getWeather(citySelected,countrySelected);
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

function weatherResult (weather){
console.log(weather);
var cityName = weather.city.name;
var countryName = weather.city.country;
var forecastInfo = []

  for(i=0; i<7;i++){
    var day = {
      dayHigh: weather.list[i].temp.max,
      dayLow: weather.list[i].temp.min,
      description: weather.list[i].weather[0].description,
      icon: weather.list[i].weather[0].icon,
      pressure: weather.list[i].pressure,
      humidity: weather.list[i].humidity
    }
    forecastInfo.push(day);
  }
console.log(forecastInfo)
showForecast(cityName,countryName,forecastInfo)
}

function showForecast(city,country,forecast){
  var $cityName = $('<h2>').appendTo('.city_info').text(city +','+ country);

  forecast.forEach(function(cast){
    var $day = $('<li>').addClass('day_weather').appendTo('.forecast_list')

    var $date = $('<p>').appendTo($day).text('Date goes here')

    var $image = $('<img>').attr('src','http://openweathermap.org/img/w/'+ cast.icon +'.png').appendTo($day);

    var $tempWrap = $('<div>').addClass('temp_wrap').appendTo($day)
    var $high = $('<p>').addClass('high').appendTo($tempWrap).text(cast.dayHigh)
    var $low = $('<p>').addClass('low').appendTo($tempWrap).text(cast.dayLow)
    var $description = $('<p>').addClass('weather_description').appendTo($tempWrap).text(cast.description)

    var $atmosphere = $('<div>').addClass('atmosphere').appendTo($day)
    var $pressure = $('<p>').addClass('atmosphere_text').appendTo($atmosphere).text(cast.pressure)
    var $humidity = $('<p>').addClass('atmosphere_text').appendTo($atmosphere).text(cast.humidity +'%')

  })
}
