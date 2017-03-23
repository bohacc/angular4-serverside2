"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//noinspection TypeScriptUnresolvedFunction
var Constants = require('../backend/constants');
var angular2_universal_1 = require('angular2-universal');
var core_1 = require('@angular/core');
var AppService = (function () {
    function AppService() {
        if (!AppService.isCreating) {
            throw new Error("You can't call new in Singleton instances! Call SingletonService.getInstance() instead.");
        }
        this.store = {
            appWidth: 0,
            scrollBarWidth: 0,
            showCats: true,
            showCatsMobile: false,
            isLogged: false
        };
    }
    AppService.getInstance = function () {
        if (AppService.instance == null) {
            AppService.isCreating = true;
            AppService.instance = new AppService();
            AppService.isCreating = false;
        }
        return AppService.instance;
    };
    AppService.prototype.getScrollBarWidth = function () {
        return this.store.scrollBarWidth;
    };
    AppService.prototype.setScrollBarWidth = function (width) {
        this.store.scrollBarWidth = width;
    };
    AppService.prototype.setAppWidth = function (width) {
        this.store.appWidth = width;
    };
    AppService.prototype.getAppWidth = function () {
        return this.store.appWidth;
    };
    AppService.prototype.setShowCats = function (arg) {
        this.store.showCats = arg;
    };
    AppService.prototype.getShowCats = function () {
        return this.store.showCats;
    };
    AppService.prototype.getStore = function () {
        return this.store;
    };
    AppService.prototype.refreshWidth = function () {
        if (angular2_universal_1.isBrowser) {
            var width = this.store.appWidth + this.store.scrollBarWidth;
            if (width <= 991) {
                this.store.showCats = false;
                this.store.showCatsMobile = true;
            }
            else if (width >= 992) {
                this.store.showCats = true;
                this.store.showCatsMobile = false;
            }
        }
    };
    AppService.prototype.setPath = function (code) {
        this.store.path = code;
    };
    AppService.prototype.getPath = function () {
        return this.store.path;
    };
    AppService.prototype.setPageId = function (id) {
        this.store.idPage = id;
    };
    AppService.prototype.getPageId = function () {
        return this.store.idPage;
    };
    AppService.prototype.setTableName = function (name) {
        this.store.tableName = name;
    };
    AppService.prototype.setRedirect = function (code) {
        this.store.redirect = code;
    };
    AppService.prototype.getImageForType = function (ext) {
        var imgObj, imgs = [
            { ext: '.doc', img: 'file_doc.png' },
            { ext: '.docx', img: 'file_doc.png' },
            { ext: '.xls', img: 'file_docx.png' },
            { ext: '.xlsx', img: 'file_docx.png' },
            { ext: '.pdf', img: 'file_pdf.png' },
        ];
        imgObj = imgs.filter(function (el) {
            return el.ext === ext;
        })[0];
        return Constants.imageFileExtPath + (imgObj ? imgObj.img : '');
    };
    AppService.prototype.getSelectItemParamComboBox = function (code, item, selectedItems) {
        //TODO change value(slider)
        var index = -1, par, parSel, del;
        del = !item.val;
        selectedItems.map(function (el, i) {
            par = code || item.id.split(':')[0];
            parSel = el.id.split(':')[0];
            if (par === parSel) {
                index = i;
                del = true;
            }
        });
        if (del) {
            selectedItems.splice(index, 1);
            if (item.val) {
                selectedItems.push(item);
            }
        }
        else {
            selectedItems.push(item);
        }
        return selectedItems;
    };
    AppService.prototype.getStringForFilter = function (arr) {
        var filters = '';
        arr.map(function (el, i) {
            if (filters) {
                filters += '@';
            }
            filters += el.val;
        });
        return filters;
    };
    AppService.prototype.getSelectItemParam = function (item, selectedItems) {
        var index = -1;
        selectedItems.map(function (el, i) {
            if (item.id === el.id) {
                index = i;
            }
        });
        if (index > -1) {
            selectedItems.splice(index, 1);
        }
        else {
            selectedItems.push(item);
        }
        return selectedItems;
    };
    AppService.prototype.isLogged = function () {
        return this.store.isLogged;
    };
    AppService.prototype.setLogged = function (arg) {
        this.store.isLogged = arg;
    };
    AppService.prototype.setLoginName = function (name) {
        this.store.loginName = name;
    };
    AppService.isCreating = false;
    AppService = __decorate([
        core_1.Injectable()
    ], AppService);
    return AppService;
}());
exports.AppService = AppService;
