const fs = require("fs-extra");

module.exports = function addNewBlocks(floor, blocks) {
  function writeData(data) {
    return fs
      .writeJson("./db/data.json", data)
      .then(() => {
        console.log("write success!");
      })
      .catch(err => {
        console.error(err);
      });
  }

  return fs.readJson("./db/data.json").then(data => {
    const _data = data;
    if (_data.floors[floor] === undefined) {
      if (Array.isArray(blocks)) {
        _data.floors[floor] = {
          allrooms: blocks,
          today: blocks[0]
        };
        writeData(_data);
      } else {
        _data.floors[floor] = {
          allrooms: [blocks],
          today: blocks
        };
      }
    } else {
      if (Array.isArray(blocks)) {
        _data.floors[floor].allrooms = [
          ..._data.floors[floor].allrooms,
          ...blocks
        ];
        writeData(_data);
      } else {
        _data.floors[floor].today = blocks;
        writeData(_data);
      }
    }
  });
};
