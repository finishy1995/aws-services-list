import React, { Component } from 'react';
import { Layout, Menu, Icon, Checkbox } from 'antd';

const { SubMenu } = Menu;
const { Sider } = Layout;

class ServicesListSelect extends Component {
  rootSubmenuKeys = ['regions', 'services'];
  state = {
    openKeys: ['regions'],
    indeterminate: true,
    checkAll: false
  };
  
  handleChange(regionID) {
    this.props.changeRegionsChecked(regionID);
  }
  
  onClick = (clickKey) => {
    if (clickKey.keyPath[1] === 'regions')
    this.props.changeRegionsChecked(clickKey.key);
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
  
  regionsSubMenu() {
    var regionsList = [];
    for (var key in this.props.regionsList) {
      regionsList.push([key, this.props.regionsList[key]]);
    }
    
    return (
      <SubMenu key="regions" title={<span><Icon type="environment" /><span>Regions</span></span>}>
        { regionsList.map((arr) => <Menu.Item key={ arr[0] }><Checkbox onChange={ this.handleChange.bind( this, arr[0] ) } checked={ this.props.regionIfChecked(arr[0]) }>{ arr[1] }</Checkbox></Menu.Item>) }
      </SubMenu>
    );
  }
  
  render() {
    return (
      <Sider width={240} style={{ background: '#fff' }}>
        <Menu mode="inline" openKeys={this.state.openKeys} onOpenChange={this.onOpenChange} onClick={ this.onClick }>
          { this.regionsSubMenu() }
          <SubMenu key="services" title={<span><Icon type="cloud" /><span>Services (*)</span></span>}>
          </SubMenu>
        </Menu>
      </Sider>
    );
  }
}

export default ServicesListSelect;

// <Menu.Item key="5">Option 5</Menu.Item>
// <Menu.Item key="0"><Checkbox indeterminate={this.state.indeterminate} onChange={this.onCheckAllChange} checked={this.state.checkAll}>All</Checkbox></Menu.Item>
//             <Menu.Item key="6">Option 6</Menu.Item>
//             <SubMenu key="sub3" title="Submenu">
//               <Menu.Item key="7">Option 7</Menu.Item>
//               <Menu.Item key="8">Option 8</Menu.Item>
//             </SubMenu>
