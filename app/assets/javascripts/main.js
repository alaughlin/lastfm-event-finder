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

      var apiKey = '710b4a78d179cd474289e9690d11b272';
      var apiSecret ='c5f0f70bd447fc854f96d39a577ee0b9';
      var url = 'http://ws.audioscrobbler.com/2.0/?method=geo.getevents&lat=' + position.coords.latitude + '&long=' + position.coords.longitude + '&api_key=' + apiKey + '&distance=' + 10 + '&format=json';

      $.ajax({
        url: url,
        success: function(data) {
          _.each(data.events.event, function(event) {
            var lat = event.venue.location['geo:point']['geo:lat'];
            var long = event.venue.location['geo:point']['geo:long'];
            var latLong = new google.maps.LatLng(lat, long);

            var title = event.title;
            var info = new google.maps.InfoWindow({
              content: title
            });

            var marker = new google.maps.Marker({
              position: latLong,
              map: map,
              title: title
            });

            google.maps.event.addListener(marker, 'click', function() {
              info.open(map, marker);
            });
          });
        }
      });
    });
  }

  google.maps.event.addDomListener(window, 'load', initialize);
});
