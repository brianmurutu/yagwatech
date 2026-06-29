import { site } from "./site";

interface EmailWrapperOptions {
  title: string;
  preheader?: string;
}

export function getBrandedEmailHtml(contentHtml: string, options: EmailWrapperOptions) {
  const logoUrl = `${site.url}/images/logo.jpg`;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #F7F9FC;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        color: #1A1A2E;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      table {
        border-collapse: collapse;
        border-spacing: 0;
      }
      img {
        max-width: 100%;
        height: auto;
      }
      a {
        color: #0B3D91;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #F7F9FC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    ${options.preheader ? `<span style="display:none;font-size:1px;color:#F7F9FC;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${options.preheader}</span>` : ""}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F7F9FC; padding: 32px 16px;">
      <tr>
        <td align="center" valign="top">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #EEF1F7; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);">
            <!-- Header -->
            <tr>
              <td style="padding: 24px 32px; border-bottom: 3px solid #F47B20; background-color: #FFFFFF;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" valign="middle">
                      <a href="${site.url}" target="_blank">
                        <img src="${logoUrl}" alt="${site.name}" height="40" style="height: 40px; width: auto; display: block; border: 0; outline: none;" />
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Content Body -->
            <tr>
              <td style="padding: 32px 32px; background-color: #FFFFFF;">
                ${contentHtml}
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="padding: 32px 32px; background-color: #F7F9FC; border-top: 1px solid #EEF1F7; text-align: center;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" style="font-size: 13px; color: #5A6680; line-height: 1.6; padding-bottom: 16px;">
                      <strong style="color: #1A1A2E;">${site.name}</strong><br />
                      ${site.address}<br />
                      Phone: <a href="tel:${site.phoneRaw}" style="color: #5A6680; font-weight: 500;">${site.phone}</a> &middot; Email: <a href="mailto:${site.email}" style="color: #5A6680; font-weight: 500;">${site.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                        <tr>
                          <td style="padding: 0 8px;">
                            <a href="${site.social.linkedin}" target="_blank" style="font-size: 12px; color: #0B3D91; font-weight: 600; text-decoration: none;">LinkedIn</a>
                          </td>
                          <td style="font-size: 12px; color: #EEF1F7;">&bull;</td>
                          <td style="padding: 0 8px;">
                            <a href="${site.social.whatsapp}" target="_blank" style="font-size: 12px; color: #F47B20; font-weight: 600; text-decoration: none;">WhatsApp</a>
                          </td>
                          <td style="font-size: 12px; color: #EEF1F7;">&bull;</td>
                          <td style="padding: 0 8px;">
                            <a href="${site.url}" target="_blank" style="font-size: 12px; color: #0B3D91; font-weight: 600; text-decoration: none;">Website</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size: 11px; color: #5A6680; padding-top: 24px; line-height: 1.4;">
                      This is an automated message from ${site.name}. Please do not reply directly to this sending address if it is not monitored.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}
