import Joi from 'joi';

// Pagination schema using Joi
export const getUsers = {
  query: Joi.object({
    search: Joi.string().optional().allow(''),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(6),
    role: Joi.string().valid('all', 'user', 'admin').default('all'),
  })
};

//user register validation 
export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  screenLockPassword: Joi.string().allow(null, ''),
  resetPasswordToken: Joi.string().allow(null, ''),
  resetPasswordExpires: Joi.date().allow(null, '')
});

//user validation by admin
export const userRegistrationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('user', 'admin').required()
});
