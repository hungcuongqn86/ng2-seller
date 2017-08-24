import {Component, OnInit} from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';

export interface PromptModel {
  oProduct: any;
  mainOpt: any;
  face;
}

@Component({
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent extends DialogComponent<PromptModel, string> implements PromptModel, OnInit {
  oProduct: any;
  mainOpt: any = [];
  face = 'front';
  color: any = null;
  colors: any = [];
  check = false;

  constructor(dialogService: DialogService) {
    super(dialogService);
  }

  ngOnInit() {
    Object.keys(this.oProduct.colors).map((index) => {
      this.colors[index] = this.oProduct.colors[index];
    });
  }

  public checkColor(color: any) {
    for (let i = 0; i < this.colors.length; i++) {
      if (this.colors[i].id === color.id) {
        return i;
      }
    }
    return -1;
  }

  public selectColor(color) {
    this.check = true;
    const check = this.checkColor(color);
    if (check < 0) {
      this.colors.push(color);
      this.color = color;
    } else {
      if (this.colors.length > 1) {
        this.colors.splice(check, 1);
      }
    }
  }

  public previewColor(color) {
    this.color = color;
  }

  public mdClose() {
    this.close();
  }

  public confirm() {
    if (this.check) {
      this.result = this.colors;
    } else {
      this.result = null;
    }
    this.close();
  }
}
