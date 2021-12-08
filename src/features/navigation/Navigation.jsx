import React from 'react';
import {navigate, selectCurrentPage} from './navigation-slice'
import {  useDispatch, useSelector } from 'react-redux';

function Navigation() {
  let currentPage = useSelector(selectCurrentPage)
  const dispatch = useDispatch()

  return (
    <div>
        monerochan  {currentPage}
        <button onClick={() =>dispatch(navigate("test"))}>navigate</button>
    </div>
  );
}

export default Navigation;
