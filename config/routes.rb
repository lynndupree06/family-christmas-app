Rails.application.routes.draw do
  resources :items
  resources :users, path: 'home/users'

  get '/others' => 'home#others'
  get '/purchases' => 'home#purchases'
  get 'home/users/items/:id' => 'users#items'
  get 'home/users/archive/:id' => 'users#archive'
  get 'home/users/others/:id' => 'users#others'
  get 'home/users/purchases/:id' => 'users#purchases'

  get '/wish_list', :to => redirect('/wish_list.html')

  post 'image_url' => 'home#image_url'

  devise_for :users, :controllers => { registrations: 'registrations' }
  root to: 'home#index'
end
