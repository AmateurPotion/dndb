import { matches } from "safe-filter/index.js";
import { ReadFileStream, WriteFileStream } from "dndb/storage.ts";
import type { DataObject } from "dndb/types.ts";

export default (
  filename: string,
  query: Partial<DataObject> = {},
  bufSize?: number,
) => {
  const readStream = new ReadFileStream(filename, bufSize);
  const writeStream = new WriteFileStream(filename);
  const removed: DataObject[] = [];
  return new Promise<DataObject[]>((resolve) => {
    readStream.on("document", (obj) => {
      if (!matches(query, obj)) {
        writeStream.write(obj);
      } else {
        removed.push(obj);
      }
    });
    readStream.on("end", () => {
      writeStream.end();
    });
    writeStream.on("close", () => {
      return resolve(removed);
    });
  });
};
