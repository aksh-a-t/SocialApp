const forgotTemplate = (username,link)=>{
    let createLink=`http://localhost:3000/forgot/${link}`;
    return `<html>
    <body>
        <p>Dear ${username},</p>
        <br/>
        <p>We have recieved a request to change your account password</p>
        <p>Click on the following link to proceed<p>
        <p>${createLink}</p>
        <p>Valid for 1 hour only</p>
        <strong>Note:</strong>
        <p>If it was not you do not click on link</p>
        <br/>
    </body>
    </html>`   
}
        // <p><a href=${createLink} target="_blank>Click Me</a></p>

module.exports = forgotTemplate;