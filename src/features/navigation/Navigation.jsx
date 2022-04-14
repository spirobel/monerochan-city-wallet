import React from 'react';
import { navigate, selectCurrentPage } from './navigation-slice'
import { useDispatch, useSelector } from 'react-redux';
import Home from '../home/Home';
import Menu from '../menu/Menu';
import CreateWallet from '../create-wallet/CreateWallet'
import ListWallets from '../list-wallets/ListWallets'
import { Button, Layout, Space, } from 'antd';
import MoneroLogo from './logo.jsx'
import Icon, { LeftCircleOutlined, MenuOutlined } from '@ant-design/icons';
import ImportWallet from '../import-wallet/ImportWallet';
const Monero = props => <Icon component={MoneroLogo} {...props} />;
const { Header, Content } = Layout;

function Navigation() {
  let currentPage = useSelector(selectCurrentPage)
  const dispatch = useDispatch()
  let main = <div></div>;
  switch (currentPage.destination) {
    case 'home':
      main = <Home />
      break;
    case 'test':
      main = <div>make a new address for everyone. its free and the cops cant stop you.*address dispenser*</div>
      break;
    case 'create-wallet':
      main = <CreateWallet />
      break;
    case 'import-wallet':
      main = <ImportWallet />
      break;
    case 'list-wallets':
      main = <ListWallets />
      break;
    case 'menu':
      main = <Menu />
      break;
  }

  return (
    <Layout>
      <Header>
        <Space>
          <Button onClick={() => dispatch(navigate("create-wallet"))}>
            <LeftCircleOutlined />send
          </Button>
          <Button shape="round" onClick={() => dispatch(navigate("home"))}>
            1.19 <Monero />

          </Button>
          <Button onClick={() => dispatch(navigate("test"))}>
            receive<LeftCircleOutlined />
          </Button>
          <Button onClick={() => dispatch(navigate("menu"))}>
            <MenuOutlined />
          </Button>
        </Space>
      </Header>
      <Content>{main}</Content>
    </Layout>
  );
}

export default Navigation;
