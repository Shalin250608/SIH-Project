// Deterministic Rule Engine for Scheme Matching
// Pure, auditable logic enforcing income ceiling, purpose, and project cost boundaries
import { formatINR } from './calculator';

export function evaluateSchemes({
  isSC = true,
  annualIncome = 300000,
  purposeType = "business", // business | education
  specificPurpose = "dairy",
  projectCost = 100000,
  schemes = [],
  activeIncomeCeiling = 500000
}) {
  const evaluated = [];

  // Hard check: SC caste requirement
  if (!isSC) {
    return {
      eligible: false,
      primaryMatch: null,
      allMatches: [],
      alternativeMatches: [],
      unmatchedSchemes: [],
      ineligibleReason: "NSFDC schemes are specifically mandated for beneficiaries belonging to the Scheduled Caste (SC) community with valid caste documentation."
    };
  }

  // Hard check: Income ceiling
  if (annualIncome > activeIncomeCeiling) {
    return {
      eligible: false,
      primaryMatch: null,
      allMatches: [],
      alternativeMatches: [],
      unmatchedSchemes: [],
      ineligibleReason: `Annual family income of ${formatINR(annualIncome)} exceeds the active NSFDC ceiling of ${formatINR(activeIncomeCeiling)}. Applicants with higher income are routed to regular commercial banking channels.`
    };
  }

  for (const scheme of schemes) {
    const reasons = [];
    const rejectionReasons = [];
    let isMatch = true;

    // 1. Category check
    if (scheme.category !== purposeType) {
      isMatch = false;
      rejectionReasons.push(`Scheme is for ${scheme.category} whereas requested purpose is ${purposeType}.`);
    } else {
      reasons.push(`Matches requested category: ${purposeType.toUpperCase()}`);
    }

    // 2. Project cost limits
    if (projectCost < scheme.minProjectCost) {
      isMatch = false;
      rejectionReasons.push(`Project cost (${formatINR(projectCost)}) is below minimum requirement of ${formatINR(scheme.minProjectCost)}`);
    } else if (projectCost > scheme.maxProjectCost) {
      isMatch = false;
      rejectionReasons.push(`Project cost (${formatINR(projectCost)}) exceeds scheme ceiling of ${formatINR(scheme.maxProjectCost)}`);
    } else {
      reasons.push(`Project cost fits inside eligible window (${formatINR(scheme.minProjectCost)} - ${formatINR(scheme.maxProjectCost)})`);
    }

    // 3. Purpose keyword / domain alignment
    if (scheme.category === purposeType) {
      if (scheme.purpose.includes(specificPurpose) || scheme.purpose.includes("services") || scheme.purpose.includes("retail")) {
        reasons.push(`Suitable for activity: ${specificPurpose.replace("_", " ")}`);
      }
    }

    // 4. Income check
    if (annualIncome <= activeIncomeCeiling) {
      reasons.push(`Annual family income of ${formatINR(annualIncome)} meets NSFDC criteria (<= ${formatINR(activeIncomeCeiling)})`);
    }

    evaluated.push({
      scheme,
      isMatch,
      reasons,
      rejectionReasons,
      score: isMatch ? 100 - (Math.abs(projectCost - (scheme.maxProjectCost / 2)) / scheme.maxProjectCost * 20) : 0
    });
  }

  // Sort matched schemes by score
  const matched = evaluated.filter(e => e.isMatch).sort((a, b) => b.score - a.score);
  const unmatched = evaluated.filter(e => !e.isMatch);

  if (matched.length > 0) {
    return {
      eligible: true,
      primaryMatch: matched[0],
      alternativeMatches: matched.slice(1),
      allMatches: matched,
      unmatchedSchemes: unmatched
    };
  } else {
    return {
      eligible: false,
      primaryMatch: null,
      allMatches: [],
      alternativeMatches: [],
      unmatchedSchemes: unmatched,
      ineligibleReason: `No active NSFDC scheme in the ${purposeType} category matches a project cost of ${formatINR(projectCost)}. Check scheme limits or adjust the requested capital.`
    };
  }
}