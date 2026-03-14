import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout from '@/app/layout';

test('root layout renders app children', () => {
  const markup = renderToStaticMarkup(
    <RootLayout>
      <div>child content</div>
    </RootLayout>,
  );

  expect(markup).toContain('child content');
});
