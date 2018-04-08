import React, { Component } from 'react';
import { Popover, Button } from 'antd';

const tableDescription = (
  <div>
    <p style={{ textTransform: 'uppercase' }}>Unofficial data, just for reference.</p>
    <p>AWS Region Services Table. You can see all support services in specific regions in the following table.</p>
  </div>
);

class ServicesListTools extends Component {
  handleServicesStatus() {
    var tableServicesStatus = [];
    
    for (var i=0; i<this.props.servicesStatus.Count; i++) {
	  if (!tableServicesStatus.hasOwnProperty(this.props.servicesStatus.Items[i].service.S))
	    tableServicesStatus[this.props.servicesStatus.Items[i].service.S] = [];

		tableServicesStatus[this.props.servicesStatus.Items[i].service.S][this.props.servicesStatus.Items[i].region.S] = this.props.servicesStatus.Items[i].status.N;
    }
    
    return tableServicesStatus;
  }
  
  downloadCSVFile() {
    console.log(this);
    var str = "Services Offered,";
    for (var key in this.props.regionsChecked) {
      str += this.props.regionsChecked[key]+",";
    }
    str += "\n";
    
    var tableServicesStatus = this.handleServicesStatus();
    for (key in tableServicesStatus) {
      str += key+",";
      for (var regionKey in this.props.regionsChecked) {
        if (tableServicesStatus[key][regionKey] === '0') {
				  str += "×,";
        } else if (tableServicesStatus[key][regionKey] === '1') {
          str += "√,";
        } else {
          str += tableServicesStatus[key][regionKey] + ',';
        }
      }
      
      str += "\n";
    }
    
    str = encodeURIComponent(str);
    return "data:text/csv;charset=utf-8,\ufeff"+str;
  }
  
  showTime() {
    var unixTimestamp = new Date(this.props.lastUpdated * 1000);
    
    return 'Last updated: ' + unixTimestamp.toLocaleString();
  }
  
  render() {
    return (
      <div style={{ padding: '4px 24px 24px 24px', borderBottom: '1px solid #e8e8e8' }}>
        <Popover placement="bottomLeft" content={ tableDescription } title={ this.showTime() } trigger="hover"><Button type="primary" size='large'>Region Services Table</Button></Popover>
        <Button type="primary" icon="download" size='large' style={{ float: 'right' }} href={ this.downloadCSVFile() } >Download .csv</Button>
      </div>
    );
  }
}

export default ServicesListTools;
