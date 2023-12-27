# Browser-only playgrounds

Most playgrounds (like Python, PostgreSQL, or Bash) run code on the Codapi server.

But there are some playgrounds that work completely in the browser, no Codapi server required.

Note: Python execution is now supported directly from browser and also via Codapi server.

## JavaScript

Executes the code using the [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction).

```html
<pre>
const msg = "Hello, World!"
console.log(msg)
</pre>

<codapi-snippet sandbox="javascript" editor="basic"></codapi-snippet>
```

[Try it](https://codapi.org/javascript/)

## Fetch

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


## Python

Now users can run native python code and install any pip module directly from the browser with the help of pydiode. You need to load pyodide js module in you webpage by adding below script.

```html
<script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"></script>
```

Sample html:

```html
<head>
    <script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"></script>
    //load snippet.js and snippet.css
</head>

 <div id="playground">
            <pre class="code">
            import sys
            print(sys.version)
            </pre>

    <codapi-snippet sandbox="python" editor="basic" selector="#playground .code">
    </codapi-snippet>
</div>   
```

Output:
```
3.11.3 (main, Sep 25 2023, 20:45:01) [Clang 18.0.0 (https://github.com/llvm/llvm-project d1e685df45dc5944b43d2547d013
```

### Installing pip module

You can also install any pip module and use it in the code block. To install any module add the below statement in the first line of the code.

```
#install: pandas,matplot
```

You can add multiple module separated by comma

Sample html:

```html
<head>
    <script src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"></script>
    //load snippet.js and snippet.css
</head>

 <div id="playground">
            <pre class="code">
            #install: pandas
            import pandas as pd
            data = {
            "calories": [420, 380, 390],
            "duration": [50, 40, 45]
            }

            #load data into a DataFrame object:
            df = pd.DataFrame(data)

            print(df)
            </pre>

    <codapi-snippet sandbox="python" editor="basic" selector="#playground .code">
    </codapi-snippet>
</div>   
```

Output:
```
   calories  duration
0       420        50
1       380        40
2       390        45
```
