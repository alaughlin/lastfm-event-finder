(function() {
  var app = window.app = {};
  app.liMarkerPairs = {};
  app.markerInfoPairs = {};
  app.currentInfo;

  app.initialize = function() {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      var mapOptions = {
        center: {
          lat: lat,
          lng: lng
        },
        zoom: 12
      };

      app.map = new google.maps.Map($('#map-canvas')[0], mapOptions);

      app.getEvents(lat, lng);
    });
  };

  app.getEvents = function(lat, lng) {
    $.ajax({
      url: 'http://localhost:3000/api/events',
      type: 'GET',
      data: {
        lat: lat,
        long: lng
      },
      success: function(data) {
        _.each(data.events.event, function(event) {
          app.placeMarker(event);
        });
      }
    });
  };

  app.placeMarker = function(event) {
    var lat = event.venue.location['geo:point']['geo:lat'];
    var lng = event.venue.location['geo:point']['geo:long'];
    var latLong = new google.maps.LatLng(lat, lng);

    var venue = event.venue;
    var li = $('<li>' + venue.name + '</li>');
    $('#locations').append(li);

    var title = event.title;
    var info = new google.maps.InfoWindow({
      content: title
    });

    var marker = new google.maps.Marker({
      position: latLong,
      map: app.map,
      title: title,
      animation: google.maps.Animation.DROP,
    });

    google.maps.event.addListener(marker, 'click', function() {
      if(app.currentInfo) {
        app.currentInfo.close();
      }
      app.currentInfo = info;
      info.open(app.map, marker);
    });
  };
})();
