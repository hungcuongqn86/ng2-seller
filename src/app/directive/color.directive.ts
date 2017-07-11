import {Directive, OnInit, Input, ElementRef} from '@angular/core';
declare const SVG: any;

@Directive({selector: '[appColor]'})
export class ColorDirective implements OnInit {
    @Input('color')
    public color: string;
    @Input('type')
    public type = 'color';

    constructor(private el: ElementRef) {

    }

    ngOnInit() {
        const prodDraw = SVG(this.el.nativeElement).size(20, 20);
        if (this.type === 'add') {
            const gradient = prodDraw.gradient('linear', function (stop) {
                stop.at(0, '#f06');
                stop.at(1, '#0f9');
            });
            prodDraw.circle(20).fill(gradient).stroke({color: '#000', opacity: 0.1, width: 1});
            prodDraw.rect(8, 2).fill('#ffffff').move(6, 9);
            prodDraw.rect(2, 8).fill('#ffffff').move(9, 6);
        } else {
            prodDraw.circle(20).fill(this.color).stroke({color: '#000', opacity: 0.1, width: 1});
        }
    }
}
