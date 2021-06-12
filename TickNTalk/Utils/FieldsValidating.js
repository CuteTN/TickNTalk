export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}

/**
 * @param {object} user 
 * @returns {{isValid: boolean, message: string}}
 */
export const checkEnoughUserInfo = (user) => {
  const result = {
    isValid: true,
    message: "",
  }

  if (!user) {
    return {
      isValid: false,
      message: "User does not exist."
    }
  }

  const listCheckFields = {
    firstName: {
      name: "First name",
    },

    lastName: {
      name: "Last name",
    },

    birthday: {
      name: "Birthday",
    },

    gender: {
      name: "Gender",
    }
  }

  Object.entries(listCheckFields).forEach(field => {
    if (!user[field[0]] && result.isValid) {
      result.isValid = false;
      result.message = `${field[1].name} is required.`;
    }
  })

  return result;
}