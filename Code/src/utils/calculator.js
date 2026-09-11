// Financial and EMI Calculator Utility (NSFDC Lending Norms)

export function calculateLoanDetails(arg1, arg2, arg3, arg4) {
  // Support both object call: calculateLoanDetails({ projectCost, ... })
  // and positional call: calculateLoanDetails(projectCost, loanPercentage, ...)
  let projectCost = 100000;
  let loanPercentage = 90;
  let interestRate = 6.5;
  let tenureYears = 3;
  let moratoriumMonths = 3;

  if (typeof arg1 === 'object' && arg1 !== null) {
    projectCost = Number(arg1.projectCost) || 100000;
    loanPercentage = Number(arg1.loanPercentage) || 90;
    interestRate = Number(arg1.interestRate) || 6.5;
    tenureYears = Number(arg1.tenureYears) || 3;
    moratoriumMonths = Number(arg1.moratoriumMonths !== undefined ? arg1.moratoriumMonths : 3);
  } else if (typeof arg1 === 'number') {
    // If loanAmount passed directly as arg1
    const principalArg = arg1;
    interestRate = Number(arg2) || 6.5;
    tenureYears = Number(arg3) || 3;
    moratoriumMonths = Number(arg4 !== undefined ? arg4 : 3);
    projectCost = Math.round(principalArg / 0.9);
    loanPercentage = 90;
  }

  const principal = Math.min(
    Math.round(projectCost * (loanPercentage / 100)),
    projectCost
  );
  const promoterContribution = Math.max(0, projectCost - principal);

  // Monthly interest rate
  const monthlyRate = interestRate / (12 * 100);
  
  // Total months of repayment after moratorium
  const totalMonths = tenureYears * 12;
  const repaymentMonths = Math.max(1, totalMonths - moratoriumMonths);

  let monthlyEmi = 0;
  if (monthlyRate > 0 && repaymentMonths > 0) {
    const factor = Math.pow(1 + monthlyRate, repaymentMonths);
    monthlyEmi = Math.round((principal * monthlyRate * factor) / (factor - 1));
  } else if (repaymentMonths > 0) {
    monthlyEmi = Math.round(principal / repaymentMonths);
  }

  // Calculate simple interest accrued during moratorium if applicable
  const moratoriumInterest = Math.round(principal * monthlyRate * moratoriumMonths);
  
  const totalRepayment = (monthlyEmi * repaymentMonths) + moratoriumInterest;
  const totalInterest = Math.max(0, totalRepayment - principal);

  return {
    projectCost,
    principal,
    promoterContribution,
    promoterContributionPct: Math.round((promoterContribution / projectCost) * 100),
    interestRate,
    tenureYears,
    moratoriumMonths,
    repaymentMonths,
    monthlyEmi,
    monthlyEMI: monthlyEmi, // Provided for backwards compatibility
    totalInterest,
    totalRepayment
  };
}

export function formatINR(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}