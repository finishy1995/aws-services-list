import React, { Component } from 'react';
import { Popover } from 'antd';

class ServicesGroupPopover extends Component {
  render() {
    return (
      <Popover
        placement={ this.props.placement ? this.props.placement : "bottomLeft" }
        content={ this.props.groupName }
        trigger={ this.props.trigger ? this.props.trigger : "hover" }
      >
        <span className={ this.props.className }>{ this.props.groupName }</span>
      </Popover>
    );
  }
}

export default ServicesGroupPopover;
