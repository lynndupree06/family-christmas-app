class Emailer < ActionMailer::Base
  default from: 'lynndupree06@gmail.com'

  def send_starting_email(user)
    @user = user
    @items = user.items.order(:importance).where(:status => 'Available', :archived => true)
    mail(:to => user.email,
         :subject => "It's Holiday Season!")
  end

  def send_reminder_email(user)
  	@user = user
    @items = user.items.order(:importance).where(:archived => false)
    
    @otherMembers = []
    index = 0
    otherMembersLists = User.all.to_json(:include => :items)
	JSON.parse(otherMembersLists).each do |member|
		count = 0

		if member['id'] != user.id
			member['items'].each do |item|
				count = count + 1 if !item['archived']
			end

			@otherMembers[index] = { :name => "#{member['first_name']} #{member['last_name']}", :items => count }

			index = index + 1
		end
	end

    mail(:to => user.email,
         :subject => "Are You Ready for Christmas?")
  end
end
