// converte i colori definiti in `chart-colors.css` nell'oggetto esportato da
// chart-colors.js utilizzato in mCharts

// import * as path from 'path';
import * as fs_promises from 'node:fs/promises';

const css_file = './default-chart-colors.css',
  js_file = '../src/utils/default-chart-colors.js',

  camelCase = str => {
    return str.trim().toLowerCase().replace(/-(.)/g, function(match, group1) {
      return group1.toUpperCase();
    });
  }
;


const css_content = await fs_promises.readFile(css_file, { encoding: 'utf8' }),
  regex = /\s*(--(?<name>(.*?)):\s*(?<color>(.*?));)/g,
  matches = css_content.matchAll(regex);

const output = [
  '// Documento generato da `default-chart-colors.css`.',
  '// Non editare',
  '',
  'export const default_colors = {'
];

for (const match of matches) {

  if(match?.groups) {
    output.push(
      `  ${camelCase(match.groups.name)}: '${match.groups.color}',`
    );
  }
}

output.push('};', '');

await fs_promises.writeFile(js_file, output.join('\n'));
