const Categories = require('../../api/v1/categories/models');
const { BadRequestError, NotFoundError } = require('../../errors');

const getAllCategories = async (req) => {
  const result = await Categories.find({ organizer: req.user.organizer });
  return result;
}

const createCategories = async (req) => {
  const { name } = req.body;
  //cari kategori dgn field name
  const check = await Categories.findOne({ name: name, organizer: req.user.organizer });


  if (check) throw new BadRequestError('kategori nama duplikat');

  const result = await Categories.create({
    name,
    organizer: req.user.organizer
  });

  return result
}

const getOneCategories = async (req) => {
  const { id } = req.params;
  const result = await Categories.findOne({
    _id: id,
    organizer: req.user.organizer
  })
  if (!result) throw new NotFoundError(`Tidak ada kategori degan Id: ${id}`);
  return result;
}

const updateCategories = async (req) => {
  const { id } = req.params
  const { name } = req.body
  console.log(id);
  const check = await Categories.findOne({
    name,
    organizer: req.user.organizer,
    _id: { $ne: id },
  });
  console.log(check)
  if (check) throw new BadRequestError(`Kategori nama duplikat`)

  const result = await Categories.findOneAndUpdate({ _id: id }, { name }, { new: true, runValidators: true })
  if (!result) throw new NotFoundError(`Tidak ada kategori dengan Id ${id}`);
  return result;
}

const deleteCategories = async (req) => {
  const { id } = req.params;
  const result = await Categories.findOne({
    _id: id,
    organizer: req.user.organizer
  });
  console.log(result)
  if (!result) throw new NotFoundError(`Tidak ada kategori dengan Id: ${id}`);
  await result.deleteOne();
  return result;
  //another way
  // const remove = await Categories.findByIdAndRemove({ _id: id })
  // return remove;
}

const checkinCategories = async (id) => {
  const result = await Categories.findOne({ _id: id })
  if (!result)
    throw new NotFoundError(`Tidak ada kategori dengan Id: ${id}`)
  return result
}

module.exports = {
  getAllCategories,
  createCategories,
  getOneCategories,
  updateCategories,
  deleteCategories,
  checkinCategories
}