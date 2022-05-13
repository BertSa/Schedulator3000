package ca.bertsa.schedulator3000.helpers;

import ca.bertsa.schedulator3000.models.Mail;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MailHelper {
    private final JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String fromMail;

    public void sendMail(Mail mail) {
        SimpleMailMessage mailToSend = new SimpleMailMessage();
        mailToSend.setFrom(this.fromMail);
        mailToSend.setTo(mail.getTo());
        mailToSend.setSubject("Schedulator3000 - " + mail.getSubject());
        mailToSend.setText(mail.getBody());

        this.mailSender.send(mailToSend);
    }
}
