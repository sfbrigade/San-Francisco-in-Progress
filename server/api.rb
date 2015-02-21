require 'sinatra'
require 'json'
require 'soda'

APP_TOKEN = ENV['APP_TOKEN']
DATASET = "n5ik-nmm3"

get '/api/v1/map' do
  client = SODA::Client.new({:domain => "data.sfgov.org", :app_token => APP_TOKEN})
  response = client.get(DATASET, {"$limit" => 1})

  response.to_json
end