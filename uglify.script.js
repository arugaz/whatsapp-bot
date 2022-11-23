const fs = require("fs");
const path = require("path");
const UglifyJS = require("uglify-js");

let fileAmount = 0;
const Uglifies = async (pathname = "dist") => {
  const files = await fs.promises.readdir(path.join(__dirname, pathname));
  for (const file of files) {
    const filePath = path.join(__dirname, pathname, file);
    const isDirectory = (await fs.promises.lstat(filePath)).isDirectory();
    if (isDirectory) {
      await Uglifies(`${pathname}/${file}`);
    } else if (file.endsWith(".js")) {
      const code = await fs.promises.readFile(filePath, "utf8");
      const result = UglifyJS.minify(code, {
        compress: true,
        mangle: {
          toplevel: true,
        },
        module: true,
        toplevel: true,
      });
      await fs.promises.writeFile(filePath, result.code);
      fileAmount++;
    }
  }
};

const start = performance.now();
Uglifies()
  .then(() => {
    console.log(`Successfully minified ${fileAmount} files with Uglify (${(performance.now() - start).toFixed()}ms).`);
  })
  .catch(console.error);
