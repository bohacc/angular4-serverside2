//our root app component
import { NgModule, Component, Compiler, ViewContainerRef, ViewChild, Input, ComponentRef, ComponentFactory, ComponentFactoryResolver} from '@angular/core'

// Helper component to add dynamic components
@Component({
  selector: 'dcl-wrapper',
  template: `<div #target [innerHTML]="html"></div>`
})
export class HtmlOutlet3 {
  @ViewChild('target', {read: ViewContainerRef}) target;
  @Input() type;
  @Input() html;
  @Input() args;
  cmpRef: ComponentRef<any>;
  private isViewInitialized:boolean = false;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private compiler: Compiler) {}

  updateComponent() {
    if(!this.isViewInitialized) {
      return;
    }
    if(this.cmpRef) {
      this.cmpRef.destroy();
    }

    let factory = this.componentFactoryResolver.resolveComponentFactory(this.type);

    this.cmpRef = this.target.createComponent(factory);
    this.cmpRef.instance.args = this.args || {};
  }

  ngOnChanges() {
    this.updateComponent();
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.updateComponent();
  }

  ngOnDestroy() {
    if(this.cmpRef) {
      this.cmpRef.destroy();
    }
  }
}
