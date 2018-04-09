import React, { Component } from 'react';
import { Layout, notification } from 'antd';
import ServicesListSelect from '../SubMenu/ServicesListSelect';
import ServicesListTools from '../Toolbar/ServicesListTools';
import ServicesListTable from '../Table/ServicesListTable';
import { loadData, deepCopy } from '../Tools/funcs';

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
    servicesGroup: {},
    servicesChecked: {},
    servicesGroupChecked: {
      'All': {
        indeterminate: false,
        checkAll: true,
        uncheckNum: 0,
        checkNum: 0
      }
    }
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
      var tableServicesStatus = [];
      
      for (var i=0; i<data.Count; i++) {
	      if (!tableServicesStatus.hasOwnProperty(data.Items[i].service.S)) 
	        tableServicesStatus[data.Items[i].service.S] = [];

		    tableServicesStatus[data.Items[i].service.S][data.Items[i].region.S] = data.Items[i].status.N;
      }
    
      caller.setState({ servicesStatus: { 'Count': data.Count, 'time': data.time, 'Items': tableServicesStatus  } });
    });
    
    loadData("servicesGroup", this, function(data, caller) {
      var updateServicesGroupChecked = caller.state.servicesGroupChecked;
      for (var key in data) {
        updateServicesGroupChecked[key] = {
          indeterminate: false,
          checkAll: true,
          uncheckNum: 0,
          checkNum: data[key].length
        };
        
        updateServicesGroupChecked.All.checkNum++;
      }
      
      caller.setState({ servicesGroup: data, servicesChecked: deepCopy(data), servicesGroupChecked: updateServicesGroupChecked });
    });
    
    this.changeRegionsChecked = this.changeRegionsChecked.bind(this);
    this.regionIfChecked = this.regionIfChecked.bind(this);
    this.changeServicesChecked = this.changeServicesChecked.bind(this);
    this.serviceIfChecked = this.serviceIfChecked.bind(this);
    this.changeServicesGroupChecked = this.changeServicesGroupChecked.bind(this);
  }
  
  serviceIfChecked(service, type) {
    if ((type === 'group') && (service in this.state.servicesChecked))
      return true;
    if (type in this.state.servicesChecked) {
      for (var i=0; i<this.state.servicesChecked[type].length; i++) {
        if (this.state.servicesChecked[type][i] === service) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  regionIfChecked(regionID) {
    return (regionID in this.state.regionsChecked) ? true : false;
  }
  
  changeServicesChecked(type, service) {
    var updateServicesChecked = this.state.servicesChecked;
    var updateServicesGroupChecked = this.state.servicesGroupChecked;
    
    if (type === 'services') {
      if (updateServicesGroupChecked.All.checkAll === true) {
        updateServicesChecked = {};
        for (var key in updateServicesGroupChecked) {
          updateServicesGroupChecked[key].uncheckNum = updateServicesGroupChecked[key].uncheckNum + updateServicesGroupChecked[key].checkNum;
          updateServicesGroupChecked[key].checkNum = 0;
          updateServicesGroupChecked[key].indeterminate = false;
          updateServicesGroupChecked[key].checkAll = false;
        }
      } else {
        updateServicesChecked = deepCopy(this.state.servicesGroup);
        for (key in updateServicesGroupChecked) {
          updateServicesGroupChecked[key].checkNum = updateServicesGroupChecked[key].uncheckNum + updateServicesGroupChecked[key].checkNum;
          updateServicesGroupChecked[key].uncheckNum = 0;
          updateServicesGroupChecked[key].indeterminate = false;
          updateServicesGroupChecked[key].checkAll = true;
        }
      }
      
      this.setState({ servicesChecked: updateServicesChecked, servicesGroupChecked: updateServicesGroupChecked });
      return;
    }
    
    if (type in updateServicesChecked) {
      var flag = true;
      for (var i=0; i<updateServicesChecked[type].length; i++) {
        if (updateServicesChecked[type][i] === service) {
          updateServicesChecked[type].splice(i, 1);
          updateServicesGroupChecked[type].checkNum--;
          updateServicesGroupChecked[type].uncheckNum++;
          if (updateServicesGroupChecked[type].uncheckNum === 1) {
            updateServicesGroupChecked.All.checkNum--;
            updateServicesGroupChecked.All.uncheckNum++;
          }
          
          flag = false;
          break;
        }
      }
      if (flag) {
        updateServicesChecked[type].push(service);
        updateServicesGroupChecked[type].checkNum++;
        updateServicesGroupChecked[type].uncheckNum--;
        
        if (updateServicesGroupChecked[type].uncheckNum === 0) {
            updateServicesGroupChecked.All.checkNum++;
            updateServicesGroupChecked.All.uncheckNum--;
        }
      }
    } else {
      updateServicesChecked[type] = [service];
      updateServicesGroupChecked[type].checkNum++;
      updateServicesGroupChecked[type].uncheckNum--;
      
      if (updateServicesGroupChecked[type].uncheckNum === 0) {
        updateServicesGroupChecked.All.checkNum++;
        updateServicesGroupChecked.All.uncheckNum--;
      }
    }
    
    if (updateServicesGroupChecked[type].checkNum === 0) {
      updateServicesGroupChecked[type].indeterminate = false;
      updateServicesGroupChecked[type].checkAll = false;
    } else if (updateServicesGroupChecked[type].uncheckNum === 0) {
      updateServicesGroupChecked[type].indeterminate = false;
      updateServicesGroupChecked[type].checkAll = true;
    } else {
      updateServicesGroupChecked[type].indeterminate = true;
      updateServicesGroupChecked[type].checkAll = false;
    }
    
    if (updateServicesGroupChecked.All.checkNum === 0) {
      updateServicesGroupChecked.All.indeterminate = false;
      updateServicesGroupChecked.All.checkAll = false;
    } else if (updateServicesGroupChecked.All.uncheckNum === 0) {
      updateServicesGroupChecked.All.indeterminate = false;
      updateServicesGroupChecked.All.checkAll = true;
    } else {
      updateServicesGroupChecked.All.indeterminate = true;
      updateServicesGroupChecked.All.checkAll = false;
    }
    
    this.setState({ servicesChecked: updateServicesChecked, servicesGroupChecked: updateServicesGroupChecked });
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
  }
  
  changeServicesGroupChecked(type) {
    var updateServicesChecked = this.state.servicesChecked;
    var updateServicesGroupChecked = this.state.servicesGroupChecked;
    
    if (updateServicesGroupChecked[type].checkAll) {
      updateServicesChecked[type] = [];

      updateServicesGroupChecked[type].uncheckNum = updateServicesGroupChecked[type].uncheckNum + updateServicesGroupChecked[type].checkNum;
      updateServicesGroupChecked[type].checkNum = 0;
      updateServicesGroupChecked[type].indeterminate = false;
      updateServicesGroupChecked[type].checkAll = false;
    } else {
      updateServicesChecked[type] = deepCopy(this.state.servicesGroup[type]);
      
      updateServicesGroupChecked[type].checkNum = updateServicesGroupChecked[type].uncheckNum + updateServicesGroupChecked[type].checkNum;
      updateServicesGroupChecked[type].uncheckNum = 0;
      updateServicesGroupChecked[type].indeterminate = false;
      updateServicesGroupChecked[type].checkAll = true;
    }
    
    this.setState({ servicesChecked: updateServicesChecked, servicesGroupChecked: updateServicesGroupChecked });
  }
  
  render() {
    return (
      <Layout style={{ padding: '24px 0', background: '#fff', marginTop: '40px' }}>
        <ServicesListSelect
          regionsList={ this.state.regionsList }
          changeRegionsChecked={ this.changeRegionsChecked }
          regionIfChecked={ this.regionIfChecked }
          servicesGroup={ this.state.servicesGroup }
          changeServicesChecked={ this.changeServicesChecked }
          serviceIfChecked={ this.serviceIfChecked }
          servicesGroupChecked={ this.state.servicesGroupChecked }
          changeServicesGroupChecked={ this.changeServicesGroupChecked }
        />
        <Layout style={{ background: '#fff' }}>
          <ServicesListTools
            lastUpdated={ this.state.servicesStatus.time }
            regionsChecked={ this.state.regionsChecked }
            servicesStatus={ this.state.servicesStatus }
          />
          <ServicesListTable
            regionsChecked={ this.state.regionsChecked }
            servicesStatus={ this.state.servicesStatus }
            servicesGroup={ this.state.servicesGroup }
          />
        </Layout>
      </Layout>
    );
  }
}

export default ServicesListBlock;
