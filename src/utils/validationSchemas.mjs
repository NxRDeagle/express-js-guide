export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Username must be at least 5 characters with a max of 32 characters.",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty.",
    },
    isString: {
      errorMessage: "Username must be a string.",
    },
  },
  displayName: {
    notEmpty: true,
  },
  password: {
    notEmpty: true,
  },
};

export const getUsersValidationSchema = {
  filter: {
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage: "Filter must be at least 3-10 characters.",
    },
    notEmpty: {
      errorMessage: "Filter cannot be empty.",
    },
    isString: {
      errorMessage: "Filter must be a string.",
    },
  },
};
