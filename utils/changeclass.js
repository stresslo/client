import fs from "fs"
import glob from "glob"

const cssDirPath = 'src/style/*.css'; // Path to your CSS directory
const srcDirPath = './*.jsx'; // Path to your source code directory (where your React components are)

// Mencocokkan pola file CSS
glob(cssDirPath, (err, cssFiles) => {
  if (err) {
    console.error('Error matching CSS files:', err);
    return;
  }

  // Iterasi melalui setiap file CSS
  cssFiles.forEach(cssFilePath => {
    // Baca isi file CSS
    fs.readFile(cssFilePath, 'utf8', (err, cssData) => {
      if (err) {
        console.error('Error reading CSS file:', err);
        return;
      }

      // Ganti nama kelas dalam file CSS
      const updatedCSS = cssData.replace(/\.([^\s,{]+)/g, (match, className) => {
        const randomSuffix = Math.random().toString(36).substring(7);
        return `.${className}-${randomSuffix}`;
      });

      // Tulis kembali isi file CSS yang sudah diubah
      fs.writeFile(cssFilePath, updatedCSS, 'utf8', (err) => {
        if (err) {
          console.error('Error writing updated CSS file:', err);
          return;
        }
        console.log(`CSS class names in ${cssFilePath} updated successfully.`);
      });

      // Mencocokkan pola file JSX
      glob(srcDirPath, (err, jsxFiles) => {
        if (err) {
          console.error('Error matching JSX files:', err);
          return;
        }

        // Iterasi melalui setiap file JSX
        jsxFiles.forEach(jsxFilePath => {
          // Baca isi file JSX
          fs.readFile(jsxFilePath, 'utf8', (err, jsxData) => {
            if (err) {
              console.error('Error reading JSX file:', err);
              return;
            }

            // Ganti nama kelas dalam file JSX
            const updatedJSX = jsxData.replace(/className="(.*?)"/g, (match, classNames) => {
              const updatedClassNames = classNames.split(' ').map(className => {
                const randomSuffix = Math.random().toString(36).substring(7);
                return `${className}-${randomSuffix}`;
              });
              return `className="${updatedClassNames.join(' ')}"`;
            });

            // Tulis kembali isi file JSX yang sudah diubah
            fs.writeFile(jsxFilePath, updatedJSX, 'utf8', (err) => {
              if (err) {
                console.error('Error writing updated JSX file:', err);
                return;
              }
              console.log(`Class names in ${jsxFilePath} updated successfully.`);
            });
          });
        });
      });
    });
  });
});
