import React, { Component } from 'react';
import { Layout, Menu, Icon, Checkbox, Popover, Button } from 'antd';
import './ServicesListSelect.css';

const { SubMenu } = Menu;
const { Sider } = Layout;

const tempContent = (
  <p>
    Here will show service brief introduction and service AWS website link, for example <a href="https://aws.amazon.com/ec2/">https://aws.amazon.com/ec2/</a>.
  </p>
);

class ServicesListSelect extends Component {
  rootSubmenuKeys = ['regions', 'services'];
  state = {
    openKeys: ['regions']
  };
  
  servicesGroupContent(type) {
    return (
      <Button type="primary" size="small" onClick={ this.changeServicesGroupChecked } value={ type }>{ this.props.servicesGroupChecked[type].checkAll ? 'Unselect' : 'Select' }</Button>
    );
  }
  
  changeServicesGroupChecked = (e) => {
    this.props.changeServicesGroupChecked(e.target.value);
  }
  
  onClick = (clickKey) => {
    if (clickKey.keyPath[1] === 'regions') {
      this.props.changeRegionsChecked(clickKey.key);
    } else {
      this.props.changeServicesChecked(clickKey.keyPath[1], clickKey.key);
    }
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
        {regionsList.map((arr) =>
          <Menu.Item key={ arr[0] }>
            <Checkbox checked={ this.props.regionIfChecked(arr[0]) }></Checkbox>
            <Popover placement="bottomLeft" content={ "AWS Region ID: " + arr[0] } title={ arr[1] } trigger="hover">
              <span className="menuItemSpan">{ arr[1] }</span>
            </Popover></Menu.Item>
        )}
      </SubMenu>
    );
  }
  
  onTitleClick = (key) => {
    console.log(key);
  }
  
  servicesSubMenu() {
    var servicesGroupParent = [];
    for (var key in this.props.servicesGroup) {
      servicesGroupParent.push(key);
    }
    
    return (
      <SubMenu key="services" title={<span><Icon type="cloud" /><span>Services</span></span>}>
        <Menu.Item key="services-all" >
          <Checkbox
            indeterminate={ this.props.servicesGroupChecked.All.indeterminate }
            checked={ this.props.servicesGroupChecked.All.checkAll }
          />
          <span className="menuItemSpan">Select All</span>
        </Menu.Item>
        {servicesGroupParent.map((str) =>
          <SubMenu key={ str } onTitleClick={ this.onTitleClick } title={
            <span>
              <Checkbox
                indeterminate={ this.props.servicesGroupChecked[str].indeterminate }
                checked={ this.props.servicesGroupChecked[str].checkAll }
              />
              <Popover placement="bottomLeft" content={ this.servicesGroupContent(str) } title={ str } trigger="hover">
                <span className="menuItemSpan">{ str }</span>
              </Popover>
            </span>
          }>
            {this.props.servicesGroup[str].map((item) =>
              <Menu.Item key={ item }>
                <Checkbox checked={ this.props.serviceIfChecked(item, str) } />
                <Popover placement="bottomLeft" content={ tempContent } title={ item } trigger="hover">
                  <span className="menuItemSpan">{ item }</span>
                </Popover>
              </Menu.Item>
            )}
          </SubMenu>
        )}
      </SubMenu>
    );
  }
  
  render() {
    return (
      <Sider width={240} style={{ background: '#fff' }}>
        <Menu mode="inline" openKeys={this.state.openKeys} onOpenChange={this.onOpenChange} onClick={ this.onClick }>
          { this.regionsSubMenu() }
          { this.servicesSubMenu() }
        </Menu>
      </Sider>
    );
  }
}

export default ServicesListSelect;
