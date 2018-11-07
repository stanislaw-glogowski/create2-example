const { sha3, isAddress } = web3.utils;

function numberToUint256(value) {
  let result = null;

  try {
    const hex = value.toString(16);
    result = `${'0'.repeat(64 - hex.length)}${hex}`;
  } catch (err) {
    result = null
  }

  return result
    ? `0x${result}`
    : '0x';
}

function buildCreate2Address(creatorAddress, saltHex, byteCode) {
  const parts = [
    'ff',
    creatorAddress,
    saltHex,
    sha3(byteCode),
  ].map((part) => part.startsWith('0x')
    ? part.slice(2)
    : part
  );

  const partsHash = sha3(`0x${parts.join('')}`);

  return `0x${partsHash.slice(-40)}`.toLowerCase();
}

module.exports = {
  sha3,
  isAddress,
  numberToUint256,
  buildCreate2Address,
};
