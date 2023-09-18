import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShedulerMainComponent } from './sheduler.main/sheduler.main.component';
import { ResourcesComponent } from './resources/resources.component';
import { ShedulerComponent } from './sheduler/sheduler.component';
import { ShrinkDatePipe } from './sheduler/shrink-date.pipe';
import { ContentComponent } from './content/content.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RouterModule } from '@angular/router';
import { ModalAppComponent } from './modal/app/modalapp.component';
import { ModalInfoComponent } from './modal/info/modalinfo.component';
import { ModalYesComponent } from './modal/yes/modalyes.component';
import { ModalDeleteComponent } from './modal/delete/modaldelete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ShedulerMainComponent,
    ResourcesComponent,
    ShedulerComponent,
    ShrinkDatePipe,
    ContentComponent,
    ModalAppComponent,
    ModalInfoComponent,
    ModalYesComponent,
    ModalDeleteComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule,
    TypeaheadModule,
    BsDatepickerModule,
    TooltipModule,
    RouterModule
  ],
  exports: [
    ShedulerMainComponent,
    ResourcesComponent,
    ShedulerComponent,
    ShrinkDatePipe,
    ContentComponent,
    ModalAppComponent,
    ModalInfoComponent,
    ModalYesComponent,
    ModalDeleteComponent,
  ]
})
export class MediShedulerModule { }
