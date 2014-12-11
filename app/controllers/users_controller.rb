class UsersController < ApplicationController
  before_action only: [:show, :edit, :update, :destroy]

  respond_to :html, :json

  def index
    @users = User.all
    respond_with(@users) do |format|
      format.to_json { @users.to_json }
      format.html
    end
  end

  def items
    @items = User.find(params[:id]).items
    respond_with(@items) do |format|
      format.to_json { @items.to_json }
      format.html
    end
  end

  def others
    @users = User.all.where("id != #{params[:id]}")
    respond_with(@users) do |format|
      format.to_json { @users.to_json }
      format.html
    end
  end

  def purchases
    @items = Item.joins(:user).select("#{Item.table_name}.*, #{User.table_name}.first_name, #{User.table_name}.last_name").where(:user_to_purchase => params[:id])
    respond_with(@items) do |format|
      format.to_json { @items.to_json(:include => :user) }
      format.html
    end
  end

  def show
    respond_with(@user)
  end

  def new
    @user = User.new
    respond_with(@user) do |format|
      format.to_json { @users.to_json }
      format.html
    end
  end

  def edit
  end

  def create
    @user = User.new(user_params)
    @user.save
    respond_with(@user) do |format|
      format.to_json { @users.to_json }
      format.html
    end
  end

  def update
    @user.update(user_params)
    respond_with(@user)
  end

  def destroy
    @user.destroy
    respond_with(@user)
  end

  private

  def user_params
    params.require(:user).permit(:email, :first_name, :last_name)
  end
end
