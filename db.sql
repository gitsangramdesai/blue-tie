An inspection company wants to create a software which needs to track the progress of the Inspector while 
inspecting different types of venues like Home, offices, Vehicles, along with the exact location of the inspection, 
also the company should be able to check the status of the inspection like pending, started, approved, rejected etc date wise.


create table inspector(
    ID int NOT NULL AUTO_INCREMENT,
    UserName varchar(255) NOT NULL,
    FirstName varchar(255) NOT NULL,
    LastName varchar(255) NOT NULL,
    Password varchar(100),
    CanInspect BOOLEAN,
    PRIMARY KEY (ID)
);

insert into inspector(UserName,FirstName,LastName,Password,CanInspect) values('sangram@gmail.com','sangram','desai',md5('sangram'),true)
insert into inspector(UserName,FirstName,LastName,Password,CanInspect) values('sagar@gmail.com','sagar','desai',md5('sagar'),true)
insert into inspector(UserName,FirstName,LastName,Password,CanInspect) values('sachin@gmail.com','sachin','desai',md5('sachin'),false)


create table inspection(
    ID int NOT NULL AUTO_INCREMENT,
    InspectorId INT,
    VenueType ENUM('home', 'office', 'vehicle') NOT NULL,
    latitute DECIMAL(11, 8), 
    longtitute DECIMAL(11, 8),
    InspectionLocation text NOT NULL,
    InspectedDevice varchar(500) NOT NULL,
    InspectionDate DATETIME,
    Status ENUM('pending', 'started', 'approved','rejected') NOT NULL,
    PRIMARY KEY (ID)
);

------------------------------------------------------------------------------
CREATE TABLE `inspection_Remark` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `InspectionId` int(11) DEFAULT NULL,
  `RemarkType` enum('pending','started','approved','rejected') NOT NULL,
  `Remarks` text,
  `Active` tinyint(1) DEFAULT NULL,
  `RemarkDate` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
-----------------------------------------------------------------------------
DELIMITER $$

USE `play`$$

DROP PROCEDURE IF EXISTS `SaveInspection`$$

CREATE DEFINER=`xdba`@`localhost` PROCEDURE `SaveInspection`(p_ID INTEGER,p_InspectorId INT,p_VenueType VARCHAR(20),p_latitute DECIMAL(11,8),p_longtitute DECIMAL(11,8) ,p_InspectionLocation TEXT,
    p_InspectedDevice VARCHAR(500),p_status VARCHAR(20),p_Remarks TEXT)
BEGIN
	    DECLARE lastinsertid INT;
		
	    IF p_ID = 0 THEN
		    INSERT INTO inspection(InspectorId,VenueType,latitute,longtitute,InspectionLocation,InspectedDevice,InspectionDate,STATUS) 
		    VALUES(p_InspectorId,p_VenueType,p_latitute,p_longtitute,p_InspectionLocation,p_InspectedDevice,NOW(),p_status);

		    SELECT LAST_INSERT_ID() INTO lastinsertid;
		    INSERT INTO inspection_Remark(InspectionId,RemarkType,Remarks,Active,RemarkDate)VALUES(lastinsertid,p_status,p_Remarks,TRUE,NOW());
            ELSE
		UPDATE inspection SET InspectionDate=NOW(),STATUS=p_status WHERE Id =p_ID;
		
		UPDATE inspection_Remark SET Active= FALSE WHERE InspectionId=p_ID;
		
		INSERT INTO inspection_Remark(InspectionId,RemarkType,Remarks,Active,RemarkDate)VALUES(p_ID,p_status,p_Remarks,TRUE,NOW());
            END IF;       

END$$

DELIMITER ;
--------------------------------------------------------------------------