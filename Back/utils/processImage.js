const fs = require("fs").promises;
const path = require("path");
const sharp = require("sharp");
const uuid = require("uuid");

const imagesPath = path.join(__dirname, process.env.UPLOAD_DIR);

async function processImage(uploadImage) {
    
    await fs.mkdir(imagesPath, { recursive: true });
  
    
    const image = sharp(uploadImage.data);
  
    
    const imageInfo = await image.metadata();
  
    
    if (imageInfo.width > 1000) {
      image.resize(1000);
    }
  
    
    const imageFileName = `${uuid.v4()}.jpg`;
  
    await image.toFile(path.join(imagesPath, imageFileName));
  
    
    return imageFileName;
  }

module.exports = processImage;
