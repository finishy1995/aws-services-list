import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import './ServicesListTable.css';

class ServicesListTable extends Component {
  loading = true;
  
  handleServicesStatus() {
    var tableServicesStatus = [];
    
    for (var i=0; i<this.props.servicesStatus.Count; i++) {
	  if (!tableServicesStatus.hasOwnProperty(this.props.servicesStatus.Items[i].service.S))
	    tableServicesStatus[this.props.servicesStatus.Items[i].service.S] = [];

		tableServicesStatus[this.props.servicesStatus.Items[i].service.S][this.props.servicesStatus.Items[i].region.S] = this.props.servicesStatus.Items[i].status.N;
    }
    
    return tableServicesStatus;
  }

  tableColumns() {
    var servicesFilters = [];
    for (var key in this.props.servicesGroup) {
      servicesFilters.push({
        text: key,
        value: key
      });
    }
      
    var columns = [{
      title: 'Services Offered',
      dataIndex: 'services',
      key: 'services',
      fixed: 'left',
      width: 400,
      filters: servicesFilters,
      onFilter: (value, record) => record.services.indexOf(value) === 0,
      render: text => <span className="serviceListTableItem">{text}</span>
    }];
    for (key in this.props.regionsChecked) {
      columns.push({
        title: this.props.regionsChecked[key],
        dataIndex: key,
        key: key,
        align: 'center',
        width: 150,
        render: text => <Icon type={text} />
      });
    }
    
    return columns;
  }
  
  tableData() {
    var data = [];
    
    if ((this.props.servicesStatus.Count > 0) && (this.props.servicesGroup !== {})) {
      var count = 0;
      var tableServicesStatus = this.handleServicesStatus();
      
      for (var key in this.props.servicesGroup) {
        var groupItem = {
          key: count,
          services: key,
          children: []
        };
        count++;
        for (var regionKey in this.props.regionsChecked) {
          groupItem[regionKey] = '';
        }
        
        for (var i=0; i<this.props.servicesGroup[key].length; i++) {
          var serviceItem = {
            key: count,
            services: this.props.servicesGroup[key][i]
          };
          count++;
          for (regionKey in this.props.regionsChecked) {
            switch (tableServicesStatus[this.props.servicesGroup[key][i]][regionKey]) {
              case '0':
                serviceItem[regionKey] = 'check';
                break;
              case '1':
                serviceItem[regionKey] = 'close';
                break;
              default:
                serviceItem[regionKey] = '';
            }
          }
          groupItem.children.push(serviceItem);
        }
        
        data.push(groupItem);
      }
      this.loading = false;
    }
    
    return data;
  }
  
  render() {
    return (
      <div style={{ padding: '24px 24px 4px 24px' }}>
        <Table columns={ this.tableColumns() } dataSource={ this.tableData() } pagination={{ pageSize: 10 }} scroll={{ y: 800, x: 900 }} loading={ this.loading }/>
      </div>
    );
  }
}

export default ServicesListTable;
