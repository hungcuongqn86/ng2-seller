import {Directive, OnInit, Input, ElementRef} from '@angular/core';
import {PublicService} from '../public/public.service';
import {DsLib} from '../lib/lib';
import {Observable} from 'rxjs/Rx';
declare const SVG: any;

@Directive({selector: '[appProduct]'})
class ProductDirective implements OnInit {
    @Input('product')
    public product: any;
    @Input('face')
    public face = 'front';
    @Input('mainopt')
    public mainopt: any;
    nested: any;
    prodDraw: any;

    constructor(private el: ElementRef, private PublicService: PublicService) {
    }

    ngOnInit() {
        this.getBases();
    }

    private getBases(): any {
        let baseType = '';
        if (this.product.base.type_id) {
            baseType = this.product.base.type_id;
        }
        if (this.product.base.type && this.product.base.type.id && this.product.base.type.id !== '' && baseType === '') {
            baseType = this.product.base.type.id;
        }
        if (baseType === '') {
            return false;
        }
        this.PublicService.getBases(baseType).subscribe(
            data => {
                for (let i = 0; i < data.length; i++) {
                    const value = data[i].id;
                    if (value === this.product.base.id) {
                        this.product.base = data[i];
                        break;
                    }
                }
                this.genProduct();
            },
            error => {
                console.error(error.json().message);
                return Observable.throw(error);
            }
        );
    }

    private genProduct() {
        const myjs = this;
        const sW = this.el.nativeElement.offsetWidth;
        this.prodDraw = SVG(this.el.nativeElement);
        const color = this.prodDraw.rect().fill(this.product.colors[0].value);
        const img = this.prodDraw.image(DsLib.getBaseImgUrl('front', this.product.base.id)).loaded(function (loader) {
            const sH = sW * loader.height / loader.width;
            this.size(sW, sH);
            myjs.prodDraw.size(sW, sH);
            color.size(sW, sH);
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

export class AppProductDirective extends ProductDirective {
}
export class ModuleProductDirective extends ProductDirective {
}
