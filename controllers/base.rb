module Githubalyzer

	GITHUB_CLIENT_ID = ENV['GITHUB_CLIENT_ID']
	GITHUB_CLIENT_SECRET = ENV['GITHUB_CLIENT_SECRET']

	class Base < Sinatra::Application
		# Helpers
		helpers do
			def authenticated?
				!!session[:access_token]
			end
		end
	end

end