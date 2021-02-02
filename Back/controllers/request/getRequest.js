const {getConnection} = require("../../db/db");
const errorGenerator  = require("../../utils/errors.js");
const {dateTransform,formatDate}   = require("../../utils/dates.js");
const {filterRequestSchema} = require("../../validators/requestValidation");


async function getRequest(req, res, next) {

    let connection;

    try {

      connection = await getConnection();
  
      await filterRequestSchema.validateAsync(req.query);
  
      const {
        name,
        search,
        order,
        categorie,
        creationDate,
        updateDate,
        status,
      } = req.query;
  

      let statusValue;

      if (status === "true" || status === "1") {
        statusValue = 1;
      } else if (status === "false" || status === "0") {
        statusValue = 0;
      }

      let orderValue;
      if (!order) {
        orderValue = `DESC`;
      } else {
        orderValue = order;
      }
  
      let orderBy = `ORDER BY R.date ${orderValue}`;
  
      let sqlQuery = `

      SELECT 
          R.id, 
          R.title, 
          R.textRequest, 
          R.date, 
          R.status,
          M.id AS 'idUser',
          COALESCE(M.name, M.username) AS 'nameUser', 
          M.profileImageUrl, 
          C.id AS 'idCategories',
          C.categorie
      FROM request R
      INNER JOIN makers M ON R.user_id=M.id 
      INNER JOIN categories C ON R.categorie_id=C.id`;
  
      const sqlParams = [];
  
      if (name || search || categorie || creationDate || updateDate || status) {
        const conditions = [];
  
        if (name) {
          conditions.push(`M.name LIKE ?`);
          sqlParams.push(`%${name}%`);
        }
  
        if (search) {
          conditions.push(`R.title LIKE ? OR R.textRequest LIKE ?`);
          sqlParams.push(`%${search}%`);
          sqlParams.push(`%${search}%`);
        }
  
        if (categorie) {
          conditions.push(`C.categorie=?`);
          sqlParams.push(`${categorie}`);
        }
  
        if (creationDate || updateDate) {
          conditions.push(`R.date >= ? AND R.date <= ?`);
          sqlParams.push(dateTransform(creationDate));
          sqlParams.push(dateTransform(updateDate));
        }
  
        if (status) {
          conditions.push(`R.status=?`);
          sqlParams.push(statusValue);
        }
  
        sqlQuery = `${sqlQuery} WHERE ${conditions.join(" AND ")} `;
      }
  
      const [queryResult] = await connection.query(
        `${sqlQuery} ${orderBy}`,
        sqlParams
      );
  
      if (queryResult.length === 0) {
        throw errorGenerator(
          `No hay resultados que coincidentes`,
          400
        );
      } else {

        for (const [i, request] of queryResult.entries()) {
          if (request.status === 1) {
            const [answer] = await connection.query(
              `
        SELECT COUNT(id) AS 'count'
        FROM solutions
        WHERE request_id=?
        `,
              [request.id]
            );
            queryResult[i].answers = answer[0].count;
          } else {
            queryResult[i].answers = 0;
          }
        }
      }
  
      res.send({
        status: "ok",
        data: queryResult,
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }
  
  module.exports = getRequest;
