# Be sure to restart your server when you modify this file.

Rails.application.configure do
# Version of your assets, change this if you want to expire all your assets.
  config.assets.version = '1.0'
  config.assets.precompile += %w( lavish-bootstrap.css )
  config.assets.precompile += %w( glyphicons-halflings-regular.eot )
  config.assets.precompile += %w( glyphicons-halflings-regular.svg )
  config.assets.precompile += %w( glyphicons-halflings-regular.ttf )
  config.assets.precompile += %w( glyphicons-halflings-regular.woff )

  config.assets.precompile += %w( *.svg *.eot *.woff *.ttf *.png *.jpg *.jpeg *.gif )

end

