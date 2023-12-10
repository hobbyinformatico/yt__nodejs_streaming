const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const Auth = require('./auth/Auth');
const Streaming = require('./streaming/Streaming');

const PORT = 4000;


// Serve file statici nella ROOT (es. un sito web)
app.use(express.static(path.join(__dirname, 'public/build')));

// Configurazione richieste CORS (Cross-Origin Resource Sharing)
// valide solo per le richieste ricevute da Web Browser
app.use((req, res, next) => {
    // ***
    //  https://expressjs.com/en/resources/middleware/cors.html
    // ***

    // Header che specifica le sorgenti ammesse per le chiamate da client a server:
    //  '*'                         => tutte
    //  'https://www.section.io'    => solo da 'https://www.section.io'
    //  più valori vanno separati da ","
    res.header(
        'Access-Control-Allow-Origin',
        '*'
    );
    // Header che specifica gli headers ammessi dal client (anche inventati\custom)
    // Se ne mandi uno non in lista => CORS Error
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    // Specifica se il server consentirà l'invio di credenziali (come cookie,
    // autenticazioni HTTP o credenziali client-side) in una richiesta da
    // un'altra origine (dominio).
    // Se "Access-Control-Allow-Credentials" => true, il server autorizza l'invio
    // di credenziali nelle richieste CORS. Questo è utile in scenari in cui si
    // desidera consentire l'accesso a risorse protette o a dati sensibili da
    // un'applicazione web situata su un dominio diverso.
    res.header(
        'Access-Control-Allow-Credentials',
        'false'
    );

    next();
});

// Abilita la ricezione di un body JSON nella POST
app.use(express.json());

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});



// Inizializza il database se non esistesse
Auth.checkInit();

/// Gestione richieste Auth (unico entry point per il modulo Auth)
///     http://localhost:4000/auth/login
///     http://localhost:4000/auth/application/:op
///     http://localhost:4000/auth/user/:op
///
///     :op = ["list", "form_fields", "create", "delete", "update"]
app.post('/auth/*', (req, res) => {
    (async () => {
        const result = await Auth.manager(req.params, req.headers, req.body);
        res.status(result.status).send(result);
    })();
});


/// registro le chiamate per gestire il server di streaming
Streaming.server_streaming(app);
