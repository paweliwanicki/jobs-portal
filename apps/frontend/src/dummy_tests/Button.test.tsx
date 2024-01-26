import { fireEvent, render, screen } from '@testing-library/react';
import Button from '../components/common/Button/Button';

test('handles onClick', () => {
  const onClick = jest.fn();
  render(
    <Button onClick={onClick} variant="primary">
      primary
    </Button>
  );
  const buttonElement = screen.getByText<HTMLButtonElement>('primary');
  fireEvent.click(buttonElement);
  expect(onClick).toHaveBeenCalledTimes(1);
});
