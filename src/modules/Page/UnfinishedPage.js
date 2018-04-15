import React, { Component } from 'react';
import { Layout } from 'antd';
import GeneralBlock from '../Block/GeneralBlock';

const { Content } = Layout;

class UnfinishedPage extends Component {
  render() {
    return (
      <Content className="site-width">
        <GeneralBlock
          title="Unfinished Page"
          content={ (
            <div>
              <p>This page is unfinished, we are working to complete this page.</p>
              <p>You also can make a contribution in <a href="https://github.com/finishy1995/aws-services-list/">Github</a>. Thanks for your support.</p>
            </div>
          ) }
        />
      </Content>
    );
  }
}

export default UnfinishedPage;
