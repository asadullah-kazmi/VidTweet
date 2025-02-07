const asyncHandler = (requestHandler) =>{
  return (req, res, next) =>{
    Promise.resolve(
      requestHandler(req, res, next)
    ).catch((error) => next(error))
  }
}

export {asyncHandler}



/*
const asyncHandler = (fn) => (req, res, next) =>{
  try{
    await fn(req, res, next)
  }catch((error)=>{
    res.status(err.code || 500).json({
     status: false,
     message: err.message
    })
    })

  }

*/