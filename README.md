# SecureWeb-node

SecureWeb-node is a nodeJS version of the SecureWeb-Kroger utility. Allows for one to retrieve, capture, and print work schedules and paystubs

## Installation

Navigate to the project folder 
```
cd SecureWeb-node
```
Use the package manager [npm](https://www.npmjs.com/get-npm) to install the dependencies found within the package.json file. Additionally, make sure [node](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) is installed as well. 

```bash
npm install
```

## Credential Configuration
Create an .env file inside of the project folder
```bash 
touch creds.env
```
Use your favorite text editor to enter credentials within .env file
```bash 
vi creds.env
```

Inside of the file, create environment variables and set them equal to your login credentials, URL, etc. 

```bash 
# These variables houses links that the selenium browser will navigate to
HR_LINK=https://yourhrlink
PAYSTUB_LINK=https://yourpaystublink
CALENDAR_LINK=https://yourcalendarlink

# Environmental Variable for port to host scraped HTML
PORT=yourport#

# Environmental Variables for credentials
USERNAME=YourUsername
PASSWORD=YourPassword
```
## Printer Configuration
Locate the Paystub.sh file and edit the Printer variable to the name of your personal printer
```bash
PRINTER="printernamegoeshere"
```
## Usage

```bash
# Run this script to get When2Work schedule screenshot and ICS file
node Schedule.js
```



## License
[MIT](https://choosealicense.com/licenses/mit/)
