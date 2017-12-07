var map;
var isMapVisible = false;
//set won't keep duplicates :)
var allCuisines = new Set([]);
var drawingManager;
var restoViewModel;
// This global circle variable is to ensure only ONE circle is rendered.
var circle = null;
var infowindow;

//preprocess restaurant data from json
var Restaurant = function(restaurant_data){
  this.id = restaurant_data.id;
  this.name = restaurant_data.name;
  this.average_cost_for_two = restaurant_data.average_cost_for_two;
  //convert cuisines to array and trim spaces.
  this.cuisines = restaurant_data.cuisines.split(",").map(function (str) {
    return str.trim();
  });
  this.currency = restaurant_data.currency;
  //TODO Set default image
  this.featured_image = restaurant_data.featured_image;
  this.has_online_delivery = restaurant_data.has_online_delivery;
  this.has_table_booking = restaurant_data.has_table_booking;
  this.address = restaurant_data.location.address;
  this.lat = parseFloat(restaurant_data.location.latitude);
  this.lng = parseFloat(restaurant_data.location.longitude);
  this.menu_url = restaurant_data.menu_url;
  this.photos_url = restaurant_data.photos_url;
  this.url = restaurant_data.url;
  this.user_rating = restaurant_data.user_rating;
}

var RestaurantViewModel = function(){
  self = this;
  self.markers = new Array();
  self.isSearchMode = ko.observable(true);

  //predefined alert types and colors
  self.alertType = {
    DEFAULT: {ID:0, BG_COLOR: '#000000', COLOR:'#ffffff'},
	  INFO: {ID:1, BG_COLOR:'#2196F3', COLOR:'#ffffff'},
    INPROGRESS: {ID:2, BG_COLOR: '#000000', COLOR:'#ffffff'},
	  SUCCESS: {ID:3, BG_COLOR:'#4CAF50', COLOR:'#ffffff'},
    ERROR: {ID:4, BG_COLOR: '#f44336', COLOR:'#ffffff'}
  };

  self.alertMessage = ko.observable('');
  self.availableRestaurants = ko.observableArray([]);
  self.selectedRestaurant = ko.observable();
  self.availableCuisines = ko.observableArray();
  self.selectedCuisine = ko.observable("all");
  //for later use in cost filter
  self.availableMinCost = ko.observable();
  self.availableMaxCost = ko.observable();
  self.selectedMinCost = ko.observable();
  self.selectedMaxCost = ko.observable();
  self.filteredRestaurants = ko.computed(function(){
    return self.availableRestaurants().filter(function(restaurant){
      return ( (self.selectedCuisine() === "all") || (restaurant.cuisines.indexOf(self.selectedCuisine())>-1) );
    });
  });

  self.highlightMarkers = function(){
    if(self.selectedRestaurant()){
      if(self.selectedRestaurant()){
        markerSelected(self.selectedRestaurant());
      }
    }
  };

  //filter markers
  self.filteredRestaurants.subscribe(function(){
      for(var i=0; i<self.markers.length;i++){
        var currMarker = self.markers[i];
        if(self.filteredRestaurants().some(function(resto){return (resto.id === self.markers[i].id);})){
          if(currMarker.getMap() == null){
            currMarker.setMap(map);
          }
        }else{
          currMarker.setMap(null);
        }
      }
    });

  //restaurants list independent controls
  self.zoom_in_text = ko.observable();

  // This function takes the input value in the find nearby area text input
  // locates it, and then zooms into that area. This is so that the user can
  // show all listings, then decide to focus on one area of the map.
  self.zoomToArea = function() {
    // Initialize the geocoder.
    var geocoder = new google.maps.Geocoder();
    // Get the address or place that the user entered.
    var address = self.zoom_in_text();
    console.log('Zoom Text:'+address);
    // Make sure the address isn't blank.
    if (!address || address == '') {
      //TODO put this is closable alert div
      console.log('You must enter an area, or address.');
      setAlertMessage('You must enter an area, or address.', 'INFO');
    } else {
      // Geocode the address/area entered to get the center. Then, center the map
      // on it and zoom in
      if(!isMapVisible){
        setAlertMessage('Please wait, the map is not loaded, or try reloading','INFO');
        return;
      }
      console.log('calling geocode');
      geocoder.geocode(
        { address: address,
          componentRestrictions: {country:'IN', administrativeArea: 'Mumbai'}
          //componentRestrictions: {country:'IT', administrativeArea : 'Lazio'}
          //componentRestrictions: {country:'TR', administrativeArea : 'Istanbul'}
        }, function(results, status) {
          console.log('zoom to area');
          console.log(results);
          console.log(status);
          setAlertMessage('Loading map for '+address+'..','INFO');
          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);
          }
          else if(status == google.maps.GeocoderStatus.ERROR){
            setAlertMessage('Connection error!', 'ERROR');
          }
          else {
            //TODO put this in closable alert div
            setAlertMessage('We could not find that location - try entering a more' +
                ' specific place.','INFO');
          }
        });

    }
  };

  // This shows and hides (respectively) the drawing options.
  self.toggleDrawing = function() {
    console.log('toggleDrawing');
    if(!isMapVisible){
      setAlertMessage('Please wait, the map is not fully loaded, or try reloading','INFO');
      return;
    }
    if (drawingManager.map) {
      drawingManager.setMap(null);
      // In case the user drew anything, get rid of the circle
      if (circle !== null) {
        circle.setMap(null);
      }
    } else {
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
      drawingManager.setMap(map);
    }
  };

  // This function hides all markers outside the circle,
  // and shows only the ones within it. This is so that the
  // user can specify an exact area of search.
  self.searchWithinCircle=function() {
    //hides search button to prevent overlapping searches
     if(!isMapVisible){
       setAlertMessage('Please wait, the map is not fully loaded, or try reloading','INFO');
       return;
     }
     self.isSearchMode(false);

     if(circle!=null){
       fetchRestaurantsInCircle(circle.getCenter().lat(),circle.getCenter().lng(),circle.getRadius(),displayRestaurants, ajaxErrorHandler);
     }
     else{
       console.log('please draw circle first');
       setAlertMessage('Please draw a circle first', 'INFO');
       //don't hide search button on error
       self.isSearchMode(true);
     }
  };

  self.clearSearch = function(){
    clearMarkers();
    clearViewModel();
    //remove circle if any
    if(circle!=null){
      circle.setMap(null);
      circle = null;
    }
  };

  //to control filters control panel
  self.showFilters = ko.observable(false);
  self.toggleShowFilters = function(){
    self.showFilters(!self.showFilters());
  };

  //to control top right corner panel
  self.showOptions = ko.observable(false);
  self.toggleShowOptions = function(){
    self.showOptions(!self.showOptions());
  };

  //to control left sidebar panel
  self.showSidebar = ko.observable(false);
  self.toggleSidebar = function(){
    self.showSidebar(!self.showSidebar());
  }
}

restoViewModel = new RestaurantViewModel();
ko.applyBindings(restoViewModel);

//google calls initMap when map is loaded
function initMap() {
  //IE11 workaround: prevent browser auto-fill
  $('#zoom-to-area-text').val('');

  //map styles, hide businesses
  var styles = [
      {
        featureType: 'poi.business',
        stylers : [{visibility: 'off'}]
      }
  ];

  map = new google.maps.Map(document.getElementById('map'), {
    //TODO create a CONSTANT for lat lng
    styles: styles,
    center: {lat: 19.190638, lng: 72.834392},//Mumbai IN
    //center: {lat: 41.9028, lng: 12.4964},//Rome IT
    //center: {lat: 41.008238, lng: 28.978359},//Istanbul Turkey
    zoom: 15,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
    },
    streetViewControl: true,
    streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
    }
  });

  map.addListener('tilesloaded', function(){
    console.log('tilesloaded');
    isMapVisible=true;
    restoViewModel.alertMessage('');
   }
  );

  infowindow = new google.maps.InfoWindow();
  // Initialize the drawing manager.
  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.CIRCLE,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.CIRCLE
      ]
    }
  });

  drawingManager.addListener('overlaycomplete', function(event) {
  // First, check if there is an existing circle.
  // If there is, get rid of it and remove the markers
  if (circle) {
    circle.setMap(null);
  }
  // Switching the drawing mode to the HAND (i.e., no longer drawing).
  drawingManager.setDrawingMode(null);
  // Creating a new editable circle from the overlay.
  circle = event.overlay;
  circle.setEditable(true);
 });

}//ENDED initMap

//Animate selected marker and show details of restaurant
function markerSelected(selectedLocn){
  for(var i=0; i<restoViewModel.markers.length;i++){
    restoViewModel.markers[i].setIcon('http://maps.google.com/mapfiles/ms/icons/orange-dot.png');
  }
  var markersArr = $.grep(restoViewModel.markers, function(m){ return m.id === selectedLocn.id; })
  if(markersArr.length>0){
    var marker = markersArr[0];
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
    marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function(){marker.setAnimation(null);},700);

    infowindow.open(map, marker);
    restoViewModel.selectedRestaurant(selectedLocn);
    infowindow.setContent('<div class="info-window">'+
                          '<p class="info-title" style="background-color:#'+selectedLocn.user_rating.rating_color+'">'+selectedLocn.name+'</p>'+
                              '<div class="info-details">'+
                                '<p class="info-item">'+
                                  '<span class="iconified cuisine-icon"></span>'+
                                  '<span class="info-item-title">Cuisines:&nbsp;</span>'+
                                  selectedLocn.cuisines+
                                '</p>'+
                                '<p class="info-item">'+
                                  '<span class="iconified rating-icon"></span>'+
                                  '<span class="info-item-title">Rating:&nbsp;</span>'+
                                  selectedLocn.user_rating.aggregate_rating+
                                '</p>'+
                                '<p class="info-item">'+
                                  '<span class="iconified cost-icon"></span>'+
                                  '<span class="info-item-title">Cost for two:&nbsp;</span>'+
                                  selectedLocn.currency+
                                  (selectedLocn.average_cost_for_two?selectedLocn.average_cost_for_two:'N/A')+
                                '</p>'+
                                '<p class="info-item">'+
                                  '<span class="iconified menu-icon"></span>'+
                                  '<span class="info-item-title"><a target="_blank" href="'+selectedLocn.menu_url+'">Menu</a></span>'+
                                '</p>'+
                                '<p class="info-item">'+
                                  '<span class="iconified '+(selectedLocn.has_online_delivery?'checked-icon':'unchecked-icon')+'"></span>'+
                                  '<span class="info-item-title">Online Delivery</span>'+
                                '</p>'+
                                '<p class="info-item">'+
                                  '<span class="iconified '+(selectedLocn.has_table_booking?'checked-icon':'unchecked-icon')+'"></span>'+
                                  '<span class="info-item-title">Table Booking</span>'+
                                '</p>'+
                              '</div>'+
                            '</div>'
                          );

 }
}


function clearMarkers(){
  var total_markers = restoViewModel.availableRestaurants().length;
  console.log('clearMarkers:'+total_markers);
  for(var i=0;i<total_markers;i++){
    restoViewModel.markers[i].setMap(null);
  }
}

function clearViewModel(){
  console.log('clearViewModel');
  restoViewModel.showFilters(false);
  restoViewModel.isSearchMode(true);
  restoViewModel.markers.length = 0;
  restoViewModel.availableRestaurants.removeAll();
  restoViewModel.availableCuisines.removeAll();
  allCuisines.clear();
}

//remove this debug var
var cbData;

//callback function when ajax request returns data
function displayRestaurants(data){
  //TODO for debug, remove later
  cbData=data;

  //populate places and markers
  var isWithinCircle;
  for(var i=0; i<data.results_shown; i++){
    isWithinCircle = false;
    console.log("populating viewModel and markers");
    var currRestaurant = new Restaurant(data.restaurants[i].restaurant);
    console.log(currRestaurant);
    isWithinCircle = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(currRestaurant.lat,currRestaurant.lng), circle.getCenter()) <= circle.getRadius();

    if(isWithinCircle){
        var marker = new google.maps.Marker({
          map: map,
          position: {lat: currRestaurant.lat, lng: currRestaurant.lng},
          icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
        });
        marker.id = currRestaurant.id;
        //locationList.push(locationItem);

        google.maps.event.addListener(marker, 'click', function() {
          return markerSelected(this);
        }.bind(currRestaurant));

        restoViewModel.markers.push(marker);

        //add restaurants cuisines to the set
        for(var c=0;c<currRestaurant.cuisines.length;c++){
            allCuisines.add(currRestaurant.cuisines[c]);
        }

        restoViewModel.availableRestaurants.push(currRestaurant);
      }
  }//populated places and markers

  var count_restaurants = restoViewModel.availableRestaurants().length;
  if(count_restaurants>0){
    console.log("Restaurants found:"+count_restaurants);
    setAlertMessage('Found '+count_restaurants+' restaurants!','SUCCESS');
    window.setTimeout(function(){restoViewModel.alertMessage('');},2000);
    //var sortedCuisines = Array.from(allCuisines).sort();
    //IE doesnt support Array.from, even polyfill didnt work
    var sortedCuisines = new Array();
    //for(let item of allCuisines){sortedCuisines.push(item);};
    allCuisines.forEach(function(value) {
      sortedCuisines.push(value);
    });

    //first cuisine option should be "all"
    sortedCuisines.sort().unshift("all");
    restoViewModel.availableCuisines(sortedCuisines);
    map.setCenter(circle.getCenter());
    map.fitBounds(circle.getBounds());
  }
  else{
    setAlertMessage('Sorry, No restaurants found in given area.', 'INFO');
    restoViewModel.clearSearch();
  }
}

function setAlertMessage(msg, msgType){
  var newAlert = {
    message: msg,
    type: (restoViewModel.alertType[msgType]?Object.assign({}, restoViewModel.alertType[msgType]):
          Object.assign({}, restoViewModel.alertType.DEFAULT))
    };
  restoViewModel.alertMessage(newAlert);
}

function ajaxErrorHandler(xhr, error){
  console.log('ajaxErrorHandler status='+xhr.status+", readyState="+xhr.readyState)

  if(xhr.readyState == 0 && (typeof xhr.status === 'undefined')){
    setAlertMessage('searching restaurants...','INPROGRESS');
  }
  else if(xhr.readyState == 4 && xhr.status == 200){
    //let done() callback handle success alerts
    console.log("Ajax request successful");
  }
  else{
      //error
      var errorMsg;
      if (!xhr.status) {
        errorMsg = "No response recieved (check internet connection) OR developers.zomato.com could be blocked on your system or by ISP";
      }
      else if (xhr.status == 400) {
        errorMsg = "Error: Bad request. Invalid input parameters";
      }
      else if (xhr.status == 401) {
        errorMsg = "Error: Unauthorized. API Token ";
      }
      else if (xhr.status == 403) {
        errorMsg = "Invalid Key or Parameters";
      }
      else if (xhr.status == 404) {
        errorMsg = "Error 404: Service URL Not found";
      }
      else if (xhr.status == 410) {
        errorMsg = "Error: URL expired";
      }
      else if (xhr.status == 500) {
        errorMsg = "Error: Internal server error";
      }
      else if (xhr.status == 503) {
        errorMsg = "Error: Service unavailable";
      }
      else if (xhr.status == 599) {
        errorMsg = "Error: Connection timed out";
      }
      else if (xhr.status == 200){
        errorMsg = error;
      }else{
        errorMsg = xhr.staus;
      }
      setAlertMessage(errorMsg,'ERROR');
      restoViewModel.clearSearch();
  }//error
}
