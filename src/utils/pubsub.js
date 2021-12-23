
import { Subject } from 'rxjs';
const coinSubject = new Subject();
const publishBalanceRfresh = (bal) => coinSubject.next(bal);
export { publishBalanceRfresh,coinSubject }