import Joi from 'joi';

//create todo by user validation
export const createTodoSchema = Joi.object({
    todoName: Joi.string().required().min(5).max(30),
    date: Joi.date().iso().required(),
    gender: Joi.string().valid('male', 'female').required(),
    status: Joi.string().valid('pending', 'completed').required(),
    description: Joi.string().required(),
});

//create todo of user by admin validation
export const todoSchema = Joi.object({
    todoName: Joi.string().required().min(5).max(30),
    date: Joi.date().required(), 
    gender: Joi.string().valid('male', 'female', 'other').required(), 
    status: Joi.string().valid('pending', 'completed', 'other').required(), 
    description: Joi.string().required(),
    userId: Joi.string().required() 
});