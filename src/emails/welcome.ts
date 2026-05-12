import { emailBase, emailButton, emailHeading, emailText, emailDivider, emailSmall } from './_base'

export function welcomeEmail({ firstName }: { firstName: string }) {
  return emailBase({
    preheader: `Welcome to Servvee, ${firstName}! Your menu manager is ready.`,
    body: [
      emailHeading(`Welcome aboard, ${firstName}!`),
      emailText('Your <strong style="color:#EEEEEE;">Servvee</strong> account is active. You can now manage your restaurant menus and holiday promos — all from one dashboard.'),
      emailButton('https://servvee.online/dashboard', 'Go to My Dashboard'),
      emailDivider(),
      emailText('<strong style="color:#EEEEEE;">Here\'s how to get started:</strong>'),
      `<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:16px;">
        ${[
          ['1', 'Add a menu', 'Paste your Canva or Adobe Express publish URL into a new menu slot.'],
          ['2', 'Copy your embed snippet', 'Grab the iframe code from Settings and drop it into your website.'],
          ['3', 'Schedule a holiday promo', 'Set a date range and Servvee automatically swaps your menu for the season.'],
        ].map(([num, title, desc]) => `
        <tr>
          <td width="32" style="vertical-align:top;padding-bottom:14px;">
            <div style="width:24px;height:24px;border-radius:50%;background:rgba(187,107,217,0.15);border:1px solid rgba(187,107,217,0.3);text-align:center;line-height:24px;font-size:11px;font-weight:800;color:#BB6BD9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${num}</div>
          </td>
          <td style="vertical-align:top;padding-bottom:14px;padding-left:10px;">
            <div style="font-size:13px;font-weight:700;color:#EEEEEE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin-bottom:3px;">${title}</div>
            <div style="font-size:12px;color:#888899;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.5;">${desc}</div>
          </td>
        </tr>`).join('')}
      </table>`,
      emailDivider(),
      emailSmall('Questions? Reply to this email or reach us at <a href="mailto:eric@boommedia.us" style="color:#BB6BD9;text-decoration:none;">eric@boommedia.us</a>'),
    ].join(''),
  })
}
