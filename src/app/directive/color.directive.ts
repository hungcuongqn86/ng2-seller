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
            const gradient = prodDraw.gradient('radial', function (stop) {
                stop.at(0, '#fff');
                stop.at(1, '#337ab7');
            });
            prodDraw.circle(20).fill(gradient).stroke({color: '#000', opacity: 0.1, width: 1});
            prodDraw.rect(10, 2).fill('#ffffff').move(5, 9);
            prodDraw.rect(2, 10).fill('#ffffff').move(9, 5);
        } else {
            prodDraw.circle(20).fill(this.color).stroke({color: '#000', opacity: 0.1, width: 1});
        }
    }
}
