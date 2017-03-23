var Constants = require('./constants');

export module Connections {
  export function getConnection (req) {
    let connections: Array<any>, countryConnection: any;

    connections = [
      {
        code: Constants.CZECH_COUNTRY_CODE,
        connection: {
          user: 'mcled_website_v3',
          password: 'Slepic12',
          database: '',
          hostname: '',
          port: 1521,
          clientDB: '',
          connectString: (process.env.APP_CONNECT_STRING || 'mail.schmachtl.cz/notia'),
          meta: {}
        }
      },
      {
        code: Constants.AUT_COUNTRY_CODE,
        connection: {
          user: 'mcled_website_v3_at',
          password: 'Slepic12',
          database: '',
          hostname: '',
          port: 1521,
          clientDB: '',
          connectString: (process.env.APP_CONNECT_STRING || 'mail.schmachtl.cz/notia'),
          meta: {}
        }
      },
    ];

    if (req.countryVersion) {
      countryConnection = connections.filter(function (el) {
        return el.code === req.countryVersion.toUpperCase();
      })[0];
    } else {
      console.log('req.countryVersion is not set!');
      countryConnection = connections[0];
    }

    return countryConnection.connection;
  }
}
