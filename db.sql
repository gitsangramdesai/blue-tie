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
    Remarks text,
    PRIMARY KEY (ID)
);


