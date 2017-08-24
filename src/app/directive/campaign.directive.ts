import {Directive, ElementRef, Input, OnInit} from '@angular/core';

declare const SVG: any;

@Directive({selector: '[appCampaign]'})
export class CampaignDirective implements OnInit {
  @Input('campaign')
  public campaign: any;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    const sW = this.el.nativeElement.offsetWidth, campDraw = SVG(this.el.nativeElement);
    let indexdf = this.campaign.products.findIndex(x => x.default === true) >= 0 ?
      this.campaign.products.findIndex(x => x.default === true) : 0;
    const product = this.campaign.products[indexdf];
    if (product.variants && product.variants.length) {
      indexdf = product.variants.findIndex(x => x.default === true) >= 0 ? product.variants.findIndex(x => x.default === true) : 0;
      const variants = product.variants[indexdf];
      const img = product.back_view ? variants.image.back : variants.image.front;
      campDraw.image(img).loaded(function (loader) {
        const sH = sW * loader.height / loader.width;
        this.size(sW, sH);
        campDraw.size(sW, sH);
      });
    }
  }
}
