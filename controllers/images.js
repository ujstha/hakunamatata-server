const HttpStatus = require('http-status-codes');
const cloudinary = require('cloudinary');
const User = require('../models/userModels');

cloudinary.config({
  cloud_name: 'doo4zgtkg',
  api_key: '954528364226665',
  api_secret: 'XcFG6-Tbv7-OlGmR3CYsil7_j_k'
});

module.exports = {
  UploadImage(req, res) {
    cloudinary.uploader.upload(req.body.image, async result => {
      await User.update(
        {
          _id: req.user._id
        },
        {
          $push: {
            images: {
              imgId: result.public_id,
              imgVersion: result.version
            }
          }
        }
      )
        .then(() =>
          res
            .status(HttpStatus.OK)
            .json({ message: 'Image uploaded successfully' })
        )
        .catch(err =>
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error uploading image' })
        );
    });
  },

  async SetDefaultImage(req, res) {
    const { imgId, imgVersion } = req.params;

    await User.update(
      {
        _id: req.user._id
      },
      {
        picId: imgId,
        picVersion: imgVersion
      }
    )
      .then(() =>
        res.status(HttpStatus.OK).json({ message: 'Default image set' })
      )
      .catch(err =>
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' })
      );
  }
};
