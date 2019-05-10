

function zeroEsquerda(str, length) {
    const resto = length - String(str).length;
    return '0'.repeat(resto > 0 ? resto : '0') + str;
  }


  function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); } 

  module.exports = {zeroEsquerda, isNumber}