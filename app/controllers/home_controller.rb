class HomeController < ApplicationController

  respond_to :html, :json

  def index
  end

  def others
  end

  def purchases
  end

  def wish_list
  end

  def image_url
  	page = MetaInspector.new(params[:url])
  	@url = page.meta_tags['property']['og:image']
  	respond_with(@url)
  end
end
