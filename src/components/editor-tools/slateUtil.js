import { Editor, Element, Range, Transforms } from "slate"

const LIST_TYPES = ['ol', 'ul']

//#region MARK UTIL 
export const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}
export const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}
export const toggleTextStyling = (editor, format, value) => {
  getCurrentColor(editor)
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    console.log("Active")
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, value)
  }
}
export const getCurrentColor = (editor, type) => {
  let key = type === "color" ? "textColor" : "highlight"
  const marks = Editor.marks(editor)
  return marks ? marks[key] : null
}
//#endregion

//#region BLOCK UTIL
export const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === format
  })

  return !!match
}
export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && Element.isElement(n) && n.type
      ),
    split: true,
  })
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'li' : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}
//#endregion

//#region ALIGNMENT UTIL
export const isAlignmentActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && Element.isElement(n) && n.alignment === format
  })
  return !!match
}
export const toggleAlignment = (editor, format) => {
    Transforms.setNodes(
      editor,
      { alignment: format },
      { match: (n) => Editor.isBlock(editor, n) }
    );
}
//#endregion

//#region INDENTATION UTIL
export const getCurrentIdentation = (editor) => {
    const [match] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n)
    })
    return match[0].indentation ? match[0].indentation : 0;
}

export const changeIdentation = (editor, format) => {
    Transforms.setNodes(
      editor,
      { indentation: (getCurrentIdentation(editor) > 0 ? getCurrentIdentation(editor) : 0)  + (format === 'increase' ? 1 : -1)},
      { match: (n) => Editor.isBlock(editor, n) }
    )
}
//#endregion 

//#region MENTION UTIL
export const insertMention = (editor, character) => {
  const mention = {
    type: 'mention',
    character,
    children: [{ text: '' }],
  }
  Transforms.insertNodes(editor, mention)
  Transforms.move(editor)
}
//#endregion 

//#region LINK UTIL
export const isLinkActive = (editor) => {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link'
  })

  return !!match
}
export const unwrapLink = (editor) => {
  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link'
  })
}
export const wrapLink = (editor, url) => {
  if (isLinkActive(editor))
    unwrapLink(editor)
  
  const {selection} = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link = {
    type: 'link',
    url: url,
    children: isCollapsed ? [{text: url}] : []
  }

  if (isCollapsed)
    Transforms.insertNodes(editor, link)
  else {
    Transforms.wrapNodes(editor, link, {split: true})
    Transforms.collapse(editor, {edge: 'end'})
  }
}
//#endregion 
