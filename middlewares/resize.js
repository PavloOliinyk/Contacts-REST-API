const path = require('path');
const Jimp = require('jimp');

const resize = async (req, res, next) => {
  try {
    const image = await Jimp.read(req.file.path);
    await image.resize(250, 250);
    await image.writeAsync(
      `${path.join(req.file.destination, req.file.filename)}`,
    );
    next();
  } catch (error) {
    if (!error.status) {
      error.status = 401;
      error.message = 'Not authorized';
    }
    next(error);
  }
};

module.exports = resize;
