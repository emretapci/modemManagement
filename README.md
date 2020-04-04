# modemManagement
backend API for HUAWEI HG255s modem management
manages device LAN access.

## GET /devices
returns all devices registered on the modem

## GET /filters
returns all MAC filters registered on the modem

## PUT /filters
sets a MAC filter on the modem  
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
name an existing device  
body:  
```
{
	mac: <mac>,
	name: <name>
}
```

## PUT /enable
enable a device  
body:  
```
{
	mac: <mac address>
	OR
	name: <name>
}
```

## PUT /enable
disable a device  
body:  
```
{
	mac: <mac address>
	OR
	name: <name>
}
```

