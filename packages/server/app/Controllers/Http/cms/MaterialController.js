'use strict'


const Models = use('App/Controllers/Http/ModelController')
const FileType = require('file-type');
const Helpers = use('Helpers')

const fs = require('fs')

class MaterialController {

    async upload({ request, response, session }) {

        const material = request.file('file', {
            size: '5mb'
        })


        try {
            await material.move((Helpers.appRoot() + '/uploads/materials'), {
                name: `material_${new Date().getTime()}_${material.clientName.replace(/ /g, "_")}`
            })

            if (!material.moved()) {
                return response.json({error: material.error().message})
            }

            const buffer = await fs.readFileSync(Helpers.appRoot() + '/uploads/materials/' + material.fileName)
            const b64 = buffer.toString('base64')
            let mime = await FileType.fromBuffer(buffer);


            let material_url = `data:${mime.mime};base64,${b64}`

            return response.json({
                clientName: material.clientName,
                fileName: material.fileName,
                url: material_url
            })
        } catch (err) {
            console.log(err);
        }

        

    }

    async delete({ request, response, session }) {

        const { fileName } = request.all();
        let error;

        fs.unlink(Helpers.appRoot()+ '/upload/materials/'+fileName, (err) => {
            if (err) {
                error = err
            }
        })

        if (error) {
            session.flash({ error: '未能成功刪除教材' })
            return response.json({
                error: error
            })
        }


        return response.json({ message: 'success' })

    }

    async deleteOld({ request, response, session }) {

        let { id } = request.all();

        id = id.split("material_")[1]

        let error;

        let material = await Models.Material.find(id)


        fs.unlink(Helpers.appRoot() + material.url, (err) => {
            if (err) {
                error = err
            }
        })

        try {
            let affectedRow = await Models.Material.deleteOldMaterial(id)

            if (error || affectedRow === 0) {
                session.flash({ error: '未能成功刪除教材' })
                return response.json({
                    error: error
                })
            }
            return response.json({ message: 'success' })

        } catch (err) {
            session.flash({ error: '未能成功刪除教材' })
            return response.json({
                error: err
            })
        }

    }

}

module.exports = MaterialController
