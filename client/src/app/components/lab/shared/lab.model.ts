import { UserModel } from '../../user/shared';

export class LabModel {
  LAB_ID: number = 0;
  LAB_NAME: string = '';
  ADDR: string = '';
  CITY: string = '';
  ZIP: string = '';
  FAX: string = '';
  EMAIL: string = '';
  PHONE: string = '';
  CODE: string = '';
  STATE_ID: number = 0;
  ICON: string = '';
  LATITUTE: number = 0;
  LONGITUTE: number = 0;
  User: UserModel = new UserModel();
  ModuleIds: Array<number> = [];
  IS_ACTIVE: boolean = false;
}
