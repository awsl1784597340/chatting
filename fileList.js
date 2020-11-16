const express = require('express');

const router = express.Router();
const multer = require('multer')
const fs = require('fs')
const path = require('path')

let tmpFilename = ''

const upload = multer({ dest: 'upload/' }).any();
router.post('/upload', function (req, res) {
  console.log('---------访问上传路径-------------');

  /** When using the "single"
   data come in "req.file" regardless of the attribute "name". * */
  upload(req, res, function (err) {
    // 添加错误处理
    if (err) {
      console.log(err);
      return;
    }
    const tmpFile = req.files[0];
    const tmpPath = tmpFile.path;
    console.log(tmpPath);

    /** The original name of the uploaded file
     stored in the variable "originalname". * */
    const targetPath = `uploads/${tmpFile.originalname}`;

    tmpFilename = tmpFile.originalname

    /** A better way to copy the uploaded file. * */
    console.log(targetPath);


    if (!fs.existsSync('uploads/')) {
      fs.mkdirSync('uploads/');
    }

    const src = fs.createReadStream(tmpPath);
    const dest = fs.createWriteStream(targetPath);
    src.pipe(dest);
    src.on('end', function () {
      res.end();
    });
    src.on('error', (err) => {
      res.end();
      console.log(err);
    });
  });
});


router.get('/download', function (req, res) {
  const params = req.query.filename
  // let file = null
  // try {
  //   file = `/uploads${params}`;
  //   res.download(file);
  // } catch (e) {
  //   if (tmpFilename) {
  //     file = `/uploads${tmpFilename}`;
  //     res.download(file);
  //   } else res.end()
  // }
  const options = {
    root: path.join(__dirname, 'uploads'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  if (params) {
    res.sendFile(params, options, function (err) {
      if (err) {
        console.log(err)
        res.status(404).end()
      } else {
        console.log('Sent:', params)
        res.end()
      }
    })
  } else {
    res.sendFile(tmpFilename, options, function (err) {
      if (err) {
        console.log(err)
        res.status(500).end()
      } else {
        console.log('Sent:', tmpFilename)
        res.end()
      }
    })
  }
})


module.exports = router;
