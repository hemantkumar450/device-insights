let IMChecklistController = {};
let Promise = require("bluebird");
global.checklistArrayIndex = 0;


IMChecklistController.getChecklists = (req, res) => {
    let LAB_ID = req.param('labId');
    let INSTR_ID = req.param('INSTR_ID');
    let FREQ_ID = req.param('FREQ_ID');
    let monthId = req.param('monthId');
    let yearId = req.param('yearId');
    let query = 'EXEC spGetIMChecklist ' + LAB_ID + ','
        + INSTR_ID + ','
        + FREQ_ID + ','
        + monthId + ','
        + yearId;

    let imChecklistQuery = Promise.promisify(IMChecklist.query);

    imChecklistQuery(query).then((checklists) => {
        let obj = { Data: [], TotalRecords: 0 };
        if (checklists) {
            obj.Data = checklists;
            obj.TotalRecords = checklists.length === 0 ? 0 : checklists.length
        }
        res.json(obj);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}


IMChecklistController.saveChecklist = (req, res) => {
    let checklistObj = req.body;
    let itemArray = Object.getOwnPropertyNames(checklistObj.data).sort();
    let date = formatDate();
    if (checklistObj.data.isEdit) {
        date = checklistObj.DATE;
    }

    checklistArrayIndex = 0;

    itemArray.forEach((itemName) => {
        IMItem.findOne({
            LAB_ID: checklistObj.LAB_ID,
            FREQ_ID: checklistObj.FREQ_ID,
            INSTR_ID: checklistObj.INSTR_ID,
            ITEM_NAME: itemName
        }).then(item => {
            if (item) {
                let obj = {
                    item: item,
                    checklistObj: checklistObj,
                    date: date,
                    itemArrayLength: itemArray.length,
                    USER_ID: req.token.user.USER_ID,
                    response: res
                }
                saveChecklistByObj(obj);
            } else {
                return;
            }
        });
    });
}

function saveChecklistByObj(obj) {
    let query = 'EXEC spSaveIMChecklist ' + obj.checklistObj.LAB_ID + ','
        + obj.checklistObj.INSTR_ID + ','
        + obj.checklistObj.FREQ_ID + ','
        + obj.item.ITEM_ID + ",'"
        + obj.date + "','"
        + obj.checklistObj.data[obj.item.ITEM_NAME] + "',"
        + obj.USER_ID;
    let imChecklistQuery = Promise.promisify(IMChecklist.query);
    imChecklistQuery(query).then((frequency) => {
        checklistArrayIndex++;
        if (obj.checklistObj.data.isEdit) {
            if (checklistArrayIndex === obj.itemArrayLength - 6) {
                obj.response.json(null);
            }
        } else {
            if (checklistArrayIndex === obj.itemArrayLength - 2) {
                obj.response.json(null);
            }
        }
    }).catch((error) => {
        if (error) return obj.response.status(500).send('Error in serving request.');
    });
}

IMChecklistController.getChecklistMonthDDO = (req, res) => {
    let LAB_ID = req.param('LAB_ID');
    let query = ' SELECT DISTINCT(MONTH(DATE)) MONTH FROM IM_CHECKLIST WHERE LAB_ID=' + LAB_ID
        + ' ORDER BY MONTH ASC';

    let imChecklistQuery = Promise.promisify(IMChecklist.query);
    imChecklistQuery(query).then((months) => {
        res.json(months);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMChecklistController.getChecklistYearDDO = (req, res) => {
    let LAB_ID = req.param('LAB_ID');
    let query = ' SELECT DISTINCT(YEAR(DATE)) YEAR FROM IM_CHECKLIST WHERE LAB_ID=' + LAB_ID
        + ' ORDER BY YEAR ASC';

    let imChecklistQuery = Promise.promisify(IMChecklist.query);
    imChecklistQuery(query).then((years) => {
        res.json(years);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMChecklistController.deleteChecklist = (req, res) => {
    let checklistObj = req.body;
    let query = 'EXEC spDeleteIMChecklistById ' + checklistObj.LAB_ID + ','
        + checklistObj.INSTR_ID + ','
        + checklistObj.FREQ_ID + ",'"
        + checklistObj.DATE + "'";

    let imChecklistQuery = Promise.promisify(IMChecklist.query);
    imChecklistQuery(query).then((compounds) => {
        res.json('deleted successfully');
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}


function formatDate() {
    let dateobj = '';
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hours = d.getHours(),
        minutes = d.getMinutes(),
        seconds = d.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    dateobj = [year, month, day].join('-');
    return dateobj + ' ' + hours + ':' + minutes + ':' + seconds;
}

module.exports = IMChecklistController;