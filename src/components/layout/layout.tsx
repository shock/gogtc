import React, { FunctionComponent } from 'react'; // importing FunctionComponent
import { LayoutProps } from './layout.types';

const Layout: FunctionComponent<LayoutProps> = ({ title, paragraph, children }) =>
<main>
  <h2>{ title }</h2>
  <p>
    { paragraph }
  </p>
  {children}
</main>

export { Layout };