const { Wallet } = require("ethers");

const wallet = Wallet.createRandom();

console.log("📌 사용자 지갑 생성 완료");
console.log("주소:", wallet.address);
console.log("프라이빗 키:", wallet.privateKey);
console.log("니모닉:", wallet.mnemonic.phrase);
