class PurchasesController < ApplicationController

  respond_to :json

  def index
    @purchases = Purchase.all
    respond_with(@purchases) do |format|
      format.to_json { @purchases.to_json(:include => :item) }
    end
  end

  def all_purchases
    @purchases = Purchase.joins(item: :user)
                  .select("#{Item.table_name}.*, #{User.table_name}.first_name, #{User.table_name}.last_name, #{Purchase.table_name}.user_id AS purchaser")
                  .where(:user_id => params[:user_id])

    @purchases = [group_by_user]
    respond_with(@purchases) do |format|
      format.to_json { @purchases.to_json(:include => :item) }
    end
  end

  def create
    @purchase = Purchase.new(purchase_params)
    @purchase.save
    respond_with(@purchase) do |format|
      format.to_json { @purchase.to_json }
      format.html
    end
  end

  def destroy
    @purchase.destroy
    respond_with(@purchase)
  end

  private

  def group_by_user
    group_by_user = {}
    for item in @purchases
      group_by_user["#{item.first_name} #{item.last_name}"] = [] if group_by_user["#{item.first_name} #{item.last_name}"].nil?
      group_by_user["#{item.first_name} #{item.last_name}"] << item
    end

    group_by_user
  end

  def purchase_params
    params.require(:purchase).permit(:user_id, :item_id)
  end
end
