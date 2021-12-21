import React from 'react';
import { navigate, selectCurrentPage } from './navigation-slice'
import { useDispatch, useSelector } from 'react-redux';
import Home from '../home/Home';
import CreateWallet from '../create-wallet/CreateWallet'
import { Button, Layout, Space } from 'antd';


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
          <Button type="primary" onClick={() => dispatch(navigate("create-wallet"))}>
            create wallet
          </Button>
          <Button type="primary" onClick={() => dispatch(navigate("home"))}>
            home
          </Button>
          <Button type="primary" onClick={() => dispatch(navigate("test"))}>
            test
          </Button>
        </Space>
      </Header>
      <Content>{main}</Content>
    </Layout>
  );
}

export default Navigation;
