import React, { Component } from 'react';
import { Layout, notification } from 'antd';
import ServicesListSelect from '../SubMenu/ServicesListSelect';
import ServicesListTools from '../Toolbar/ServicesListTools';
import ServicesListTable from '../Table/ServicesListTable';
import { loadData } from '../Tools/funcs';

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: 'Region Check Error',
    description: 'You can not check more than 6 regions. Please cancel some unnecessary regions check and try again.',
  });
};

class ServicesListBlock extends Component {
  state = {
    regionsList: {},
    regionsChecked: {},
    servicesStatus: {
      'Count': 0,
      'time': 0
    },
    servicesGroup: {}
  };
  
  constructor(props) {
    super(props);
    
    loadData("regionData", this, function(data, caller) {
      caller.setState({ regionsList: data });
      
      var updateRegionsChecked = caller.state.regionsChecked;
      for (var key in updateRegionsChecked) {
        updateRegionsChecked[key] = data[key];
      }
      caller.setState({ regionsChecked: updateRegionsChecked });
    });
    var checkedStr = props.defaultRegions.split(",");
    for (var i=0; i<checkedStr.length; i++) {
      this.state.regionsChecked[checkedStr[i]] = '';
    }
    
    loadData("servicesStatus", this, function(data, caller) {
      caller.setState({ servicesStatus: data });
    });
    
    loadData("servicesGroup", this, function(data, caller) {
      caller.setState({ servicesGroup: data });
    });
    
    this.changeRegionsChecked = this.changeRegionsChecked.bind(this);
    this.regionIfChecked = this.regionIfChecked.bind(this);
  }
  
  regionIfChecked(regionID) {
    return (regionID in this.state.regionsChecked) ? true : false;
  }
  
  changeRegionsChecked(regionID) {
    var updateRegionsChecked = this.state.regionsChecked;
    
    if (regionID in this.state.regionsChecked) {
      delete updateRegionsChecked[regionID];
      this.setState({ regionsChecked: updateRegionsChecked });
    } else if (Object.getOwnPropertyNames(this.state.regionsChecked).length > 5) {
      openNotificationWithIcon('error');
    } else {
      updateRegionsChecked[regionID] = this.state.regionsList[regionID];
      this.setState({ regionsChecked: updateRegionsChecked });
    }
    
    // TODO: Change the shown graph.
    console.log(this.state.regionsChecked);
  }
  
  render() {
    return (
      <Layout style={{ padding: '24px 0', background: '#fff', marginTop: '40px' }}>
        <ServicesListSelect regionsList={ this.state.regionsList } changeRegionsChecked={ this.changeRegionsChecked } regionIfChecked={ this.regionIfChecked } />
        <Layout style={{ background: '#fff' }}>
          <ServicesListTools lastUpdated={ this.state.servicesStatus.time } regionsChecked={ this.state.regionsChecked } servicesStatus={ this.state.servicesStatus } />
          <ServicesListTable regionsChecked={ this.state.regionsChecked } servicesStatus={ this.state.servicesStatus } servicesGroup={ this.state.servicesGroup } />
        </Layout>
      </Layout>
    );
  }
}

export default ServicesListBlock;
