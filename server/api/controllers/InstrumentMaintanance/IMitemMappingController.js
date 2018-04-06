let IMitemMappingController = {};
let Promise = require("bluebird");

let DefaultRole = {
    ApplicationAdmin: 1,
    SuperAdmin: 2,
    LabAdmin: 3,
    User: 4,
    SuperUser: 5
}

IMitemMappingController.getItemMapping = (req, res) => {
    let LAB_ID = req.param('labId');
    let INSTR_ID = req.param('INSTR_ID');
    let FREQ_ID = req.param('FREQ_ID');
    let query = 'EXEC spGetIMItemMapping ' + req.query.StartPageNo + ','
        + LAB_ID + ','
        + INSTR_ID + ','
        + FREQ_ID;

    let imItemMappingQuery = Promise.promisify(IMItemMapping.query);

    imItemMappingQuery(query).then((itemMapping) => {
        let obj = {
            Data: itemMapping,
            TotalRecords: itemMapping.length === 0 ? 0 : itemMapping[0].TOTALCOUNT
        }
        res.json(obj);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMitemMappingController.getItemMappingDDO = (req, res) => {
    let LAB_ID = req.param('labId');
    let INSTR_ID = req.param('INSTR_ID');
    let FREQ_ID = req.param('FREQ_ID');
    let ITEM_ID = req.param('ITEM_ID');

    IMItemMapping.find({
        LAB_ID: LAB_ID,
        INSTR_ID: INSTR_ID,
        FREQ_ID: FREQ_ID,
        ITEM_ID: ITEM_ID
    }).then(itemMapping => {
        if (itemMapping && itemMapping.length > 0) {
            res.json(itemMapping);
        } else {
            if (req.token.user.RoleId !== DefaultRole.ApplicationAdmin) {
                res.json(itemMapping);
            } else {
                return res.status(400).send('Please add map values(from ItemMapping tab) of respective Items');
            }
        }
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMitemMappingController.saveItemMapping = (req, res) => {
    let itemMapping = req.body;
    IMItem.findOne({
        LAB_ID: itemMapping.LAB_ID,
        INSTR_ID: itemMapping.INSTR_ID,
        FREQ_ID: itemMapping.FREQ_ID,
        sort: 'ITEM_ID ASC'
    }).then(item => {
        let query = "EXEC spSaveIMItemMapping "
            + itemMapping.LAB_ID + ','
            + itemMapping.INSTR_ID + ','
            + itemMapping.FREQ_ID + ','
            + item.ITEM_ID + ','
            + itemMapping.MAP_ID + ",'"
            + itemMapping.MAP_NAME + "'";

        let imItemMappingQuery = Promise.promisify(IMItemMapping.query);
        imItemMappingQuery(query).then((itemMapping) => {
            res.json(null);
        }).catch((error) => {
            if (error) return res.status(500).send('Error in serving request.');
        });
    });
}

IMitemMappingController.deleteItemMapping = (req, res) => {
    let MAP_ID = req.param('id');
    let query = 'EXEC spDeleteIMItemMapping ' + MAP_ID;

    let imItemMappingQuery = Promise.promisify(IMItemMapping.query);

    imItemMappingQuery(query).then((itemMapping) => {
        res.json('deleted successfully');
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}


module.exports = IMitemMappingController;