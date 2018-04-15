import React, { Component } from 'react';
import { Table, Icon } from 'antd';
import './ServicesListTable.css';

const colorMapping = {
  'check': '#00FF80',
  'close': '#FE4C40'
};

function getServicesWidth() {
  if (document.body.clientWidth < 480) {
    return 160;
  } else if (document.body.clientWidth < 768) {
    return 200;
  } else if (document.body.clientWidth < 1000) {
    return 240;
  } else if (document.body.clientWidth < 1600) {
    return 300;
  } else {
    return 400;
  }
}

function getRegionsWidth() {
  if (document.body.clientWidth < 480) {
    return 100;
  } else if (document.body.clientWidth < 768) {
    return 120;
  } else if (document.body.clientWidth < 1000) {
    return 140;
  } else {
    return 160;
  }
}

class ServicesListTable extends Component {
  loading = true;
  servicesWidth = getServicesWidth();
  regionsWidth = getRegionsWidth();
  count = 0;

  pageSizeOptions() {
    if (this.count > 40) {
      return [
        '10',
        '20',
        '40',
        this.count.toString()
      ];
    } else {
      return [
        '10',
        '20',
        '40'
      ];
    }
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
      width: this.servicesWidth,
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
        width: this.regionsWidth,
        render: text => ( <Icon type={text} style={{ color: colorMapping[text], fontWeight: 900 }} /> )
      });
    }
    
    return columns;
  }
  
  tableData() {
    var data = [];
    
    if ((this.props.servicesStatus.Count > 0) && (this.props.servicesChecked !== {})) {
      var count = 0;
      
      for (var key in this.props.servicesGroup) {
        if (!(key in this.props.servicesChecked))
          continue;
        for (var i=0; i<this.props.servicesGroup[key].length; i++) {
          var flag = false;
          for (var j=0; j<this.props.servicesChecked[key].length; j++) {
            if (this.props.servicesChecked[key][j] === this.props.servicesGroup[key][i]) {
              flag = true;
              break;
            }
          }
          
          if (flag) {
            var serviceItem = {
              key: count,
              services: this.props.servicesChecked[key][j]
            };
            count++;
            for (var regionKey in this.props.regionsChecked) {
              switch (this.props.servicesStatus.Items[this.props.servicesChecked[key][j]][regionKey]) {
                case '0':
                  serviceItem[regionKey] = 'close';
                  break;
                case '1':
                  serviceItem[regionKey] = 'check';
                  break;
                default:
                  serviceItem[regionKey] = '';
              }
            }
            data.push(serviceItem);
          }
        }
      }
      
      this.count = count;
      this.loading = false;
    }
    
    return data;
  }
  
  render() {
    return (
      <div style={{ padding: '24px 24px 4px 24px' }}>
        <Table
          columns={ this.tableColumns() }
          dataSource={ this.tableData() }
          pagination={{ pageSize: 20, showSizeChanger: true, pageSizeOptions: this.pageSizeOptions() }}
          scroll={{ y: document.body.clientHeight - 100, x: this.servicesWidth + this.regionsWidth *  Object.getOwnPropertyNames(this.props.regionsChecked).length}}
          loading={ this.loading }
        />
      </div>
    );
  }
}

export default ServicesListTable;
