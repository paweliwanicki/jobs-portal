import { act, renderHook } from '@testing-library/react';
import { useSignForm } from '../hooks/useSignForm';

test('clear message', () => {
  const { result } = renderHook(() => useSignForm());

  act(() => {
    result.current.clearMessage();
  });

  expect(result.current.message).toBe(undefined);
});
