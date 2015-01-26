module Github

	module Auth
		AUTH_ROOT_URL = 'https://github.com/login/oauth/access_token'
		CLIENT_ID = ENV['GITHUB_CLIENT_ID']
		CLIENT_SECRET = ENV['GITHUB_CLIENT_SECRET']

		def self.get_access_token(code)
			result = HTTParty.post(
				AUTH_ROOT_URL,
				body: {
					client_id: CLIENT_ID,
					client_secret: CLIENT_SECRET,
					code: code,
					accept: :json
				}
			)
			return nil if result['error']
			return result.match(/access_token=([a-z0-9]+)&/)[1]
		end

	end

	module Client
		CLIENT_ROOT_URL = 'https://api.github.com/user'

		def self.fetch_user(token)
			result = HTTParty.get(
				CLIENT_ROOT_URL,
				query: { access_token: token }
			)
			fetch_all_repos(result)
		end

		def self.fetch_all_repos(user)
			repos = HTTParty.get(user['repos_url'])
			user_repos = filter_own_repos(repos)
			return { account: user, repos: user_repos }
		end

		private

		# Filter User's repositories from forks

		def self.filter_own_repos(repos)
			return {
				own_repos: repos.reject { |repo| repo['fork'] },
				forked_repos: repos.select { |repo| repo['fork'] }
			}
		end
	end

	module RepoParser
		REPO_ROOT_URL = 'https://api.github.com/repos/'

		@parse_commit = Proc.new do |commit|
			{
				committer: commit['commit']['committer']['name'],
				date: commit['commit']['committer']['date'],
				message: commit['commit']['message']
			}
		end

		def self.fetch_single_repo(user, repo)
			repo = HTTParty.get(REPO_ROOT_URL + user + '/' + repo)
			parse_repository(repo)
		end

		def self.parse_repository(repo)
			parsed_languages = parse_languages(repo)
			parsed_commits = parse_commits(repo)
			commits_metadata = parse_commit_meta_data(parsed_commits)
			repo_meta_data = parse_meta_data(repo)
			parsed_repo = {
				languages: parsed_languages,
				commits: parsed_commits,
				commits_metadata: commits_metadata
			}
		end

		def self.parse_languages(repo)
			languages_url = repo['languages_url']
			language_breakdown = HTTParty.get(languages_url)
			return language_breakdown
		end

		def self.parse_commits(repo)
			commits_url = repo["commits_url"].gsub(/\{\/sha\}/, '')
			commits = HTTParty.get(commits_url)
			parsed_commits = commits.map(&@parse_commit)
			return parsed_commits
		end

		def self.parse_commit_meta_data(commits)
			committers = commits.map { |commit| commit[:committer]}.uniq
			dates_of_commits = commits.map { |commit| commit[:date] }
			words_per_commit = commits.map { |commit| commit[:message].length }
			commit_metadata = {
				committers: committers,
				dates_of_commits: dates_of_commits,
				words_per_commit: words_per_commit
			}
			return commit_metadata
		end

		def self.parse_meta_data(repo)
			binding.pry
		end

	end
end