import React, { Component } from 'react';
import { Button } from 'antd';
import ToolbarTitle from './ToolbarTitle';

const tableDescription = (
  <div className="toolbarDescription">
    <p className="toolbarNotification">Unofficial data, just for reference.</p>
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
    
    for (key in this.props.servicesChecked) {
      for (var i=0; i<this.props.servicesChecked[key].length; i++) {
        str += this.props.servicesChecked[key][i]+",";
        if (!(this.props.servicesChecked[key][i] in this.props.servicesStatus.Items)) {
          str += "\n";
          continue;
        }
        
        for (var regionKey in this.props.regionsChecked) {
          if (this.props.servicesStatus.Items[this.props.servicesChecked[key][i]][regionKey] === '0') {
  				  str += "×,";
          } else if (this.props.servicesStatus.Items[this.props.servicesChecked[key][i]][regionKey] === '1') {
            str += "√,";
          } else {
            str += this.props.servicesStatus.Items[this.props.servicesChecked[key][i]][regionKey] + ',';
          }
        }
        
        str += "\n";
      }
    }
    
    str = encodeURIComponent(str);
    return "data:text/csv;charset=utf-8,\ufeff"+str;
  }
  
  render() {
    return (
      <div className="toolbarDiv">
        <ToolbarTitle
          pcTitle="Region Services Table"
          mobileTitle="Table"
          content={ tableDescription }
          time={ this.props.time }
        />
        
        <Button type="primary" icon="download" size='large' style={{ float: 'right' }} href={ this.downloadCSVFile() } className="site-pc">Download .csv</Button>
        <Button type="primary" shape="circle" icon="download" size='large' style={{ float: 'right' }} href={ this.downloadCSVFile() } className="site-mobile" />
      </div>
    );
  }
}

export default ServicesListTools;
