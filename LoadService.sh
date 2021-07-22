#!/bin/bash
sudo cp Paystub.service /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable Paystub
sudo systemctl restart Paystub
echo Paystub Service loaded! 
