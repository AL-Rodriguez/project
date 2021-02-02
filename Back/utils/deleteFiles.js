const fs = require("fs").promises;
const path = require("path");


async function deleteFile(uploadFile) {
    await fs.unlink(path.join(imagesPath, uploadFile));
  }

module.exports=deleteFile;