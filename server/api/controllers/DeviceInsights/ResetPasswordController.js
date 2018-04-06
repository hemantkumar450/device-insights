let resetPasswordController = {};
let bcrypt = require('bcrypt-nodejs');
let Promise = require("bluebird");

let transporter = nodemailerConfig.getEmailCredentials();
let mailOptions = nodemailerConfig.getMailOptions();


resetPasswordController.emailVerification = (req, res) => {
  let recieverEmail = req.param('email');
  let htmlContent = '';
  mailOptions.to = recieverEmail;
  mailOptions.subject = 'Reset password link(Device Insights)';

  User.findOne({ EMAIL_ID: recieverEmail }).then(user => {
    if (user) {
      if (user.IS_ACTIVE) {
        htmlContent = 'Day Greetings <br><br> from <b>Device-Insights</b>,<br><br>';
        htmlContent += 'Please click on this below link to reset your password <br>'

        let obj = {
          Id: user.USER_ID,
          Email: user.EMAIL_ID,
          FirstName: user.FIRST_NAME,
          LastName: user.LAST_NAME
        }

        let token = jwToken.issue({ user: obj });
        htmlContent += 'https://deviceinsights.azurewebsites.net/#/reset/' + token + '<br><br><br>';

        htmlContent += 'Best Regards,<br>';
        htmlContent += 'Team Device-Insights <br>';
        htmlContent += 'deviceinsights.io <br>';
        htmlContent += '614-495-0260';
        mailOptions.html = htmlContent;
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(400).send('Issue in sending Email.Please try after some time');
          }
        });
        res.json(null);
      } else {
        return res.status(400).send('Please contact to Admin. This user is inactive now');
      }
    } else {
      return res.status(400).send('OPPS! This email id is not register with us.');
    }
  });
}

resetPasswordController.checkToken = (req, res) => {
  let tokenObj = req.param('token');
  jwToken.verify(tokenObj, (err, token) => {
    if (err) return res.status(400).send('Invalid Token!');
    res.json(token.user)
  });
}

resetPasswordController.resetPassword = (req, res) => {
  let userId = req.param('userId');
  let password = req.param('password');
  let hashPassword = bcrypt.hashSync(password);
  let query = "Exec spUpdateUserPassword '" + hashPassword + "'," + userId;

  let userQuery = Promise.promisify(User.query);

  userQuery(query).then((sensorTypes) => {
    res.json(null);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

module.exports = resetPasswordController;