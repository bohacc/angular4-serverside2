//noinspection TypeScriptUnresolvedFunction
var oracle = require('oracledb');
//noinspection TypeScriptUnresolvedFunction
var fs = require('fs');
//noinspection TypeScriptUnresolvedFunction
var Promise = require('promise');
//noinspection TypeScriptUnresolvedFunction
var Constants = require('./constants');
var htmlToPdf = require('html-pdf');

import { Oracledb } from './api_oracle';
import { Tools } from './tools';
import * as htmlReports from './html_reports';
import * as api from './api';
import {Translate} from "./translate";

export function sessionidCookie (req, res, next) {
  let sql, vals = {};
  try {
    if (!Tools.getSessionId(req)) {
      sql =
        'SELECT ' +
        '  encrypt_cookie(seq_sessionid_nbs.nextval) as "sessionid" ' +
        'FROM ' +
        '  dual';
      Oracledb.select(sql, vals, req, null, null).then(
        function (result) {
          let data: any = Tools.getSingleResult(result);
          let sessionid = data.sessionid;
          Tools.createCookie(res, Constants.SESSIONID_CODE, sessionid);
          next();
        },
        function (result) {
          console.log(result);
          next();
        }
      );
    } else {
      next();
    }
  } catch (e) {
    console.log(e);
    next();
  }
}

export function loadObjects (req, res) {
  try {
    let vals, sql, obj: any = {language: req.countryVersion, items: []};
    vals = {
      code: req.params.code
    };

    sql =
      'SELECT ' +
      '  o.id as "objMasterId", ' +
      '  c.soubor as "fileName", ' +
      '  o.pozice as "position", ' +
      '  re.tabulka as "tableName", ' +
      '  o.id_objektu as "objectID", ' +
      '  o.typ_objektu as "objectType", ' +
      '  DECODE(nw.class_pro_body_stranky, null, 0, 1) as "bodyClass", ' +
      '  nw.id as "idPage", ' +
      '  nvl(nw.nazev, get_param(\'WEB_ESHOP_TITLE\')) as "namePage", ' +
      '  (select ' +
      '     pp.popis ' +
      '   from ' +
      '     produkty p, ' +
      '     produkty_popis pp, ' +
      '     web_website_produkt_presmer pr ' +
      '   where ' +
      '     pr.presmerovani = :code ' +
      '     and p.kod = pr.produkt ' +
      '     and pr.website = get_website ' +
      '     and p.kod = pp.produkt(+) ' +
      '     and pp.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '     and pp.website(+) = get_website ' +
      '     and pp.typ_popisu(+) = \'PRODUKT_NAZEV_ZKR\' ' +
      '     and rownum = 1 ' +
      '  ) as "productName", ' +
      '  get_param(\'WEBSITE_REGISTRACE_HESLO_REGEX\', 0, null, USER) as "passwordPattern" ' +
      'FROM ' +
      '  web_nastaveni_webu_objekty o, ' +
      '  web_redirect re, ' +
      '  web_nastaveni_webu nw, ' +
      '  web_clanky c ' +
      'WHERE ' +
      '  o.typ_objektu IN (1, 4, 12, 13) ' +
      '  and re.odkud = \'^\' || :code ||  \'$\' ' +
      '  and (' +
      '    (re.tabulka <> \'PRODUKTY\' and re.id_page = o.id_nast_webu) ' +
      '      or ' +
      '    (re.tabulka = \'PRODUKTY\' and nw.kod = \'ZAZNAM_ZBOZI\') ' +
      '  ) ' +
      '  and re.eshop = get_website ' +
      '  and o.id_objektu = to_char(c.id(+)) ' +
      '  and nw.id = o.id_nast_webu ' +
      '  and nw.eshop = re.eshop ' +
      'ORDER BY ' +
      '  o.poradi ';

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let data: Array<any> = Tools.getMultiResult(result);
        let namePage = (data && data[0] ? data[0].namePage : '');
        let productName = (data && data[0] ? data[0].productName || '' : '');
        obj.items = data;
        obj.isRecord = (data && data[0] ? data[0].tableName === Constants.REDIRECT_CODE_FOR_RECORD : false);
        obj.title = (obj.isRecord ? Constants.WEBSITE_TITLE + ' | ' + productName : namePage);
        obj.recordName = productName;
        obj.passwordPattern = (data && data[0] ? data[0].passwordPattern || '' : '');

        res.json(obj);
      },
      function (result) {
        console.log(result);
        res.json(obj);
      }
    );
  } catch (e) {
    console.log(e);
  }
}

export function emptyImage (req, res) {
  res.sendFile(Constants.EMPTY_IMAGE_FILENAME, {root: Constants.EMPTY_IMAGE_PATH});
}

export function getProduct (req, res) {
  let sql, vals, obj, path, pathEmpty, imgEmptySmall, imgEmptyMedium, imgEmptyBig, data: any, loginName;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE) || '';

  try {
    sql =
      'SELECT ' +
      '  m.*, ' +
      '  m."price" * ((m."vatPercent" / 100) + 1) as "priceVat", ' +
      '  e1_web_cena(null, DECODE(m."fourCoreCable", 1, \'' + Constants.CODE_CONECTOR_CABEL_FOUR_CORE + '\', \'' + Constants.CODE_CONECTOR_CABEL_TWO_CORE + '\'), null, null, null, null, 1, 1, 1, null, :loginName, 1) as "priceA", ' +
      '  decode(instr(med.popis, \'.\', -1), 0, null, substr(med.popis, instr(med.popis, \'.\', -1))) as "imgMediumExt", ' +
      '  decode(instr(big1.popis, \'.\', -1), 0, null, substr(big1.popis, instr(big1.popis, \'.\', -1))) as "imgBig1Ext", ' +
      '  get_param(\'MENA_PRO_WEBSITE\', 0, null, USER) as "currency" ' +
      'FROM ' +
      '  (SELECT ' +
      '     p.id as "id", ' +
      '     p.kod as "code", ' +
      '     p.mj1 as "unit", ' +
      '     e1_web_cena(get_param(\'WEB_ESHOP_PARTNER_CENIK\'), P.KOD, null, null, null, null, 1, 1) as "priceRecommended", ' +
      '     get_param(\'MENA_PRO_WEBSITE\') as "currency", ' +
      '     pp.popis as "name", ' +
      '     pp2.popis as "name2", ' +
      '     pp4.popis as "name3", ' +
      '     pp3.popis as "descriptionTabs", ' +
      '     e1_web_cena(null, P.KOD, null, null, null, null, 1, 1, 1, null, :loginName, 1) AS "price", ' +
      '     ds.procent as "vatPercent", ' +
      '     DECODE(p.dostupnost, \'' + Constants.availabilityCode + '\', 1, 0) as "inStock", ' +
      '     pd.nazev as "availability", ' +
      '     DECODE(pe.parametr, null, 0, 1) as "fourCoreCable", ' +
      '     TO_NUMBER(DBMS_LOB.SUBSTR(pe2.hodnota, 50, 1)) as "maxValue", ' +
      '     TO_NUMBER(DBMS_LOB.SUBSTR(pe3.hodnota, 50, 1)) as "maxValue2", ' +
      '     TO_NUMBER(DBMS_LOB.SUBSTR(pe4.hodnota, 50, 1)) as "step", ' +
      '     (SELECT ' +
      '        MAX(PD.ID) AS ID_PRILOHY ' +
      '      FROM ' +
      '        PRILOHY_DATA_INFO PD, ' +
      '        PRILOHY_NOVE PN ' +
      '      WHERE ' +
      '        PD.ID = PN.PRILOHA_ID ' +
      '        AND PN.TABULKA = \'PRODUKTY\' ' +
      '        AND PN.PK = P.KOD ' +
      '        AND CRM_PRILOHA_TYP = \'M_zaznam/vychozi\' ' +
      '        AND SUBSTR(POPIS,INSTR(POPIS, \'.\', -1) - 5, 5) = \'_01_M\' ' +
      '      ) AS "imgMedium", ' +
      '     (SELECT ' +
      '        MAX(PD.ID) AS ID_PRILOHY ' +
      '      FROM ' +
      '        PRILOHY_DATA_INFO PD, ' +
      '        PRILOHY_NOVE PN ' +
      '      WHERE ' +
      '        PD.ID = PN.PRILOHA_ID ' +
      '        AND PN.TABULKA = \'PRODUKTY\' ' +
      '        AND PN.PK = P.KOD ' +
      '        AND CRM_PRILOHA_TYP = \'B_lupa/lightbox\' ' +
      '        AND SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 5, 5) = \'_01_B\' ' +
      '      ) AS "imgBig1" ' +
      '   FROM ' +
      '     produkty p, ' +
      '     produkty_popis pp, ' +
      '     produkty_popis pp2, ' +
      '     produkty_popis pp3, ' +
      '     produkty_popis pp4, ' +
      '     danove_sazby ds, ' +
      '     produkty_dostupnost pd, ' +
      '     produkty_eshop pe, ' +
      '     produkty_eshop pe2, ' +
      '     produkty_eshop pe3, ' +
      '     produkty_eshop pe4, ' +
      '     web_website_produkt_presmer pr ' +
      '   WHERE ' +
      '     pr.presmerovani = :code ' +
      '     and pr.produkt = p.kod ' +
      '     and pr.website = get_website ' +
      '     and p.aktivni = 1 ' +
      '     and p.kod = pp.produkt(+) ' +
      '     and pp.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '     and pp.typ_popisu(+) = \'PRODUKT_NAZEV\' ' +
      '     and pp.website(+) = get_website ' +
      '     and ds.kod = p.sazba_dan_pro ' +
      '     and p.dostupnost = pd.kod(+) ' +
      '     and p.kod = pe.produkt(+) ' +
      '     and pe.parametr(+) = \'' + Constants.CODE_ESHOP_PARAM_RGB + '\' ' +
      '     and p.kod = pe2.produkt(+) ' +
      '     and pe2.parametr(+) = \'' + Constants.CODE_ESHOP_PARAM_MAX + '\' ' +
      '     and p.kod = pe3.produkt(+) ' +
      '     and pe3.parametr(+) = \'' + Constants.CODE_ESHOP_PARAM_MAX2 + '\' ' +
      '     and p.kod = pe4.produkt(+) ' +
      '     and pe4.parametr(+) = \'' + Constants.CODE_ESHOP_PARAM_STEP + '\' ' +
      '     and p.kod = pp2.produkt(+) ' +
      '     and pp2.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '     and pp2.website(+) = get_website ' +
      '     and pp2.typ_popisu(+) = \'PRODUKT_NAZEV_ROZ\' ' +
      '     and p.kod = pp3.produkt(+) ' +
      '     and pp3.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '     and pp3.website(+) = get_website ' +
      '     and pp3.typ_popisu(+) = \'AG_DETAILNI_POPIS\'' +
      '     and p.kod = pp4.produkt(+) ' +
      '     and pp4.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '     and pp4.website(+) = get_website ' +
      '     and pp4.typ_popisu(+) = \'PRODUKT_NAZEV_ZKR\' ' +
      '  ) m, ' +
      '  prilohy_data_info med, ' +
      '  prilohy_data_info big1 ' +
      'WHERE ' +
      '  m."imgMedium" = med.id(+) ' +
      '  and m."imgBig1" = big1.id(+) ';

    vals = {
      code: req.params.code,
      loginName: loginName
    };

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        data = Tools.getSingleResult(result);
        data.inStock = data.inStock == '1';
        data.codeA = data.fourCoreCable === 1 ? Constants.CODE_CONECTOR_CABEL_FOUR_CORE : Constants.CODE_CONECTOR_CABEL_TWO_CORE;
        data.codeB = data.codeA;
        data.priceB = data.priceA;
        data.defaultValue = data.step;
        data.minValue = data.step;
        data.maxValue = (data.maxValue ? data.maxValue * 1000 : null);
        data.maxValue2 = (data.maxValue2 ? data.maxValue2 * 1000 : null);

        path = Constants.imgagePath;
        pathEmpty = Constants.imgagePathEmpty;
        imgEmptySmall = Constants.imgageEmptySmall;
        imgEmptyMedium = Constants.imgageEmptyMedium;
        imgEmptyBig = Constants.imgageEmptyBig;
        // IMAGES
        data.imgMediumFile = data.imgMedium ? path + (data.imgMedium || '') + (data.imgMediumExt || '') : pathEmpty + imgEmptyMedium;
        data.imgBig1File = data.imgBig1 ? path + (data.imgBig1 || '') + (data.imgBig1Ext || '') : pathEmpty + imgEmptyBig;

        // RECOMMENDED PRICE
        data.currency
        data.currencyRecommended
        data.priceRecommended = data.priceRecommended;

        // PROPERTIES
        obj = {id: data.id};
        return api.getProductParams(req, obj);
      }
    ).then(
      function (result) {
        data.properties = result;

        // PICTURES
        let objPic = {
          id: data.id,
          simpleArray: true,
          attTypes: ['s', 'b'],
        };
        return api.getProductPictures(req, objPic);
      }
    ).then(
      function (result) {
        data.pictures = result;
        res.json(data);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );

  } catch (e) {
    console.log(e);
    res.json({});
  }
}

export function redirectNavigations (req, res) {
  let sql, vals;
  try {
    sql =
      'SELECT ' +
      '  ID AS "idPage", ' +
      '  \'/\' || PRESMEROVANI as "code", ' +
      '  NAZEV as "name" ' +
      'FROM ' +
      '  WEB_NASTAVENI_WEBU ' +
      'WHERE ' +
      '  PRESMEROVANI IS NOT NULL ' +
      '  AND NVL(SYSTEM,0) = 0 ' +
      '  AND ID <> get_param(\'WEB_ESHOP_FIRST_PAGE\', 0, null, user) ' +
      '  AND ID NOT IN ' +
      '    (SELECT ' +
      '       ID ' +
      '     FROM ' +
      '       WEB_NASTAVENI_WEBU ' +
      '     WHERE ' +
      '       ID <> get_param(\'WEB_ESHOP_FIRST_PAGE\', 0, null, user) ' +
      '     START WITH ID = get_param(\'WEB_ESHOP_FIRST_PAGE\', 0, null, user) CONNECT BY PRIOR MATKA = ID ' +
      '     ) ' +
      'START WITH TO_CHAR(ID) = :id CONNECT BY PRIOR MATKA = ID ' +
      'ORDER BY ' +
      '  LEVEL DESC ';

    vals = {id: req.params.id};

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let data: any = Tools.getMultiResult(result);
        res.json(data);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
  }
}

export function redirectNavigationsProduct (req, res) {
  let sql, vals, sqlPage, valsPage, sqlArr, valsArr;

  try {
    sql =
      'SELECT ' +
      '  p.id as "id", ' +
      '  to_char(pp.popis) AS "name", ' +
      '  \'/\' || pr.presmerovani as "code", ' +
      '  get_param(\'ZATRIDENI_PRODUKTU_NEZAHRNOUT\', 0, null, USER) as "classifications" ' +
      'FROM ' +
      '  produkty p, ' +
      '  produkty_popis pp, ' +
      '  web_website_produkt_presmer pr ' +
      'WHERE ' +
      '  pr.presmerovani = :code ' +
      '  and pr.website = get_website ' +
      '  and pr.website = pp.website(+)' +
      '  and pr.produkt = pp.produkt(+) ' +
      '  and pp.typ_popisu(+) = \'PRODUKT_NAZEV_ZKR\' ' +
      '  and pp.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '  and p.kod = pr.produkt ';

    sqlPage =
      'select ' +
      '  id as "id" ' +
      'from ' +
      '  (' +
      '   select ' +
      '     nw.id as id, ' +
      '     nw.lev ' +
      '   from ' +
      '     (select ' +
      '        nw.id, ' +
      '        nw.presmerovani, ' +
      '        level as lev ' +
      '      from ' +
      '        web_nastaveni_webu nw ' +
      '        start with nw.id = get_param(\'WEB_ESHOP_FIRST_PAGE\', 0, null, user) connect by prior nw.id = nw.matka ' +
      '     ) NW, ' +
      '     web_nastaveni_webu_zatr_prod nwz, ' +
      '     crm_produkty_zatrideni z ' +
      '   where ' +
      '     nw.id = nwz.id_nastaveni ' +
      '     and nwz.id_zatrideni = z.id_typ_zatrideni_produkt ' +
      '     and z.id_produktu = :id ' +
      '     and z.id_typ_zatrideni_produkt not in (@@CLASSIFICATION@@) ' +
      '   order by ' +
      '     lev ' +
      '  ) ' +
      'where ' +
      '  rownum = 1 ';

    sqlArr =
      'select ' +
      '  nw.nazev as "name", ' +
      '  \'/\' || nw.presmerovani as "code" ' +
      'from ' +
      '  web_nastaveni_webu nw ' +
      'where ' +
      '  nw.presmerovani is not null ' +
      '  and nw.id <> get_param(\'WEB_ESHOP_FIRST_PAGE\', 0, null, user) ' +
      '  start with nw.id = :id connect by prior nw.matka = nw.id ' +
      'order by ' +
      '  level desc';

    vals = {code: req.params.code};

    valsPage = {id: null};

    valsArr = {id: null};

    let product: any = null;
    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        product = Tools.getSingleResult(result);
        valsPage.id = product.id;
        sqlPage = sqlPage.replace('@@CLASSIFICATION@@', (product.classifications || '0'));
        return Oracledb.select(sqlPage, valsPage, req, null, null);
      }
    ).then(
      function (result) {
        let page: any = Tools.getSingleResult(result);
        valsArr.id = page.id;
        return Oracledb.select(sqlArr, valsArr, req, null, null);
      }
    ).then(
      function (result) {
        let arr = Tools.getMultiResult(result);
        arr.push(product);
        res.json(arr);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
  }
}

export function productsList (req, res) {
  let sql, vals, valsDef, valsLogin, rowsOnPage, page, sort, orderBySql, whereSql, filtersParams, sqlCl, valsCl, loginName;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE) || '';

  try {
    rowsOnPage = req.query.rowsonpage || 8;
    page = req.query.page || 1;
    sort = req.query.sort;

    // SORTING
    if (sort === 'price_asc') {
      orderBySql = ' order by e1_web_cena(null,"code",null,null,null,null,1,1,1,null,:loginName,1) asc ';
    } else if (sort === 'price_desc') {
      orderBySql = ' order by e1_web_cena(null,"code",null,null,null,null,1,1,1,null,:loginName,1) desc ';
    } else if (sort === 'name_asc') {
      orderBySql = ' order by "name" asc ';
    } else if (sort === 'name_desc') {
      orderBySql = ' order by "name" desc ';
    } else if (sort === 'code_asc') {
      orderBySql = ' order by "code" asc ';
    } else if (sort === 'code_desc') {
      orderBySql = ' order by "code" desc ';
    } else if (sort === 'sort_order_asc') {
      orderBySql = ' order by "sortOrder" asc ';
    }

    valsDef = {
      code: req.params.code,
      searchStr: req.query.searchStr
    };

    valsLogin = {
      code: req.params.code,
      searchStr: req.query.searchStr,
      loginName: loginName
    };

    vals = (sort === 'price_asc') || (sort === 'price_desc') ? valsLogin : valsDef;

    valsCl = {
      objectID: req.query.objMasterId,
      idPage: req.query.idPage
    };

    // FILTERING
    whereSql = getFilter(req.query.filter);
    filtersParams = req.query.filtersadv + Constants.commaParams + req.query.filtersbasic;
    whereSql += getFilterParams(filtersParams, vals, false, true, 'par', 'val');

    sql =
      'select ' +
      '  * ' +
      'from ' +
      '  (select ' +
      '     ROWNUM as "rowId", ' +
      '     s.* ' +
      '   from ' +
      '     (' + Constants.sqlListCore + ' @@PARAMETER_CLASSIFICATION@@ ' + whereSql + Constants.sqlListCoreGroupBy + orderBySql + ') s ' +
      '   ) ' +
      'where ' +
      '  "rowId" <= ' + (page * rowsOnPage) +
      '  and "rowId" > ' + ((page * rowsOnPage) - rowsOnPage);

    sqlCl =
      'select ' +
      '  "val", ' +
      '  "allIn" ' +
      'from ' +
      '  (select ' +
      '     1 as x, ' +
      '     DBMS_LOB.SUBSTR(hodnota, 1000, 1) as "val" ' +
      '   from ' +
      '     web_objekty_parametry_vazby ' +
      '   where ' +
      '     id_nast_webu = :idPage ' +
      '     and id_objektu = :objectID ' +
      '     and parametr = \'ZATRIDENI_PRODUKTU\'' +
      '  ) s1, ' +
      '  (select ' +
      '     1 as x, ' +
      '     DBMS_LOB.SUBSTR(hodnota, 10, 1) as "allIn" ' +
      '   from ' +
      '     web_objekty_parametry_vazby ' +
      '   where ' +
      '     id_nast_webu = :idPage ' +
      '     and id_objektu = :objectID ' +
      '     and parametr = \'ZATRIDENI_PRODUKTU_ALL_IN\'' +
      '  ) s2 ' +
      'where ' +
      '  s1.x = s2.x(+)';

    Oracledb.select(sqlCl, valsCl, req, null, null).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        sql = getSqlForClassification(data.val, sql, '@@PARAMETER_CLASSIFICATION@@', (data.allIn == 1));
        return Oracledb.select(sql, vals, req, null, null);
      }
    ).then(
      function (result) {
        let products = Tools.getMultiResult(result);
        return getProductsProperties(req, products);
      }
    ).then(
      function (result) {
        res.json(result);
      },
      function (result) {
        console.log(result);
        res.send([]);
      }
    );
  } catch (e) {
    console.log(e);
    res.send([]);
  }
}

export function productsListPagination (req, res) {
  let sql, vals, whereSql, filtersParams, sqlCl, valsCl;

  try {
    vals = {
      code: req.params.code,
      searchStr: req.query.searchStr
    };

    valsCl = {
      objectID: req.query.objMasterId,
      idPage: req.query.idPage
    };

    whereSql = getFilter(req.query.filter);
    filtersParams = req.query.filtersadv + Constants.commaParams + req.query.filtersbasic;
    //whereSql += getFilterParams(req.query.filtersadv, vals, false, true, 'parAdv', 'valAdv');
    whereSql += getFilterParams(filtersParams, vals, false, true, 'par', 'val');

    sql =
      'select ' +
      ' count(*) as "rows" ' +
      'from ' +
      '  (' + Constants.sqlListCore + ' @@PARAMETER_CLASSIFICATION@@ ' + whereSql + Constants.sqlListCoreGroupBy + ' )';

    sqlCl =
      'select ' +
      '  "val", ' +
      '  "allIn" ' +
      'from ' +
      '  (select ' +
      '     1 as x, ' +
      '     DBMS_LOB.SUBSTR(hodnota, 1000, 1) as "val" ' +
      '   from ' +
      '     web_objekty_parametry_vazby ' +
      '   where ' +
      '     id_nast_webu = :idPage ' +
      '     and id_objektu = :objectID ' +
      '     and parametr = \'ZATRIDENI_PRODUKTU\'' +
      '  ) s1, ' +
      '  (select ' +
      '     1 as x, ' +
      '     DBMS_LOB.SUBSTR(hodnota, 10, 1) as "allIn" ' +
      '   from ' +
      '     web_objekty_parametry_vazby ' +
      '   where ' +
      '     id_nast_webu = :idPage ' +
      '     and id_objektu = :objectID ' +
      '     and parametr = \'ZATRIDENI_PRODUKTU_ALL_IN\'' +
      '  ) s2 ' +
      'where ' +
      '  s1.x = s2.x(+)';

    Oracledb.select(sqlCl, valsCl, req, null, null).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        sql = getSqlForClassification(data.val, sql, '@@PARAMETER_CLASSIFICATION@@', (data.allIn == 1));
        return Oracledb.select(sql, vals, req, null, null);
      }
    ).then(
      function (result) {
        let meta = Tools.getSingleResult(result);
        res.json(meta);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function getFilter (filterStr) {
  var actionId, newsId, whereSql, availabilityCode, filter;
  filter = filterStr ? filterStr.split(':') : [];
  actionId = Constants.actionId;
  newsId = Constants.newsId;
  availabilityCode = Constants.availabilityCode;

  whereSql = '';
  if (filter.indexOf('stock') > -1) {
    whereSql += ' and p.dostupnost = \'' + availabilityCode + '\' ';
  }
  if (filter.indexOf('action') > -1) {
    whereSql += ' and exists(select id_produktu from crm_produkty_zatrideni where id_produktu = p.id and id_typ_zatrideni_produkt = ' + actionId + ') ';
  }
  if (filter.indexOf('news') > -1) {
    whereSql += ' and exists(select id_produktu from crm_produkty_zatrideni where id_produktu = p.id and id_typ_zatrideni_produkt = ' + newsId + ') ';
  }

  return whereSql;
}

export function productAttachments (req, res) {
  let sql, vals, tablesWhiteList, typesWhiteList, type;

  try {

    sql =
      'select ' +
      '  pn.priloha_id as "id", ' +
      '  pdi.popis as "fileName", ' +
      '  pdi.popis as "name", ' +
      '  pdi.puvodni_velikost / 1000000 as "size", ' +
      '  lower(decode(instr(pdi.popis, \'.\', -1), 0, null, substr(pdi.popis, instr(pdi.popis, \'.\', -1)))) as "ext" ' +
      'from ' +
      '  produkty p, ' +
      '  prilohy_nove pn, ' +
      '  prilohy_data_info pdi, ' +
      '  produkt_eshop_vazby pev ' +
      'where ' +
      '  p.id = :id ' +
      '  and pn.tabulka = \'PRODUKTY\' ' +
      '  and pn.pk = p.kod ' +
      '  and pdi.id = pn.priloha_id ' +
      '  and pdi.crm_priloha_typ = UPPER(:type) ' +
      '  and pev.zobrazit = 1 ' +
      '  and pev.produkt = p.kod ' +
      '  and pev.eshop = get_website ';

    typesWhiteList = ['DOCUMENT_PRODUCT_ESHOP', 'KE_STAZENI_PRODUKT_CZ', 'KE_STAZENI_PRODUKT_AT'];

    type = req.params.type ? req.params.type.toUpperCase() : '';
    if (typesWhiteList.indexOf(type) === -1) {
      res.json([]);
      return;
    }

    vals = {id: req.params.id, type: req.params.type};

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let meta = Tools.getMultiResult(result);
        res.json(meta);
      },
      function (result) {
        console.log(result);
        res.send([]);
      }
    );
  } catch (e) {
    console.log(e);
    res.send([]);
  }
}

export function productsSimilar (req, res) {
  let sql, vals;

  try {

    if (!req.params.id && isNaN(req.params.id)) {
      res.json([]);
      return;
    }

    sql =
      'select ' +
      '  * ' +
      'from ' +
      '  (select ' +
      '     s.*, ' +
      '     rownum as "rowId" ' +
      '   from ' +
      '     (select ' +
      '        zp.id_produktu as "id", ' +
      '        \'/\' || pr.presmerovani as "redirect", ' +
      '        p.kod as "code", ' +
      '        p.mj1 as "unit", ' +
      '        substr(to_char(pp.popis), 1, 250) as "name" ' +
      '      from ' +
      '        produkty p, ' +
      '        produkty_popis pp, ' +
      '        produkt_eshop_vazby pev, ' +
      '        crm_produkty_zatrideni zp, ' +
      '        web_website_produkt_presmer pr, ' +
      '        (select ' +
      '           zp.id_typ_zatrideni_produkt as id ' +
      '         from ' +
      '           crm_produkty_zatrideni zp ' +
      '         where ' +
      '           zp.id_produktu = :id ' +
      '           and exists ( ' +
      '               select 1 ' +
      '               from ' +
      '               crm_typy_zatrideni_produkty z ' +
      '               where ' +
      '                 z.id = zp.id_typ_zatrideni_produkt ' +
      '                 start with id = get_param(\'WEB_ESHOP_ZATRIDENI_HLAVNI_UZEL\',0,null,user) connect by prior id=matka' +
      '               ) ' +
      '         ) s ' +
      '      where ' +
      '        p.id = zp.id_produktu ' +
      '        and p.kod = pev.produkt ' +
      '        and pev.eshop = get_website ' +
      '        and pev.zobrazit = 1 ' +
      '        and p.kod = pp.produkt(+) ' +
      '        and pp.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '        and pp.website(+) = get_website ' +
      '        and pp.typ_popisu(+) = \'PRODUKT_NAZEV_ZKR\' ' +
      '        and zp.id_typ_zatrideni_produkt = s.id ' +
      '        and zp.id_produktu <> :id ' +
      '        and p.kod = pr.produkt ' +
      '        and pr.website = pev.eshop ' +
      '      group by ' +
      '         zp.id_produktu, ' +
      '         pr.presmerovani, ' +
      '         p.kod, ' +
      '         p.mj1, ' +
      '         substr(to_char(pp.popis), 1, 250) ' +
      '      ) s ' +
      '   ) ' +
      'where ' +
      '  "rowId" <= :count';

    vals = {id: req.params.id, count: req.query.count};

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let products = Tools.getMultiResult(result);
        return getProductsProperties(req, products);
      }
    ).then(
      function (result) {
        //console.log(result);
        res.json(result);
        //res.json(result);
      },
      function (result) {
        console.log(result);
        res.send([]);
      }
    );
  } catch (e) {
    console.log(e);
  }
}

var getProductsProperties = function(req, products) {
  return new Promise(function (resolve, reject) {
    var ids = '', imgEmptyLarge, path, pathEmpty, loginName;
    products.map(function (el) {
      ids += (ids ? ',' : '') + el.id;
    });

    if (!ids) {
      resolve(products);
      return;
    }

    loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE) || '';

    var sql = Constants.sqlListInfo.replace(/@@IDS@@/g, ids);

    path = Constants.imgagePath;
    pathEmpty = Constants.imgagePathEmpty;
    imgEmptyLarge = Constants.imgageEmptyLarge;

    Oracledb.select(sql, {loginName: loginName}, req, null, null).then(
      function (result) {
        try {
          let properties = Tools.getMultiResult(result);
          products.map(function (el) {
            let info = properties.filter(
                function (elm) {
                  return elm.id === el.id;
                })[0] || {};
            el.price = info.price;
            el.currency = info.currency;
            el.availability = info.availability;
            el.imgMediumId = (info.imgMediumId || 0);
            el.imgMediumExt = info.imgMediumExt;
            el.imgMediumFile = el.imgMediumId ? path + (el.imgMediumId || '') + (el.imgMediumExt || '') : pathEmpty + imgEmptyLarge;
            el.action = (info.action == 1);
            el.news = (info.news == 1);
            el.priceVat = info.price * info.priceVatKoef;
            el.inStock = (info.inStock == 1);
            el.unit = (info.unit || '');
            if (info.patternParams == 1121) {
              el.redirect = '/konfigurator/konfigurator/' + el.redirect;
            } else if (info.patternParams == 381) {
              el.redirect = '/konfigurator2/konfigurator2/' + el.redirect;
            }
          });

          resolve(products);
        } catch (e) {
          console.log(e);
          reject([]);
        }
      },
      function (result) {
        console.log(result);
        reject([]);
      }
    );
  });
};

export function getFilterForList(req, res) {
  var sql, vals, sqlItems, params, sqlWhereFilters, valsItems;
  try {
    sql =
      'SELECT ' +
      '  PARAMETR as "par", ' +
      '  MIN(PORADI) AS "sortOrder", ' +
      '  TYP as "type", ' +
      '  NAZEV as "name" ' +
      'FROM ' +
      '  (SELECT ' +
      '     PE.PARAMETR, ' +
      '     PPP.PORADI, ' +
      '     PEP.TYP, ' +
      '     PEPJ.NAZEV, ' +
      '     CASE ' +
      '       WHEN PEP.TYP IN (2,3) THEN 1 ' +
      '       WHEN PEP.TYP IN (6) THEN 2 ' +
      '     ELSE 0 ' +
      '     END AS TYPN ' +
      '   FROM ' +
      '     PRODUKTY P, ' +
      '     PRODUKTY_ESHOP PE, ' +
      '     PRODUKT_ESHOP_VAZBY pv, ' +
      '     PRODUKTY_ESHOP_PARAM_JAZYK PEPJ, ' +
      '     PRODUKTY_ESHOP_PARAM PEP, ' +
      '     CRM_PRODUKTY_ZATRIDENI Z, ' +
      '     PRODUKTY_PREDLOHY_POL PPP ' +
      '   WHERE ' +
      '     P.KOD=PE.PRODUKT ' +
      '     AND P.KOD = PV.PRODUKT ' +
      '     AND pv.ESHOP = get_website ' +
      '     AND pv.ZOBRAZIT = 1 ' +
      '     AND PEP.KOD = PE.PARAMETR ' +
      '     AND PEPJ.KOD_PARAM = PE.PARAMETR ' +
      '     AND PEPJ.JAZYK = get_param(\'JAZYK_UZIVATELE\') ' +
      '     AND P.ID=Z.ID_PRODUKTU ' +
      '     AND (Z.ID_TYP_ZATRIDENI_PRODUKT,PPP.ID_PREDLOHY) ' +
      '       IN (SELECT ' +
      '             ctzp.ID,ctzp.ID_PREDLOHY ' +
      '           FROM ' +
      '             crm_typy_zatrideni_produkty ctzp, ' +
      '             web_nastaveni_webu_zatr_prod nwz, ' +
      '             web_nastaveni_webu wnw ' +
      '           WHERE ' +
      '             ctzp.id = nwz.id_zatrideni ' +
      '             and wnw.presmerovani = :code ' +
      '             and wnw.id = nwz.id_nastaveni ' +
      '           START WITH ctzp.ID = nwz.id_zatrideni CONNECT BY PRIOR ctzp.ID = ctzp.MATKA' +
      '           ) ' +
      '     AND PE.PRODUKT = P.KOD ' +
      '     AND PE.PARAMETR = PPP.KOD_PARAM ' +
      '     AND ((PPP.TYP IN(1,2) AND :type = 2) OR (PPP.TYP IN(41) AND :type = 1)) ' +
      '   ) S ' +
      'GROUP BY ' +
      '  parametr, ' +
      '  typ, ' +
      '  nazev ' +
      'ORDER BY ' +
      '  "sortOrder", ' +
      '  "par"';

    valsItems = {code: req.params.code, type: req.params.type};
    sqlWhereFilters = getFilterParams(req.query.filtersadv, valsItems, false, true, null, null);

    sqlItems =
      'SELECT ' +
      '  "par", ' +
      '  "par" || \':\' || NVL("valx", hodnota) as "val", ' +
      '  "par" || \':\' || NVL("valx", hodnota) as "id", ' +
      '  "type", ' +
      '  NVL("valx", hodnota) as "val2", ' +
      '  DECODE("type", 4, DECODE("valx", \'1\', \'Ano\', \'Ne\'), NVL("valx", hodnota)) as "name" ' +
      'FROM ' +
      '  (SELECT ' +
      '     s.parametr as "par", ' +
      '     (SELECT ' +
      '        DBMS_LOB.SUBSTR(EPVJ.HODNOTA, 1000, 1) ' +
      '      FROM ' +
      '        PRODUKTY_ESHOP_PARVAL_JAZYK EPVJ ' +
      '      WHERE ' +
      '        EPVJ.ID_PARVAL = S.ID_PARAMVALUE ' +
      '        AND EPVJ.JAZYK = get_param(\'JAZYK_UZIVATELE\') ' +
      '     ) AS "valx", ' +
      '     s.typ as "type", ' +
      '     s.hodnota ' +
      '   FROM ' +
      '     (SELECT ' +
      '        pe.id_paramvalue, ' +
      '        pe.parametr, ' +
      '        pep.typ, ' +
      '        DBMS_LOB.SUBSTR(pe.hodnota, 1000, 1) as hodnota ' +
      '      FROM ' +
      '        produkty p, ' +
      '        crm_produkty_zatrideni z, ' +
      '        produkty_predlohy_pol ppp, ' +
      '        PRODUKTY_ESHOP_PARAM pep, ' +
      //'        PRODUKTY_ESHOP_PARAM_JAZYK pepj, ' +
      '        (SELECT ' +
      '           pe.produkt, ' +
      '           pe.parametr, ' +
      '           pe.id_paramvalue, ' +
      '           pe.hodnota ' +
      '         FROM ' +
      '           produkty_eshop pe, ' +
      '           produkty p, ' +
      '           PRODUKT_ESHOP_VAZBY pv ' +
      '         WHERE ' +
      '           pe.produkt = p.kod ' +
      '           AND P.KOD = PV.PRODUKT ' +
      '           AND pv.ESHOP = get_website ' +
      '           AND pv.ZOBRAZIT = 1 ' +
      sqlWhereFilters +
      '         ) PE ' +
      '      WHERE ' +
      '        P.KOD=PE.PRODUKT ' +
      '        AND ((PPP.TYP <> 41 AND PPP.TYP IS NOT NULL AND :type = 2) OR (PPP.TYP IN(41) AND :type = 1)) ' +
      '        AND (Z.ID_TYP_ZATRIDENI_PRODUKT, PPP.ID_PREDLOHY) ' +
      '          IN (SELECT ' +
      '                ctzp.ID, ' +
      '                ctzp.ID_PREDLOHY ' +
      '              FROM ' +
      '                crm_typy_zatrideni_produkty ctzp, ' +
      '                web_nastaveni_webu_zatr_prod nwz, ' +
      '                web_nastaveni_webu wnw ' +
      '              WHERE ' +
      '                ctzp.id = nwz.id_zatrideni ' +
      '                and wnw.presmerovani = :code ' +
      '                and wnw.id = nwz.id_nastaveni ' +
      '              START WITH ctzp.ID = nwz.id_zatrideni CONNECT BY PRIOR ctzp.ID = ctzp.MATKA ' +
      '              ) ' +
      '        AND P.ID = Z.ID_PRODUKTU ' +
      '        AND PE.PARAMETR = PPP.KOD_PARAM ' +
      '        AND pep.KOD = pe.parametr ' +
      //'        AND pepj.KOD_PARAM = pe.parametr ' +
      //'        AND pepj.JAZYK = get_param(\'JAZYK_UZIVATELE\') ' +
      '     ) S ' +
      '   GROUP BY ' +
      '     typ, ' +
      '     ID_PARAMVALUE, ' +
      '     parametr, ' +
      '     hodnota ' +
      '   ORDER BY ' +
      '     parametr, ' +
      '     (SELECT PORADI FROM PRODUKTY_ESHOP_PARAMVALUE WHERE ID = S.ID_PARAMVALUE) ' +
      '   ) ' +
      'WHERE ' +
      '  NVL("valx", hodnota) is not null';

    vals = {code: req.params.code, type: req.params.type};

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        params = Tools.getMultiResult(result);
        return Oracledb.select(sqlItems, valsItems, req, null, null);
      }
    ).then(
      function (result) {
        var items = Tools.getMultiResult(result);
        params.map(function (el) {
          var values = items.filter(function (eli) {
            return eli.par === el.par;
          });
          el.items = (el.type === 3 ? Tools.sortAsc(values, 'val2') : values) || [];
        });
        res.json(params);
      },
      function (result) {
        console.log(result);
      }
    );

  } catch (e) {
    console.log(e);
    res.send([]);
  }
};

export function getFilterParams (filtersStr, vals, useWhere, firstAnd, parName, valName) {
  var sqlWhereFilters, index, params;
  sqlWhereFilters = '';
  index = 0;
  params = getParamsObjForFilter(filtersStr);

  if (params.length > 0) {
    params.map(function (el) {
      if (sqlWhereFilters) {
        sqlWhereFilters += ' and ';
      }
      el.vals.map(function (val, i) {
        index += 1;
        vals[(parName || 'par') + index] = el.par;
        vals[(valName || 'val') + index] = val;

        if (el.vals.length === 1) {
          sqlWhereFilters += ' exists(select 1 from produkty_eshop where produkt = p.kod and parametr = :' + (parName || 'par') + index + ' and DBMS_LOB.SUBSTR(hodnota, 1000, 1) = :' + (valName || 'val') + index + ') ';
        } else {
          if (i > 0) {
            sqlWhereFilters += ' or ';
          } else {
            sqlWhereFilters += ' (';
          }
          sqlWhereFilters += ' exists(select 1 from produkty_eshop where produkt = p.kod and parametr = :' + (parName || 'par') + index + ' and DBMS_LOB.SUBSTR(hodnota, 1000, 1) = :' + (valName || 'val') + index + ') ';
          if (el.vals.length - 1 === i) {
            sqlWhereFilters += ') ';
          }
        }
      });
    });

    if (sqlWhereFilters) {
      if (firstAnd) {
        sqlWhereFilters = ' and ' + sqlWhereFilters;
      }
      if (useWhere) {
        sqlWhereFilters = ' where ' + sqlWhereFilters;
      }
    }
  }

  return sqlWhereFilters;
}

export function getFilterType (req, res) {
  var sql, vals, cat, cats = [2342, 2343, 2344, 2345, 2346, 2347, 2348, 2349];
  try {
    sql =
      'SELECT ' +
      '  nwz.id_zatrideni as "id" ' +
      'FROM ' +
      '  web_nastaveni_webu_zatr_prod nwz, ' +
      '  web_nastaveni_webu wnw ' +
      'WHERE ' +
      '  wnw.presmerovani = :code ' +
      '  and wnw.id = nwz.id_nastaveni';

    vals = {code: req.params.code};

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        var data: any = Tools.getSingleResult(result);
        var pos = cats.indexOf(data.id);
        cat = pos > -1 ? data.id : 0;
        res.json({cat: cat});
      },
      function (result) {
        console.log(result);
        res.json({});
      }
    );

  } catch (e) {
    console.log(e);
    res.json({});
  }
}

export function getParamsObjForFilter (str: string): Array<Object> {
  var arr, item, newArr = [], existItem = [];
  arr = str ? str.split(Constants.commaParams) : [];
  arr.map(function (el) {
    item = el ? el.split(':') : [];
    if (item[0] && item[1]) {
      existItem = newArr.filter(function (eli) {
        return eli.par === item[0];
      });
      if (existItem.length > 0) {
        existItem[0].vals.push(item[1]);
      } else {
        newArr.push({par: item[0], vals: [item[1]]});
      }
    }
  });

  return newArr;
}

export function category (req, res) {
  let sql, vals, imgEmptyBig, path, pathEmpty;

  try {

    sql =
      'SELECT ' +
      '  s.*, ' +
      '  decode(instr(big1.popis, \'.\', -1), 0, null, substr(big1.popis, instr(big1.popis, \'.\', -1))) as "imgBig1Ext", ' +
      '  decode(instr(big2.popis, \'.\', -1), 0, null, substr(big2.popis, instr(big2.popis, \'.\', -1))) as "imgBig2Ext", ' +
      '  decode(instr(big3.popis, \'.\', -1), 0, null, substr(big3.popis, instr(big3.popis, \'.\', -1))) as "imgBig3Ext", ' +
      '  decode(instr(big4.popis, \'.\', -1), 0, null, substr(big4.popis, instr(big4.popis, \'.\', -1))) as "imgBig4Ext", ' +
      '  decode(instr(big5.popis, \'.\', -1), 0, null, substr(big5.popis, instr(big5.popis, \'.\', -1))) as "imgBig5Ext", ' +
      '  decode(instr(big6.popis, \'.\', -1), 0, null, substr(big6.popis, instr(big6.popis, \'.\', -1))) as "imgBig6Ext", ' +
      '  decode(instr(big7.popis, \'.\', -1), 0, null, substr(big7.popis, instr(big7.popis, \'.\', -1))) as "imgBig7Ext", ' +
      '  decode(instr(big8.popis, \'.\', -1), 0, null, substr(big8.popis, instr(big8.popis, \'.\', -1))) as "imgBig8Ext" ' +
      'FROM ' +
      '  (SELECT ' +
      '     zt.id as "id", ' +
      '     nw.nazev as "name", ' +
      '     zpp.popis as "description", ' +
      '     (SELECT ' +
      '        MAX(PD.ID) AS ID_PRILOHY ' +
      '      FROM ' +
      '        PRILOHY_DATA_INFO PD, ' +
      '        PRILOHY_NOVE PN ' +
      '      WHERE ' +
      '        PD.ID = PN.PRILOHA_ID ' +
      '        AND PN.TABULKA = \'ZATRIDENI_PRODUKTU\' ' +
      '        AND PN.PK = nwz.id_zatrideni ' +
      '        AND CRM_PRILOHA_TYP = \'B_lupa/lightbox\' ' +
      //'        AND (SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 2, 2) = \'_1\' OR SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 4, 4) = \'_1_B\') ' +
      '        AND SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 5, 5) = \'_01_B\' ' +
      '      ) AS "imgBig1", ' +
      '     (SELECT ' +
      '        MAX(PD.ID) AS ID_PRILOHY ' +
      '      FROM ' +
      '        PRILOHY_DATA_INFO PD, ' +
      '        PRILOHY_NOVE PN ' +
      '      WHERE ' +
      '        PD.ID = PN.PRILOHA_ID ' +
      '        AND PN.TABULKA = \'ZATRIDENI_PRODUKTU\' ' +
      '        AND PN.PK = nwz.id_zatrideni ' +
      '        AND CRM_PRILOHA_TYP = \'B_lupa/lightbox\' ' +
      //'        AND (SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 2, 2) = \'_2\' OR SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 4, 4) = \'_2_B\') ' +
      '        AND (SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 2, 2) = \'_2\' OR SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 5, 5) = \'_02_B\') ' +
      '      ) AS "imgBig2", ' +
      '     (SELECT ' +
      '        MAX(PD.ID) AS ID_PRILOHY ' +
      '      FROM ' +
      '        PRILOHY_DATA_INFO PD, ' +
      '        PRILOHY_NOVE PN ' +
      '      WHERE ' +
      '        PD.ID = PN.PRILOHA_ID ' +
      '        AND PN.TABULKA = \'ZATRIDENI_PRODUKTU\' ' +
      '        AND PN.PK = nwz.id_zatrideni ' +
      '        AND CRM_PRILOHA_TYP = \'B_lupa/lightbox\' ' +
      //'        AND (SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 2, 2) = \'_3\' OR SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 4, 4) = \'_3_B\') ' +
      '        AND SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 5, 5) = \'_03_B\' ' +
      '      ) AS "imgBig3", ' +
      '     (SELECT ' +
      '        MAX(PD.ID) AS ID_PRILOHY ' +
      '      FROM ' +
      '        PRILOHY_DATA_INFO PD, ' +
      '        PRILOHY_NOVE PN ' +
      '      WHERE ' +
      '        PD.ID = PN.PRILOHA_ID ' +
      '        AND PN.TABULKA = \'ZATRIDENI_PRODUKTU\' ' +
      '        AND PN.PK = nwz.id_zatrideni ' +
      '        AND CRM_PRILOHA_TYP = \'B_lupa/lightbox\' ' +
      //'        AND (SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 2, 2) = \'_4\' OR SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 4, 4) = \'_4_B\') ' +
      '        AND SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 5, 5) = \'_04_B\' ' +
      '      ) AS "imgBig4", ' +
      '     (SELECT ' +
      '        MAX(PD.ID) AS ID_PRILOHY ' +
      '      FROM ' +
      '        PRILOHY_DATA_INFO PD, ' +
      '        PRILOHY_NOVE PN ' +
      '      WHERE ' +
      '        PD.ID = PN.PRILOHA_ID ' +
      '        AND PN.TABULKA = \'ZATRIDENI_PRODUKTU\' ' +
      '        AND PN.PK = nwz.id_zatrideni ' +
      '        AND CRM_PRILOHA_TYP = \'B_lupa/lightbox\' ' +
      //'        AND (SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 2, 2) = \'_5\' OR SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 4, 4) = \'_5_B\') ' +
      '        AND SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 5, 5) = \'_05_B\' ' +
      '      ) AS "imgBig5", ' +
      '     (SELECT ' +
      '        MAX(PD.ID) AS ID_PRILOHY ' +
      '      FROM ' +
      '        PRILOHY_DATA_INFO PD, ' +
      '        PRILOHY_NOVE PN ' +
      '      WHERE ' +
      '        PD.ID = PN.PRILOHA_ID ' +
      '        AND PN.TABULKA = \'ZATRIDENI_PRODUKTU\' ' +
      '        AND PN.PK = nwz.id_zatrideni ' +
      '        AND CRM_PRILOHA_TYP = \'B_lupa/lightbox\' ' +
      //'        AND (SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 2, 2) = \'_6\' OR SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 4, 4) = \'_6_B\') ' +
      '        AND SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 5, 5) = \'_06_B\' ' +
      '      ) AS "imgBig6", ' +
      '     (SELECT ' +
      '        MAX(PD.ID) AS ID_PRILOHY ' +
      '      FROM ' +
      '        PRILOHY_DATA_INFO PD, ' +
      '        PRILOHY_NOVE PN ' +
      '      WHERE ' +
      '        PD.ID = PN.PRILOHA_ID ' +
      '        AND PN.TABULKA = \'ZATRIDENI_PRODUKTU\' ' +
      '        AND PN.PK = nwz.id_zatrideni ' +
      '        AND CRM_PRILOHA_TYP = \'B_lupa/lightbox\' ' +
      //'        AND (SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 2, 2) = \'_7\' OR SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 4, 4) = \'_7_B\') ' +
      '        AND SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 5, 5) = \'_07_B\' ' +
      '      ) AS "imgBig7", ' +
      '     (SELECT ' +
      '        MAX(PD.ID) AS ID_PRILOHY ' +
      '      FROM ' +
      '        PRILOHY_DATA_INFO PD, ' +
      '        PRILOHY_NOVE PN ' +
      '      WHERE ' +
      '        PD.ID = PN.PRILOHA_ID ' +
      '        AND PN.TABULKA = \'ZATRIDENI_PRODUKTU\' ' +
      '        AND PN.PK = nwz.id_zatrideni ' +
      '        AND CRM_PRILOHA_TYP = \'B_lupa/lightbox\' ' +
      //'        AND (SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 2, 2) = \'_8\' OR SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 4, 4) = \'_8_B\') ' +
      '        AND SUBSTR(POPIS, INSTR(POPIS, \'.\', - 1) - 5, 5) = \'_08_B\' ' +
      '      ) AS "imgBig8" ' +
      '   FROM ' +
      '     crm_typy_zatrideni_produkty zt, ' +
      '     web_nastaveni_webu_zatr_prod nwz, ' +
      '     web_nastaveni_webu nw, ' +
      '     crm_zatrideni_produkty_popis zpp ' +
      '   WHERE ' +
      '     nw.presmerovani = :code ' +
      '     and nw.eshop = get_website ' +
      '     and nw.id = nwz.id_nastaveni ' +
      '     and nwz.id_zatrideni = zt.id ' +
      '     and zpp.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '     and zpp.website(+) = get_website ' +
      '     and zpp.id_zatr(+) = nwz.id_zatrideni ' +
      '   ) s, ' +
      '  prilohy_data_info big1, ' +
      '  prilohy_data_info big2, ' +
      '  prilohy_data_info big3, ' +
      '  prilohy_data_info big4, ' +
      '  prilohy_data_info big5, ' +
      '  prilohy_data_info big6, ' +
      '  prilohy_data_info big7, ' +
      '  prilohy_data_info big8 ' +
      'WHERE ' +
      '  s."imgBig1" = big1.id(+) ' +
      '  and s."imgBig2" = big2.id(+) ' +
      '  and s."imgBig3" = big3.id(+) ' +
      '  and s."imgBig4" = big4.id(+) ' +
      '  and s."imgBig5" = big5.id(+) ' +
      '  and s."imgBig6" = big6.id(+) ' +
      '  and s."imgBig7" = big7.id(+) ' +
      '  and s."imgBig8" = big8.id(+) ';

    path = Constants.imgagePath;
    pathEmpty = Constants.imgagePathEmpty;
    imgEmptyBig = Constants.imgageEmptyBig;

    vals = {code: req.params.code};

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let cats: any = Tools.getSingleResult(result);
        // IMAGES
        cats.imgBig1File = cats.imgBig1 ? path + (cats.imgBig1 || '') + (cats.imgBig1Ext || '') : pathEmpty + imgEmptyBig;
        cats.imgBig2File = cats.imgBig2 ? path + (cats.imgBig2 || '') + (cats.imgBig2Ext || '') : pathEmpty + imgEmptyBig;
        cats.imgBig3File = cats.imgBig3 ? path + (cats.imgBig3 || '') + (cats.imgBig3Ext || '') : pathEmpty + imgEmptyBig;
        cats.imgBig4File = cats.imgBig4 ? path + (cats.imgBig4 || '') + (cats.imgBig4Ext || '') : pathEmpty + imgEmptyBig;
        cats.imgBig5File = cats.imgBig5 ? path + (cats.imgBig5 || '') + (cats.imgBig5Ext || '') : pathEmpty + imgEmptyBig;
        cats.imgBig6File = cats.imgBig6 ? path + (cats.imgBig6 || '') + (cats.imgBig6Ext || '') : pathEmpty + imgEmptyBig;
        cats.imgBig7File = cats.imgBig7 ? path + (cats.imgBig7 || '') + (cats.imgBig7Ext || '') : pathEmpty + imgEmptyBig;
        cats.imgBig8File = cats.imgBig8 ? path + (cats.imgBig8 || '') + (cats.imgBig8Ext || '') : pathEmpty + imgEmptyBig;
        res.json(cats);
      },
      function (result) {
        console.log(result);
        res.json({});
      }
    );
  } catch (e) {
    console.log(e);
    res.json({});
  }
}

export function catsAttachments (req, res) {
  let sql, vals, typesWhiteList, type;

  try {

    sql =
      'select ' +
      '  pn.priloha_id as "id", ' +
      '  pdi.popis as "fileName", ' +
      '  pdi.popis as "name", ' +
      '  pdi.puvodni_velikost / 1000000 as "size", ' +
      '  lower(decode(instr(pdi.popis, \'.\', -1), 0, null, substr(pdi.popis, instr(pdi.popis, \'.\', -1)))) as "ext" ' +
      'from ' +
      '  prilohy_nove pn, ' +
      '  prilohy_data_info pdi ' +
      'where ' +
      '  pn.tabulka = \'ZATRIDENI_PRODUKTU\' ' +
      '  and pn.pk = :id ' +
      '  and pdi.id = pn.priloha_id ' +
      '  and pdi.crm_priloha_typ = UPPER(:type) ';

    typesWhiteList = ['DOCUMENT_PRODUCT_ZATRIDENI_ESHOP', 'KE_STAZENI_ZATRIDENI_CZ', 'KE_STAZENI_ZATRIDENI_AT'];

    type = req.params.type ? req.params.type.toUpperCase() : '';
    if (typesWhiteList.indexOf(type) === -1) {
      res.json([]);
      return;
    }

    vals = {id: req.params.id, type: req.params.type};

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let meta = Tools.getMultiResult(result);
        res.json(meta);
      },
      function (result) {
        console.log(result);
        res.send([]);
      }
    );
  } catch (e) {
    console.log(e);
    res.send([]);
  }
}

export function catsAndProductsAttachments (req, res) {
  let sql, vals, typesWhiteList, type, downloadAttTypeCat, downloadAttTypeProduct;

  try {

    if (req.countryVersion === Constants.AUT_COUNTRY_CODE) {
      downloadAttTypeCat = Constants.DOWNLOAD_TYPE_CATEGORY_AT;
      downloadAttTypeProduct = Constants.DOWNLOAD_TYPE_PRODUCT_AT;
    }
    if (req.countryVersion === Constants.CZECH_COUNTRY_CODE) {
      downloadAttTypeCat = Constants.DOWNLOAD_TYPE_CATEGORY_CZ;
      downloadAttTypeProduct = Constants.DOWNLOAD_TYPE_PRODUCT_CZ;
    }

    sql =
      'select ' +
      '  * ' +
      'from ' +
      '(' +
      'select ' +
      '  pn.priloha_id as "id", ' +
      '  pdi.popis as "fileName", ' +
      '  pdi.popis as "name", ' +
      '  pdi.puvodni_velikost / 1000000 as "size", ' +
      '  lower(decode(instr(pdi.popis, \'.\', -1), 0, null, substr(pdi.popis, instr(pdi.popis, \'.\', -1)))) as "ext" ' +
      'from ' +
      '  prilohy_nove pn, ' +
      '  prilohy_data_info pdi ' +
      'where ' +
      '  pn.tabulka = \'ZATRIDENI_PRODUKTU\' ' +
      '  and pn.pk = :id ' +
      '  and pdi.id = pn.priloha_id ' +
      '  and pdi.crm_priloha_typ = \'' + downloadAttTypeCat + '\' ' +
      'UNION ' +
      'select ' +
      '  MAX(pn.priloha_id) as "id", ' +
      '  pdi.popis as "fileName", ' +
      '  pdi.popis as "name", ' +
      '  pdi.puvodni_velikost / 1000000 as "size", ' +
      '  lower(decode(instr(pdi.popis, \'.\', -1), 0, null, substr(pdi.popis, instr(pdi.popis, \'.\', -1)))) as "ext" ' +
      'from ' +
      '  prilohy_nove pn, ' +
      '  prilohy_data_info pdi, ' +
      '  crm_produkty_zatrideni z, ' +
      '  produkty p ' +
      'where ' +
      '  pn.tabulka = \'PRODUKTY\' ' +
      '  and pn.pk = p.kod ' +
      '  and pdi.id = pn.priloha_id ' +
      '  and pdi.crm_priloha_typ = \'' + downloadAttTypeProduct + '\' ' +
      '  and z.id_typ_zatrideni_produkt = :id ' +
      '  and z.id_produktu = p.id ' +
      'group by ' +
      //'  pn.priloha_id, ' +
      '  pdi.popis, ' +
      '  pdi.puvodni_velikost ' +
      ') ' +
      'order by ' +
      '  "name"';

    /*typesWhiteList = ['DOCUMENT_PRODUCT_ZATRIDENI_ESHOP', 'KE_STAZENI_ZATRIDENI_CZ', 'KE_STAZENI_ZATRIDENI_AT'];

    type = req.params.type ? req.params.type.toUpperCase() : '';
    if (typesWhiteList.indexOf(type) === -1) {
      res.json([]);
      return;
    }*/

    vals = {id: req.params.id};

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let meta = Tools.getMultiResult(result);
        res.json(meta);
      },
      function (result) {
        console.log(result);
        res.send([]);
      }
    );
  } catch (e) {
    console.log(e);
    res.send([]);
  }
}

export function attachments (req, res) {
  if (req.params.tableName && req.params.tableName.toUpperCase() === 'PRODUKTY') {
    productAttachments(req, res);
  } else if (req.params.tableName && req.params.tableName.toUpperCase() === 'ZATRIDENI_PRODUKTU') {
    catsAttachments(req, res);
  } else if (req.params.tableName && req.params.tableName.toUpperCase() === 'PRODUKTY_A_ZATRIDENI_PRODUKTU') {
    catsAndProductsAttachments(req, res);
  } else {
    res.json([]);
  }
}

export function attachment (req, res) {
  let sql, vals, obj, sqlAtt;

  try {

    sqlAtt =
      'select ' +
      '  blob_content as "content" ' +
      'from ' +
      '  prilohy_data ' +
      'where ' +
      '  id = :id ';

    sql =
      'select ' +
      '  pdi.id as "id", ' +
      '  pdi.popis as "fileName", ' +
      '  pdi.mime_type as "mimeType", ' +
      '  pdi.puvodni_velikost as "size" ' +
      'from ' +
      '  prilohy_data_info pdi, ' +
      '  prilohy_typy pt ' +
      'where ' +
      '  pdi.id = :id ' +
      '  and pdi.crm_priloha_typ = pt.kod ' +
      '  and pt.eshop = 1';

    vals = {id: req.params.id};
    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let att: any = Tools.getSingleResult(result);
        obj = {
          fileName: att.fileName,
          fileLength: att.size,
          mimeType: att.mimeType
        };

        if (!att.id) {
          res.send('');
          return;
        }
        Oracledb.sendBlob2(sqlAtt, vals, req, null, obj, res);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function xmlExportSeznam (req, res) {
  let sql, rows, temp, obj = '', i, l;

  try {

    sql =
      'SELECT ' +
      '  kod as "kod", ' +
      '  replace_to_wildcards(ps_nazev, 1) as "categoryText", ' +
      '  replace_to_wildcards(nazev, 1) as "productName", ' +
      '  replace_to_wildcards(popis, 1) as "description", ' +
      '  replace_to_wildcards(katalogove_cislo, 1) as "productNo", ' +
      '  replace_to_wildcards( nvl(get_param(\'XML_FEED_SEZNAM_SHOP_DEPOT\',0,null,user), web_format_sklad_ext_pro_exp(kod,\'SEZNAM\')), 1) as "shopDepots", ' +
      '  round(price_vat + (price_vat * (vat/100)), 2) as "priceVat", ' +
      '  get_param(\'WEB_ESHOP_ADDRESS\',uzivatel=>user)||\'/\'||presmerovani as "url", ' +
      '  get_param(\'WEB_ESHOP_ADDRESS\',uzivatel=>user)||\'/\'||get_param(\'WEB_ESHOP_ADDRESS_DAD\',uzivatel=>user)||\'/\'||\'web_get_img_data?aID=\'||id_prilohy as "imgUrl", ' +
      '  nvl(replace_to_wildcards((select nazev from partneri where partner=vyrobce), 1),\' \') as "manufacturer", ' +
      '  nvl(ck_kod,\' \') as "ean", ' +
      '  nvl(dny,0) as "deliveryDate" ' +
      'FROM ' +
      '  (SELECT ' +
      '    p.vyrobce, ' +
      '    p.sazba_dan_pro, ' +
      '    p.nazev, ' +
      '    p.nazev2, ' +
      '    p.popis, ' +
      '    p.katalogove_cislo, ' +
      '    pr.presmerovani, ' +
      '    p.dostupnost, ' +
      '    p.id, ' +
      '    max(i.id) as id_prilohy, ' +
      '    p.kod, ' +
      '    d.dny, ' +
      '    c.kod as ck_kod, ' +
      '    ps.nazev as ps_nazev, ' +
      '    m.cena as price_vat, ' +
      '    (select nvl(danove_sazby.procent,0) from danove_sazby where kod=sazba_dan_pro and danove_sazby.dph_stat=\'CZ\' ) as vat ' +
      '   FROM ' +
      '     (SELECT id,kod,dostupnost,katalogove_cislo,popis,nazev2,nazev,sazba_dan_pro,vyrobce FROM produkty) p, ' +
      '     (SELECT id,crm_priloha_typ,soubor FROM prilohy_data_info) i, ' +
      '     (SELECT pk,priloha_id,tabulka FROM prilohy_nove) n, ' +
      '     (SELECT eshop,zobrazit,produkt FROM produkt_eshop_vazby) v, ' +
      '     (SELECT produkt,vychozi,kod,typ FROM produkty_ck) c, ' +
      '     (SELECT dny,kod,exportovat FROM produkty_dostupnost) d, ' +
      '     (SELECT s.id_produktu,sp.nazev FROM produkty_srovnavace s, typy_srovnavace_produkty sp WHERE s.id_typ_srovnavace_produkt = sp.id and typ = \'SEZNAM\') ps, ' +
      '     e1_web_cena_mv m, ' +
      '     web_website_produkt_presmer pr ' +
      '   WHERE ' +
      '     n.priloha_id=i.id and ' +
      '     n.pk=p.kod and ' +
      '     n.tabulka=\'PRODUKTY\' ' +
      '     and i.crm_priloha_typ=\'S_nahled\' ' +
      '     and substr(i.soubor, instr(i.soubor,\'.\',-1)-5, 5) = \'_01_S\' ' +
      '     and v.produkt=p.kod ' +
      '     and v.eshop=get_website ' +
      '     and v.zobrazit=1 ' +
      '     and c.produkt(+)=p.kod ' +
      '     and c.vychozi(+)=1 ' +
      '     and c.typ(+)=0 ' +
      '     and d.kod(+)=p.dostupnost ' +
      '     and d.exportovat=1 ' +
      '     and ps.id_produktu(+)=p.id ' +
      '     and p.kod=m.kod ' +
      '     and m.website=get_website ' +
      '     and p.kod = pr.produkt ' +
      '     and pr.website = v.eshop ' +
      '   GROUP BY ' +
      '     p.kod, ' +
      '     p.vyrobce, ' +
      '     p.sazba_dan_pro, ' +
      '     p.nazev, ' +
      '     p.nazev2, ' +
      '     p.popis, ' +
      '     p.katalogove_cislo, ' +
      '     pr.presmerovani, ' +
      '     p.dostupnost, ' +
      '     p.id, ' +
      '     d.dny, ' +
      '     c.kod, ' +
      '     ps.nazev, ' +
      '     m.cena ' +
      '  )';

    Oracledb.select(sql, [], req, null, null).then(
      function (result) {
        rows = Tools.getMultiResult(result);
        obj = '<SHOP>';
        for (i = 0, l = rows.length; i < l; i += 1) {
          temp =
            '<SHOPITEM>' +
            '<PRODUCTNAME>'+rows[i].productName+' McLED '+rows[i].kod+'</PRODUCTNAME>' +
            '<DESCRIPTION>'+rows[i].description+'</DESCRIPTION>' +
            '<PRODUCTNO>'+rows[i].productNo+'</PRODUCTNO>' +
            '<URL>'+rows[i].url+'</URL>' +
            '<IMGURL>'+rows[i].imgUrl+'</IMGURL>' +
            '<PRICE_VAT>'+rows[i].priceVat+'</PRICE_VAT>' +
            '<SHOP_DEPOTS>12805266</SHOP_DEPOTS>' +
            '<ITEM_TYPE>new</ITEM_TYPE>' +
            '<MANUFACTURER>'+rows[i].manufacturer+'</MANUFACTURER>' +
            '<EAN>'+rows[i].ean+'</EAN>' +
            '<DELIVERY_DATE>'+rows[i].deliveryDate+'</DELIVERY_DATE>' +
            '<CATEGORYTEXT>'+rows[i].categoryText+'</CATEGORYTEXT>' +
            '</SHOPITEM>';
          obj += temp;
        };
        obj += '</SHOP>';
        res.setHeader('Content-Type', 'text/xml');
        res.end(obj);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function xmlExportHeureka (req, res) {
  let sql, rows, temp, obj = '', i, l;

  try {

    sql =
      'SELECT ' +
      '  kod as "kod", ' +
      '  replace_to_wildcards(ps_nazev, 1) as "categoryText", ' +
      '  replace_to_wildcards(nazev, 1) as "productName", ' +
      '  replace_to_wildcards(popis, 1) as "description", ' +
      '  replace_to_wildcards(decode(katalogove_cislo,null,null,\'(\'||katalogove_cislo||\')\'), 1) as "productNo", ' +
      '  round(price_vat + (price_vat * (vat/100)), 2) as "priceVat", ' +
      '  get_param(\'WEB_ESHOP_ADDRESS\',uzivatel=>user)||\'/\'||presmerovani as "url", ' +
      '  get_param(\'WEB_ESHOP_ADDRESS\',uzivatel=>user)||\'/\'||get_param(\'WEB_ESHOP_ADDRESS_DAD\',uzivatel=>user)||\'/\'||\'web_get_img_data?aID=\'||id_prilohy as "imgUrl", ' +
      '  nvl(replace_to_wildcards((select nazev from partneri where partner=vyrobce), 1),\' \') as "manufacturer", ' +
      '  nvl(ck_kod,\' \') as "ean", ' +
      '  nvl(dny,0) as "deliveryDate" ' +
      'FROM ' +
      '  (SELECT ' +
      '    p.vyrobce, ' +
      '    p.sazba_dan_pro, ' +
      '    p.nazev, ' +
      '    p.nazev2, ' +
      '    p.popis, ' +
      '    p.katalogove_cislo, ' +
      '    pr.presmerovani, ' +
      '    p.dostupnost, ' +
      '    p.id, ' +
      '    max(i.id) as id_prilohy, ' +
      '    p.kod, ' +
      '    d.dny, ' +
      '    c.kod as ck_kod, ' +
      '    ps.nazev as ps_nazev, ' +
      '    m.cena as price_vat, ' +
      '    (select nvl(danove_sazby.procent,0) from danove_sazby where kod=sazba_dan_pro and danove_sazby.dph_stat=\'CZ\' ) as vat ' +
      '   FROM ' +
      '     (SELECT id,kod,dostupnost,katalogove_cislo,popis,nazev2,nazev,sazba_dan_pro,vyrobce FROM produkty) p, ' +
      '     (SELECT id,crm_priloha_typ,soubor FROM prilohy_data_info) i, ' +
      '     (SELECT pk,priloha_id,tabulka FROM prilohy_nove) n, ' +
      '     (SELECT eshop,zobrazit,produkt FROM produkt_eshop_vazby) v, ' +
      '     (SELECT produkt,vychozi,kod,typ FROM produkty_ck) c, ' +
      '     (SELECT dny,kod,exportovat FROM produkty_dostupnost) d, ' +
      '     (SELECT s.id_produktu,sp.nazev FROM produkty_srovnavace s, typy_srovnavace_produkty sp WHERE s.id_typ_srovnavace_produkt = sp.id and typ = \'HEUREKA\') ps, ' +
      '     e1_web_cena_mv m, ' +
      '     web_website_produkt_presmer pr ' +
      '   WHERE ' +
      '     n.priloha_id=i.id ' +
      '     and n.pk=p.kod ' +
      '     and n.tabulka=\'PRODUKTY\' ' +
      '     and i.crm_priloha_typ=\'S_nahled\' ' +
      '     and substr(i.soubor, instr(i.soubor,\'.\',-1)-5, 5) = \'_01_S\' ' +
      '     and v.produkt=p.kod ' +
      '     and v.eshop=get_website ' +
      '     and v.zobrazit=1 ' +
      '     and c.produkt(+)=p.kod ' +
      '     and c.vychozi(+)=1 ' +
      '     and c.typ(+)=0 ' +
      '     and d.kod(+)=p.dostupnost ' +
      '     and d.exportovat=1 ' +
      '     and ps.id_produktu(+)=p.id ' +
      '     and p.kod=m.kod ' +
      '     and m.website=get_website ' +
      '     and p.kod = pr.produkt ' +
      '     and pr.website = v.eshop ' +
      '   GROUP BY ' +
      '     p.kod, ' +
      '     p.vyrobce, ' +
      '     p.sazba_dan_pro, ' +
      '     p.nazev, ' +
      '     p.nazev2, ' +
      '     p.popis, ' +
      '     p.katalogove_cislo, ' +
      '     pr.presmerovani, ' +
      '     p.dostupnost, ' +
      '     p.id, ' +
      '     d.dny, ' +
      '     c.kod, ' +
      '     ps.nazev, ' +
      '     m.cena ' +
      '  )';

    Oracledb.select(sql, [], req, null, null).then(
      function (result) {
        rows = Tools.getMultiResult(result);
        obj = '<SHOP>';
        for (i = 0, l = rows.length; i < l; i += 1) {
          temp =
            '<SHOPITEM>' +
            '<ITEM_ID>'+rows[i].kod+'</ITEM_ID>' +
            '<PRODUCTNAME>'+rows[i].productName+' McLED '+rows[i].productNo+'</PRODUCTNAME>' +
            '<DESCRIPTION>'+rows[i].description+'</DESCRIPTION>' +
            '<URL>'+rows[i].url+'</URL>' +
            '<IMGURL>'+rows[i].imgUrl+'</IMGURL>' +
            '<IMGURL_ALTERNATIVE></IMGURL_ALTERNATIVE>' +
            '<VIDEO_URL></VIDEO_URL>' +
            '<PRICE_VAT>'+rows[i].priceVat+'</PRICE_VAT>' +
            '<HEUREKA_CPC></HEUREKA_CPC>' +
            '<MANUFACTURER>'+rows[i].manufacturer+'</MANUFACTURER>' +
            '<CATEGORYTEXT>'+rows[i].categoryText+'</CATEGORYTEXT>' +
            '<EAN>'+rows[i].ean+'</EAN>' +
            '<DELIVERY_DATE>'+rows[i].deliveryDate+'</DELIVERY_DATE>' +
            '</SHOPITEM>';
          obj += temp;
        };
        obj += '</SHOP>';
        res.setHeader('Content-Type', 'text/xml');
        res.end(obj);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function sitemap (req, res) {
  let sqlAdresa, sql, data, rows, adresa, date, temp, obj = '', i, l;

  try {
    sqlAdresa =
      'SELECT ' +
      '  get_param(\'WEB_ESHOP_ADDRESS\',0,null,user) as "adresa", ' +
      '  to_char(sysdate,\'YYYY-MM-DD\') as "date" ' +
      'FROM ' +
      '  dual';

    sql =
      'SELECT ' +
      '  replace(replace(r.odkud, \'$\', \'\'), \'^\', \'\') as "from" ' +
      'FROM ' +
      '  (SELECT ' +
      '     re.*, ' +
      '     p.kod ' +
      '   FROM ' +
      '     produkty p, ' +
      '     web_website_produkt_presmer pr, ' +
      '     web_redirect re ' +
      '   WHERE ' +
      '     p.kod = pr.produkt ' +
      '     and pr.website(+) = get_website ' +
      '     and re.id_presmerovani = pr.id_presmerovani(+)' +
      '  ) r, ' +
      '  web_eshopy e, ' +
      '  web_nastaveni_webu s ' +
      'WHERE ' +
      '  e.user_login=get_website ' +
      '  and e.kod=r.eshop ' +
      '  and r.tabulka in (\'PRODUKTY\', \'WEB_NASTAVENI_WEBU\') ' +
      '  and r.id_presmerovani=s.id_presmerovani(+) ' +
      '  and ((r.tabulka=\'WEB_NASTAVENI_WEBU\' ' +
      '        and s.rss_export = 1 ' +
      '        and s.id not in(' +
      '            SELECT ' +
      '              id ' +
      '            FROM ' +
      '              web_nastaveni_webu start with id=(' +
      '                SELECT ' +
      '                  id ' +
      '                FROM ' +
      '                  web_nastaveni_webu ' +
      '                WHERE ' +
      '                  kod=\'SYSTEMOVE_ZAZNAMY\' ' +
      '                  and eshop=e.kod) ' +
      '              connect by prior id=matka) ' +
      '      and r.id_presmerovani=s.id_presmerovani) ' +
      '     or ' +
      '       (s.id is null ' +
      '        and ' +
      '        r.tabulka<>\'WEB_NASTAVENI_WEBU\' ' +
      '     )) ' +
      '  and ((r.tabulka=\'PRODUKTY\' ' +
      '        and exists(' +
      '           SELECT ' +
      '             1 ' +
      '           FROM ' +
      '             produkt_eshop_vazby ' +
      '           WHERE ' +
      '             produkt=r.kod ' +
      '             and zobrazit=1)) ' +
      '       or ' +
      '        (r.tabulka<>\'PRODUKTY\' ' +
      '      )) ' +
      '  and r.aktivni=1 ' +
      'ORDER BY ' +
      '  tabulka ';

    Oracledb.select(sqlAdresa, [], req, null, null).then(
      function (result) {
        data = Tools.getSingleResult(result);
        adresa = data.adresa;
        date = data.date;
        return Oracledb.select(sql, [], req, null, null);
      }
    ).then(
      function (result) {
        rows = Tools.getMultiResult(result);
        obj = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        for (i = 0, l = rows.length; i < l; i += 1) {
          temp =
            '<url>' +
            '<loc>'+adresa+'/'+rows[i].from+'</loc>' +
            '<lastmod>'+date+'</lastmod>' +
            '</url>';
          obj += temp;
        };
        obj += '</urlset>';
        res.setHeader('Content-Type', 'text/xml');
        res.end(obj);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function partnersList (req, res) {
  let sql, rows, i, l;

  try {

    sql =
      'select ' +
      '  nazev as "name", ' +
      '  presmerovani as "redirect", ' +
      '  id_prilohy as "idAtt" ' +
      'from ' +
      '  (select ' +
      '     p.nazev, ' +
      '     DBMS_LOB.SUBSTR(pp.hodnota, 250, 1) as presmerovani, ' +
      '     s.partner_order, ' +
      '     max(pd.id) as id_prilohy ' +
      '   from ' +
      '     partneri p, ' +
      '     partneri_parametry pp, ' +
      '     crm_partneri_zatrideni s, ' +
      '     prilohy_data_info pd, ' +
      '     prilohy_nove pn ' +
      '   where ' +
      '     p.partner = s.partner ' +
      '     and p.partner = pp.partner(+) ' +
      '     and pp.parametr = \'' + Constants.WWW_ANCHOR_CODE + '\' ' +
      '     and s.id_typ_zatrideni_firma in (select id from crm_typy_zatrideni_firmy start with id = ' + Constants.PARTNERS_LOGO_CATS + ' connect by prior id = matka) ' +
      '     and pd.id = pn.priloha_id ' +
      '     and pd.crm_priloha_typ = \'' + Constants.IMAGE_LOGO_WEB_TYPE_CODE + '\' ' +
      '     and pn.tabulka = \'PARTNERI\' ' +
      '     and pn.pk = p.partner ' +
      '   group by ' +
      '     p.nazev, ' +
      '     DBMS_LOB.SUBSTR(pp.hodnota, 250, 1), ' +
      '     s.partner_order ' +
      '   order by ' +
      '     s.partner_order ' +
      '  ) ' +
      'where ' +
      'rownum <= 7';

    Oracledb.select(sql, [], req, null, null).then(
      function (result) {
        rows = Tools.getMultiResult(result) || [];
        res.json(rows);
      },
      function (result) {
        console.log(result);
        res.json([]);
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }

}

export function newsletterLogin (req, res) {
  let sql, vals, sessionid, sqlProps;

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  if (req.body.email && !Tools.validateEmail(req.body.email)) {
    res.json({});
    return;
  }
    try {

      sql =
        'begin web_newsletter_insert_json(:strings); end;';

      sqlProps =
        'SELECT ' +
        '  s1 as "result" ' +
        'FROM ' +
        '  sessionid_temp ' +
        'WHERE ' +
        '  sessionid = decrypt_cookie(:sessionid) ' +
        '  AND kod = \'WEB_NEWSLETTER_INSERT_JSON\'';

      vals = {
        strings: {
          type: oracle.STRING,
          dir: oracle.BIND_IN,
          val: [
            'asessionid:' + sessionid,
            'aSaveContent:1',
            'aExtCookies:1',
            'aEmail:' + req.body.email
          ]
        }
      };

      Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
        function () {
          vals = {sessionid: sessionid};
          return Oracledb.select(sqlProps, vals, req, null, null);
        }
      ).then(
        function (result) {
          res.send(Tools.getSingleResult(result));
        },
        function (result) {
          console.log(result);
          res.send('');
        }
      );
    } catch (e) {
      console.log(e);
      res.send('');
    }
}

export function logout (req, res) {
  let sql, vals = {}, sqlResult, sessionid, valsSessionid, loginName;

  try {
    loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

    sessionid = Tools.getSessionId(req);

    sql =
      'begin web_odhlasit_eshop(:strings); end;';

    sqlResult =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_ODHLASIT_ESHOP_JSON\'';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
        ]
      }
    };

    valsSessionid = {sessionid: sessionid};

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlResult, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        try {
          let dataParse = (data && data.result ? JSON.parse(data.result) : {state: -1});
          if (dataParse.state == '1') {
            Tools.deleteCookie(res, 'auth_token');
          }
          res.json(dataParse);
        } catch (e) {
          console.log(e);
          res.json({state: -1});
        }
      },
      function (result) {
        console.log(result);
        res.json({isLogged: false});
      }
    );

  } catch (e) {
    console.log(e);
    res.json({isLogged: false});
  }
}

export function login (req, res) {
  let sql, vals = {}, valsUser, sqlResult, sessionid, valsSessionid, sqlUser, sqlUserResult, loginInfo;

  try {
    sessionid = Tools.getSessionId(req);

    sql =
      'begin web_prihlasit_eshop(:strings); end;';

    sqlResult =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_PRIHLASIT_ESHOP\'';

    sqlUser =
      'begin e1_web_udaje_eshop_uziv_json(:strings); end;';

    sqlUserResult =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'E1_WEB_UDAJE_ESHOP_UZIV_JSON\'';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aSaveContent:1',
          'aExtCookies:1',
          'alg:' + (req.body.login || ''),
          'apd:' + (req.body.password || '')
        ]
      }
    };

    valsUser = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (req.body.login || ''),
          'aSaveContent:1',
          'aExtCookies:1',
        ]
      }
    };

    valsSessionid = {sessionid: sessionid};

    let obj:any = {isLogged: false};
    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlResult, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        let dataParse = data.result ? JSON.parse(data.result) : {};
        loginInfo = dataParse;
        if (dataParse.overeno == '1') {
          obj.isLogged = true;
          Tools.createAuthCookie(res, dataParse.authToken);
        }
        valsUser = {
          strings: {
            type: oracle.STRING,
            dir: oracle.BIND_IN,
            val: [
              'asessionid:' + sessionid,
              'aLoginName:' + (dataParse.authToken || ''),
              'aSaveContent:1',
              'aExtCookies:1',
            ]
          }
        };
        return Oracledb.executeSQL(sqlUser, valsUser, req, null, {commit: true});
      }
    ).then(
      function () {
        return Oracledb.select(sqlUserResult, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        let dataParse = data.result ? JSON.parse(data.result) : {};
        let user: any = {};
        user.b2bWrongWebsite = loginInfo.b2b_wrong_website == '1';
        user.b2bWebsiteUrl = loginInfo.b2b_website_url || '';
        user.b2bState = loginInfo.b2b_state || '';
        user.login = decodeURIComponent(dataParse.login || '');
        user.loginClient = decodeURIComponent(dataParse.login_client || '');
        user.isLogged = obj.isLogged;//(user.loginClient != '' && user.loginClient != '0');

        // INVOICE
        user.firstName = decodeURIComponent(dataParse.jmeno_fak || '');
        user.lastName = decodeURIComponent(dataParse.prijmeni_fak || '');
        user.email = decodeURIComponent(dataParse.email || '');
        user.phone = decodeURIComponent(dataParse.telefon || '');
        user.street = decodeURIComponent(dataParse.ulice_fak || '');
        user.city = decodeURIComponent(dataParse.mesto_fak || '');
        user.country = decodeURIComponent(dataParse.stat_fak || '');
        user.zip = decodeURIComponent(dataParse.psc_fak || '');
        user.companyName = decodeURIComponent(dataParse.nazev_fak || '');

        // DELIVERY
        user.firstNameDelivery = decodeURIComponent(dataParse.jmeno_dod || '');
        user.lastNameDelivery = decodeURIComponent(dataParse.prijmeni_dod || '');
        user.streetDelivery = dataParse.dodaci_je_fakturacni == '1' ? user.street : decodeURIComponent(dataParse.ulice_dod || '');
        user.cityDelivery = dataParse.dodaci_je_fakturacni == '1' ? user.city : decodeURIComponent(dataParse.mesto_dod || '');
        user.countryDelivery = dataParse.dodaci_je_fakturacni == '1' ? user.country : decodeURIComponent(dataParse.stat_dod || '');
        user.zipDelivery = dataParse.dodaci_je_fakturacni == '1' ? user.zip : decodeURIComponent(dataParse.psc_dod || '');
        user.companyNameDelivery = decodeURIComponent(dataParse.nazev_dod || '');

        user.deliveryIsNotInvoice = (dataParse.dodaci_je_fakturacni == '0');
        user.toCompany = (dataParse.fakturovat_na_firmu == '1');

        user.shipping = decodeURIComponent(dataParse.doprava || '');
        user.shippingDefault = decodeURIComponent(dataParse.doprava || '');
        user.payment = decodeURIComponent(dataParse.platba || '');
        user.paymentDefault = decodeURIComponent(dataParse.platba || '');

        user.saveAsNewUser = (dataParse.registrovat == '1');

        user.note = decodeURIComponent(dataParse.poznamka || '');
        user.note2 = decodeURIComponent(dataParse.poznamka2 || '');

        user.newsletter = (data.newsletter != '1');

        obj.user = user;
        res.json(obj);
      },
      function (result) {
        res.json({isLogged: false});
      }
    );

  } catch (e) {
    console.log(e);
    res.json({isLogged: false});
  }
}

export function createPartnerCookie (req, res, obj) {
  return new Promise(function (resolve, reject) {
    let sql, sqlDelete, sqlInsert, vals: any = {};
    sql =
      'SELECT ' +
      '  encrypt_cookie(' +
      '    get_random_strings(3,24) || ' +
      '    get_abc(substr(to_char(sysdate, \'dd\'),1,1)) || ' +
      '    get_abc(substr(to_char(sysdate, \'dd\'),2,1)) || ' +
      '    get_abc(substr(to_char(sysdate, \'mm\'),1,1)) || ' +
      '    get_abc(substr(to_char(sysdate, \'mm\'),2,1)) || ' +
      '    get_abc(substr(to_char(sysdate, \'yy\'),1,1)) || ' +
      '    get_abc(substr(to_char(sysdate, \'yy\'),2,1))' +
      '  ) as "encryptCookie" ' +
      'FROM ' +
      '  dual';

    sqlDelete =
      'DELETE ' +
      '  web_user_cookie ' +
      'WHERE ' +
      '  login = :login ' +
      '  AND website = get_website';

    sqlInsert =
      'INSERT INTO WEB_USER_COOKIE (COOKIE, PARTNER, LOGIN, DATUM, AUTO_CONNECT_HASH, AUTH_TOKEN, WEBSITE) ' +
      '  VALUES (decrypt_cookie(:sessionid), :partner, :login, sysdate, null, :authToken, get_website);';

    vals = {
      sessionid: Tools.getSessionId(req),
      partner: obj.partner,
      login: obj.login,
      authToken: null,
    };

    Oracledb.select(sql, {}, req, null, null).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        vals.authToken = data.encryptCookie;
        return Oracledb.select(sqlDelete, vals, req, null, null);
      }
    ).then(
      function (result) {
        return Oracledb.select(sqlInsert, vals, req, null, null);
      }
    ).then(
      function (result) {
        Tools.createCookie(res, Constants.AUTH_TOKEN_CODE, vals.authToken);
        resolve(vals);
      },
      function (result) {
        reject(result);
      }
    );
  });
}

export function productBuy (req, res) {
  let sql, vals, sessionid, sqlProps, loginName;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  if (!(req.params.id || req.body.code)) {
    res.json({});
    return;
  }
  try {

    sql =
      'begin e1_web_vlozit_do_kosiku_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'E1_WEB_VLOZIT_DO_KOSIKU_JSON\'';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          'aid:' + (req.params.id || ''),
          'akod:' + (req.body.code || ''),
          'amnozstvi:' + (req.body.amount || 1),
        ]
      }
    };

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        vals = {sessionid: sessionid};
        return Oracledb.select(sqlProps, vals, req, null, null);
      }
    ).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        let obj = (data.result ? JSON.parse(data.result) : {});
        res.json(obj);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function productDelete (req, res) {
  let sql, vals, sessionid, sqlProps, loginName, itemId, valsSessionid;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);
  itemId = req.params.itemId;

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  if (!req.params.itemId) {
    res.json({});
    return;
  }

  try {

    sql =
      'begin web_odstr_z_kos_dle_cisla_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_ODSTR_Z_KOS_DLE_CISLA_JSON\'';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'acislo:' + itemId,
          'aSaveContent:1',
          'aExtCookies:1',
        ]
      }
    };

    valsSessionid = {sessionid: sessionid};

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlProps, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        try {
          let data: any = Tools.getSingleResult(result);
          res.json(data);
        } catch (e) {
          console.log(e);
          res.json({});
        }
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function productPut (req, res) {
  let sql, vals, sessionid, sqlProps, loginName, itemId, amount, valsSessionid;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);
  itemId = req.body.itemId;
  amount = req.body.amount;

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  if (!req.body.itemId || !req.body.amount) {
    res.json({});
    return;
  }

  try {

    sql =
      'begin e1_zmen_mnoz_kos_dle_cis_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'E1_ZMEN_MNOZ_KOS_DLE_CIS_JSON\'';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'acislo:' + itemId,
          'amnozstvi:' + amount,
          'aSaveContent:1',
          'aExtCookies:1',
        ]
      }
    };

    valsSessionid = {sessionid: sessionid};

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlProps, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        try {
          let data: any = Tools.getSingleResult(result);
          res.json(data);
        } catch (e) {
          console.log(e);
          res.json({});
        }
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function createUser (req, res) {
  let sql, vals, valsCreate, sessionid, sqlProps, loginName, sqlVerify, sqlLogin, sqlLoginResult, valsLogin,
    valsSessionid, valsVerify, sqlCreate, sqlCreateResult, sqlUser, sqlUserResult, obj, valsUser;

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  loginName = req.body.login || '';

  if (!loginName || !req.body.password) {
    res.json({error: true});
    return;
  }

  try {

    sqlVerify =
      'SELECT ' +
      '  MAX(exist) as "exist",' +
      '  get_param(\'WEBSITE_REGISTRACE_HESLO_REGEX\', 0, null, USER) as "passwordPattern" ' +
      'FROM ' +
      '  (' +
      '   SELECT ' +
      '     1 as exist ' +
      '   FROM ' +
      '     partneri_osoby ' +
      '   WHERE ' +
      '     upper(login_osoby) = upper(:login) ' +
      '   UNION ' +
      '   SELECT ' +
      '     1 as exist ' +
      '   FROM ' +
      '     partneri ' +
      '   WHERE ' +
      '     upper(jmeno_uzivatele) = upper(:login) ' +
      '  )';

    sql =
      'begin web_uloz_udaje_eshop_uziv_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_ULOZ_UDAJE_ESHOP_UZIV_JSON\'';

    sqlCreate =
      'begin web_eshop_zalozit_uziv_json(:strings); end;';

    sqlCreateResult =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_ESHOP_ZALOZIT_UZIV_JSON\'';

    sqlLogin =
      'begin web_prihlasit_eshop(:strings); end;';

    sqlLoginResult =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_PRIHLASIT_ESHOP\'';

    sqlUser =
      'begin e1_web_udaje_eshop_uziv_json(:strings); end;';

    sqlUserResult =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'E1_WEB_UDAJE_ESHOP_UZIV_JSON\'';
    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          'apravnicka:' + (req.body.toCompany && (req.body.regId || req.body.vatId || req.body.companyName) ? 1 : 0),
          'pole:pravnicka',
          'afakturovat_na_firmu:' + (req.body.toCompany && (req.body.regId || req.body.vatId || req.body.companyName) ? 1 : 0),
          'pole:fakturovat_na_firmu',
          'alogin:' + (loginName || ''),
          'pole:login',
          'apwd:' + (req.body.password || ''),
          'pole:pwd',
          'ajmeno_fak:' + (req.body.firstName || ''),
          'pole:jmeno_fak',
          'aprijmeni_fak:' + (req.body.lastName || ''),
          'pole:prijmeni_fak',
          'aemail:' + (req.body.email || ''),
          'pole:email',
          'atelefon:' + (req.body.phone || ''),
          'pole:telefon',
          'aulice_fak:' + (req.body.street || ''),
          'pole:ulice_fak',
          'amesto_fak:' + (req.body.city || ''),
          'pole:mesto_fak',
          'apsc_fak:' + (req.body.zip || ''),
          'pole:psc_fak',
          'astat_fak:' + (req.body.country || ''),
          'pole:stat_fak',
          'anazev_fak:' + (req.body.companyName || ''),
          'pole:nazev_fak',
          'aulice_dod:' + (req.body.streetDelivery || ''),
          'pole:ulice_dod',
          'amesto_dod:' + (req.body.cityDelivery || ''),
          'pole:mesto_dod',
          'apsc_dod:' + (req.body.zipDelivery || ''),
          'pole:psc_dod',
          'astat_dod:' + (req.body.countryDelivery || ''),
          'pole:stat_dod',
          'anazev_dod:' + (req.body.companyNameDelivery || ''),
          'pole:nazev_dod',
          'aic:' + (req.body.regId || ''),
          'pole:ic',
          'adic:' + (req.body.vatId || ''),
          'pole:dic',
          'adodaci_je_fakturacni:' + (req.body.deliveryIsNotInvoice ? 0 : 1),
          'pole:dodaci_je_fakturacni',
          'aregistrovat:' + (req.body.saveAsNewUser ? 1 : 0),
          'pole:registrovat',
          'anovy_zakaznik:' + ((loginName == '' || loginName == '0') ? 1 : 0),
          'pole:novy_zakaznik',
          'apoznamka:' + (req.body.note || ''),
          'pole:poznamka',
          'apoznamka2:' + (req.body.note2 || ''),
          'pole:poznamka2',
          'anewsletter:' + (req.body.newsletter ? 1 : 0),
          'pole:newsletter',
          'asjednat_obch_podminky:' + (req.body.conditions ? 1 : 0),
          'pole:sjednat_obch_podminky',
          'apohlavi:' + (req.body.sex || ''),
          'pole:pohlavi',
          'apredmet_podnikani:' + (req.body.bussinesScope || ''),
          'pole:predmet_podnikani',
          'aweb_adresa:' + (req.body.webAddr || ''),
          'pole:web_adresa',
          'aosloveni:' + (req.body.sexNamePrefix || ''),
          'pole:osloveni',
        ]
      }
    };

    valsLogin = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aSaveContent:1',
          'aExtCookies:1',
          'alg:' + (loginName || ''),
          'apd:' + (req.body.password || '')
        ]
      }
    };

    valsCreate = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'alg:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          'predulozeno:1',
        ]
      }
    };

    valsUser = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
        ]
      }
    };

    valsVerify = {login: loginName};

    valsSessionid = {sessionid: sessionid};

    obj = {userExist: false, error: false, isLogged: false};
    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlProps, valsSessionid, req, null, null);
      },
      function (result) {
        console.log(result);
      }
    ).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        return Oracledb.select(sqlVerify, valsVerify, req, null, null);
      }
    ).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        if (data.exist == '1') {
          res.json({userExist: true, error: false});
          return;
        }
        if (data.passwordPattern && !(new RegExp(data.passwordPattern)).test(req.body.password)) {
          res.json({userExist: false, error: false, passwordNotValid: true});
          return;
        }

        Oracledb.executeSQL(sqlCreate, valsCreate, req, null, {commit: true}).then(
          function (result) {
            return Oracledb.select(sqlCreateResult, valsSessionid, req, null, null);
          }
        ).then(
          function (result) {
            let data: any = Tools.getSingleResult(result);
            let dataParse = data.result ? JSON.parse(data.result) : {};
            obj.error = dataParse.state != '1';
            obj.message = decodeURIComponent(dataParse.message);
            return Oracledb.executeSQL(sqlLogin, valsLogin, req, null, {commit: true});
          }
        ).then(
          function () {
            return Oracledb.select(sqlLoginResult, valsSessionid, req, null, null);
          }
        ).then(
          function (result) {
            // AFTER LOGIN
            let data: any = Tools.getSingleResult(result);
            let dataParse = data.result ? JSON.parse(data.result) : {};
            if (dataParse.overeno == '1') {
              obj.isLogged = true;
              Tools.createAuthCookie(res, dataParse.authToken);
            }
            return Oracledb.executeSQL(sqlUser, valsUser, req, null, {commit: true});
          }
        ).then(
          function () {
            return Oracledb.select(sqlUserResult, valsSessionid, req, null, null);
          }
        ).then(
          function (result) {
            let data: any = Tools.getSingleResult(result);
            let dataParse = data.result ? JSON.parse(data.result) : {};
            for (var key in dataParse) {
              if (!dataParse.hasOwnProperty(key)) {
                continue;
              }
              dataParse[key] = decodeURIComponent(dataParse[key]);
            }
            obj.user = dataParse;
            res.json(obj);
          },
          function () {
            console.log(result);
            res.json({userExist: null, error: true});
          },
        );
      },
      function (result) {
        console.log(result);
        res.json({userExist: null, error: true});
      }
    );

  } catch (e) {
    console.log(e);
    res.json({userExist: null, error: true});
  }
}

export function saveUser (req, res) {
  let sql, vals, valsCreate, sessionid, sqlProps, loginName, valsSessionid,
    sqlCreate, sqlCreateResult;

  loginName = req.body.login || '';

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  if (!req.body.login) {
    res.json({error: true});
    return;
  }

  try {

    sql =
      'begin web_uloz_udaje_eshop_uziv_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_ULOZ_UDAJE_ESHOP_UZIV_JSON\'';

    sqlCreate =
      'begin web_eshop_zalozit_uziv_json(:strings); end;';

    sqlCreateResult =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_ESHOP_ZALOZIT_UZIV_JSON\'';

    valsCreate = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          'predulozeno:1',
        ]
      }
    };

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          //'apravnicka:' + (req.body.toCompany ? 1 : 0),
          //'pole:pravnicka',
          //'afakturovat_na_firmu:' + (req.body.toCompany ? 1 : 0),
          //'pole:fakturovat_na_firmu',
          //'alogin:' + req.body.login,
          //'pole:login',
          //'apwd:' + req.body.password,
          //'pole:pwd',
          'ajmeno_fak:' + (req.body.firstName || ''),
          'pole:jmeno_fak',
          'aprijmeni_fak:' + (req.body.lastName || ''),
          'pole:prijmeni_fak',
          'aemail:' + (req.body.email || ''),
          'pole:email',
          'atelefon:' + (req.body.phone || ''),
          'pole:telefon',
          'aulice_fak:' + (req.body.street || ''),
          'pole:ulice_fak',
          'amesto_fak:' + (req.body.city || ''),
          'pole:mesto_fak',
          'apsc_fak:' + (req.body.zip || ''),
          'pole:psc_fak',
          'astat_fak:' + (req.body.country || ''),
          'pole:stat_fak',
          'anazev_fak:' + (req.body.companyName || ''),
          'pole:nazev_fak',
          'aulice_dod:' + (req.body.streetDelivery || ''),
          'pole:ulice_dod',
          'amesto_dod:' + (req.body.cityDelivery || ''),
          'pole:mesto_dod',
          'apsc_dod:' + (req.body.zipDelivery || ''),
          'pole:psc_dod',
          'astat_dod:' + (req.body.countryDelivery || ''),
          'pole:stat_dod',
          'anazev_dod:' + (req.body.companyNameDelivery || ''),
          'pole:nazev_dod',
          'aic:' + (req.body.regId || ''),
          'pole:ic',
          'adic:' + (req.body.vatId || ''),
          'pole:dic',
          'adodaci_je_fakturacni:' + (req.body.deliveryIsNotInvoice ? 0 : 1),
          'pole:dodaci_je_fakturacni',
          'aregistrovat:' + (req.body.saveAsNewUser ? 1 : 0),
          'pole:registrovat',
          'anovy_zakaznik:' + ((loginName == '' || loginName == '0') ? 1 : 0),
          'pole:novy_zakaznik',
          'apoznamka:' + (req.body.note || ''),
          'pole:poznamka',
          'apoznamka2:' + (req.body.note2 || ''),
          'pole:poznamka2',
          'anewsletter:' + (req.body.newsletter ? 1 : 0),
          'pole:newsletter',
          //'asjednat_obch_podminky:' + (req.body.conditions ? 1 : 0),
          //'pole:sjednat_obch_podminky',
          'apohlavi:' + (req.body.sex || ''),
          'pole:pohlavi',
          'apredmet_podnikani:' + (req.body.bussinesScope || ''),
          'pole:predmet_podnikani',
          'aweb_adresa:' + (req.body.webAddr || ''),
          'pole:web_adresa',
          'aosloveni:' + (req.body.sexNamePrefix || ''),
          'pole:osloveni',
        ]
      }
    };

    valsSessionid = {sessionid: sessionid};

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlProps, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        let data = Tools.getSingleResult(result);
        return Oracledb.executeSQL(sqlCreate, valsCreate, req, null, {commit: true});
      }
    ).then(
      function (result) {
        let data = Tools.getSingleResult(result);
        return Oracledb.select(sqlCreateResult, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        res.json({error: false});
      },
      function (result) {
        console.log(result);
        res.json({error: true});
      }
    );

  } catch (e) {
    console.log(e);
    res.json({userExist: null, error: true});
  }
}

export function saveCurrentUser (req, res) {
  let sql, sqlResult, loginName, vals, valsSessionid, sessionid, sqlVerify, valsVerify;

  loginName = req.body.login || '';

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  sql =
    'begin web_uloz_udaje_eshop_uziv_json(:strings); end;';

  sqlResult =
    'SELECT ' +
    '  s1 as "result" ' +
    'FROM ' +
    '  sessionid_temp ' +
    'WHERE ' +
    '  sessionid = decrypt_cookie(:sessionid) ' +
    '  AND kod = \'WEB_ULOZ_UDAJE_ESHOP_UZIV_JSON\'';

  sqlVerify =
    'SELECT ' +
    '  1 as "exist" ' +
    'FROM ' +
    '  partneri_osoby ' +
    'WHERE ' +
    '  upper(login_osoby) = upper(:login)';

  vals = {
    strings: {
      type: oracle.STRING,
      dir: oracle.BIND_IN,
      val: [
        'asessionid:' + (sessionid || ''),
        'aLoginName:' + (loginName || ''),
        'aSaveContent:1',
        'aExtCookies:1',
        'apravnicka:' + (req.body.toCompany && (req.body.regId || req.body.vatId || req.body.companyName) ? 1 : 0),
        'pole:pravnicka',
        'afakturovat_na_firmu:' + (req.body.toCompany && (req.body.regId || req.body.vatId || req.body.companyName) ? 1 : 0),
        'pole:fakturovat_na_firmu',
        'alogin:' + (loginName || ''),
        'pole:login',
        'apwd:' + (req.body.password || ''),
        'pole:pwd',
        'ajmeno_fak:' + (req.body.firstName || ''),
        'pole:jmeno_fak',
        'aprijmeni_fak:' + (req.body.lastName || ''),
        'pole:prijmeni_fak',
        'aemail:' + (req.body.email || ''),
        'pole:email',
        'atelefon:' + (req.body.phone || ''),
        'pole:telefon',
        'aulice_fak:' + (req.body.street || ''),
        'pole:ulice_fak',
        'amesto_fak:' + (req.body.city || ''),
        'pole:mesto_fak',
        'apsc_fak:' + (req.body.zip || ''),
        'pole:psc_fak',
        'astat_fak:' + (req.body.country || ''),
        'pole:stat_fak',
        'ajmeno_dod:' + (req.body.firstNameDelivery || ''),
        'pole:jmeno_dod',
        'aprijmeni_dod:' + (req.body.lastNameDelivery || ''),
        'pole:prijmeni_dod',
        'anazev_fak:' + (req.body.companyName || ''),
        'pole:nazev_fak',
        'aulice_dod:' + (req.body.streetDelivery || ''),
        'pole:ulice_dod',
        'amesto_dod:' + (req.body.cityDelivery || ''),
        'pole:mesto_dod',
        'apsc_dod:' + (req.body.zipDelivery || ''),
        'pole:psc_dod',
        'astat_dod:' + (req.body.countryDelivery || ''),
        'pole:stat_dod',
        'anazev_dod:' + (req.body.companyNameDelivery || ''),
        'pole:nazev_dod',
        'aic:' + (req.body.regId || ''),
        'pole:ic',
        'adic:' + (req.body.vatId || ''),
        'pole:dic',
        'adodaci_je_fakturacni:' + (req.body.deliveryIsNotInvoice ? 0 : 1),
        'pole:dodaci_je_fakturacni',
        'aregistrovat:' + (req.body.saveAsNewUser ? 1 : 0),
        'pole:registrovat',
        'anovy_zakaznik:' + ((loginName == '' || loginName == '0') ? 1 : 0),
        'pole:novy_zakaznik',
        'apoznamka:' + (req.body.note || ''),
        'pole:poznamka',
        'apoznamka2:' + (req.body.note2 || ''),
        'pole:poznamka2',
        'anewsletter:' + (req.body.newsletter ? 1 : 0),
        'pole:newsletter',
        'asjednat_obch_podminky:' + (req.body.conditions ? 1 : 0),
        'pole:sjednat_obch_podminky',
        'apohlavi:' + (req.body.sex || ''),
        'pole:pohlavi',
        'apredmet_podnikani:' + (req.body.bussinesScope || ''),
        'pole:predmet_podnikani',
        'aweb_adresa:' + (req.body.webAddr || ''),
        'pole:web_adresa',
        'aosloveni:' + (req.body.sexNamePrefix || ''),
        'pole:osloveni',
      ]
    }
  };

  valsSessionid = {sessionid: sessionid};

  valsVerify = {login: req.body.login};
  Oracledb.select(sqlVerify, valsVerify, req, null, null).then(
    function (result) {
      let data: any = Tools.getSingleResult(result);
      if (data.exist == '1' && req.body.saveAsNewUser) {
        res.json({error: false, userExist: true});
      } else {
        Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
          function (result) {
            return Oracledb.select(sqlResult, valsSessionid, req, null, null);
          }
        ).then(
          function (result) {
            let data: any = Tools.getSingleResult(result);
            let obj = data.result ? JSON.parse(data.result) : {};
            res.json({error: false});
          },
          function (result) {
            res.json({error: true, userExist: false});
          },
        );
      }
    },
    function () {
      res.json({error: true, userExist: false});
    }
  );
}

export function shipping (req, res) {
  let sql, vals, sessionid, sqlProps, loginName, valsSessionid, obj: any;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  try {

    sql =
      'begin e1_web_udaje_dopr_objed_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'E1_WEB_UDAJE_DOPR_OBJED_JSON\'';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          'aplatba:' + (req.params.code || ''),
        ]
      }
    };

    valsSessionid = {sessionid: sessionid};

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlProps, valsSessionid, req, null, null);
      },
      function (result) {
        console.log(result);
      }
    ).then(
      function (result) {
        try {
          let data: any = Tools.getSingleResult(result);
          let dataParse: any = (data.result ? JSON.parse(data.result) : {records: []});
          obj = {
            records: [],
            priceAmount: decodeURIComponent(dataParse.celkem || ''),
            priceAmountVat: decodeURIComponent(dataParse.celkem_sdph || '')
          };
          dataParse.records.map(function (el) {
            obj.records.push({
              code: decodeURIComponent(el.kod || ''),
              currency: decodeURIComponent(el.mena || ''),
              name: decodeURIComponent(el.nazev || ''),
              price: Tools.roundTo(el.cena || '', req),
              priceVat: Tools.roundTo(el.cena_sdph || '', req),
              selected: (el.selected == '1'),
              editable: (el.editovat == '1')
            });
          });
          res.json(obj);
        } catch (e) {
          console.log(e);
          res.json({});
        }
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function payment (req, res) {
  let sql, vals, sessionid, sqlProps, loginName, valsSessionid;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  try {

    sql =
      'begin e1_web_udaje_platba_objed_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'E1_WEB_UDAJE_PLATBA_OBJED_JSON\'';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          'adoprava:' + (req.params.code || ''),
        ]
      }
    };

    valsSessionid = {sessionid: sessionid};

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlProps, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        try {
          let data: any = Tools.getSingleResult(result);
          let dataParse: any = (data.result ? JSON.parse(data.result) : {records: []});
          let obj = {
            records: [],
            priceAmount: decodeURIComponent(dataParse.celkem),
            priceAmountVat: decodeURIComponent(dataParse.celkem_sdph)
          };
          dataParse.records.map(function (el) {
            obj.records.push({
              code: decodeURIComponent(el.kod),
              currency: decodeURIComponent(el.mena),
              name: decodeURIComponent(el.nazev),
              price: Tools.roundTo(el.cena, req),
              priceVat: Tools.roundTo(el.cena_sdph, req),
              selected: (el.selected == '1'),
              editable: (el.editovat == '1')
            });
          });
          res.json(obj);
        } catch (e) {
          console.log(e);
          res.json({});
        }
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function paymentPost (req, res) {
  let sql, vals, sessionid, sqlProps, loginName, valsSessionid;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  try {

    sql =
      'begin web_platba_na_e_objed_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_PLATBA_NA_E_OBJED_JSON\'';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          'akod:' + (req.body.code || ''),
        ]
      }
    };

    valsSessionid = {sessionid: sessionid};

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlProps, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        res.json(data);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function shippingPost (req, res) {
  let sql, vals, sessionid, sqlProps, loginName, valsSessionid, data, valsDelete, sqlDelete;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  try {

    sql =
      'begin web_doprava_na_e_objed_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_DOPRAVA_NA_E_OBJED_JSON\'';

    sqlDelete =
      'update web_eshop_udaje ' +
      '  set platba = null ' +
      'where ' +
      '  (sessionid = decrypt_cookie(:sessionid) ' +
      '   or ' +
      '  (login = decrypt_cookie(:login) ' +
      '   and login is not null)) ' +
      ' and sessionid is not null ';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          'akod:' + (req.body.code || ''),
        ]
      }
    };

    valsDelete = {
      sessionid: sessionid,
      login: (loginName || '')
    };

    valsSessionid = {sessionid: sessionid};

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlProps, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        data = Tools.getSingleResult(result);
        return Oracledb.executeSQL(sqlDelete, valsDelete, req, null, {commit: true})
      }
    ).then(
      function (result) {
        res.json(data);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function user (req, res) {
  let sql, vals = {}, sessionid, loginName;

  try {
    loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

    sessionid = Tools.getSessionId(req);
    if (!sessionid) {
      res.json({});
      return;
    }

    sql =
      'SELECT ' +
      '  decrypt_cookie(:loginName) as "loginClient", ' +
      '  decode(wu.login, \'0\', null, wu.login) as "login", ' +
      '  wu.jmeno_fak as "jmenoFak", ' +
      '  wu.prijmeni_fak as "prijmeniFak", ' +
      '  wu.email as "email", ' +
      '  wu.telefon as "telefon", ' +
      '  wu.ulice_fak as "uliceFak", ' +
      '  wu.mesto_fak as "mestoFak", ' +
      '  nvl(wu.stat_fak, get_param(\'STAT_UZIVATELE\', 0, null, USER)) as "statFak", ' +
      '  s2.nazev as "statFakNazev", ' +
      '  wu.psc_fak as "pscFak", ' +
      '  wu.nazev_fak as "nazevFak", ' +
      '  wu.jmeno_dod as "jmenoDod", ' +
      '  wu.prijmeni_dod as "prijmeniDod", ' +
      '  wu.ulice_dod as "uliceDod", ' +
      '  wu.mesto_dod as "mestoDod", ' +
      '  nvl(wu.stat_dod, get_param(\'STAT_UZIVATELE\', 0, null, USER)) as "statDod", ' +
      '  s1.nazev as "statDodNazev", ' +
      '  wu.psc_dod as "pscDod", ' +
      '  wu.nazev_dod as "nazevDod", ' +
      '  wu.dodaci_je_fakturacni as "dodaciJeFakturacni", ' +
      '  wu.fakturovat_na_firmu as "fakturovatNaFirmu", ' +
      '  wu.nazev_dod as "nazevDod", ' +
      '  wu.doprava as "doprava", ' +
      '  wu.platba as "platba", ' +
      '  wu.poznamka as "poznamka", ' +
      '  wu.poznamka2 as "poznamka2", ' +
      '  wu.novy_zakaznik as "novy_zakaznik", ' +
      '  wu.registrovat as "registrovat", ' +
      '  wu.newsletter as "newsletter", ' +
      '  wu.ic as "ic", ' +
      '  wu.dic as "dic", ' +
      '  wu.osloveni as "osloveni", ' +
      '  wu.pohlavi as "pohlavi", ' +
      '  wu.sjednat_obch_podminky as "sjednat_obch_podminky", ' +
      '  wu.predmet_podnikani as "predmet_podnikani", ' +
      '  wu.web_adresa as "web_adresa", ' +
      '  p.b2b as "b2b" ' +
      'FROM ' +
      '  web_eshop_udaje wu, ' +
      '  staty s1, ' +
      '  staty s2, ' +
      '  (select ' +
      '     p.B2B, ' +
      '     po.login_osoby ' +
      '   from ' +
      '     partneri p, ' +
      '     partneri_osoby po ' +
      '   where ' +
      '     p.partner = po.partner ' +
      '     and po.login_osoby = decrypt_cookie(:loginName) ' +
      '     and po.login_osoby <> \'0\' ' +
      '     and po.login_osoby is not null ' +
      '  ) p ' +
      'WHERE ' +
      '  db_user = user ' +
      '  and (' +
      '       (sessionid = decrypt_cookie(:sessionid) ' +
      '        and sessionid is not null ' +
      '        and nvl(sessionid,\'0\') <> \'0\' ' +
      '        and :loginName is null ' +
      '        ) ' +
      '      or  ' +
      '       (login = decrypt_cookie(:loginName) ' +
      '        and login is not null ' +
      '        and nvl(login,\'0\') <> \'0\'' +
      '        )' +
      '      ) ' +
      '  and web_check_login = 1 ' +
      '  and nvl(wu.stat_dod, get_param(\'STAT_UZIVATELE\')) = s1.kod(+) ' +
      '  and nvl(wu.stat_fak, get_param(\'STAT_UZIVATELE\')) = s2.kod(+) ' +
      '  and wu.login = p.login_osoby(+)';

    vals = {
      sessionid: sessionid,
      loginName: loginName
    };

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        try {
          let data: any = Tools.getSingleResult(result);
          let user: any = {};

          user.login = data.login || '';
          user.loginClient = data.loginClient || '';
          user.isLogged = (user.loginClient != '' && user.loginClient != '0');
          /*user.priceAmount = dataParse.castka_celkem;
          user.priceVatAmount = dataParse.castka_celkem_sdph;*/

          // INVOICE
          user.firstName = data.jmenoFak || '';
          user.lastName = data.prijmeniFak || '';
          user.email = data.email || '';
          user.phone = data.telefon || '';
          user.street = data.uliceFak || '';
          user.city = data.mestoFak || '';
          user.country = data.statFak || '';
          user.countryName = data.statFakNazev || '';
          user.zip = data.pscFak || '';
          user.companyName = data.nazevFak || '';
          user.regId = data.ic || '';
          user.vatId = data.dic || '';

          // DELIVERY
          user.firstNameDelivery = data.dodaciJeFakturacni == '1' ? user.firstName : data.jmenoDod || '';
          user.lastNameDelivery = data.dodaciJeFakturacni == '1' ? user.lastName : data.prijmeniDod || '';

          user.streetDelivery = data.dodaciJeFakturacni == '1' ? user.street : (data.uliceDod || '');
          user.cityDelivery = data.dodaciJeFakturacni == '1' ? user.city : (data.mestoDod || '');
          user.countryDelivery = data.dodaciJeFakturacni == '1' ? user.country : (data.statDod || '');
          user.countryDeliveryName = data.dodaciJeFakturacni == '1' ? user.countryName : (data.statDodNazev || '');
          user.zipDelivery = data.dodaciJeFakturacni == '1' ? user.zip : (data.pscDod || '');
          user.companyNameDelivery = data.dodaciJeFakturacni == '1' ? user.nazevFak : data.nazevDod || '';

          user.deliveryIsNotInvoice = data.dodaciJeFakturacni == '0';
          user.toCompany = data.fakturovatNaFirmu == '1';

          user.shipping = data.doprava || '';
          user.shippingDefault = data.doprava || '';
          user.payment = data.platba || '';
          user.paymentDefault = data.platba || '';

          user.saveAsNewUser = (data.registrovat == '1');

          user.note = (data.poznamka || '');
          user.note2 = (data.poznamka2 || '');

          user.newsletter = (data.newsletter != '0');
          user.sex = (data.pohlavi || '');
          user.sexNamePrefix = (data.osloveni || '');
          user.bussinesScope = (data.predmet_podnikani || '');
          user.conditions = (data.sjednat_obch_podminky == '1');
          user.webAddr = (data.web_adresa || '');
          user.b2b = (data.b2b == '1');

          res.json(user);
        } catch (e) {
          console.log(e);
          res.json({});
        }
      },
      function (result) {
        console.log(result);
        res.json({});
      }
    );
  } catch (e) {
    console.log(e);
    res.json({});
  }
}

export function cart (req, res) {
  let sql, sqlDoprPlatba, sqlKup, vals, sessionid, loginName, i, l, data, dataDoprPlatba,
    sumCastka = 0, sumCastkaSDph = 0, limit = 0, limitSDph = 0, sqlShippingPaymentLimit,
    amount = 0, obj: any, sqlInfo, spj, valsLimits;
  loginName = (Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE) || '');

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  try {

    sqlInfo =
      'SELECT ' +
      '  get_param(\'MENA_PRO_WEBSITE\', 0, null, USER) as "currency" ' +
      'FROM ' +
      '  dual';

    sql =
      'SELECT ' +
      '  a.*, ' +
      '  nvl(a."mnozstvi", 1) * nvl("cena", 0) as "castka", ' +
      '  nvl(a."mnozstvi", 1) * (nvl("cena", 0) + (nvl("cena", 0) * (procent / 100))) as "castkaSDph", ' +
      '  a.id_prilohy as "idPrilohy", ' +
      '  get_file_ext(i.MIME_TYPE) as "fileExt" ' +
      'FROM ' +
      ' (SELECT ' +
      '   get_param(\'MENA_PRO_WEBSITE\', 0, null, USER) as "currency", ' +
      '   kp.cislo as "cislo", ' +
      '   kp.produkt as "kod", ' +
      '   pp.popis as "nazev", ' +
      '   kp.mj as "mj", ' +
      '   kp.mnozstvi as "mnozstvi", ' +
      '   kp.nemenit_mnozstvi as "nemenitMnozstvi", ' +
      '   kp.matka as "matka", ' +
      '   \'/\' || pr.presmerovani as "presmerovani", ' +
      '   pd.nazev as "dostupnost", ' +
      '   e1_web_cena(null, kp.produkt, null, null, null, null, kp.mnozstvi, 1, 1, null, :loginName, 1) as "cena", ' +
      '   nvl(ds.procent, 0) as procent, ' +
      '   null as "slevaProc", ' +
      '   (SELECT ' +
      '      max(pd.id) ' +
      '    FROM ' +
      '      prilohy_data_info pd, ' +
      '      prilohy_nove pn ' +
      '    WHERE ' +
      '      pd.id = pn.priloha_id ' +
      '      and pn.tabulka = \'PRODUKTY\' ' +
      '      and pn.pk = p.kod ' +
      '      and crm_priloha_typ = \'L_seznam\' ' +
      '      and substr(popis,instr(popis,\'.\',-1)-5,5) = \'_01_L\' ' +
      '   ) as id_prilohy ' +
      ' FROM ' +
      '   web_kosik_pol kp, ' +
      '   web_kosik k, ' +
      '   produkty p, ' +
      '   produkty_dostupnost pd, ' +
      '   produkty_popis pp, ' +
      '   web_website_produkt_presmer pr, ' +
      '   danove_sazby ds ' +
      ' WHERE ' +
      '   k.id = kp.id_kosik ' +
      '   and p.kod = kp.produkt ' +
      '   and pd.kod(+) = p.dostupnost ' +
      '   and ((k.sessionid = decrypt_cookie(:sessionid) ' +
      '         and k.sessionid is not null ' +
      '         and nvl(k.sessionid,\'0\') <> \'0\') ' +
      '       or ' +
      '        (k.login = decrypt_cookie(:loginName) ' +
      '         and k.login is not null ' +
      '         and nvl(k.login,\'0\') <> \'0\')) ' +
      '   and web_check_login = 1 ' +
      '   and k.user_name = user ' +
      '   and p.kod = pp.produkt(+) ' +
      '   and pp.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '   and pp.website(+) = get_website ' +
      '   and pp.typ_popisu(+) = \'PRODUKT_NAZEV_ZKR\' ' +
      '   and p.kod = pr.produkt ' +
      '   and pr.website = get_website ' +
      '   and ds.kod(+) = p.sazba_dan_pro ' +
      ') a, ' +
      ' prilohy_data_info i ' +
      'WHERE ' +
      ' i.id(+) = a.id_prilohy';

    sqlDoprPlatba =
      'SELECT ' +
      '  a.*, ' +
      '  nvl(dp.castka, 0) as "limit", ' +
      '  nvl(dp.castka_sdph, 0) as "limitSDph", ' +
      '  nvl(doprava_castka + (doprava_castka * (doprava_procent / 100)), 0) as "dopravaSDph", ' +
      '  nvl(platba_castka + (platba_castka * (platba_procent / 100)), 0) as "platbaSDph", ' +
      '  nvl(doprava_castka, 0) as "doprava", ' +
      '  nvl(platba_castka, 0) as "platba", ' +
      '  a.doprava_kod as "dopravaKod", ' +
      '  a.platba_kod as "platbaKod" ' +
      'FROM ' +
      ' web_vazby_doprava_platba dp, ' +
      ' (SELECT ' +
      '   dopr.doprava as doprava_kod, ' +
      '   dopr.nazev as "dopravaNazev", ' +
      '   pl.platba as platba_kod, ' +
      '   pl.nazev as "platbaNazev", ' +
      '   e1_web_cena(p.partner, dopr.produkt, null, null, null, null, 1, 1, 1, null, :loginName, 1) as doprava_castka, ' +
      '   e1_web_cena(p.partner, pl.produkt, null, null, null, null, 1, 1, 1, null, :loginName, 1) as platba_castka, ' +
      '   nvl(dopr.procent, 0) as doprava_procent, ' +
      '   nvl(pl.procent, 0) as platba_procent, ' +
      '   nvl(e.stat_fak, e.stat_dod) as stat, ' +
      '   p.b2b ' +
      ' FROM ' +
      //'   web_kosik k, ' +
      '   (SELECT ' +
      '      e.sessionid, ' +
      '      d.nazev, ' +
      '      e.doprava, ' +
      '      d.produkt, ' +
      '      nvl(ds.procent, 0) as procent ' +
      '    FROM ' +
      '       web_eshop_udaje e, ' +
      '       zpusoby_dopravy d, ' +
      '       produkty pr, ' +
      '       danove_sazby ds ' +
      '   WHERE ' +
      '     ((e.sessionid = decrypt_cookie(:sessionid) ' +
      '       and e.sessionid is not null ' +
      '       and nvl(e.sessionid,\'0\') <> \'0\') ' +
      '      or ' +
      '      (e.login = decrypt_cookie(:loginName) ' +
      '       and e.login is not null ' +
      '       and nvl(e.login,\'0\') <> \'0\')) ' +
      '     and e.db_user = user ' +
      '     and d.kod = e.doprava(+) ' +
      '     and pr.kod(+) = d.produkt ' +
      '     and ds.kod(+) = pr.sazba_dan_pro ' +
      '    ) dopr, ' +
      '   (SELECT ' +
      '      e.sessionid, ' +
      '      p.nazev, ' +
      '      e.platba, ' +
      '      p.produkt, ' +
      '      nvl(ds.procent, 0) as procent ' +
      '    FROM ' +
      '      web_eshop_udaje e, ' +
      '      zpusoby_plateb p, ' +
      '      produkty pr, ' +
      '      danove_sazby ds ' +
      '    WHERE ' +
      '     ((e.sessionid = decrypt_cookie(:sessionid) ' +
      '       and e.sessionid is not null ' +
      '       and nvl(e.sessionid,\'0\') <> \'0\') ' +
      '      or ' +
      '      (e.login = decrypt_cookie(:loginName) ' +
      '       and e.login is not null ' +
      '       and nvl(e.login,\'0\') <> \'0\')) ' +
      '     and e.db_user = user ' +
      '     and p.kod = e.platba(+) ' +
      '     and pr.kod(+) = p.produkt ' +
      '     and ds.kod(+) = pr.sazba_dan_pro' +
      '   ) pl, ' +
      '   (select ' +
      '      po.login_osoby, ' +
      '      p.b2b, ' +
      '      p.partner ' +
      '    from ' +
      '      partneri_osoby po, ' +
      '      partneri p ' +
      '    where ' +
      '      p.partner = po.partner ' +
      '   ) p, ' +
      '   web_eshop_udaje e ' +
      ' WHERE ' +
      '   ((e.sessionid = decrypt_cookie(:sessionid) ' +
      '     and e.sessionid is not null ' +
      '     and nvl(e.sessionid,\'0\') <> \'0\') ' +
      '    or ' +
      '    (e.login = decrypt_cookie(:loginName) ' +
      '     and e.login is not null ' +
      '     and nvl(e.login,\'0\') <> \'0\')) ' +
      '   and upper(e.db_user) = upper(user) ' +
      '   and web_check_login = 1 ' +
      '   and e.sessionid = dopr.sessionid(+) ' +
      '   and e.sessionid = pl.sessionid(+) ' +
      '   and e.login = p.login_osoby(+) ' +
      ' ) a ' +
      'WHERE ' +
      '  upper(dp.eshop(+)) = upper(get_website) ' +
      '  and a.stat = dp.stat(+) ' +
      '  and a.doprava_kod = dp.kod_doprava(+) ' +
      '  and a.platba_kod = dp.kod_platba(+) ' +
      '  and decode(a.b2b, 1, 1, 0) = nvl(dp.velkoobchod(+), 0) ' +
      '  and decode(nvl(a.b2b, 0), 0, 1, 0) = nvl(dp.maloobchod(+), 0)';

    sqlKup =
      'SELECT ' +
      '  k.ck as "kod", ' +
      '  k.nazev as "nazev", ' +
      '  nvl(k.cena_bez_dph, 0) as "cenaBezDph", ' +
      '  nvl(k.cena_s_dph, 0) as "cenaSDph", ' +
      '  nvl(k.sleva_proc, 0) as "slevaProc" ' +
      'FROM ' +
      '  web_eshop_kupony k, ' +
      '  web_eshop_kupony_kosik kk ' +
      'WHERE ' +
      '  kk.user_name = user ' +
      '  and k.ck = kk.kod_kuponu ' +
      '  and ((kk.sessionid = decrypt_cookie(:sessionid) ' +
      '        and kk.sessionid is not null ' +
      '        and nvl(kk.sessionid,\'0\') <> \'0\') ' +
      '      or ' +
      '       (kk.partner_login = decrypt_cookie(:loginName) ' +
      '        and kk.partner_login is not null ' +
      '        and nvl(kk.partner_login,\'0\') <> \'0\')) ' +
      '  and web_check_login = 1 ';

    sqlShippingPaymentLimit =
      'SELECT ' +
      '  WEB_GET_ESHOP_DOP_ZDARMA_ZBYVA(1, decrypt_cookie(:loginName), decrypt_cookie(:sessionid)) as "spj" ' +
      'FROM ' +
      '  dual';

    vals = {
      sessionid: sessionid,
      loginName: loginName
    };

    valsLimits = {
      sessionid: sessionid,
      loginName: loginName
    };

    obj = {records: [], coupons: []};
    Oracledb.select(sqlInfo, {}, req, null, null).then(
      function (result) {
        let info: any = Tools.getSingleResult(result);
        obj.currency = info.currency;
        return Oracledb.select(sql, vals, req, null, null);
      }
    ).then(
      function (result) {
        data = Tools.getMultiResult(result);
        return Oracledb.select(sqlDoprPlatba, vals, req, null, null);
      }
    ).then(
      function (result) {
        dataDoprPlatba = Tools.getSingleResult(result);
        return Oracledb.select(sqlShippingPaymentLimit, valsLimits, req, null, null);
      }
    ).then(
      function (result) {
        let limits: any = Tools.getSingleResult(result);
        spj = '[' + (limits.spj || '') + ']';
        return Oracledb.select(sqlKup, vals, req, null, null);
      }
    ).then(
      function (result) {
        try {
          let dataKup: any = Tools.getMultiResult(result);

          for (i = 0, l = data.length; i < l; i += 1) {
            sumCastka += data[i].castka;
            sumCastkaSDph += data[i].castkaSDph;
            amount += 1;

            obj.records.push({
              fileName: (data[i].idPrilohy ? (data[i].idPrilohy + Constants.DOT + data[i].fileExt) : Constants.imgageEmptySmall),
              name: data[i].nazev,
              code: data[i].kod,
              unit: data[i].mj,
              noEdit: data[i].nemenitMnozstvi,
              parentItemId: data[i].matka,
              amount: Number(data[i].mnozstvi.toFixed(2)),
              redirect: data[i].presmerovani || '',
              price: Tools.roundTo(data[i].cena, req),
              priceAmount: Tools.roundTo(data[i].castka, req),
              priceVatAmount: Tools.roundTo(data[i].castkaSDph, req),
              availability: data[i].dostupnost || '',
              discountPercent: data[i].slevaProc,
              itemId: data[i].cislo,
              currency: data[i].currency
            });
          }

          obj.shippingCode = (dataDoprPlatba.dopravaKod || '');
          obj.shipping = Tools.roundTo((dataDoprPlatba.doprava || 0), req);
          obj.shippingVat = Tools.roundTo((dataDoprPlatba.dopravaSDph || 0), req);
          obj.shippingName = dataDoprPlatba.dopravaNazev || '';
          obj.paymentCode = (dataDoprPlatba.platbaKod || '');
          obj.payment = Tools.roundTo((dataDoprPlatba.platba || 0), req);
          obj.paymentVat = Tools.roundTo((dataDoprPlatba.platbaSDph || 0), req);
          obj.paymentName = dataDoprPlatba.platbaNazev || '';
          obj.amount = amount;
          obj.shippingAndPaymentLimits = JSON.parse(spj);
          obj.shippingAndPayment = 0;
          obj.shippingAndPaymentVat = 0;

          limit = (dataDoprPlatba.limit || 0);
          limitSDph = (dataDoprPlatba.limitSDph || 0);

          if ((limitSDph > 0 && sumCastkaSDph >= limitSDph) || (limit > 0 && sumCastka >= limit)) {
            obj.shippingAndPayment = obj.payment;
            obj.shippingAndPaymentVat = obj.paymentVat;
            obj.shipping = 0;
            obj.shippingVat = 0;
          } else {
            obj.shippingAndPayment = Tools.roundTo(obj.shipping + obj.payment, req);
            obj.shippingAndPaymentVat = Tools.roundTo(obj.shippingVat + obj.paymentVat, req);
          }
          obj.leftToShippingFree = (limitSDph > 0 && limitSDph >= sumCastkaSDph) ? Tools.roundTo(limitSDph - sumCastkaSDph, req) : 0;

          obj.priceAmount = Tools.roundTo(sumCastka, req);
          obj.priceAmountVat = Tools.roundTo(sumCastkaSDph, req);
          obj.priceAmountWithShippingAndPayment = Tools.roundTo(sumCastka + obj.shippingAndPayment, req);
          obj.priceAmountVatWithShippingAndPayment = Tools.roundTo(sumCastkaSDph + obj.shippingAndPaymentVat, req);
          obj.shippingAndPaymentIsSelected = (obj.shippingCode.length > 0 && obj.paymentCode.length > 0);

          for (i = 0, l = dataKup.length; i < l; i += 1) {
            obj.coupons.push({
              code: dataKup[i].kod,
              name: dataKup[i].nazev || '',
              price: dataKup[i].cenaBezDph,
              priceVat: dataKup[i].cenaSDph,
              percent: dataKup[i].slevaProc
            });
          }
          res.json(obj);
        } catch (e) {
          console.log(e);
          res.json({});
        }
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function createOrder (req, res) {
  let sql, vals, valsReg, sessionid, sqlProps, loginName, valsSessionid, sqlCreateUserResult,
    sqlCreateUser, sqlReg, sqlVerify, valsCreateUser, valsVerify, limitOverflow;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  try {

    sql = 'begin e1_web_eshop_vytvor_objp_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'E1_WEB_ESHOP_VYTVOR_OBJP_JSON\'';

    sqlCreateUser =
      'begin web_eshop_zalozit_uziv_json(:strings); end;';

    sqlCreateUserResult =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_ESHOP_ZALOZIT_UZIV_JSON\'';

    sqlVerify =
      'SELECT ' +
      '  1 as "exist" ' +
      'FROM ' +
      '  partneri_osoby ' +
      'WHERE ' +
      '  upper(login_osoby) = upper(decrypt_cookie(:login))';

    sqlReg =
      'select ' +
      '  registrovat as "registrovat" ' +
      'from ' +
      '  web_eshop_udaje ' +
      'where ' +
      '  db_user = user ' +
      '  and (' +
      '    (' +
      '     sessionid = decrypt_cookie(:sessionid) ' +
      '     and sessionid is not null ' +
      '     and nvl(sessionid, \'0\') <> \'0\' ' +
      '     ) ' +
      '    or  ' +
      '    (' +
      '     login = decrypt_cookie(:login) ' +
      '     and login is not null ' +
      '     and nvl(login, \'0\') <> \'0\' ' +
      '     )' +
      '  )   ' +
      '  and web_check_login = 1 ';

    valsSessionid = {sessionid: sessionid};

    valsReg = {
      sessionid: sessionid,
      login: (loginName || '')
    };

    valsVerify = {
      login: (loginName || '')
    };

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
        ]
      }
    };

    valsCreateUser = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          'predulozeno:1',
        ]
      }
    };

    let isRegister = false;
    Oracledb.select(sqlReg, valsReg, req, null, null).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        isRegister = (data.registrovat == '1');
        return Oracledb.select(sqlVerify, valsVerify, req, null, null);
      }
    ).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);

        if (data.exist && isRegister) {
          res.json({userExist: true});
          return;
        }

        if (isRegister) {
          Oracledb.executeSQL(sqlCreateUser, valsCreateUser, req, null, null).then(
            function (result) {
              return Oracledb.select(sqlCreateUserResult, valsSessionid, req, null, {connection: result.connection, holdConnect: true});
            }
          ).then(
            function (result) {
              return Oracledb.executeSQL(sql, vals, req, null, {connection: result.connection, commit: true});
            }
          ).then(
            function (result) {
              return Oracledb.select(sqlProps, valsSessionid, req, null, null);
            }
          ).then(
            function (result) {
              let data: any = Tools.getSingleResult(result);
              let dataParse = data && data.result ? JSON.parse(data.result) : {};
              res.json(dataParse);
            },
            function (result) {
              console.log(result);
              res.send('');
            }
          );
        } else {
          Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
            function (result) {
              return Oracledb.select(sqlProps, valsSessionid, req, null, null);
            }
          ).then(
            function (result) {
              let data: any = Tools.getSingleResult(result);
              let dataParse = data && data.result ? JSON.parse(data.result) : {};
              res.json(dataParse);
            },
            function (result) {
              console.log(result);
              res.send('');
            }
          );
        }
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function verifyOrder (req, res) {
  let sql, vals, sessionid, sqlProps, loginName;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({});
    return;
  }

  try {

    sql =
      'select ' +
      '  SUM(kp.mnozstvi) as "amount", ' +
      '  u.doprava as "shipping", ' +
      '  u.platba as "payment", ' +
      '  u.jmeno_fak as "firstName", ' +
      '  u.prijmeni_fak as "lastName", ' +
      '  u.email as "email" ' +
      'from ' +
      '  produkty p, ' +
      '  web_kosik_pol kp, ' +
      '  web_kosik k, ' +
      '  danove_sazby ds, ' +
      '  web_eshop_udaje u ' +
      'where ' +
      '  p.kod = kp.produkt ' +
      '  and ds.kod = p.sazba_dan_pro ' +
      '  and k.id = kp.id_kosik ' +
      '  and (k.sessionid = decrypt_cookie(:sessionid) OR (k.login = decrypt_cookie(:login) AND k.login is not null)) ' +
      '  and k.sessionid is not null ' +
      '  and (u.sessionid = decrypt_cookie(:sessionid) or (u.login = decrypt_cookie(:login) and u.login is not null)) ' +
      '  and u.sessionid is not null ' +
      'group by ' +
      '  u.doprava, ' +
      '  u.platba, ' +
      '  u.jmeno_fak, ' +
      '  u.prijmeni_fak, ' +
      '  u.email ' +
      '';

    vals = {
      sessionid: sessionid,
      login: (loginName || ''),
    };

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let data = Tools.getSingleResult(result);
        res.json(data);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function addCoupon (req, res) {
  let sql, vals, sessionid, sqlProps, loginName, valsSessionid, data, valsDelete, sqlDelete;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({error: true});
    return;
  }

  try {

    sql =
      'begin web_eshop_uplatnit_slevu_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_ESHOP_UPLATNIT_SLEVU_JSON\'';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          'aSlevove_kupony_pole_nazev:akod',
          'akod:' + (req.body.code || ''),
        ]
      }
    };

    valsSessionid = {sessionid: sessionid};

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlProps, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        let dataParse = (data ? JSON.parse(data.result) : {error: true});
        let valid = (dataParse && dataParse.records && dataParse.records[0].platny == '1');
        res.json({error: false, valid: valid});
      },
      function (result) {
        console.log(result);
        res.json({error: true});
      }
    );
  } catch (e) {
    console.log(e);
    res.json({error: true});
  }
}

export function removeCoupon (req, res) {
  let sql, vals, sessionid, sqlProps, loginName, valsSessionid, data, valsDelete, sqlDelete;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({error: true});
    return;
  }

  try {

    sql =
      'begin web_eshop_odebrat_kupon_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_ESHOP_ODEBRAT_KUPON_JSON\'';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          'kupon:' + (req.params.code || ''),
        ]
      }
    };

    valsSessionid = {sessionid: sessionid};

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlProps, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        let dataParse = (data ? JSON.parse(data.result) : {error: true});
        res.json(dataParse);
      },
      function (result) {
        console.log(result);
        res.json({error: true});
      }
    );
  } catch (e) {
    console.log(e);
    res.json({error: true});
  }
}

export function search (req, res) {
  let sql, vals, path, pathEmpty, imgEmptyLarge, i, l, rows = [], loginName;
  try {

    loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

    sql =
      'SELECT ' +
      ' a.*, ' +
      ' a.priloha_id as "imgMediumId", ' +
      ' decode(instr(pdi.popis, \'.\', -1), 0, null, substr(pdi.popis, instr(pdi.popis, \'.\', -1))) as "imgMediumExt" ' +
      'FROM ' +
      ' (SELECT ' +
      '   get_param(\'MENA_PRO_WEBSITE\', 0, null, USER) as "currency", ' +
      '   p.id as "id", ' +
      '   p.kod as "code", ' +
      '   pp.popis as "name", ' +
      '   \'/\' || pr.presmerovani as "redirect", ' +
      '   decode(p.dostupnost_datum, null, pd.nazev, \'Očekáváme\') AS "availability", ' +
      '   decode(ne.id_produktu, null, 0, 1) as "news",' +
      '   decode(ac.id_produktu, null, 0, 1) as "action", ' +
      '   decode(p.dostupnost, \'' + Constants.availabilityCode + '\', 1, 0) as "inStock", ' +
      '   e1_web_cena(null, p.kod, null, null, null, null, 1, 1, 1, null, :loginName, 1) AS "price", ' +
      '   e1_web_cena(null, p.kod, null, null, null, null, 1, 1, 1, null, :loginName, 1) * ((ds.procent / 100) + 1) as "priceVat", ' +
      '   (SELECT max(pd.id) ' +
      '    FROM ' +
      '      prilohy_data_info pd, ' +
      '      prilohy_nove pn ' +
      '    WHERE pd.id = pn.priloha_id ' +
      '      and pn.tabulka = \'PRODUKTY\' ' +
      '      and pn.pk = p.kod ' +
      '      and crm_priloha_typ = \'L_seznam\' ' +
      '      and substr(popis,instr(popis,\'.\',-1)-5,5) = \'_01_S\' ' +
      '   ) as priloha_id ' +
      '  FROM ' +
      '    produkty p, ' +
      '    produkty_popis pp, ' +
      '    produkty_dostupnost pd, ' +
      '    danove_sazby ds, ' +
      '    (select id_produktu from crm_produkty_zatrideni where id_typ_zatrideni_produkt = ' + Constants.newsId + ') ne, ' +
      '    (select id_produktu from crm_produkty_zatrideni where id_typ_zatrideni_produkt = ' + Constants.actionId + ') ac, ' +
      '    web_website_produkt_presmer pr ' +
      '  WHERE ' +
      '    (instrs(p.kod,\'\'||:searchstr||\'\',1,0) = 1 ' +
      '     or ' +
      '     instrs(p.nazev, \'\'||:searchstr||\'\', 1, 0) = 1 ' +
      '     or ' +
      '     instrs(p.nazev4, \'\'||:searchstr||\'\', 1, 0) = 1 ' +
      '     ) ' +
      '    and p.kod = pp.produkt(+) ' +
      '    and pp.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '    and pp.website(+) = get_website ' +
      '    and pp.typ_popisu(+) = \'PRODUKT_NAZEV_ZKR\' ' +
      '    and p.dostupnost = pd.kod(+) ' +
      '    and ds.kod = p.sazba_dan_pro ' +
      '    and web_produkt_pro_eshop(p.kod) = 1 ' +
      '    and p.id = ne.id_produktu(+) ' +
      '    and p.id = ac.id_produktu(+) ' +
      '    and p.kod = pr.produkt ' +
      '    and pr.website = get_website ' +
      '  ) a, ' +
      '  prilohy_data_info pdi ' +
      'where ' +
      ' pdi.id(+) = a.priloha_id';

    vals = {
      searchStr: req.params.searchStr,
      loginName: loginName
    };

    path = Constants.imgagePath;
    pathEmpty = Constants.imgagePathEmpty;
    imgEmptyLarge = Constants.imgageEmptyLarge;

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        rows = Tools.getMultiResult(result);

        for (i = 0, l = rows.length; i < l; i += 1) {
          rows[i].news = rows[i].news == '1';
          rows[i].action = rows[i].action == '1';
          rows[i].inStock = rows[i].inStock == '1';
          rows[i].imgMediumFile = rows[i].imgMediumId ? path + (rows[i].imgMediumId || '') + (rows[i].imgMediumExt || '') : pathEmpty + imgEmptyLarge;
        }

        res.json(rows);
      },
      function (result) {
        console.log(result);
        res.send('');
      }
    );
  } catch (e) {
    console.log(e);
  }
}

export function productsChilds (req, res, obj) {
  try {
    let sql, vals: any = {}, loginName;

    loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

    sql =
      'SELECT ' +
      '  get_param(\'MENA_PRO_WEBSITE\', 0, null, USER) as "currency", ' +
      '  p.kod as "code", ' +
      '  pp.popis as "name", ' +
      '  e1_web_cena(null, p.kod, null, null, null, null, 1, 1, 1, null, :loginName, 1) AS "price", ' +
      '  decode(p.dostupnost_datum, null, pd.nazev, \'Očekáváme\') AS "availability", ' +
      '  p.mj1 as "unit", ' +
      '  0 as "amount", ' +
      '  TO_NUMBER(DBMS_LOB.SUBSTR(pe.hodnota, 50, 1)) as "lengthValue" ' +
      'FROM ' +
      '  produkty p, ' +
      '  produkty p2, ' +
      '  produkt_eshop_vazby pev, ' +
      '  produkty_dostupnost pd, ' +
      '  produkty_popis pp, ' +
      '  produkty_eshop pe, ' +
      '  web_website_produkt_presmer pr ' +
      'WHERE ' +
      '  p2.id = :id ' +
      '  and p.matka = p2.kod ' +
      '  and p.kod = pev.produkt ' +
      '  and p.dostupnost = pd.kod(+) ' +
      '  and p.kod = pp.produkt(+) ' +
      '  and pp.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '  and pp.website(+) = get_website ' +
      '  and pp.typ_popisu(+) = \'PRODUKT_NAZEV_ZKR\' ' +
      '  and pev.eshop = get_website ' +
      '  and pev.zobrazit = 1 ' +
      '  and p.kod = pe.produkt(+) ' +
      '  and pe.parametr(+) = \'' + Constants.CODE_ESHOP_PARAM_LENGTH + '\' ' +
      '  and p.kod = pr.produkt ' +
      '  and pr.website = pev.eshop ';

    vals = {
      id: req.params.id,
      loginName: loginName
    };

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let data: any = Tools.getMultiResult(result);
        res.send(data);
      },
      function (result) {
        console.log(result);
        res.send([]);
      }
    );
  } catch (e) {
    console.log(e);
    res.send([]);
  }
}

export function productsAccessories (req, res, obj) {
  try {
    let sql, vals: any = {};
    sql =
      'SELECT ' +
      '  \'/\' || pr.presmerovani as "redirect", ' +
      '  p.id as "id", ' +
      '  p.kod as "code", ' +
      '  p.mj1 as "unit", ' +
      '  pp.popis as "name", ' +
      '  0 as "amount" ' +
      'FROM ' +
      '  produkty p, ' +
      '  produkty p2, ' +
      '  produkt_eshop_vazby pev, ' +
      '  produkty_popis pp, ' +
      '  crm_produkty_zatrideni z, ' +
      '  crm_typy_zatrideni_produkty zt, ' +
      '  web_website_produkt_presmer pr ' +
      'WHERE ' +
      '  p2.id = :id ' +
      '  and Upper(zt.nazev) = Upper(p2.kod) ' +
      '  and zt.id = z.id_typ_zatrideni_produkt ' +
      '  and p.id = z.id_produktu ' +
      '  and p.kod = pp.produkt(+) ' +
      '  and pp.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '  and pp.website(+) = get_website ' +
      '  and pp.typ_popisu(+) = \'PRODUKT_NAZEV_ZKR\' ' +
      '  and p.kod = pev.produkt ' +
      '  and pev.eshop = get_website ' +
      '  and pev.zobrazit = 1 ' +
      '  and p.kod = pr.produkt ' +
      '  and pr.website = pev.eshop ';

    vals = {
      id: req.params.id
    };

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let products = Tools.getMultiResult(result);
        return getProductsProperties(req, products);
      }
    ).then(
      function (result) {
        res.json(result);
      },
      function (result) {
        console.log('ERROR');
        console.log(result);
        res.send([]);
      }
    );
  } catch (e) {
    console.log('ERROR');
    console.log(e);
    res.send([]);
  }
}

export function addToCartFromConfigurator (req, res) {
  let sql, sqlProps, items = [], errors = [], inserts = [], sessionid, loginName,
    amount, value, valueA, valueB, codeA, codeB, code, connection: any, valsSessionid: any, mainProduct;
  try {
    loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);
    sessionid = Tools.getSessionId(req);

    amount = req.body.configuration.amount;
    code = req.body.configuration.code;
    value = req.body.configuration.value;
    codeA = req.body.configuration.codeA;
    valueA = req.body.configuration.valueA;
    codeB = req.body.configuration.codeB;
    valueB = req.body.configuration.valueB;

    items = [];
    // MAIN PRODUCT, MUST BE FIRST!!!
    if (value > 0) {
      items.push({
        code: code,
        amount: (amount * value),
        noEdit: true,
        mainProduct: true
      });
    }
    // PRODUCT A
    if (valueA > 0) {
      items.push({
        code: codeA,
        amount: (amount * valueA),
        noEdit: true
      });
    }
    // PRODUCT B
    if (valueB > 0) {
      items.push({
        code: codeB,
        amount: (amount * valueB),
        noEdit: true
      });
    }

    items = items.concat(req.body.childs || []);
    items = items.concat(req.body.accssories || []);

    sql =
      'begin e1_web_vlozit_do_kosiku_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'E1_WEB_VLOZIT_DO_KOSIKU_JSON\'';

    valsSessionid = {sessionid: sessionid};
    connection = {commit: false, holdConnect: true};

    items.map(function (el, i) {
      let item = function (first, last) {
        return new Promise(function (resolve, reject) {

          let vals = {
            strings: {
              type: oracle.STRING,
              dir: oracle.BIND_IN,
              val: [
                'asessionid:' + sessionid,
                'aLoginName:' + (loginName || ''),
                'aSaveContent:1',
                'aExtCookies:1',
                'aid:' + (el.id || ''),
                'akod:' + (el.code || ''),
                'amnozstvi:' + ((el.value || 1) * (el.amount || 1)),
                'anemenit_mnozstvi:' + (el.noEdit ? 1 : 0),
                'amatka:' + ((el.noEdit && !el.mainProduct) ? mainProduct : ''),
              ]
            }
          };
          Oracledb.executeSQL(sql, vals, req, null, connection).then(
            function (result) {
              if (!connection.connection) {
                connection.connection = result.connection;
              }
              if (last) {
                delete connection.connection;
              }
              return Oracledb.select(sqlProps, valsSessionid, req, null, connection);
            }
          ).then(
            function (result) {
              let data: any = Tools.getSingleResult(result);
              let obj = data.result ? JSON.parse(data.result) : {};
              if (obj.state == '1') {
                if (el.mainProduct) {
                  mainProduct = obj.meta.itemId;
                }
                resolve(result);
              } else {
                try {
                  result.connection.rollback(function (err) {
                    console.log(err);
                    result.connection.close(function (err) {
                      console.log(err);
                      reject({error: true});
                    });
                  });
                } catch (e) {
                  console.log(e);
                  reject({error: true});
                }
              }
            },
            function (result) {
              reject(result);
            }
          );
        });
      };

      inserts.push(item);
    });

    let index = 0;
    let fce = function () {
      let first = (index === 0);
      let last = (index === (inserts.length - 1));
      if (last) {
        connection.commit = true;
        connection.holdConnect = false;
      }
      inserts[index](first, last).then(
        function (result) {
          index += 1;
          connection.connection = result.connection;
          if (inserts.length <= index) {
            res.json({success: true});
            return;
          }
          fce();
        },
        function (result) {
          console.log(result);
          res.json({error: true});
        }
      );
    };

    if (inserts.length > 0) {
      fce();
    } else {
      res.json({error: true});
    }

  } catch (e) {
    console.log(e);
    res.send({});
  }
}

export function productDataListInternal (req) {
  return new Promise(function (resolve, reject) {
    let pictures, report, obj, sql, vals, rows: Array<any> = [], props, data: any,
      picturesArr: Array<any> = [], oddArr: Array<any> = [], propsArr: Array<any> = [],
      index, pictureM, loginName;

    try {
      loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

      sql =
        'SELECT ' +
        '  get_param(\'MENA_PRO_WEBSITE\', 0, null, USER) as "currency", ' +
        '  p.kod as "code", ' +
        '  p.nazev as "name", ' +
        '  pp.popis as "description", ' +
        '  pp2.popis as "longName", ' +
        '  pp3.popis as "shortName", ' +
        '  pd.nazev as "availability", ' +
        '  p.katalogove_cislo as "catNumber", ' +
        '  FORMAT_MENA(e1_web_cena(null, p.kod, null, null, null, null, 1, 1, 1, null, :loginName, 1)) AS "price" ' +
        'FROM ' +
        '  produkty p, ' +
        '  produkty_dostupnost pd, ' +
        '  produkty_popis pp, ' +
        '  produkty_popis pp2, ' +
        '  produkty_popis pp3 ' +
        'WHERE ' +
        '  p.id = :id ' +
        '  and p.dostupnost = pd.kod(+) ' +
        '  and p.kod = pp.produkt(+) ' +
        '  and pp.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
        '  and pp.website(+) = get_website ' +
        '  and pp.typ_popisu(+) = \'AG_DETAILNI_POPIS\' ' +
        '  and p.kod = pp2.produkt(+) ' +
        '  and pp2.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
        '  and pp2.website(+) = get_website ' +
        '  and pp2.typ_popisu(+) = \'PRODUKT_NAZEV_ROZ\' ' +
        '  and p.kod = pp3.produkt(+) ' +
        '  and pp3.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
        '  and pp3.website(+) = get_website ' +
        '  and pp3.typ_popisu(+) = \'PRODUKT_NAZEV_ZKR\' ';

      vals = {
        id: req.params.id,
        loginName: loginName
      };

      Oracledb.select(sql, vals, req, null, null).then(
        function (result) {
          data = Tools.getSingleResult(result);
          let objProp = {
            id: req.params.id,
            //simpleArray: true,
            columnCount: 16,
            upperCase: true,
            addToRow: [
              {
                name: 'TEMPLATE_FILE',
                val: 'datasheet_properties_row.html'
              },
            ]
          };
          return api.getProductParams(req, objProp);
        }
      ).then(
        function (result) {
          props = result;

          let objPic = {
            id: req.params.id,
            //simpleArray: true,
            attTypes: ['m'],
            columnCount: 1,
            upperCase: true,
            addToRow: [
              {
                name: 'TEMPLATE_FILE',
                val: 'datasheet_pictures_row.html'
              },
              {
                name: 'BASE_URL',
                val: Constants.BASE_URL
              },
            ]
          };
          return api.getProductPictures(req, objPic);
        }
      ).then(
        function (result) {
          pictures = result;

          let objPic = {
            id: req.params.id,
            simpleArray: true,
            attTypes: ['m'],
          };
          return api.getProductPictures(req, objPic);
        }
      ).then(
        function (result) {
          try {
            pictureM = result[0] && result[0].fileName ? result[0].fileName : Constants.EMPTY_IMAGE_FILENAME2;
            // PROPERTIES
            props.map(function (el, i) {
              propsArr.push({
                TEMPLATE_FILE: 'datasheet_properties_row.html',
                INDEX: i + 1,
                REPEATS: [
                  {
                    NAME: 'COLUMN',
                    ROWS: el.items
                  }
                ]
              });
            });

            // ROW BETWEEN PROPERTIES AND PICTURES
            oddArr.push({
              TEMPLATE_FILE: 'datasheet_between_properties_and_pictures_row.html',
            });

            // PICTURES
            index = 1;
            pictures.map(function (el, i) {
              picturesArr.push({
                TEMPLATE_FILE: 'datasheet_pictures_row.html',
                INDEX: index,
                STYLE: ((pictures.length-1) === i) || (index === 3) ? 'display: block' : 'display: none',
                REPEATS: [
                  {
                    NAME: 'COLUMN',
                    ROWS: el.items
                  }
                ]
              });
              index = (index === 3 ? 1 : index + 1);
            });

            obj = {
              BASE_URL: Constants.BASE_URL,
              PRODUCT_CODE: (data.code || ''),
              CURRENCY: (data.currency || ''),
              PRODUCT_NAME: (data.name || ''),
              SHORT_NAME: (data.shortName || ''),
              PRODUCT_CATNUMBER: (data.catNumber || ''),
              PRODUCT_NAME_LONG: (data.longName || ''),
              PRODUCT_PRICE: (data.price || ''),
              PRODUCT_AVAILABILITY: (data.availability || ''),
              DESCRIPTION: (data.description || ''),
              IMAGE_FILE_NAME: pictureM,
              TEMPLATE_FILE_HEADER: 'datasheet_header.html',
              TEMPLATE_FILE_FOOTER: 'datasheet_footer.html',
              ITEMS: [
                {
                  ROWS: propsArr
                },
                {
                  ROWS: oddArr
                },
                {
                  ROWS: picturesArr
                }
              ]
            };
            report = htmlReports.getReport(obj, req);
            resolve(report);
          } catch (e) {
            console.log(e);
            reject(e);
          }
        },
        function (result) {
          console.log(result);
          reject(result);
        }
      );
    } catch (e) {
      console.log(e);
    }
  });
}

export function productDataList (req, res) {
  try {
    api.productDataListInternal(req).then(
      function (result) {
        res.send(result);
      },
      function (result) {
        console.log(result);
        res.send('');
      },
    )
  } catch (e) {
    console.log(e);
  }
}

export function productDataListPdf (req, res) {
  let options;
  api.productDataListInternal(req).then(
    function (result) {
      try {
        // CREATE PDF and SEND
        res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Access-Control-Allow-Origin': '*',
          'Content-Disposition': 'inline; filename=product-list-' + req.params.id + '.pdf'
        });
        options = {
          "base": '//files//',
          /*"border": {
            "top": "1cm",            // default is 0, units: mm, cm, in, px
            "right": "1cm",
            "bottom": "1cm",
            "left": "1cm"
          },*/
        };
        htmlToPdf.create(result, options).toBuffer(function (err, buffer) {
          if (err) {
            console.log('buffer error');
            console.log(err);
            res.end('');
            return;
          }
          try {
            res.write(buffer);
            res.end();
          } catch (e) {
            console.log(e);
            res.send('');
          }
        });
      } catch (e) {
        console.log(e);
        res.send('');
      }
    },
    function () {
      res.send('');
    }
  );
}

export function userCountries (req, res) {
  let sql, vals = {}, sessionid, loginName, countries: Array<any> = [], countriesDelivery: Array<any> = [];

  try {
    loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

    sessionid = Tools.getSessionId(req);
    if (!sessionid) {
      res.json({});
      return;
    }

    sql =
      'SELECT ' +
      '  s1.kod as "statFak", ' +
      '  s1.kod as "statDod", ' +
      '  s1.nazev as "nazevFak", ' +
      '  s1.nazev as "nazevDod" ' +
      'FROM ' +
      '  staty s1 ' +
      'WHERE ' +
      '  web_check_login = 1 ' +
      '  and s1.kod = DECODE(get_param(\'JAZYK_UZIVATELE\'), \'CZE\', \'CZ\', \'NEM\', \'AT\') ';

    vals = {
      sessionid: sessionid,
      loginName: loginName
    };

    Oracledb.select(sql, {}, req, null, null).then(
      function (result) {
        try {
          let data: any = Tools.getSingleResult(result);
          let user: any = {};

          countries = [
            {
              id: data.statFak,
              name: data.nazevFak,
              val: data.statFak,
              selected: true
            }
          ];
          countriesDelivery = [
            {
              id: data.statDod,
              name: data.nazevDod,
              val: data.statDod,
              selected: true
            }
          ];

          user = {
            countries: countries,
            countriesDelivery: countriesDelivery
          };

          res.json(user);
        } catch (e) {
          console.log(e);
          res.json({});
        }
      },
      function (result) {
        console.log(result);
        res.json({});
      }
    );
  } catch (e) {
    console.log(e);
    res.json({});
  }
}

export function getProductParams (req, obj) {
  return new Promise(function (resolve, reject) {
    let vals, properties, sql, i, arr = [], amount;

    sql =
      'SELECT ' +
      '  * ' +
      'FROM ' +
      '  (' +
      '   SELECT ' +
      '     pex.parametr, ' +
      '     NVL(pepj.nazev,pep.nazev) as "paramName", ' +
      '     decode(pep.typ, 4, decode(DBMS_LOB.SUBSTR(NVL(peprj.hodnota,pex.hodnota), 1, 1), \'1\', \'ano\', \'ne\'), DBMS_LOB.SUBSTR(NVL(peprj.hodnota,pex.hodnota), 250, 1)) as "val", ' +
      '     decode(pep.typ, 6, DBMS_LOB.SUBSTR(NVL(peprj.hodnota2,pex.hodnota2), 250, 1), null) as "val2", ' +
      '     decode(pep.typ, 6, \'-\', null) as "oddVal2", ' +
      '     ppp.poradi as "sortOrder" ' +
      '   FROM ' +
      '      produkty_predlohy_pol ppp, ' +
      '      produkty p, ' +
      '      produkty_eshop pex, ' +
      '      produkty_eshop_param pep, ' +
      '      produkty_eshop_param_jazyk pepj, ' +
      '      produkty_eshop_parval_jazyk peprj ' +
      '   WHERE ' +
      '     p.id = :id ' +
      '     and ppp.typ in(1,2) ' +
      '     and ppp.id_predlohy = p.predloha ' +
      '     and pex.produkt = p.kod ' +
      '     and pex.parametr = pep.kod ' +
      '     and pex.parametr = ppp.kod_param ' +
      '     and pex.hodnota is not null ' +
      '     and pep.kod = pepj.kod_param(+) ' +
      '     and pepj.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '     and peprj.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
      '     and pex.id_paramvalue=peprj.id_parval(+) ' +
      '  ) ' +
      'GROUP BY ' +
      '  parametr, ' +
      '  "paramName", ' +
      '  "val", ' +
      '  "val2", ' +
      '  "oddVal2", ' +
      '  "sortOrder" ' +
      'ORDER BY ' +
      '  "sortOrder"';

    vals = {id: obj.id};
    amount = (obj.columnCount || Constants.PRODUCT_LIST_PROPERTIES_ROWS_ON_COLUMN);

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let prop: any = Tools.getMultiResult(result);
        properties = [];
        i = 1;
        prop.map(function (el, n) {
          if (obj.addToRow && obj.addToRow.length > 0) {
            obj.addToRow.map(function (elx) {
              el[elx.name] = elx.val;
            });
          }
          if (obj.simpleArray) {
            if (obj.upperCase) {
              Tools.setUpperCase(el);
            }
            properties.push(el);
          } else {
            if (i <= amount) {
              if (obj.upperCase) {
                Tools.setUpperCase(el);
              }
              arr.push(el);
            }
            if (i === amount || n === prop.length - 1) {
              properties.push({items: arr});
              arr = [];
            }
            i = i === amount ? 1 : i + 1;
          }
        });
        resolve(properties);
      },
      function (result) {
        reject([]);
      }
    );
  });
};

export function getProductPictures (req, obj) {
  return new Promise(function (resolve, reject) {
    let vals, properties, sql, i, arr = [], amount;

    sql =
    'SELECT ' +
    '  s.name as "productName", ' +
    '  DECODE(' +
    '    ISNUMBER(SUBSTR(s.sufix, 2)), ' +
    '    0, ' +
    '    UPPER(SUBSTR(s.sufix, 2)), ' +
    '    DECODE(s.CRM_PRILOHA_TYP, ' +
    '           \'' + Constants.IMAGE_SMALL_TYPE_CODE + '\', \'S\',' +
    '           \'' + Constants.IMAGE_MEDIUM_TYPE_CODE + '\', \'M\',' +
    '           \'' + Constants.IMAGE_LIST_TYPE_CODE + '\', \'L\',' +
    '           \'' + Constants.IMAGE_POPUP_TYPE_CODE + '\', \'T\',' +
    '           \'' + Constants.IMAGE_BIG_TYPE_CODE + '\', \'B\')' +
    '  ) as "type", ' +
    '  TO_NUMBER(DECODE(ISNUMBER(SUBSTR(s.sufix, 2)), 1, SUBSTR(s.sufix, 2), s.prefix)) as "sort", ' +
    '  s.id_prilohy as "id", ' +
    '  \'' + Constants.FILES_PATH + '\' || s.id_prilohy || s.ext as "fileName" ' +
    'FROM ' +
    '  ( ' +
    '   SELECT ' +
    '     PD.ID as ID_PRILOHY, ' +
    '     PD.CRM_PRILOHA_TYP, ' +
    '     pp.popis as name, ' +
    '     SUBSTR(PD.POPIS,INSTR(PD.POPIS, \'.\', -1) - 2, 2) as sufix, ' +
    '     SUBSTR(SUBSTR(PD.POPIS, 1, INSTR(PD.POPIS, \'.\', -1) - 3), INSTR(SUBSTR(PD.POPIS, 1, INSTR(PD.POPIS, \'.\', -1) - 3), \'_\', -1) + 1) as prefix, ' +
    '     SUBSTR(PD.POPIS, INSTR(PD.POPIS, \'.\', -1)) as ext ' +
    '   FROM ' +
    '     PRODUKTY P, ' +
    '     PRODUKTY_POPIS PP, ' +
    '     PRILOHY_DATA_INFO PD, ' +
    '     PRILOHY_NOVE PN ' +
    '   WHERE ' +
    '     P.ID = :id ' +
    '     AND p.kod = pp.produkt(+) ' +
    '     AND pp.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
    '     AND pp.typ_popisu(+) = \'PRODUKT_NAZEV\' ' +
    '     AND pp.website(+) = get_website ' +
    '     AND PD.ID = PN.PRILOHA_ID ' +
    '     AND PN.TABULKA = \'PRODUKTY\' ' +
    '     AND PN.PK = P.KOD ' +
    '     AND PD.CRM_PRILOHA_TYP IN (' +
    '       \'' + Constants.IMAGE_SMALL_TYPE_CODE + '\', ' +
    '       \'' + Constants.IMAGE_MEDIUM_TYPE_CODE + '\', ' +
    '       \'' + Constants.IMAGE_LIST_TYPE_CODE + '\', ' +
    '       \'' + Constants.IMAGE_POPUP_TYPE_CODE + '\', ' +
    '       \'' + Constants.IMAGE_BIG_TYPE_CODE + '\'' +
    '     ) ' +
    '   ) S ' +
    'ORDER BY ' +
    '  "sort" ';

    vals = {id: obj.id};
    amount = (obj.columnCount || Constants.PRODUCT_LIST_PICTURES_ROWS_ON_COLUMN);

    Oracledb.select(sql, vals, req, null, null).then(
      function (result) {
        let prop: any = Tools.getMultiResult(result);
        properties = [];
        i = 1;

        // FILTER FOR TYPES
        if (obj.attTypes && obj.attTypes.length > 0) {
          let arr = obj.attTypes.map(function (el) {
            return el.toUpperCase();
          });
          prop = prop.filter(function (el) {
            return arr.indexOf(el.type.toUpperCase()) > -1;
          });
        }

        prop.map(function (el, n) {
          if (obj.addToRow && obj.addToRow.length > 0) {
            obj.addToRow.map(function (elx) {
              el[elx.name] = elx.val;
            });
          }
          if (obj.simpleArray) {
            if (obj.upperCase) {
              Tools.setUpperCase(el);
            }
            properties.push(el);
          } else {
            if (i <= amount) {
              if (obj.upperCase) {
                Tools.setUpperCase(el);
              }
              arr.push(el);
            }
            if (i === amount || n === prop.length - 1) {
              properties.push({items: arr});
              arr = [];
            }
            i = (i === amount ? 1 : i + 1);
          }
        });
        resolve(properties);
      },
      function (result) {
        reject(result);
      }
    );
  });
};

export function language (req, res) {
  res.json({language: req.countryVersion});
}

export function assistMessage (req, res) {
  let sql, vals, sessionid, sqlProps, loginName, config, productId;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({state: -1, message: ''});
    return;
  }

  if (!req.body.email ||
    !req.body.fullName ||
    !(req.body.secure === Constants.SECURE_FORM_CODE) ||
    !Tools.validateEmail(req.body.email)
  ) {
    res.json({state: -1, message: ''});
    return;
  }

  productId = req.body.product && req.body.product.id ? req.body.product.id : null;

  try {

    config = Tools.getLangConfig(req);

    sql =
      'begin web_send_message_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_SEND_MESSAGE_JSON\'';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLoginName:' + (loginName || ''),
          'aSaveContent:1',
          'aExtCookies:1',
          'apage_anchor:',
          'aemail:' + req.body.email,
          'aemail_copy:' + config.assistEmail,
          //'aemail_copy:sales@mcled.cz',
          'aname:' + req.body.fullName,
          'acontent:' + req.body.text,
          'aid:' + productId,
          'Eaq:2',
          'aid_page:',
          'asablona:ZPRAVA_MATE_DOTAZ',
          'asablona_predmet:ZPRAVA_MATE_DOTAZ_PREDMET'
        ]
      }
    };

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        vals = {sessionid: sessionid};
        return Oracledb.select(sqlProps, vals, req, null, null);
      }
    ).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        let obj = (data.result ? JSON.parse(data.result) : {});
        res.json(obj);
      },
      function (result) {
        console.log(result);
        res.json({state: -1, message: ''});
      }
    );
  } catch (e) {
    console.log(e);
    res.send('');
  }
}

export function metaTags (req, res) {
  var sql;

  try {

    sql =
      'select ' +
      '  get_param(\'WEB_ESHOP_METATAG_DESCRIPTION\', 0, null, USER) as "description", ' +
      '  get_param(\'WEB_ESHOP_METATAG_KEYWORDS\', 0, null, USER) as "keywords", ' +
      '  get_param(\'WEB_ESHOP_METATAG_AUTHOR\', 0, null, USER) as "author", ' +
      '  get_param(\'WEB_ESHOP_METATAG_GENERATOR\', 0, null, USER) as "generator", ' +
      '  get_param(\'WEB_ESHOP_METATAG_ROBOTS\', 0, null, USER) as "robots", ' +
      '  get_param(\'WEB_ESHOP_METATAG_HTTPEQUIV\', 0, null, USER) as "contentType", ' +
      '  get_param(\'WEB_ESHOP_METATAG_PRAGMA\', 0, null, USER) as "pragma", ' +
      '  get_param(\'WEB_ESHOP_METATAG_CACHE_CONTROL\', 0, null, USER) as "cacheControl", ' +
      '  get_param(\'WEB_ESHOP_METATAG_EXPIRES\', 0, null, USER) as "expires", ' +
      '  get_param(\'WEB_ESHOP_METATAG_LANG\', 0, null, USER) as "lang", ' +
      '  get_param(\'WEB_ESHOP_METATAG_VIEWPORT\', 0, null, USER) as "viewport" ' +
      'from ' +
      '  dual';

    Oracledb.select(sql, {}, req, null, null).then(
      function (result) {
        var data = Tools.getSingleResult(result);
        res.json(data);
      },
      function (result) {
        console.log(result);
        res.json({});
      },
    );
  } catch (e) {
    console.log(e);
    res.json({});
  }
}

export function getSqlForClassification(data: any, sql: string, str: string, allIn: Boolean): string {
  let arr = data ? data.split(Constants.COMMA) : [], oper, result;
  let tmp = '';
  arr.map(function (el) {
    if (el) {
      oper = allIn ? 'and ' : (tmp ? ' or ' : '');
      tmp += ' ' + oper + ' exists(select 1 from crm_produkty_zatrideni where id_typ_zatrideni_produkt = ' + el + ' and id_produktu = p.id) ';
    }
  });
  if (data) {
    tmp = allIn ? tmp : ' and (' + tmp + ') ';
  }
  result = sql.replace(str, tmp);
  return result;
}

export function lostPassword(req, res) {
  let sql, vals, sessionid, sqlProps, loginName, valsSessionid, data, valsDelete, sqlDelete;

  loginName = Tools.getCookieId(req, Constants.AUTH_TOKEN_CODE);

  sessionid = Tools.getSessionId(req);
  if (!sessionid) {
    res.json({error: true});
    return;
  }

  try {

    sql =
      'begin web_eshop_lost_pwd_json(:strings); end;';

    sqlProps =
      'SELECT ' +
      '  s1 as "result" ' +
      'FROM ' +
      '  sessionid_temp ' +
      'WHERE ' +
      '  sessionid = decrypt_cookie(:sessionid) ' +
      '  AND kod = \'WEB_ESHOP_LOST_PWD_JSON\'';

    vals = {
      strings: {
        type: oracle.STRING,
        dir: oracle.BIND_IN,
        val: [
          'asessionid:' + sessionid,
          'aLogin:' + (req.body.email || ''),
          'aSaveContent:1',
          'aExtCookies:1',
        ]
      }
    };

    valsSessionid = {sessionid: sessionid};

    Oracledb.executeSQL(sql, vals, req, null, {commit: true}).then(
      function (result) {
        return Oracledb.select(sqlProps, valsSessionid, req, null, null);
      }
    ).then(
      function (result) {
        let data: any = Tools.getSingleResult(result);
        let dataParse = (data ? JSON.parse(data.result) : {error: true});
        res.json({error: dataParse.state != '1', message: dataParse.message});
      },
      function (result) {
        console.log(result);
        res.json({error: true});
      }
    );
  } catch (e) {
    console.log(e);
    res.json({error: true});
  }
}
