const {getConnection} = require("../../db/db");
const {editUserSchema} = require("../../validators/userValidation");
const errorGenerator  = require("../../utils/errors.js");
const {sendConfirmationMail} = require("../../utils/sendmail.js")
const randomCodeString =require("../../utils/randomCodeString.js");

async function editUser(req, res, next) {
    let connection;
  
    try {

      await editUserSchema.validateAsync(req.body);
  
 
      connection = await getConnection();

      const { id } = req.params;

      const { name, lastName, newUsername, aboutMe, newEmail} = req.body;
  

      if (req.auth.id !== Number(id) && req.auth.role !== "admin") {
        throw errorGenerator(`No tienes permisos para editar`, 403);
      }

      const [currentUser] = await connection.query(
        `
        SELECT id, email, profileImageUrl
        FROM makers
        WHERE id=?
      `,
        [id]
      );


      let userImage;
      let profileImage = false;

      if (req.files && req.files.profileImageUrl) {
        try {
          userImage = await processImage(req.files.avatar);
          profileImage = true;
        } catch (error) {
          throw errorGenerator(
            `No hemos podido cargar la imagen, por favor vuelva a intentarlo`,
            400
          );
        }
      } else {
        userImage = currentUser[0].profileImageUrl;
        profileImage = true;
      }

      let sendMessage = "Usuario actualizado";
      let sqlQuery = `UPDATE makers`;

      const sqlParams = [];

      if (name || lastName || username || aboutMe || email || profileImageUrl) {

        const conditions = [];
  
        if (name) {
          conditions.push(`name=?`);
          sqlParams.push(`${name}`);
        }
  
        if (lastName) {
          conditions.push(`lastName=?`);
          sqlParams.push(`${lastName}`);
        }
  
        if (newUsername) {
          conditions.push(`username=?`);
          sqlParams.push(`${newUsername}`);
        }
  
        if (aboutMe) {
          conditions.push(`aboutMe=?`);
          sqlParams.push(`${aboutMe}`);
        }
  
        // if (email) {
        //   if (email !== currentUser[0].email) {

        //     const [currentEmail] = await connection.query(

        //       `
        //   SELECT id
        //   FROM makers
        //   WHERE email=?
        //   `,
        //       [email]
        //     );
  

        //     if (currentEmail.length > 0) {
        //       throw errorGenerator(
        //         `El email ya existe`,
        //         403
        //       );
        //     }
  

        // const validationCode = randomCodeString(40);

        // sendConfirmationMail(email, `http://${process.env.PUBLIC_DOMAIN}/user/validate/${validationCode}`)
  

////No tengo claro como gestionar esto
  
        if (profileImage) {
          conditions.push(`profileImageUrl=?`);
          sqlParams.push(`${userImage}`);
        }
        conditions.push(`updateDate=UTC_TIMESTAMP`);
        sqlParams.push(Number(id));
  
        sqlQuery = `${sqlQuery} SET ${conditions.join(", ")} WHERE id=?`;
      }
  
      await connection.query(`${sqlQuery}`, sqlParams);
  
      res.send({
        status: "ok",
        message: sendMessage,
      });
    } catch (error) {
      next(error);
    } finally {
      if (connection) connection.release();
    }

}

module.exports = editUser;