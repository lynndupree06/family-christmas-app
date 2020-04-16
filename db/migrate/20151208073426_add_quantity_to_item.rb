class AddQuantityToItem < ActiveRecord::Migration
  def change
  	add_column :items, :quantity, :integer, :default => 1
  	add_column :items, :quantity_available, :integer, :default => 1

  	create_table :purchases do |t|
      t.belongs_to :user
      t.belongs_to :item

      t.timestamps
    end

    Item.find_each do |item|
    	Purchase.create!(:item => item, :user_id => item.user_to_purchase) unless item.user_to_purchase.nil?
    end

    remove_column :items, :user_to_purchase
  end
end
