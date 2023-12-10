const sqlite3 = require('sqlite3').verbose();


var connection = null;

/// --------------------------- Base ---------------------------
/// Base: Apri connessione verso il database
function open() {
    if (connection == null) {
        connection = new sqlite3.Database('auth.db');
    }
}

/// Base: Chiudi connessione con il database
function close() {
    if (connection != null) {
        connection.close((err) => {
            if (err) {
                reject(err);
            }
        });
    }
}

/// Base: Avvia query (READ)
async function queryGetAll(queryStr, params = null) {
    /*
        - 'SELECT * FROM mytable'
    */
    open();

    return new Promise((resolve, reject) => {
        const lambda = (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        };

        if (params != null) {
            connection.all(queryStr, params, lambda);
        }
        else {
            connection.all(queryStr, lambda);
        }
    });
}

/// Base: Avvia query (non READ)
async function queryRun(queryStr, params = null) {
    /*
        - 'CREATE TABLE IF NOT EXISTS mytable (id INT, name TEXT)'
        - 'INSERT INTO mytable (id, name) VALUES (?, ?)'        [id, name]
        - 'UPDATE mytable SET name = ? WHERE id = ?'            [newName, id]
        - 'DELETE FROM mytable WHERE id = ?'                    [id]
    */
    open();

    return new Promise((resolve, reject) => {

        const fun = function (err) {
            if (err) {
                console.log(err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        }

        if (params != null) {
            connection.run(queryStr, params, fun);
        }
        else {
            connection.run(queryStr, fun);
        }
    });
}



module.exports = {
    open: open,
    close: close,
    queryGetAll: queryGetAll,
    queryRun: queryRun,
}