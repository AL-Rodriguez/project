const {getConnection} = require("../../db/db");
const errorGenerator  = require("../../utils/errors.js");

async function getUser(req, res, next) {

    let connection;

    try {
      connection = await getConnection();

      const { id } = req.params;
  
      const [currentUser] = await connection.query(

        `
        SELECT
          id,
          username,
          name,
          lastName,
          email,
          aboutMe,
          profileImageUrl, 
          role,
          password
        FROM makers WHERE id=? `,
        [id]
      );
  
      if (currentUser.length === 0) {
        throw errorGenerator(
          `EL usuario con el id ${id} no existe`,
          404
        );
      }
  
      const [userInfo] = currentUser;
  
      const userData = {
        id: userInfo.id,
        username: userInfo.username,
        avatar: userInfo.profileImageUrl,
        name: userInfo.name,
      };
   
      res.send({
        status: "ok",
        data: userData,
      })

    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }
  }
  
  module.exports = getUser;