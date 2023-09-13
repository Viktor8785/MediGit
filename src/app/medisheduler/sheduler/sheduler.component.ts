import { Component, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { RepositoryDataService } from '../service/repository.data.service';
import { CommonService } from '../shared/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sheduler',
  templateUrl: './sheduler.component.html',
  styleUrls: ['./sheduler.component.scss'],
  styles: [],
})
export class ShedulerComponent {
  public resources!: any[];
  public buttonIndex = 0;
  public button0 = true;
  public button1 = false;
  public button2 = false;
  private subscr!: Subscription;
  private headMargin: number[] = [];
  public titleShow = true;
  @ViewChild('head') shedulerHead!: ElementRef<any>;
  @ViewChildren('head') shedulerHeads!: QueryList<any>;
  
  
  constructor(private repositoryData: RepositoryDataService, private commonService: CommonService,
     )
      {
        for(let i = 0; i < 1000; i++) {
          this.headMargin.push(0);
        }
        this.subscr = commonService.getFilter().subscribe(filter => {
          this.resources = repositoryData.getFilteredResources().sort((a, b) => a.date - b.date);
          if(this.resources.length) {
            this.titleShow = false;
          } else {
            this.titleShow = true;
          }
          setTimeout(() => {
            let max = 0;
            this.shedulerHeads.forEach((head) => {
              if(head.nativeElement.clientHeight > max) {
                max = head.nativeElement.clientHeight;
              }
            });
            this.shedulerHeads.forEach((head, index) => {
              this.headMargin[index] = (max - head.nativeElement.clientHeight);
            });
          },0);
        });
        commonService.emitFilter('filter');
      }

    getWorkHours(resource: any) {
      return resource.workTimeStart + '-' + resource.workTimeEnd;
    }

    toggleButtonIndex0(evt: any) {
      this.buttonIndex = 0;
      this.button0 = true;
      this.button1 = false;
      this.button2 = false;
      this.commonService.dayDuration = 1;
      this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
      this.commonService.emitFilter('filter');
    }

    toggleButtonIndex1(evt: any) {
      this.buttonIndex = 1;
      this.button0 = false;
      this.button1 = true;
      this.button2 = false;
      this.commonService.dayDuration = 2;
      this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
      this.commonService.emitFilter('filter');
    }

    
    toggleButtonIndex2(evt: any) {
      this.buttonIndex = 2;
      this.button0 = false;
      this.button1 = false;
      this.button2 = true;
      this.commonService.dayDuration = 7;
      this.repositoryData.filterResources(this.commonService.resources, this.commonService.startDate, this.commonService.dayDuration);
      this.commonService.emitFilter('filter');
    }
    
    styleHeadMargin(index: number) {
      return {'padding-top': this.headMargin[index].toString() + 'px'};
    }
    
    ngAfterViewInit() {
    }

    ngOnDestroy() {
      if(this.subscr) {
        this.subscr.unsubscribe();
      }
    }
}
