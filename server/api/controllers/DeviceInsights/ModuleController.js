let moduleController = {};
let Promise = require("bluebird");

moduleController.getModuleDDO = (req, res) => {
  let query = 'select * from DI_MODULE';
  let moduleQuery = Promise.promisify(Module.query);

  moduleQuery(query).then((module) => {
    res.json(module);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

moduleController.getModule = (req, res) => {
  let moduleIds = req.body;
  if (moduleIds.length === 0) {
    return res.json(null);
  }

  let query = 'select * from DI_MODULE where MODULE_ID in (' + moduleIds + ')';
  let moduleQuery = Promise.promisify(Module.query);
  moduleQuery(query).then((module) => {
    res.json(module);
  }).catch((error) => {
    if (error) return res.status(500).send('Error in serving request.');
  });
}

module.exports = moduleController;
