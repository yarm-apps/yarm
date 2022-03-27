
export default class yBlock {
    /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
   */
 static get conversionConfig() {
    return {
      export: 'text', // to convert Paragraph to other block, use 'text' property of saved data
      import: 'text' // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }
}
