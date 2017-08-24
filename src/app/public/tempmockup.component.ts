import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';
import {PublicService} from './public.service';

import {Observable} from 'rxjs/Rx';

export interface PromptModel {
  campaign: any;
}

@Component({
  templateUrl: './tempmockup.component.html',
  styleUrls: ['./tempmockup.component.css']
})
export class TempmockupComponent extends DialogComponent<PromptModel, string> implements PromptModel, OnInit {
  campaign: any;

  arrMockupCategories: any = [];
  categories: any;
  arrTypes: any = [];
  type: any = [];
  arrTemplate: any = [];

  constructor(dialogService: DialogService, private PublicService: PublicService) {
    super(dialogService);
  }

  ngOnInit() {
    this.setupdata();
  }

  private setupdata() {
    this.PublicService.http.startLoad();
    const subs = this.getData().subscribe(
      () => {
        if (this.type.id) {
          this.getTemplates();
          subs.unsubscribe();
          this.PublicService.http.endLoad();
        }
      },
      error => {
        console.log(error);
        subs.unsubscribe();
        this.PublicService.http.endLoad();
      }
    );
  }

  private getData(): Observable<any> {
    return Observable.create(observer => {
      const sub1 = this.PublicService.getMockupCategories().subscribe(
        data => {
          this.arrMockupCategories = data;
          observer.next();
          sub1.unsubscribe();
        },
        error => {
          observer.error(error);
          sub1.unsubscribe();
        }
      );

      const sub2 = this.PublicService.getMockupTypes().subscribe(
        data => {
          this.arrTypes = data;
          if (this.arrTypes.length) {
            this.type = this.arrTypes[0];
          }
          observer.next();
          sub2.unsubscribe();
        },
        error => {
          observer.error(error);
          sub2.unsubscribe();
        }
      );
    });
  }

  public setCategories(categories = null) {
    this.categories = categories;
    this.getTemplates();
  }

  public setType(type) {
    this.type = type;
    this.getTemplates();
  }

  public getTemplates() {
    const cat = this.categories ? this.categories.id : '';
    this.PublicService.getMockupTemplates(this.type.id, cat).subscribe(
      data => {
        this.arrTemplate = this.convertData(data);
        // console.log(this.arrTemplate);
      },
      error => {
        console.error(error.json().message);
        return Observable.throw(error);
      }
    );
  }

  private convertData(data: any) {
    const rowLength = 5;
    const res: any = [];
    let row: any = [];
    for (let index = 0; index < data.length; index++) {
      if (data[index].image.front.url !== '') {
        row.push({
          id: data[index].id,
          name: data[index].name,
          type: 'front',
          url: data[index].image.front.url
        });
      }
      if (row.length === rowLength) {
        res.push(row);
        row = [];
      }
      if (data[index].image.back.url !== '') {
        row.push({
          id: data[index].id,
          name: data[index].name,
          type: 'back',
          url: data[index].image.back.url
        });
      }
      if (row.length === rowLength) {
        res.push(row);
        row = [];
      }
    }
    res.push(row);
    return res;
  }

  public selectTemp(temp) {
    this.result = temp;
    this.close();
  }

  public mdClose() {
    this.close();
  }
}
