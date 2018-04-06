import { EmailValidateService } from '../../shared/services/email-validate.component';

export class SmartLabModel {

}

export class HumidityModel {

}

export class TemperatureModel {

}

export class ReportModel {
  REPORT_ID: number = 0;
  LAB_ID: number = 0;
  START_DATE: Date = new Date();
  END_DATE: Date = new Date();
  REPORT_LINK: string;
  COUNTNO: number = 0;
}

export class LocationModel {
  LOCATION_ID: number = 0;
  LOCATION_NAME: string = '';
  LAB_ID: number = 0;
  isEdit: boolean = false;
}

export class DeviceModel {
  LAB_ID: number = 0;
  LOCATION_ID: number = 0;
  SENSOR_ID: number = 0;
  SENSOR_TYPE_ID: number = 0;
  SENSOR_FACTORY_ID: number = 0;
  SENSOR_FACTORY_CODE: string = '';
  UPPER_LIMIT: number = 0;
  LOWER_LIMIT: number = 0;
  FREQ_IN_MINUTES: number = 0;
  BATTERY: number = 0;
}

