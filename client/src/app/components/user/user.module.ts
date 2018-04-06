import { NgModule } from '@angular/core';
import { userRouting } from './user.routing';
import { SharedComponentModule } from '../shared/shared-component.module';

import {
  UserComponent,
  UserLeftNavbarComponent,
  UserService,
  UserEditComponent
} from './index';


@NgModule({
  imports: [
    SharedComponentModule,
    userRouting
  ],
  declarations: [
    UserComponent,
    UserLeftNavbarComponent,
    UserEditComponent
  ],
  providers: [
    UserService
  ]
})

export class UserModule { }
