import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { EmailValidateService } from './services/email-validate.component'
import { OnlyEntityName } from './directives/entity-name.directive';
import { emailValidate } from './directives/email-char-validation.directive';
import { phoneValidateInput } from './directives/phone-validation.directive';
import { passwordValidate } from './directives/password-validation.directive';
import { nameRestriction } from './directives/name-restriction.directive';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { TruncatePipe } from './pipe/truncate.pipe';
import { SmartLabLeftNavbarComponent } from '../smart-lab/smart-lab-left-navbar/smart-lab-left-navbar.component';

import {
  DropdownModule,
  DataTableModule,
  SharedModule,
  DialogModule,
  TreeTableModule,
  CalendarModule,
  CheckboxModule,
  PanelModule,
  GrowlModule,
  RadioButtonModule,
  ConfirmDialogModule,
  TreeModule,
  ButtonModule,
  MultiSelectModule,
  AccordionModule,
  DataGridModule,
  SelectButtonModule,
  MessagesModule,
  TooltipModule,
  FileUploadModule,
  OverlayPanelModule,
  ConfirmationService,
  AutoCompleteModule,
  TabViewModule,
  ChipsModule,
  InputSwitchModule,
  ToggleButtonModule
} from 'primeng/primeng';


import {
  ErrorComponent
} from '../../core';
import { GroupByPipe } from './pipe/groupBy.component';

import { PaginatorModule } from '../../core/paginator/paginator';

/*Directives*/
import { OnlyNumber } from './directives/number-only.directive';
import { OnlyAlphaNumeric } from './directives/alpa-numeric.directive';
import { OnlyDecimalNumber } from './directives/decimal-number.directive';
import { Autosize } from './directives/auto-resize.directive';
import {
  AccountFilterPipe,
  CurrencyPipe, FilterPipe, OrderByPipe, VendorFilterPipe, OrderByTable
} from './pipe/pipes.component';



@NgModule({
  imports: [
    AngularMultiSelectModule,
    FormsModule,
    BrowserModule,
    DropdownModule,
    DataTableModule,
    SharedModule,
    DialogModule,
    TreeTableModule,
    CalendarModule,
    CheckboxModule,
    PanelModule,
    GrowlModule,
    RadioButtonModule,
    ConfirmDialogModule,
    TreeModule,
    ButtonModule,
    MultiSelectModule,
    AccordionModule,
    DataGridModule,
    SelectButtonModule,
    MessagesModule,
    TooltipModule,
    FileUploadModule,
    AutoCompleteModule,
    ChipsModule,
    InputSwitchModule,
    ToggleButtonModule,
    AngularSvgIconModule,
    PaginatorModule,
    OverlayPanelModule,
    TabViewModule
  ],
  declarations: [
    ErrorComponent,
    OnlyNumber,
    Autosize,
    GroupByPipe,
    AccountFilterPipe,
    CurrencyPipe,
    FilterPipe,
    OrderByPipe,
    VendorFilterPipe,
    OrderByTable,
    OnlyAlphaNumeric,
    OnlyDecimalNumber,
    OnlyEntityName,
    emailValidate,
    phoneValidateInput,
    passwordValidate,
    nameRestriction,
    TruncatePipe,
    SmartLabLeftNavbarComponent
  ],
  providers: [
    ConfirmationService,
    EmailValidateService
  ],
  exports: [
    AngularMultiSelectModule,
    FormsModule,
    BrowserModule,
    DropdownModule,
    DataTableModule,
    SharedModule,
    DialogModule,
    TreeTableModule,
    CalendarModule,
    CheckboxModule,
    PanelModule,
    GrowlModule,
    RadioButtonModule,
    ConfirmDialogModule,
    TreeModule,
    ButtonModule,
    MultiSelectModule,
    AccordionModule,
    DataGridModule,
    SelectButtonModule,
    MessagesModule,
    TooltipModule,
    FileUploadModule,
    AutoCompleteModule,
    ChipsModule,
    InputSwitchModule,
    ToggleButtonModule,
    TabViewModule,
    AngularSvgIconModule,
    PaginatorModule,
    ErrorComponent,
    OnlyNumber,
    OnlyAlphaNumeric,
    OnlyDecimalNumber,
    Autosize,
    GroupByPipe,
    AccountFilterPipe,
    CurrencyPipe,
    FilterPipe,
    OrderByPipe,
    VendorFilterPipe,
    OrderByTable,
    OnlyEntityName,
    emailValidate,
    phoneValidateInput,
    passwordValidate,
    nameRestriction,
    TruncatePipe,
    SmartLabLeftNavbarComponent
  ]
})
export class SharedComponentModule { }
