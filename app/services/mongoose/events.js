const Events = require('../../api/v1/events/model')
const { checkinImage } = require('./images')
const { checkinCategories } = require('./categories')
const { checkingTalents } = require('./talents')

const { NotFoundError, BadRequestError } = require('../../errors')

const getAllEvents = async (req) => {
  const { keyword, category, talent, status } = req.query;
  let condition = { organizer: req.user.organizer }
  if (keyword) {
    condition = { ...condition, title: { $regex: keyword, $options: 'i' } };
    // condition = { ...condition, title: new RegExp(keyword, 'i') };
  }
  // console.log(`Category => ${category}`)
  if (category) {
    condition = { ...condition, category: category };
  }

  if (talent) {
    condition = { ...condition, talent: talent };
  }

  if (status) {
    condition = { ...condition, statusEvent: status }
  }

  //console.log(`condition => ${JSON.stringify(condition)}`)
  const result = await Events.find(condition)
    .populate({ path: 'image', select: '_id name' })
    .populate({
      path: 'category',
      select: '_id name'
    })
    .populate({
      path: 'talent',
      select: '_id name role image',
      populate: { path: 'image', select: '_id name' }
    })

  //console.log(`result => ${result}`)
  return result
}

const createEvents = async (req) => {
  const {
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
  } = req.body

  //search image, category and talent using this field id
  await checkinImage(image);
  await checkinCategories(category);
  await checkingTalents(talent);

  //search events using field name
  const resultEvents = await Events.findOne({ title });

  if (resultEvents)
    throw new BadRequestError('Judul event duplikat')

  const result = await Events.create({
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent,
    organizer: req.user.organizer
  });

  return result
}

const getOneEvents = async (req) => {
  const { id } = req.params;
  const result = await Events.findOne({ _id: id, organizer: req.user.organizer })
    .populate({ path: 'image', select: '_id name' })
    .populate({
      path: 'talent',
      select: '_id name role image',
      populate: { path: 'image', select: '_id name' }
    })

  if (!result) throw new NotFoundError(`Tidak ada pembicara dengan Id: ${id}`)
  return result
}

const updateEvents = async (req) => {
  const { id } = req.params
  const {
    title,
    date,
    about,
    tagline,
    venueName,
    keyPoint,
    statusEvent,
    tickets,
    image,
    category,
    talent
  } = req.body

  await checkinImage(image);
  await checkinCategories(category);
  await checkingTalents(talent);

  const checkEvent = await Events.findOne({ _id: id })
  if (!checkEvent) throw new NotFoundError(`Tidak ada acara dengan Id: ${id}`)


  const check = await Events.findOne({
    title,
    organizer: req.user.organizer,
    _id: { $ne: id }
  })

  if (check) throw new BadRequestError('judul acara sudah terdaftar')

  const result = await Events.findOneAndUpdate(
    { _id: id },
    {
      title,
      date,
      about,
      tagline,
      venueName,
      keyPoint,
      statusEvent,
      tickets,
      image,
      category,
      talent,
      organizer: req.user.organizer
    },
    { new: true, runValidators: true }
  )


  return result
}

const deleteEvents = async (req) => {
  const { id } = req.params
  const result = await Events.findOne({ _id: id, organizer: req.user.organizer })
  if (!result)
    throw new NotFoundError(`Tidak ada acara dengan Id: ${id}`)

  await result.deleteOne()
  return result
}

const changeStatusEvents = async (req) => {
  const { id } = req.params;
  const { statusEvent } = req.body;

  if (!['Draft', 'Published'].includes(statusEvent)) {
    throw new BadRequestError('Status Event tidak sesuai bos!')
  }
  const checkEvent = await Events.findOne({ _id: id, organizer: req.user.organizer })
  checkEvent.statusEvent = statusEvent
  await checkEvent.save()

  return checkEvent
}

module.exports = {
  createEvents,
  getAllEvents,
  getOneEvents,
  updateEvents,
  deleteEvents,
  changeStatusEvents
}