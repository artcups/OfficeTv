
OP = {};
OP.apiGetData = function(method, callback){
    $.ajax({
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        url: '/api/' + method,
        error: function(response) {
            OP.error.handler.code(response.status, response.responseText);
        },
        success: function (response) {
            callback(response);
        }
    });
}
OP.api = function(data, method, callback) {
	$.ajax({
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(data),
		dataType: 'json',
		url: OP.baseUrl + '/api/' + method,
		error: function(response) {
			OP.error.handler.code(response.status, response.responseText);
		},
		success: function (response) {
			if(callback != undefined)
				callback(response);
		}
	});
};
OP.getQueryVariable = function(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	return null;
};