import Joi from "joi";

export const generalFieldValidation = {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().messages({
        "string.min": "password must be at least 8 char"
    }),
    file: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().required(),
        destination: Joi.string().required(),
        filename: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().positive().required()
    }
    )
}

export const validation = (schema) => {
    return (req, res, next) => {
        const inputsData = { ...req.body, ...req.params, ...req.query };
        console.log(inputsData);
        if (req.file || req.files) {
            inputsData.file = req.file || req.files;
        }
        console.log(inputsData);

        const validationResult = schema.validate(inputsData, { abortEarly: false });
        console.log(validationResult);

        if (validationResult.error?.details) {
            return res.status(400).json({ message: 'validation Error', validationError: validationResult.error?.details })
        }
        next()
    }
}