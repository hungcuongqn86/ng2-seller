import {Directive, OnInit, OnDestroy, Input, ElementRef} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
    selector: '[ngModel][appCountLeft]',
})
export class CountLeftDirective implements OnInit, OnDestroy {
    @Input('appCountLeft')
    public appCountLeft = 0;
    private contendf = ' characters left';
    private modelValue = null;
    private subs: any;

    constructor(public model: NgControl, private el: ElementRef) {
    }

    ngOnInit() {
        this.modelValue = this.model.value;
        const wrapper = document.createElement('label');
        wrapper.classList.add('pull-right');
        this.el.nativeElement.insertAdjacentElement('beforebegin', wrapper);
        this.subs = this.model.valueChanges
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

    ngOnDestroy() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }
}
