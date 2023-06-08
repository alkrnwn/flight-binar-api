'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          username: 'binarian',
          password: await bcrypt.hash('binarian123', 10), //setup with bcrypt encrypt
          nama_lengkap: 'Binarian',
          alamat: 'Jl. Kemana mana',
          email: 'binarian@gmail.com',
          nomor_telepon: '0878965423013',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
