import { AutoTheme } from "./index";

console.log("Loaded test...");

new AutoTheme((useDark: boolean) => {
    console.log(useDark ? "dark" : "light");
});

process.exit(1);
