#!/bin/bash

# Launch Node Script
node Paystub.js

# Printer variable
PRINTER=""

# Print Paystub PDF
lpr -P $PRINTER -o page-ranges=1 Paystub.pdf
echo "Paystub Printed"
