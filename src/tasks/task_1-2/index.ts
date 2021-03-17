import fs from 'fs';
import path from 'path'
import readline from 'readline';
import csvtojson from 'csvtojson';

const extArray = ['.csv'];

const convertCSVtoJSON = () => {
    const rlTerminalInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

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

            try {
                const readCSVStream = fs.createReadStream(filePath);
                const convertSteam = csvtojson();
                const writeJSONStream = fs.createWriteStream(path.join(__dirname, 'txt', `${pathObj.name}.txt`));
                const rlInterface = readline.createInterface({
                    input: readCSVStream,
                });

                rlInterface.on('line', (line) => {
                    convertSteam.write(line + '\n');
                });

                convertSteam.pipe(writeJSONStream);

                rlTerminalInterface.close();
            } catch (err) {
                console.log(err);
                rlTerminalInterface.close();
            }
        })
    });
}

convertCSVtoJSON();
