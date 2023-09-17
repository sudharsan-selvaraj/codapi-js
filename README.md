# Embeddable code playgrounds

For education, documentation, and fun.

Embed interactive code snippets directly into your product documentation, online course, or blog post.

```
  python
┌───────────────────────────────┐
│ msg = "Hello, World!"         │
│ print(msg)                    │
│                               │
│                               │
│ run ►                         │
└───────────────────────────────┘
  ✓ took 387 ms
┌───────────────────────────────┐
│ Hello, World!                 │
└───────────────────────────────┘
```

Highlights:

-   Supports dozens of playgrounds out of the box, plus custom sandboxes if you need them.
-   Available as a cloud service and as a self-hosted version.
-   Privacy-first. No tracking, the code is discarded immediately after processing.
-   Lightweight and easy to integrate.

Learn more at [**codapi.org**](https://codapi.org/)

[Installation](#installation) •
[Usage](#usage) •
[Browser playgrounds](#browser-only-playgrounds) •
[Styling](#styling) •
[Stay tuned](#stay-tuned)

## Installation

Install with `npm`:

```
npm install @antonz/codapi
```

Or use a CDN:

```html
<script src="https://unpkg.com/@antonz/codapi@0.4.2/dist/snippet.js"></script>
```

## Usage

Let's start with a simple use case. Suppose you have a static code snippet in Python:

```html
<pre>
msg = "Hello, World!"
print(msg)
</pre>
```

To make it interactive, add a `codapi-snippet` element right after the `pre` element:

```html
<pre>
msg = "Hello, World!"
print(msg)
</pre>

<codapi-snippet sandbox="python" editor="basic"></codapi-snippet>
```

Note two properties here:

-   `sandbox` defines the engine that will execute the code. Usually it's the name of the language or software, like `python`, `bash` or `sqlite`.
-   `editor="basic"` enables code snippet editing.

Finally, include the default styles in the `head`:

```html
<link
    rel="stylesheet"
    href="https://unpkg.com/@antonz/codapi@0.4.2/dist/snippet.css"
/>
```

And the JavaScript file at the bottom of the page:

```html
<script src="https://unpkg.com/@antonz/codapi@0.4.2/dist/snippet.js"></script>
```

(CDNs like unpkg can sometimes be slow, so it's even better to host both files yourself)

And that's it! The `codapi-snippet` will automatically attach itself to the `pre`, allowing you to run and edit the code:

```
┌───────────────────────────────┐
│ msg = "Hello, World!"         │
│ print(msg)                    │
│                               │
│                               │
└───────────────────────────────┘
┌─────┐
│ Run │  Edit
└─────┘
```

To disable editing, set `editor="off"` instead of `editor="basic"`. To change the engine, set the appropriate `sandbox` value.

### Attaching to a specific element

To attach `codapi-snippet` to the specific code element (instead of using the preceding element), set the `selector` property to its CSS selector:

```html
<div id="playground">
    <pre class="code">
msg = "Hello, World!"
print(msg)
    </pre>
</div>

<!-- more HTML -->

<codapi-snippet sandbox="python" editor="basic" selector="#playground .code">
</codapi-snippet>
```

### Code highlighting and rich editing

To use `codapi-snippet` with code editors like CodeMirror, do the following:

1. Initialize the editor as usual.
2. Point `codapi-snippet` to the editor using the `selector` property.
3. Set `editor="external"` so that `codapi-snippet` does not interfere with the editor functions.

```html
<div id="editor"></div>

<!-- ... -->

<codapi-snippet sandbox="python" editor="external" selector="#editor">
</codapi-snippet>
```

### Templates

Templates help to keep snippets concise by hiding parts of the code behind the scenes.

Let's say you have a Go program:

```go
package main

import "fmt"

func main() {
    msg := "Hello, World!"
    fmt.Println(msg)
}
```

And suppose you don't want to distract the reader with `package` and `import`. Instead, you'd rather focus on the `main` body. In this case, do the following:

1. Prepare a template file `main.go`:

```go
package main

import (
    "fmt"
)

func main() {
    ##CODE##
}
```

2. Create a snippet with the actual code:

```html
<pre>
msg = "Hello, World!"
fmt.Println(msg)
</pre>

<codapi-snippet sandbox="go" editor="basic" template="main.go">
</codapi-snippet>
```

3. Host the `main.go` next to the web page containing the `codapi-snippet`.

Now `codapi-snippet` will preprocess the code using the template before sending it to the server.

Alternatively, you can use an in-page `script` tag with a code template and pass its `id` as a `template`:

```html
<script id="main.py" type="text/plain">
    def main():
        ##CODE##
</script>

<pre>
print("Hello, World!")
</pre>

<codapi-snippet sandbox="python" template="#main.py"></codapi-snippet>
```

The leading `#` in `template` and `type="text/plain"` in `script` are required.

### Files

For larger programs, you can pass multiple files along with the main one. Suppose you have a Python program with an `npc` module that you want to call from the main module. In this case, do the following:

1. Prepare a file `npc.py`:

```python
def greet(name):
    print(f"Hello, {name}")
```

2. Create a snippet with the actual code:

```html
<pre>
import npc
npc.greet("Alice")
</pre>

<codapi-snippet sandbox="python" files="npc.py"></codapi-snippet>
```

3. Host the `npc.py` next to the web page containing the `codapi-snippet`.

Now `codapi-snippet` will send `npc.py` to the server along with the main file.

To pass mutiple files, separate them with space:

```html
<codapi-snippet sandbox="python" files="file1.py file2.py"></codapi-snippet>
```

You can also define files using in-page `script`s:

```html
<script id="npc.py" type="text/plain">
    def greet(name):
        print(f"Hello, {name}")
</script>

<pre>
import npc
npc.greet("Alice")
</pre>

<codapi-snippet sandbox="python" files="#npc.py"></codapi-snippet>
```

### Custom actions

You can add buttons to the toolbar:

```html
<codapi-snippet sandbox="python" actions="Test:test Benchmark:bench">
</codapi-snippet>
```

Here we add two buttons:

-   "Test" executes the `test` command in the `python` sandbox.
-   "Benchmark" executes the `bench` command in the `python` sandbox.

```
┌───────────────────────────────┐
│ msg = "Hello, World!"         │
│ print(msg)                    │
│                               │
│                               │
└───────────────────────────────┘
┌─────┐
│ Run │  Test  Benchmark
└─────┘
```

To make a button trigger an event instead of executing a command, add `@` before the action name:

```html
<codapi-snippet sandbox="python" actions="Share:@share"> </codapi-snippet>
```

Here we add a "Share" button, which, when clicked, triggers the `share` event on the `codapi-snippet` element. We can then listen to this event and do something with the code:

```js
const snip = document.querySelector("codapi-snippet");
snip.addEventListener("share", (e) => {
    const code = e.target.code;
    // do something with the code
});
```

If you want the button title to contain spaces, replace them with underscores:

```html
<codapi-snippet sandbox="python" actions="Run_Tests:test Share_Code:@share">
</codapi-snippet>
```

## Browser-only playgrounds

Most playgrounds (like Python, PostgreSQL, or Bash) run code on the Codapi server.

But there are two playgrounds that work completely in the browser, no Codapi server required. You can use them right away, no need to join the beta program.

### JavaScript

Executes the code using the [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction).

```html
<pre>
const msg = "Hello, World!"
console.log(msg)
</pre>

<codapi-snippet sandbox="javascript" editor="basic"></codapi-snippet>
```

[Try it](https://codapi.org/javascript/)

### Fetch

Executes the code using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

```html
<pre>
POST https://httpbingo.org/dump/request
content-type: application/json

{
    "message": "hello"
}
</pre>

<codapi-snippet sandbox="fetch" editor="basic"></codapi-snippet>
```

[Try it](https://codapi.org/fetch/)

## Styling

The widget is unstyled by default. Use `snippet.css` for some basic styling or add your own instead.

Here is the widget structure:

```html
<codapi-snippet sandbox="python" editor="basic">
    <codapi-toolbar>
        <button>Run</button>
        <a href="#edit">Edit</a>
        <codapi-status> ✓ Took 1248 ms </codapi-status>
    </codapi-toolbar>
    <codapi-output>
        <pre><code>Hello, World!</code></pre>
    </codapi-output>
</codapi-snippet>
```

`codapi-snippet` is the top-level element. It contains the the toolbar (`codapi-toolbar`) and the code execution output (`codapi-output`). The toolbar contains a Run `button`, one or more action buttons (`a`) and a status bar (`codapi-status`).

## License

Copyright 2023+ [Anton Zhiyanov](https://antonz.org/).

The software is available under the MIT License.

## Stay tuned

[**★ Subscribe**](https://antonz.org/subscribe/) to stay on top of new features.
