module Githubalyzer
	module Controllers
		class Users < Base
			before do
				redirect '/' unless authenticated?
			end

			get '/me' do
				user = Github::Client.fetch_user(session[:access_token])
				@client = user[:account]
				@repos = user[:repos]
				erb :'users/me'
			end

			get '/repos/:user/:repo' do
				user = params[:user]
				repo_name = params[:repo]
				repo = Github::RepoParser.fetch_single_repo(user, repo_name)
			end

		end
	end
end