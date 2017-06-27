# chrome-remote-css

A Chrome extension which exposes DOM and CSS inspection and manipulation, including [visual regression pruning](http://users.eecs.northwestern.edu/~scl025/files/ply.pdf), over the local network.

Powers [Ply](https://github.com/sarahlim/ply), a beginner-friendly HTML and CSS inspector.

Developed through [Design, Technology, and Research](http://dtr.northwestern.edu) at Northwestern University.

## Installing the extension

First install dependencies and build the extension:

```sh
# Clone repository
git clone https://github.com/sarahlim/chrome-remote-css/
cd chrome-remote-css
# Install dependencies
yarn install
# Build extension
yarn build
```

From the [Chrome extension developer tutorial](https://developer.chrome.com/extensions/getstarted):

> 1. Visit `chrome://extensions` in your browser (or open up the Chrome menu by clicking the icon to the far right of the address bar, and select **Extensions** under the **Tools** menu to get to the same place).
> 2. Ensure that the **Developer mode** checkbox in the top right-hand corner is checked.
> 3. Click **Load unpacked extension…** to pop up a file-selection dialog.
> 4. Navigate to the directory in which your extension files live, and select it. Alternatively, you can drag and drop the directory where your extension files live onto `chrome://extensions` in your browser to load it.
>
> If the extension is valid, it'll be loaded up and active right away! If it's invalid, an error message will be displayed at the top of the page. Correct the error, and try again.

## Running Extension

Install [Ply](https://github.com/sarahlim/ply/) and launch the server with

```sh
yarn run server  # in the Ply directory, not the chrome-remote-css directory
```

(You can optionally also run Ply itself with `yarn start`, but only the server is needed for the extension to work, and even that could be easily refactored out.)

Next, open the debug console.

- Go to `chrome://extensions`, find the entry for `chrome-remote-css`, and click **Inspect views:** `background.html` to launch the console for the background page.

Finally, in Chrome:

1. Navigate to any site
2. Click on the icon next to the address bar: ![grey inactive Delta icon](https://github.com/sarahlim/chrome-remote-css/raw/master/icons/icon-inactive-16.png)
3. After a short delay (nearly-instant for small websites, up to ~5-10s for large production sites with lots of styles like Facebook), an element selection cursor should appear on the page.
    - If not, check the background page console for errors.
4. Click an element to select it.

You can now interact with the inspection target through the background page console:

```js
endpoint._sendDebugCommand({
  method: 'CSS.getMatchedStylesForNode',
  params: {
    nodeId: endpoint.document.nodeId,
  },
}).then(console.log);  // async methods return Promises
```

To get a better idea of what you can do, see the following resources:

- [Full protocol documentation](https://chromedevtools.github.io/devtools-protocol/tot/)
    + Note that the extension is officially pegged to the 1.1 version of the protocol. Weirdly enough, some of the tip-of-tree methods work, and some of them work under different names (e.g. most `Overlay` methods on tip-of-tree are accessible via the `DOM` domain).
- [chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface)'s wiki and Issues section contain a wealth of examples and recipes.

## API

TODO: Document API methods.
