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

for(i=0; i<7;i++){
  var day = {
    dayHigh: weather.list[i].temp.max,
    dayLow: weather.list[i].temp.min,
    description: weather.list[i].weather[0].description,
    icon: weather.list[i].weather[0].icon,
    pressure: weather.list[i].pressure,
    humidity: weather.list[i].humidity
  }
console.log(day)
}

}
