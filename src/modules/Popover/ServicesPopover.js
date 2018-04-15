import React, { Component } from 'react';
import { Popover } from 'antd';

class ServicesPopover extends Component {
  render() {
    return (
      <Popover
        placement={ this.props.placement ? this.props.placement : "bottomLeft" }
        content={ (
          <p>Here will show service brief introduction and service AWS website link, for example <a href="https://aws.amazon.com/ec2/">https://aws.amazon.com/ec2/</a>.</p>
        ) }
        title={ this.props.servicesName }
        trigger={ this.props.trigger ? this.props.trigger : "hover" }
      >
        <span className={ this.props.className }>{ this.props.servicesName }</span>
      </Popover>
    );
  }
}

export default ServicesPopover;
