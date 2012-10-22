var dbUtil = require('./cloudFoundryUtil');
var csv = require('ya-csv');

var conn;
var db;
module.exports = {
    connect: function(dbServiceName) {
        db = dbUtil.connect('mongodb', dbServiceName);
        db.open(function(err, connection) {
            if (err || !connection) {
                console.log('Could not connect to MongoDB');
            } else {
                console.log('Connected to MongoDB successfully');
                conn = connection;
            }
        });
    },
    
   storeEmployeeData : function(path, callback) {  	
  	db.collection('employeedetails');
    db.bind('employeedetails');
    //clear exisiting data to avoid mulitple copies 
  	db.employeedetails.remove();
  	//using ya-csv reader to parse csv files
  	var reader = csv.createCsvFileReader(path);
	reader.setColumnNames([ 'employee_id', 'birthdate','firstname','lastname','sex','start_date' ]);
	
	reader.addListener('data', function(data) {
	var employeeData = {"birthdate" : data.birthdate, "firstname" : data.firstname, 
						"lastname" : data.lastname,"sex" : data.sex, "start_date" : data.start_date};
						
	var employeedetails = {};
	employeedetails[data.employee_id] = employeeData;
	db.employeedetails.insert(employeedetails);
   });
   
   reader.addListener('end', function() {
   	db.employeedetails.find({}, {"_id" : false} ,function(err, cursor) {	 
   	if(err) {
   		callback(err);
   	} else {
   		cursor.toArray(callback);
   	} });
   });
   
   reader.addListener('error', function(error) {
   	callback({"error" : "error occured while parsing the employee file"});
   });
  },
  
  storeSalaryData  : function(path, callback) {  	
  	db.collection('salarydetails');
    db.bind('salarydetails');
    	
	//clear exisiting data to avoid mulitple copies 
    db.salarydetails.remove();
    //using ya-csv reader to parse csv files
    var reader = csv.createCsvFileReader(path);
	reader.setColumnNames([ 'employee_id', 'salary','start_salary','end_salary' ]);
	
	reader.addListener('data', function(data) {	
	var salaryData = {"empid" : data.employee_id, "salary" : data.salary, "start_salary" : data.start_salary, "end_salary" : data.end_salary};
	db.salarydetails.insert(salaryData);
   });
   
    reader.addListener('end', function() {
   		callback(null, {"msg" : "Success"});
   });
   
   reader.addListener('error', function(error) {
   	callback({"error" : "error occured while parsing the salary file"});
   });
  },
  
  
  getSalaryData : function(empid, callback) {
  	db.collection('salarydetails');
    db.bind('salarydetails');
    console.log(empid);
    db.salarydetails.find({"empid" : empid}, {"_id" : false} ,function(err, cursor) {	 
   	if(err) {
   		callback(err);
   	} else {
   		cursor.toArray(callback);
   	}
   });
  }
}