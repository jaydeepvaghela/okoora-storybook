import { CreditDebitPipe } from './credit-debit.pipe';

describe('CreditDebitPipe', () => {
  it('create an instance', () => {
    const pipe = new CreditDebitPipe();
    expect(pipe).toBeTruthy();
  });
});
