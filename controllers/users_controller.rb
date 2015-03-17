module Githubalyzer
	module Controllers
		class Users < Base
			before do
				redirect '/' unless authenticated?
			end

			get '/me' do
				user = Github::Client.fetch_user(session[:access_token])
				session[:user_repos_url] = user['repos_url']
				@client = user
				erb :'users/me'
			end

			get '/get_repo_json' do
				p session[:user_repos_url]
				# parsed_repos = Github::Client.fetch_all_repos(session[:user_repos_url])
				parsed_repos = Github::Client.fetch_all_repos('https://api.github.com/users/thoughtbot/repos')
				json parsed_repos
			end

			get '/repos/:user/:repo' do
				user = params[:user]
				repo_name = params[:repo]
				repo = Github::RepoParser.fetch_single_repo(user, repo_name)
				binding.pry
			end

		end
	end
end