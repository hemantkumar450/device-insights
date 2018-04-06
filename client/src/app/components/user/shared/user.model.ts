export class UserModel {
  USER_ID: number = 0;
  FIRST_NAME: string = '';
  MIDDLE_NAME: string = '';
  LAST_NAME: string = '';
  EMAIL_ID: string = '';
  PASSWORD: string = '';
  CONFIRM_PASSWORD: string = '';
  IS_ACTIVE: boolean = false;
  RoleId: number = 0;
  LabId: number = 0;
  LabIds: Array<any> = [];
  ICON: string = '';
}
