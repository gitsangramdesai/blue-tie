var express = require('express');
var router = express.Router();
var Inspection = require('../models/Inspection');
var md5 = require('md5');
var jwt = require('jsonwebtoken');



router.post('/signin', function (req, res, next) {
  var username = req.body.username;
  var password = md5(req.body.password)
  Inspection.autheticate(username, password, function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      console.log(rows.length)
      if (rows.length == 1) {
        var claim = {
          "Id": rows[0].ID,
          "UserName": rows[0].UserName,
          "CanInspect": rows[0].CanInspect
        }
        var token = jwt.sign(claim, 'my secret');

        res.json({
          status: true,
          data: rows[0],
          token: token,
          message: "signin success"
        })
      } else {
        res.json({
          status: false,
          data: null,
          message: "Invalid Username or password"
        })
      }

    }
  });


});

router.post('/inspect', function (req, res, next) {
  var InspectionStatusEnum = ['pending', 'started', 'approved', 'rejected']
  var VenueTypeEnum = ['home', 'office', 'vehicle']
  var ValidationMessages = []

  var token = req.headers.token
  var claims = jwt.verify(token, 'my secret');

  if (token == undefined || token == null) {
    ValidationMessages.push("Invalid User!")
  } else if (claims.Id != req.body.InspectorId) {
    ValidationMessages.push("Invalid User!")
  } else if (claims.CanInspect != 1) {
    ValidationMessages.push("You are not authorized to Inpect")
  }

  var Status = "";
  if (req.body.Status != undefined || req.body.Status != null || req.body.Status.trim() != '') {
    if (!InspectionStatusEnum.includes(req.body.Status)) {
      ValidationMessages.push("Invalid Status")
    } else {
      Status = req.body.Status
    }
  } else {
    ValidationMessages.push("Status is mandatory")
  }

  var VenueType = "";
  if (req.body.VenueType != undefined && req.body.VenueType != null && req.body.VenueType.trim() != '') {
    if (!VenueTypeEnum.includes(req.body.VenueType)) {
      ValidationMessages.push("Invalid VenueType")
    } else {
      VenueType = req.body.VenueType;
    }
  } else {
    ValidationMessages.push("Venue Type is mandatory")
  }

  var InspectionLocation = ''
  if (req.body.InspectionLocation != undefined && req.body.InspectionLocation != null && req.body.InspectionLocation.trim() != '') {
    InspectionLocation = req.body.InspectionLocation;
  } else {
    ValidationMessages.push("Inspection Location is mandatory")
  }

  var InspectedDevice = ''
  if (req.body.InspectedDevice != undefined && req.body.InspectedDevice != null && req.body.InspectedDevice.trim() != '') {
    InspectedDevice = req.body.InspectedDevice;
  } else {
    ValidationMessages.push("Inspected Device is mandatory")
  }

  var InspectorId = 0;
  if (req.body.InspectorId != undefined && req.body.InspectorId != null && req.body.InspectorId.toString().trim() != '') {
    InspectorId = req.body.InspectorId;
  } else {
    ValidationMessages.push("InspectorId  is mandatory")
  }

  var Remarks = ''
  if (req.body.Remarks != undefined && req.body.Remarks != null && req.body.Remarks.trim() != '') {
    Remarks = req.body.Remarks;
  } else {
    ValidationMessages.push("Remarks is mandatory")
  }

  var latitute = 0;
  if (req.body.latitute != undefined) {
    if (isNaN(req.body.latitute)) {
      ValidationMessages.push("latitute should be valid number")
    } else {
      latitute = parseFloat(req.body.latitute)
    }
  }

  var longtitute = 0;
  if (req.body.longtitute != undefined) {
    if (isNaN(req.body.longtitute)) {
      ValidationMessages.push("longtitute should be valid number")
    } else {
      longtitute = parseFloat(req.body.longtitute)
    }
  }

  var InspectionId =0
  if (req.body.Id != undefined) {
    InspectionId=req.body.Id
  }

  var inspection = {
    InspectionId:InspectionId,
    VenueType: VenueType,
    latitute: latitute,
    longtitute: longtitute,

    InspectionLocation: InspectionLocation,
    InspectedDevice: InspectedDevice,
    Status: Status,

    InspectorId: InspectorId,
    Remarks, Remarks
  }

  console.log('inspection:', inspection)

  if (ValidationMessages.length > 0) {
    res.json({
      status: "failure",
      data: null,
      message: ValidationMessages
    })
  } else {
    Inspection.saveInspection(inspection, function (err, result) {
      if (err) {
        res.json(err);
      } else {
        if (result.affectedRows == 1) {
          res.json({
            status: "success",
            data: inspection,
            message: "inspection saved successfully!"
          })
        }
      }
    });
  }





});

router.post('/search', function (req, res, next) {
  var ValidationMessages = []

  var token = req.headers.token
  var claims = jwt.verify(token, 'my secret');

  if (token == undefined || token == null) {
    ValidationMessages.push("Invalid User!")
  }

  var Status = req.body.Status
  var VenueType = req.body.VenueType;
  var InspectionLocation = req.body.InspectionLocation;
  var InspectedDevice = req.body.InspectedDevice;
  var InspectorId = req.body.InspectorId;
  var Remarks = req.body.Remarks;

  var from = req.body.from;
  var to = req.body.to;

  var inspection = {
    VenueType: VenueType,
    InspectionLocation: InspectionLocation,
    InspectedDevice: InspectedDevice,
    Status: Status,

    InspectorId: InspectorId,
    Remarks: Remarks,
    from:from,
    to:to
  }


  if (ValidationMessages.length > 0) {
    res.json({
      status: "failure",
      data: null,
      message: ValidationMessages
    })
  } else {
    Inspection.Search(inspection, function (err, result) {
      if (err) {
        res.json(err)
      } else {
        res.json(result)
      }
    })
  }
});

module.exports = router;
