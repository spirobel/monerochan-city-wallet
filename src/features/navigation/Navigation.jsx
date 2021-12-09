import React from 'react';
import { navigate, selectCurrentPage } from './navigation-slice'
import { useDispatch, useSelector } from 'react-redux';

function Navigation() {
  let currentPage = useSelector(selectCurrentPage)
  const dispatch = useDispatch()
  let main = <div></div>;
  switch (currentPage) {
    case 'root':
      main = <div>root</div>
      break;
    case 'test':
      main = <div>test</div>
      break;
  }

  return (
    <div>
      monerochan
      {main}
      <button onClick={() => dispatch(navigate("root"))}>root</button>
      <button onClick={() => dispatch(navigate("test"))}>test</button>

    </div>
  );
}

export default Navigation;
