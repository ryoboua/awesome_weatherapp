
var APIPrefix = "http://api.openweathermap.org/data/2.5/forecast/daily?q="
var APIKey = "e088f9ea8ecf5826cbe251b88a835822";
var countrySelected = '';
var citySelected = '';
var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

$(document).ready(function(){
  listenForCountrySelect()
  listenForFormSubmit();
  listenForClick()
})

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

function listenForFormSubmit(){
  $('form').on('submit',handleSubmit);
}

function handleSubmit(e){
  e.preventDefault();
  reset()
  citySelected = $(".input_text")[0].value;

  if(citySelected === ''){
    alert('Please enter a city')
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
      overnight: Math.round(weather.list[i].temp.night),
      time: weather.list[i].dt
    }
    forecastInfo.push(day);
  }

showForecast(cityName,countryName,forecastInfo)
}

function showForecast(city,country,forecast){

  var d = new Date()
  // var date = d.getDate()
  var month = d.getMonth() + 1;
  // var jour = d.getDay()
  var sevenday = $('<h2>').addClass('seven').appendTo('.city_info').text('7 Day Forcast');
  var $cityName = $('<h2>').addClass('city_title').appendTo('.city_info').text(city +','+ country);

forecast.forEach(function(cast){

  var $day = $('<li>').addClass('day_weather').appendTo('.forecast_list')

  //var temp = weekdayCounter(jour,i)
  var temp = dateStamp(cast.time)

  console.log(temp)

  var $dateWrap = $('<div>').addClass('date_wrap').appendTo($day)
  var $jour = $('<p>').appendTo($dateWrap).text(temp[0])
  var $date = $('<p>').appendTo($dateWrap).text(month +'/'+ temp[1])

  var $weatherWrap = $('<div>').addClass('weather').appendTo($day)
  var $image = $('<img>').attr('src','http://openweathermap.org/img/w/'+ cast.icon +'.png').addClass("weather_image").appendTo($weatherWrap);

  var $tempWrap = $('<div>').addClass('temp_wrap').appendTo($weatherWrap)
  var $high = $('<p>').addClass('high').appendTo($tempWrap).text(cast.dayHigh+'°C')
  var $low = $('<p>').addClass('low').appendTo($tempWrap).text(cast.dayLow+'°C')
  var $description = $('<p>').addClass('weather_description').appendTo($tempWrap).text(cast.description)

  var $atmosphere = $('<div>').addClass('atmosphere').appendTo($day)
  var $pressure = $('<p>').addClass('atmosphere_text').appendTo($atmosphere).text(cast.pressure +' hPa')
  var $humidity = $('<p>').addClass('atmosphere_text').appendTo($atmosphere).text('Humidity '+cast.humidity +'%')

/// adding more details

  var $details = $('<div>').addClass('details').appendTo($day)

//var $detail_child = $('<div>').addClass('detail_child').appendTo($details)

  var $morning = $('<p>').addClass('day_temp').appendTo($details).text('Morn ' + cast.morning+'°C')
  var $afternoon = $('<p>').addClass('day_temp').appendTo($details).text('Day ' + cast.afternoon+'°C')
  var $evening = $('<p>').addClass('day_temp').appendTo($details).text('Eve ' + cast.evening+'°C')
  var $overnight = $('<p>').addClass('day_temp').appendTo($details).text('Night ' + cast.overnight+'°C')
})
  
      var $averagePressure = $('<h3>').addClass('average_pressure').appendTo('.city_info').text("Average Weekly Pressure "+averageWeeklyPressure(forecast)+' hPa');
      $('.day_weather:first-child').addClass('selected').find(".details").slideDown()
}

function weekdayCounter(day,count){
  if ((day+count) >= 7) return (day+count) - 7
  return day + count
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
  $('.city_info').empty()
  $('.forecast_list').empty()
}

function averageWeeklyPressure(forecast){
  var x = 0;
  var pressure = 0;
  while(x<7){
    pressure += forecast[x].pressure
    x++
  }
  return Math.round(pressure / 7)
}

function dateStamp(date){
  var myDate = new Date(date *1000);

  var timeOfDataForecasted = myDate.toGMTString()
  var result = timeOfDataForecasted.split(',');

  var res = result[1].slice(1,3)

  return [result[0],res]
}
