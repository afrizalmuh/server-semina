const Participant = require('../../api/v1/participants/model')
const Events = require('../../api/v1/events/model')
const Orders = require('../../api/v1/orders/model')
const Payments = require('../../api/v1/payments/model')
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../../errors')
const { otpMail, eticketingMail } = require('../mail')
const { createJWT, createTokenParticipant } = require('../../utils')

module.exports = {
  signupParticipants: async (req) => {
    const { firstName, lastName, email, password, role } = req.body
    let result = await Participant.findOne({
      email,
      status: 'tidak aktif'
    })
    console.log('result participant => ', result)

    if (result) {
      result.firstName = firstName;
      result.lastName = lastName;
      result.role = role;
      result.email = email;
      result.password = password;
      result.otp = Math.floor(Math.random() * 9999);
      await result.save()
    } else {
      result = await Participant.create({
        firstName,
        lastName,
        email,
        password,
        role,
        otp: Math.floor(Math.random() * 9999)
      })
    }

    await otpMail(email, result)
    delete result._doc.password;
    delete result._doc.otp;
    return result
  },
  activateParticipants: async (req) => {
    const { otp, email } = req.body
    const check = await Participant.findOne({ email })
    console.log('check : ', email)
    if (!check) throw new NotFoundError('Partisipan belum terdaftar')
    if (check && check.otp != otp) throw new BadRequestError('Kode otp salah')

    const result = await Participant.findByIdAndUpdate(
      check._id,
      { status: 'aktif' },
      { new: true, runValidators: true }
    )
    delete result._doc.password
    delete result._doc.otp
    return result
  },
  signinParticipants: async (req) => {
    const { email, password } = req.body
    if (!email || !password) {
      throw new BadRequestError('Please provide email and password')
    }
    const result = await Participant.findOne({ email: email })
    if (!result)
      throw new UnauthorizedError('Invalid credentials')
    if (['tidak aktif'].includes(result.status))
      throw new UnauthorizedError('Akun anda belum aktif')

    const isPasswordCorrect = await result.comparePassword(password)
    if (!isPasswordCorrect)
      throw new UnauthorizedError('Invalid credentials')

    const token = createJWT({ payload: createTokenParticipant(result) })
    return token
  },
  getAllEvents: async (req) => {
    const result = await Events.find({ statusEvent: 'Published' })
      .populate('category')
      .populate('image')
      .select('_id title date tickets venueName')

    return result
  },
  getOneEvent: async (req) => {
    const { id } = req.params
    const result = await Events.findOne({ _id: id })
      .populate('category')
      .populate('talent')
      .populate('image')

    if (!result)
      throw new NotFoundError(`Tidak ada pembicara dengan id: ${id}`)

    return result
  },
  getAllOrders: async (req) => {
    //console.log(req.participant)
    const result = await Orders.find({ participant: req.participant.id })
    return result
  },
  checkoutOrder: async (req) => {
    const { event, personalDetail, payment, tickets } = req.body

    const checkingEvent = await Events.findOne({ _id: event })
    if (!checkingEvent)
      throw new NotFoundError('Tidak ada acara dengan Id: ', event)
    console.log('checking event => ', checkingEvent)
    const checkingPayement = await Payments.findOne({ _id: payment })
    if (!checkingPayement)
      throw new NotFoundError('Tidak ada metode pembayaran dengan id: ', payment)

    let totalPay = 0, totalOrderTicket = 0
    await tickets.forEach((tic) => {
      checkingEvent.tickets.forEach((ticket) => {
        if (tic.ticketCategories.type === ticket.type) {
          if (tic.sumTicket > ticket.stock) {
            throw new NotFoundError('Stock event tidak mencukupi')
          } else {
            ticket.stock -= tic.sumTicket
            totalOrderTicket += tic.sumTicket
            totalPay += tic.ticketCategories.price * tic.sumTicket
          }
        }
      })
    })

    await checkingEvent.save();
    const historyEvent = {
      title: checkingEvent.title,
      date: checkingEvent.date,
      about: checkingEvent.about,
      tagline: checkingEvent.tagline,
      keypoint: checkingEvent.keyPoint,
      venueName: checkingEvent.venueName,
      tickets: tickets,
      image: checkingEvent.image,
      category: checkingEvent.category,
      talent: checkingEvent.talent,
      organizer: checkingEvent.organizer
    }


    const result = new Orders({
      date: new Date(),
      personalDetail: personalDetail,
      totalPay,
      totalOrderTicket,
      orderItems: tickets,
      participant: req.participant.id,
      event,
      historyEvent,
      payment
    })

    if (!result)
      throw new BadRequestError('Terjadi kesalahan saat pengisian data order')
    console.log('result => ', result)
    await eticketingMail(personalDetail.email, result)

    await result.save();
    return result;
  }
}