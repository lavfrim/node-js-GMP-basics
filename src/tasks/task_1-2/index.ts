import fs from 'fs';
import path from 'path'
import readline from 'readline';
import csvtojson from 'csvtojson';

const extArray = ['.csv'];

const rlTerminalInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const convertCSVtoJSON = () => {
    rlTerminalInterface.question('\nType CSV file path: ', (readFilePath) => {
        const pathObj = path.parse(readFilePath);
        const filePath = path.join(__dirname, pathObj.root, pathObj.dir, pathObj.base);

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                if (!extArray.includes(pathObj.ext)) {
                    console.log(`File have to be ${extArray.map(ext => '*' + ext).join(', ')}`);
                    rlTerminalInterface.close();
                    convertCSVtoJSON();
                    return;
                }

                console.log(err);
                rlTerminalInterface.close();
                convertCSVtoJSON();
                return;
            }

            const readCSVStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
            const convertSteam = csvtojson({ delimiter: ';' }, { encoding: 'utf-8' });
            const writeJSONStream = fs.createWriteStream(
                path.join(__dirname, 'txt', `${pathObj.name}.txt`),
                { encoding: 'utf-8' },
                );
            const rlInterface = readline.createInterface({
                input: readCSVStream,
            });

            readCSVStream.on('error', (err) => console.log(err));
            convertSteam.on('error', (err) => console.log(err));
            writeJSONStream.on('error', (err) => console.log(err));
            rlInterface.on('line', (line) => {
                convertSteam.write(line + '\n');
            });

            convertSteam.pipe(writeJSONStream);

            rlTerminalInterface.close();
        })
    });
}

convertCSVtoJSON();
