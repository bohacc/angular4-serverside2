import { Injectable, Optional, RendererFactory2, ViewEncapsulation } from '@angular/core'
import { PlatformState }                                              from '@angular/platform-server'

const preboot = require('preboot');

import { TransferState }                                              from './transfer-state'


@Injectable()
export class ServerTransferState extends TransferState {

  private _prebootOptions: Object;
  private _inlinePreboot: any;

  constructor(
    private _state: PlatformState,
    private _rendererFactory: RendererFactory2
  ) {
    super();
    this._prebootOptions = {
      appRoot: 'root',
      uglify: true
    };
    this._inlinePreboot = preboot.getInlineCode(this._prebootOptions);
  }

  inject() {
    try {
      const document: any = this._state.getDocument();
      const transferStateString = JSON.stringify(this.toJson());
      const renderer = this._rendererFactory.createRenderer(document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });

      console.log(document.children[0].next.children[0]);

      const head = document.children[0].next.children[0];
      if (head.name !== 'head') {
        throw new Error('Please have <head> as the first element in your document');
      }

      const stateScript = renderer.createElement('script');
      const prebootScript = renderer.createElement('script');

      renderer.setValue(stateScript, `window['TRANSFER_STATE'] = ${transferStateString}`);
      renderer.setValue(prebootScript, this._inlinePreboot);

      renderer.appendChild(head, stateScript);
      renderer.appendChild(head, prebootScript);
    } catch (err) {
      console.error(err);
    }
  }

}
