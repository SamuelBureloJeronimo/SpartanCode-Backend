const mult = require('multer');
const path = require('path');

const storage = mult.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'temps/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const singleUpload = mult({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|webp/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname));
      file = {ext: path.extname(file.originalname)};
      if(mimetype && extname){
        return cb(null, true);
      }
      cb("Error: La extencion ["+file.ext+"] no es soportada. Solo de acepta: "+filetypes);
    }
  }).single('imagen');

  module.exports = singleUpload;