import React, { Component } from 'react';
import { Popover, Button } from 'antd';

const tableDescription = (
  <div>
    <p style={{ textTransform: 'uppercase' }}>Unofficial data, just for reference.</p>
    <p>AWS Region Services Table. You can see all support services in specific regions in the following table.</p>
  </div>
);

class ServicesListTools extends Component {
  downloadCSVFile() {
    var str = "Services Offered,";
    for (var key in this.props.regionsChecked) {
      str += this.props.regionsChecked[key]+",";
    }
    str += "\n";
    
    for (key in this.props.servicesStatus.Items) {
      str += key+",";
      for (var regionKey in this.props.regionsChecked) {
        if (this.props.servicesStatus.Items[key][regionKey] === '0') {
				  str += "×,";
        } else if (this.props.servicesStatus.Items[key][regionKey] === '1') {
          str += "√,";
        } else {
          str += this.props.servicesStatus.Items[key][regionKey] + ',';
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
