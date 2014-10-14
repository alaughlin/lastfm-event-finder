(function() {
  var app = window.app = {};

  app.initialize = function() {
    navigator.geolocation.getCurrentPosition(function(position) {
      var mapOptions = {
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        zoom: 12
      };

      var map = new google.maps.Map($('#map-canvas')[0], mapOptions);
      var url = 'http://localhost:3000/api/events?lat=' + position.coords.latitude + ' &long=' + position.coords.longitude

      $.ajax({
        url: url,
        success: function(data) {
          _.each(data.events.event, function(event) {
            var lat = event.venue.location['geo:point']['geo:lat'];
            var long = event.venue.location['geo:point']['geo:long'];
            var latLong = new google.maps.LatLng(lat, long);

            var title = event.title;
            var venue = event.venue;
            var li = $('<li>' + venue.name + '</li>');

            $('#locations').append(li);

            var info = new google.maps.InfoWindow({
              content: title
            });

            var marker = new google.maps.Marker({
              position: latLong,
              map: map,
              title: title,
              animation: google.maps.Animation.DROP,
            });

            google.maps.event.addListener(marker, 'click', function() {
              info.open(map, marker);
            });

            google.maps.event.addListener(li, 'click', function() {
              console.log(what);
            });
          });
        }
      });
    });
  }
})();
