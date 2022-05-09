const otpTemplate = (username,otp)=>{
    return `<html>
    <body>
        <p>Dear ${username},</p>
        <br/>
        <p>Welcome to Social Media. Thank you for singing up.</p>
        <p>Just to make sure that you are the one who signed up, we would like you to activate your
        account by submitting the provided otp<p>
        <h1>${otp}</h1><br/>
        <p>Valid for 1 hr only</p>
        <strong>Note:</strong>
        <p>If your account is not activated, it will be automatically deleted.</p>
        <p>If it was not you do not worry it will be deleted</p>
        <br/>
    </body>
    </html>`   
}

module.exports = otpTemplate;