import React from "react";
import styled from "@emotion/styled";
import {
  ParagraphPlugin as PlateParagraphPlugin,
  Plate,
  PlateContent,
  PlateElementProps,
  createPlatePlugin,
  useEditorSelection,
  useEditorSelector,
  usePlateEditor,
} from "platejs/react";
import { useState } from "react";

const E = styled("div")<{ $content: string }>`
  &:before {
    position: absolute;
    right: 0;
    content: "${({ $content }) => $content.replaceAll('"', '\\"')}";
  }
`;

const MagicWrapper = (props: PlateElementProps) => {
  const { children, element } = props;
  const selection = useEditorSelection();

  const path = useEditorSelector(
    (editor) => {
      const path = editor.api.findPath(element);

      return path;
    },
    [element]
  );

  return <E $content={JSON.stringify(path)}>{children}</E>;
};

const MagicWrapperPlugin = createPlatePlugin({
  key: "magicWrapperPlugin",
  render: {
    aboveNodes: () => {
      return (props) => <MagicWrapper {...props} />;
    },
  },
});

const ParagraphPlugin = PlateParagraphPlugin.configure({
  node: { type: "paragraph" },
  render: {
    as: "p",
  },
});

const StyledPlateContent = styled(PlateContent)`
  border: 1px dashed green;
  padding: 10px;
`;

export default () => {
  const [value, setValue] = useState([
    { type: "paragraph", children: [{ text: "" }] },
    { type: "paragraph", children: [{ text: "Hello, world" }] },
  ]);

  const editor = usePlateEditor({
    plugins: [MagicWrapperPlugin, ParagraphPlugin],
    value,
  });

  return (
    <>
      <h1>Hello, Plate.js</h1>

      <Plate
        editor={editor}
        onValueChange={({ value }) => {
          setValue(value);
        }}
      >
        <StyledPlateContent />
      </Plate>

      <pre style={{ width: "100%" }}>{JSON.stringify(value, null, 4)}</pre>
    </>
  );
};
