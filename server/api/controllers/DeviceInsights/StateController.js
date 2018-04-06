let stateController = {};
let Promise = require("bluebird");


stateController.getStateDDO = (req, res) => {
  let query = 'select * from DI_STATE';

  let stateQuery = Promise.promisify(State.query);

  stateQuery(query).then((lab) => {
    res.json(lab);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

module.exports = stateController;