import joi from "joi";

export const schema = joi
  .object({
    slug: joi.string().required(),
    title: joi.string().required(),
    content: joi.string().required(),
    createDate: joi.string().isoDate().required(),
  })
  .required();
