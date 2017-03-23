import { Component, Input } from '@angular/core';
import {AppService} from "../app.service";
import {ApiService} from "../shared/api.service";

@Component({
  selector: 'similar-products',
  templateUrl: 'similar-products.template.html',
})
export class SimilarProducts {
  @Input('id') id: number;
  @Input('count') count: number;
  products: Array<Object> = [];
  appService: AppService;

  constructor(private api: ApiService) {
    this.appService = AppService.getInstance();
  }

  ngOnInit() {

  }

  ngOnChanges(inputChanges) {
    if (inputChanges.id) {
      this.getData();
    }
  }

  getData() {
    if (this.id && !isNaN(this.id)) {
      let self = this;
      this.api.get('/products/' + this.id + '/similar?count=' + this.count)
        .subscribe(res => {
          let data: any = res.json();
          this.products = data;
        });
    }
  }

  // TODO: move to service
  buy() {

  }
}
