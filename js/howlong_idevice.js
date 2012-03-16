/*
 * References:
 * 	http://www.hunlock.com/blogs/Javascript_Dates-The_Complete_Reference#toSource
 * 	http://www.datejs.com/
 *  Evaluate Need for datejs
 */			
 
// output panel toggle for multiple output methods
function setOutput(page) {
	$('div[id^="outputPanel"]').hide();
	$("#outputPanel"+page).show();
}

// set all dates to now just for kicks
$(document).ready(function() {
	// set all dates to now on load
	var date1 = new Date();
	var date2 = new Date();

	// set dates for input 1
	fill1input1(date1);
	fill1input2(date2);
	
	// currently starting with 1
	calcDates(date1, date2);
});

function setDate1(date) {
	
}

function setDate2(date) {
	
}

function fill1input1(date) {
	$("#date1Input").val(date.toString("yyyy-MM-dd"));
}

function fill1input2(date) {
	$("#date2Input").val(date.toString("yyyy-MM-dd"));
}

function getComponentDistance(date1, date2) {
	var smallDate, largeDate;
	var results = [];
	
	// sort the dates in order
	if(date1 <= date2) {
		smallDate = date1.clone();
		largeDate = date2.clone();
	} else {
		smallDate = date2.clone();
		largeDate = date1.clone();
	}
	
	// initialize to zero
	results["years"] = 0;
	results["months"] = 0;
	results["days"] = 0;
	results["hours"] = 0;
	results["minutes"] = 0;
	results["seconds"] = 0;

	// start with a mass year differential to handle large sizes
	var tempYear = (largeDate.getFullYear() - smallDate.getFullYear()) - 1;
	if(tempYear > 0) {
		results["years"] = tempYear;
		smallDate.addYears(tempYear);
	}
	
	// iterate until we're exceed the larger date
	while(smallDate.addYears(1) <= largeDate) {
		results["years"]+= 1;
	}
	smallDate.addYears(-1); // subtract one that was added in the while clause that failed
	
	// iterate until we're exceed the larger date
	while(smallDate.addMonths(1) <= largeDate) {
		results["months"] += 1;
	}
	smallDate.addMonths(-1); // subtract one that was added in the while clause that failed
	
	// iterate until we're exceed the larger date
	while(smallDate.addDays(1) <= largeDate) {
		results["days"] += 1;
	}
	smallDate.addDays(-1); // subtract one that was added in the while clause that failed
	
	// iterate until we're exceed the larger date
	while(smallDate.addHours(1) <= largeDate) {
		results["hours"] += 1;
	}
	smallDate.addHours(-1); // subtract one that was added in the while clause that failed
	
	// iterate until we're exceed the larger date
	while(smallDate.addMinutes(1) <= largeDate) {
		results["minutes"] += 1;
	}
	smallDate.addMinutes(-1); // subtract one that was added in the while clause that failed
	
	// iterate until we're exceed the larger date
	while(smallDate.addSeconds(1) <= largeDate) {
		results["seconds"] += 1;
	}
	smallDate.addSeconds(-1); // subtract one that was added in the while clause that failed
	
	return results;
}

function getCumulativeDistance(date1, date2) {
	var difference = 0;
	var results = [];
	
	// initialize to zero
	results["years"] = 0;
	results["months"] = 0;
	results["days"] = 0;
	results["hours"] = 0;
	results["minutes"] = 0;
	results["seconds"] = 0;

	// get the difference from biggest to smallest
	if(date1 <= date2) {
		difference = date2.valueOf() - date1.valueOf();
	} else {
		difference = date1.valueOf() - date2.valueOf();
	}
	
	// only calculate if we have a value, otherwise leave results as zero's from intialization
	if(!isNaN(difference)) {
		// we can do simple math up to days
		results["seconds"] = difference / 1000;
		results["minutes"] = difference / 60000; // (1000 * 60)
		results["hours"] = difference / 3600000; // (1000 * 60 * 60)
		results["days"] = difference / 86400000; // (1000 * 60 * 60 * 24)
		
		// months method two: 
		//	- add years until it exceeds
		// 	- multiply those years by 12
		// 	- add months until it exceeds
		// 	- add (day in month / total days in month)
		//	- figure in time component
		
		// months vary in length of days, so this is an average
		results["months"] = results["days"] / (365.242199 / 12); 

		// years method two
		//	- add years until it exceeds
		// 	- add (day in year / total days in year)
		//	- figure in time component
		
		
		// years vary depending on leap years so this is an average
		results["years"] = results["days"] / 365.242199;
	} 	
	
	return results;
}

function clearResults() {
	$('div[id^="component"]').html("");
	$('div[id^="cumulative"]').html("");
}

// taken from http://www.mredkj.com/javascript/numberFormat.html
// modified to take a separator character and decimal separator
function addCommas(nStr, decimalSeparator, thousandsSeparator)
{
	nStr += '';
	x = nStr.split(decimalSeparator);
	x1 = x[0];
	x2 = x.length > 1 ? decimalSeparator + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + thousandsSeparator + '$2');
	}
	return x1 + x2;
}

function ondate1InputChange() {
	calcDates();
}

function ondate2InputChange() {
	calcDates();
}

function getDaysInMonth(date) {
	return getDaysInMonth(date.getFullYear(), date.getMonth());
}

function getDaysInMonth(year, month) {
	// month is zero based when initialized a date
	// month is 1 based when reading the month from a date
	
	var date1 = new Date(year, month);
	date1.addDays(-1);
	return(date1.getDate());
}

function calcDates() {
	var date1 = new Date($("#date1Input").val());
	var date2 = new Date($("#date2Input").val());
	var decimalDigits = 2;
	
	// calculate values for component results
	componentResults = getComponentDistance(date1, date2);
	
	$("#componentYears").html(componentResults["years"]);
	$("#componentMonths").html(componentResults["months"]);
	$("#componentDays").html(componentResults["days"]);
	$("#componentHours").html(componentResults["hours"]);
	$("#componentMinutes").html(componentResults["minutes"]);
	$("#componentSeconds").html(componentResults["seconds"]);

	// calculate values for cumulative results
	cumulativeResults = getCumulativeDistance(date1, date2);
	
	$("#cumulativeYears").html(addCommas(cumulativeResults["years"].toFixed(decimalDigits), '.', ','));
	$("#cumulativeMonths").html(addCommas(cumulativeResults["months"].toFixed(decimalDigits), '.', ','));
	$("#cumulativeDays").html(addCommas(cumulativeResults["days"].toFixed(decimalDigits), '.', ','));
	$("#cumulativeHours").html(addCommas(cumulativeResults["hours"].toFixed(decimalDigits), '.', ','));
	$("#cumulativeMinutes").html(addCommas(cumulativeResults["minutes"].toFixed(decimalDigits), '.', ','));
	$("#cumulativeSeconds").html(addCommas(cumulativeResults["seconds"].toFixed(decimalDigits), '.', ','));
}