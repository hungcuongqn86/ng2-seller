import {Directive, OnChanges, Input, ElementRef} from '@angular/core';
import {DsLib} from '../lib/lib';
declare const SVG: any;

@Directive({selector: '[appProduct]'})
export class ProductDirective implements OnChanges {
    @Input('product')
    public product: any;
    @Input('face')
    public face = 'front';
    @Input('mainopt')
    public mainopt: any;
    @Input('color')
    public color: any = null;
    prodDraw: any;
    prodColor: any;
    nested: any;

    constructor(private el: ElementRef) {
    }

    ngOnChanges(changes) {
        if (changes.product) {
            if (this.product.base.image) {
                this.genProduct();
            }
        }

        if (changes.color) {
            this.changColor();
        }
    }

    private changColor() {
        if (this.color && this.prodColor) {
            this.prodColor.fill(this.color.value);
        }
    }

    private genProduct() {
        const myjs = this;
        const sW = this.el.nativeElement.offsetWidth;
        if (this.prodDraw) {
            this.prodDraw.clear();
        } else {
            this.prodDraw = SVG(this.el.nativeElement);
        }
        if (!this.color) {
            let indexColor = this.product.colors.findIndex(x => x.default === true);
            if (indexColor < 0) {
                indexColor = 0;
            }
            this.color = this.product.colors[indexColor];
        }
        this.prodColor = this.prodDraw.rect().fill(this.color.value);
        this.prodDraw.image(DsLib.getBaseImgUrl(this.face, this.product.base)).loaded(function (loader) {
            const sH = sW * loader.height / loader.width;
            this.size(sW, sH);
            myjs.prodDraw.size(sW, sH);
            myjs.prodColor.size(sW, sH);
            const zoom = (sW / myjs.product.base.image.width);
            myjs.genDesign(zoom);
        });
    }

    private genDesign(zoom) {
        this.nested = this.prodDraw.nested();
        Object.keys(this.product.designs).map((index) => {
            if (this.product.designs[index].type === this.face) {
                this.addImg(this.product.designs[index], zoom);
            }
        });
    }

    public addImg(dsrs: any, zoom) {
        const myobj = this;
        this.nested.image(dsrs.image.url)
            .loaded(function () {
                this.id = dsrs.id;
                myobj.resizeImg(this, dsrs, zoom);
            });
    }

    private resizeImg(img: any, dsrs: any, zoom) {
        const optnew = DsLib.getOpt(this.product, this.face);
        const optold = this.mainopt;
        const tlX: number = (optnew.maxX - optnew.minX) / (optold.maxX - optold.minX);
        const tlY: number = (optnew.maxY - optnew.minY) / (optold.maxY - optold.minY);
        const mx: number = dsrs.image.printable_left * tlX;
        const my: number = dsrs.image.printable_top * tlY;
        let mW = dsrs.image.printable_width * tlX;
        let mH = 0;
        if (optnew.minX + mx + mW <= optnew.maxX) {
            mH = mW * dsrs.image.height / dsrs.image.width;
        } else {
            mW = optnew.maxX - (optnew.minX + mx);
            mH = mW * dsrs.image.height / dsrs.image.width;
        }

        if (optnew.minY + my + mH > optnew.maxY) {
            mH = optnew.maxY - (optnew.minY + my);
            mW = mH * dsrs.image.width / dsrs.image.height;
        }
        img.move((optnew.minX + mx) * zoom, (optnew.minY + my) * zoom).size(mW * zoom, mH * zoom);
    }
}
