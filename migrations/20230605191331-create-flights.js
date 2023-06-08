'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('flights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_maskapai: {
        type: Sequelize.INTEGER
      },
      kode_penerbangan: {
        type: Sequelize.STRING
      },
      id_bandara_asal: {
        type: Sequelize.INTEGER
      },
      id_bandara_tujuan: {
        type: Sequelize.INTEGER
      },
      tanggal_berangkat: {
        type: Sequelize.DATE
      },
      jam_berangkat: {
        type: Sequelize.TIME
      },
      jam_kedatangan: {
        type: Sequelize.TIME
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('flights');
  }
};