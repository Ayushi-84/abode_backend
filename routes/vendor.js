var express = require("express");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");

router.post("/addvendors", function (req, res, next) {
  console.log("in this", req.body);
  // var q=;
  pool.query("insert into vendor set ?", [req.body], function (error, result) {
    if (error) {
      console.log(error);
      return res.status(500).json({ status: false, error: error });
    } else {
      pool.query(
        "insert into vendorproperties(emailid,mobileno,propertyid,subpropertyid,propertystatus,address,placeoffer,amenities,pictures,placedescription,title,price,offerprice)values(?,?,?,?,?,?,?,?,?,?,?,?,?) ",
        [
          req.body.emailid,
          req.body.mobileno,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
        function (error, result) {}
      );
      return res.status(200).json({ status: true });
    }
  });
});

router.post("/search_vendor_mobileno", function (req, res, next) {
  pool.query(
    "select * from vendor where mobileno=?",
    [req.body.mobileno],
    function (error, result) {
      if (error) {
        console.log(error)
        res.status(500).json({ status: false });
      } else {
        
        if (result.length == 0) { 
          console.log("status false")
          res.status(200).json({ status: false });
        } else {
          console.log("status true")
          res.status(200).json({ status:true,data:result[0]});
        }
      }
    }
  );
});

router.get("/displayallvendors", function (req, res) {
  pool.query("select * from vendor", function (error, result) {
    if (error) {
      return res.status(500).json({ status: false });
    } else {
      console.log(result);
      return res.status(200).json({ status: true, data: result });
    }
  });
});

// update vendors

router.post("/updatevendors", function (req, res, next) {
  console.log("in this", req.body);
  // var q=;
  pool.query(
    "update vendor set firstname=?,lastname=?,dob=?,emailid=?,mobileno=? where emailid=?",
    [
      req.body.firstname,
      req.body.lastname,
      req.body.dob,
      req.body.emailid,
      req.body.mobileno,
      req.body.oldemailid,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

router.post("/deletevendors", function (req, res, next) {
  console.log("in this", req.body);
  // var q=;
  pool.query(
    "delete from vendor where emailid=?",
    [req.body.emailid],
    function (error, result) {
      if (error) {
        console.log(error);
        return res.status(500).json({ status: false, error: error });
      } else {
        return res.status(200).json({ status: true });
      }
    }
  );
});

//search vendor property by emailid/mobileno

router.post("/search_vendor_property", function (req, res, next) {
  pool.query(
    "select * from vendorproperties where mobileno=?",
    [req.body.mobileno],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false });
      } else {
        if (result.length == 0) {
          res.status(200).json({ status: false });
        } else {
          res.status(200).json({ status: true, data: result[0] });
        }
      }
    }
  );
});

router.post(
  "/update_vendor_properties_picture",
  upload.any(),
  function (req, res) {
    console.log("BODY:", req.body);
    console.log("FILE:", req.files);
    var oldpicture = JSON.parse(req.body.oldpicture);

    var temp = {};
    var i = 0;
    req.files.map((item, index) => {
      temp[i] = item.filename;
      i++;
    });
    console.log("temp one:", temp);
    console.log("OLD:", oldpicture);

    console.log("length:", Object.keys(oldpicture).length);
    if (Object.keys(oldpicture).length > 0) {
      Object.values(oldpicture).map((item) => {
        console.log(i + "]:" + item);
        temp[i] = item;
        i++;
      });
    }
    console.log("temp two:", temp);

    pool.query(
      "update vendorproperties set pictures=? where mobileno=?",
      [JSON.stringify(temp), req.body.mobileno],
      function (error, result) {
        if (error) {
          console.log("Error:", error);
          return res.status(500).json({ status: false });
        } else {
          return res.status(200).json({ status: true });
        }
      }
    );
  }
);

router.post("/update_vendor_properties", function (req, res) {
  var option = req.body.opr;
  switch (option) {
    case "ADD_VENDOR_PROPERTIES":
      pool.query(
        "update vendorproperties set propertyid=? where mobileno=?",
        [req.body.propertyid, req.body.mobileno],
        function (error, result) {
          if (error) {
            return res.status(500).json({ status: false });
          } else {
            return res.status(200).json({ status: true });
          }
        }
      );
      break;

    case "ADD_VENDOR_SUBPROPERTIES":
      pool.query(
        "update vendorproperties set subpropertyid=? where mobileno=?",
        [req.body.subpropertyid, req.body.mobileno],
        function (error, result) {
          if (error) {
            return res.status(500).json({ status: false });
          } else {
            return res.status(200).json({ status: true });
          }
        }
      );
      break;

    case "ADD_VENDOR_PROPERTY_STATUS":
      pool.query(
        "update vendorproperties set propertystatus=? where mobileno=?",
        [req.body.propertystatus, req.body.mobileno],
        function (error, result) {
          if (error) {
            return res.status(500).json({ status: false });
          } else {
            return res.status(200).json({ status: true });
          }
        }
      );
      break;

    case "ADD_VENDOR_ADDRESS":
      pool.query(
        "update vendorproperties set address=? where mobileno=?",
        [req.body.address, req.body.mobileno],
        function (error, result) {
          if (error) {
            console.log(error);
            return res.status(500).json({ status: false });
          } else {
            return res.status(200).json({ status: true });
          }
        }
      );
      break;
    case "ADD_VENDOR_PLACEOFFER":
      pool.query(
        "update vendorproperties set placeoffer=? where mobileno=?",
        [req.body.placeoffer, req.body.mobileno],
        function (error, result) {
          if (error) {
            console.log(error);
            return res.status(500).json({ status: false });
          } else {
            return res.status(200).json({ status: true });
          }
        }
      );
      break;

    case "ADD_VENDOR_AMENITIES":
      pool.query(
        "update vendorproperties set amenities=? where mobileno=?",
        [req.body.amenities, req.body.mobileno],
        function (error, result) {
          if (error) {
            console.log(error);
            return res.status(500).json({ status: false });
          } else {
            return res.status(200).json({ status: true });
          }
        }
      );
      break;

    case "ADD_VENDOR_EXTRA_DETAILS":
      pool.query(
        "update vendorproperties set placedescription=?,title=?,price=?,offerprice=?,status='completed' where mobileno=?",
        [
          req.body.placedescription,
          req.body.title,
          req.body.price,
          req.body.offerprice,
          req.body.mobileno,
        ],
        function (error, result) {
          if (error) {
            console.log(error);
            return res.status(500).json({ status: false });
          } else {
            return res.status(200).json({ status: true });
          }
        }
      );
      break;
  }
});

module.exports = router;
