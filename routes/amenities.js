var express = require('express')
const upload = require('./multer')
var router = express.Router()
var pool = require('./pool')
var fs=require('fs')
router.post('/addamenitiesoptions',upload.single('icon'),function (req, res) {
    console.log(req.body)
    pool.query('insert into amenitiesoptions(amenitiesid,optionname,icon)values(?,?,?)', [req.body.amenitiesid,req.body.optionname,req.file.filename],function(error, result) {
        if (error) {
           
            return res.status(500).json({ status: false, error: error })
        }
        else {
            return res.status(200).json({ status: true })
        }
    })


})

router.get('/displayallamenities_vendor', function (req, res) {
    pool.query("select ao.*, (select amenities from amenities a where a.amenitiesid=ao.amenitiesid ) as an,GROUP_CONCAT(JSON_OBJECT('optionname',ao.optionname,'optionid',ao.optionid,'icon',ao.icon)) as optionlist from amenitiesoptions ao group by ao.amenitiesid", function (error, result) {
        if (error) {
            console.log(error)
            return res.status(500).json({ status: false, error: error })
        }
        else {
            console.log(result)
            return res.status(200).json({ status: true ,data:result})
        }
    })
})



router.get('/displayallamenitiesoptions', function (req, res) {
    pool.query('select ao.*, (select amenities from amenities a where a.amenitiesid=ao.amenitiesid ) as an from amenitiesoptions ao', function (error, result) {
        if (error) {
            return res.status(500).json({ status: false, error: error })
        }
        else {
            return res.status(200).json({ status: true ,data:result})
        }
    })
})

router.post('/updateamenitiesoptionsdata', function (req, res) {
    pool.query('update amenitiesoptions set amenitiesid=?,optionname=? where optionsid=?', [req.body.amenitiesid,req.body.optionname,req.body.optionsid], function (error, result) {
        if (error) {
            return res.status(500).json({ status: false, error: error })
        }
        else {
            return res.status(200).json({ status: true })
        }
    })


})
router.post('/updateamenitiesoptionspicture',upload.single('icon'),function (req, res) {
    pool.query('update amenitiesoptions set icon=? where optionsid=?', [req.file.filename,req.body.optionsid], function (error, result) {
        if (error) {
            return res.status(500).json({ status: false, error: error })
        }
        else {
            fs.unlink('public/images/'+req.body.oldpicture,function(err){
                if(!err){
                    console.log("file deleted successfully");
                } else{
                    console.log(err)
                }
            })
    
            return res.status(200).json({ status: true })
        }
    })
})
    

router.post('/deleteamenitiesoptions', function (req, res) {
    pool.query('delete from amenitiesoptions where optionsid=?', [req.body.optionsid], function (error, result) {
        if (error) {

            return res.status(500).json({ status: false, error: error })
        }
        else {
            
                fs.unlinkSync('public/images/'+req.body.oldpicture)
            
            return res.status(200).json({ status: true })
        }
    })


})



router.post('/addamenities', function (req, res) {
    pool.query('insert into amenities set ?', [req.body], function (error, result) {
        if (error) {
            return res.status(500).json({ status: false, error: error })
        }
        else {
            return res.status(200).json({ status: true })
        }
    })


})
router.get('/displayamenities', function (req, res) {
    pool.query('select * from amenities', function (error, result) {
        if (error) {
            return res.status(500).json({ status: false, error: error })
        }
        else {
            return res.status(200).json({ status: true, data: result })
        }
    })


})
router.post('/updateamenities', function (req, res) {
    pool.query('update amenities set amenities=? where amenitiesid=?', [req.body.amenities,req.body.amenitiesid], function (error, result) {
        if (error) {
            return res.status(500).json({ status: false, error: error })
        }
        else {
            return res.status(200).json({ status: true })
        }
    })


})
router.post('/deleteamenities', function (req, res) {
    pool.query('delete from amenities where amenitiesid=?', [req.body.amenitiesid], function (error, result) {
        if (error) {
            return res.status(500).json({ status: false, error: error })
        }
        else {
            return res.status(200).json({ status: true })
        }
    })


})


module.exports = router;