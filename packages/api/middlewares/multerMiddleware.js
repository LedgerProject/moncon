export const setFileName = async (req, res, next) => {
  try {
    console.log(req.query)
    const newFileName = `${req.query.userId}-${req.query.credential_type}-${Date.now()}`
    if(!req.locals){
      req.locals = {};
    }
    req.locals.newFileName = newFileName;
    return next();
  } catch (err) {
    console.error(err.message);
    return res.status(500).send({ error: 'Some error has occurred' });
  }
}