import React, { FunctionComponent } from 'react'; // importing FunctionComponent
import { LayoutProps } from './layout.types';

const Layout: FunctionComponent<LayoutProps> = ({ title, paragraph, children }) => <div id='main'>
  <h2>{ title }</h2>
  <p>
    { paragraph }
  </p>
  {children}
</div>

export { Layout };