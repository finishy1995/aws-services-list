import React, { Component } from 'react';
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Layout, Menu, Button, Row, Col, Icon, Popover } from 'antd';
import HomePage from '../Page/HomePage';
import UnfinishedPage from '../Page/UnfinishedPage';
import ErrorPage from '../Page/ErrorPage';
import './App.css';

const { Header, Footer } = Layout;

const MenuLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route
    path={ to }
    exact={ activeOnlyWhenExact }
    children={ ({ match }) => (
      <Link to={ to }>{ label }</Link>
    ) }
  />
);

const Home = () => (
  <HomePage />
);

const Update = () => (
  <UnfinishedPage />
);

const About = () => (
  <UnfinishedPage />
);

const Login = () => (
  <UnfinishedPage />
);

const PathError = () => (
  <ErrorPage />
);

class App extends Component {
  shortMenu() {
    return (
      <Menu
        style={{ width: 256, border: 0, textAlign: 'center' }}
        defaultSelectedKeys={ [this.props.defaultSelectedKeys] }
        mode="inline"
      >
        <Menu.Item key="1"><MenuLink activeOnlyWhenExact={true} to="/" label="Home" /></Menu.Item>
        <Menu.Item key="2"><MenuLink to="/update" label="Update" /></Menu.Item>
        <Menu.Item key="3"><MenuLink to="/about" label="About" /></Menu.Item>
        <Menu.Item key="4"><a href="https://github.com/finishy1995/aws-services-list/">Github</a></Menu.Item>
        <Menu.Item key="5"><MenuLink to="/login" label="Login" /></Menu.Item>
      </Menu>
    );
  }
  
  render() {
    return (
      <Router>
        <Layout>
          <Header>
            <div className="site-width">
              <Popover content={ this.shortMenu() } trigger="click" placement="bottomRight">
                <Icon type="bars" style={{ color: '#fff' }} className="site-short-menu" />
              </Popover>
              <Row>
                <Col xs={24} sm={24} md={7} lg={6} xl={5} xxl={4}>
                  <div className="site-logo">
                    <a href="/"><h2 style={{ color: '#e2edf2', textTransform: 'uppercase', marginBottom: 0 }}>AWS Services List</h2></a>
                  </div>
                </Col>
                <Col xs={0} sm={0} md={9} lg={10} xl={12} xxl={14}>
                  <Menu theme="dark" mode="horizontal" defaultSelectedKeys={ [this.props.defaultSelectedKeys] } style={{ lineHeight: '64px', border: 0 }}>
                    <Menu.Item key="1"><MenuLink activeOnlyWhenExact={true} to="/" label="Home" /></Menu.Item>
                    <Menu.Item key="2"><MenuLink to="/update" label="Update" /></Menu.Item>
                    <Menu.Item key="3"><MenuLink to="/about" label="About" /></Menu.Item>
                  </Menu>
                </Col>
                <Col xs={0} sm={0} md={8} lg={8} xl={7} xxl={6}>
                  <Button type="primary" icon="login" style={{ float: 'right', marginTop: '16px' }} href="#/login">Login</Button>
                  <a className="github-button" href="https://github.com/finishy1995/aws-services-list/" target="_blank" rel="noopener noreferrer">
                    <Icon type="github" style={{ fontSize: '18px', marginRight: '4px' }} />
                    <span className="github-text">Star</span>
                  </a>
                </Col>
              </Row>
            </div>
          </Header>
  
          <Switch>
            <Route exact path="/" component={ Home } />
            <Route path="/update" component={ Update } />
            <Route path="/about" component={ About } />
            <Route path="/login" component={ Login } />
            <Route component={ PathError } />
          </Switch>
  
          <Footer style={{ textAlign: 'center' }}>
            <div className="site-width">
              <p>Serverless Web App all in AWS, using AWS S3, Lambda, CloudWatch Event etc.</p>
              <p>Designed and built with the customer obsession by <a href="https://github.com/finishy1995" target="_blank" rel="noopener noreferrer">@david</a>. Thanks for all contributors in this project.</p>
            </div>
          </Footer>
        </Layout>
      </Router>
    );
  }
}

export default App;
