import React, { Component } from 'react';
import { Row, Col, Select } from 'antd';
import SearchCard from '../Card/SearchCard'

const { Option, OptGroup } = Select;

class SearchSelect extends Component {
  state = {
    regions: [],
    services: []
  }
  
  regionsOption() {
    var select = [];
    
    for (var key in this.props.regionsList) {
      select.push(<Option key={ key } title={ this.props.regionsList[key] }>{ this.props.regionsList[key] + " (" + key + ")" }</Option>);
    }
    
    return select;
  }
  
  servicesOption() {
    var select = [];
    
    for (var key in this.props.servicesGroup) {
      select.push(
        <OptGroup label={ key } key={ key }>
          { this.props.servicesGroup[key].map((str) => (
            <Option key={ str }>{ str }</Option>
          )) }
        </OptGroup>
      );
    }
    
    return select;
  }
  
  regionSelect = (key) => {
    var updateRegions = this.state.regions;
    updateRegions.push(key);
    
    this.setState({ regions: updateRegions});
  }
  
  regionDeselect = (key) => {
    for (var i=0; i<this.state.regions.length; i++)
      if (this.state.regions[i] === key) {
        var updateRegions = this.state.regions;
        updateRegions.splice(i, 1);
        this.setState({ regions: updateRegions });
        
        break;
      }
  }
  
  serviceSelect = (key) => {
    var updateServices = this.state.services;
    updateServices.push(key);
    
    this.setState({ services: updateServices});
  }
  
  serviceDeselect = (key) => {
    for (var i=0; i<this.state.services.length; i++)
      if (this.state.services[i] === key) {
        var updateServices = this.state.services;
        updateServices.splice(i, 1);
        this.setState({ services: updateServices });
        
        break;
      }
  }
  
  generalResult() {
    var result = { region: this.state.regions.length, service: this.state.services.length, item: {} };
    
    if (this.state.regions.length === 2) {
      result.regionName = [this.props.regionsList[this.state.regions[0]], this.props.regionsList[this.state.regions[1]]];
      
      if (this.state.services.length === 0) {
        for (var key in this.props.servicesStatus.Items) {
          if (this.props.servicesStatus.Items[key][this.state.regions[0]] !== this.props.servicesStatus.Items[key][this.state.regions[1]]) {
            result.item[key] = [];
            result.item[key][0] = this.props.servicesStatus.Items[key][this.state.regions[0]];
            result.item[key][1] = this.props.servicesStatus.Items[key][this.state.regions[1]];
          }
        }
      } else {
        for (var i=0; i<result.service; i++) {
          result.item[this.state.services[i]] = [];
          result.item[this.state.services[i]][0] = this.props.servicesStatus.Items[this.state.services[i]][this.state.regions[0]];
          result.item[this.state.services[i]][1] = this.props.servicesStatus.Items[this.state.services[i]][this.state.regions[1]];
        }
      }
    } else if (this.state.regions.length === 1) {
      result.regionName = [this.props.regionsList[this.state.regions[0]]];
      
      if (this.state.services.length === 0) {
        for (key in this.props.servicesStatus.Items)
          if (this.props.servicesStatus.Items[key][this.state.regions[0]] === '1')
            result.item[key] = ['1'];
      } else {
        for (i=0; i<result.service; i++)
          if (this.props.servicesStatus.Items[this.state.services[i]][this.state.regions[0]] === '1') {
            result.item[this.state.services[i]] = ['1'];
          } else {
            result.item[this.state.services[i]] = ['0'];
          }
      }
    } else if ((this.state.regions.length === 0) && (this.state.services.length > 0)) {
      var regionsFlag = {};
      for (key in this.props.regionsList)
        regionsFlag[key] = true;
      
      for (i=0; i<result.service; i++)
        for (key in this.props.servicesStatus.Items[this.state.services[i]])
          if ((this.props.servicesStatus.Items[this.state.services[i]][key] === '0') && (regionsFlag[key]))
            regionsFlag[key] = false;
            
      for (key in regionsFlag)
        if (regionsFlag[key])
          result.item[key] = this.props.regionsList[key];
    }
    
    return result;
  }
  
  render() {
    return (
      <div style={{ padding: '24px 24px 4px 24px' }}>
        <Row gutter={{ xs: 0, sm: 0, md: 16, lg: 24, xl: 40, xxl: 56 }}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{ marginBottom: '24px' }}>
            <Select
              mode="multiple"
              placeholder="Please select region(s)"
              style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={ (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 }
              onSelect={ this.regionSelect }
              onDeselect={ this.regionDeselect }
            >
              { this.regionsOption() }
            </Select>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{ marginBottom: '24px' }}>
            <Select
              mode="multiple"
              placeholder="Please select service(s)"
              style={{ width: '100%' }}
              onSelect={ this.serviceSelect }
              onDeselect={ this.serviceDeselect }
            >
              { this.servicesOption() }
            </Select>
          </Col>
        </Row>
        <SearchCard
          result={ this.generalResult() }
        />
      </div>
    );
  }
}

export default SearchSelect;
