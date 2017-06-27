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

Install the [Ply server](https://github.com/sarahlim/ply/) and launch it with

```sh
yarn run server  # in the Ply directory, not the chrome-remote-css directory
```

Now, in Chrome:

1. Navigate to any site
2. Click on the icon next to the address bar: ![grey inactive Delta icon](https://github.com/sarahlim/chrome-remote-css/raw/master/icons/icon-inactive-16.png)
3. After a short delay (nearly-instant for small websites, up to ~5-10s for large production sites with lots of styles like Facebook), an element selection cursor should appear on the page.
    - If not, check the background page console for errors.

## Debugging

Go to `chrome://extensions`, find the entry for `chrome-remote-css`, and click **Inspect views:** `background.html` to launch the console for the background page.

## API

TODO: Document API methods.
