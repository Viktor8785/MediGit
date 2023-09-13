import { Component } from '@angular/core';
import { RepositoryDataService } from '../service/repository.data.service';
import { UserModel } from '../model/user.model';
import { CommonService } from '../shared/common.service';

@Component({
  selector: 'app-sheduler.main',
  templateUrl: './sheduler.main.component.html',
  styleUrls: ['./sheduler.main.component.scss'],
  styles: [],
})
export class ShedulerMainComponent {
  public usersData: UserModel[] = [];
    
  constructor(private repositoryData: RepositoryDataService, private commonService: CommonService) {
    repositoryData.getUsersData();
    repositoryData.getResourcesData();
    Object.assign(this.usersData, repositoryData.getUsers());
  }
}
