const fs = require('fs');

// ====== Argument Handling ======
const inFile = process.argv[2] || 'items.json';
const outFile = process.argv[3] || 'store-price-list.json';

// ====== Discount config per tier (edit as needed) ======
const DISCOUNT_CONFIG = {
  rare:     { min: 0.00, max: 0.20 },
  common:   { min: 0.20, max: 0.80 },
  uncommon: { min: 0.25, max: 0.60 },
  epic:     { min: 0.10, max: 0.25 },
  // add more as needed
  default:  { min: 0.20, max: 0.80 },
};

function getDiscountRange(tier) {
  const t = tier?.toLowerCase?.();
  return DISCOUNT_CONFIG[t] || DISCOUNT_CONFIG.default;
}

function randomDiscount(min, max) {
  return Math.random() * (max - min) + min;
}

// ====== Main Logic ======
const items = JSON.parse(fs.readFileSync(inFile, 'utf-8'));

const output = items.map(item => {
  const { min, max } = getDiscountRange(item.tier);
  const discountPercentage = +(randomDiscount(min, max)).toFixed(2);
  const finalPrice = Math.round(item.valuePrice * (1 - discountPercentage));
  return {
    ...item,
    discountPercentage,
    finalPrice,
  };
});

fs.writeFileSync(outFile, JSON.stringify(output, null, 2));
console.log(`Generated ${outFile} from ${inFile}`);
