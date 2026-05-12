import { emailBase, emailButton, emailHeading, emailText, emailDivider, emailSmall } from './_base'

export function confirmationEmail() {
  return emailBase({
    preheader: 'Confirm your email to activate your Servvee account',
    body: [
      emailHeading('Confirm your email'),
      emailText('Thanks for signing up for <strong style="color:#EEEEEE;">Servvee</strong> — your menu &amp; promo manager. One quick click and you\'re in.'),
      emailButton('{{ .ConfirmationURL }}', 'Confirm My Email'),
      emailDivider(),
      emailText('Once confirmed you can:'),
      `<ul style="margin:0 0 16px;padding-left:20px;font-size:14px;line-height:2;color:#888899;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <li>Add your Canva or Adobe Express menus</li>
        <li>Schedule holiday promos to go live automatically</li>
        <li>Embed your live menu anywhere on your website</li>
      </ul>`,
      emailDivider(),
      emailSmall('If you didn\'t create a Servvee account, you can safely ignore this email. This link expires in 24 hours.'),
    ].join(''),
  })
}
