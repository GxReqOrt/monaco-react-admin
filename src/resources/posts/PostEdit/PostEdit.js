import React from 'react';
import { Edit, TextField, SimpleForm } from 'react-admin';

import MonacoEditor from './MonacoEditor';

const PostEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextField source="title" />
      <MonacoEditor source="body" />
    </SimpleForm>
  </Edit>
);

export default PostEdit;
