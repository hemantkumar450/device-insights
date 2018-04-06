let SMSensorController = {};
let iMonnitInfo = require('../../shared/Immonit');
const moment = require('node-moment');
let nodemailer = require('nodemailer');
var _ = require('lodash');
let Promise = require("bluebird");

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'deviceinsights2017@gmail.com',
    pass: 'deviceinsight'
  }
});

let DefaultRole = {
  ApplicationAdmin: 1,
  SuperAdmin: 2,
  LabAdmin: 3,
  User: 4
}


let protocol;
if (iMonnitInfo.protocol == "http") {
  protocol = require('http');
} else if (iMonnitInfo.protocol == "https") {
  protocol = require('https');
}

let postOptions = {
  "method": "GET",
  "hostname": "",
  "port": null,
  "path": "",
  "headers": {
    "cache-control": "no-cache"
  }
};

global.refreshIntervalArray = [];

SMSensorController.getDevices = (req, res) => {
  let LAB_ID = '';
  req.token.user.LabIds.forEach(id => {
    LAB_ID += id + ',';
  });
  if (LAB_ID.charAt(LAB_ID.length - 1) == ',') {
    LAB_ID = LAB_ID.substr(0, LAB_ID.length - 1);
  }

  query = 'EXEC spGetSMDevices ' + req.query.StartPageNo + ',' + LAB_ID;
  let smLabQuery = Promise.promisify(SmartLabSensor.query);
  smLabQuery(query).then((device) => {
    let obj = {
      Data: device,
      TotalRecords: device.length === 0 ? 0 : device[0].TOTALCOUNT
    }
    res.json(obj);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

SMSensorController.getHumidityAndTemp = (req, res) => {

  let startDate = req.param('startDate');
  startDate = new Date(startDate).toISOString().slice(0, 10);
  let endDate = req.param('endDate');
  endDate = new Date(endDate).toISOString().slice(0, 10);

  query = 'EXEC spGetSMHumidityAndTemperature ' + req.query.StartPageNo + ','
    + req.param('locationId') + ','
    + req.param('sensorTypeId') + ",'"
    + startDate + "','"
    + endDate + "'";

  let smSensorQuery = Promise.promisify(SmartLabSensor.query);
  smSensorQuery(query).then((result) => {
    let obj = {
      Data: result,
      TotalRecords: result.length === 0 ? 0 : result[0].TOTALCOUNT
    }
    res.json(obj);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

SMSensorController.getDeviceById = (req, res) => {
  let deviceId = req.param('id');
  SmartLabSensor.findOne({ SENSOR_ID: deviceId }).then(device => {
    res.json(device);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

SMSensorController.saveDevice = (req, res) => {
  let device = req.body;
  let labIdArray = req.token.user.LabIds;
  let LAB_ID = '';

  labIdArray.forEach(element => {
    LAB_ID += element + ',';
  });

  if (LAB_ID && LAB_ID.charAt(LAB_ID.length - 1) == ',') {
    LAB_ID = LAB_ID.substr(0, LAB_ID.length - 1);
  };

  let query = "EXEC spSaveSMDevice "
    + LAB_ID + ','
    + device.LOCATION_ID + ','
    + device.SENSOR_ID + ','
    + device.SENSOR_TYPE_ID + ','
    + device.SENSOR_FACTORY_ID + ",'"
    + device.SENSOR_FACTORY_CODE + "',"
    + device.UPPER_LIMIT + ','
    + device.LOWER_LIMIT + ','
    + device.FREQ_IN_MINUTES + ','
    + device.BATTERY;

  let smSensorQuery = Promise.promisify(SmartLabSensor.query);
  smSensorQuery(query).then((location) => {
    startSensorReading(location[0].SENSOR_ID, device.FREQ_IN_MINUTES, device.SENSOR_FACTORY_ID, LAB_ID);
    res.json(location);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

SMSensorController.deleteDevice = (req, res) => {
  let deviceId = req.param('id');
  let query = 'EXEC spDeleteSMDevice ' + deviceId;

  let smSensorQuery = Promise.promisify(SmartLabSensor.query);
  smSensorQuery(query).then((location) => {
    let obj = _.filter(refreshIntervalArray, x => x.deviceId === +deviceId)[0];
    clearInterval(obj.refreshIntervalId);
    res.json(null);
  }).catch(error => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}


SMSensorController.getLabAdminEmail = (req, res) => {
  let LAB_ID = req.token.user.LabIds[0];
  LabUser.find({ LAB_ID: LAB_ID }).then(labusers => {
    let userIdArr = '';
    labusers.forEach(labUser => {
      userIdArr += labUser.USER_ID + ',';
    });
    if (userIdArr.charAt(userIdArr.length - 1) == ',') {
      userIdArr = userIdArr.substr(0, userIdArr.length - 1);
    }
    let query = 'select * from DI_USER_ROLE where USER_ID in (' + userIdArr + ')';
    let userRoleQuery = Promise.promisify(UserRole.query);
    userRoleQuery(query).then(userRoles => {
      let UserIds = '';
      userRoles.forEach(item => {
        if (item.ROLE_ID === DefaultRole.LabAdmin) {
          UserIds += item.USER_ID + ',';
        }
      });
      if (UserIds.charAt(UserIds.length - 1) == ',') {
        UserIds = UserIds.substr(0, UserIds.length - 1);
      }

      let query = "exec spGetSMDeviceAdminDetails '" + UserIds + "'";
      let userQuery = Promise.promisify(User.query);
      userQuery(query).then(users => {
        let obj = { EMAIL_ID: [], PHONE: [] };
        users.forEach(item => {
          obj.EMAIL_ID.splice(obj.EMAIL_ID.length, 0, item.EMAIL_ID);
          obj.PHONE.splice(obj.PHONE.length, 0, item.PHONE);
        });
        res.json(obj);
      }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
      });
    }).catch((error) => {
      if (error) return res.status(500).send('Error in serving request.');
    });
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}


SMSensorController.reloadLabSensorReading = () => {
  let smSensorQuery = Promise.promisify(SmartLabSensor.query);
  let query = 'select SENSOR_ID,SENSOR_FACTORY_ID,LAB_ID,FREQ_IN_MINUTES from SM_SENSORS';
  smSensorQuery(query).then(smartLabSensor => {
    smartLabSensor.forEach(item => {
      startSensorReading(item.SENSOR_ID, item.FREQ_IN_MINUTES, item.SENSOR_FACTORY_ID, item.LAB_ID);
    })
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}


function startSensorReading(id, mins, senId, LAB_ID) {
  let interval = mins * 60 * 1000;
  let intervalObj = { sensorId: senId, LAB_ID: LAB_ID, deviceId: id, LAB_ID: +LAB_ID };
  let refreshIntervalId = setInterval((intervalObj) => {
    intervalFunc(intervalObj);
  }, interval, intervalObj);

  let obj = {
    deviceId: id,
    refreshIntervalId: refreshIntervalId,
    sensorId: senId,
    LAB_ID: +LAB_ID
  }
  refreshIntervalArray.push(obj);
}

function intervalFunc(senObj) {

  postOptions.hostname = iMonnitInfo.hostname;
  postOptions.path = iMonnitInfo.loginPath + "username=" + iMonnitInfo.username + "&password=" + iMonnitInfo.password;
  try {
    let req = protocol.request(postOptions, (res) => {
      if (res.statusCode !== 200) {
        console.log('got in callback error');
      };
      let chunks = [];
      let Token;
      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {

        let body = Buffer.concat(chunks);
        let a = null;

        try {
          a = JSON.parse(body);
        } catch (e) {
          return;
        }


        Token = a.Result;

        postOptions.path = iMonnitInfo.loginSuccess + a.Result;
        let req = protocol.request(postOptions, (res) => {
          if (res.statusCode !== 200) {
            console.log('got in callback error');
          };
          let chunks = [];

          res.on("data", (chunk) => {
            chunks.push(chunk);
          });

          res.on("end", () => {

            let body = Buffer.concat(chunks);

            postOptions.path = iMonnitInfo.sensorGetPath + Token + "?sensorID=" + senObj.sensorId;
            let req = protocol.request(postOptions, (res) => {
              if (res.statusCode !== 200) {
                console.log('got in callback error');
              };
              let chunks = [];

              res.on("data", (chunk) => {
                chunks.push(chunk);
              });

              res.on("end", () => {
                let body = Buffer.concat(chunks);
                let b = null;
                try {
                  b = JSON.parse(body);
                } catch (e){
                  return;
                }
                let reading ;

                if(b.Result){
                  reading = b.Result.CurrentReading;
                  let dateTime = (moment().format('MM/DD/YYYY'));
                  let curTime = (moment().format('HH:MM'));
                }else{
                  return;
                }

                if (reading) {
                  var separators = ['\\\°', '%'];
                  reading = reading.split(new RegExp(separators.join('|'), 'g'))[0];
                }

                reading = reading === undefined ? 0 : reading;

                let query = "EXEC spSaveSMSensorReading "
                  + senObj.deviceId + ","
                  // + dateTime + ' ' + curTime + "',"
                  + reading + ","
                  + senObj.LAB_ID;

                SmartLabSensorReading.query(query, (err, result) => {
                  if (err) {
                    console.log(err);
                    return;
                  };
                  readingNotification(senObj, reading);
                });
              });
            });
            req.end();
          });
        }).on('error', err => {
          req.abort();
        });
        req.end();
      }).on('error', err => {
        req.abort();
      });
      req.end();
    }).on('error', err => {
      req.abort();
    });
    req.end();
  } catch (error) {
    console.log('Catched', error);
    req.abort();
    return error;
  }

}

function stopSensorReading() {
  clearInterval(refreshIntervalId);
}

function readingNotification(sensorObj, reading) {

  LabUser.find({ LAB_ID: sensorObj.LAB_ID }).then(labusers => {
    let userIdArr = '';
    labusers.forEach(labUser => {
      userIdArr += labUser.USER_ID + ',';
    });
    if (userIdArr.charAt(userIdArr.length - 1) == ',') {
      userIdArr = userIdArr.substr(0, userIdArr.length - 1);
    }
    let smSensorQuery = Promise.promisify(SmartLabSensor.query);
    let query = 'select * from DI_USER_ROLE where USER_ID in (' + userIdArr + ')';
    smSensorQuery(query).then((userRoles) => {
      let UserIds = '';
      userRoles.forEach(item => {
        if (item.ROLE_ID === DefaultRole.LabAdmin) {
          UserIds += item.USER_ID + ',';
        }
      });
      if (UserIds.charAt(UserIds.length - 1) == ',') {
        UserIds = UserIds.substr(0, UserIds.length - 1);
      }
      getUserIds(UserIds, sensorObj.deviceId, reading);
    }).catch((error) => {
      if (error) return;
    });
  }).catch((error) => {
    if (error) return;
  });
}


function getUserIds(userIds, SENSOR_ID, reading) {
  let promisifiedSensor = Promise.promisifyAll(SmartLabSensorReading)

  let userQuery = promisifiedSensor.queryAsync('select EMAIL_ID from DI_USER where USER_ID in (' + userIds + ')');
  let sensorQuery = SmartLabSensor.findOne({ SENSOR_ID: SENSOR_ID });

  let retriever = Promise.all([userQuery, sensorQuery]);

  retriever.then(result => {
    let emailIds = '';
    result[0].forEach(item => {
      emailIds += item.EMAIL_ID + ' ,';
    });
    if (emailIds.charAt(emailIds.length - 1) == ',') {
      emailIds = emailIds.substr(0, emailIds.length - 1);
    }
    if (result[1] && +reading > result[1].UPPER_LIMIT
      || +reading < result[1].LOWER_LIMIT) {
      let isLimitUp = false;
      if (+reading > result[1].UPPER_LIMIT) {
        isLimitUp = true;
      }
      sendEmailEvent(emailIds, result[1], isLimitUp);
    } else {
      return;
    }
  });
}

function sendEmailEvent(emailIds, deviceDetail, isLimitUp) {
  let mailOptions = {
    from: 'deviceinsights2017@gmail.com',
    to: '',
    subject: '',
    text: '',
    html: ''
  };

  let htmlContent = '';

  mailOptions.to = emailIds;
  mailOptions.subject = 'Device reading notification (Device Insight)';
  htmlContent = 'Day Greetings <br><br> from <b>Device-Insights</b>,<br><br>';
  htmlContent += 'Your Device reading has been caught '
  if (isLimitUp) {
    htmlContent += 'higher.';
  } else {
    htmlContent += 'lower.';
  }
  htmlContent += 'Please review your device ASAP. Device details are given below :- <br><br>';
  htmlContent += 'SensorId : ' + deviceDetail.SENSOR_FACTORY_ID + '<br>';
  htmlContent += 'SensorCode : ' + deviceDetail.SENSOR_FACTORY_CODE + '<br>';
  htmlContent += 'Device Upper Limit : ' + deviceDetail.UPPER_LIMIT + '<br>';
  htmlContent += 'Device lower Limit : ' + deviceDetail.LOWER_LIMIT + '<br><br><br>';

  htmlContent += 'Best Regards,<br>';
  htmlContent += 'Team Device-Insights <br>';
  htmlContent += 'deviceinsights.io <br>';
  htmlContent += '614-495-0260';
  mailOptions.html = htmlContent;
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
    } else {
    }
  });
}

module.exports = SMSensorController;