import { Component } from '@angular/core';
import { CommonService } from '../../shared/common.service';
import { Router } from '@angular/router';
import { RepositoryDataService } from '../../service/repository.data.service';
import { UserModel } from '../../model/user.model';

@Component({
  selector: 'app-modaldelete',
  templateUrl: './modaldelete.component.html',
  styleUrls: ['./modaldelete.component.scss'],
  styles: [],
})
export class ModalDeleteComponent {
  private patientDataSelected!: UserModel;
  private resourceDataSelected!: any;
  private intervalDate!: Date;
  
  constructor(private commonService: CommonService, private route: Router, private repositoryData: RepositoryDataService) {
    this.resourceDataSelected = this.commonService.resource;
    this.intervalDate = this.commonService.intervalDate;
    this.patientDataSelected = this.commonService.patientDataSelected;
  }

  
  
  onModalDeleteHrefClick() {
    this.route.navigateByUrl('/sheduler');
  }
  
  onModalDeleteButtonfClick() {
    this.deleteAppointment();
  }
  
  deleteAppointment() {
    let patient = this.patientDataSelected;
    let resource = this.resourceDataSelected;
    let userId = this.patientDataSelected.userId;
    let specId = this.resourceDataSelected.resourceId;
    let int = this.intervalDate;
    let patientAppId = 0;
    let resourceAppId = 0;
    patient.userAppointment.forEach((app: any) => {
      if(app.appDate.getTime() == int.getTime() && app.specId == specId) {
        patientAppId = app.appId;
      }
    });
    resource.resourceAppointment.forEach((app: any) => {
      if(app.appDate.getTime() == int.getTime() && app.userId == userId) {
        resourceAppId = app.appId;
      }
    });
    this.repositoryData.deleteResourceAppointment(specId, resourceAppId);
    this.repositoryData.deleteUserAppointment(userId, patientAppId);
    this.route.navigateByUrl('/sheduler');
    this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
    this.commonService.emitFilter('filter');
  }
}
