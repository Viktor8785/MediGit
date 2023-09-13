import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserModel } from '../model/user.model';
import { AppointmentModel } from '../model/appointment.model';
import { ResourceModel } from '../model/resource.model';
import { RestDataService } from './rest.data.service';

@Injectable({
  providedIn: 'root'
})
export class RepositoryDataService {
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private users: UserModel[] = [];
  private resources: ResourceModel[] = [];
  private resourcesFiltered: any[] = [];

  constructor(private restData:  RestDataService) { }

  getUsersData(): void {
    this.subscr = this.restData.getUsersData().subscribe((data: UserModel[]) => {
      Object.assign(this.users, data);
    })
  }

  getResourcesData(): void {
    this.subscr2 = this.restData.getResourcesData().subscribe((data: UserModel[]) => {
      Object.assign(this.resources, data);
    })
  }

  getUsers(): UserModel[] {
    return this.users;
  }

  getUser(userId: string): UserModel {
    return this.users.find((user) => user.userId == userId) as UserModel;
  }

  addUserAppointment(userId: string, userAppointment: AppointmentModel) {
    let user = this.users.find((user) => user.userId == userId);
    if(user) {
      user.userAppointment.push(userAppointment);
    }
  }

  deleteUserAppointment(userId: string, appId: number) {
    let user = this.users.find((user) => user.userId == userId);
    if(user) {
      let appIndex = user.userAppointment.findIndex((app) => app.appId === appId);
      if(appIndex >= 0) {
        user.userAppointment.splice(appIndex, 1);
      }
    }
  }

  getResources(): ResourceModel[] {
    return this.resources;
  }

  getResource(resourceId: string): ResourceModel {
    return this.resources.find((resource) => resource.resourceId == resourceId) as ResourceModel;
  }
  
  addResourceAppointment(resourceId: string, resourceAppointment: AppointmentModel) {
    let resource = this.resources.find((resource) => resource.resourceId == resourceId);
    if(resource) {
      resource.resourceAppointment.push(resourceAppointment);
    }
  }

  deleteResourceAppointment(resourceId: string, appId: number) {
    let resource = this.resources.find((resource) => resource.resourceId == resourceId);
    if(resource) {
      let appIndex = resource.resourceAppointment.findIndex((app) => app.appId == appId);
      if(appIndex >=0) {
        resource.resourceAppointment.splice(appIndex, 1);
      }
    }
  }
  
  filterResources(resourceId: string[], startDate: Date, duration: number) {
    this.resourcesFiltered = [];
    let sheduleStartDate = startDate;
    let sheduleEndDate = new Date();
    sheduleEndDate.setDate(sheduleStartDate.getDate() + duration - 1);
        
    if(resourceId.length) {
      resourceId.forEach((id) => {
        let resource = this.resources.find((resource) => resource.resourceId == id) as ResourceModel;
        let sheduleWorkEnd = new Date();
        sheduleWorkEnd.setDate(sheduleWorkEnd.getDate() + resource.workDuration);
          for(let i=0; i < duration; i++) {
            let currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i);
            if(sheduleWorkEnd >= currentDate) {
              let day = resource.shedule.find((day) => day.day == currentDate.getDay());
              if(day && day.appointment.length) {
                let obj = {};
                Object.assign(obj, resource, {date: currentDate});
                this.resourcesFiltered.push(obj);
              }
            } 
          }
      });
    }
  }

  getFilteredResources(): any[] {
    return this.resourcesFiltered;
  }


  ngOnDestroy() {
    if(this.subscr) {
      this.subscr.unsubscribe();
    }
    if(this.subscr2) {
      this.subscr2.unsubscribe();
    }
  }
}
