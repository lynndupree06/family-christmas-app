class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.string :title
      t.string :description
      t.string :link
      t.integer :importance
      t.belongs_to :user

      t.timestamps
    end
  end
end
