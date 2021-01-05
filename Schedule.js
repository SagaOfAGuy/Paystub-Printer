require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const http =  require('http');
(async () => {
	
	async function login(username, password) {
		const browser = await puppeteer.launch({headless: true});
		const page = await browser.newPage();
		await page.setViewport({width:1920, height:1080});
		await page.goto(process.env.CALENDAR_LINK);
		const user = await page.$("#KSWUSER");
		const pass = await page.$("#PWD");
		await user.type(username);
		await pass.type(password);
		await page.click('[value="I AGREE"]');
		try { 
			await page.waitForNavigation({waitUntil: 'networkidle0'});
			const loggedInBtn = await page.$("#btnContinue");
			await loggedInBtn.click();
			await page.waitForNavigation({waitUntil: 'networkidle0'});
			console.log("Already logged in");
			const calendar = await page.$("#calendar");
			await calendar.screenshot({path: 'calendar.png'});
		
		}
		catch(err) {
			console.log(err.message);
		}
		await page.waitForSelector("#calendar", {
			visible:true,
		});
		const calendar = await page.$("#calendar");
		const html = await calendar.evaluate(() => document.querySelector('*').outerHTML);
		fs.writeFileSync("index.html",html);
		await calendar.screenshot({path: 'Calendar.png'});
		console.log("Screenshot Saved");
		await browser.close();
		process.exit(1);
	}
	login(process.env.USERNAME,process.env.PASSWORD);
})();
