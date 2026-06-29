'use client';

import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
}

export default function AdminTinyMCEEditor({ value, onChange, height = 500 }: TinyMCEEditorProps) {
  const editorRef = useRef(null);

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(_evt, editor) => (editorRef.current = editor as unknown as null)}
      value={value}
      onEditorChange={onChange}
      init={{
        height,
        menubar: true,
        plugins: [
          'accordion', 'advlist', 'anchor', 'autolink', 'autoresize', 'autosave',
          'charmap', 'code', 'codesample', 'directionality', 'emoticons', 'fullscreen',
          'help', 'image', 'importcss', 'insertdatetime', 'link', 'lists', 'media',
          'nonbreaking', 'pagebreak', 'preview', 'quickbars', 'save', 'searchreplace',
          'table', 'visualblocks', 'visualchars', 'wordcount',
        ],
        toolbar:
          'undo redo | blocks | bold italic underline strikethrough | ' +
          'forecolor backcolor | alignleft aligncenter alignright alignjustify | ' +
          'bullist numlist outdent indent | link image media table codesample | ' +
          'fullscreen preview | wordcount help',
        content_style:
          'body { font-family: Inter, -apple-system, sans-serif; font-size: 15px; line-height: 1.7; color: #1A1A2E; }',
        skin: 'oxide',
        content_css: 'default',
        autosave_ask_before_unload: true,
        autosave_interval: '30s',
        autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        image_advtab: true,
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
        quickbars_insert_toolbar: 'quickimage quicktable',
        contextmenu: 'link image table',
      }}
    />
  );
}
