let moduleService = {};
let DefaultModule = {
    QualityControl: 1,
    SmartLabMonitoring: 2,
    SmartMaintenance: 3,
    Analytics: 4,

}


moduleService.getModules = () => {
    return DefaultModule;
}

module.exports = moduleService;