import { Component, ViewChild, ViewChildren, ElementRef, QueryList, ChangeDetectorRef, HostListener } from '@angular/core';
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
  public subTitleShow = true;
  public headFull: boolean[] = [];
  public headRecords: any = [];
  private maxFullHeight = 1000;
  private maxHeaderHeight = 1000;
  private minHeaderHeight = 0;
  private headersWithMaxHeight: number[] = [];
  public scrollLeft = 0;
  @ViewChildren('head') shedulerHeads!: QueryList<any>;
  @ViewChildren('full') shedulerFulls!: QueryList<any>;
  @ViewChild('body') bodyRef!: ElementRef;
  
  constructor(private repositoryData: RepositoryDataService, private commonService: CommonService, private changeDetection: ChangeDetectorRef,
     )
      {
        this.subscr = commonService.getFilter().subscribe(filter => {
          this.resources = repositoryData.getFilteredResources().sort((a, b) => {
            if((a.date - b.date) > 0) return 1;
            if((a.date - b.date) < 0) return -1;
            return a.resourceName.localeCompare(b.resourceName);
          });
          let resourcesSelected = this.commonService.resources;
          for(let i = 0; i < 1000; i++) {
            this.headMargin[i] = 0;
            this.headFull[i] = true;
          }
          if(this.resources.length) {
            this.subTitleShow = false;
            this.titleShow = false;
          } else {
            if(resourcesSelected.length) {
              this.subTitleShow = true;
              this.titleShow = false;
            } else {
              this.titleShow = true;
              this.subTitleShow = false;
            }
          }
          this.makeHeadRecords(this.resources);
          setTimeout(() => {
            this.changeDetection.detectChanges();
            let max = 0;
            let headOfMaxFull = 0;
            this.shedulerFulls.forEach((record, index) => {
              if(record.nativeElement.clientHeight > max) {
                max = record.nativeElement.clientHeight;
                headOfMaxFull = this.shedulerHeads.get(index).nativeElement.clientHeight;
                this.maxFullHeight = max;
              }
            });
            this.headersWithMaxHeight = [];
            let min = 1000;
            this.shedulerFulls.forEach((record, index) => {
              if(record.nativeElement.clientHeight == max) {
                this.headersWithMaxHeight.push(index);
              }
              if(record.nativeElement.clientHeight < min && record.nativeElement.clientHeight > 0) {
                min = record.nativeElement.clientHeight;
                this.minHeaderHeight = min;
              }
            });
            this.shedulerFulls.forEach((record, index) => {
              this.headMargin[index] = max;
            });
            let max1 = 0;
            this.shedulerHeads.forEach((head) => {
              if(head.nativeElement.clientHeight > max1) {
                max1 = head.nativeElement.clientHeight;
                this.maxHeaderHeight = max1;
              }
            });
            if(max == 0) {
              this.shedulerHeads.forEach((head, index) => {
                this.headMargin[index] = max1 - head.nativeElement.clientHeight;
              });
            } else {
              this.shedulerHeads.forEach((head, index) => {
                this.headMargin[index] = this.headMargin[index] + (headOfMaxFull - head.nativeElement.clientHeight);
              });
            }
            this.changeDetection.detectChanges();
          },0);
        });
        commonService.emitFilter('filter');
      }

    makeHeadRecords(resources: any) {
      this.headRecords = [];
      resources.forEach((resource: any) => {
        let dayShed: any = [];
        let day = resource.shedule[resource.date.getDay()];
          dayShed = [];
          
          for(let i = 0; i <= day.doesNotWork.length - 2; i+=2) {
            dayShed.push('Врач не работает' + ' (' + day.doesNotWork[i] + ' - ' + day.doesNotWork[i + 1] + ')');
          }
          for(let i = 0; i <= day.learning.length - 2; i+=2) {
            dayShed.push('Обучение' + '(' + day.learning[i] + ' - ' + day.learning[i + 1] + ')');
          }
          
          for(let i = 0; i <= day.documents.length - 2; i+=2) {
            dayShed.push('Работа с документами' + ' (' + day.documents[i] + ' - ' + day.documents[i + 1] + ')');
          }

          for(let i = 0; i <= day.homeApp.length - 2; i+=2) {
            dayShed.push('Прием на дому' +  ' (' + day.homeApp[i] + ' - ' + day.homeApp[i + 1] + ')');
          }
          this.headRecords.push(dayShed);
      });
    }
    
    onScroll(event: any) {
      this.scrollLeft = this.bodyRef.nativeElement.scrollLeft;
      if(this.bodyRef.nativeElement.scrollTop > this.maxFullHeight / 2) {
        for(let i = 0; i < this.headersWithMaxHeight.length; i++) {
          this.headFull[this.headersWithMaxHeight[i]] = false;
        }
        this.shedulerHeads.forEach((head, index) => {
          this.headMargin[index] = this.maxHeaderHeight - head.nativeElement.clientHeight;
        });
      }
      if(this.bodyRef.nativeElement.scrollTop > this.maxFullHeight - this.minHeaderHeight / 2) {
        for(let i = 0; i < 1000; i++) {
          this.headFull[i] = false;
        }
      }
    }
    
    setHeadFull(i: number) {
      this.headFull[i] = true;
    }
    
    setHeadCompact(i: number) {
      this.headFull[i] = false;
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
