'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')
const fs = use('fs')
const Helpers = use('Helpers')
const FileType = require('file-type');

class Material extends Model {

    static boot() {
        super.boot()

        /**
         * A hook to hash the user password before saving
         * it to the database.
         */
    }

    static async createMaterial(materials, course_id, lesson_id, date) {
        const materialArr = JSON.parse(materials);
        if (materialArr.length > 0) {
            materialArr.forEach(async item => {
                let material = {
                    url: item.url,
                    file_name: item.client_name,
                    lesson_id: lesson_id,
                    course_id: course_id,
                    created_at: date,
                    updated_at: date
                }
                await Database.insert(material).into('materials')
            })
        }
    }

    static async deleteOldMaterial(id) {


        console.log(id)

        let affectedRow = await Database
            .table('materials')
            .where('id', id)
            .delete()

        return affectedRow

    }

    static async getMaterialsByLesson(lesson_id, course_id) {

        let materials = await Database
            .select('*')
            .from('materials')
            .where({ course_id: course_id, lesson_id: lesson_id })

        let materialList = [];

        for (const material of materials) {

            const buffer = await fs.readFileSync(Helpers.appRoot() + material.url)
            const b64 = buffer.toString('base64')
            let mime = await FileType.fromBuffer(buffer);


            let material_url = `data:${mime.mime};base64,${b64}`

            materialList.push({
                ...material,
                url: material_url
            })
        }

        return materialList;

    }
}

module.exports = Material
