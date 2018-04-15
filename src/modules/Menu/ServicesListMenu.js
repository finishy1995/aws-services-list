import React, { Component } from 'react';
import { notification, Menu, Icon, Checkbox } from 'antd';
import RegionsPopover from '../Popover/RegionsPopover';
import ServicesPopover from '../Popover/ServicesPopover';
import ServicesGroupPopover from '../Popover/ServicesGroupPopover';
import { deepCopy } from '../Tools/funcs';

const { SubMenu } = Menu;

const openNotificationWithIcon = (type) => {
  notification[type]({
    message: 'Region Check Error',
    description: 'You can not check more than 6 regions. Please cancel some unnecessary regions check and try again.',
  });
};

class ServicesListMenu extends Component {
  rootSubmenuKeys = ['regions', 'services'];
  state = {
    openKeys: ['regions']
  };
  
  setStyle() {
    if (document.body.clientWidth < 768) {
      return {
        borderBottom: '1px solid #e8e8e8',
        borderRight: 0
      };
    } else {
      return {
        minHeight: document.body.clientHeight + 80
      };
    }
  }
  
  changeToCheckAll(obj, key) {
    obj[key].checkNum = obj[key].uncheckNum + obj[key].checkNum;
    obj[key].uncheckNum = 0;
    obj[key].indeterminate = false;
    obj[key].checkAll = true;
  }
  
  changeToCheckSome(obj, key) {
    obj[key].indeterminate = true;
    obj[key].checkAll = false;
  }
  
  changeToCheckNone(obj, key) {
    obj[key].uncheckNum = obj[key].uncheckNum + obj[key].checkNum;
    obj[key].checkNum = 0;
    obj[key].indeterminate = false;
    obj[key].checkAll = false;
  }
  
  addOneItem(obj, key) {
    if (obj[key].uncheckNum === 1) {
      this.changeToCheckAll(obj, key);
    } else {
      obj[key].checkNum++;
      obj[key].uncheckNum--;
      
      if (obj[key].checkNum === 1)
        this.changeToCheckSome(obj, key);
    }
    
    if (key !== 'All')
      this.addOneItem(obj, 'All');
  }
  
  reduceOneItem(obj, key) {
    if (obj[key].checkNum === 1) {
      this.changeToCheckNone(obj, key);
    } else {
      obj[key].checkNum--;
      obj[key].uncheckNum++;
      
      if (obj[key].uncheckNum === 1)
        this.changeToCheckSome(obj, key);
    }
    
    if (key !== 'All')
      this.reduceOneItem(obj, 'All');
  }
  
  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }
  
  onClick = (clickKey) => {
    if (clickKey.keyPath[1] === 'regions') {
      var updateRegionsChecked = this.props.regionsChecked;
      
      if (clickKey.key in updateRegionsChecked) {
        delete updateRegionsChecked[clickKey.key];
      } else if (Object.getOwnPropertyNames(updateRegionsChecked).length > 5) {
        openNotificationWithIcon('error');
      } else {
        updateRegionsChecked[clickKey.key] = this.props.regionsList[clickKey.key];
      }
      
      this.props.changeRegionsChecked(updateRegionsChecked);
    } else {
      var updateServicesChecked = this.props.servicesChecked;
      var updateServicesGroupChecked = this.props.servicesGroupChecked;
      
      if (clickKey.keyPath[1] === 'services') {
        if (updateServicesGroupChecked.All.checkAll === true) {
          updateServicesChecked = {};
          for (var key in updateServicesGroupChecked)
            this.changeToCheckNone(updateServicesGroupChecked, key);
        } else {
          updateServicesChecked = deepCopy(this.props.servicesGroup);
          for (key in updateServicesGroupChecked)
            this.changeToCheckAll(updateServicesGroupChecked, key);
        }
      } else if (clickKey.key === 'group-all') {
        if (updateServicesGroupChecked[clickKey.keyPath[1]].checkAll === true) {
          delete updateServicesChecked[clickKey.keyPath[1]];
      
          var length = updateServicesGroupChecked[clickKey.keyPath[1]].checkNum;
          for (var i=0; i<length; i++)
            this.reduceOneItem(updateServicesGroupChecked, clickKey.keyPath[1]);
        } else {
          updateServicesChecked[clickKey.keyPath[1]] = deepCopy(this.props.servicesGroup[clickKey.keyPath[1]]);
      
          length = updateServicesGroupChecked[clickKey.keyPath[1]].uncheckNum;
          for (i=0; i<length; i++)
            this.addOneItem(updateServicesGroupChecked, clickKey.keyPath[1]);
        }
      } else if (clickKey.keyPath[1] in updateServicesChecked) {
        var flag = true;
        for (i=0; i<updateServicesChecked[clickKey.keyPath[1]].length; i++)
          if (updateServicesChecked[clickKey.keyPath[1]][i] === clickKey.key) {
            updateServicesChecked[clickKey.keyPath[1]].splice(i, 1);
            this.reduceOneItem(updateServicesGroupChecked, clickKey.keyPath[1]);
            flag = false;
            break;
          }
        
        if (flag) {
          updateServicesChecked[clickKey.keyPath[1]].push(clickKey.key);
          this.addOneItem(updateServicesGroupChecked, clickKey.keyPath[1]);
        }
      } else {
        updateServicesChecked[clickKey.keyPath[1]] = [clickKey.key];
        this.addOneItem(updateServicesGroupChecked, clickKey.keyPath[1]);
      }
      
      this.props.changeServicesChecked(updateServicesChecked, updateServicesGroupChecked);
    }
  }
  
  regionIfChecked(regionID) {
    return (regionID in this.props.regionsChecked) ? true : false;
  }
  
  regionsSubMenu() {
    var regionsList = [];
    for (var key in this.props.regionsList) {
      regionsList.push([key, this.props.regionsList[key]]);
    }
    
    return (
      <SubMenu
        key="regions"
        title={<span><Icon type="environment" /><span>Regions</span></span>}
        parentMenu={ this.props.parentMenu }
      >
        { regionsList.map((arr) => (
          <Menu.Item key={ arr[0] }>
            <Checkbox checked={ this.regionIfChecked(arr[0]) }></Checkbox>
            <RegionsPopover
              regionsID={ arr[0] }
              regionsName={ arr[1] }
              className="menuItemSpan"
            />
          </Menu.Item>
        )) }
      </SubMenu>
    );
  }
  
  serviceIfChecked(service, type) {
    if (type in this.props.servicesChecked) {
      for (var i=0; i<this.props.servicesChecked[type].length; i++) {
        if (this.props.servicesChecked[type][i] === service) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  servicesSubMenu() {
    var servicesGroupParent = [];
    for (var key in this.props.servicesGroup) {
      servicesGroupParent.push(key);
    }
    
    return (
      <SubMenu
        key="services"
        title={<span><Icon type="cloud" /><span>Services</span></span>}
      >
        <Menu.Item key="services-all" >
          <Checkbox
            indeterminate={ this.props.servicesGroupChecked.All.indeterminate }
            checked={ this.props.servicesGroupChecked.All.checkAll }
          />
          <span className="menuItemSpan">Select All</span>
        </Menu.Item>
        { servicesGroupParent.map((str) => (
          <SubMenu key={ str } title={
            <ServicesGroupPopover
              groupName={ str }
              className="menuItemSpan"
            />
          }>
            <Menu.Item key="group-all">
              <Checkbox
                indeterminate={ this.props.servicesGroupChecked[str].indeterminate }
                checked={ this.props.servicesGroupChecked[str].checkAll }
              />
              <span className="menuItemSpan">Select All</span>
            </Menu.Item>
            { this.props.servicesGroup[str].map((item) => (
              <Menu.Item key={ item }>
                <Checkbox checked={ this.serviceIfChecked(item, str) } />
                <ServicesPopover
                  servicesName={ item }
                  className="menuItemSpan"
                >
                </ServicesPopover>
              </Menu.Item>
            )) }
          </SubMenu>
        )) }
      </SubMenu>
    );
  }
  
  render() {
    return (
      <Menu
        mode="inline"
        openKeys={ this.state.openKeys }
        onOpenChange={ this.onOpenChange }
        onClick={ this.onClick }
        style={ this.setStyle() }
      >
        { this.regionsSubMenu() }
        { this.servicesSubMenu() }
      </Menu>
    );
  }
}

export default ServicesListMenu;
