import {Directive, OnInit, Input, ElementRef, Renderer} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
    selector: '[ngModel][appCountLeft]',
})
export class CountLeftDirective implements OnInit {
    @Input('appCountLeft')
    public appCountLeft = 0;
    private contendf = ' characters left';
    private modelValue = null;

    constructor(public model: NgControl, private el: ElementRef, private renderer: Renderer) {
    }

    ngOnInit() {
        this.modelValue = this.model.value;
        // insertAdjacentElement
        const wrapper = document.createElement('label');
        wrapper.classList.add('pull-right');
        this.el.nativeElement.insertAdjacentElement('beforebegin', wrapper);
        this.model.valueChanges
            .distinctUntilChanged()
            .subscribe(mv => {
                let ilength = 0;
                if (this.model.value) {
                    ilength = this.model.value.length;
                }
                let countview = this.appCountLeft - ilength;
                if (countview < Math.ceil(this.appCountLeft * 10 / 100)) {
                    wrapper.classList.add('text-danger');
                    wrapper.classList.remove('text-primary');
                } else {
                    wrapper.classList.remove('text-danger');
                    wrapper.classList.add('text-primary');
                }
                if (countview < 0) {
                    countview = 0;
                    this.modelValue = this.model.value.substring(countview, this.appCountLeft);
                    this.model.valueAccessor.writeValue(this.modelValue);
                }
                // console.log(this.el);
                wrapper.textContent = countview.toString() + this.contendf;
            });
    }
}
