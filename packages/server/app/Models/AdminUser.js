/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')
const Encryption = use('Encryption')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')


class AdminUser extends Model {
    static boot(){
        super.boot()

        // this.addTrait('SoftDelete')
        // this.addTrait("@provider:Lucid/UpdateOrCreate")
        this.addHook('beforeSave', async (userInstance) => {
            if (userInstance.dirty.password) {
              userInstance.password = await Hash.make(userInstance.password)
            }
          })
    }

    

    static get table() {
        return 'admin_users'
    }
    static get incrementing() {
        return true
    }
    static get hidden() {
        return ['created_at', 'updated_at', 'deleted_at']
    }
    

    static async getUserByEmail(email){

        const results = await Database.select('*').from('admin_users').where('email', email)

        return results;

    }

    // static async register(userData){

    //     const encryptedPassword = Encryption.encrypt(userData.password);


    //     const results = await Database.insert({
    //         ...userData,
    //         password: encryptedPassword
    //     }).into('admin_users');

    //     return results;

    // }
}

module.exports = AdminUser