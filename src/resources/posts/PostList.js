import React from 'react';
import { List, Datagrid, ReferenceField, TextField } from 'react-admin';

const PostList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="title" />
    </Datagrid>
  </List>
);

export default PostList;
