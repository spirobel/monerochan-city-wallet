import React from 'react';
import { navigate, selectCurrentPage } from './navigation-slice'
import { useDispatch, useSelector } from 'react-redux';
import Home from '../home/Home';

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
  }

  return (
    <div>
      monerochan
      {main}
      <button onClick={() => dispatch(navigate("home"))}>home</button>
      <button onClick={() => dispatch(navigate("test"))}>test</button>

    </div>
  );
}

export default Navigation;
