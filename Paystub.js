// Import Environmental Variables
require('dotenv').config({path: './.env'});

const winston = require('winston');
const puppeteer = require('puppeteer');
const fs = require('fs');
const http =  require('http');
const printer = require('pdf-to-printer'); 
const mailer = require('nodemailer');
const cron = require('node-cron');

// Create Logger 
const logger = winston.createLogger({
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

		});
		try {
			let message =  sender.sendMail({
				from: `"Schedule Bot" ${process.env.EMAIL}`,
				to: [''], // Email to recipient goes here
				subject: 'Paystub Confirmation',
				text: msg
			});
			logger.info("Email Successfully Sent");

		} catch(error) {
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
