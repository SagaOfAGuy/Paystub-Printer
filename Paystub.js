// Import Environmental Variables
require('dotenv').config({path: '.env'});

const winston = require('winston');
const puppeteer = require('puppeteer');
const fs = require('fs');
const http =  require('http');
const mailer = require('nodemailer');
const cron = require('node-cron');
const exec = require('child_process').exec;

// Create Logger 
const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
		winston.format.prettyPrint()
	),
	transports: [
		new winston.transports.File({ filename: './logs/debug.log' })
	]
});
// Scrape Paystub and save to PDF file
async function login(username, password) {
	try {
		const browser = await puppeteer.launch({headless: true, args: ['--incognito','--start-fullscreen','--no-sandbox','--disable-setuid-sandbox']},);
		const page = await browser.newPage();
		await page.setViewport({width:1920, height:1080});
		await page.goto(process.env.HR_LINK);
		await page.waitForSelector("#KSWUSER",{visible: true});
		const user = await page.$("#KSWUSER");
		const pass = await page.$("#PWD");
		await user.type(username);
		await pass.type(password);
		logger.info("Logged in");
		await page.click('[value="I AGREE"]');
		await page.waitForSelector('.brickletContent', {visible: true});
		logger.info("Logged in");
		await page.goto(process.env.PAYSTUB_LINK);
		await page.evaluate(_ => {
			window.location.href=`../paystubprint.jsp?grosspayAmount=${document.all["payAmount"].options[document.all["payAmount"].selectedIndex].text}`;
		})
		await page.waitForNavigation({waitUntil: 'networkidle0'});
		await page.bringToFront();
		await page.pdf({path: "Paystub.pdf",scale:1.0, format: "A4",landscape:true});
		logger.info("PDF Paystub Saved");
		await browser.close();
		return Promise.resolve(1);
		}
	catch(err) {
			return Promise.reject(new Error('could not recieve paystub').then(logger.error(error.message)));

		}	
}
// Sends email alerts
async function sendAlert(msg) 
{	
	const recips = process.env.RECIPIENTS;
	const recipsSplit = recips.split(',');
	let sender = mailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL_PASS,
		},
		tls: {
			minVersion: 'TLSv1'
		}
	});
	for(var recipient in recipsSplit) {
		try {
			let message =  sender.sendMail({
				from: `"Schedule Bot" ${process.env.EMAIL}`,
				to: [recipsSplit[recipient]],
				subject: 'Paystub Confirmation',
				text: msg
			});
			logger.info("Email Successfully Sent");
			return Promise.resolve(1);

		} catch(error) {
			return Promise.reject(new Error('cant send email').then(logger.error(error.message)));
		}
	}
}
// Prints paystub
function execShellCommand(cmd) {
	return new Promise((resolve, reject) => {
	 exec(cmd, (error, stdout, stderr) => {
	  if (error) {
		reject(new Error('cant send email').then(logger.error(error.message)));
	  }
	  resolve(1);
	 });
	});
	}
// Delete files	
async function deleteFiles() { 
	return new Promise((resolve,reject) => {
		fs.unlink("./Paystub.pdf", (err) => {
			if (err) {
				reject(new Error('cant send email').then(logger.error(error.message)));
			}
			resolve(1);
		})
	});
}
// Schedule Paystub printing and notification alerts
cron.schedule('00 8 * * 4', async() => {
	const loginState = await login(process.env.K_USERNAME,process.env.K_PASSWORD);
	const printState = await execShellCommand(`lpr -o landscape -o fit-to-page -o media=A4 -o page-ranges=1 -P ${process.env.PRINTER} Paystub.pdf`);
	if(loginState == 1 && printState == 1) {
		await sendAlert("Paystub successfully retrieved. Check local printer for physical copy");
		await deleteFiles();
	} else {
		await sendAlert("Could not print paystub");
	}
});










