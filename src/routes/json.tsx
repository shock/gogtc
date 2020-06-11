import * as React from 'react';

import { Layout } from '../components/layout';
import { FormCalcJsonView } from '../features/form_calc/components/FormCalcJsonView';



export default () =>
<Layout
  title="GOG Troop Calculator"
  paragraph="ipsum lorem blah blah"
>
  <FormCalcJsonView name={'fc1'} />
</Layout>
