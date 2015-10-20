desc "Clear everyone's lists"
task reset_list: :environment do
	Item.all.each do |item|
		unless item.status == 'Available'
			item.destroy
		else
			item.archived = true
			item.save!
		end
				
	end
end