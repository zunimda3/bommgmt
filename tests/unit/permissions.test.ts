import { canEditBom, canEditPurchasing, canManageUsers } from '@/lib/permissions';

test('designer can edit bom but not purchasing', () => {
  expect(canEditBom({ role: 'designer', isAssigned: true })).toBe(true);
  expect(canEditPurchasing({ role: 'designer', isAssigned: true })).toBe(false);
});

test('purchaser can edit purchasing but not bom', () => {
  expect(canEditBom({ role: 'purchaser', isAssigned: true })).toBe(false);
  expect(canEditPurchasing({ role: 'purchaser', isAssigned: true })).toBe(true);
});

test('only owner can manage users', () => {
  expect(canManageUsers('owner')).toBe(true);
  expect(canManageUsers('admin')).toBe(false);
});
