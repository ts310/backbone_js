require 'rubygems'
require 'sinatra'
require 'net/http'
require 'json'

get '/' do

end

get '/api/v2.0/*' do
  res = nil
  http = Net::HTTP.new('www.stul.io', 80)
  # http.use_ssl = true;
  http.start {
    res = http.get(request.fullpath);
  }
  content_type :json
  res.body
end
