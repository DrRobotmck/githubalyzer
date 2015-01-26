require 'rubygems'
require 'bundler'

Bundler.require

require 'sinatra'
require 'sinatra/reloader'
require 'httparty'
require 'pry'

require './modules/github_module.rb'
require './controllers/base.rb'
require './controllers/oauth_controller.rb'
require './controllers/users_controller.rb'
require './controllers/main_controller.rb'

require './app.rb'
run Githubalyzer::App