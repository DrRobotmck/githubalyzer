module Githubalyzer

	class App < Sinatra::Application

		enable :sessions
		set :session_secret, 'swag'
		# Controllers
		use Controllers::Main
		use Controllers::Oauth
		use Controllers::Users

	end
end