import {Directive, OnInit, Input, ElementRef} from '@angular/core';
declare const SVG: any;

@Directive({selector: '[appCampaign]'})
export class CampaignDirective implements OnInit {
    @Input('campaign')
    public campaign: any;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        const sW = this.el.nativeElement.offsetWidth;
        const campDraw = SVG(this.el.nativeElement);
        let indexdf = this.campaign.products.findIndex(x => x.default === true);
        if (indexdf < 0) {
            indexdf = 0;
        }
        const product = this.campaign.products[indexdf];
        const img = campDraw.image(product.variants[0].image.front).loaded(function (loader) {
            const sH = sW * loader.height / loader.width;
            this.size(sW, sH);
            campDraw.size(sW, sH);
        });
    }
}
