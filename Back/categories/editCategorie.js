const {getConnection} = require("../../db/db");
const errorGenerator  = require("../../utils/errors.js");
const processImage  = require("../../utils/processImage.js");
const {editCategorieSchema} = require("../../validators/categorieValidation");
const { send } = require("@sendgrid/mail");

async function editCategorie(req, res, next) {

  let connection;

  try {

    await editCategorieSchema.validateAsync(req.body);

    connection = await getConnection();

    const { CategorieId } = req.params;

    const { name, description } = req.body;

    const [currentCategorie] = await connection.query(
      `
      SELECT id,
      categorie,
      description,
      image
      FROM categories
      WHERE id=?`,
      [CategorieId]
    );

    if (currentCategorie.length === 0) {
      throw errorGenerator(
        `La categoría no existe`,
        400
      );
    }

    let categorieImage;
    let imageStatus;
  
    if (req.files && req.files.image) {
      try {
        //procesar y guardar la imagen
        categorieImage = await processImage(req.files.image);
        imageStatus = true;
      } catch (error) {
        throw errorGenerator(`Ha habido un error al procesar la imagen`, 400);
      }
    } else {
      imageStatus = false;
    }

    let sqlQuery = "UPDATE categories";
    let params = [];

    if (description || name || imageStatus) {
      const conditions = [];

      if (description) {
        conditions.push(`description=?`);
        params.push(`${description}`);
      }

      if (name) {
        conditions.push("categorie=?");
        params.push(`${name}`);
      }

      if (imageStatus) {
        conditions.push(`image=?`);
        params.push(`${categorieImage}`);
      }
      conditions.push(`update_date=UTC_TIMESTAMP`);
      params.push(CategorieId);

      sqlQuery = `${sqlQuery} SET ${conditions.join(", ")} WHERE id=?`;
    } else {
      sqlQuery = `UPDATE categories
      SET categorie=?,
      description=?,
      image=?,
      update_date=UTC_TIMESTAMP
      WHERE ID=?
      `;
      params = [
        `${currentCategorie[0].name}`,
        `${currentCategorie[0].description}`,
        `${currentCategorie[0].image}`,
        CategorieId,
      ];
    }

    await connection.query(sqlQuery, params);

    res.send({
      status: "ok",
      message: `Has editado la categoria ${name}`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release;
  }
}

module.exports = editCategorie;