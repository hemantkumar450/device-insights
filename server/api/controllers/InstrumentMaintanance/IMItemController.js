let IMItemController = {};
let Promise = require("bluebird");

IMItemController.getItems = (req, res) => {
    let LAB_ID = req.param('labId');
    let INSTR_ID = req.param('INSTR_ID');
    let FREQ_ID = req.param('FREQ_ID');

    let query = 'EXEC spGetIMItem ' + req.query.StartPageNo + ','
        + LAB_ID + ','
        + INSTR_ID + ','
        + FREQ_ID;

    let imItemQuery = Promise.promisify(IMItem.query);

    imItemQuery(query).then((item) => {
        let obj = {
            Data: item,
            TotalRecords: item.length === 0 ? 0 : item[0].TOTALCOUNT
        }
        res.json(obj);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMItemController.getItemDDO = (req, res) => {
    let LAB_ID = req.param('labId');
    let query = 'SELECT * FROM IM_ITEMS where LAB_ID=' + LAB_ID;
    let imItemQuery = Promise.promisify(IMItem.query);

    imItemQuery(query).then((item) => {
        res.json(item);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMItemController.getItemByFrequency = (req, res) => {
    let FREQ_ID = req.param('FREQ_ID');
    let INSTR_ID = req.param('INSTR_ID');
    let query = 'SELECT * FROM IM_ITEMS where FREQ_ID=' + FREQ_ID + ' and INSTR_ID=' + INSTR_ID;
    let imItemQuery = Promise.promisify(IMItem.query);
    imItemQuery(query).then((item) => {
        res.json(item);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMItemController.saveItem = (req, res) => {
    let item = req.body;

    let query = "EXEC spSaveIMItem "
        + item.LAB_ID + ','
        + item.INSTR_ID + ','
        + item.FREQ_ID + ','
        + item.ITEM_ID + ",'"
        + item.ITEM_NAME + "',"
        + item.ITEM_TYPE;
    let imItemQuery = Promise.promisify(IMItem.query);
    imItemQuery(query).then((item) => {
        res.json(item);
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

IMItemController.deleteItem = (req, res) => {
    let INSTR_ID = req.param('id');
    let query = 'EXEC spDeleteIMItemById ' + INSTR_ID;

    let imItemQuery = Promise.promisify(IMItem.query);
    imItemQuery(query).then((compounds) => {
        res.json('deleted successfully');
    }).catch((error) => {
        if (error) return res.status(500).send('Error in serving request.');
    });
}

module.exports = IMItemController;