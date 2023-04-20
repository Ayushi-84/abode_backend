var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
var fs = require("fs");

/* GET home page. */

router.post("/addnewcity", upload.single("picture"), function (req, res, next) {
  console.log(req.file);
  pool.query(
    "insert into cities(stateid,cityname,picture)values(?,?,?)",
    [req.body.stateid, req.body.cityname, req.ufilename],
    function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, error: error });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/addnewstates", upload.single("icon"), function (req, res) {
  pool.query(
    "insert into states (statename,icon) values (?,?)",
    [req.body.statename, req.file.filename],
    function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, error: error });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/updatestate", function (req, res, next) {
  console.log(req.body);
  pool.query(
    "update states set statename=? where stateid=?",
    [req.body.statename, req.body.stateid],
    function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, error: error });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/updatestatepicture", upload.single("icon"), function (req, res) {
  pool.query(
    "update states set icon=? where stateid=?",
    [req.file.filename, req.body.stateid],
    function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, error: error });
      } else {
        fs.unlink("public/images/" + req.body.oldpicture, function (err) {
          if (!err) {
            console.log("file deleted successfully");
          } else {
            console.log(err);
          }
        });
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/deletestate", function (req, res, next) {
  console.log(req.body);
  pool.query(
    "delete from  states where stateid=?",
    [req.body.stateid],
    function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, error: error });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/deletecity", function (req, res, next) {
  console.log(req.body);
  pool.query(
    "delete from  cities where cityid=?",
    [req.body.cityid],
    function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, error: error });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.get("/displayallstates", function (req, res, next) {
  pool.query("select * from states", function (error, result) {
    if (error) {
      return res.status(500).json({ status: false, error: error });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.get("/displayallcities", function (req, res, next) {
  pool.query(
    "select C.*,(select S.statename from states S where S.stateid=C.stateid) as statename from cities C",
    function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, error: error });
      } else {
        return res.status(200).json({ data: result });
      }
    }
  );
});

router.post("/updatecity", function (req, res, next) {
  console.log(req.body);
  pool.query(
    "update cities set stateid=?,cityname=? where cityid=?",
    [req.body.stateid, req.body.cityname, req.body.cityid],
    function (error, result) {
      if (error) {
        return res.status(500).json({ status: false, error: error });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post(
  "/updatecitypicture",
  upload.single("picture"),
  function (req, res, next) {
    console.log(req.body);
    pool.query(
      "update cities set picture=?where cityid=?",
      [req.file.originalname, req.body.cityid],
      function (error, result) {
        if (error) {
          return res.status(500).json({ status: false, error: error });
        } else {
          fs.unlinkSync("e:/abodebackend/public/images/" + req.body.oldpicture);
          return res.status(200).json({ status: true });
        }
      }
    );
  }
);

module.exports = router;
