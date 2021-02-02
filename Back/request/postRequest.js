const {getConnection} = require("../../db/db");
const {requestSchema} = require("../../validators/requestValidation");

async function postRequest(req, res, next) {

  let connection;

  try {
    await requestSchema.validateAsync(req.body);

    connection = await getConnection();

    const { title, textRequest, categorie } = req.body;
    console.log(textRequest)
    const user = req.auth.id;
    

    const [idCategorie] = await connection.query(
      `
    SELECT id
    FROM categories
    WHERE categorie=?`,
      [categorie]
    );
      
    const [result] = await connection.query(
      `INSERT INTO request
        (title, 
        textRequest, 
        date, 
        user_id,
        categorie_id,
        updateDate, creationDate)
        values(?,?,UTC_TIMESTAMP,?,?, UTC_TIMESTAMP, UTC_TIMESTAMP)
      `,
      [title, textRequest, user, idCategorie[0].id]
    );

    res.send({
      status: "ok",
      data: {
        title,
        textRequest,
        categorie,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = postRequest;