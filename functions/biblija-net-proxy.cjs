const fetch = require('node-fetch')

exports.handler = async event => {
    let passage = event.queryStringParameters.passage || ''
    passage = encodeURI(passage)

    let statusCode, html;

    try {

        const response = await fetch(`https://www.biblija.net/biblija.cgi?m=${passage}&q=&idq=60&id59=1&pos=0&set=26&l=sl3`);
        
        // Decode text, since the response uses windows-1250 encoding
        // See: https://stackoverflow.com/a/66125431/4819453
        const htmlBuffer = await response.text();
        const decoder = new TextDecoder('windows-1250');
        html = decoder.decode(htmlBuffer);
        statusCode = 200;
    } catch (err) {
        statusCode = err.statusCode || 500;
        html = err.message;
    }

    return {
        statusCode,
        body: html
    }
}
