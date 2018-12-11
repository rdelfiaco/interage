import { FormataDinheiroPipe } from './formata-dinheiro.pipe';

describe('FormataDinheiroPipe', () => {
  it('create an instance', () => {
    const pipe = new FormataDinheiroPipe();
    expect(pipe).toBeTruthy();
  });
});
