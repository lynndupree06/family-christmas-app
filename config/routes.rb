Rails.application.routes.draw do
  resources :items

  get 'home/index'

  devise_for :users
  root to: 'home#index'
end
