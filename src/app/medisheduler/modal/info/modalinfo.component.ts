import { Component } from '@angular/core';
import { CommonService } from '../../shared/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modalapp',
  templateUrl: './modalinfo.component.html',
  styleUrls: ['./modalinfo.component.scss'],
  styles: [],
})
export class ModalInfoComponent {
    public patientNameSelected = '';
    public patientOmsSelected = '';
    public dateSelected = '';
    public resource: any; 
  
  constructor(private commonService: CommonService, private route: Router,) {
    this.patientNameSelected = this.commonService.patientNameSelected;
    this.patientOmsSelected = this.commonService.patientOmsSelected;
    this.dateSelected = this.commonService.dateSelected;
    this.resource = this.commonService.resource;
  }

  selectCabinetNumber() {
    let start = this.resource.resourceHospital.indexOf('(');
    let end = this.resource.resourceHospital.lastIndexOf(')');
    return this.resource.resourceHospital.slice(start + 3, end);
  }
  
  onModalInfoClick() {
    this.route.navigateByUrl('/sheduler');
  }
}
