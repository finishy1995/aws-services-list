import React, { Component } from 'react';
import { Layout } from 'antd';
import SearchBlock from '../Block/SearchBlock';
import ServicesListBlock from '../Block/ServicesListBlock';
import { loadData } from '../Tools/funcs';

const { Content } = Layout;

class HomePage extends Component {
  state = {
    defaultRegions: "us-east-1,us-west-2,cn-north-1,cn-northwest-1",
    regionsList: {},
    servicesStatus: {
      'Count': 0,
      'time': 0,
      'Items': {}
    },
    servicesGroup: {}
  }
  
  constructor(props) {
    super(props);
    
    this.loadRegionData();
    this.loadServicesStatus();
    this.loadServicesGroup();
  }
  
  loadRegionData() {
    loadData("regionData", this, function(data, caller) {
      caller.setState({ regionsList: data });
    });
  }
  
  loadServicesStatus() {
    loadData("servicesStatus", this, function(data, caller) {
      var tableServicesStatus = [];
      
      for (var i=0; i<data.Count; i++) {
	      if (!tableServicesStatus.hasOwnProperty(data.Items[i].service.S)) 
	        tableServicesStatus[data.Items[i].service.S] = [];

		    tableServicesStatus[data.Items[i].service.S][data.Items[i].region.S] = data.Items[i].status.N;
      }
    
      caller.setState({ servicesStatus: { 'Count': data.Count, 'time': data.time, 'Items': tableServicesStatus  } });
    });
  }
  
  loadServicesGroup() {
    loadData("servicesGroup", this, function(data, caller) {
      caller.setState({ servicesGroup: data });
    });
  }
  
  render() {
    return (
      <Content className="site-width">
        <SearchBlock
          servicesStatus={ this.state.servicesStatus }
          regionsList={ this.state.regionsList }
          servicesGroup={ this.state.servicesGroup }
        />
        <ServicesListBlock
          defaultRegions={ this.state.defaultRegions }
          regionsList={ this.state.regionsList }
          servicesStatus={ this.state.servicesStatus }
          servicesGroup={ this.state.servicesGroup }
        />
      </Content>
    );
  }
}

export default HomePage;
