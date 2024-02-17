import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let customSearch = vscode.commands.registerCommand(
    'variable-debugger.find_variable',
    async () => {
      const editor = vscode.window.activeTextEditor;
      const selection = editor?.document.getText(editor.selection);
      const searchOptions = {
        query: '',
        triggerSearch: true,
        isRegex: false,
      };
      if (!selection) {
        vscode.window.showErrorMessage('Select a Variable First');
        return;
      }
      const lines = editor?.document.getText().split('\n');
      const lineWithSelection = lines?.find((line) => line.includes(selection));
      if (!lineWithSelection?.includes('import')) {
        searchOptions.query = selection;
        vscode.commands.executeCommand('workbench.action.findInFiles', searchOptions);
        return;
      }
      let match = lineWithSelection?.includes("'")
        ? /'([^']*)'/.exec(lineWithSelection)?.[1]
        : /"([^"]*)"/.exec(lineWithSelection)?.[1];
      let isDefault = true;
      if (lineWithSelection.includes('{')) {
        const betweenBraces = /\{([^{}]*)\}/.exec(lineWithSelection)?.[0];
        if (betweenBraces?.includes(selection)) {
          isDefault = false;
        }
      }
      const sections = match && match.split('/');
      const correctSection = sections && sections[sections.length - 1];
      searchOptions.query = isDefault ? '/' + correctSection : selection;
      vscode.commands.executeCommand('workbench.action.findInFiles', searchOptions);
    }
  );

  context.subscriptions.push(customSearch);
}

export function deactivate() {}
