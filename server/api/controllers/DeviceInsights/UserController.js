let bcrypt = require('bcrypt-nodejs');
var validator = require("email-validator");
var _ = require('lodash');
let Promise = require("bluebird");

let DefaultRole = {
  ApplicationAdmin: 1,
  SuperAdmin: 2,
  LabAdmin: 3,
  User: 4,
  SuperUser: 5
}
let userController = {};

userController.getUsers = (req, res) => {
  let isAppAdmin = false;
  isAppAdmin = (req.param('isAppAdmin') == 'true');
  let roleId = 0;
  if (isAppAdmin) {
    roleId = DefaultRole.LabAdmin;
  } else {
    roleId = req.token.user.RoleId;
  }

  let filterObj = { FIRST_NAME: '', EMAIL_ID: '', UserRole: '', LabNames: '', sortExpression: '' };
  filterObj.FIRST_NAME = req.query['Filter.FIRST_NAME'] === undefined ? '' : req.query['Filter.FIRST_NAME'];
  filterObj.EMAIL_ID = req.query['Filter.EMAIL_ID'] === undefined ? '' : req.query['Filter.EMAIL_ID'];
  filterObj.UserRole = req.query['Filter.USERROLE'] === undefined ? '' : req.query['Filter.USERROLE'];
  filterObj.LabNames = req.query['Filter.LABNAMES'] === undefined ? '' : req.query['Filter.LABNAMES'];
  filterObj.sortExpression = req.query['SortExpression'] === undefined ? '' : req.query['SortExpression'];

  if (roleId === DefaultRole.ApplicationAdmin) {
    let query = 'EXEC spGetAllUser ' + req.query.StartPageNo + ",'" +
      filterObj.FIRST_NAME + "','" +
      filterObj.EMAIL_ID + "','" +
      filterObj.UserRole + "','" +
      filterObj.LabNames + "'";
    // + filterObj.sortExpression + "'";
    let userQuery = Promise.promisify(User.query);

    userQuery(query).then((user) => {
      let obj = {
        Data: user,
        TotalRecords: user.length === 0 ? 0 : user[0].TOTALCOUNT
      }
      res.json(obj);
    }).catch((error) => {
      if (error) return res.status(500).send('Error in serving request.');
    });
  } else {
    let labIds = '';
    req.token.user.LabIds.forEach(id => {
      labIds += id + ',';
    });
    if (labIds.charAt(labIds.length - 1) == ',') {
      labIds = labIds.substr(0, labIds.length - 1);
    }
    let query = 'select * from DI_LAB_USER where LAB_ID in (' + labIds + ')';
    let labUserQuery = Promise.promisify(LabUser.query);

    labUserQuery(query).then((users) => {
      let userIds = '';
      users.forEach(user => {
        userIds += user.USER_ID + ',';
      });
      if (userIds.charAt(userIds.length - 1) == ',') {
        userIds = userIds.substr(0, userIds.length - 1);
      };
      let query = 'select * from DI_USER_ROLE where USER_ID in (' + userIds + ')';
      let userRoleQuery = Promise.promisify(UserRole.query)
      userRoleQuery(query).then(userRole => {
        userIds = '';
        userRole.forEach(user => {
          if (user.ROLE_ID !== DefaultRole.SuperAdmin || roleId !== DefaultRole.LabAdmin) {
            userIds += user.USER_ID + ',';
          }
        });

        if (userIds.charAt(userIds.length - 1) == ',') {
          userIds = userIds.substr(0, userIds.length - 1);
        };
        if (userIds !== '') {
          query = 'EXEC spGetUsersByRole ' + req.query.StartPageNo + ",'"
            + userIds + "'" + ",'"
            + filterObj.FIRST_NAME + "','"
            + filterObj.EMAIL_ID + "','"
            + filterObj.UserRole + "','"
            + filterObj.LabNames + "'";
          User.query(query, (err, user) => {
            if (err) return res.status(500).send('Error in serving request.');
            let obj = {
              Data: user,
              TotalRecords: user.length === 0 ? 0 : user[0].TOTALCOUNT
            }
            res.json(obj);
          });
        } else {
          res.json(null);
        }
      }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
      });
    }).catch((error) => {
      if (error) return res.status(500).send('Error in serving request.');
    });
  }
}

userController.getUserById = (req, res) => {
  let USER_ID = req.param('userId');
  User.findOne({ USER_ID: USER_ID }).then(user => {

    let userRolequery = UserRole.findOne({ USER_ID: user.USER_ID });
    let labUserQuery = LabUser.find({ USER_ID: user.USER_ID });
    let retriever = Promise.all([userRolequery, labUserQuery]);
    retriever.then(results => {
      let roleObj = results[0];
      let labUserObj = results[1];
      user.RoleId = roleObj.ROLE_ID;
      let labIds = [];
      labUserObj.forEach(item => {
        labIds.splice(labIds.length, 0, item.LAB_ID);
      });
      user.LabIds = labIds;
      user.PASSWORD = '';
      res.json(user);
    }).catch((error) => {
      if (error) return res.status(500).send('Error in serving request.');
    });
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

userController.saveUser = (req, res) => {
  User.findOne({ EMAIL_ID: req.body.EMAIL_ID }).then(user => {
    let userObj = req.body;
    if (userObj.USER_ID === 0 && user) {
      return res.status(500).send('This Email Id is already in use. Please change it or edit the existing one.');
    }
    let passwordUpdate = 0;
    let hashPassword = '';
    if (userObj.PASSWORD !== '') {
      hashPassword = bcrypt.hashSync(userObj.PASSWORD);
      passwordUpdate = 1;
    } else {
      passwordUpdate = 0;
    }

    let isEmailValid = validator.validate(userObj.EMAIL_ID);
    if (!isEmailValid) {
      return res.status(400).send('EmailId is not valid');
    }
    let query = "EXEC spSaveUser " +
      userObj.USER_ID + ",'" +
      userObj.FIRST_NAME + "','" +
      userObj.MIDDLE_NAME + "','" +
      userObj.LAST_NAME + "','" +
      userObj.EMAIL_ID + "','" +
      hashPassword + "'," +
      userObj.IS_ACTIVE + ",'" +
      userObj.ICON + "'," +
      req.token.user.USER_ID + ',' +
      passwordUpdate;

    let userQuery = Promise.promisify(User.query);

    userQuery(query).then((obj) => {
      let promisifiedUser = Promise.promisifyAll(User)
      let saveUserRoleQuery = promisifiedUser.queryAsync('EXEC spSaveUserRole ' + obj[0].USER_ID + ',' + req.body.RoleId);
      let deleteLabUserQuery = promisifiedUser.queryAsync('Delete from DI_LAB_USER where USER_ID = ' + obj[0].USER_ID);
      let retriever = Promise.all([saveUserRoleQuery, deleteLabUserQuery]);
      retriever.then(results => {
        let labIds = req.body.LabIds;
        if (req.body.RoleId === DefaultRole.ApplicationAdmin) {
          res.json(null);
        }
        labIds.forEach((labId, index) => {
          let saveLabUserQuery = 'EXEC spSaveLabUser ' + labId + "," + obj[0].USER_ID;
          let labUserQuery = Promise.promisify(LabUser.query);
          labUserQuery(saveLabUserQuery).then((result) => {
            if (labIds.length === index + 1) {
              res.json(null);
            }
          }).catch(error => {
            if (error) return res.status(500).send('Error in serving request.');
          });
        });
      }).catch(error => {
        if (error) return res.status(500).send('Error in serving request.');
      });
    }).catch((error) => {
      if (error) return res.status(500).send('Error in serving request.');
    });
  })
}

userController.emailValidate = (req, res) => {
  let emailId = req.param('emailId');
  let query = "EXEC spCheckEmailExist '" + emailId + "'";

  let userQuery = Promise.promisify(User.query);
  userQuery(query).then((item) => {
    res.json(item[0].ISEXIST);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

userController.deleteProfileImageById = (req, res) => {
  let USER_ID = req.param('id');
  let query = 'EXEC spDeleteUserProfileImage ' + USER_ID;

  let userQuery = Promise.promisify(User.query);
  userQuery(query).then((user) => {
    res.json(null);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

userController.deleteUser = (req, res) => {
  let USER_ID = req.param('id');
  if (+USER_ID === req.token.user.Id) {
    return res.status(400).send('You can not delete a signing user');
  } else {
    let query = 'EXEC spDeleteUser ' + USER_ID;
    let userQuery = Promise.promisify(User.query);
    userQuery(query).then((user) => {
      res.json(null);
    }).catch((error) => {
      if (error) return res.status(500).send('Error in serving request.');
    });
  }
}

userController.changePassword = (req, res) => {
  let password = req.param('password');
  let hashPassword = bcrypt.hashSync(password);
  let query = "Exec spUpdateUserPassword '" + hashPassword + "'," + req.token.user.USER_ID;


  let userQuery = Promise.promisify(User.query);
  userQuery(query).then((user) => {
    res.json(null);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

userController.changeSuperUserPassword = (req, res) => {
  let password = req.param('password');
  let userId = req.param('userId');
  let hashPassword = bcrypt.hashSync(password);
  let query = "Exec spUpdateUserPassword '" + hashPassword + "'," + userId;

  let userQuery = Promise.promisify(User.query);
  userQuery(query).then((user) => {
    res.json(null);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

module.exports = userController;