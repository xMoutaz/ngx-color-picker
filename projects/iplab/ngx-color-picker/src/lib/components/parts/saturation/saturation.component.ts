import {
    Component,
    HostBinding,
    Input,
    EventEmitter,
    Output,
    ChangeDetectionStrategy,
    Renderer2,
    ElementRef,
    ViewChild,
    OnInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { Color } from './../../../helpers/color.class';
import { BaseComponent } from './../base.component';


@Component({
    selector: `saturation-component`,
    templateUrl: `./saturation.component.html`,
    styleUrls: [
        `./../base.style.scss`,
        './saturation.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaturationComponent extends BaseComponent implements OnInit, OnChanges {

    @Input()
    public hue: Color;

    @Input()
    public color: Color;

    @Output()
    public colorChange = new EventEmitter<Color>(false);

    @ViewChild('pointer', { static: true })
    public pointer: ElementRef;

    constructor(private readonly renderer: Renderer2) {
        super();
    }

    @HostBinding('style.backgroundColor')
    public get backgroundColor(): string {
        return this.hue ? this.hue.toRgbaString() : '';
    }

    public ngOnInit(): void {
        if (!this.hue) {
            this.hue = Color.from(this.color.getHsva());
        }
        this.renderer.setStyle(this.elementRef.nativeElement, 'backgroundColor', this.backgroundColor);
    }

    /**
     * color can be changed through inputs
     * and then we need to move pointer
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.color && changes.color.previousValue !== changes.color.currentValue) {
            const hsva = this.color.getHsva();
            this.changePointerPosition(hsva.saturation, hsva.value);
        }
    }

    public movePointer({ x, y, height, width }): void {
        const saturation = (x * 100) / width;
        const bright = -((y * 100) / height) + 100;

        this.changePointerPosition(saturation, bright);
        const hsva = this.hue.getHsva();
        const color = this.color.getHsva();
        const newColor = new Color().setHsva(hsva.hue, saturation, bright, color.alpha);
        this.colorChange.emit(newColor);
    }

    private changePointerPosition(x: number, y: number): void {
        this.renderer.setStyle(this.pointer.nativeElement, 'top', `${100 - y}%`);
        this.renderer.setStyle(this.pointer.nativeElement, 'left', `${x}%`);
    }
}
