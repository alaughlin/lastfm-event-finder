class Api::EventsController < ApplicationController
  def index
    api_key = "710b4a78d179cd474289e9690d11b272"
    lat = params[:lat]
    long = params[:long]
    encoded_uri = URI.encode("http://ws.audioscrobbler.com/2.0/?method=geo.getevents&lat=#{lat}&long=#{long}&api_key=#{api_key}&distance=10&format=json")
    url = URI.parse(encoded_uri)

    req = Net::HTTP::Get.new(url.to_s)
    res = Net::HTTP.start(url.host, url.port) { |http| http.request(req)}

    render json: res.body
  end
end