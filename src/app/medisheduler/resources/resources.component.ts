import { Component } from '@angular/core';
import { RepositoryDataService } from '../../repository.data.service';
import { ResourceModel } from '../model/resource.model';
import { CommonService } from '../shared/common.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  styles: [
  ]
})
export class ResourcesComponent {

  public buttonIndex = 0;
  public button0 = true;
  public button1 = false;
  public resources: ResourceModel[];
  public checkStatus: boolean[] = [];
  
  constructor(private repositoryData: RepositoryDataService, private commonService: CommonService) {
    this.resources = repositoryData.getResources();
    this.resources.sort((a: ResourceModel, b: ResourceModel) => a.resourceSpec.localeCompare(b.resourceSpec));
    this.checkStatus.fill(false);
  }

  toggleButtonIndex0(evt: any) {
    this.buttonIndex = 0;
    this.button0 = true;
    this.button1 = false;
    this.resources.sort((a: ResourceModel, b: ResourceModel) => a.resourceSpec.localeCompare(b.resourceSpec));
  }

  toggleButtonIndex1(evt: any) {
    this.buttonIndex = 1;
    this.button0 = false;
    this.button1 = true;
    this.resources.sort((a: ResourceModel, b: ResourceModel) => a.resourceName.localeCompare(b.resourceName));
  } 
  
  checkboxClick(resource: ResourceModel, index: number) {
    if(this.checkStatus[index]) {
      this.checkStatus[index] = false;
    } else {
      this.checkStatus[index] = true;
    }
    if(this.commonService.resources.length) {
      if(this.checkStatus[index]) {
        if(this.commonService.resources.indexOf(resource.resourceId) < 0 ) {
          this.commonService.resources.push(resource.resourceId);
        }
      } else {
        if(this.commonService.resources.indexOf(resource.resourceId) >= 0 ) {
          this.commonService.resources.splice(this.commonService.resources.indexOf(resource.resourceId), 1);
        } 
      }
    } else {
      if(this.checkStatus[index]) {
        this.commonService.resources.push(resource.resourceId);
      }
    }
    console.log(this.commonService.resources);
    this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
    this.commonService.emitFilter('filter');
  }
}
