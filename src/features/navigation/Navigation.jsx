import React from 'react';
import { navigate, selectCurrentPage } from './navigation-slice'
import { useDispatch, useSelector } from 'react-redux';
import Home from '../home/Home';
import CreateWallet from '../create-wallet/CreateWallet'
import { Button } from 'antd';


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
    <div>
      <h1>monerochan</h1>
      <Button block size="large" type="primary" onClick={() => dispatch(navigate("create-wallet"))}>
        create wallet
      </Button>
      <button onClick={() => dispatch(navigate("home"))}>home</button>
      <button onClick={() => dispatch(navigate("test"))}>test</button>
      {main}


    </div>
  );
}

export default Navigation;
