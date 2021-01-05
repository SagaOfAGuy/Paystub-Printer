require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const http =  require('http');
(async () => {
	
	async function login(username, password) {
		const browser = await puppeteer.launch({headless: true});
		const page = await browser.newPage();
		await page.setViewport({width:1920, height:1080});
		await page.goto(process.env.HR_LINK);
		await page.waitForSelector("#KSWUSER",{visible: true});
		const user = await page.$("#KSWUSER");
		const pass = await page.$("#PWD");
		await user.type(username);
		await pass.type(password);
		await page.click('[value="I AGREE"]');
		await page.waitForSelector('.brickletContent', {visible: true});
		console.log("Logged In");
		const page2 = await browser.newPage();
		await page2.goto(process.env.PAYSTUB_LINK);
		await page2.bringToFront();
		await page2.pdf({path: "Paystub.pdf",scale:0.73, format: "A4"});
		console.log("PDF Paystub Saved");
		await browser.close();
		process.exit(1);
	}
	login(process.env.USERNAME,process.env.PASSWORD);
})();
