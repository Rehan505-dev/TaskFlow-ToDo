const fs = require("fs");
const vm = require("vm");

const requiredFiles = ["index.html", "style.css", "script.js", "package.json"];

for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
        throw new Error(`Missing required file: ${file}`);
    }
}

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("style.css", "utf8");
const js = fs.readFileSync("script.js", "utf8");

if (!html.includes("TaskFlow")) {
    throw new Error("Application title is missing.");
}

if (!html.includes("taskForm") || !html.includes("taskList")) {
    throw new Error("Required application elements are missing.");
}

if (!css.includes(".card")) {
    throw new Error("Main CSS styling is missing.");
}

try {
    new vm.Script(js);
} catch (error) {
    throw new Error(`JavaScript syntax error: ${error.message}`);
}

console.log("All CI checks passed.");
