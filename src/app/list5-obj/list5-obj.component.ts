import {Component, Input} from '@angular/core';
import {ApiService} from "../shared/api.service";
import {AppService} from "../app.service";

@Component({
  selector: 'list5-obj',
  templateUrl: 'list5-obj.template.html',
  providers: [AppService]
})

export class List5Obj {
  meta: any = {category: {id: null}};
  appService: AppService;
  @Input() args: any;

  constructor(private api: ApiService) {
    this.meta.showDownload = true;
    this.appService = AppService.getInstance();
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.api.get('/cats/' + this.appService.getPath())
      .subscribe(res => {
        let data: any = res.json();
        this.meta.category = {id: data.id || ''};
      });
  }
}
