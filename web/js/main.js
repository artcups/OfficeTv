$(document).ready(function(){
	OP = {};
	OP.apiGetData = function(method, callback){
		$.ajax({
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			url: 'localhost:9615/' + method,
			error: function(response) {
				OP.error.handler.code(response.status, response.responseText);
			},
			success: function (response) {
				callback(response);
			}
		});
	}

	OP.apiGetData("siteStatus", function(res){
		console.log(res);
	})
});