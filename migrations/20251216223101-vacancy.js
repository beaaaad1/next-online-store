// eslint-disable-next-line @typescript-eslint/no-require-imports
const vacancy = require("./mockVacancies.json")

module.exports = {


  async up(db) {
    await db.collection("vacancy").insertMany(vacancy)
  },


};
