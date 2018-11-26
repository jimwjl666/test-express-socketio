var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads' })
var fs = require("fs");//操作文件
/* GET home page. */
router.post('/upload', upload.single('file'),function(req, res) {
    const file = req.file;
    console.log('文件类型：%s', file.mimetype);
    console.log('原始文件名：%s', file.originalname);
    console.log('文件大小：%s', file.size);
    console.log('文件保存路径：%s', file.path);
    console.log('file',JSON.stringify(file))
    fs.rename(file.path, "uploads/" + file.originalname, function(err) {
        if (err) {
            throw err;
        }
        console.log('上传成功!');
    })

    res.json({status:'ok'});
});
router.get('/upload',function (req,res) {
    res.send('数据')
})

module.exports = router;
