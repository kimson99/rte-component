import { Transforms, Text, Editor } from 'slate';

class EditorTools {
  markCheck(editor, mark) {
    const [match] = Editor.nodes(editor,{
      match: n => {
        switch (mark) {
          case 'bold':
            return n.bold === true;
          case 'italic':
            return n.italic === true;
          case 'underline':
            return n.underline === true;
          case 'sub':
            return n.sub === true;
          case 'sup':
            return n.sup === true;
          default:
            return false;
        }
      },
    });
    // !!undefined => false
    return !!match
  };

  blockCheck(editor, type) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === type
    });
    return !!match
  }

  toggleBlock(editor, type) {
    const isActive = this.blockCheck(editor, type);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : type},
      { match: n => Editor.isBlock(editor, n)}
    );
  };

  toggleMark(editor, mark) {
    const isActive = this.markCheck(editor, mark);
    Transforms.setNodes(
      editor,
      { [mark]: isActive ? null : true},
      { match: n => Text.isText(n), split: 'true'}
    )
  };
};

export default EditorTools