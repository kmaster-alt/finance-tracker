export const patterns = {
  description: /^\S(?:.*\S)?$/,
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWord: /\b(\w+)\s+\1\b/i
};

export function validateRecord({ description, amount, category, date }) {
  const errors = {};
  if (!patterns.description.test(description)) errors.description = "No leading/trailing spaces.";
  else if (patterns.duplicateWord.test(description)) errors.description = "Remove duplicate word.";
  if (!patterns.amount.test(amount)) errors.amount = "Number, up to 2 decimals.";
  if (!patterns.category.test(category)) errors.category = "Letters, spaces, hyphens only.";
  if (!patterns.date.test(date)) errors.date = "Use YYYY-MM-DD.";
  return errors;
}