import { Component, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'my-app',
  template: '<div #placeholder></div>'
})
export class HtmlOutlet {
/*  @ViewChild('placeholder', {read: ViewContainerRef}) placeholder:ViewContainerRef;

  constructor(private componentResolver:ComponentResolver) {}

  ngAfterViewInit():void {
    @Component({
      selector: 'sss',
      template: '<div>SSSSSSS</div>'
    })
    class MyDynamicComponent {

    }
    this.componentResolver.resolveComponent(MyDynamicComponent).then((factory) => {
      let componentRef1 = this.placeholder.createComponent(factory);
    });
  }*/
}
