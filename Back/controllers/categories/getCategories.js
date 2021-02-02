const {getConnection} = require("../../db/db");


async function getCategories(req, res, next) {

  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(`
    SELECT
        id,
        categorie,
        description,
        image
    FROM categories; 
      `);

    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = getCategories;