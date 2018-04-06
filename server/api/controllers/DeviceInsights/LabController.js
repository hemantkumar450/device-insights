let bcrypt = require('bcrypt-nodejs');
var validator = require("email-validator");
let Promise = require("bluebird");

let blobSvc = azureStorage.getBlobService();

let labController = {};

labController.getLabDDOApplicationUser = (req, res) => {
  let query = 'EXEC spViewLabForApplication';
  let labUserQuery = Promise.promisify(LabUser.query);

  labUserQuery(query).then((result) => {
    res.json(result)
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

labController.getLabs = (req, res) => {
  let labIdArray = req.token.user.LabIds;
  let labIds = '';
  let query = '';
  let filterObj = { LAB_NAME: '', EMAIL: '', ZIP: '', ADDR: '' };
  filterObj.LAB_NAME = req.query['Filter.LAB_NAME'] === undefined ? '' : req.query['Filter.LAB_NAME'];
  filterObj.EMAIL = req.query['Filter.EMAIL'] === undefined ? '' : req.query['Filter.EMAIL'];
  filterObj.ZIP = req.query['Filter.ZIP'] === undefined ? '' : req.query['Filter.ZIP'];
  filterObj.ADDR = req.query['Filter.ADDR'] === undefined ? '' : req.query['Filter.ADDR'];

  labIdArray.forEach(element => {
    labIds += element + ',';
  });

  if (labIds && labIds.charAt(labIds.length - 1) == ',') {
    labIds = labIds.substr(0, labIds.length - 1);
  };

  if (labIds !== '' && labIds !== undefined) {
    query = 'EXEC spGetLabsById ' + req.query.StartPageNo + ",'" + labIds + "'";
  } else {
    query = 'EXEC spGetAllLab ' + req.query.StartPageNo + ",'" + filterObj.LAB_NAME + "','" + filterObj.EMAIL + "','"
      + filterObj.ZIP + "','" + filterObj.ADDR + "'";
  }


  let labQuery = Promise.promisify(Lab.query);
  labQuery(query).then((lab) => {
    let obj = {
      Data: lab,
      TotalRecords: lab.length === 0 ? 0 : lab[0].TOTALCOUNT
    }
    res.json(obj);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

labController.getLabById = (req, res) => {
  let LAB_ID = req.param('labId');
  Lab.findOne({ LAB_ID: LAB_ID }).then(lab => {
    LabModule.find({ LAB_ID: lab.LAB_ID }).then(labModule => {
      let moduleIds = [];
      labModule.forEach(item => {
        moduleIds.splice(moduleIds.length, 0, item.MODULE_ID);
      });
      lab.ModuleIds = moduleIds;
      res.json(lab);
    }).catch((error) => {
      if (error) return res.status(500).send('Error in serving request.');
    });
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}


labController.getIconById = (req, res) => {
  let LAB_ID = req.param('id');
  Lab.findOne({ LAB_ID: LAB_ID }).then(lab => {
    res.json(lab.ICON);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}


labController.saveLab = (req, response) => {
  let lab = req.body;
  let user = req.body.User;

  let isEmailValid = validator.validate(lab.User.EMAIL_ID);
  if (!isEmailValid) {
    return response.status(400).send('EmailId is not valid');
  }
  findLabByEmail(lab.EMAIL).then((lab, err) => {
    if (lab != undefined) {
      return response.status(400).send('Lab is already exists with same EmailId');
    } else {
      let lab = req.body;
      var query = "EXEC spSaveLab "
        + lab.LAB_ID + ",'"
        + lab.LAB_NAME + "','"
        + lab.ADDR + "','"
        + lab.CITY + "','"
        + lab.ZIP + "','"
        + lab.FAX + "','"
        + lab.EMAIL + "','"
        + lab.PHONE + "','"
        + lab.CODE + "',"
        + lab.STATE_ID + ",'"
        + lab.ICON + "',"
        + lab.LATITUTE + ","
        + lab.LONGITUTE + ","
        + req.token.user.USER_ID + ","
        + lab.IS_ACTIVE;

      let labQuery = Promise.promisify(Lab.query);
      labQuery(query).then(lab => {
        let hashPassword = bcrypt.hashSync(user.PASSWORD);
        let promisifiedLab = Promise.promisifyAll(Lab);
        let azureCreateContainer = azureStorage.createContainer(lab[0].LAB_ID);
        let saveUserQuery = promisifiedLab.queryAsync("EXEC spSaveUser "
          + user.USER_ID + ",'"
          + user.FIRST_NAME + "','"
          + user.MIDDLE_NAME + "','"
          + user.LAST_NAME + "','"
          + user.EMAIL_ID + "','"
          + hashPassword + "',"
          + true + ','
          + null + ','
          + req.token.user.USER_ID + ','
          + 1);

        let retriever = Promise.all([azureCreateContainer, saveUserQuery])

        retriever.then(results => {
          let USER_ID = results[1][0].USER_ID;
          if (results[0] === 'created') {
            console.log('Folder created on azure storage successfully for lab Id ' + lab[0].LAB_ID);
          } else if (results[0] !== 'created') {
            console.log('Issue in creating lab folder on azure storage for lab Id ' + lab[0].LAB_ID);
          }
          let promisifiedLabDependent = Promise.promisifyAll(Lab);
          let saveUserRoleQuery = promisifiedLabDependent.queryAsync('EXEC spSaveUserRole '
            + USER_ID + ','
            + req.body.User.RoleId);
          let saveLabUserQuery = promisifiedLabDependent.queryAsync('EXEC spSaveLabUser '
            + lab[0].LAB_ID + ','
            + USER_ID);
          let deleteLabModule = promisifiedLabDependent.queryAsync('Delete from DI_LAB_MODULE where LAB_ID = '
            + lab[0].LAB_ID);

          let saveDetailRetriever = Promise.all([saveUserRoleQuery, saveUserRoleQuery, saveLabUserQuery, deleteLabModule]);
          saveDetailRetriever.then(results => {
            let LAB_ID = lab[0].LAB_ID;
            saveLabModule(LAB_ID, req.body.ModuleIds).then(result => {
              response.json(null);
            });
          }).catch(error => {
            if (error) return response.status(500).send('Error in serving request.');
          });
        }).catch(error => {
          if (error) return response.status(500).send('Error in serving request.');
        });
      }).catch((error) => {
        if (error) return response.status(500).send('Error in serving request.');
      });
    }
  }).catch((error) => {
    return response.status(500).send('Error in serving request.');
  });
}

labController.updateLab = (req, response) => {
  let lab = req.body;
  let user = req.body.User;
  let promisifiedLab = Promise.promisifyAll(Lab);

  let updateLabQuery = "EXEC spSaveLab "
    + lab.LAB_ID + ",'"
    + lab.LAB_NAME + "','"
    + lab.ADDR + "','"
    + lab.CITY + "','"
    + lab.ZIP + "','"
    + lab.FAX + "','"
    + lab.EMAIL + "','"
    + lab.PHONE + "','"
    + lab.CODE + "',"
    + lab.STATE_ID + ",'"
    + lab.ICON + "',"
    + lab.LATITUTE + ","
    + lab.LONGITUTE + ","
    + req.token.user.USER_ID + ","
    + lab.IS_ACTIVE;

  let deleteLabModule = promisifiedLab.queryAsync('Delete from DI_LAB_MODULE where LAB_ID = '
    + lab.LAB_ID);

  let findUser = User.findOne({ EMAIL_ID: req.body.EMAIL });

  let retriever = Promise.all([updateLabQuery, deleteLabModule, saveLabModule(lab.LAB_ID, req.body.ModuleIds), findUser])

  retriever.then(results => {
    if (user.PASSWORD) {
      if (results[3]) {
        let hashPassword = bcrypt.hashSync(user.PASSWORD);
        var saveUserQuery = "EXEC spSaveUser "
          + user.USER_ID + ",'"
          + user.FIRST_NAME + "','"
          + user.MIDDLE_NAME + "','"
          + user.LAST_NAME + "','"
          + user.EMAIL_ID + "','"
          + hashPassword + "',"
          + user.IS_ACTIVE + ","
          + null + ","
          + req.token.user.USER_ID + ','
          + 1;

        let userQuery = Promise.promisify(User.query);
        userQuery(saveUserQuery).then((result) => {
          response.json(result);
        }).catch((error) => {
          if (error) return response.status(500).send('Error in serving request.');
        });
      } else {
        response.json(null);
      }
    } else {
      response.json(null);
    }
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

labController.getLabDDO = (req, res) => {
  let query = 'select LAB_ID,LAB_NAME from DI_LAB';

  let labQuery = Promise.promisify(Lab.query);
  labQuery(query).then((lab) => {
    res.json(lab);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

labController.activateLab = (req, res) => {
  let LAB_ID = req.param('labId');
  let query = 'EXEC spActivateLab ' + LAB_ID;

  let labQuery = Promise.promisify(Lab.query);
  labQuery(query).then((lab) => {
    res.json(null);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

labController.deleteLab = (req, res) => {
  let LAB_ID = req.param('id');
  let query = 'EXEC spDeleteLab ' + LAB_ID;

  let labQuery = Promise.promisify(Lab.query);
  labQuery(query).then((lab) => {
    res.json(null);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}


function findLabByEmail(EMAIL) {
  return new Promise(function (resolve, reject) {
    Lab.findOne({ EMAIL: EMAIL }).then(lab => {
      resolve(lab);
    }).catch((error) => {
      reject('Error in serving request.');
    });
  });
}

function saveLabModule(LAB_ID, moduleIds) {
  return new Promise(function (resolve, reject) {
    moduleIds.forEach((moduleId, index) => {
      let query = 'EXEC spSaveLabModule ' + LAB_ID + "," + moduleId;
      let saveLabModuleQuery = Promise.promisify(LabModule.query);
      saveLabModuleQuery(query).then(result => {
        if (moduleIds.length === index + 1) {
          resolve(true);
        }
      }).catch(error => {
        reject('Error in serving request.');
      });
    });
  });
}


module.exports = labController;