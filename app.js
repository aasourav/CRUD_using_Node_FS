const fs = require("fs/promises");

(async () => {
  //Create file cf
  //delete file rm
  //rename file rnm
  //add data to file addData

  const openFile = await fs.open("./command.txt", "r");

  const createFile = async (filePath) => {
    try {
      const isFileExist = await fs.open(filePath, "r");
      if (isFileExist) {
        isFileExist.close();
        return console.log("File already exist");
      }
    } catch (err) {
      const newFile = await fs.open(filePath, "w");
      console.log("successfully created");
      newFile.close();
    }
  };

  const deleteFile = async (file) => {
    try {
      const isFileExist = await fs.open(file, "r");
      await fs.unlink(file);
      isFileExist.close();
    } catch (err) {
      console.log("File does not exist.");
    }
  };

  const renameFile = async (oldPath, newPath) => {
    try {
      const fileHandle = await fs.rename(oldPath, newPath);
      console.log("Successfully renamed");
      fileHandle.close();
    } catch (err) {
      console.log("File does not exist");
    }
  };

  const addContent = async (path, content) => {
    try {
      const fileHandle = await fs.open(path, "a");
      fileHandle.write(content);
      fileHandle.close();
    } catch (err) {
      console.log("an error occurred");
    }
  };

  openFile.on("change", async () => {
    const statsOfFile = await openFile.stat();
    const bufferSize = statsOfFile.size;
    const buffer = Buffer.alloc(bufferSize);
    const data = await openFile.read(buffer, 0, bufferSize, 0);
    // console.log(data.toString("utf-8"));
    // console.log(data.buffer.toString());
    // console.log(buffer);
    // console.log(JSON.stringify(buffer).includes("hello bro"));
    const command = buffer.toString();
    if (command.includes("cf")) {
      const commandSize = command.split("/").length;
      createFile(command.split(" ")[1]);
    } else if (command.includes("rm")) {
      deleteFile(command.split(" ")[1]);
    } else if (command.includes("rnm")) {
      renameFile(command.split(" ")[1], command.split(" ")[2]);
    } else if (command.includes("addData")) {
      addContent(
        command.split(" ")[1],
        command.substring(command.split(" ")[1].length)
      );
    }
  });

  const wathcher = fs.watch("./command.txt");
  for await (const event of wathcher) {
    if (event.eventType === "change") {
      openFile.emit("change", event);
    }
  }
})();
