import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'search-result-list',
  templateUrl: 'search-result-list.template.html'
})

export class SearchResultList {
  products: any = [];
  searchStr: string;
  metaList: any = {};

  constructor(private route: ActivatedRoute) {
    this.metaList = {searchStr: '', url: '/search', urlPagination: '/search/pagination'};
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.metaList.searchStr = params['searchStr'];
    });
  }
}
