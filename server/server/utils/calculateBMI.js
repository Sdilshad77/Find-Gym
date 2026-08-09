const calculateBMI = (height, weight) => {
  // Height in cm
  const heightInMeter = Number(height) / 100;

  const bmi = Number(weight) / (heightInMeter * heightInMeter);

  let category = "";

  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "Normal";
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
  } else {
    category = "Obese";
  }

  return {
    bmi: bmi.toFixed(1),
    category,
  };
};

export default calculateBMI;