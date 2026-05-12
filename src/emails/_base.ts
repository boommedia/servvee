// Shared email wrapper — inline styles required for email client compatibility
export function emailBase({
  preheader,
  body,
}: {
  preheader: string
  body: string
}) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Servvee</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; background-color: #0D0D12; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .fluid { max-width: 100% !important; height: auto !important; }
      .stack-column, .stack-column-center { display: block !important; width: 100% !important; max-width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#0D0D12;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <!-- Email wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#0D0D12;">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <!-- Email container -->
        <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0" width="560" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:#16161E;border-radius:14px 14px 0 0;padding:28px 36px;border:1px solid #2A2A38;border-bottom:none;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background:linear-gradient(135deg,#BB6BD9,#E040FB);border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                          <span style="font-size:18px;font-weight:900;color:#ffffff;line-height:36px;">S</span>
                        </td>
                        <td style="padding-left:10px;vertical-align:middle;">
                          <span style="font-size:20px;font-weight:900;color:#EEEEEE;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">Serv<span style="color:#BB6BD9;">vee</span></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="font-size:9px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#BB6BD9;background:rgba(187,107,217,0.12);border:1px solid rgba(187,107,217,0.25);border-radius:20px;padding:4px 10px;">BOOM B.A.A.R.S</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#16161E;padding:36px 36px 28px;border-left:1px solid #2A2A38;border-right:1px solid #2A2A38;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0D0D12;border-radius:0 0 14px 14px;padding:20px 36px;border:1px solid #2A2A38;border-top:none;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;color:#888899;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                Servvee · Menu &amp; Promo Manager · Part of BOOM B.A.A.R.S
              </p>
              <p style="margin:0;font-size:11px;color:#555566;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
                &copy; 2026 BOOM Media &nbsp;&middot;&nbsp;
                <a href="https://servvee.online" style="color:#BB6BD9;text-decoration:none;">servvee.online</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:eric@boommedia.us" style="color:#555566;text-decoration:none;">Contact support</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// Reusable CTA button
export function emailButton(href: string, text: string) {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px auto;">
      <tr>
        <td style="border-radius:10px;background:linear-gradient(135deg,#BB6BD9,#E040FB);box-shadow:0 4px 20px rgba(187,107,217,0.4);">
          <a href="${href}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:-0.01em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;white-space:nowrap;">
            ${text}
          </a>
        </td>
      </tr>
    </table>`
}

export function emailHeading(text: string) {
  return `<h1 style="margin:0 0 12px;font-size:24px;font-weight:900;letter-spacing:-0.03em;color:#EEEEEE;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.2;">${text}</h1>`
}

export function emailText(text: string) {
  return `<p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:#888899;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${text}</p>`
}

export function emailDivider() {
  return `<hr style="border:none;border-top:1px solid #2A2A38;margin:24px 0;" />`
}

export function emailSmall(text: string) {
  return `<p style="margin:0;font-size:11px;line-height:1.6;color:#555566;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">${text}</p>`
}
