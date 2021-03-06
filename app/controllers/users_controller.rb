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
    @items = Item.joins(:user)
        .select("#{Item.table_name}.*, #{User.table_name}.first_name, #{User.table_name}.last_name")
        .where(:user_id => params[:id])
        .where(:archived => false)
        .order(importance: :desc)

    @items = [group_by_user]
    respond_with(@items) do |format|
      format.to_json { @items.to_json }
      format.html
    end
  end

  def archive
    @items = User.find(params[:id]).items.where(:archived => true).order(importance: :desc)
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
    @items = Item.joins(:user)
        .select("#{Item.table_name}.*, #{User.table_name}.first_name, #{User.table_name}.last_name")
        .where(:user_to_purchase => params[:id])
        .where(:archived => false)
        .order(importance: :desc)

    @items = [group_by_user]
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

  def group_by_user
    group_by_user = {}
    for item in @items
      group_by_user["#{item.first_name} #{item.last_name}"] = [] if group_by_user["#{item.first_name} #{item.last_name}"].nil?
      group_by_user["#{item.first_name} #{item.last_name}"] << item
    end

    group_by_user
  end
end
