import React, { Component } from 'react';
import ToolbarTitle from './ToolbarTitle';

const searchDescription = (
  <div className="toolbarDescription">
    <p className="toolbarNotification">Unofficial data, just for reference.</p>
    <p>AWS Region Services Search. We now support search in the following format.</p>
    <ul>
      <li>2 Regions and 0 Service. Will return the supported services difference between these two regions.</li>
      <li>2/1 Region and several Services. Will return these services status in this region.</li>
      <li>0 Region and several Services. Will return all regions that support these services.</li>
    </ul>
  </div>
);

class SearchTools extends Component {
  render() {
    return (
      <div className="toolbarDiv">
        <ToolbarTitle
          pcTitle="Region Services Search"
          mobileTitle="Search"
          content={ searchDescription }
          time={ this.props.time }
        />
      </div>
    );
  }
}

export default SearchTools;
