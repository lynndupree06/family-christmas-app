Rails.application.routes.draw do
  resources :items
  resources :users, path: 'home/users'

  get '/others' => 'home#others'
  get 'home/users/items/:id' => 'users#items'

  devise_for :users, :controllers => { registrations: 'registrations' }
  root to: 'home#index'
end
