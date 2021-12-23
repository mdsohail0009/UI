
import { Subject } from 'rxjs';
const coinSubject = new Subject();
const publishBalanceRfresh = (bal) => coinSubject.next(bal);
const amountSwapSubject = new Subject();
const publishAmountSwap = (val) => amountSwapSubject.next(val);
export { publishBalanceRfresh, coinSubject,amountSwapSubject,publishAmountSwap }