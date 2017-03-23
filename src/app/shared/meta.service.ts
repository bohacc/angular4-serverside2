//import {isBrowser, isNode} from "angular2-universal";
import {DOCUMENT} from "@angular/platform-browser";
import {Inject, Injectable} from "@angular/core";
import {ApiService} from "./api.service";

@Injectable()
export class MetaService {
  constructor (
    @Inject(DOCUMENT) private document,
    private api: ApiService,
    @Inject('isBrowser') private isBrowser: Boolean
  ) {

  }

  public setTitle(obj: any) {
    if (this.isBrowser) {
      this.document.title = obj.title;
    } else {
      let headChildren = this.document.head.children;
      for (let i = 0; i < headChildren.length; i++) {
        let element = headChildren[i];

        if (element.name === 'title') {
          element.children[0] = {
            type: 'text',
            data: obj.title,
            parent: [],
            prev: null,
            next: null
          };
        }
      }
    }
  }

  private setMetaItem (name: string, value: string) {
    let headChildren = this.document.head.children;
    for (let i = 0; i < headChildren.length; i++) {
      let element = headChildren[i];

      if (element.name === 'meta' && element.attribs.name && element.attribs.name.toUpperCase() === name.toUpperCase() && value) {
        element.attribs.content = value;
      }
    }
  }

  private setMetaEquivItem (name: string, value: string) {
    let headChildren = this.document.head.children;
    for (let i = 0; i < headChildren.length; i++) {
      let element = headChildren[i];

      if (element.name === 'meta' && element.attribs['http-equiv'] && element.attribs['http-equiv'].toUpperCase() === name.toUpperCase() && value) {
        element.attribs.content = value;
      }
    }
  }

  private setHtmlTag (value: string) {
    let children = this.document.children;
    for (let i = 0; i < children.length; i++) {
      let element = children[i];

      if (element.name === 'html' && element.attribs['lang'] && value) {
        element.attribs.lang = value;
      }
    }
  }

  public setMeta () {
    if (!this.isBrowser) {
      this.api.get('/meta')
        .subscribe(res => {
          let data: any = res.json();
          this.setMetaItem('description', data.description);
          this.setMetaItem('keywords', data.keywords);
          this.setMetaItem('author', data.author);
          this.setMetaItem('generator', data.generator);
          this.setMetaItem('robots', data.robots);
          this.setMetaItem('viewport', data.viewport);
          this.setMetaEquivItem('Content-Type', data.contentType);
          this.setMetaEquivItem('pragma', data.pragma);
          this.setMetaEquivItem('cache-control', data.cacheControl);
          this.setMetaEquivItem('expires', data.expires);
          this.setHtmlTag(data.lang);
        });
    }
  }
}
