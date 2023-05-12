'use strict'

const mime = require('mime');
const { resolve } = require('path');
const { promises: {readFile} } = require('fs')

const Config = use('Config');

class HomeController {

    async home({params, response, view}){

        const assetDirectory = Config.get('client.assetDirectory');
        let pagePath;

        if(params.page){
            pagePath = resolve(assetDirectory, params.page);

        }else{
            pagePath = resolve(assetDirectory, 'index.html')
        }
        

        const content = await readFile(pagePath);

        const type = mime.getType(pagePath);
        if(type !== null){
            response.type(type)
        }
        response.clearCookie('XSRF-TOKEN');
        response.send(content);

    }

}

module.exports = HomeController
