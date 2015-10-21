class ItemsController < ApplicationController
  before_action :set_item, only: [:show, :edit, :update, :destroy]

  respond_to :html, :json

  def index
    @items = Item.all.where(:archived => false).order(importance: :desc)
    respond_with(@items) do |format|
      format.to_json { @items.to_json }
      format.html
    end
  end

  def show
    respond_with(@item)
  end

  def new
    @item = Item.new
    respond_with(@item) do |format|
      format.to_json { @items.to_json }
      format.html
    end
  end

  def edit
  end

  def create
    @item = Item.new(item_params)
    @item.save
    respond_with(@item) do |format|
      format.to_json { @items.to_json }
      format.html
    end
  end

  def update
    @item.update(item_params)
    respond_with(@item)
  end

  def destroy
    @item.destroy
    respond_with(@item)
  end

  private
  def set_item
    @item = Item.find(params[:id])
  end

  def item_params
    params.require(:item).permit(:title, :description, :link, :importance, :user_id, :status, :user_to_purchase, :archived)
  end
end
