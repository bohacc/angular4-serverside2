import { Inject, Injectable, isDevMode } from '@angular/core';

@Injectable()
export class CacheService {
  static KEY = 'CACHE';

  constructor(@Inject('LRU') public _cache: Map<string, any>) {

  }

  has(key: string | number): boolean {
    let _key = this.normalizeKey(key);
    return this._cache.has(_key);
  }

  set(key: string | number, value: any): void {
    let _key = this.normalizeKey(key);
    this._cache.set(_key, value);
  }

  get(key: string | number): any {
    let _key = this.normalizeKey(key);
    return this._cache.get(_key);
  }

  remove(key: string | number): boolean {
      let _key = this.normalizeKey(key);
      if (_key && this._cache.has(_key)) { 
          this._cache.delete(_key);
          return true;
      }
      return false;
  }

  clear(): void {
    this._cache.clear();
  }

  dehydrate(): any {
    let json = {};
    this._cache.forEach((value: any, key: string) => json[key] = value);
    return json;
  }

  rehydrate(json: any): void {
    Object.keys(json).forEach((key: string) => {
      let _key = this.normalizeKey(key);
      let value = json[_key];
      this._cache.set(_key, value);
    });
  }

  toJSON(): any {
    return this.dehydrate();
  }

  normalizeKey(key: string | number): string {
    if (isDevMode() && this._isInvalidValue(key)) {
      throw new Error('Please provide a valid key to save in the CacheService');
    }

    return key + '';
  }

  _isInvalidValue(key): boolean {
    return key === null ||
      key === undefined ||
      key === 0 ||
      key === '' ||
      typeof key === 'boolean' ||
      Number.isNaN(<number>key);
  }
}
