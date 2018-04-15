import React, { Component } from 'react';
import { Popover, Icon } from 'antd';
import './ToolbarTitle.css';

class ToolbarTitle extends Component {
  showTime() {
    var unixTimestamp = new Date(this.props.time * 1000);
    
    return 'Last updated: ' + unixTimestamp.toLocaleString();
  }
  
  render() {
    return (
      <span>
        <span className="site-pc">
          <h2 className="toolbarTitle">
            { this.props.pcTitle }
          </h2>
        </span>
        <span className="site-mobile">
          <h2 className="toolbarTitle">
            { this.props.mobileTitle }
          </h2>
        </span>
        
        <Popover
          placement="bottomLeft"
          content={ this.props.content }
          title={ this.showTime() }
          trigger="click"
        >
          <Icon type="question-circle-o" className="toolbarPop" />
        </Popover>
      </span>
    );
  }
}

export default ToolbarTitle;
