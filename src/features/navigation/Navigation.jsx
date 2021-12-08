import React from 'react';
import {navigate, selectCurrentPage} from './navigation-slice'
import {  useDispatch, useSelector } from 'react-redux';

function Navigation() {
  let currentPage = useSelector(selectCurrentPage)

  return (
    <div>
        monerochan  {currentPage}
    </div>
  );
}

export default Navigation;
