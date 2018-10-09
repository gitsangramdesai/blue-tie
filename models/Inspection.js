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
    saveInspection: function (Inspection, callback) {
        var dateTime = new Date();
        dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

        return pool.query("Insert into inspection(InspectorId,VenueType,latitute,longtitute,InspectionLocation,InspectedDevice,InspectionDate,Status,Remarks) values(?,?,?,?,?,?,?,?,?);",
            [Inspection.InspectorId, Inspection.VenueType, Inspection.latitute, Inspection.longtitute, Inspection.InspectionLocation, Inspection.InspectedDevice, dateTime, Inspection.Status, Inspection.Remarks], callback);
    },
    Search: function (Inspection, callback) {
        var query = "select * from inspection where 1=1 ";
        var orCount = 0;

        if (Inspection.from != null && Inspection.to != null) {
            query = query + " and InspectionDate between '" + Inspection.from + "' and '" + Inspection.to + "'"
        } else {
            if (Inspection.VenueType != null && Inspection.VenueType != undefined) {
                if (orCount == 0) {
                    query = query + " and "
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
                    query = query + " and "
                    orCount++
                } else {
                    orCount++
                    query = query + " or "
                }
                query = query + "  Remarks like '%" + Inspection.Remarks + "%'"
            }

        }
        console.log(query)

        return pool.query(query, callback);
    },

}

module.exports = Inspection;

