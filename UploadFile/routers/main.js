var express  = require('express');
var router   = express.Router();
var multer   = require('multer'); // 1
var ncp = require('copy-paste')
var storage  = multer.diskStorage({ // 2
  destination(req, file, cb) {
    cb(null, 'uploadedFiles/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});
var upload = multer({ dest: 'uploadedFiles/' }); // 3-1
var uploadWithOriginalFilename = multer({ storage: storage }); // 3-2

router.get('/', function(req,res){
  res.render('upload');
});

router.post('/uploadFileWithOriginalFilename', uploadWithOriginalFilename.single('attachment'), function(req,res){ // 5
  res.render('confirmation', { file:req.file, files:null, stringweb: 'https://cdn.jserv.xyz/uploads/'+req.file.filename});
});

module.exports = router;