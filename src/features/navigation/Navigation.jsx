import React from 'react';
import { navigate, selectCurrentPage } from './navigation-slice'
import { useDispatch, useSelector } from 'react-redux';
import { useLiveQuery } from 'dexie-react-hooks';
import Home from '../home/Home';
import Menu from '../menu/Menu';
import CreateWallet from '../create-wallet/CreateWallet'
import ListWallets from '../list-wallets/ListWallets'
import TransactionsTable from '../menu/wallet/TransactionsTable'
import SignMessageWithTransaction from '../menu/wallet/SignMessageWithTransaction'
import { Button, Layout, Space, } from 'antd';
import MoneroLogo from './logo.jsx'
import Icon, { LeftCircleOutlined, MenuOutlined } from '@ant-design/icons';
import ImportWallet from '../import-wallet/ImportWallet';
import { Receive } from '../receive/Receive';
import { Send } from '../send/Send';
import { db } from '../../utils/dexie_db';
import RegisterClubcardWithTransaction from '../menu/wallet/RegisterClubcardWithTransaction';

const Monero = props => <Icon component={MoneroLogo} {...props} />;
const { Header, Content } = Layout;

function Navigation() {
  let currentPage = useSelector(selectCurrentPage)
  const dispatch = useDispatch()
  const mainWallet = useLiveQuery(
    () => db.wallet_config.orderBy('main_wallet').last()
  );
  let main = <div></div>;
  switch (currentPage.destination) {
    case 'home':
      main = <Home />
      break;
    case 'receive':
      main = <Receive />
      break;
    case 'send':
      main = <Send />
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
    case 'transactions':
      main = <TransactionsTable wallet_name={currentPage.wallet_name} />
      break;
    case 'signMessageWithTransaction':
      main = <SignMessageWithTransaction transaction={currentPage.transaction} />
      break;
    case 'registerClubcardWithTransaction':
      main = <RegisterClubcardWithTransaction transaction={currentPage.transaction} />
      break;
    case 'menu':
      main = <Menu />
      break;
  }

  return (
    <Layout>
      <Header>
        <Space>
          <Button onClick={() => dispatch(navigate("send"))}>
            <LeftCircleOutlined />send
          </Button>
          <Button shape="round" onClick={() => dispatch(navigate("home"))}>
            {mainWallet?.newBalance && (mainWallet.newBalance / 1000000000000).toString() + " "}
            {!mainWallet?.newBalance && "-.-- "}
            <Monero />

          </Button>
          <Button onClick={() => dispatch(navigate("receive"))}>
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
