import React, { Component } from 'react';
import { Row, Col } from 'antd';
import ServicesListMenu from '../Menu/ServicesListMenu';
import ServicesListTools from '../Toolbar/ServicesListTools';
import ServicesListTable from '../Table/ServicesListTable';
import { deepCopy } from '../Tools/funcs';

class ServicesListBlock extends Component {
  regionsCheckedFlag = true;
  servicesCheckedFlag = true;
  state = {
    regionsChecked: {},
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
    
    var checkedStr = props.defaultRegions.split(",");
    for (var i=0; i<checkedStr.length; i++) {
      this.state.regionsChecked[checkedStr[i]] = '';
    }
    
    this.changeRegionsChecked = this.changeRegionsChecked.bind(this);
    this.changeServicesChecked = this.changeServicesChecked.bind(this);
  }
  
  setRegionsChecked() {
    if ((Object.getOwnPropertyNames(this.props.regionsList).length !== 0) && (this.regionsCheckedFlag)) {
      var updateRegionsChecked = this.state.regionsChecked;
      for (var key in updateRegionsChecked) {
        updateRegionsChecked[key] = this.props.regionsList[key];
      }
      
      this.regionsCheckedFlag = false;
      this.changeRegionsChecked(updateRegionsChecked);
    }
  }
  
  setServicesChecked() {
    if ((Object.getOwnPropertyNames(this.props.servicesGroup).length !== 0) && (this.servicesCheckedFlag)) {
      var updateServicesGroupChecked = this.state.servicesGroupChecked;
        
      for (var key in this.props.servicesGroup) {
        updateServicesGroupChecked[key] = {
          indeterminate: false,
          checkAll: true,
          uncheckNum: 0,
          checkNum: this.props.servicesGroup[key].length
        };
          
        updateServicesGroupChecked.All.checkNum += this.props.servicesGroup[key].length;
      }
      
      this.servicesCheckedFlag = false;
      this.changeServicesChecked(deepCopy(this.props.servicesGroup), updateServicesGroupChecked);
    }
  }
  
  changeServicesChecked(updateServicesChecked, updateServicesGroupChecked) {
    this.setState({ servicesChecked: updateServicesChecked, servicesGroupChecked: updateServicesGroupChecked });
  }
  
  changeRegionsChecked(updateRegionsChecked) {
    this.setState({ regionsChecked: updateRegionsChecked });
  }
  
  render() {
    this.setRegionsChecked();
    this.setServicesChecked();
    
    return (
      <div className="site-block">
        <Row>
          <Col span={24}>
            <ServicesListTools
              time={ this.props.servicesStatus.time }
              regionsChecked={ this.state.regionsChecked }
              servicesStatus={ this.props.servicesStatus }
              servicesChecked={ this.state.servicesChecked }
            />
          </Col>
          <Col xs={24} sm={10} md={8} lg={6} xl={5} xxl={4}>
            <ServicesListMenu
              regionsList={ this.props.regionsList }
              regionsChecked={ this.state.regionsChecked }
              changeRegionsChecked={ this.changeRegionsChecked }
              servicesGroup={ this.props.servicesGroup }
              servicesGroupChecked={ this.state.servicesGroupChecked }
              servicesChecked={ this.state.servicesChecked }
              changeServicesChecked={ this.changeServicesChecked }
            />
          </Col>
          <Col xs={24} sm={14} md={16} lg={18} xl={19} xxl={20}>
            <ServicesListTable
              regionsChecked={ this.state.regionsChecked }
              servicesStatus={ this.props.servicesStatus }
              servicesChecked={ this.state.servicesChecked }
              servicesGroup={ this.props.servicesGroup }
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ServicesListBlock;
