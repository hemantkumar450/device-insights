
module.exports.connections = {

  /***************************************************************************
  *                                                                          *
  * Local disk storage for DEVELOPMENT ONLY                                  *
  *                                                                          *
  * Installed by default.                                                    *
  *                                                                          *
  ***************************************************************************/
  localDiskDb: {
    adapter: 'sails-disk'
  },

  // sqlserver: {
  //   adapter: 'sails-mssqlserver',
  //   user: 'sa',
  //   password: 'World123',
  //   host: '96.11.225.222', // azure database 
  //   database: 'deviceinsights',
  //   connectionLimit: 0,
  //   pool: false,
  //   options: {
  //     encrypt: true   // use this for Azure databases 
  //   }

  // sqlserver: {
  //   adapter: 'sails-mssqlserver',
  //   user: 'neoradba',
  //   password: 'World@123',
  //   host: 'neora.database.windows.net', // azure database 
  //   database: 'qadeviceinsights',
  //   connectionLimit: 0,
  //   pool: false,
  //   options: {
  //     encrypt: true   // use this for Azure databases 
  //   }


  sqlserver: {
    adapter: 'sails-mssqlserver',
    user: 'sa',
    password: 'sa$123',
    host: 'localhost', // azure database 
    database: 'dv',
    connectionLimit: 0,
    multipleStatements: true,
    pool: false,
    options: {
      encrypt: true   // use this for Azure databases 
    }
  }
};
