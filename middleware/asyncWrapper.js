const wrap = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next)
  } catch (err) {
    console.log(`ERROR: ${err}`)
    next(err)
  }
}

module.exports = wrap
