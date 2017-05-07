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
var weekday = new Array(7);
weekday[0] =  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

$(document).ready(function(){
  listenForFormSubmit();
  listenForClick()
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
  reset()
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
      dayHigh: Math.round(weather.list[i].temp.max),
      dayLow: Math.round(weather.list[i].temp.min),
      description: weather.list[i].weather[0].description,
      icon: weather.list[i].weather[0].icon,
      pressure: Math.round(weather.list[i].pressure),
      humidity: weather.list[i].humidity,
      morning: Math.round(weather.list[i].temp.morn),
      afternoon: Math.round(weather.list[i].temp.day),
      evening: Math.round(weather.list[i].temp.eve),
      overnight: Math.round(weather.list[i].temp.night)
    }
    forecastInfo.push(day);
  }

console.log(forecastInfo)
showForecast(cityName,countryName,forecastInfo)
}

function showForecast(city,country,forecast){

  var d = new Date()
  var date = d.getDate()
  var month = d.getMonth() + 1;
  var jour = d.getDay()
  var $cityName = $('<h2>').addClass('city_title').appendTo('.city_info').text(city +','+ country);

    for(i=0; i<forecast.length;i++){
        var $day = $('<li>').addClass('day_weather').appendTo('.forecast_list')

        var temp = weekdayCounter(jour,i)

        var $dateWrap = $('<div>').addClass('date_wrap').appendTo($day)
        var $jour = $('<p>').appendTo($dateWrap).text(weekday[temp])
        var $date = $('<p>').appendTo($dateWrap).text(month +'/'+ (date+i))

        var $weatherWrap = $('<div>').addClass('weather').appendTo($day)
        var $image = $('<img>').attr('src','http://openweathermap.org/img/w/'+ forecast[i].icon +'.png').addClass("weather_image").appendTo($weatherWrap);

        var $tempWrap = $('<div>').addClass('temp_wrap').appendTo($weatherWrap)
        var $high = $('<p>').addClass('high').appendTo($tempWrap).text(forecast[i].dayHigh+'°C')
        var $low = $('<p>').addClass('low').appendTo($tempWrap).text(forecast[i].dayLow+'°C')
        var $description = $('<p>').addClass('weather_description').appendTo($tempWrap).text(forecast[i].description)

        var $atmosphere = $('<div>').addClass('atmosphere').appendTo($day)
        var $pressure = $('<p>').addClass('atmosphere_text').appendTo($atmosphere).text(forecast[i].pressure +'hPa')
        var $humidity = $('<p>').addClass('atmosphere_text').appendTo($atmosphere).text(forecast[i].humidity +'%')

      /// adding more details

      var $details = $('<div>').addClass('details').appendTo($day)

      //var $detail_child = $('<div>').addClass('detail_child').appendTo($details)

      var $morning = $('<p>').addClass('day_temp').appendTo($details).text('Morn ' + forecast[i].morning+'°C')
      var $afternoon = $('<p>').addClass('day_temp').appendTo($details).text('Day ' + forecast[i].afternoon+'°C')
      var $evening = $('<p>').addClass('day_temp').appendTo($details).text('Eve ' + forecast[i].evening+'°C')
      var $overnight = $('<p>').addClass('day_temp').appendTo($details).text('Night ' + forecast[i].overnight+'°C')


    }

}

function weekdayCounter(day,count){
  if ((day+count) >= 7) return (day+count) - 7
  return day + count
}

function listenForClick(){
   $('.forecast_list').on('click','.day_weather',weatherSlideToggle);
}

function weatherSlideToggle(){
  $('.details').slideToggle();
}

function reset(){
  $('.city_info').empty()
  $('.forecast_list').empty()
}
