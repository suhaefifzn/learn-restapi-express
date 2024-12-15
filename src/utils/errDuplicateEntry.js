const errDuplicateEntry = (error) => {
  const conflictFields = Object.keys(error.fields);
  const conflictValues = conflictFields.map((field) => ({
    field,
    value: error.fields[field],
  }));

  const errorMessage = `Duplikasi pada bagian ${conflictValues
    .map((conflict) => `${conflict.field} dengan nilai '${conflict.value}'`)
    .join(', ')}. Gunakan nilai yang berbeda.`;
  
  return errorMessage;
};

module.exports = { errDuplicateEntry };