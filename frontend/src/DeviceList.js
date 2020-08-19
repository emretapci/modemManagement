import React from 'react';
import './Buttons.css';

class DevicesList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			devices: [
			]
		};
		this.hostname = 'http://' + window.location.host.match(/^([^:]+)/)[1] + ':4001';
	}

	componentDidMount() {
		fetch(this.hostname + '/devices')
			.then(res => res.json())
			.then(res => {
				let devices = res;
				devices.forEach(device => device.state = 'free');
				fetch(this.hostname + '/filters')
					.then(res => res.json())
					.then(res => {
						res.mac.forEach(mac => {
							let device = devices.find(device2 => device2.mac == mac);
							device.state = 'restricted';
						});
						console.log(devices);
						this.setState({ devices });
					});
			});
	}

	render() {
		return (
			<div>
				{this.state.devices.map(device => (
					<div>
						<span className={'button ' + device.state} key={device.mac} onClick={() => this.deviceClicked(device)}>
							<span className="deviceName">{device.name}</span>
							{device.mac}
							<br />
							{device.hostname}
						</span>
					</div>
				))}
			</div>
		);
	}

	deviceClicked(device) {
		const prevState = device.state;
		device.state = 'pending';
		this.setState(this.state);

		if (prevState == 'restricted') {
			fetch(this.hostname + '/enable',
				{
					method: 'put',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						mac: device.mac
					})
				}).then(res => {
					if (res) {
						this.componentDidMount();
						this.forceUpdate();
					}
				});
		}
		else {
			fetch(this.hostname + '/disable',
				{
					method: 'put',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						mac: device.mac
					})
				}).then(res => {
					if (res) {
						this.componentDidMount();
						this.forceUpdate();
					}
				});
		}
	}
}

export default DevicesList;
