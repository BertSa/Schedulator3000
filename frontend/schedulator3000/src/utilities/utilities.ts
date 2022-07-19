/* eslint-disable no-mixed-operators,no-nested-ternary */
export const regex = Object.freeze({
  email: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
  phone: /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/,
  password: /.{5,}/,
  name: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
});

export default {};
