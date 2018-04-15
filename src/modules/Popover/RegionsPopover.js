import React, { Component } from 'react';
import { Popover } from 'antd';

class RegionsPopover extends Component {
  render() {
    return (
      <Popover
        placement={ this.props.placement ? this.props.placement : "bottomLeft" }
        content={ "AWS Region ID: " + this.props.regionsID }
        title={ this.props.regionsName }
        trigger={ this.props.trigger ? this.props.trigger : "hover" }
      >
        <span className={ this.props.className }>{ this.props.regionsName }</span>
      </Popover>
    );
  }
}

export default RegionsPopover;
