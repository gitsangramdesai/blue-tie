var mysql = require('mysql');
var moment = require('moment');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'xdba',
    password: 'Sangram@123',
    database: 'play'
});

var Inspection = {
    autheticate: function (username, password, callback) {
        return pool.query("Select * from inspector where UserName=? and Password=?", [username, password], callback);
    },
    saveInspection1: function (Inspection, callback) {
        var dateTime = new Date();
        dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

        return pool.query("Insert into inspection(InspectorId,VenueType,latitute,longtitute,InspectionLocation,InspectedDevice,InspectionDate,Status,Remarks) values(?,?,?,?,?,?,?,?,?);",
            [Inspection.InspectorId, Inspection.VenueType, Inspection.latitute, Inspection.longtitute, Inspection.InspectionLocation, Inspection.InspectedDevice, dateTime, Inspection.Status, Inspection.Remarks], callback);
    },
    Search: function (Inspection, callback) {
        var query = "select inspection.ID,InspectorId,VenueType,latitute,longtitute,InspectionLocation,InspectedDevice,InspectionDate,Status,Remarks,Active,RemarkDate from inspection inner join inspection_Remark on inspection.Id = inspection_Remark.InspectionId where Active=true and ";
        var orCount = 0;

        if (Inspection.from != null && Inspection.to != null) {
            query = query + " InspectionDate between '" + Inspection.from + "' and '" + Inspection.to + "' and ("
        }  
        
        {
            if (Inspection.VenueType != null && Inspection.VenueType != undefined) {
                if (orCount == 0) {
                    query = query + "  "
                    orCount++
                }
                query = query + " VenueType like '%" + Inspection.VenueType + "%'"
            }

            if (Inspection.InspectionLocation != null && Inspection.InspectionLocation != undefined) {
                if (orCount == 0) {
                    query = query + " and "
                    orCount++
                } else {
                    orCount++
                    query = query + " or "
                }
                query = query + " InspectionLocation like '%" + Inspection.InspectionLocation + "%'"
            }

            if (Inspection.Status != null && Inspection.Status != undefined) {
                if (orCount == 0) {
                    query = query + " and "
                    orCount++
                } else {
                    orCount++
                    query = query + " or "
                }
                query = query + "  Status like '%" + Inspection.Status + "%'"
            }

            if (Inspection.Remarks != null && Inspection.Remarks != undefined) {
                if (orCount == 0) {
                    query = query + "  "
                    orCount++
                } else {
                    orCount++
                    query = query + " or "
                }
                query = query + "  Remarks like '%" + Inspection.Remarks + "%'"
            }


            if (orCount == 0) {
                query = query + " 1=1 )"
                orCount++
            } else {
                orCount++
                query = query + " ) "
            }

            

        }
        console.log(query)

        return pool.query(query, callback);
    },
    saveInspection: function (Inspection, callback) {
        var dateTime = new Date();
        dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

        return pool.query("call SaveInspection(? ,? ,?,?, ? ,?,? ,? ,? );",[Inspection.InspectionId,Inspection.InspectorId ,Inspection.VenueType,Inspection.latitute ,Inspection.longtitute ,Inspection.InspectionLocation ,
                Inspection.InspectedDevice ,Inspection.Status ,Inspection.Remarks], callback);
    }

}

module.exports = Inspection;

