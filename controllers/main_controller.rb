module Githubalyzer
	module Controllers
		class Main < Base
			get '/' do
				redirect '/me' if authenticated?
				@client_id = GITHUB_CLIENT_ID
				erb :'main/home'
			end
		end
	end
end