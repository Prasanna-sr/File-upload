var mongodb = require('./mongodb');
mongodb.connect('mongodb-1');

module.exports = function (app) {
	
app.get('/', function(req,res){
	res.render('index.html');
});

app.post('/upload', function(req,res) {
	if(req.files && req.files.file) {
		var name = req.files.file.name;
		// process only file contaning "employee", "salaries" word in it
		if((name).indexOf("employee") != -1 && (name).indexOf(".csv") != -1){
			mongodb.storeEmployeeData(req.files.file.path , function (err, data) {
				if(!err && data) {
					res.send(data);
				} else {
					res.send(err);
				}
			});
		} else if((name).indexOf("salaries") != -1 && (name).indexOf(".csv") != -1){
			mongodb.storeSalaryData(req.files.file.path, function (err, data) {
				if(!err && data) {
					res.send(data);
				} else {
					res.send(err);
				}
			});	
		} else {
			res.send({error : "file can not be processed"});
		}	
	}
});

app.post('/getsalaryinfo', function(req, res){
	mongodb.getSalaryData(req.body.empid, function (err, data) {
				if(!err && data) {
					res.send(data);
				} else {
					res.send({"error" : "salary not found"});
				}
			});
});
}