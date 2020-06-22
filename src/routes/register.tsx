import * as React from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Layout } from '../components/layout'
import { RegisterPage } from '../features/users/components/RegisterPage'

export default () =>
<Layout
  title="GOG Troop Calculator"
>
  <RegisterPage />
</Layout>
