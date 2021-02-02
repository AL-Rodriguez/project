require("dotenv").config();

const { getConnection } = require("./db");
const bcrypt = require('bcrypt');
const faker = require("faker");
const { random } = require("lodash");


async function main(){

    let connection;

    try {

        console.log("Connect...");

        connection = await getConnection();

        console.log("Delete Tables");

        await connection.query("DROP TABLE IF EXISTS makers;");
        await connection.query("DROP TABLE IF EXISTS categories;");
        await connection.query("DROP TABLE IF EXISTS request;");
        await connection.query("DROP TABLE IF EXISTS solutions;");
        await connection.query("DROP TABLE IF EXISTS rating;");

        console.log(`Create Table`);

        await connection.query(`CREATE TABLE makers (

            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(50),
            lastName VARCHAR(50),
            email VARCHAR(50)  NOT NULL,
            websiteUrl	VARCHAR(100),
            profileImageUrl	VARCHAR(100),
            aboutMe TINYTEXT,
            username VARCHAR(50) UNIQUE,
            password VARCHAR(128) NOT NULL,
            role ENUM('admin','user') DEFAULT 'user',
            active BOOLEAN DEFAULT false,
            validationCode TINYTEXT,
            passwordCode TINYTEXT,
            lastAuthDate DATETIME,
            updateDate DATETIME,
            creationDate DATETIME

        );`);

        await connection.query(`CREATE TABLE categories (
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            categorie VARCHAR(100) NOT NULL,
            description VARCHAR(200),
            image VARCHAR(300),
            update_date DATETIME,
            creation_date DATETIME
        );`);

        await connection.query(`CREATE TABLE request (
          
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(200)  NOT NULL,
            textRequest TEXT NOT NULL,
            date TIMESTAMP,
            status BOOLEAN DEFAULT FALSE,
            user_id INT UNSIGNED  NOT NULL,
            categorie_id INT UNSIGNED,
            updateDate DATETIME,
            creationDate DATETIME,

            constraint request_user_id_fk1 foreign key (user_id)
                references makers(id),

            constraint request_categorie_id_fk2 foreign key (categorie_id)
                references categories(id)

        );`);

        await connection.query(`CREATE TABLE solutions (
          
            id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            answerText TEXT NOT NULL,
            imageUrl VARCHAR(200),
            answerDate DATETIME NOT NULL,
            request_id INT UNSIGNED NOT NULL,
            user_id INT UNSIGNED,
            update_date DATETIME,
            creation_date DATETIME,

            constraint solutions_user_id_fk1 foreign key (user_id)
                references makers(id),

            constraint solutions_request_id_fk2 foreign key (request_id)
                references request(id)

        );`);


        await connection.query(`CREATE TABLE rating (
            user_id INT UNSIGNED,
            solution_id INT UNSIGNED,
            score INT,            
            update_date DATETIME,
            creation_date DATETIME,

            PRIMARY KEY (user_id, solution_id),
            constraint rating_user_id_fk1 foreign key (user_id)
                references makers(id),

            constraint rating_solution_id_fk2 foreign key (solution_id)
                references solutions(id)

        );`);

        //Admin

        const passwordBcrypt = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, 10);

        await connection.query(
            `
            INSERT INTO makers (name, lastName, email, username, password, role, active, lastAuthDate, updateDate, creationDate)
            VALUES("Alberto", "Rodriguez","alwork@hotmail.es","Admin",
            ?,"admin",true, UTC_TIMESTAMP, UTC_TIMESTAMP, UTC_TIMESTAMP)`,
            [passwordBcrypt]
          );

          //Ghost User for deleted questions

          await connection.query(
              `
              INSERT INTO makers (name, lastName, email, username, password, role, active, lastAuthDate, updateDate, creationDate)
              VALUES("Ghost", "User","alwork@hotmail.es","GhostUser",
              ?,"admin",true, UTC_TIMESTAMP, UTC_TIMESTAMP, UTC_TIMESTAMP)`,
              [passwordBcrypt]
            );
        
          //Random user

          const users = 10;
    
          for (let i = 0; i < users; i++) {

            const name = faker.name.findName();
            const lastName = faker.name.lastName();
            const email = faker.internet.email();
            const websiteUrl = faker.internet.domainName();
            const aboutMe = faker.lorem.sentence();
            const userName = faker.internet.userName();
            const password = faker.internet.password();

            const userPasswordBcrypt = await bcrypt.hash(password, 10);
    
            await connection.query(
              `
              INSERT INTO makers(name, lastName, email,websiteUrl, aboutMe, username, password, active, role, lastAuthDate, updateDate, creationDate)
              VALUES("${name}","${lastName}","${email}","${websiteUrl}","${aboutMe}", "${userName}","${userPasswordBcrypt}", true,
              "user",UTC_TIMESTAMP, UTC_TIMESTAMP,UTC_TIMESTAMP)
              `
            );
          }

        const categories = [
          "PhotoEdition",
          "LogoDesign",
          "Illustration"
        ];
    
        for (let i = 0; i < categories.length; i++) {
          const categoriesName = categories[i]; 
          const description = `${categoriesName} es ${faker.lorem.sentence()}`;
          const imageUrl = faker.system.directoryPath()
          await connection.query(
            `
                INSERT INTO categories(categorie,description,image,update_date,creation_date)
                VALUES("${categoriesName}","${description}","${imageUrl}",UTC_TIMESTAMP,UTC_TIMESTAMP)
                `
          );
        }
        
        const [categoriesId] = await connection.query(`
        SELECT id
        FROM categories;`);

        const categorieId = [];

        for (let i = 0; i < categoriesId.length; i++) {
          categorieId.push(categoriesId[i].id);
        }

        

        const countCategories = categorieId.length

        const [usersId] = await connection.query(`
        SELECT id
        FROM makers;`);

        const userId = [];

        for (let i = 0; i < usersId.length; i++) {
          if (usersId[i].id > 2) {
            userId.push(usersId[i].id);
          }
        }
        const countUsers = userId.length;


        const countRequest = 10;
    
        for (let i = 0; i < countRequest; i++) {
          const title = faker.lorem.sentence();
          const textRequest = faker.lorem.paragraph();
          const randomIdUser = usersId[random(0, countUsers - 1)];
          const randomCategorie = categorieId[random(0, countCategories - 1)];

          await connection.query(`
              INSERT INTO request(title, textRequest, user_id, categorie_id, updateDate, creationDate)
              VALUES("${title}", "${textRequest}", "${randomIdUser.id}","${randomCategorie}", UTC_TIMESTAMP,UTC_TIMESTAMP)
              `);
        }
        const countSolutions = 10;
    
        for (let i = 0; i < countSolutions; i++) {
          const answerText = faker.lorem.sentence();
          const imageUrl = faker.system.directoryPath()
          const randomIdUser = usersId[random(0, countUsers - 1)];
          const randomRequest = random(1, 9);

          await connection.query(`
              INSERT INTO solutions(answerText, answerDate,imageUrl, request_id, user_id, update_date, creation_date)
              VALUES("${answerText}", UTC_TIMESTAMP, "${imageUrl}","${randomRequest}", "${randomIdUser.id}", UTC_TIMESTAMP,UTC_TIMESTAMP)
              `);
        }

        

    }catch (e) {
        console.log('Some error ocurred: ', e)
      } finally {
        if (connection) {
          connection.release();
        }
    
        console.log("OK; close connection");
    
        process.exit();
      }
}

main()