// models/Profile.js
const pool = require('../config/database');

class Profile {
  static async createOrUpdate(userId, profileData) {
    const { firstName, lastName, phone, address, company, position, bio, profileImage } = profileData;
    
    // Check if profile exists
    const existingProfile = await pool.query(
      'SELECT id FROM profiles WHERE user_id = $1',
      [userId]
    );

    if (existingProfile.rows.length > 0) {
      // Update existing profile
      const result = await pool.query(
        `UPDATE profiles SET 
         first_name = $1, last_name = $2, phone = $3, address = $4, 
         company = $5, position = $6, bio = $7, profile_image = $8,
         updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = $9 RETURNING *`,
        [firstName, lastName, phone, address, company, position, bio, profileImage, userId]
      );
      return result.rows[0];
    } else {
      // Create new profile
      const result = await pool.query(
        `INSERT INTO profiles 
         (user_id, first_name, last_name, phone, address, company, position, bio, profile_image) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [userId, firstName, lastName, phone, address, company, position, bio, profileImage]
      );
      return result.rows[0];
    }
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      `SELECT p.*, u.email 
       FROM profiles p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  static async getPublicProfile(userId) {
    const result = await pool.query(
      `SELECT first_name, last_name, phone, address, company, position, bio, profile_image 
       FROM profiles WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }
}

module.exports = Profile;