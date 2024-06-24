const joi = require("joi");
const mongoose = require("mongoose");
//Set up default mongoose connection

const categorySchema = mongoose.Schema(
  {
    title: {
      type: String,
      requred: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      requred: true,
    },
   
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("categorys", categorySchema);

// schema validation for input in stead of express validator
function validateCategory(obj) {
  const schema = joi.object({
    title: joi.string().required().trim().label(" enter title "),
  });
  return schema.validate(obj);
}

module.exports = {
    Category,
    validateCategory,
  
};
