import {Directive, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
    selector: '[ngModel][appDebounce]',
})
export class DebounceDirective implements OnInit, OnDestroy {
    @Output()
    public onDebounce = new EventEmitter<any>();
    @Input('appDebounce')
    public appDebounce = 500;
    private modelValue = null;
    private subs: any;

    constructor(public model: NgControl) {

    }

    ngOnInit() {
        this.modelValue = this.model.value;
        if (!this.modelValue) {
            const firstChangeSubs = this.model.valueChanges.subscribe(v => {
                this.modelValue = v;
                firstChangeSubs.unsubscribe();
            });
        }

        this.subs = this.model.valueChanges
            .debounceTime(this.appDebounce)
            .distinctUntilChanged()
            .subscribe(mv => {
                if (this.modelValue !== mv) {
                    this.modelValue = mv;
                    this.onDebounce.emit(mv);
                }
            });
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }
}
