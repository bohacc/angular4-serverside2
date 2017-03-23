var oracle = require('oracledb'),
  Promise = require('promise'),
  fs = require('fs');

import { Connections } from './connections';

export module Oracledb {
  export function select(sql, vals, req, connectData, obj) {
    return new Promise(function (resolve, reject) {
      oracle.fetchAsString = [ oracle.CLOB ];
      // connection instance to database from obj
      if (obj && obj.connection) {
        obj.connection.execute(
          sql,
          vals,
          {
            outFormat: oracle.OBJECT,
            maxRows: 5000
          },
          function (err, result) {
            if (err) {
              console.log(err);
              obj.connection.close(
                function (errRelease) {
                  if (errRelease) {
                    console.log(errRelease);
                    reject(errRelease.message);
                    return;
                  }
                  reject(err.message);
                }
              );
              return;
            }
            if (obj && obj.holdConnect) {
              resolve({connection: obj.connection, result: result});
            } else {
              obj.connection.close(
                function (err) {
                  if (err) {
                    console.log(err);
                    reject(err.message);
                    return;
                  }
                  resolve({connection: {}, result: result});
                }
              );
            }
          }
        );
      } else {
        var connectionObj = connectData || Connections.getConnection(req);
        oracle.getConnection(
          connectionObj,
          function (err, connection) {
            if (err) {
              console.log(err);
              reject(err.message);
              return;
            }
            connection.execute(
              sql,
              vals,
              {
                outFormat: oracle.OBJECT,
                maxRows: 5000
              },
              function (err, result) {
                if (err) {
                  console.log(err);
                  connection.close(
                    function (errRelease) {
                      if (errRelease) {
                        console.log(errRelease);
                        reject(errRelease.message);
                        return;
                      }
                      reject(err.message);
                    }
                  );
                  return;
                }
                if (obj && obj.holdConnect) {
                  resolve({connection: connection, result: result});
                } else {
                  connection.close(
                    function (err) {
                      if (err) {
                        console.log(err);
                        reject(err.message);
                        return;
                      }
                      resolve({connection: {}, result: result});
                    }
                  );
                }
              }
            );
          }
        );
      }
    });
  };

  export function executeSQL(sql, vals, req, connectData, obj) {
    return new Promise(function (resolve, reject) {
      if (obj && obj.connection) {
        obj.connection.execute(
          sql,
          vals,
          {outFormat: oracle.OBJECT},
          function (err, result) {
            if (err) {
              obj.connection.rollback(function (errRollback) {
                if (errRollback) {
                  obj.connection.close(
                    function (errRelease) {
                      if (errRelease) {
                        reject(errRelease.message);
                        return;
                      }
                      reject(errRollback.message);
                    }
                  );
                  return;
                }
                obj.connection.close(
                  function (errRelease) {
                    if (errRelease) {
                      reject(errRelease.message);
                      return;
                    }
                    reject(err.message || errRollback.message || errRelease.message);
                  }
                );
              });
            } else if (obj.rollback) {
              obj.connection.rollback(function (errRollback) {
                if (errRollback) {
                  obj.connection.close(
                    function (errRelease) {
                      if (errRelease) {
                        reject(errRelease.message);
                        return;
                      }
                      reject(errRollback.message);
                    }
                  );
                  return;
                }
                obj.connection.close(
                  function (errRelease) {
                    if (errRelease) {
                      reject(errRelease.message);
                      return;
                    }
                    resolve(errRollback.message || errRelease.message);
                  }
                );
              });
            } else {
              if (obj && obj.commit) {
                obj.connection.commit(function (err) {
                  if (err) {
                    obj.connection.close(
                      function (errRelease) {
                        if (errRelease) {
                          reject(errRelease.message);
                          return;
                        }
                        reject(err.message);
                      }
                    );
                    return;
                  }
                  obj.connection.close(
                    function (errRelease) {
                      if (errRelease) {
                        reject(errRelease.message);
                        return;
                      }
                      resolve({connection: {}, result: result});
                    }
                  );
                });
              } else {
                resolve({connection: obj.connection, result: result});
              }
            }
          }
        );
      } else {
        var connectionObj = connectData || Connections.getConnection(req);
        oracle.getConnection(
          connectionObj,
          function (err, connection) {
            if (err) {
              reject(err.message);
              return;
            }
            connection.execute(
              sql,
              vals,
              {outFormat: oracle.OBJECT},
              function (err, result) {
                if (err) {
                  connection.rollback(function (errRollback) {
                    if (errRollback) {
                      connection.close(
                        function (errRelease) {
                          if (errRelease) {
                            reject(errRelease.message);
                            return;
                          }
                          reject(errRollback.message);
                        }
                      );
                      return;
                    }
                    connection.close(
                      function (errRelease) {
                        if (errRelease) {
                          reject(errRelease.message);
                          return;
                        }
                        reject(err.message || errRollback.message || errRelease.message);
                      }
                    );
                  });
                } else {
                  if (obj && obj.commit) {
                    connection.commit(function (err) {
                      if (err) {
                        connection.close(
                          function (errRelease) {
                            if (errRelease) {
                              reject(errRelease.message);
                              return;
                            }
                            reject(err.message);
                          }
                        );
                        return;
                      }
                      connection.close(
                        function (errRelease) {
                          if (errRelease) {
                            reject(errRelease.message);
                            return;
                          }
                          resolve({connection: {}, result: result});
                        }
                      );
                    });
                  } else {
                    resolve({connection: connection, result: result});
                  }
                }
              }
            );
          }
        );
      }
    });
  };

  export function sendBlob(sql, vals, req, connectData, obj, res) {
    var connectionObj = connectData || Connections.getConnection(req);
    //oracle.lobPrefetchSize = 120000;
    oracle.getConnection(
      connectionObj,
      function (err, connection) {
        if (err) {
          console.log(err);
          return;
        }
        connection.execute(
          sql,
          vals,
          function (err, result) {
            if (err) {
              console.error(err.message);
              return;
            }
            if (result.rows.length === 0) {
              console.log("No results");
              return;
            }

            var lob = result.rows[0][0];
            if (lob === null) {
              console.log("BLOB was NULL");
              return;
            }

            lob.on(
              'end',
              function () {
                //console.log("lob.on 'end' event");
              });

            lob.on(
              'close',
              function () {
                //console.log("lob.on 'close' event");
                connection.release(function (err) {
                  if (err) {
                    console.error(err);
                  }
                });
              });

            lob.on(
              'error',
              function (err) {
                connection.release(function (err) {
                  if (err) {
                    console.error(err);
                  }
                });
                //console.log("lob.on 'error' event");
                console.error(err);
              });

            res.writeHead(200, {
              "Content-Disposition": "attachment;filename=" + (obj.fileName || Math.random()),
              'Content-Type': (obj.mimeType || 'text/plain'),
              'Content-Length': obj.fileLength
            });

            lob.pipe(res);
          });
      }
    );
  }

  export function sendBlob2(sql, vals, req, connectData, obj, res) {
    var connectionObj = connectData || Connections.getConnection(req);
    oracle.getConnection(
      connectionObj,
      function (err, connection) {
        if (err) {
          console.log(err);
          return;
        }
        connection.execute(
          sql,
          vals,
          function (err, result) {
            if (err) {
              console.error(err.message);
              return;
            }
            if (result.rows.length === 0) {
              console.log("No results");
              return;
            }

            var path = 'download/';
            var fileName = path + String(Math.random()) + '.tmp';
            var outStream = fs.createWriteStream(fileName);
            var lob = result.rows[0][0];
            if (lob === null) {
              console.log("BLOB was NULL");
              return;
            }

            lob.on(
              'error',
              function (err) {
                connection.release(function (err) {
                  if (err) {
                    console.error(err);
                  }
                });
                //console.log("lob.on 'error' event");
                console.error(err);
              });

            lob.on(
              'end',
              function () {
                //console.log("lob.on 'end' event");
              });

            lob.on(
              'close',
              function () {
                connection.release(function (err) {
                  if (err) {
                    console.error(err);
                  }
                });
                res.download(fileName, (obj.fileName || Math.random()), function(err){
                  if (err) {
                    console.log(err);
                  }
                  fs.unlink(fileName);
                });
              });

            lob.pipe(outStream);
          });
      }
    );
  }
}
