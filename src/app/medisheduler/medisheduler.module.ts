import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShedulerMainComponent } from './sheduler.main/sheduler.main.component';
import { ResourcesComponent } from './resources/resources.component';
import { ShedulerComponent } from './sheduler/sheduler.component';
import { ShrinkDatePipe } from './sheduler/shrink-date.pipe';
import { ContentComponent } from './content/content.component';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [
    ShedulerMainComponent,
    ResourcesComponent,
    ShedulerComponent,
    ShrinkDatePipe,
    ContentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule,
    TypeaheadModule,
    BsDatepickerModule,
    TooltipModule,
  ],
  exports: [
    ShedulerMainComponent,
    ResourcesComponent,
    ShedulerComponent,
    ShrinkDatePipe,
    ContentComponent
  ]
})
export class MediShedulerModule { }
