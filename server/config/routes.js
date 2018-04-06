module.exports.routes = {
  '/': {
    view: 'index.html'
  },


  /* Login Controller */
  'post /switchLabLogin': 'DeviceInsights/LoginController.switchLabLogin',
  'post /login': 'DeviceInsights/LoginController.login',


  /* User Controller */
  'get /user/list/:isAppAdmin': 'DeviceInsights/UserController.getUsers',
  'get /user/:userId': 'DeviceInsights/UserController.getUserById',
  'get /emailValidate/:emailId': 'DeviceInsights/UserController.emailValidate',
  'post /user': 'DeviceInsights/UserController.saveUser',
  'delete /user/delete/:id': 'DeviceInsights/UserController.deleteUser',
  'delete /user/profileImage/delete/:id': 'DeviceInsights/UserController.deleteProfileImageById',
  'get /user/changePassword/:password': 'DeviceInsights/UserController.changePassword',
  'get /user/changePassword/:password/:userId': 'DeviceInsights/UserController.changeSuperUserPassword',


  /* Lab Controller */
  'get /lab/ddo/applicationUser': 'DeviceInsights/LabController.getLabDDOApplicationUser',
  'get /lab/list': 'DeviceInsights/LabController.getLabs',
  'get /lab/:labId': 'DeviceInsights/LabController.getLabById',
  'get /lab/activate/:labId': 'DeviceInsights/LabController.activateLab',
  'post /lab': 'DeviceInsights/LabController.saveLab',
  'put /lab': 'DeviceInsights/LabController.updateLab',
  'delete /lab/delete/:id': 'DeviceInsights/LabController.deleteLab',
  'get /lab/getIconById/:id': 'DeviceInsights/LabController.getIconById',
  'get /lab/master/ddo': 'DeviceInsights/LabController.getLabDDO',


  /* State Controller */
  'get /state/ddo': 'DeviceInsights/stateController.getStateDDO',

  /* Module Controller */
  'get /module/ddo': 'DeviceInsights/moduleController.getModuleDDO',
  'post /module': 'DeviceInsights/moduleController.getModule',

  /* reset Password Controller */
  'get /emailVerification/:email': 'DeviceInsights/resetPasswordController.emailVerification',
  'get /checkToken/:token': 'DeviceInsights/resetPasswordController.checkToken',
  'get /resetPassword/:userId/:password': 'DeviceInsights/resetPasswordController.resetPassword',


  /* PowerBIEmbedToken Control Controller */
  'get /powerBIEmbedToken/getLJChart/:labId/:moduleId': 'DeviceInsights/powerBIEmbedTokenController.getEmbedTokenForPowerBi',


  /* DI PBI Reports Controller */
  'get /DI/pbiReports/list': 'DeviceInsights/pbiReportsController.getPBIReports',
  'get /DI/pbiReports/getPBIReportById/:LAB_ID/:MODULE_ID': 'DeviceInsights/pbiReportsController.getPBIReportById',
  'post /DI/pbiReports': 'DeviceInsights/pbiReportsController.savePBIReports',
  'delete /DI/pbiReports/delete/:LAB_ID/:MODULE_ID': 'DeviceInsights/pbiReportsController.deletePBIReports',


  /* Sensor Type Controller */
  'get /sensorType/list': 'DeviceInsights/SMSensorTypeController.getSensorTypes',
  'get /sensorType/ddo': 'DeviceInsights/SMSensorTypeController.getSensorTypeDDO',
  'post /sensorType': 'DeviceInsights/SMSensorTypeController.saveSensorType',
  'delete /sensorType/delete/:id': 'DeviceInsights/SMSensorTypeController.deleteSensorType',


  /* SmartLabLocation Controller */
  'get /smartLabLocation/list': 'SmartMonitoring/SMLocationController.getLocations',
  'get /smartLabLocation/ddo': 'SmartMonitoring/SMLocationController.getLocationDDO',
  'post /smartLabLocation': 'SmartMonitoring/SMLocationController.saveLocation',
  'delete /smartLabLocation/delete/:id': 'SmartMonitoring/SMLocationController.deleteLocation',

  /* SmartLab Device Controller */
  'get /smartLabDevice/list': 'SmartMonitoring/SMSensorController.getDevices',
  'get /smartLabDevice/:id': 'SmartMonitoring/SMSensorController.getDeviceById',
  'get /smartLabDevice/:locationId/:sensorTypeId/:startDate/:endDate': 'SmartMonitoring/SMSensorController.getHumidityAndTemp',
  'post /smartLabDevice': 'SmartMonitoring/SMSensorController.saveDevice',
  'delete /smartLabDevice/delete/:id': 'SmartMonitoring/SMSensorController.deleteDevice',
  'get /getAdminEmails': 'SmartMonitoring/SMSensorController.getLabAdminEmail',


  /* smartLab Report Controller */

  'get /smartLabReport/generatePdf/:startDate/:endDate': 'SmartMonitoring/SMReportController.generateReport',
  'get /smartLabReport/list': 'SmartMonitoring/SMReportController.getReports',
  'delete /smartLabReport/deleteSMReportPdf/:labId/:reportId': 'SmartMonitoring/SMReportController.deleteSMReportPdf',

  /* QC Adj Mean Controller */

  'post /qualityControl/adjMeanSD': 'QualityControl/qcAdjMeanController.saveAdjMeanSD',
  'get /qualityControl/getAdjMeanSD': 'QualityControl/qcAdjMeanController.getAdjMeanSD',
  'get /qualityControl/adjMean/year/ddo/:labId': 'QualityControl/qcAdjMeanController.getAdjMeanYearDDO',
  'get /qualityControl/adjMean/month/ddo/:labId': 'QualityControl/qcAdjMeanController.getAdjMeanMonthDDO',

  /* QC Batch Controller */

  'get /qualityControl/batch/ddo/:monthId/:yearId/:dayId': 'QualityControl/qcBatchController.getQualityControlBatches',
  'delete /qualityControl/Result/delete/:batchId/:monthId/:yearId': 'QualityControl/qcBatchController.deleteQCResultByBatch',
  'post /qualityControl/updateBatchStatus': 'QualityControl/qcBatchController.updateBatchStatus',
  'post /qualityControl/reviewBatch': 'QualityControl/qcBatchController.reviewBatch',
  'post /qualityControl/reviewBatchByMonth': 'QualityControl/qcBatchController.reviewBatchByMonth',
  'get /qualityControl/getReviewBatchByMonth/:labId/:instrumentId/:yearId': 'QualityControl/qcBatchController.getReviewBatchByMonth',
  'post /qualityControl/saveReviewBatchByMonth': 'QualityControl/qcBatchController.saveReviewBatchByMonth',
  'delete /qualityControl/deleteReviewBatchByMonth/:labId/:instrumentId/:monthId/:yearId': 'QualityControl/qcBatchController.deleteReviewBatchByMonth',
  'post /qualityControl/uploadReviewBatchFile': 'QualityControl/qcBatchController.uploadReviewBatchFile',
  'delete /qualityControl/deleteReviewBatchFile/:labId/:instrumentId/:monthId/:yearId': 'QualityControl/qcBatchController.deleteReviewBatchFile',
  'post /qualityControl/updateReviewBatchStatus': 'QualityControl/qcBatchController.updateReviewBatchStatus',

  /* Quality Control Controller */

  'get /qualityControl/instruments/ddo/:labId': 'QualityControl/qcResultController.instrumentDDO',
  'get /qualityControl/compound/ddo/:labId/:instrumentId': 'QualityControl/qcResultController.compoundDDOByInstrumentId',
  'get /qualityControl/meanSD': 'QualityControl/qcResultController.getMeanSD',
  'get /qualityControl/mean/month/ddo/:labId': 'QualityControl/qcResultController.getMeanMonthDDO',
  'get /qualityControl/review/month/ddo/:labId/:yearId': 'QualityControl/qcResultController.getReviewMonthDDO',
  'get /qualityControl/mean/year/ddo/:labId/:instrumentId': 'QualityControl/qcResultController.getMeanYearDDO',
  'get /qualityControl/result/compound/ddo/:instrumentId': 'QualityControl/qcResultController.getQCCompoundDDO',
  'get /qualityControl/getResults/:instrumentId/:batchId/:yearId/:monthId/:dayId/:compoundId/:status': 'QualityControl/qcResultController.getResults',
  'post /qualityControl/resultGridRow': 'QualityControl/qcResultController.saveResultGridRow',


  /* QCReading Controller  */

  'post /qualityControl/saveResultJson': 'QualityControl/qcReadingController.saveQualityControlJson',
  'get /qualityControl/getCompoundByLabAndInstrument/:labId/:instrumentId': 'QualityControl/qcReadingController.getCompoundByLabAndInstrument',
  'get /qualityControl/getMethodByLabAndInstrument/:labId/:instrumentId': 'QualityControl/qcReadingController.getMethodByLabAndInstrument',


  /* QC Compound Controller  */
  'get /qualityControl/getCompounds/:instrumentId': 'QualityControl/qcCompoundController.getQualityControlCompounds',
  'post /qualityControl/compound': 'QualityControl/qcCompoundController.saveQCCompound',
  'delete /qualityControl/compound/delete/:id': 'QualityControl/qcCompoundController.deleteQCCompound',


  /* QC Method Controller  */
  'get /qualityControl/getMethods/:instrumentId': 'QualityControl/QCMethodController.getQualityControlMethods',
  'post /qualityControl/method': 'QualityControl/QCMethodController.saveQCMethod',
  'delete /qualityControl/method/delete/:id': 'QualityControl/QCMethodController.deleteQCMethod',
  'get /qualityControl/compoundMethod/ddo/:labId/:instrumentId': 'QualityControl/QCMethodController.compoundMethodDDOByInstrumentId',


  /* QC Instrument Controller  */
  'get /qualityControl/instrument/ddo': 'QualityControl/QCInstrumentController.getQualityControlInstrumentDDO',
  'get /qualityControl/getInstruments': 'QualityControl/QCInstrumentController.getQualityControlInstruments',
  'post /qualityControl/instrument': 'QualityControl/QCInstrumentController.saveQCInstrument',
  'delete /qualityControl/instrument/delete/:id': 'QualityControl/QCInstrumentController.deleteQCInstrument',

  /* QC Reason Controller  */
  'get /qualityControl/getReasons': 'QualityControl/QCReasonController.getQualityControlReasons',
  'post /qualityControl/reason': 'QualityControl/QCReasonController.saveQCReason',
  'delete /qualityControl/reason/delete/:id': 'QualityControl/QCReasonController.deleteQCReason',
  'get /qualityControl/reason/ddo': 'QualityControl/QCReasonController.getQCReasonDDO',


  /* IM Frequency Controller */
  'get /smartMaintenance/frequency/ddo': 'InstrumentMaintanance/IMFrequenvyController.getFrequencyDDO',
  'get /smartMaintenance/getFrequencies': 'InstrumentMaintanance/IMFrequenvyController.getFrequencies',
  'get /smartMaintenance/getFrequencyById/:freqId': 'InstrumentMaintanance/IMFrequenvyController.getFrequencyById',
  'post /smartMaintenance/frequency': 'InstrumentMaintanance/IMFrequenvyController.saveFrequency',

  /* IM Instrument Controller */
  'get /smartMaintenance/instrument/ddo/:labId': 'InstrumentMaintanance/IMInstrumentController.getInstrumentDDO',
  'get /smartMaintenance/getInstruments/:labId': 'InstrumentMaintanance/IMInstrumentController.getMasterInstruments',
  'post /smartMaintenance/instrument': 'InstrumentMaintanance/IMInstrumentController.saveMasterInstrument',
  'delete /smartMaintenance/instrument/delete/:id': 'InstrumentMaintanance/IMInstrumentController.deleteMasterInstrument',

  'get /smartMaintenance/getInstrumentFrequencies/:labId': 'InstrumentMaintanance/IMInstrumentController.getInstrumentFrequencies',
  'post /smartMaintenance/instrumentFrequency': 'InstrumentMaintanance/IMInstrumentController.saveInstrumentFrequency',
  'delete /smartMaintenance/instrumentFrequency/delete/:id': 'InstrumentMaintanance/IMInstrumentController.deleteInstrumentFrequency',

  /* IM Item Controller */
  'get /smartMaintenance/item/ddo/:labId': 'InstrumentMaintanance/IMItemController.getItemDDO',
  'get /smartMaintenance/getitems/:labId/:INSTR_ID/:FREQ_ID': 'InstrumentMaintanance/IMItemController.getItems',
  'get /smartMaintenance/getItemByFrequency/:FREQ_ID/:INSTR_ID': 'InstrumentMaintanance/IMItemController.getItemByFrequency',
  'post /smartMaintenance/item': 'InstrumentMaintanance/IMItemController.saveItem',
  'delete /smartMaintenance/item/delete/:id': 'InstrumentMaintanance/IMItemController.deleteItem',

  /* IM Item Mapping Controller */
  'get /smartMaintenance/itemMapping/ddo/:labId/:INSTR_ID/:FREQ_ID/:ITEM_ID': 'InstrumentMaintanance/IMitemMappingController.getItemMappingDDO',
  'get /smartMaintenance/getitemMapping/:labId/:INSTR_ID/:FREQ_ID': 'InstrumentMaintanance/IMitemMappingController.getItemMapping',
  'post /smartMaintenance/itemMapping': 'InstrumentMaintanance/IMitemMappingController.saveItemMapping',
  'delete /smartMaintenance/itemMapping/delete/:id': 'InstrumentMaintanance/IMitemMappingController.deleteItemMapping',


  /* IM CHecklist Controller */
  'get /smartMaintenance/getchecklists/:labId/:INSTR_ID/:FREQ_ID/:monthId/:yearId': 'InstrumentMaintanance/IMChecklistController.getChecklists',
  'post /smartMaintenance/checklist': 'InstrumentMaintanance/IMChecklistController.saveChecklist',
  'get /smartMaintenance/checklist/month/ddo/:LAB_ID': 'InstrumentMaintanance/IMChecklistController.getChecklistMonthDDO',
  'get /smartMaintenance/checklist/year/ddo/:LAB_ID': 'InstrumentMaintanance/IMChecklistController.getChecklistYearDDO',
  'post /smartMaintenance/checklist/delete': 'InstrumentMaintanance/IMChecklistController.deleteChecklist',

  /* IM Smart Maintainance Report Controller */
  'post /smartMaintenance/generateReport': 'InstrumentMaintanance/IMReportController.generateReport',
  'get /smartMaintenance/report/list/:LAB_ID': 'InstrumentMaintanance/IMReportController.getReports',

};
