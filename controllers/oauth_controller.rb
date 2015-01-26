module Githubalyzer
	module Controllers
		class Oauth < Base

			get '/callback' do
				session_code = params[:code]
				session[:access_token] = Github::Auth.get_access_token(session_code)

				redirect '/' unless session[:access_token]
				redirect '/me'
			end

		end
	end
end