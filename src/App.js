import React from 'react';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

import authProvider from './auth';
import i18nProvider from './localization';
import { PostEdit, PostList } from './resources/posts';
import { UserList } from './resources/users';
import theme from './theme';

const dataProvider = jsonServerProvider(process.env.REACT_APP_API_URL);

const App = () => (
  <Admin
    theme={theme}
    authProvider={authProvider}
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}>
    <Resource name="posts" list={PostList} edit={PostEdit} />
    <Resource name="users" list={UserList} />
  </Admin>
);

export default App;
