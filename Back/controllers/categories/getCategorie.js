const {getConnection} = require("../../db/db");
const errorGenerator  = require("../../utils/errors.js");

async function getCategorie(req, res, next) {

    let connection;

    try {
      connection = await getConnection();

      const { id } = req.params;
  
      const [currentCategorie] = await connection.query(
        `
        SELECT
          id,
          categorie,
          description,
          image
        FROM categories WHERE id=? `,
        [id]
      );
  
      if (currentCategorie.length === 0) {
        throw errorGenerator(
          `LA categoría con id ${id} no existe`,
          404
        );
      }
////Faltan Join en función del front  
      const [categorieInfo] = currentCategorie;
  
      const categorieData = {
        id: categorieInfo.id,
        categorie: categorieInfo.categorie,
        description: categorieInfo.description,
        image: categorieInfo.image,
      };
   
      res.send({
        status: "ok",
        data: categorieData,
      })

    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }
  
  module.exports = getCategorie;