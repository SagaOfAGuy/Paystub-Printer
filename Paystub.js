// Import Environmental Variables
<<<<<<< HEAD
require('dotenv').config({path: '.env'});
=======
require('dotenv').config({path: './.env'});
>>>>>>> c02e7ff0e18aeee6e67ff6ad9e1ca0043e043df6

const winston = require('winston');
const puppeteer = require('puppeteer');
const fs = require('fs');
const http =  require('http');
const mailer = require('nodemailer');
const cron = require('node-cron');
const exec = require('child_process').exec;

// Create Logger 
const logger = winston.createLogger({
<<<<<<< HEAD
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
=======
                transports: [
                        new winston.transports.Console(),
                        new winston.transports.File({ filename: 'Pay.log' })
                ]
        });

// Async Execution
(async () => {
	// Scrape Paystub and save to PDF file
	async function login(username, password) {
			try {
				const browser = await puppeteer.launch({headless: true, args:["--no-sandbox","--disable-setuid-sandbox"]});
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
				sendAlert("Successfully printed paystub. Please check your local printer");
			}
			catch(err) {
				logger.error(err.message);
				sendAlert("Could not retrieve Paystub from website");
			}
	}
	// Prints Paystub
	async function print() { 
			const options = {
				printer: process.env.PRINTER,
				unix: ["-o landscape -o fit-to-page -o media=A4 -o page-ranges=1"]
			}			
			printer.print("Paystub.pdf",options)
			.then(logger.info("Paystub Printed"))
			.catch(console.error);
	}
	// Sends email alerts
	async function sendAlert(msg) 
	{	
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
>>>>>>> c02e7ff0e18aeee6e67ff6ad9e1ca0043e043df6

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
<<<<<<< HEAD
				to: [recipsSplit[recipient]],
=======
				to: [''], // Email to recipient goes here
>>>>>>> c02e7ff0e18aeee6e67ff6ad9e1ca0043e043df6
				subject: 'Paystub Confirmation',
				text: msg
			});
			logger.info("Email Successfully Sent");
			return Promise.resolve(1);

		} catch(error) {
<<<<<<< HEAD
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










=======
			logger.error(error.message);
		
		}
	}
	
	
 
	// Schedule script via node-cron
	// Default setting is set to run 11:30 AM @ every Thursday
	cron.schedule('30 10 * * 4', async() => {

  		// Login and screenshot paystub	
		await login(process.env.K_USERNAME,process.env.K_PASSWORD);

		// Print paystub
  		await print();	
	});
	
})();
>>>>>>> c02e7ff0e18aeee6e67ff6ad9e1ca0043e043df6
