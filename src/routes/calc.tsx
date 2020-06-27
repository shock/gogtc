import * as React from 'react';

import { Layout } from '../components/layout';
import { FormCalcPage } from '../features/form_calc/components/FormCalcPage';
import { TestLibrary } from '../features/form_calc/models'

const testFormCalc = Object.values(TestLibrary.formCalcs)[0]

export default () =>
<Layout title="GOG Troop Calculator">
  <FormCalcPage fcId={testFormCalc.id} />
</Layout>
