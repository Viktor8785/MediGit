import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShedulerMainComponent } from './sheduler.main/sheduler.main.component';
import { ResourcesComponent } from './resources/resources.component';
import { ShedulerComponent } from './sheduler/sheduler.component';
import { ShrinkDatePipe } from './sheduler/shrink-date.pipe';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [
    ShedulerMainComponent,
    ResourcesComponent,
    ShedulerComponent,
    ShrinkDatePipe,
    ContentComponent
  ],
  imports: [
    CommonModule
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
