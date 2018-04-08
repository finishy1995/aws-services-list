import React, { Component } from 'react';
import { Layout, Menu, Button, Row, Col } from 'antd';
import './App.css';

const { Header, Content, Footer } = Layout;

class App extends Component {
  render() {
    return (
      <Layout>
        <Header className="header">
          <Row>
            <Col span={19}>
              <div className="site-logo">
                <a href="/"><h2 style={{ color: '#e2edf2', textTransform: 'uppercase', marginBottom: 0 }}>AWS Services List</h2></a>
              </div>
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={ [this.props.defaultSelectedKeys] } style={{ lineHeight: '64px', border: 0 }}>
                <Menu.Item key="1"><a href="/">Home</a></Menu.Item>
                <Menu.Item key="2"><a href="/Update">Update</a></Menu.Item>
                <Menu.Item key="3"><a href="/About">About</a></Menu.Item>
              </Menu>
            </Col>
            <Col span={5}>
              <Button type="primary" icon="login" style={{ float: 'right', marginTop: '16px' }}>Login</Button>
            </Col>
          </Row>
        </Header>
        
        <Content id="Content" style={{ padding: '0 50px' }}>
        </Content>
        
        <Footer style={{ textAlign: 'center' }}>
          Designed and built with the customer obsession by <a href="https://github.com/finishy1995" target="_blank" rel="noopener noreferrer">@david</a>. Thanks for all contributors in this project.
        </Footer>
      </Layout>
    );
  }
}

export default App;
