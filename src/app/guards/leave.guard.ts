import { CanDeactivateFn } from '@angular/router';

export const leaveGuard: CanDeactivateFn<unknown> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  return confirm('Are you sure you want to leave?');
};
