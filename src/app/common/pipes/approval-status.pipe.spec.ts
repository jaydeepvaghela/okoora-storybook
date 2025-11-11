import { ApprovalStatusPipe } from './approval-status.pipe';

describe('ApprovalStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new ApprovalStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
