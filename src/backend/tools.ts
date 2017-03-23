var Constants = require('./constants');

export module Tools {
  export function getSingleResult(result) {
    var obj = {};
    if (result && result.result) {
      if (result.result.rows) {
        if (result.result.rows[0]) {
          obj = result.result.rows[0];
        } else {
          obj = {};
        }
      }
    }
    return obj;
  }

  export function getMultiResult (result) {
    var obj = [], i, l;
    if (result && result.result) {
      if (result.result.rows) {
        for (i = 0, l = result.result.rows.length; i < l; i += 1) {
          obj.push(result.result.rows[i]);
        }
      }
    }
    return obj;
  }

  export function validateEmail (value: string): Boolean {
    var re = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      result = value ? re.test(value) : true;
    return result;
  }

  export function validatePhone(value: string): Boolean {
    var re = /^(\+420)? ?[0-9]{3} ?[0-9]{3} ?[0-9]{3}$/,
      result = value ? re.test(value) : true;
    return result;
  }

  export function validateZip(value: string): Boolean {
    var re = /^[0-9]{3} ?[0-9]{2}$/,
      result = value ? re.test(value) : true;
    return result;
  }

  export function getCookieId (req: any, name: string): string {
    return req.cookies.get(name);
  }

  export function getSessionId (req: any): string {
    return req.cookies.get(Constants.SESSIONID_CODE);
  }

  export function createCookie (res: any, name: string, val: string, options: any = {}) {
    res.cookies.set(name, val, options);
  }

  export function createAuthCookie(res: any, val: string) {
    //let expires = new Date();
    res.cookies.set(Constants.AUTH_TOKEN_CODE, val, {});
  }

  export function deleteCookie (res: any, name: string) {
    //res.cookies.set(name, {expire: new Date()});
    res.clearCookie(name);
  }

  export function setUpperCase(obj) {
    for(let e in obj) {
      if (obj.hasOwnProperty(e)) {
        let exist = obj[e.toUpperCase()];
        obj[e.toUpperCase()] = obj[e];
        if (!exist) {
          delete obj[e];
        }
      }
    }
  }

  export function countryVersion (req, res, next) {
    let hostname = req.hostname;
    let url = ( hostname ? hostname.replace(/https:\/\//g, '').replace(/http:\/\//g, '') : '');
    let czechVersion = Constants.COUNTRIES_VERSION.filter(function (el) {
      return el.CODE === Constants.CZECH_COUNTRY_CODE;
    })[0];
    let cv = Constants.COUNTRIES_VERSION.filter(function (el) {
      return el.URL === url.substr(0, el.URL.length);
    })[0];

    req.countryVersion = (cv && cv.CODE ? cv.CODE : czechVersion.CODE);
    res.countryVersion = req.countryVersion;

    next();
  }

  export function getDBLang (req: any) {
    let code = req.countryVersion;
    let lang = Constants.COUNTRIES_VERSION.filter(function (el){
      return el.CODE === code;
    });

    return (lang && lang[0] ? lang[0].DB_LANG : Constants.COUNTRIES_VERSION[0].DB_LANG);
  }

  export function sortAsc (items, field) {
    let arr = [], newArr = [], onlyNumber = false;
    items.map(function (el) {
      arr.push(el[field]);
    });
    onlyNumber = arr.every(function (el) {
      return !isNaN(Number(String(el)));
    });
    if (onlyNumber) {
      arr.sort(function (a, b) {
        return a - b;
      });
    } else {
      arr.sort();
    }
    arr.map(function (el) {
      newArr.push(items.filter(function (el2) {
        return el2[field] === el;
      })[0]);
    });
    return newArr;
  }

  export function escapeRegExp (str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  export function getLangConfig (req: any) {
    let code = req.countryVersion;
    let lang = Constants.COUNTRIES_VERSION.filter(function (el){
      return el.CODE === code;
    });

    return (lang && lang[0] ? lang[0] : Constants.COUNTRIES_VERSION[0]);
  }

  export function roundTo (n, req): Number {
    //let lang = getLangConfig(req);
    //return Number(Number(n).toFixed(lang.numberDigitsRound));
    return Number(n);
  }

  export function addToObjects (obj, add): void {
    for (let key in add) {
      obj[key] = add[key];
    }
  }

/*  export function sendEmail (obj) {
    var transporter = nodemailer.createTransport({
      host: Constants.MAILER.HOST,
      port: Constants.MAILER.PORT,
      secure: false,
      ignoreTLS: true
    });
    transporter.sendMail({
      from: (obj.from || Constants.MAILER.EMAIL),
      to: obj.recipient,
      subject: obj.subject,
      text: obj.text,
      html: obj.html
    }, function (error, info) {
      if (error) {
        return console.log(error);
      }
      //console.log('Message sent: ' + info.response);
    });
  };*/
}
