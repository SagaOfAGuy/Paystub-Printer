require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const http = require('http');
(async () => {
	async function serveHTML() {
		const hostname = '127.0.0.1';
		const port = process.env.PORT;
		const server = http.createServer((req,res) => {
			res.statusCode = 200;
			res.setHeader('Content-type', 'text/html'); 
			var html = fs.readFileSync('./index.html'); 
			res.write(html);
			res.end();	
		});
		server.listen(port); 
		console.log("HTML loaded.");
		}
	async function scrapeData() {
		const browser = await puppeteer.launch({headless: true});
		const page = await browser.newPage();
		page.goto(`http://127.0.0.1:${process.env.PORT}`);
		await page.waitForNavigation();
		console.log("Scraping in process");
		const dates = await page.$('.dates');
		const datesText = await dates.evaluate(() => document.querySelector(".dates").innerText);
		const regex = /[0-9][0-9][/][0-9][0-9]\s[0-9][:][0-9][0-9]\w\s[-]\s[0-9][0-9][:][0-9][0-9]\w/g
		const shiftTimes = datesText.match(regex); 
		await browser.close();
		// Initiate ICS file 
		var start = startCal(); 
		var end = endCal();
		fs.writeFileSync("Schedule.ics",start, {flag: 'w'});
		// Iterate through shift times and write in ICS file 
		for (var index = 0; index < shiftTimes.length; index++) {
			var string = shiftTimes[index]; 
			var month = string.substring(0,2);
			var day = string.substring(3,5); 
			var timeRegex = /([0-9][0-9]|[0-9])[:][0-9][0-9]\w/g
			var times = string.match(timeRegex); 
			var startTime = times[0].padStart(5,'0');
			var endTime = times[1].padStart(5,'0');
			var startWithMinutes = adjustTime(startTime);
			var endWithMinutes = adjustTime(endTime);
			var date = new Date();
			var year = date.getFullYear();
			var middle = middleCal("Kroger",year,month,day,startWithMinutes,endWithMinutes);
			fs.writeFileSync("Schedule.ics","\n"+middle,{flag:'a'});
		}
		fs.writeFileSync("Schedule.ics","\n"+end,{flag:'a'});
		process.exit(1);
	}
	function adjustTime(time) {
		var number = parseInt(time.substring(0,2));
		var minuteRegex = /[:][0-9][0-9]/g
		var minutes = time.match(minuteRegex).toString().substring(1);
		if(time.includes("p")) {
			if(number == 12) {
				number = 0; 
			} 
			else {
				number += 12; 
			}
		}
		else { 
			number = number.toString().padStart(2,'0');
		}
		var time = number + minutes;
		return time.toString();
	}
	function startCal() {
		var start = `BEGIN:VCALENDAR
PRODID:-//Google Inc//Google Calendar 70.9054//EN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Work Schedule
X-WR-TIMEZONE:America/New_York
BEGIN:VTIMEZONE
TZID:America/New_York
X-LIC-LOCATION:America/New_York
BEGIN:DAYLIGHT
TZOFFSETFROM:-0500
TZOFFSETTO:-0400
TZNAME:EDT
DTSTART:19700308T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:-0400
TZOFFSETTO:-0500
TZNAME:EST
DTSTART:19701101T020000
RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU
END:STANDARD
END:VTIMEZONE`;
	return start;
	}
	function middleCal(summary,year,month,day,start,end) {
		var middle = `BEGIN:VEVENT
DTSTART;TZID=America/New_York:${year}${month}${day}T${start}00
DTEND;TZID=America/New_York:${year}${month}${day}T${end}00
RRULE:FREQ=DAILY;COUNT=1
DSTAMP:20201108T014109Z
CREATED:20201108T014107Z
LAST-MODIFIED:20201108T014108Z
LOCATION:
SEQUENCE:0
STATUS:CONFIRMED
SUMMARY:${summary}
TRANSP:OPAQUE
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:This is an event reminder
TRIGGER:-P0DT4H0M0S
DESCRIPTION:Work Schedule
END:VALARM
END:VEVENT`;
		return middle; 
	}
	function endCal() {
		return "END:VCALENDAR";
	}
	serveHTML();
	scrapeData(); 
})();
