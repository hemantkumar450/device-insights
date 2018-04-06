let loginController = {};
let bcrypt = require('bcrypt-nodejs');
let DefaultRole = {
    ApplicationAdmin: 1,
    SuperAdmin: 2,
    LabAdmin: 3,
    User: 4,
    SuperUser: 5
}
let Promise = require("bluebird");

loginController.login = (req, res) => {
    let user = {
        USER_ID: 0,
        FIRST_NAME: '',
        EMAIL_ID: '',
        RoleId: 0,
        LabIds: [],
        userIcon: '',
        ModuleIds: []
    };
    User.findOne({ EMAIL_ID: req.body.userName }).then(userObj => {
        if (userObj) {
            if (userObj.IS_ACTIVE) {
                bcrypt.compare(req.body.password, userObj.PASSWORD, (err, result) => {
                    if (result) {
                        user.USER_ID = userObj.USER_ID;
                        user.FIRST_NAME = userObj.FIRST_NAME;
                        user.EMAIL_ID = userObj.EMAIL_ID;
                        user.userIcon = userObj.ICON;

                        let getUserRoleQuery = UserRole.find({ USER_ID: user.USER_ID });
                        let getLabUserQuery = LabUser.find({ USER_ID: user.USER_ID });
                        let retriever = Promise.all([getUserRoleQuery, getLabUserQuery]);
                        retriever.then(results => {
                            user.RoleId = results[0][0].ROLE_ID;
                            let labUser = results[1];
                            let userLabArray = [];
                            labUser.forEach(labUser => {
                                if (labUser.USER_ID === user.USER_ID) {
                                    userLabArray.splice(userLabArray.length, 0, labUser.LAB_ID);
                                }
                            });
                            user.LabIds = userLabArray;
                            if (user.RoleId === DefaultRole.User || user.RoleId === DefaultRole.LabAdmin) {
                                findLabUser(user.USER_ID).then(labUser => {
                                    user.LabUser = labUser;
                                    if (user.LabUser) {
                                        let moduleIds = [];
                                        LabModule.find({ LAB_ID: user.LabUser.LAB_ID }).then(labModule => {
                                            labModule.forEach(item => {
                                                moduleIds.splice(moduleIds.length, 0, item.MODULE_ID);
                                            })
                                            user.ModuleIds = moduleIds;
                                            sendLoginToken(user, res);
                                        });
                                    }
                                });
                            } else {
                                sendLoginToken(user, res);
                            }
                        }).catch((error) => {
                            if (error) return res.status(500).send('Error in serving request.');
                        });
                    } else {
                        return res.status(400).send('EmailId & Password does not match');
                    }
                });
            } else {
                return res.status(400).send('Please contact to admin, This user is deactivated');
            }
        } else {
            return res.status(400).send('EmailId & Password does not match');
        }
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

loginController.switchLabLogin = (req, res) => {
    let loggedUser = req.token.user;
    let user = {
        USER_ID: loggedUser.USER_ID,
        FIRST_NAME: loggedUser.FIRST_NAME,
        EMAIL_ID: loggedUser.EMAIL_ID,
        RoleId: loggedUser.RoleId,
        LabIds: [],
        ModuleIds: []
    };
    user.LabIds.splice(user.LabIds.length, 0, req.body.LabId);
    let findLabModuleQuery = LabModule.find({ LAB_ID: user.LabIds[0] });
    let findLabActiveQuery = Lab.findOne({ LAB_ID: req.body.LabId });

    let retriever = Promise.all([findLabActiveQuery, findLabModuleQuery]);

    retriever.then(results => {
        let labResult = results[0];
        let labModuleResult = results[1];
        if (labResult.IS_ACTIVE) {
            labModuleResult.forEach(item => {
                user.ModuleIds.splice(user.ModuleIds.length, 0, item.MODULE_ID);
            });
            var token = jwToken.issue({
                user: user
            });
            let response = {
                success: true,
                message: 'token',
                access_token: token,
                userName: user.FIRST_NAME,
                emailId: user.EMAIL_ID,
                userId: user.USER_ID,
                roleId: user.RoleId,
                moduleIds: user.ModuleIds,
                labIds: user.LabIds,
                labName: ''
            }
            response.labName = labResult.LAB_NAME;
            res.json(response);

        } else {
            res.status(400).send('Contact to admin,Its Lab is Deactivated now')
        }

    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

function findLabUser(USER_ID) {
    return new Promise((resolve, reject) => {
        LabUser.find({ USER_ID: USER_ID }).then(labUser => {
            resolve(labUser[0]);
        }).catch((error) => {
            reject('Error in serving request.');
        });
    });
}

function sendLoginToken(user, res) {
    var token = jwToken.issue({
        user: user
    });
    let response = {
        success: true,
        message: 'token',
        access_token: token,
        userName: user.FIRST_NAME,
        emailId: user.EMAIL_ID,
        userId: user.USER_ID,
        roleId: user.RoleId,
        moduleIds: user.ModuleIds,
        labIds: user.LabIds,
        labName: '',
        userIcon: user.userIcon
    }

    if (user.superAdminId) {
        response.superAdminId = user.superAdminId;
    }

    let deactivatedCount = 0;
    if (user.LabIds.length > 0) {
        user.LabIds.forEach((labId, index) => {
            Lab.findOne({ LAB_ID: labId }).then(lab => {
                if (!lab.IS_ACTIVE) {
                    deactivatedCount++;
                }
                if (deactivatedCount === user.LabIds.length) {
                    res.status(400).send('Contact to admin,Its all Labs are Deactivated now')
                } else if (index + 1 === user.LabIds.length) {
                    response.labName = lab.LAB_NAME;
                    res.json(response);
                }
            }).catch((error) => {
                reject('Error in serving request.');
            });
        });
    } else {
        res.json(response);
    }
}

module.exports = loginController;