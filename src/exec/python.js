
const INSTALL_COMMAND_REGEX= /#install:\s*(.+)/;

function isAvailable() {
   return window.loadPyodide && typeof window.loadPyodide === "function"
}

const logger = {
    messages: [],
    log: function(log) {
        this.messages.push(log);
    },
    flush: function() {
        this.messages = [];
    }
}

async function getPyodide() {
    if(!window.pyodide) {
        const log = logger.log.bind(logger);
        window.pyodide = await loadPyodide({
            stdout: log,
            stderr: log
        });
        await window.pyodide.loadPackage('micropip')
        window.micropip = await window.pyodide.pyimport("micropip");
    }
    return window.pyodide;
}

async function installPipModules(code) {
    const firstLine = code.split("\n")[0] || "";
    //Adding the below line at top of the code will install the modules
    //#install: pandas,matplotlib
    const matches = firstLine.match(INSTALL_COMMAND_REGEX)
    if(matches && matches.length==2) {
        const installationPromise = matches[1].split(",")
            .map(module => window.micropip.install(module.trim()));
            await Promise.all(installationPromise);
    }
}

async function exec(_, data) {
    try {
        logger.flush();
        const pyodide = await getPyodide();
        const start = new Date();
        const code = data.files[""].trim();

        await installPipModules(code);
        await pyodide.loadPackagesFromImports(code)
        await pyodide.runPython(code)
        const elapsed = new Date() - start;
        return {
            ok: true,
            duration: elapsed,
            stdout: logger.messages.join("\n"),
            stderr: "",
        };
    } catch (exc) {
        console.log(exc)
        return {
            ok: false,
            duration: 0,
            stdout: "",
            stderr: exc.toString(),
        };
    }
}

export default { exec, isAvailable };
