import { emailBase, emailButton, emailHeading, emailText, emailDivider, emailSmall } from './_base'

export function passwordResetEmail() {
  return emailBase({
    preheader: 'Reset your Servvee password — link expires in 1 hour',
    body: [
      emailHeading('Reset your password'),
      emailText('We received a request to reset the password for <strong style="color:#EEEEEE;">{{ .Email }}</strong>. Click the button below to choose a new password.'),
      emailButton('{{ .ConfirmationURL }}', 'Reset My Password'),
      emailDivider(),
      emailSmall('This link expires in <strong style="color:#EEEEEE;">1 hour</strong>. If you didn\'t request a password reset, you can safely ignore this email — your password won\'t change.'),
    ].join(''),
  })
}
