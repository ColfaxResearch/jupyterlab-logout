import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { Widget } from '@lumino/widgets';

import { ICommandPalette } from '@jupyterlab/apputils';

import { CommandLinker } from '@jupyterlab/apputils';

import { ITopBar } from 'jupyterlab-topbar';

import { toArray } from '@lumino/algorithm';

import '@jupyterlab/application/style/buttons.css';

import '../style/index.css';

/**
 * The command IDs used by the launcher plugin.
 */
namespace CommandIDs {
  export const open = 'launcher:open';
}

const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-logout:plugin',
  autoStart: true,
  requires: [IRouter, ITopBar],
  activate: async (
    app: JupyterFrontEnd,
    router: IRouter,
    topBar: ITopBar,
    palette: ICommandPalette | null
  ) => {
    // Defining the HTML components
    const back = document.createElement('a');
    back.id = 'back';
    back.innerHTML = 'Back to Intel.com';
    back.setAttribute('target', '_blank');
    back.setAttribute('href', '/website_redirect');

    const logout = document.createElement('a');
    logout.id = 'logout';
    logout.innerHTML = 'Log Out';
    logout.addEventListener('click', () => {
      router.navigate('/logout', { hard: true });
    });

    const homeQuick = document.createElement('p');
    homeQuick.id = 'quick_home';
    homeQuick.innerHTML = 'Quick Launcher';

    const para = document.createElement('p');
    para.id = 'para';
    para.innerHTML = '';

    // Defining the widgets for each items
    const widget3 = new Widget({ node: homeQuick });
    widget3.addClass('logout');
    // app.shell.add(widget3, 'left', { rank: 0 });
    topBar.addItem('quick-launcher', widget3);

    const widget2 = new Widget({ node: para });
    widget2.addClass('logout');
    topBar.addItem('print-para', widget2);

    const widget1 = new Widget({ node: back });
    widget1.addClass('logout');
    topBar.addItem('back-button', widget1);

    const widget = new Widget({ node: logout });
    widget.addClass('logout');
    topBar.addItem('logout-button', widget);

    // Command to activate a widget by id.
    app.commands.addCommand(CommandIDs.open, {
      execute: args => {
        const all_launcher = toArray(app.shell.widgets('main'));
        all_launcher.forEach((w, index) => {
          const widget_actual_id = all_launcher[index].node.id;
          const launcher = widget_actual_id.split('-')[0];
          if (launcher === 'launcher') {
            all_launcher[index].close();
          }
        });

        app.commands.execute('launcher:create');
      }
    });

    if (palette) {
      palette.addItem({
        command: CommandIDs.open,
        category: 'Launcher'
      });
    }

    //Adding command linker to do certain operations
    const commandLinker = new CommandLinker({ commands: app.commands });
    commandLinker.connectNode(homeQuick, 'launcher:open');
  }
};

export default extension;
