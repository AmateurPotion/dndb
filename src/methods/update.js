import { mongobj, matches } from '../../deps.ts';
import { ReadFileStream, WriteFileStream } from '../storage.ts';

export default async (filename ,query, operators, projection) => {
  const readStream = new ReadFileStream(filename);
  const writeStream = new WriteFileStream(filename);
  let updated = [];
  return new Promise((resolve, reject) => {
    readStream.on('document', obj => {
      if (matches(query, obj)) {
        mongobj.update(obj, operators);
        updated.push(obj)
      }
      writeStream.emit("write", obj)
    })
    readStream.on("end", () => {
      writeStream.emit("end");
    })
    writeStream.on("close", () => {
      return resolve(updated)
    })
  })
}