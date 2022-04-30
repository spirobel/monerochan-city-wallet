import { printLine } from './modules/print';
import { dispatchBackground } from '../../utils/dispatchBackground'
import { buyClubcard } from '../Background/background_app/buyClubCardSaga'

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.EFECT2');

window.addEventListener("message", function (event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        console.log("Content script received: " + event.data.text);
        //port.postMessage(event.data.text);
    }
    if (event.data.type && (event.data.type == "BUY_CLUBCARD")) {
        //port.postMessage(event.data.text);
        const url = String(event.data.url)
        dispatchBackground(buyClubcard(url))
    }
}, false);
printLine("Using the 'printLine' function from the Print Module");
