# SecureWEB Paycheck Printing Utility

NodeJS application that screenshots and prints out Paycheck every week providing user has a valid SecureWEB account

## Prerequisites
* Have a valid SecureWEB account with working credentials
* Have a Gmail account, and ensure than an ***app password*** is enabled on the account. This app password will be used within the `.env` file we will create, and will serve as the value for the **EMAIL_PASS** variable. 

## Enabling App Passwords on Gmail Account
* To enable an app password on a gmail account, consult these instructions [here](https://support.google.com/mail/answer/185833?hl=en-GB)

## Installation

Use the NodeJS package manager [npm](https://www.npmjs.com/) to install dependencies.

```bash
# Navigate to project root
[user@user1 ~]$ cd Paycheck-Printer/

# Install dependencies via NPM
[user@user1 Paycheck-Printer]$ npm install
```

## Configure Environment Variables
Follow steps below to set environment variables needed for application:
```bash
# Create .env file
[user@user1 Paycheck-Printer]$ touch .env

# With text editor, edit .env file and fill in values for environment variables
[user@user1 Paycheck-Printer]$ vi .env

K_USERNAME=yourusername
K_PASSWORD=yourpassword
HR_LINK=hrlink
PAYSTUB_LINK=paystublink
CALENDAR_LINK=calendarlink
EMAIL=emailaddress
EMAIL_PASS=emailapppassword
PRINTER=printername
~                                                                                                                           
~                                                                                                                           
~                                                                                                                                                                                                                                        
".env" [readonly] 9L, 332B     
```
After filling in the environmental variables, save the .env file

## Standalone Usage
Run as a standalone script

```bash
[user@user1 Paycheck-Printer]$ node Paystub.js
```

## Usage as a Service
Run as a service in the background
```bash
# Make sure LoadService.sh has executable permissions
[user@user1 Paycheck-Printer]$ chmod u+x LoadService.sh

# Execute script
[user@user1 Paycheck-Printer]$ sh ./LoadService.sh 

# Confirm NodeJS service is working in background
[user@user1 Paycheck-Printer]$ sudo systemctl status Paystub

# Example output 
● Paystub.service - Automates Paystub retrieval and Paystub Printing
     Loaded: loaded (/usr/lib/systemd/system/Paystub.service; enabled; vendor preset: disabled)
     Active: active (running) since Thu 2021-07-22 13:05:17 EDT; 11s ago
   Main PID: 13480 (node)
      Tasks: 11 (limit: 8773)
     Memory: 15.5M
        CPU: 700ms
     CGroup: /system.slice/Paystub.service
             └─13480 /usr/local/bin/node /opt/node-apps/Paycheck-Printer/Paystub.js
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
