const reverse = (string) => {
  return string.split('').reverse().join('');
};

const average = (array) => {
  const total = array.reduce((acum, curr) => {
    return acum + curr;
  }, 0);
  
  return array.length === 0 ? 0 : total / array.length;
};

module.exports = { reverse, average };
