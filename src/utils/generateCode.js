function generateCode(len=6) {

	const min = Math.pow(10, len-1);
    const max = Math.pow(10, len)-1;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}
module.exports = generateCode;