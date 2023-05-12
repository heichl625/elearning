'use strict'

const mime = require('mime')
const { resolve } = require('path')
const { promises: { readFile } } = require('fs')
const Config = use('Config')

class AssetController {

    async asset({params, response}){
        const assetDirectory = Config.get('client.assetDirectory')
        const assetPath = resolve(assetDirectory, 'static/'+params.name)
        let content;

        try{
            content = await readFile(assetPath)
        }catch(err){
            if(err.code === 'ENOENT'){
                response.status(404).send('Not Found')
                return
            }
            throw err
        }

        const type = mime.getType(assetPath);
        if(type !== null){
            response.type(type)
        }

        response.send(content)
    }

    async media({params, response}){
        const assetDirectory = Config.get('client.assetDirectory')
        const assetPath = resolve(assetDirectory, 'media/'+params.name)

        let content;

        try{
            content = await readFile(assetPath)
        }catch(err){
            if(err.code === 'ENOENT'){
                response.status(404).send('Not Found')
                return
            }
            throw err
        }

        const type = mime.getType(assetPath);

        if(type !== null){
            response.type(type)
        }

        response.send(content)
    }

}

module.exports = AssetController
