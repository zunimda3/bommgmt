import { readFileSync } from 'node:fs';

test('schema defines the required core models', () => {
  const schema = readFileSync('prisma/schema.prisma', 'utf8');

  expect(schema).toContain('model User');
  expect(schema).toContain('model Project');
  expect(schema).toContain('model ProjectModule');
  expect(schema).toContain('model BomItem');
  expect(schema).toContain('model PurchasingItem');
  expect(schema).toContain('model Announcement');
  expect(schema).toContain('model Session');
});
