import React, { Component } from 'react';
import { Card } from 'antd';
import './SearchCard.css';

const tabList = [{
  key: 'concision',
  tab: 'concision'
}, {
  key: 'detail',
  tab: 'detail'
}];

class SearchCard extends Component {
  state = {
    key: 'concision'
  }
  
  onTabChange = (key) => {
    this.setState({ key: key });
  }
  
  contentList() {
    if (this.state.key === 'concision')
      return this.concisionResult();
    if (this.state.key === 'detail')
      return ( <p>Coming soon ...</p> );
      
    return ( <p>Unknown tab selected.</p> );
  }
  
  serviceStatusContent(obj) {
    var services = [];
    for (var key in obj.item) {
      var style = [];
      style.push( <b key="service">{ key }</b> );
      style.push( " : " +  obj.regionName[0] + " " );
      style.push( (obj.item[key][0] === '1') ? <span key={ obj.regionName[0] } className="searchSupported">supported</span> : <span key={ obj.regionName[0] } className="searchUnsupported">unsupported</span> );
      
      for (var i=1; i<obj.region; i++) {
        style.push( " , " +  obj.regionName[i] + " " );
        style.push( (obj.item[key][i] === '1') ? <span key={ obj.regionName[i] } className="searchSupported">supported</span> : <span key={ obj.regionName[i] } className="searchUnsupported">unsupported</span> );
      }
      
      services.push([style, key]);
    }
    
    return (
      <ul>
        { services.map((arr) => (
          <li key={arr[1]}>
            { arr[0] }
          </li>
        )) }
      </ul>
    );
  }
  
  serviceContent(obj) {
    var str = "";
    
    for (var key in obj) {
      if (str === "")
        str += key;
      else
        str += ", " + key;
    }
    
    return ( <p>{ str }</p> );
  }
  
  regionContent(obj) {
    var regions = [];
    for (var key in obj) {
      regions.push([key, obj[key]]);
    }
    
    return (
      <ul>
        { regions.map((arr) => (
          <li key={arr[0]}>
            { arr[1] + " (" + arr[0] + ")" }
          </li>
        )) }
      </ul>
    );
  }
  
  concisionResult() {
    var result = this.props.result;
    
    if (result.region === 2) {
      if (result.service === 0) {
        if (Object.getOwnPropertyNames(result.item).length === 0) {
          return <p>{ "There is no service status difference between region " + result.regionName[0] + " and region" + result.regionName[1] + "." }</p>;
        } else if (Object.getOwnPropertyNames(result.item).length === 1) {
          return (
            <div>
              <p>There is only one service status difference between these two regions.</p>
              { this.serviceStatusContent(result) }
            </div>
          );
        } else {
          return (
            <div>
              <p>{ "There are " + Object.getOwnPropertyNames(result.item).length + " service status differences between these two regions." }</p>
              { this.serviceStatusContent(result) }
            </div>
          );
        }
      } else {
        return (
          <div>
            <p>The following will show the service status which you select in these two regions.</p>
            { this.serviceStatusContent(result) }
          </div>
        );
      }
    } else if (result.region === 1) {
      if (result.service === 0) {
        return (
          <div>
            <p>The following will show all supported services in this region.</p>
            { this.serviceContent(result.item) }
          </div>
        );
      } else {
        return (
          <div>
            <p>The following will show the service status which you select in this region.</p>
            { this.serviceStatusContent(result) }
          </div>
        );
      }
    } else if ((result.region === 0) && (result.service > 0)) {
      if (Object.getOwnPropertyNames(result.item).length === 0)
        return ( <p>There is no region that support all services you selected.</p> );
      
      return (
        <div>
          <p>{ "There are " + Object.getOwnPropertyNames(result.item).length + " regions that support all services you selected." }</p>
          { this.regionContent(result.item) }
        </div>
      );
    } else {
      return ( <p>Unsupported search mode.</p> );
    }
  }
  
  render() {
    return (
      <Card
        style={{ width: '100%' }}
        title="Search Result"
        tabList={ tabList }
        onTabChange={ (key) => { this.onTabChange(key); } }
      >
        { this.contentList() }
      </Card>
    );
  }
}

export default SearchCard;
