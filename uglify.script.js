const fs = require("fs");
const path = require("path");
const UglifyJS = require("uglify-js");

const Uglifies = async (pathname) => {
  const files = await fs.promises.readdir(path.join(__dirname, pathname));
  for (const file of files) {
    const filePath = path.join(__dirname, pathname, file);
    const isDirectory = (await fs.promises.lstat(filePath)).isDirectory();
    if (isDirectory) {
      await Uglifies(`${pathname}/${file}`);
    } else if (file.endsWith(".js")) {
      const code = await fs.promises.readFile(filePath, "utf8");
      const result = UglifyJS.minify(code, {
        toplevel: true,
        mangle: true,
        compress: true,
      });
      await fs.promises.writeFile(filePath, result.code);
    }
  }
};
Uglifies("dist").catch(console.error);
