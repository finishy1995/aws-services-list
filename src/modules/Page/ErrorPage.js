import React, { Component } from 'react';
import { Layout } from 'antd';
import GeneralBlock from '../Block/GeneralBlock';

const { Content } = Layout;

class ErrorPage extends Component {
  render() {
    return (
      <Content className="site-width">
        <GeneralBlock
          title="Error Page"
          content={ (
            <div>
              <p>The page you requested can not be accessed. Please check your url path and try again.</p>
              <a href="/">Back to home page</a>
            </div>
          ) }
        />
      </Content>
    );
  }
}

export default ErrorPage;
