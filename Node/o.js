const otpGenerator = require('otp-generator');

// Generate a 6-digit numeric OTP
const otp = otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });

console.log('Generated OTP:', otp);


// Generate a random 4-digit number
function generateRandom4DigitNumber() {
    const min = 1000; // Minimum 4-digit number (inclusive)
    const max = 9999; // Maximum 4-digit number (inclusive)
    console.log(Math.random);
   const x=  Math.floor(Math.random() * (max - min + 1)) + min;
   console.log('random no. :'+x);
  }
  
  // Generate and display a random 4-digit number
  const random4DigitNumber = generateRandom4DigitNumber();
  console.log('Random 4-digit number:', random4DigitNumber);

  const randomFloat = Math.random();
console.log(randomFloat);