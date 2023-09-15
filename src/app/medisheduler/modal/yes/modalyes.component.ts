import { Component } from '@angular/core';
import { CommonService } from '../../shared/common.service';
import { Router } from '@angular/router';
import { RepositoryDataService } from '../../service/repository.data.service';

@Component({
  selector: 'app-modalyes',
  templateUrl: './modalyes.component.html',
  styleUrls: ['./modalyes.component.scss'],
  styles: [],
})
export class ModalYesComponent {
    public patientNameSelected = '';
    public patientOmsSelected = '';
    public dateSelected = '';
    public resource: any;
    private timerModalYes!: any; 
  
  constructor(private commonService: CommonService, private route: Router, private repositoryData: RepositoryDataService) {
    this.patientNameSelected = this.commonService.patientNameSelected;
    this.patientOmsSelected = this.commonService.patientOmsSelected;
    this.dateSelected = this.commonService.dateSelected;
    this.resource = this.commonService.resource;
    this.timerModalYes = this.commonService.timerModalYes;
  }

  
  onModalYesClick(event: any) {
    clearTimeout(this.timerModalYes);
    this.route.navigateByUrl('/sheduler');
    this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
    this.commonService.emitFilter('filter');
  }
  
}
