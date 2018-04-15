import React, { Component } from 'react';
import { Row, Col } from 'antd';
import SearchTools from '../Toolbar/SearchTools';
import SearchSelect from '../Select/SearchSelect';

class SearchBlock extends Component {
  render() {
    return (
      <div className="site-block">
        <Row>
          <Col span={24}>
            <SearchTools
              time={ this.props.servicesStatus.time }
            />
          </Col>
          <Col span={24}>
            <SearchSelect
              regionsList={ this.props.regionsList }
              servicesGroup={ this.props.servicesGroup }
              servicesStatus={ this.props.servicesStatus }
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default SearchBlock;
