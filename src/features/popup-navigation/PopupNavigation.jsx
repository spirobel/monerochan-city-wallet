import React from 'react';
import { navigate_popup, go_back_popup, selectCurrentPagePopup } from './popup-navigation-slice'
import { useDispatch, useSelector } from 'react-redux';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/dexie_db';
import MoneroSpinner from '../monero-spinner/MoneroSpinner';
import { BuyClubcard } from '../buy-clubcards/BuyClubcard';
import { BoughtClubcardSuccess } from '../buy-clubcards/BoughtClubcardSuccess';


function PopupNavigation() {
  let currentPage = useSelector(selectCurrentPagePopup)
  const dispatch = useDispatch()
  const mainWallet = useLiveQuery(
    () => db.wallet_config.orderBy('main_wallet').last()
  );
  let main = <div></div>;
  switch (currentPage.destination) {
    case 'home':
      main = <MoneroSpinner />
      break;
    case 'buyClubcardPrompt':
      main = <BuyClubcard clubcard={currentPage.clubcard} />
      break;
    case 'sendingMoneySpinner':
      main = <MoneroSpinner tip="Sending money..." />
      break;
    case 'boughtClubcardSuccess':
      main = <BoughtClubcardSuccess clubcard={currentPage.clubcard} />
      break;
  }

  return (
    <>{main}</>
  );
}

export default PopupNavigation;
