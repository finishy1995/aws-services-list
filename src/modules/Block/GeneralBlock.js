import React, { Component } from 'react';

class GeneralBlock extends Component {
  render() {
    return (
      <div className="site-block">
        <div className="toolbarDiv">
          <h2 className="toolbarTitle">{ this.props.title }</h2>
        </div>
        <div style={{ padding: '24px 24px 4px 24px' }}>
          { this.props.content }
        </div>
      </div>
    );
  }
}

export default GeneralBlock;
