import 'zone.js/dist/zone-node'
import 'reflect-metadata'

import * as path                               from 'path'
import * as express                            from 'express'
import * as bodyParser                         from 'body-parser'
import * as cookieParser                       from 'cookie-parser'
import * as morgan                             from 'morgan'
import * as mcache                             from 'memory-cache'
const { gzipSync } = require('zlib');
const accepts = require('accepts');
const { compressSync } = require('iltorb');
const interceptor = require('express-interceptor');

import { enableProdMode }                      from '@angular/core'
import { platformServer, renderModuleFactory } from '@angular/platform-server'

import { ServerAppModuleNgFactory }            from './app/_platform/app.server.module.ngfactory'
import { ngExpressEngine }                     from './modules/ng-express-engine/express-engine'
import { ROUTES }                              from './routes'

import * as api from './backend/api';
import { Tools } from './backend/tools';

let Cookies = require( "cookies" );

declare var Zone: any;

enableProdMode();

const app = express();
const ROOT = path.join(path.resolve(__dirname, '..'));

app.engine('html', ngExpressEngine({
  aot: true,
  bootstrap: ServerAppModuleNgFactory
}));

app.set('port', process.env.PORT || 9002);
app.set('views', __dirname);
app.set('view engine', 'html');
app.set('json spaces', 2);

app.use(cookieParser());
app.use(bodyParser.json());

// language version - !!! MUST BE BEFORE ANY DB CALL !!!
app.use(Tools.countryVersion);

// cookies
app.use(Cookies.express());
app.use(api.sessionidCookie);

// var app = express()
/*
app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});
*/


app.use(interceptor((req, res)=>({
  // don't compress responses with this request header
  isInterceptable: () => (!req.headers['x-no-compression']),
  intercept: ( body, send ) => {
    const encodings  = new Set(accepts(req).encodings());
    const bodyBuffer = new Buffer(body);
    // url specific key for response cache
    const key = '__response__' + req.originalUrl || req.url;
    let output = bodyBuffer;
    // check if cache exists
    if (mcache.get(key) === null) {
      // check for encoding support
      if (encodings.has('br')) {
        // brotli
        res.setHeader('Content-Encoding', 'br');
        output = compressSync(bodyBuffer);
        mcache.put(key, {output, encoding: 'br'});
      } else if (encodings.has('gzip')) {
        // gzip
        res.setHeader('Content-Encoding', 'gzip');
        output = gzipSync(bodyBuffer);
        mcache.put(key, {output, encoding: 'gzip'});
      }
    } else {
      const { output, encoding } = mcache.get(key);
      if(encodings.has(encoding)){
          res.setHeader('Content-Encoding', encoding);
          send(output);
          return;
      }
    }
    send(output);
  }
})));

app.use(morgan('dev'));

function cacheControl(req, res, next) {
  //res.header('Cache-Control', 'max-age=60');
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

app.use(cacheControl, express.static(path.join(ROOT, 'dist/client'), { index: false }));

process.on('uncaughtException', function (err) {
  console.error('Catching uncaught errors to avoid process crash', err);
});

function ngApp(req, res) {

  function onHandleError(parentZoneDelegate, currentZone, targetZone, error)  {
    console.warn('Error in SSR, serving for direct CSR');
    res.sendFile('index.html', { root: './src' });
    return false;
  }

  Zone.current.fork({ name: 'CSR fallback', onHandleError }).run(() => {
    //console.time(`GET: ${req.originalUrl}`);
    res.render('index', {
      req: req,
      res: res,
      //preboot: false, //{ appRoot: ['app'], uglify: true },
      baseUrl: '/',
      requestUrl: req.originalUrl,
      originUrl: req.hostname,
    });
    //console.timeEnd(`GET: ${req.originalUrl}`);
  });

}

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets'), {maxAge: 0}));
app.use('/tools', express.static(path.join(__dirname, '../tools'), {maxAge: 0}));
app.use('/templates', express.static(path.join(__dirname, '../templates'), {maxAge: 0}));
app.use('/images', express.static(path.join(__dirname, '../images'), {maxAge: 0}));
app.use('/examples', express.static(path.join(__dirname, '../examples'), {maxAge: 0}));
app.use('/files', express.static(path.join(__dirname, '../files'), {maxAge: 0}));
app.use('/etim', express.static(path.join(__dirname, '../'), {maxAge: 0}));
app.use(express.static(path.join(ROOT, 'dist/client'), {index: false}));

app.get('/meta', api.metaTags);
app.get('/language', api.language);
app.get('/tryCatch.js.map', function (req, res, next) {res.send('');});
app.get('/web_get_img_data', api.emptyImage);
app.get('/logout', api.logout);
app.post('/login', api.login);
app.get('/xml-export-seznam', api.xmlExportSeznam);
app.get('/xml-export-heureka', api.xmlExportHeureka);
app.get('/sitemap', api.sitemap);
app.get('/partners', api.partnersList);
app.get('/user', api.user);
app.post('/user', api.createUser);
app.put('/user', api.saveUser);
app.post('/user/current', api.saveCurrentUser);
app.get('/user/countries', api.userCountries);

app.get('/cart', api.cart);
app.get('/shipping', api.shipping);
app.get('/shipping/:code', api.shipping);
app.post('/shipping', api.shippingPost);
app.get('/payment', api.payment);
app.get('/payment/:code', api.payment);
app.post('/payment', api.paymentPost);
app.post('/order', api.createOrder);
app.get('/order/verify', api.verifyOrder);
app.post('/coupons', api.addCoupon);
app.delete('/coupons/:code', api.removeCoupon);

app.get('/load-objects/redirect/tryCatch.js.map', function (req, res, next) {next();});
app.get('/load-objects/redirect/:code', api.loadObjects);
app.get('/redirect-navigations/page/:id', api.redirectNavigations);
app.get('/redirect-navigations/product/:code', api.redirectNavigationsProduct);

app.get('/products/:code', api.getProduct);
app.get('/products/:code/configurator/:type', api.getProduct);
app.post('/products/buy', api.productBuy);
app.post('/products/:id/buy', api.productBuy);
app.put('/products', api.productPut);
app.delete('/products/item/:itemId', api.productDelete);
app.get('/products/list/:code', api.productsList);
app.get('/products/list/:code/pagination', api.productsListPagination);
app.get('/products/:id/attachments/type/:type/table/:tableName', api.attachments);
app.get('/products/:id/similar', api.productsSimilar);
app.get('/products/:id/childs', api.productsChilds);
app.get('/products/:id/accessories', api.productsAccessories);

app.get('/filter/:code/type/:type', api.getFilterForList);
app.get('/filter/type/:code', api.getFilterType);
app.get('/cats/:code', api.category);
app.get('/attachments/:id', api.attachment);
app.get('/files/**', api.emptyImage);
app.post('/newsletter/login', api.newsletterLogin);

app.get('/search', api.productsList);
app.get('/search/pagination', api.productsListPagination);
app.get('/search-api/:searchStr', api.search);

app.post('/configurator/cart', api.addToCartFromConfigurator);
app.get('/products/:id/product-list', api.productDataList);
app.get('/products/:id/product-list/pdf', api.productDataListPdf);

app.post('/assist/message', api.assistMessage);
app.post('/lost-password', api.lostPassword);

app.get('/:code', ngApp);
app.get('/:code/search/:searchStr', ngApp);
app.get('/:code/konfigurator/:redirect', ngApp);
app.get('/:code/konfigurator2/:redirect', ngApp);
app.get('/', ngApp);


/*app.get('/', ngApp);
ROUTES.forEach(route => {
  app.get(`/${route}`, ngApp);
  app.get(`/${route}/!*`, ngApp);
});*/

app.get('*', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var pojo = { status: 404, message: 'No Content' };
  var json = JSON.stringify(pojo, null, 2);
  res.status(404).send(json);
});

let server = app.listen(app.get('port'), () => {
  console.log(`Listening at: http://localhost:${server.address().port}`);
});
