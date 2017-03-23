/*jslint node: true, unparam: true */
'use strict';
import {Tools} from "./tools";
import {Translate} from "./translate";

/**
 * @file html_reports
 * @fileOverview __Server_REST_API_Html_reports
 */

/**
 * @namespace __Server_REST_API_Html_reports
 * @author Martin Boháč
 */

var constants = require('./constants'),
  htmlReports = require('./html_reports'),
  fs = require('fs');

export function getHeader (obj, req) {
  var file = fs.readFileSync(constants.HTML_TEMPLATE_DIRNAME + (obj.TEMPLATE_FILE_HEADER || 'report_header.html'));
  file = htmlReports.prepare(file, obj, req);
  return file;
};

export function getFooter (obj, req) {
  var file = fs.readFileSync(constants.HTML_TEMPLATE_DIRNAME + (obj.TEMPLATE_FILE_FOOTER || 'report_footer.html'));
  file = htmlReports.prepare(file, obj, req);
  return file;
};

export function getRow (arr, req) {
  var rows, file, row;
  rows = '';
  arr.map(function (el, i) {
    if (!file && !el.GROUP) {
      file = fs.readFileSync(constants.HTML_TEMPLATE_DIRNAME + (el.TEMPLATE_FILE || 'report_row.html'));
    }
    row = el.GROUP ? htmlReports.getRowGroup(el, req) : htmlReports.prepare(file, el, req);
    rows += htmlReports.repeater(row, el.REPEATS, req);
  });
  return rows;
};

export function getRowGroup (obj, req) {
  var file = fs.readFileSync(constants.HTML_TEMPLATE_DIRNAME + (obj.TEMPLATE_FILE || 'report_row_group.html'));
  file = htmlReports.prepare(file, obj, req);
  return file;
};

export function getReport (obj, req) {
  var report, items = '';
  if (obj.ITEMS) {
    obj.ITEMS.map(function (el) {
      items += htmlReports.getRow(el.ROWS, req);
    });
  } else {
    items = htmlReports.getRow(obj.ROWS, req);
  }
  report =
    htmlReports.getHeader(obj, req) +
    items +
    htmlReports.getFooter(obj, req);
  // translate
  report = Translate.translateReport(report, req);
  return report;
};

export function report (req, res) {
  var report, obj;
  obj = {
    REPORT_NAME: 'očekávaná výročí',
    REPORT_DATE: '17. března 2016, středa',
    REPORT_DESCRIPTION: 'Výročí přátel a obchodních partnerů očekávaná v příštích dnech.',
    ROWS: [
      {
        GROUP: 1,
        GROUP_NAME: 'Zítra, 18. března 2016'
      },
      {
        PICTURE_ID: 597,
        COMPANY_NAME: 'Profitools, a.s.',
        COMPANY_ROLE: 'ředitel odboru',
        ANNIVERSARY_TYPE: 'narozeniny',
        FIRST_NAME_LAST_NAME: 'Milan Novotný',
        YEARS_OLD: 60,
        DATE_OF_EVENT: '18. března 1956',
        TEMPLATE_FILE: 'report_row_anniversary.html'
      }
    ],
    REPORT_FOR_USER: 'Lenka Nováková'
  };
  report = htmlReports.getReport(obj);
  res.send(report);
};

export function prepare (file, obj, req) {
  var regex, str, key, cond;
  str = String(file);
  for (key in obj) {
    if (obj[key] !== undefined) {
      cond = Tools.escapeRegExp('@@' + key + '@@');
      regex = new RegExp(cond, 'g');
      // replace with translate value
      str = str.replace(regex, Translate.translate(String((obj[key] || '')), req));
    }
  }
  return str;
};

export function repeater (content, arr, req) {
  var result = content, contentRow, prefixBegin, prefixEnd, section, sufix, len;
  sufix = constants.AT + constants.AT;
  prefixBegin = constants.AT + constants.AT + constants.HTML_REPORT.BEGIN_REPEAT_SECTION;
  prefixEnd = constants.AT + constants.AT + constants.HTML_REPORT.END_REPEAT_SECTION;
  if (arr && arr.length > 0) {
    arr.map(function (el) {
      contentRow = content.substring(
        content.indexOf(prefixBegin + el.NAME + sufix)  + (prefixBegin + el.NAME + sufix).length,
        content.indexOf(prefixEnd + el.NAME + sufix)
      );
      el.ROWS.map(function (elr, i) {
        section = htmlReports.prepare(contentRow, elr, req);
        // REPLACE
        if (i === 0) {
          len = result.indexOf(prefixBegin + el.NAME + sufix) + (prefixBegin + el.NAME + sufix).length;
        } else {
          len = result.indexOf(prefixEnd + el.NAME + sufix);
        }
        result = result.substring(0, len) +
          section +
          result.substr(result.indexOf(prefixEnd + el.NAME + sufix));
      });
      result = result.replace(prefixBegin + el.NAME + sufix, '');
      result = result.replace(prefixEnd + el.NAME + sufix, '');
    });
  }
  return result;
};
