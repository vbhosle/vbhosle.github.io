ZOMATO_API_KEY = '9829374224f41102e7463d434631ba0d';
ZOMATO_BASE_URI = "https://developers.zomato.com/api/v2.1/search";
DEFAULT_QUERY_PARAM = {count: 20, sort: "real_distance", order: "asc"};
var xhrCap;
var errorCap;
var tpData;
function fetchRestaurantsInCircle(lat, lng, radius, callbackFn, statusChangeHandlerFn){

  console.log("lat:"+lat+", lng:"+lng+", radius:"+radius);
  //create copy of DEFAULT_QUERY_PARAM
  var queryParam = Object.assign({},DEFAULT_QUERY_PARAM);
  queryParam.radius = encodeURIComponent(radius);
  queryParam.lat = encodeURIComponent(lat);
  queryParam.lon = encodeURIComponent(lng);
  $.ajax({
    type: 'GET',
    url: ZOMATO_BASE_URI,
    headers: {"user-key": ZOMATO_API_KEY},
    data: queryParam,
    beforeSend: displayLoading,
}).done(wrapData).fail(handleAjaxError);

  function displayLoading(xhr,setting){
    console.log('loading data...'+xhr.status);
    console.log(xhr);
    statusChangeHandlerFn(xhr, null);
    //setAlertMessage('Loading restaurants..','PROGRESS');
  }

  function wrapData(data, textStatus, xhr){
    //TODO for debug, remove later
    tpData = data;
    xhrCap = xhr;
    console.log('wrapData');
    data.isError = false;
    callbackFn(data);
    statusChangeHandlerFn(xhr, null);
  }

  function handleAjaxError(xhr, textStatus, error) {
    statusChangeHandlerFn(xhr, error);

    //TODO for debug, remove later
    xhrCap = xhr;
    errorCap = error;
  }

}
