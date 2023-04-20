var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require("./multer")
var fs=require("fs")

router.post('/addnewcity',upload.single('picture'),function(req, res, next) {
    pool.query("insert into cities(stateid,cityname,picture)values(?,?,?)",[req.body.stateid,req.body.cityname,req.ufilename],function(error,result)
    {
  if(error)
  { 
      return res.status(500).json({status:false,error:error})
  }
  else{
      return res.status(200).json({status:true})
  }
  
    })
  });

  router.post('/updatecity', function(req, res, next) {
    pool.query("update cities set stateid=?,cityname=? where cityid=?",[req.body.stateid,req.body.cityname,req.body.cityid],function(error,result)
    {
  if(error)
  { 
      return res.status(500).json({status:false,error:error})
  }
  else{
      return res.status(200).json({status:true})
  }
  
    })
  });

  router.post('/updatecitypicture',upload.single('picture'), function(req, res, next) {
    pool.query("update cities set picture=? where cityid=?",[req.file.originalname,req.body.cityid],function(error,result)
    {
  if(error)
  { 
      return res.status(500).json({status:false,error:error})
  }
  else{
    fs.unlinkSync('d:/abodebackend/public/images/'+req.body.oldpicture)
      return res.status(200).json({status:true})
  }
  
    })
  });
  
  router.post('/deletecity', function(req, res, next) {
    pool.query("delete from cities where cityid=?",[req.body.cityid],function(error,result)
    {
  if(error)
  { 
      return res.status(500).json({status:false,error:error})
  }
  else{
      return res.status(200).json({status:true})
  }
  
    })
  });
  
  router.get('/displayallcities', function(req, res, next) {
  
    pool.query("select C.*,(select S.statename from states S where S.stateid=C.stateid) as statename from cities C",function(error,result)
    {
  if(error)
  { 
      return res.status(500).json({status:false,error:error})
  }
  else{
      return res.status(200).json({data:result})
  }
  
    })
  });
  
  module.exports = router;