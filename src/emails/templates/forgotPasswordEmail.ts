import mjml2html from 'mjml'

export const forgotPasswordEmail = (name: string, link: string) => {
    return mjml2html(`<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all padding="0px"></mj-all>
      <mj-text font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="0 25px" font-size="13px"></mj-text>
      <mj-section background-color="#eeeeee"></mj-section>
      <mj-class name="preheader" color="#000000" font-size="11px"></mj-class>
    </mj-attributes>
    <mj-style inline="inline">a { text-decoration: none!important; color: inherit!important; }</mj-style>
  </mj-head>
  <mj-body background-color="#eeeeee">
    <mj-section background-color="#ffffff" padding-bottom="20px" padding-top="10px" background-color="#eeeeee" border="1px solid #e0e0e0">
      <mj-column>
        <mj-text align="center" padding="10px 25px" font-size="20px"><strong>Hi ${name}!</strong></mj-text>
        <mj-text align="center" font-size="18px" font-family="Arial">You have requested a password change.</mj-text>
        <mj-button font-family="Helvetica" background-color="#212121" color="white !important" padding="20px 0 0 0" font-size="16px" href="#">
          Reset Password
        </mj-button>
        <mj-text align="center" font-size="18px" font-family="Arial" padding-top="20px">
          If you didn't request this, you can safely ignore this email and your password will not be changed.
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`)
}

