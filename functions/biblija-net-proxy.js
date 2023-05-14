exports.handler = async event => {
    const passage = event.queryStringParameters.passage || 'World'

    

    return {
        statusCode: 200,
        body: `Hello ${passage}!`,
    }
}