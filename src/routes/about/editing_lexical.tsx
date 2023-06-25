import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik'
import {
  createEditor,
  LineBreakNode,
  ParagraphNode,
  TextNode,
  $getRoot,
  $insertNodes,
} from 'lexical'
import { ListNode, ListItemNode } from '@lexical/list'
import { LinkNode, AutoLinkNode } from '@lexical/link'
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table'
import { OverflowNode } from '@lexical/overflow'
import { HeadingNode, QuoteNode, registerRichText } from '@lexical/rich-text'
import { $generateNodesFromDOM } from '@lexical/html'

const config = {
  onError: console.error,
  nodes: [
    LineBreakNode,
    ParagraphNode,
    TextNode,
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    OverflowNode,
    HeadingNode,
    QuoteNode,
  ],
}

// Issue: lexical has only basic support for vanilla JS
// https://github.com/facebook/lexical/issues/2867
// It is NOT documented (killer)
// The entire ui needs to be built from scratch (doable)
export default component$(({ about }) => {
  const editorRef = useSignal<Element>()
  console.log('editing rendering')

  useVisibleTask$(() => {
    console.log('editing, visibleTask running')
    const editor = createEditor(config)
    console.log('editing, visibleTask, editorRef:', editorRef.value)
    editor.setRootElement(editorRef.value)
    editor.setEditable(true)
    registerRichText(editor)
    console.log('editing, visibleTask, editor:', editor)

    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot()
        console.log(root.getTextContent())
      })
    })

    editor.update(() => {
      // In the browser you can use the native DOMParser API to parse the HTML string.
      const parser = new DOMParser()
      console.log('editing, visibleTask, parser:', parser)
      const dom = parser.parseFromString(about, 'text/html')
      console.log('editing, visibleTask, dom:', dom)

      // Once you have the DOM instance it's easy to generate LexicalNodes.
      const nodes = $generateNodesFromDOM(editor, dom)
      console.log('editing, visibleTask, nodes:', nodes)
      // Select the root
      $getRoot().select()

      // Insert them at a selection.
      $insertNodes(nodes)
    })
  })

  return <div class="w-full h-60 bg-slate-100" id="editor" ref={editorRef} />
})
