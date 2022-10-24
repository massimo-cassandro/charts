/* eslint-env node */
/* eslint-disable no-console */


// shell: npm info YOUR_PACKAGE version
import * as fs from 'fs';


try {

  const package_json_file = './package.json';

  let file_content = fs.readFileSync(package_json_file, 'utf8');
  const package_json = JSON.parse(file_content),
    version = package_json.version;

  let version_array = version.split('.').map(i => +i);
  version_array[2]++;
  let new_version = version_array.join('.');

  package_json.version = new_version;
  fs.writeFileSync(package_json_file, JSON.stringify(package_json, null, '  '));

  const outputString = `│  👍 Versione aggiornata: ${version} → ${new_version}  │`,
    frameLine = '─'.repeat(outputString.length - 2);

  console.log('\x1b[1m\x1b[33m');
  console.log('┌' + frameLine + '┐');
  console.log(outputString);
  console.log('└' + frameLine + '┘');
  console.log('\x1b[0m');

} catch (err) {
  console.error(`${err}`);
}

