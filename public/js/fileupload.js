$(document).ready(function() {

	$('#upload').click(function() {
		var xhr = new XMLHttpRequest();
		var formData = new FormData();
		var fd = document.getElementById('files').files[0];
		formData.append('file', fd);
		// event listners
		xhr.upload.addEventListener("progress", uploadProgress, false);
		xhr.addEventListener("load", uploadComplete, false);
		xhr.addEventListener("error", uploadFailed, false);
		xhr.addEventListener("abort", uploadCanceled, false);
		xhr.open("POST", "/upload");
		xhr.send(formData);
	});

	function uploadProgress(evt) {
		if (evt.lengthComputable) {
			var percentComplete = Math.round(evt.loaded * 100 / evt.total);
			$('#progress_bar').attr("value", percentComplete);
		} else {
			alert("unable to complete");
		}
	}

	function uploadComplete(evt) {
		var response = JSON.parse(evt.target.response);
		if(!response.error) {
		//salary file process successfully	
		if (response.msg == "Success") {
			alert("Salary data processed successfully. click on the hyper link of the employee to get salary details");
			$('#progress_bar').attr("value", 0);
		} else {
			//reset the progress bar to zero
			$('#progress_bar').attr("value", 0);
			processResponseText(response);
		}
		} else {
			$('#progress_bar').attr("value", 0);
			alert("Error : " + response.error);
		}

	}

	function uploadFailed(evt) {
		alert("There was an error attempting to upload the file ");
	}

	function uploadCanceled(evt) {
		alert("The upload has been canceled !");
	}

	function processResponseText(responseArr) {
		for (var i = 0; i < responseArr.length; i++) {
			for (var j in responseArr[i]) {
				if (i == 0) {
					$('#employeelist').append('<tr><td> name </td><td>birthdate</td><td>'
					 + 'employee_id</td><td>' + 'sex</td><td>' + 'start_date</td></tr>');
				}
				$('#employeelist').append('<tr><td><a href="#salaryList?empid=' + j + '">' 
				+ responseArr[i][j]["firstname"] + ' ' + responseArr[i][j]["firstname"] + '</a></td><td>' 
				+ responseArr[i][j]["birthdate"] + '</td><td>' + j + '</td><td>'
				 + responseArr[i][j]["sex"] + '</td><td>' + responseArr[i][j]["start_date"] + '</td></tr>');
			}
		}

		$("a").click(function() {
			var arr = this.href.split('?');
			var arr1 = arr[1].split('=');
			$.post('http://localhost:3000/getsalaryinfo', { "empid" : arr1[1] }, function(objArr) {
				if (objArr.length > 0 && !objArr.error) {
					$('#salarylist tr').remove();
					for (var i = 0; i < objArr.length; i++) {
						if (i == 0) {
							$('#salarylist').append('<tr><td>employee ID </td><td>salary</td><td>' + 'start salary</td><td>' + 'end salary</td></tr>');
						}
						$('#salarylist').append('<tr><td>' + objArr[i].empid + '</td><td>' + objArr[i].salary + '</td><td>'
						 + objArr[i].start_salary + '</td><td>' + objArr[i].start_salary + '</td></tr>');
					}
				} else {
					if (objArr.error) {
						alert("Error occured");
					} else {
						alert("Salary file yet to be uploaded !");
					}
				}
			});
		});
	}
});
