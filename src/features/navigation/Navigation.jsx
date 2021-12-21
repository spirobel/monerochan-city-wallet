import React from 'react';
import { navigate, selectCurrentPage } from './navigation-slice'
import { useDispatch, useSelector } from 'react-redux';
import Home from '../home/Home';
import CreateWallet from '../create-wallet/CreateWallet'
import { Button, Layout, Space, Menu, Dropdown } from 'antd';
import MoneroLogo from './logo.jsx'
import Icon from '@ant-design/icons';
const Monero = props => <Icon component={MoneroLogo} {...props} />;
const { Header, Content } = Layout;

function Navigation() {
  let currentPage = useSelector(selectCurrentPage)
  const dispatch = useDispatch()
  let main = <div></div>;
  switch (currentPage) {
    case 'home':
      main = <Home />
      break;
    case 'test':
      main = <div>test</div>
      break;
    case 'create-wallet':
      main = <CreateWallet />
      break;
  }

  return (
    <Layout>
      <Header>
        <Space>
          <Button onClick={() => dispatch(navigate("create-wallet"))}>
            send
          </Button>
          <Button onClick={() => dispatch(navigate("home"))}>
            1.19 <Monero />

          </Button>
          <Button onClick={() => dispatch(navigate("test"))}>
            receive
          </Button>

        </Space>
      </Header>
      <Content>{main}</Content>
    </Layout>
  );
}

export default Navigation;
