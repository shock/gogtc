import * as React from 'react';

import { Layout } from '../components/layout';
import { FormCalcSelector } from '../features/form_calc/components/FormCalcSelector';

export default () =>
<Layout title="GOG Troop Calculator">
  <FormCalcSelector name={'fc1'} />
</Layout>
