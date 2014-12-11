class AddStatusColumnToItem < ActiveRecord::Migration
  def change
    add_column :items, :status, :string
    add_column :items, :user_to_purchase, :integer
  end
end
