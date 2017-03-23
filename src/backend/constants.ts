export var BASE_URL = 'http://new.mcled.cz';
export var COUNTRIES_VERSION = [
  {CODE: 'CZ', URL: 'cz.mcled.cz', numberDigitsRound: 1, assistEmail: 'support@mcled.cz'},
  {CODE: 'CZ', URL: 'localhost', numberDigitsRound: 1, assistEmail: 'support@mcled.cz'},
  {CODE: 'CZ', URL: 'new.mcled.cz', numberDigitsRound: 1, assistEmail: 'support@mcled.cz'},
  {CODE: 'DE', URL: 'at.mcled.cz', numberDigitsRound: 2, assistEmail: 'mcled.support@schmachtl.at'}
];
export var SECURE_FORM_CODE = 'c18d7b974296b9802ac76fad298ffcbe';
export var CZECH_COUNTRY_CODE = 'CZ';
export var AUT_COUNTRY_CODE = 'DE';
export var NODEJS_APP_PATH = '/srv/nodejs/mcled_website_v3';
export var APP_BACKEND_PATH = '/src/backend';
export var IMAGE_SMALL_TYPE = 'S';
export var IMAGE_BIG_TYPE = 'B';
export var FILES_PATH = '/files/';
export var EMPTY_IMAGE_PATH = (process.env.APP_PORT ? '' : __dirname + '/../../');
export var EMPTY_IMAGE_FILENAME = (process.env.APP_PORT ? NODEJS_APP_PATH : '') + '/images/noimage/mcled_noimage_B.png';
export var EMPTY_IMAGE_FILENAME2 = '/images/noimage/mcled_noimage_B.png';
export var HTML_TEMPLATE_DIRNAME = (process.env.APP_PORT ? (NODEJS_APP_PATH + APP_BACKEND_PATH) : __dirname) + '/html_templates/';
export var HTML_REPORT = {
  BEGIN_REPEAT_SECTION: 'BEGIN_REPEAT_',
    END_REPEAT_SECTION: 'END_REPEAT_'
};
export var IMAGE_SMALL_TYPE_CODE = 'S_nahled';
export var IMAGE_MEDIUM_TYPE_CODE = 'M_zaznam/vychozi';
export var IMAGE_BIG_TYPE_CODE = 'B_lupa/lightbox';
export var IMAGE_LIST_TYPE_CODE = 'L_seznam';
export var IMAGE_POPUP_TYPE_CODE = 'T_popup';
export var IMAGE_LOGO_WEB_TYPE_CODE = 'LOGO_WEB';
export var PRODUCT_LIST_PICTURES_ROWS_ON_COLUMN = 8;
export var PRODUCT_LIST_PROPERTIES_ROWS_ON_COLUMN = 8;
export var MAILER = {
  EMAIL: 'notia@notia.cz',
  HOST: 'gates.notia.cz',
  PORT: 25
};
export var PATHS = {
  CART: '/basket',
  LOGIN: '/login',
  HOMEPAGE: '/homepage',
  ORDER_SHIPPING_AND_PAYMENT: '/shipping-and-payment',
  ORDER_PERSONAL_DATA: '/personal-data',
  ORDER_SUMMARY: '/order-summary',
  ORDER_SUCCESS: '/thanks',
  NEW_USER_SUCCESS: '/registration-success',
  SEARCH_RESULT: '/search'
};
export var commaParams = '@';
export var COMMA = ',';
export var COLON = ':';
export var SPACE = ' ';
export var SLASH = '/';
export var QUERY = '?';
export var EQUALS = '=';
export var AT = '@';
export var DOT = '.';
export var DASH = '-';
export var HASH = '#';
export var AND = '&';
export var JS_END = '\n';
export var CODE_ESHOP_PARAM_RGB = 'EF004270';
export var CODE_ESHOP_PARAM_MIN = '';
export var CODE_ESHOP_PARAM_MAX = 'SF001113';
export var CODE_ESHOP_PARAM_MAX2 = 'SF001114';
export var CODE_ESHOP_PARAM_STEP = 'EF008320';
export var CODE_ESHOP_PARAM_LENGTH = 'EF000063';
export var CODE_CONECTOR_CABEL_TWO_CORE = 'ML-733.001.46.0';
export var CODE_CONECTOR_CABEL_FOUR_CORE = 'ML-733.002.46.0';
export var EMPTY_LOGIN_NAME = 'nepřihlášen';
export var MESSAGE_COUPON_INVALID = 'Neplatný kupón';
export var MESSAGE_COUPON_DELETE_ERROR = 'Chyba při mazání kupónu';
export var MESSAGE_COUPON_ERROR = 'Nepodařilo se vložit kupón';
export var MESSAGE_ORDER_ERROR = 'Nepodařilo se vytvořit objednávku';
export var MESSAGE_ORDER_SHIPPING_ERROR = 'Není vybraný způsob dopravy';
export var MESSAGE_ORDER_PAYMENT_ERROR = 'Není vybraný způsob platby';
export var MESSAGE_ORDER_FIRSTNAME_ERROR = 'Není zadáno jméno uživatele';
export var MESSAGE_ORDER_LASTNAME_ERROR = 'Není zadáno příjmení uživatele';
export var MESSAGE_ORDER_EMAIL_ERROR = 'Není zadán email uživatele';
export var MESSAGE_LOGIN_ERROR = 'Nepodařilo se přihlásit';
export var MESSAGE_LOGOUT_ERROR = 'Nepodařilo se odhlásit';
export var MESSAGE_LOGIN_OR_PASSWORD_ERROR = 'Chybné jméno nebo heslo';
export var MESSAGE_LOGIN_NOT_FILLED = 'Login není vyplněn';
export var MESSAGE_CART_ITEMS_NOT_FOUND = 'V košíku nemáte žádné zboží';
export var MESSAGE_UPDATE_USER_SUCCESS = 'Uživatelský profil byl uložen';
export var MESSAGE_EMAIL_VALIDATE = 'Email je neplatný';
export var MESSAGE_LOGIN_VALIDATE = 'Přihlašovací email je neplatný';
export var MESSAGE_PHONE_VALIDATE = 'Telefon je neplatný';
export var MESSAGE_ZIP_VALIDATE = 'PSČ je neplatné';
export var MESSAGE_FIRSTNAME_NOT_FILLED = 'Jméno není vyplněno';
export var MESSAGE_LASTNAME_NOT_FILLED = 'Příjmení není vyplněno';
export var MESSAGE_EMAIL_NOT_FILLED = 'Email není vyplněn';
export var MESSAGE_PHONE_NOT_FILLED = 'Telefon není vyplněn';
export var MESSAGE_STREET_NOT_FILLED = 'Ulice není vyplněna';
export var MESSAGE_CITY_NOT_FILLED = 'Město není vyplněno';
export var MESSAGE_ZIP_NOT_FILLED = 'PSČ není vyplněno';
export var MESSAGE_COMPANY_NAME_NOT_FILLED = 'Firma není vyplněna';
export var MESSAGE_COMPANY_NAME_VALIDATE = 'Firma není platná';
export var MESSAGE_REGID_NOT_FILLED = 'IČ není vyplněno';
export var MESSAGE_REGID_VALIDATE = 'IČ není platné';
export var MESSAGE_VATID_NOT_FILLED = 'DIČ není vyplněno';
export var MESSAGE_VATID_VALIDATE = 'DIČ je neplatné';
export var MESSAGE_BUSSINESSCOPE_VALIDATE = 'Předmět podnikání není vyplněn';
export var MESSAGE_PASSWORD_NOT_FILLED = 'Heslo není vyplněno';
export var MESSAGE_CONFIRM_PASSWORD_NOT_SAME = 'Heslo a heslo pro ověření musí být stejné';
export var MESSAGE_CONFIRM_PASSWORD_NOT_FILLED = 'Heslo pro ověření není vyplněno';
export var MESSAGE_EXIST_USER = 'Zadaný login již existuje, zadejte prosím jiný.';
export var MESSAGE_EXIST_USER_EMAIL = 'Uživatel se zadaným emailem již existuje, zadejte prosím jiný.';
export var MESSAGE_CREATE_USER_ERROR = 'Chyba při vytváření uživatele.';
export var MESSAGE_UPDATE_USER_ERROR = 'Chyba při ukládání uživatele.';
export var MESSAGE_ERROR_LOST_PASSWORD = 'Chyba při odeslání požadavku.';
export var MESSAGE_SUCCESS_LOST_PASSWORD = 'Heslo bylo zasláno na Váš email.';
export var MESSAGE_PASSWORD_NOT_VALID = 'Heslo nemá správný tvar (délka minimálně 8 číslic, 1x velké písmeno, 1x malé písmeno, 1x číslice)';
export var B2B_WRONG_WEBSITE = 'Váš uživatelský účet má schválené B2B podmínky pro stát ';
export var B2B_WRONG_WEBSITE2 = 'Přihlaste se prosím na webu příslušného státu pomocí tohoto odkazu: ';
export var PRODUCT_ADD_TO_CART_ERROR = 'Chyba při vkládání do košíku';
export var SESSIONID_CODE = 'sessionid';
export var AUTH_TOKEN_CODE = 'auth_token';
export var ROOT_PATH = 'http://localhost:' + (parseInt(process.env.APP_PORT, 10) || 9002);
export var actionId = 2664;
export var newsId = 2663;
export var availabilityCode = 'SKLADEM';
export var imageFileExtPath = '/images/theme/files/';
export var imgagePath = '/files/';
export var imgagePathEmpty = '/images/noimage/';
export var imgageEmptySmall = 'mcled_noimage_S.png';
export var imgageEmptyMedium = 'mcled_noimage_M.png';
export var imgageEmptyLarge = 'mcled_noimage_L.png';
export var imgageEmptyBig = 'mcled_noimage_B.png';
export var sqlListCore =
  'SELECT ' +
  '  \'/\' || pr.presmerovani as "redirect", ' +
  '  p.id as "id", ' +
  '  p.kod as "code", ' +
  '  DBMS_LOB.SUBSTR(pp.popis, 250, 1) as "name", ' +
  '  MIN(z.produkt_order) as "sortOrder" ' +
  'FROM ' +
  '  crm_produkty_zatrideni z, ' +
  '  produkty p, ' +
  '  produkty_popis pp, ' +
  '  produkt_eshop_vazby pv, ' +
  '  (select ' +
  '     id ' +
  '   from ' +
  '     crm_typy_zatrideni_produkty ' +
  '     start with ' +
  '       id = (select ' +
  '               id_zatrideni ' +
  '             from ' +
  '               web_nastaveni_webu_zatr_prod nwz, ' +
  '               web_nastaveni_webu nw ' +
  '             where ' +
  '               nw.id = nwz.id_nastaveni ' +
  '               and nw.eshop = get_website ' +
  '               and nw.presmerovani = :code) ' +
  '     connect by prior id = matka ' +
  '   union ' +
  '   select null as id from dual where :code is null ' +
  '  ) nwz, ' +
  '  (select id_produktu from crm_produkty_zatrideni where id_typ_zatrideni_produkt = 2663) ne, ' +
  '  (select id_produktu from crm_produkty_zatrideni where id_typ_zatrideni_produkt = 2664) ac, ' +
  '  web_website_produkt_presmer pr ' +
  'WHERE ' +
  '  (z.ID_TYP_ZATRIDENI_PRODUKT = nwz.id or :code is null ) ' +
  '  and (' +
  '    instrs(p.kod,\'\'||:searchstr||\'\',1,0) = 1 ' +
  '    or ' +
  '    instrs(p.nazev,\'\'||:searchstr||\'\',1,0) = 1 ' +
  '    or ' +
  '    instrs(p.nazev4,\'\'||:searchstr||\'\',1,0) = 1 ' +
  '    or :searchstr is null' +
  '  ) ' +
  '  and p.matka is null ' +
  '  and p.kod = pp.produkt(+) ' +
  '  and pp.jazyk(+) = get_param(\'JAZYK_UZIVATELE\') ' +
  '  and pp.website(+) = get_website ' +
  '  and pp.typ_popisu(+) = \'PRODUKT_NAZEV\' ' +
  '  and p.kod = pv.produkt ' +
  '  and pv.zobrazit = 1 ' +
  '  and pv.eshop = get_website ' +
  '  and z.id_produktu = p.id ' +
  '  and p.id = ne.id_produktu(+) ' +
  '  and p.id = ac.id_produktu(+) ' +
  '  and p.aktivni = 1 ' +
  '  and p.kod = pr.produkt ' +
  '  and pr.website = pv.eshop ';

export var sqlListCoreGroupBy =
  'GROUP BY ' +
  '  p.id, ' +
  '  p.kod, ' +
  '  pr.presmerovani, ' +
  '  DBMS_LOB.SUBSTR(pp.popis, 250, 1) ';

export var sqlListInfo = 'select ' +
  '  p.id as "id", ' +
  '  e1_web_cena(null, p.kod, null, null, null, null, 1, 1, 1, null, :loginName, 1) AS "price", ' +
  '  get_param(\'MENA_PRO_WEBSITE\', 0, null, USER) as "currency", ' +
  '  ((ds.procent / 100) + 1) AS "priceVatKoef", ' +
  '  decode(p.dostupnost_datum, null, pd.nazev, \'Očekáváme\') AS "availability", ' +
  '  NVL(pdx.priloha_id, 0) as "imgMediumId", ' +
  '  decode(instr(pdx.popis, \'.\', -1), 0, null, substr(pdx.popis, instr(pdx.popis, \'.\', -1))) as "imgMediumExt", ' +
  '  decode(ac.id_produktu, null, null, 1) as "action", ' +
  '  decode(ne.id_produktu, null, null, 1) as "news",' +
  '  decode(p.dostupnost, \'SKLADEM\', 1, 0) as "inStock", ' +
  '  p.predloha as "patternParams", ' +
  '  p.mj1 as "unit" ' +
  'from ' +
  '  produkty p, ' +
  '  (select ' +
  '     pn.pk, ' +
  '     pdi.popis, ' +
  '     pn.priloha_id ' +
  '   from ' +
  '     prilohy_nove pn, ' +
  '     prilohy_data_info pdi ' +
  '   where ' +
  '     pn.tabulka = \'PRODUKTY\' ' +
  '     and pdi.crm_priloha_typ = \'L_seznam\' ' +
  '     and pdi.id = pn.priloha_id ' +
  '  ) pdx, ' +
  '  produkty_dostupnost pd, ' +
  '  danove_sazby ds, ' +
  '  (select id_produktu from crm_produkty_zatrideni where id_typ_zatrideni_produkt = ' + newsId + ') ne, ' +
  '  (select id_produktu from crm_produkty_zatrideni where id_typ_zatrideni_produkt = ' + actionId + ') ac ' +
  'where ' +
  '  p.id in (@@IDS@@) ' +
  '  and p.kod = pdx.pk(+) ' +
  '  and 0 < instr(pdx.popis(+), \'_01_L.\') ' +
  '  and ds.kod = p.sazba_dan_pro ' +
  '  and p.id = ne.id_produktu(+) ' +
  '  and p.id = ac.id_produktu(+) ' +
  '  and p.dostupnost = pd.kod(+) ' +
  'group by ' +
  '  p.id, ' +
  '  p.kod, ' +
  '  ds.procent, ' +
  '  p.dostupnost_datum, ' +
  '  pd.nazev, ' +
  '  pdx.priloha_id, ' +
  '  ac.id_produktu, ' +
  '  ne.id_produktu, ' +
  '  pdx.popis, ' +
  '  p.dostupnost, ' +
  '  p.predloha, ' +
  '  p.mj1 ';

export var STATE = 'CZ';
export var FORMAT_NUMBER_1 = '1.2-2';
export var FORMAT_NUMBER_2 = '1.2-2';
export var MESSAGE_NEWSLETTER_INVALID = 'Neplatný email';
export var MESSAGE_NEWSLETTER_SUCCESS = 'Email byl zaregistrován pro zasílání novinek';
export var SEARCH_STR_LENGTH = 3;
export var MESSAGE_SEARCH_STR_LENGTH_ERROR = 'Řetězec musí obsahovat alespoň 3 znaky';
export var EMPTY_ITEM_COMBO_TEXT = '-- nevyplněno --';
export var ERROR_BUY = 'Došlo k chybě při vložení do košíku, produkty se neuložily.';
export var ORDER_DEFAULT = 'Výchozí';
export var ORDER_PRICE_ASC = 'Cena vzestupně';
export var ORDER_PRICE_DESC = 'Cena sestupně';
export var ORDER_CODE_ASC = 'Kód vzestupně';
export var ORDER_CODE_DESC = 'Kód sestupně';
export var ORDER_NAME_ASC = 'Název vzestupně';
export var ORDER_NAME_DESC = 'Název sestupně';
export var MESSAGE_ASSIST_SUCCESS = 'Dotaz byl odeslán';
export var MESSAGE_ASSIST_ERROR = 'Dotaz nebyl odeslán, došlo k chybě';
export var MESSAGE_SAVE_AMOUNT_PROCESS = 'Čekejte prosím, ukládá se množství.';
export var NOT_FOUND_TEXT = 'Nenalezen žádný záznam';
export var FILTER_TYPE_FOR_BOOLEAN = 4;
export var REDIRECT_CODE_FOR_RECORD = 'PRODUKTY';
export var WEBSITE_TITLE = 'McLED';
export var SEX = [
  {id: '1', name: 'Pan', val: 'Pan', sex: 1},
  {id: '2', name: 'Paní', val: 'Paní', sex: -1}
];
export var DOWNLOAD_TYPE_PRODUCT_CZ =  'KE_STAZENI_PRODUKT_CZ';
export var DOWNLOAD_TYPE_PRODUCT_AT =  'KE_STAZENI_PRODUKT_AT';
export var DOWNLOAD_TYPE_CATEGORY_CZ =  'KE_STAZENI_ZATRIDENI_CZ';
export var DOWNLOAD_TYPE_CATEGORY_AT =  'KE_STAZENI_ZATRIDENI_AT';
export var WWW_ANCHOR_CODE =  'MCLED_ODKAZ';
export var PARTNERS_LOGO_CATS =  '1946';
