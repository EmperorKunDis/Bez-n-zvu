import { cn } from '../utils';

describe('cn utility function', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('merges Tailwind classes correctly', () => {
    // twMerge should deduplicate conflicting Tailwind classes
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('handles objects with boolean values', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('returns empty string for no classes', () => {
    expect(cn()).toBe('');
  });

  it('combines clsx and twMerge functionality', () => {
    expect(
      cn(
        'px-2 py-1',
        { 'bg-red-500': true, 'bg-blue-500': false },
        'px-4'
      )
    ).toBe('py-1 bg-red-500 px-4');
  });
});
