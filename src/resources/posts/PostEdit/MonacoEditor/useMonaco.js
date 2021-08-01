import React from 'react';
import setupMonaco from './setupMonaco';

const useMonaco = (editorRef, initialValue) => {
  const [editor, setEditor] = React.useState();

  React.useEffect(() => {
    if (!editorRef.current || !!editor) return;

    setupMonaco(editorRef.current, {
      value: initialValue,
      language: 'gherkin',
    })
      .then(setEditor)
      .catch((err) => console.log(err));
  }, [editorRef, editor, initialValue]);

  return editor;
};

export default useMonaco;
