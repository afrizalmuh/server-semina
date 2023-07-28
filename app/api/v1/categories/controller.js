const { getAllCategories, createCategories, getOneCategories, updateCategories, deleteCategories } = require('../../../services/mongoose/categories');
const { StatusCodes } = require('http-status-codes');

const create = async (req, res, next) => {
  try {
    const result = await createCategories(req);
    res.status(StatusCodes.CREATED).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    const result = await getAllCategories(req);
    res.status(StatusCodes.OK).json({
      data: result,
    })
  } catch (err) {
    next(err);
  }
};

const find = async (req, res, next) => {
  try {
    const result = await getOneCategories(req)
    res.status(StatusCodes.OK).json({
      data: result,
    })
  } catch (err) {
    next(err)
  }
};

const update = async (req, res, next) => {
  try {
    //cara 1
    // const result = await Categories.findOne({ _id: id })
    // if (!result)
    //   return res.status(404).json({ message: "Id tidak ditemukan" });

    // result.name = req.body.name
    // result.save();

    //cara 2
    const result = await updateCategories(req);
    res.status(StatusCodes.OK).json({
      message: "berhasil update",
      data: result,
    });

  } catch (err) {
    next(err)
  }
};

const destroy = async (req, res, next) => {
  try {
    const result = await deleteCategories(req)
    res.status(StatusCodes.OK).json({
      message: "data berhasil dihapus",
      data: result
    })
  } catch (err) {
    next(err)
  }
};

module.exports = {
  create,
  index,
  find,
  update,
  destroy,
}