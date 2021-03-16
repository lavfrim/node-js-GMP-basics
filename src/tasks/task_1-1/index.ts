import { Transform, TransformCallback } from 'stream';

const optimalStringReversal = (string: string): string => {
    let resultString = '';

    for (let i = string.length; i > 0; i -= 1) {
        resultString += string[i - 1];
    }

    return resultString;
};

class TransformStringReverse extends Transform {
    _transform(chunk: Buffer | string, encoding: BufferEncoding, callback: TransformCallback) {
        try {
            callback(
                null,
                optimalStringReversal(chunk.toString(typeof chunk === 'string' ? encoding : undefined)) + '\n'
            )
        } catch (err) {
            callback(err);
        }
    }
}

const transformStringReverse = new TransformStringReverse();

process.stdin.pipe(transformStringReverse).pipe(process.stdout);