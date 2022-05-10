
import { Subject } from 'rxjs';
const coinSubject = new Subject();
const publishBalanceRfresh = (bal) => coinSubject.next(bal);
const amountSwapSubject = new Subject();
const publishAmountSwap = (val) => amountSwapSubject.next(val);
const dashboardTransactionSub=new Subject();
const publishTransactionRefresh=()=>dashboardTransactionSub.next()
export { publishBalanceRfresh, coinSubject,amountSwapSubject,publishAmountSwap,publishTransactionRefresh,dashboardTransactionSub }