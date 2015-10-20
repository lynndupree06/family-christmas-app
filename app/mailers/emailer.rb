class Emailer < ActionMailer::Base
  default from: 'jkazembe@twc.com'

  def send_reminder_email(user)
    @user = user
    mail(:to => user.email,
         :subject => "It's Holiday Season!")
  end
end
