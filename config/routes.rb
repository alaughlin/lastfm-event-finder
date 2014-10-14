Rails.application.routes.draw do
  root to: 'static#index'

  namespace :api, defaults: {format: :json} do
    resources :events, only: [:index]
  end
end
