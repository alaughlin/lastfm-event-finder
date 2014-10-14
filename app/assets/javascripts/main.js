$(document).ready(function() {
  function initialize() {
    navigator.geolocation.getCurrentPosition(function(position) {
      var mapOptions = {
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        zoom: 8
      };
      var map = new google.maps.Map($('#map-canvas')[0], mapOptions);
    });
  }

  google.maps.event.addDomListener(window, 'load', initialize);
});
