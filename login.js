var fs2 = require('fs');
var inputData = JSON.parse(fs2.readFileSync('./currency.json'));

//var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
//var dateFormat = require('dateformat');

/*var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'phplogin'
});*/

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
//app.use(timeout('7200s'));

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
	//	connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
		//	if (results.length > 0) {
				request.session.loggedin = true;
			//	request.session.username = 'username';
				response.redirect('/home');
		//	} else {
		//		response.send('Incorrect Username and/or Password!');
		//	}
			response.end();
		//});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {

	var appendedData;
	var table_body = '<table border="1" id="example"><thead><tr><th>Currency</th><th>Date</th><th>Sell</th><th>time<th>Buy</th><th>time</th><th>Profit</th></tr></thead><tbody>';
	if (request.session.loggedin) {
		for (i = 0; i < inputData.length; i++) {
			table_body+='<tr>';
			table_body+='<td>';
			table_body+= inputData[i].currency + '\n';
			table_body+='</td>';
			console.log('Currency: '+ inputData[i].currency);
			// table_body+='<tr>';
		  // table_body+='<td>';
      // appendedData = ' ' + appendedData + inputData[i].currency + '\n';
			// table_body+='</td>';
      // console.log('Currency: '+ inputData[i].currency);
			// table_body+='<td>';
			// table_body+=inputData[i].date;
			// table_body+='</td>';
			table_body+='<td>';
			console.log(moment(inputData[i].date).format('DD-MMM-YYYY'));
			//table_body+=inputData[i].date;
			table_body+=moment(inputData[i].date).format('DD-MMM-YYYY')
			table_body+='</td>';
      for (j = 0; j < inputData[i].quotes.length; j++) {
				console.log('Quotes Length: '+inputData[i].quotes.length);
        quotes_price_String = inputData[i].quotes.map(function(o) {
          return o.price;
        });
        console.log('Prices in String: '+quotes_price_String);
        quotes_price_Numeritc = quotes_price_String.map(Number);
        console.log('Prices in Numeric: '+ quotes_price_Numeritc);
        max_quotes_price = Math.max.apply(null, quotes_price_Numeritc);
        console.log('Max Price: '+ max_quotes_price);
        min_quotes_price = Math.min.apply(null, quotes_price_Numeritc);
        console.log('Min Price: '+min_quotes_price);
        // console.log(quotes_price_Numeritc);
        // console.log(max_quotes_price);
        max_index = quotes_price_Numeritc.indexOf(Math.max.apply(null, quotes_price_Numeritc));
        console.log('Index of max: '+max_index);
        min_index = quotes_price_Numeritc.indexOf(Math.min.apply(null, quotes_price_Numeritc));
        console.log('Index of min: '+min_index);
        diff_length = inputData[i].quotes.length - max_index-1;
        console.log('Difference: '+diff_length);
        if (diff_length == 0)
          break;
        if(max_index > min_index)
          break;
        else
            inputData[i].quotes.splice(min_index, 1);
      }



      console.log('Max Index: '+ max_index);
      console.log('Min Index: '+ min_index);
			table_body+='<td>';
      final_max = inputData[i].quotes[max_index].price;
			table_body+= final_max;
			table_body+='</td>';
      console.log("final_max: "+ final_max);
			table_body+='<td>';
			console.log(moment(inputData[i].quotes[max_index].time,"HHmm").format("HH:mm A"));
			//moment(inputData[i].quotes[max_index].time,"HHmm").format("HH:mm");
			//table_body+= inputData[i].quotes[max_index].time;
			table_body+= moment(inputData[i].quotes[max_index].time,"HHmm").format("HH:mm A");
			table_body+='</td>';
			table_body+='<td>';
      final_min = inputData[i].quotes[min_index].price;
			table_body+= final_min;
			table_body+='</td>';
      console.log("final_min: "+ final_min);
			table_body+='<td>';
			//table_body+= inputData[i].quotes[min_index].time;
			table_body+= moment(inputData[i].quotes[min_index].time,"HHmm").format("HH:mm A");
			table_body+='</td>';
			table_body+='<td>';
      profit = parseFloat(final_max) - parseFloat(final_min);
			table_body+= profit.toFixed(2);
			table_body+='</td>';
      console.log('profit: '+ profit);


    }
		// var table_body = '<table border="1" id="example"><thead><tr><th>Currency</th><th>Date</th><th>time</th><th>price</th></tr></thead><tbody>';
		// var price_min=0.0;
		// var price_max=0.0;
		// var time_min;
		// var time_max;
		//
		// for (i = 0; i < inputData.length; i++) {
		// //+ ' ' + inputData[i].date + ' ' + 'Length of quotes: ' + inputData[i].quotes.length + inputData[i].quotes[0].time + ' ' + inputData[i].quotes[0].price + ' ';
		// 	// price_min=inputData[i].quotes[0].price;
		// 	// price_max=inputData[i].quotes[0].price;
		// 	max_index = inputData[i].quotes.map(function(o) { return o.price; }).indexOf(Math.max.apply(Math, inputData[i].quotes.map(function(o) { return o.price; })));
		// 	console.log(max_index);
		//
		// 	var index=inputData.map()
		//
		// 	for(j=0; j<inputData[i].quotes.length; j++) {
				//var quotes_index=inputData[i].quotes.map(function(o) { return o.price; });
				//max_index = quotes_index.indexOf(Math.max.apply(Math, quotes_index));
				//max_index = inputData[i].quotes.map(function(o) { return o.price; }).indexOf(Math.max.apply(Math, inputData[i].quotes.map(function(o) { return o.price; })));
				//console.log(max_index);
				// if(price_min>inputData[i].quotes[j].price){
				// 	price_min=inputData[i].quotes[j].price;
				//
				// 	time_min=inputData[i].quotes[j].time;
				// }
				// if(price_max<inputData[i].quotes[j].price){
				// 	price_max=inputData[i].quotes[j].price;
				// 	if()
				// 	time_max=inputData[i].quotes[j].time;
				// }
				// if(time_max>time_min){
				//
				// }
				// table_body+='<tr>';
		    // table_body+='<td>';
		  	// table_body+=inputData[i].currency;
				// table_body+='</td>';
				// table_body+='<td>';
				// table_body+=inputData[i].date;
				// table_body+='</td>';
				// table_body+='</td>';
				// table_body+='<td>';
				// table_body+= inputData[i].quotes[j].time;
				// table_body+='</td>';
				// table_body+='<td>';
				// table_body+=inputData[i].quotes[j].price;
				// table_body+='</td>';
				// table_body+='</tr>';

//}
table_body+='</tbody></table>';
		response.setHeader("Content-Type", "text/html; charset=UTF-8");
		response.send(fs.readFileSync('table.html') + table_body + '</body></html>');
//var wordsFile = '/Users/swaroop/Study-Related/Srikanth-NAB/table-test.html';
  //response.setHeader("Content-Type", "text/html; charset=UTF-8");
    //response.send(fs.readFileSync(wordsFile));
//  response.sendFile(path.join(__dirname + '/table-test.html'));
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
//const server = app.listen('3000');
//server.keepAliveTimeout = 60000 * 2;
app.listen('3000');
