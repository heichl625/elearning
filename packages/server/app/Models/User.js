'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')
const Encryption = use('Encryption')

class User extends Model {
  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }

  static async register(data, now) {

    const encryptedPassword = Encryption.encrypt(data.password);

    const userData = {
      ...data,
      password: encryptedPassword,
      created_at: now,
      updated_at: now
    }

    const id = await Database
      .insert(userData)
      .into('users')

    await Database
      .insert({
        user_id: id,
        created_at: now,
        updated_at: now
      })
      .into('users_interests')

    await Database
      .insert({
        user_id: id,
        created_at: now,
        updated_at: now
      })
      .into('users_promo_settings')

    return id;

  }

  static async get(id) {

    const user = await Database
      .select('*')
      .from('users')
      .where('id', id)
      .whereNull('deleted_at')

    return user;
  }

  static async getUserByEmail(email) {

    const user = await Database
      .select('*')
      .from('users')
      .where('email', email)
      .whereNull('deleted_at')
      .first()

    return user;

  }

  static async getUserByUsername(username) {

    const user = await Database
      .select('*')
      .from('users')
      .where('username', username)
      .whereNull('deleted_at')
      .first()

    return user;

  }

  static async update(data, userId, now) {

    const { phone, gender, first_name, last_name, birthday_month, education_level, occupation, monthly_income, living_area, ...additionData } = data;
    const { invest, home_ownership, marketing, business_management, career, health, education, travel, other_interest, interested_tutor, ...promoSetting } = additionData;

    const userAffectedRow = await Database
      .table('users')
      .where('id', userId)
      .update({
        phone: phone,
        gender: gender,
        first_name: first_name,
        last_name: last_name,
        birthday_month: birthday_month,
        education_level: education_level,
        occupation: occupation,
        monthly_income: monthly_income,
        living_area: living_area,
        updated_at: now
      })
    
      const interestAffectedRow = await Database
        .table('users_interests')
        .where('user_id', userId)
        .update({
          invest: invest,
          home_ownership: home_ownership,
          marketing: marketing,
          business_management: business_management,
          career: career,
          health: health,
          education: education,
          travel: travel,
          other_interest: other_interest,
          interested_tutor: interested_tutor
        })

      const promo_settingAffectedRow = await Database
        .table('users_promo_settings')
        .where('user_id', userId)
        .update(promoSetting) 

      return await Database
        .select('*')
        .from('users')
        .where('id', userId)
        .whereNull('deleted_at')
    

  }

}

module.exports = User
