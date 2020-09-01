# Home utilities
Backend API for HUAWEI HG255s modem management and home utilities.  
Manages Internet access of devices on the LAN and more.  
To start as a docker container, in the project directory, simply run:  
```
docker build --no-cache --tag homeutils . && docker run --restart always --name homeutils -p 4001:4001 -d homeutils
```
and access the application from any device on the LAN from `http://<hostIP>:4001`

# API

## GET /devices
Get all devices  

## GET /filters
Get all MAC filters registered on the modem  

## PUT /filters
Set a MAC filter on the modem  
body:  
```
{
	mac: [
		<mac address> *
	],
	days: {
		mon: '8:00-10:00', //allowed time interval for monday
		tue: '10:00-11:00',
		thu: '10:00-11:00'
	}
	OR
	days: '8:00-10:00' //allowed time interval for all days of the week
}
```

## PUT /name
Give a descriptive name to an existing device  
body:  
```
{
	mac: <mac>,
	name: <name>
}
```

## PUT /enable
Enable Internet access for a device  
body:  
```
{
	mac: <mac address>
}
```

## PUT /disable
Disable Internet access for a device  
body:  
```
{
	mac: <mac address>
}
```
