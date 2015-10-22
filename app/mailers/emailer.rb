class Emailer < ActionMailer::Base
  default from: 'lynndupree06@gmail.com'

  def send_reminder_email(user)
    @user = user
    @items = user.items.order(:importance).where(:status => 'Available', :archived => true)
    mail(:to => user.email,
         :subject => "It's Holiday Season!")
  end
end
