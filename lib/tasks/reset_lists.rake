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

desc "Email reminder to update list"
task email_reminder: :environment do
	User.all.each do |user|
		Emailer.send_reminder_email(user).deliver
	end
end