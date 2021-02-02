const {getConnection} = require("../../db/db");
const errorGenerator  = require("../../utils/errors.js");;

async function deleteCategorie(req, res, next) {

  let connection;

  try {

    connection = await getConnection();

    const { categorieId } = req.params;

    const [currentCategorie] = await connection.query(
      `
        SELECT id, categorie
        FROM categories
        WHERE id=?`,
      [categorieId]
    );

    if (currentCategorie.length === 0) {
      throw errorGenerator(
        `La categoría que quieres borrar no existe`,
        400
      );
    }

    const [questionsOfcurrentCategorie] = await connection.query(

      `
    SELECT id
    FROM request
    WHERE categorie_id=?
      `,
      [categorieId]
    );
///Mejor crear categoría varios?
    if (questionsOfcurrentCategorie.length > 0) {
      throw errorGenerator(
        `Hay ${questionsOfcurrentCategorie.length} peticiones asociadas a la categoría ${currentCategorie[0].categorie}. No puedes borrarla`,
        403
      );
    }

    await connection.query(
      `
      DELETE FROM categories
      WHERE id=?
      `,
      [categorieId]
    );

    res.send({
      status: "ok",
      message: `Has borrado la categoría con el id ${categorieId}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release;
  }
}

module.exports = deleteCategorie;