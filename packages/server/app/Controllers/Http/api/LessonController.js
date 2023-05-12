'use strict'

const Models = use('App/Controllers/Http/ModelController');
const FileType = require('file-type');
const Helpers = use('Helpers')

const fs = require('fs')

class LessonController {


    async downloadMaterial({request, response}){

        let { id } = request.all();

        try{
            let material = await Models.Material
                .query()
                .where('id', id)
                .whereNull('deleted_at')
                .first()

                const buffer = await fs.readFileSync(Helpers.appRoot() + material.url)
                const b64 = buffer.toString('base64')
                let mime = await FileType.fromBuffer(buffer);
        
        
                let material_url = `data:${mime.mime};base64,${b64}`;

                return response.json({
                    url: material_url,
                    file_name: material.file_name
                })
        }catch(err){
            console.log(err);
            return response.json({error: err})
        }

    }
}

module.exports = LessonController
