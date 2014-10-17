(function() {
  var app = window.app = {};
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

    var infoContent = app.generateInfo(event);

    var info = new google.maps.InfoWindow({
      content: infoContent
    });

    var marker = new google.maps.Marker({
      position: latLong,
      map: app.map,
      title: event.title,
      animation: google.maps.Animation.DROP,
    });

    // these should be refactored to be more DRY
    google.maps.event.addListener(marker, 'click', function() {
      if(app.currentInfo) {
        app.currentInfo.close();
      }
      app.currentInfo = info;
      app.map.panTo(marker.getPosition());
      info.open(app.map, marker);
    });

    li.on('click', function() {
      if(app.currentInfo) {
        app.currentInfo.close();
      }
      app.currentInfo = info;
      app.map.panTo(marker.getPosition());
      info.open(app.map, marker);
    });
  };

  app.generateInfo = function (event) {
    // should really use templating
    var image = '<img src=' + event.image[2]['#text'] + '>';
    var title = '<h3>' + event.title + '</h3>';
    var date = event.startDate + '<br>';
    var venue = '<a href=' + event.venue.website + '>' + event.venue.name+ '</a><br>';
    var link = '<a href=' + event.url + '>Details</a>';
    var artists = '';
    if ($.isArray(event.artists.artist)) {
      _.each(event.artists.artist, function(artist) {
        artists += '<li>' + artist + '</li>';
      });
    }

    if (artists.length > 1) {
      artists = '<h4>Lineup:</h4><ul>' + artists + '</ul>';
    }

    return '<ul class="info group"><li>' + image + '</li><li>' + title + date + venue + artists + link + '</li><ul>';
  };
})();
