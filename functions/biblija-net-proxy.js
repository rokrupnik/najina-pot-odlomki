const fetch = require('node-fetch')

exports.handler = async event => {
    let passage = event.queryStringParameters.passage || ''
    passage = encodeURI(passage)

    let statusCode, html;

    try {

        const response = await fetch(`https://www.biblija.net/biblija.cgi?m=${passage}&q=&idq=60&id59=1&pos=0&set=26&l=sl3`);
        html = await response.text();
        statusCode = 200;
    } catch (err) {
        statusCode = err.statusCode || 500;
        html = err.message;
    }

    return {
        statusCode,
        body: html
    }

        



    return {
        statusCode: 200,
        body: `Hello ${passage}!`,
    }
}
