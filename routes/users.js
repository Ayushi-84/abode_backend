var express = require("express");
var router = express.Router();
var pool = require("./pool");

/* GET users listing. */
router.get("/all_vendor_properties", function (req, res, next) {
  pool.query("select * from vendorproperties", function (error, result) {
    if (error) {
      return res.status(500).json({ data: [] });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.post("/displayallcities", function (req, res, next) {
  var q =
    "select C.*,(select S.statename from states S where S.stateid=C.stateid) as statename from cities C where C.cityname like '%" +
    req.body.state_city +
    "%'";
  console.log(q);
  pool.query(q, function (error, result) {
    if (error) {
      return res.status(500).json({ status: false, error: error });
    } else {
      return res.status(200).json({ data: result });
    }
  });
});

router.get("/displayallstates", function (req, res, next) {
  pool.query("select * from states", function (error, result) {
    if (error) {
      return res.status(500).json({ status: false, error: error });
    } else {
      return res.status(200).json({ status: true, data: result });
    }
  });
});

module.exports = router;
