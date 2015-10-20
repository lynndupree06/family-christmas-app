desc "Clear everyone's lists"
task reset_list: :environment do
	Item.all.each do |item|
		item.delete
	end
end