import React from 'react';
import { useInput } from 'react-admin';
import PropTypes from 'prop-types';

import useMonaco from './useMonaco';

const MonacoEditor = (props) => {
  const editorRef = React.useRef();
  const { input } = useInput(props);
  const editor = useMonaco(editorRef, input.value);

  React.useEffect(() => {
    if (!editor) return;

    const subscriptions = [];

    const handleEvent = () => {
      setTimeout(() => input.onChange(editor.getValue()), 0);
    };

    subscriptions.push(editor.onKeyDown(handleEvent));
    subscriptions.push(editor.onDidBlurEditorText(handleEvent));
    subscriptions.push(editor.onDidPaste(handleEvent));

    return () => {
      subscriptions.forEach((subscription) => subscription.dispose());
    };
  }, [editor, input]);

  return <div ref={editorRef} style={{ height: 600, width: '100%' }}></div>;
};

MonacoEditor.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  source: PropTypes.string,
  resource: PropTypes.any,
};

export default MonacoEditor;
