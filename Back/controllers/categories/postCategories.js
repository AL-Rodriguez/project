const {getConnection} = require("../../db/db");
const errorGenerator  = require("../../utils/errors.js");
const processImage  = require("../../utils/processImage.js");
const {newCategorieSchema} = require("../../validators/categorieValidation");

async function postCategories(req, res, next) {

  let connection;

  try {

    await newCategorieSchema.validateAsync(req.body);
    
    connection = await getConnection();

    const { categorie, description } = req.body;

    const [currentCategorie] = await connection.query(
      `
    SELECT categorie, image, id
    FROM  categories
    WHERE categorie=?
    `,
      [categorie]
    );

    if (currentCategorie.length > 0) {
      throw errorGenerator(
        `Esta categoría ya existe en base de datos`,
        403
      );
    }

    let categorieImage;

    if (req.files && req.files.image) {

      try {
        
        categorieImage = await processImage(req.files.image);

      } catch (error) {
        throw errorGenerator(`Ha habido un error al procesar la imagen`, 400);
      }
    }

    await connection.query(
      `
      INSERT INTO categories(
        categorie,
        description,
        image,
        update_date,
        creation_date)
        VALUES("${categorie}","${description}","${categorieImage}",UTC_TIMESTAMP,UTC_TIMESTAMP)
      `
    );

    res.send({
      status: "ok",
      message: `Has creado la categoría ${categorie}`,
    });

  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = postCategories;