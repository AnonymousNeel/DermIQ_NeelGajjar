'use strict';

// ============================================================
// DermIQ — Skincare Knowledge Base
// The structured intelligence layer. Every recommendation
// traces back to data defined here.
// ============================================================

const SKIN_TYPES = [
  { id: 'oily', label: 'Oily', desc: 'Shiny T-zone and cheeks, enlarged pores' },
  { id: 'dry', label: 'Dry', desc: 'Tight feeling, flaky patches, minimal shine' },
  { id: 'combination', label: 'Combination', desc: 'Oily T-zone, normal/dry cheeks' },
  { id: 'normal', label: 'Normal', desc: 'Balanced, minimal concerns' },
  { id: 'sensitive', label: 'Sensitive', desc: 'Reacts easily, redness, stinging' },
];

const CLIMATES = [
  { id: 'hot_humid', label: 'Hot & Humid', desc: 'e.g. Mumbai, Chennai, Kolkata' },
  { id: 'hot_dry', label: 'Hot & Dry', desc: 'e.g. Rajasthan, Delhi summers' },
  { id: 'moderate', label: 'Moderate', desc: 'e.g. Bangalore, Pune' },
  { id: 'cold_dry', label: 'Cold & Dry', desc: 'e.g. Delhi winters, North India' },
];

const CONCERNS = [
  {
    id: 'acne',
    label: 'Acne',
    icon: '🔴',
    description: 'Active pimples, inflammatory lesions, breakouts',
    mechanism: 'Excess sebum + follicular hyperkeratinization + C. acnes colonization → inflammatory cascade. Androgens (DHT) stimulate sebaceous glands. Stress elevates CRH → direct sebocyte stimulation.',
    rootCauses: ['Hormonal (androgen-driven)', 'Excess sebum production', 'Bacterial colonization (C. acnes)', 'Follicular hyperkeratinization', 'Stress-induced CRH elevation', 'High glycemic diet → IGF-1 spike', 'Sleep deprivation → cortisol elevation'],
    evidenceLevel: 'strong',
    keyIngredients: ['salicylic_acid', 'niacinamide', 'benzoyl_peroxide', 'zinc'],
  },
  {
    id: 'tanning',
    label: 'Tanning / Uneven Tone',
    icon: '☀️',
    description: 'Sun-induced darkening, patchy pigmentation',
    mechanism: 'UV → melanocyte activation → tyrosinase enzyme activation → tyrosine converted to melanin → melanosomes packaged → transferred to keratinocytes → visible tan. Reversal requires: UV prevention + tyrosinase inhibition + accelerated cell turnover + melanosome transfer inhibition.',
    rootCauses: ['UV exposure without SPF', 'Post-inflammatory hyperpigmentation', 'Hormonal changes', 'Friction/irritation'],
    evidenceLevel: 'strong',
    keyIngredients: ['alpha_arbutin', 'niacinamide', 'vitamin_c', 'glycolic_acid', 'sunscreen'],
  },
  {
    id: 'pie',
    label: 'Post-Inflammatory Redness (PIE)',
    icon: '🩷',
    description: 'Red/pink marks left after acne heals',
    mechanism: 'Inflammation damages capillaries → dilated/damaged blood vessels remain → persistent redness. Distinct from PIH (brown marks). PIE blanches under pressure (diascopy test). Resolution requires vascular repair + time + UV protection.',
    rootCauses: ['Post-acne vascular damage', 'Picking/squeezing lesions', 'UV exposure worsening'],
    evidenceLevel: 'moderate',
    keyIngredients: ['niacinamide', 'sunscreen', 'centella_asiatica'],
  },
  {
    id: 'pores',
    label: 'Enlarged Pores',
    icon: '🔍',
    description: 'Visibly large pores, especially in T-zone',
    mechanism: 'Pore size is genetically determined and correlates with sebum output. Cannot physically shrink pores, but can reduce apparent size via: sebum control (less stretching), surface exfoliation (smoother peri-pore skin), and niacinamide (improves elasticity around pore openings).',
    rootCauses: ['Genetic sebaceous gland density', 'Androgen-driven sebum', 'Loss of skin elasticity', 'Comedone stretching'],
    evidenceLevel: 'moderate',
    keyIngredients: ['niacinamide', 'salicylic_acid', 'glycolic_acid'],
  },
  {
    id: 'dullness',
    label: 'Dull Skin / No Glow',
    icon: '✨',
    description: 'Lack of radiance, uneven texture, tired appearance',
    mechanism: 'Glow = uniform light reflection from smooth, hydrated skin surface. Dullness caused by: accumulated dead cells (irregular scattering), dehydration (collapsed barrier reflects poorly), poor microcirculation (lack of warmth/vitality), uneven melanin distribution.',
    rootCauses: ['Dead cell accumulation', 'Dehydrated barrier', 'Poor circulation', 'Sleep deprivation', 'Nutritional deficiency'],
    evidenceLevel: 'strong',
    keyIngredients: ['glycolic_acid', 'vitamin_c', 'niacinamide', 'hyaluronic_acid'],
  },
  {
    id: 'dryness',
    label: 'Dry / Dehydrated Skin',
    icon: '💧',
    description: 'Tight, flaky, rough skin texture',
    mechanism: 'Skin barrier (stratum corneum) relies on lipid matrix (ceramides, cholesterol, fatty acids) + natural moisturizing factors (NMF). Damage → transepidermal water loss (TEWL) → dehydration → flakiness, tightness. Distinct from oil-dry (lacks sebum) vs dehydrated (lacks water).',
    rootCauses: ['Impaired lipid barrier', 'Over-exfoliation', 'Harsh cleansers', 'Low humidity', 'Hot water washing'],
    evidenceLevel: 'strong',
    keyIngredients: ['hyaluronic_acid', 'ceramides', 'squalane', 'glycerin'],
  },
  {
    id: 'hair_dry',
    label: 'Dry / Frizzy Hair',
    icon: '💇',
    description: 'Rough, dull, frizzy hair lacking shine',
    mechanism: 'Hair cuticle (outer layer) made of overlapping keratin scales. When intact → smooth surface → uniform light reflection = shine. When damaged/lifted → rough surface → light scattering = dull, frizzy. Causes: harsh sulfates strip oils, humidity causes hygral fatigue (moisture absorption/release cycle), protein loss from washing/UV/friction.',
    rootCauses: ['Cuticle damage', 'Harsh shampoo (sulfates)', 'Humidity (hygral fatigue)', 'Protein loss', 'Nutritional gaps (omega-3, biotin)'],
    evidenceLevel: 'moderate',
    keyIngredients: ['coconut_oil', 'keratin', 'dimethicone_hair', 'panthenol'],
  },
  {
    id: 'scalp_dry',
    label: 'Dry / Flaky Scalp',
    icon: '🧴',
    description: 'Itchy, flaky scalp, possible dandruff',
    mechanism: 'Scalp dryness can be simple xerosis (dry skin) or seborrheic dermatitis (Malassezia yeast overgrowth → inflammatory reaction → flaking). Seborrheic dermatitis is common in young adults (androgen-linked, same drivers as facial acne).',
    rootCauses: ['Harsh sulfate shampoo', 'Seborrheic dermatitis (Malassezia)', 'Over-washing', 'Low humidity'],
    evidenceLevel: 'strong',
    keyIngredients: ['ketoconazole', 'salicylic_acid_scalp', 'tea_tree'],
  },
];

const INGREDIENTS = {
  salicylic_acid: {
    name: 'Salicylic Acid (BHA)',
    mechanism: 'Oil-soluble β-hydroxy acid. Penetrates into pores, dissolves sebum plugs and dead cells. Anti-inflammatory (inhibits COX pathway). Comedolytic.',
    benefits: ['Unclogs pores', 'Reduces acne', 'Controls oil', 'Anti-inflammatory'],
    risks: ['Mild dryness initially', 'Sun sensitivity', 'Not for very dry skin'],
    evidence: 'strong',
    concentration: '2%',
    concerns: ['acne', 'pores'],
  },
  niacinamide: {
    name: 'Niacinamide (Vitamin B3)',
    mechanism: 'Inhibits melanosome transfer (reduces pigmentation). Regulates sebum via sebocyte modulation. Improves ceramide synthesis (barrier repair). Anti-inflammatory. Improves vascular integrity (helps PIE).',
    benefits: ['Oil control', 'Pore appearance', 'Even tone', 'Barrier repair', 'PIE reduction'],
    risks: ['Rare flushing at >10% in sensitive skin'],
    evidence: 'strong',
    concentration: '5-10%',
    concerns: ['acne', 'pores', 'tanning', 'pie', 'dullness'],
  },
  benzoyl_peroxide: {
    name: 'Benzoyl Peroxide',
    mechanism: 'Bactericidal — releases oxygen into pores, killing anaerobic C. acnes. 2.5% is as effective as 10% with significantly less irritation (Mills et al.).',
    benefits: ['Kills acne bacteria', 'Reduces inflammation'],
    risks: ['Bleaches fabrics', 'Dryness at higher concentrations', 'Contact dermatitis (rare)'],
    evidence: 'strong',
    concentration: '2.5%',
    concerns: ['acne'],
  },
  alpha_arbutin: {
    name: 'Alpha Arbutin',
    mechanism: 'Stable hydroquinone derivative. Inhibits tyrosinase enzyme → reduces melanin synthesis. Safer than hydroquinone with no cytotoxicity to melanocytes.',
    benefits: ['De-tanning', 'Brightening', 'Fades dark spots'],
    risks: ['Very low risk', 'Slow results (8-12 weeks)'],
    evidence: 'strong',
    concentration: '2%',
    concerns: ['tanning', 'dullness'],
  },
  glycolic_acid: {
    name: 'Glycolic Acid (AHA)',
    mechanism: 'Water-soluble α-hydroxy acid. Smallest AHA molecule → deepest penetration. Dissolves bonds between dead surface cells (desmosome disruption) → accelerated cell turnover → smoother texture, glow. Also stimulates collagen at higher concentrations.',
    benefits: ['Surface exfoliation', 'Glow', 'Anti-aging', 'De-tanning'],
    risks: ['Sun sensitivity (mandatory SPF)', 'Stinging if overused', 'Not for sensitive/eczema skin'],
    evidence: 'strong',
    concentration: '8%',
    concerns: ['dullness', 'tanning', 'pores'],
  },
  vitamin_c: {
    name: 'Vitamin C (L-Ascorbic Acid)',
    mechanism: 'Potent antioxidant. Inhibits tyrosinase. Essential cofactor for collagen synthesis. Photoprotective (not a sunscreen replacement). Unstable in aqueous solution.',
    benefits: ['Brightening', 'Anti-aging', 'Antioxidant protection'],
    risks: ['Oxidizes quickly', 'Can sting acne', 'pH-sensitive'],
    evidence: 'strong',
    concentration: '10-20%',
    concerns: ['dullness', 'tanning'],
  },
  hyaluronic_acid: {
    name: 'Hyaluronic Acid',
    mechanism: 'Glycosaminoglycan that holds up to 1000x its weight in water. Acts as humectant — draws water to skin surface. Multiple molecular weights provide multi-depth hydration.',
    benefits: ['Deep hydration', 'Plumping', 'Barrier support'],
    risks: ['Can dehydrate in very dry climates (draws water from skin if no humidity)'],
    evidence: 'strong',
    concentration: '1-2%',
    concerns: ['dryness', 'dullness'],
  },
  sunscreen: {
    name: 'Broad-Spectrum Sunscreen',
    mechanism: 'UV filters absorb (chemical) or reflect (mineral) UV radiation. Prevents: melanin overproduction (tanning), collagen degradation (aging), DNA damage (cancer risk), PIE worsening.',
    benefits: ['Prevents tanning', 'Anti-aging', 'PIE protection', 'Skin cancer prevention'],
    risks: ['White cast (mineral)', 'Comedogenic if wrong formula'],
    evidence: 'strong',
    concentration: 'SPF 50+ PA++++',
    concerns: ['tanning', 'pie', 'dullness', 'acne'],
  },
  zinc: {
    name: 'Zinc (PCA / dietary)',
    mechanism: 'Antibacterial, anti-inflammatory, sebum-regulating. Dietary zinc deficiency directly correlates with acne severity. Topical zinc PCA reduces oil production.',
    benefits: ['Oil control', 'Anti-acne', 'Wound healing'],
    risks: ['Rare irritation topically'],
    evidence: 'strong',
    concentration: 'Topical: 1-2% PCA',
    concerns: ['acne', 'pores'],
  },
  ceramides: {
    name: 'Ceramides',
    mechanism: 'Key component of skin lipid barrier (~50% of barrier lipids). Replenishes lost ceramides → reduces TEWL → stronger, more resilient barrier.',
    benefits: ['Barrier repair', 'Moisture retention', 'Sensitivity reduction'],
    risks: ['None known'],
    evidence: 'strong',
    concentration: 'Variable',
    concerns: ['dryness'],
  },
  coconut_oil: {
    name: 'Coconut Oil (Hair)',
    mechanism: 'Lauric acid has high affinity for hair protein. Penetrates the hair shaft (unlike most oils) → reduces protein loss during washing. Lubricates cuticle.',
    benefits: ['Reduces protein loss', 'Pre-wash protection', 'Frizz control'],
    risks: ['Comedogenic on facial skin', 'Can weigh down fine hair'],
    evidence: 'moderate',
    concentration: 'Pure',
    concerns: ['hair_dry'],
  },
  centella_asiatica: {
    name: 'Centella Asiatica (Cica)',
    mechanism: 'Contains madecassoside + asiaticoside → stimulate collagen synthesis, anti-inflammatory, wound healing. Strengthens skin barrier.',
    benefits: ['Soothes irritation', 'Wound healing', 'Barrier repair'],
    risks: ['Rare allergic reaction'],
    evidence: 'moderate',
    concentration: 'Variable extract',
    concerns: ['pie', 'dryness'],
  },
  squalane: {
    name: 'Squalane',
    mechanism: 'Hydrogenated squalene — naturally present in skin sebum. Lightweight emollient that mimics skin lipids. Non-comedogenic. Reinforces barrier without greasiness.',
    benefits: ['Lightweight hydration', 'Barrier support', 'Non-greasy'],
    risks: ['None significant'],
    evidence: 'moderate',
    concentration: 'Variable',
    concerns: ['dryness'],
  },
  panthenol: {
    name: 'Panthenol (Vitamin B5)',
    mechanism: 'Provitamin B5 → converts to pantothenic acid in skin. Humectant, anti-inflammatory, promotes wound healing. Improves skin barrier function.',
    benefits: ['Hydration', 'Soothing', 'Wound healing'],
    risks: ['None known'],
    evidence: 'strong',
    concentration: '1-5%',
    concerns: ['dryness', 'pie'],
  },
  keratin: {
    name: 'Keratin (Hair)',
    mechanism: 'Hair is 95% keratin protein. External keratin fills gaps in damaged cuticle → smoother surface → more shine, less breakage.',
    benefits: ['Cuticle repair', 'Shine', 'Strength'],
    risks: ['Over-proteinization if hair is already protein-heavy'],
    evidence: 'moderate',
    concentration: 'Variable',
    concerns: ['hair_dry'],
  },
  dimethicone_hair: {
    name: 'Dimethicone (Hair Serum)',
    mechanism: 'Silicone polymer. Creates thin film over hair cuticle → seals in moisture, smooths surface → light reflects uniformly = shine. Blocks humidity penetration → prevents frizz.',
    benefits: ['Instant shine', 'Frizz control', 'Smoothness'],
    risks: ['Buildup if not clarified periodically'],
    evidence: 'moderate',
    concentration: 'Variable',
    concerns: ['hair_dry'],
  },
  ketoconazole: {
    name: 'Ketoconazole',
    mechanism: 'Antifungal — inhibits ergosterol synthesis in Malassezia yeast cell membrane. Gold standard topical treatment for seborrheic dermatitis.',
    benefits: ['Anti-dandruff', 'Anti-fungal', 'Reduces scalp flaking'],
    risks: ['Dryness if overused', 'Rare irritation'],
    evidence: 'strong',
    concentration: '2%',
    concerns: ['scalp_dry'],
  },
};

const PRODUCTS = [
  // ─── CLEANSERS ────────────────────────
  {
    id: 'minimalist_sa_wash',
    name: 'Minimalist 2% Salicylic Acid + LHA Face Wash',
    category: 'cleanser',
    price: 199,
    size: '100ml',
    monthlyDuration: 2,
    concerns: ['acne', 'pores'],
    keyIngredients: ['salicylic_acid', 'zinc'],
    ingredientScore: 9.5,
    comedogenicSafe: true,
    fragranceFree: true,
    highlights: ['LHA for dual exfoliation', 'Aquaxyl complex prevents dryness', 'pH 3.5-4.0', 'Ultra-mild SLMI surfactant'],
    reviewScore: 9.0,
    bestFor: ['oily', 'combination'],
  },
  {
    id: 'simple_refreshing',
    name: 'Simple Refreshing Face Wash Gel',
    category: 'cleanser',
    price: 199,
    size: '150ml',
    monthlyDuration: 2.5,
    concerns: ['dryness', 'dullness'],
    keyIngredients: [],
    ingredientScore: 7.0,
    comedogenicSafe: true,
    fragranceFree: true,
    highlights: ['No active ingredients — pure gentle cleanser', 'Good for sensitive/dry skin', 'No SA if not needed'],
    reviewScore: 8.0,
    bestFor: ['dry', 'sensitive', 'normal'],
  },

  // ─── NIACINAMIDE SERUMS ────────────────
  {
    id: 'minimalist_niacinamide',
    name: 'Minimalist 10% Niacinamide + Zinc Serum',
    category: 'serum',
    price: 349,
    size: '30ml',
    monthlyDuration: 2.5,
    concerns: ['acne', 'pores', 'tanning', 'pie', 'dullness'],
    keyIngredients: ['niacinamide', 'zinc'],
    ingredientScore: 9.5,
    comedogenicSafe: true,
    fragranceFree: true,
    highlights: ['Matmarine (biotech sebum reducer)', 'Acetyl Glucosamine (synergistic brightening)', 'Sodium Hyaluronate', 'Allantoin (soothing)'],
    reviewScore: 9.5,
    bestFor: ['oily', 'combination', 'normal'],
  },
  {
    id: 'dermaco_niacinamide',
    name: 'The Derma Co 10% Niacinamide + Zinc PCA Serum',
    category: 'serum',
    price: 249,
    size: '30ml',
    monthlyDuration: 2.5,
    concerns: ['acne', 'pores', 'tanning', 'dullness'],
    keyIngredients: ['niacinamide', 'zinc'],
    ingredientScore: 8.0,
    comedogenicSafe: true,
    fragranceFree: false,
    highlights: ['Same 10% niacinamide', 'More affordable', 'Centella Asiatica (soothing)', 'Some fragrance reports in older batches'],
    reviewScore: 8.5,
    bestFor: ['oily', 'combination'],
  },

  // ─── SALICYLIC ACID SERUMS ─────────────
  {
    id: 'minimalist_sa_serum',
    name: 'Minimalist 2% Salicylic Acid Serum',
    category: 'serum',
    price: 349,
    size: '30ml',
    monthlyDuration: 3.5,
    concerns: ['acne', 'pores'],
    keyIngredients: ['salicylic_acid'],
    ingredientScore: 9.0,
    comedogenicSafe: true,
    fragranceFree: true,
    highlights: ['Oligopeptide-10 (antimicrobial peptide)', 'EGCG from green tea (antioxidant)', 'Aloe Vera base', 'pH 3.2-4.0'],
    reviewScore: 9.0,
    bestFor: ['oily', 'combination'],
  },

  // ─── ALPHA ARBUTIN ──────────────────────
  {
    id: 'minimalist_arbutin',
    name: 'Minimalist Alpha Arbutin 2% + HA 1% Serum',
    category: 'serum',
    price: 349,
    size: '30ml',
    monthlyDuration: 2.5,
    concerns: ['tanning', 'dullness'],
    keyIngredients: ['alpha_arbutin', 'hyaluronic_acid'],
    ingredientScore: 9.0,
    comedogenicSafe: true,
    fragranceFree: true,
    highlights: ['Butylresorcinol (30x more potent than kojic acid)', 'HA for hydration', 'Stable, non-irritating', 'Results in 8-12 weeks'],
    reviewScore: 8.5,
    bestFor: ['oily', 'combination', 'normal', 'dry'],
  },

  // ─── EXFOLIATORS ────────────────────────
  {
    id: 'minimalist_glycolic',
    name: 'Minimalist 8% Glycolic Acid Exfoliating Liquid',
    category: 'exfoliator',
    price: 349,
    size: '100ml',
    monthlyDuration: 4.5,
    concerns: ['dullness', 'tanning', 'pores'],
    keyIngredients: ['glycolic_acid'],
    ingredientScore: 8.5,
    comedogenicSafe: true,
    fragranceFree: true,
    highlights: ['8% concentration good for beginners', 'Aloe Vera base', 'Use max 2x/week PM', 'Always use SPF next day'],
    reviewScore: 8.5,
    bestFor: ['oily', 'combination', 'normal'],
  },

  // ─── SPOT TREATMENT ─────────────────────
  {
    id: 'benzac_ac',
    name: 'Benzac AC 2.5% Gel',
    category: 'spot_treatment',
    price: 101,
    size: '30g',
    monthlyDuration: 5,
    concerns: ['acne'],
    keyIngredients: ['benzoyl_peroxide'],
    ingredientScore: 9.5,
    comedogenicSafe: true,
    fragranceFree: true,
    highlights: ['Pharmaceutical grade (Galderma)', '2.5% = as effective as 10% with less irritation', 'Spot-only application', 'Best cost-efficiency'],
    reviewScore: 9.5,
    bestFor: ['oily', 'combination', 'normal', 'dry', 'sensitive'],
  },

  // ─── MOISTURIZERS ───────────────────────
  {
    id: 'sebamed_gel',
    name: 'Sebamed Clear Face Care Gel',
    category: 'moisturizer',
    price: 459,
    size: '50ml',
    monthlyDuration: 2.5,
    concerns: ['acne', 'pores'],
    keyIngredients: ['hyaluronic_acid', 'panthenol'],
    ingredientScore: 9.0,
    comedogenicSafe: true,
    fragranceFree: true,
    highlights: ['pH 5.5 (skin-identical)', 'Aloe Vera base', 'Allantoin (healing)', 'No emulsifiers/colorants', 'Gold standard for acne-prone skin'],
    reviewScore: 9.0,
    bestFor: ['oily', 'combination', 'sensitive'],
  },
  {
    id: 'minimalist_sepicalm',
    name: 'Minimalist Sepicalm 3% + Oat Moisturizer',
    category: 'moisturizer',
    price: 299,
    size: '50ml',
    monthlyDuration: 2,
    concerns: ['dryness', 'pie'],
    keyIngredients: ['squalane', 'panthenol', 'centella_asiatica'],
    ingredientScore: 8.5,
    comedogenicSafe: true,
    fragranceFree: true,
    highlights: ['Sepicalm (amino acids + minerals)', 'Oat extract (soothing)', 'Polyglutamic acid (hydration)', 'Some reports of heaviness in humid conditions'],
    reviewScore: 8.0,
    bestFor: ['dry', 'normal', 'combination', 'sensitive'],
  },
  {
    id: 'cetaphil_dam',
    name: 'Cetaphil DAM Daily Advance Moisturizer',
    category: 'moisturizer',
    price: 350,
    size: '100g',
    monthlyDuration: 2.5,
    concerns: ['dryness'],
    keyIngredients: ['ceramides', 'hyaluronic_acid'],
    ingredientScore: 8.5,
    comedogenicSafe: true,
    fragranceFree: true,
    highlights: ['Ceramide complex', 'Shea butter', 'Better for dry skin types', 'Not ideal for oily skin'],
    reviewScore: 8.5,
    bestFor: ['dry', 'normal'],
  },

  // ─── SUNSCREENS ─────────────────────────
  {
    id: 'reequil_sunscreen',
    name: "Re'equil Ultra Matte Dry Touch SPF 50 PA++++",
    category: 'sunscreen',
    price: 445,
    size: '50g',
    monthlyDuration: 1.5,
    concerns: ['tanning', 'pie', 'acne', 'dullness'],
    keyIngredients: ['sunscreen'],
    ingredientScore: 9.5,
    comedogenicSafe: true,
    fragranceFree: false,
    highlights: ['6-filter hybrid system', 'Tinosorb S (best-in-class UVA filter)', 'Uvinul A Plus + T 150', 'Zinc Oxide + Titanium Dioxide (mineral)', 'Matte dry-touch finish', 'Holy grail on r/IndianSkincareAddicts'],
    reviewScore: 9.0,
    bestFor: ['oily', 'combination'],
  },
  {
    id: 'lashield_mineral',
    name: 'La Shield Fisico SPF 40 PA+++ Mineral Gel',
    category: 'sunscreen',
    price: 350,
    size: '50g',
    monthlyDuration: 1.5,
    concerns: ['tanning', 'pie', 'acne'],
    keyIngredients: ['sunscreen'],
    ingredientScore: 8.0,
    comedogenicSafe: true,
    fragranceFree: true,
    highlights: ['100% mineral (Zinc Oxide)', 'Less irritating for active acne', 'Slightly lower SPF', 'Fragrance-free'],
    reviewScore: 8.0,
    bestFor: ['sensitive', 'dry', 'normal'],
  },

  // ─── HAIR PRODUCTS ──────────────────────
  {
    id: 'reequil_shampoo',
    name: "Re'equil Hair Fall Control Shampoo",
    category: 'shampoo',
    price: 280,
    size: '250ml',
    monthlyDuration: 2.5,
    concerns: ['hair_dry', 'scalp_dry'],
    keyIngredients: [],
    ingredientScore: 8.5,
    comedogenicSafe: true,
    fragranceFree: true,
    highlights: ['Sulfate-free, paraben-free, silicone-free', 'Indian Cress + Watercress extracts', 'Vitamins B3, B5, B7', 'Gentle cleansing'],
    reviewScore: 8.5,
    bestFor: ['oily', 'combination', 'dry', 'normal', 'sensitive'],
  },
  {
    id: 'dove_conditioner',
    name: 'Dove Peptide Bond Strength Conditioner',
    category: 'conditioner',
    price: 175,
    size: '175ml',
    monthlyDuration: 2,
    concerns: ['hair_dry'],
    keyIngredients: ['keratin', 'panthenol'],
    ingredientScore: 7.5,
    comedogenicSafe: true,
    fragranceFree: false,
    highlights: ['Peptide bond repair technology', 'Keratin + protein', 'Very affordable', 'Mid-lengths and ends only'],
    reviewScore: 8.0,
    bestFor: ['oily', 'combination', 'dry', 'normal', 'sensitive'],
  },
  {
    id: 'streax_serum',
    name: 'Streax Professional Vitariche Gloss Hair Serum',
    category: 'hair_serum',
    price: 175,
    size: '100ml',
    monthlyDuration: 3.5,
    concerns: ['hair_dry'],
    keyIngredients: ['dimethicone_hair'],
    ingredientScore: 7.5,
    comedogenicSafe: true,
    fragranceFree: false,
    highlights: ['Vitamin E + Macadamia Oil', 'Dimethicone (cuticle sealing)', 'Non-sticky, lightweight', 'Best value hair serum in India'],
    reviewScore: 8.5,
    bestFor: ['oily', 'combination', 'dry', 'normal', 'sensitive'],
  },
  {
    id: 'tresemme_mask',
    name: 'Tresemmé Keratin Smooth Mask',
    category: 'hair_mask',
    price: 275,
    size: '300ml',
    monthlyDuration: 4.5,
    concerns: ['hair_dry'],
    keyIngredients: ['keratin'],
    ingredientScore: 7.5,
    comedogenicSafe: true,
    fragranceFree: false,
    highlights: ['Intensive keratin + moisture', 'Weekly deep conditioning', 'Best budget-to-performance ratio', 'Frizz reduction + shine'],
    reviewScore: 8.0,
    bestFor: ['oily', 'combination', 'dry', 'normal', 'sensitive'],
  },
  {
    id: 'scalpe_shampoo',
    name: 'Scalpe Ketoconazole 2% Shampoo',
    category: 'shampoo',
    price: 190,
    size: '75ml',
    monthlyDuration: 3,
    concerns: ['scalp_dry'],
    keyIngredients: ['ketoconazole'],
    ingredientScore: 9.0,
    comedogenicSafe: true,
    fragranceFree: false,
    highlights: ['2% Ketoconazole (antifungal)', 'Use 1x/week for 4 weeks', 'Only if flaking/dandruff persists', 'Pharmaceutical-grade'],
    reviewScore: 8.5,
    bestFor: ['oily', 'combination', 'dry', 'normal', 'sensitive'],
  },
];

const DIET_RECOMMENDATIONS = {
  acne: [
    { item: 'Pumpkin seeds', benefit: 'Zinc — deficiency directly correlates with acne severity', cost: '₹15/day' },
    { item: 'Ground flaxseed (1 tbsp)', benefit: 'Omega-3 — anti-inflammatory, counterbalances omega-6', cost: '₹5/day' },
    { item: 'Reduce refined carbs', benefit: 'High glycemic load → insulin → IGF-1 → sebocyte stimulation', cost: 'Free' },
    { item: 'Curd (1 bowl daily)', benefit: 'Probiotics — gut-skin axis communication', cost: '₹10/day' },
  ],
  tanning: [
    { item: 'Amla (1 daily)', benefit: 'Highest natural Vitamin C — collagen synthesis + antioxidant', cost: '₹5/day' },
    { item: 'Tomatoes', benefit: 'Lycopene — natural internal UV protection (adjunct, not replacement)', cost: '₹5/day' },
    { item: 'Green tea (1-2 cups)', benefit: 'EGCG — antioxidant, anti-melanogenic activity', cost: '₹5/day' },
  ],
  hair_dry: [
    { item: 'Walnuts (3-4 daily)', benefit: 'Omega-3 + Biotin + Vitamin E → hair elasticity', cost: '₹15/day' },
    { item: 'Dal/lentils (daily)', benefit: 'Plant protein — keratin building blocks', cost: '₹10/day' },
    { item: 'Sesame seeds', benefit: 'Iron + Zinc + essential fatty acids → follicle nutrition', cost: '₹5/day' },
  ],
  general: [
    { item: 'Vitamin B12 supplement', benefit: 'Universally deficient in vegetarians — impacts cellular repair', cost: '₹75/month' },
    { item: 'Vitamin D test', benefit: 'Widespread deficiency in India — immunomodulatory', cost: '₹300 one-time' },
    { item: 'Water (2.5-3L daily)', benefit: 'Hydration supports every skin function', cost: 'Free' },
  ],
};

const LIFESTYLE_FACTORS = [
  { id: 'sleep', label: 'Sleep', idealRange: '7-9 hrs', impactAreas: ['acne', 'dullness', 'pie'], mechanism: 'Growth hormone peaks during deep sleep → cellular repair. Cortisol elevates with sleep deprivation → sebum + inflammation.' },
  { id: 'stress', label: 'Stress', management: 'Box breathing 4-4-4-4, 10 min/day', impactAreas: ['acne', 'hair_dry'], mechanism: 'CRH directly stimulates sebocytes. Cortisol suppresses immune resolution.' },
  { id: 'exercise', label: 'Exercise', idealRange: '30 min, 4-5x/week', impactAreas: ['dullness', 'acne'], mechanism: 'Improves microcirculation → better nutrient delivery to skin. Post-exercise cortisol drop. Sweat flushes pores (rinse after).' },
  { id: 'water', label: 'Hydration', idealRange: '2.5-3L/day', impactAreas: ['dryness', 'dullness', 'hair_dry'], mechanism: 'Systemic hydration supports TEWL regulation and hair shaft hydration.' },
];

const EVIDENCE_LEVELS = {
  strong: { label: 'Strong Evidence', color: '#00d4aa', description: 'Supported by meta-analyses, systematic reviews, or multiple RCTs' },
  moderate: { label: 'Moderate Evidence', color: '#f59e0b', description: 'Supported by cohort studies, observational data, or limited RCTs' },
  emerging: { label: 'Emerging Evidence', color: '#8b5cf6', description: 'Based on mechanistic plausibility, early studies, or traditional knowledge' },
};


// ============================================================
// DermIQ — Analysis Engine
// Rule-based expert system that generates personalized
// recommendations from user profile data.
// ============================================================


function analyzeProfile(profile) {
    if (!profile || !profile.concerns || profile.concerns.length === 0) {
        return null;
    }

    const selectedConcerns = CONCERNS.filter(c => profile.concerns.includes(c.id));
    const analysis = {
        concerns: selectedConcerns.map(c => analyzeConcern(c, profile)),
        routine: generateRoutine(profile),
        products: recommendProducts(profile),
        diet: generateDietPlan(profile),
        lifestyle: assessLifestyle(profile),
        monthlyCost: 0,
        introductionSchedule: generateIntroSchedule(profile),
    };

    analysis.monthlyCost = analysis.products.reduce((sum, p) => sum + (p.price / p.monthlyDuration), 0);
    return analysis;
}

function analyzeConcern(concern, profile) {
    let severity = 'mild';
    let aggravators = [];

    // Factor in lifestyle
    if (profile.sleep && parseInt(profile.sleep) < 7) {
        aggravators.push('Sleep deficit elevates cortisol → worsens ' + concern.label.toLowerCase());
    }
    if (profile.stress === 'high' || profile.stress === 'moderate') {
        aggravators.push('Stress triggers CRH → direct sebocyte/melanocyte stimulation');
    }
    if (profile.climate === 'hot_humid') {
        if (['acne', 'pores'].includes(concern.id)) {
            aggravators.push('Hot humid climate → increased sweating + bacterial proliferation');
        }
        if (concern.id === 'hair_dry') {
            aggravators.push('Humidity causes hygral fatigue → cuticle damage → frizz');
        }
    }
    if (profile.diet === 'vegetarian' || profile.diet === 'vegan') {
        aggravators.push('Possible zinc, B12, omega-3 gaps in plant-based diet');
    }

    // Severity scoring
    const severityScore = aggravators.length;
    if (severityScore >= 3) severity = 'moderate-severe';
    else if (severityScore >= 1) severity = 'moderate';

    // Key ingredients for this concern
    const relevantIngredients = (concern.keyIngredients || [])
        .map(id => INGREDIENTS[id])
        .filter(Boolean);

    return {
        ...concern,
        severity,
        aggravators,
        relevantIngredients,
        personalizedNote: generatePersonalizedNote(concern, profile),
    };
}

function generatePersonalizedNote(concern, profile) {
    const notes = [];
    const age = parseInt(profile.age) || 20;

    if (concern.id === 'acne' && age < 25) {
        notes.push(`At ${age}, androgenic activity is near peak — this is a primary biological driver. It will naturally improve with age.`);
    }
    if (concern.id === 'tanning' && profile.climate === 'hot_humid') {
        notes.push('Your hot, humid climate means higher UV exposure year-round. Sunscreen is your most important de-tanning tool — more impactful than any serum.');
    }
    if (concern.id === 'hair_dry' && profile.climate === 'hot_humid') {
        notes.push('Humidity causes hygral fatigue (hair absorbs/releases moisture repeatedly) → cuticle damage. A silicone-based serum will seal the cuticle against humidity.');
    }
    if (concern.id === 'pie') {
        notes.push('PIE resolves with time (3-6 months). The single most impactful intervention is UV protection — UV re-stimulates vascular inflammation.');
    }
    if (concern.id === 'dullness' && parseInt(profile.sleep) < 7) {
        notes.push('Sleep deprivation is a major contributor to dullness. Growth hormone (peaks during deep sleep) drives cellular renewal. Even 1 extra hour helps.');
    }

    return notes.join(' ');
}

function recommendProducts(profile) {
    const allProducts = [...PRODUCTS];
    const userConcerns = profile.concerns || [];
    const userSkinType = profile.skinType || 'combination';
    const budget = profile.budget || 'medium';

    // Score products by relevance
    const scored = allProducts.map(product => {
        let relevanceScore = 0;

        // Concern match
        const matchedConcerns = product.concerns.filter(c => userConcerns.includes(c));
        relevanceScore += matchedConcerns.length * 3;

        // Skin type match
        if (product.bestFor.includes(userSkinType)) relevanceScore += 2;

        // Quality scores
        relevanceScore += (product.ingredientScore / 10) * 2;
        relevanceScore += (product.reviewScore / 10) * 1.5;

        // Safety bonuses
        if (product.comedogenicSafe) relevanceScore += 1;
        if (product.fragranceFree) relevanceScore += 0.5;

        // Budget filter
        const monthlyCost = product.price / product.monthlyDuration;
        if (budget === 'low' && monthlyCost > 250) relevanceScore -= 2;

        return { ...product, relevanceScore, matchedConcerns, monthlyCost: Math.round(monthlyCost) };
    });

    // Sort by relevance
    scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Pick best product per category
    const categories = ['cleanser', 'serum', 'exfoliator', 'spot_treatment', 'moisturizer', 'sunscreen', 'shampoo', 'conditioner', 'hair_serum', 'hair_mask'];
    const selected = [];

    for (const cat of categories) {
        const candidates = scored.filter(p => p.category === cat && p.relevanceScore > 0);
        if (candidates.length > 0) {
            // Check if this category is relevant to user's concerns
            const isRelevant = candidates.some(p => p.matchedConcerns.length > 0);
            if (isRelevant || ['cleanser', 'moisturizer', 'sunscreen'].includes(cat)) {
                selected.push(candidates[0]);
            }
        }
    }

    // Add niacinamide serum if user has skin concerns
    const skinConcerns = userConcerns.filter(c => !['hair_dry', 'scalp_dry'].includes(c));
    if (skinConcerns.length > 0) {
        const hasNiacinamide = selected.some(p => p.keyIngredients?.includes('niacinamide'));
        if (!hasNiacinamide) {
            const niacinamide = scored.find(p => p.keyIngredients?.includes('niacinamide'));
            if (niacinamide) selected.push(niacinamide);
        }
    }

    // Add alpha arbutin if tanning/dullness concern
    if (userConcerns.includes('tanning') || userConcerns.includes('dullness')) {
        const hasArbutin = selected.some(p => p.keyIngredients?.includes('alpha_arbutin'));
        if (!hasArbutin) {
            const arbutin = scored.find(p => p.keyIngredients?.includes('alpha_arbutin'));
            if (arbutin) selected.push(arbutin);
        }
    }

    return selected;
}

function generateRoutine(profile) {
    const concerns = profile.concerns || [];
    const hasSkinConcerns = concerns.some(c => !['hair_dry', 'scalp_dry'].includes(c));
    const hasHairConcerns = concerns.some(c => ['hair_dry', 'scalp_dry'].includes(c));

    const routine = { am: [], pm: [], hair: [] };

    if (hasSkinConcerns) {
        routine.am = [
            { step: 'Cleanser', product: 'Gentle/SA face wash', purpose: 'Remove overnight sebum + debris', timing: 'Daily' },
        ];

        if (concerns.includes('tanning') || concerns.includes('dullness')) {
            routine.am.push({ step: 'Alpha Arbutin Serum', product: 'Minimalist Alpha Arbutin 2%', purpose: 'Inhibit melanin production', timing: 'Daily' });
        }

        routine.am.push(
            { step: 'Niacinamide Serum', product: 'Minimalist/Derma Co 10% Niacinamide', purpose: 'Oil control + even tone + PIE repair', timing: 'Daily' },
            { step: 'Moisturizer', product: 'Sebamed/Minimalist gel', purpose: 'Barrier support + hydration', timing: 'Daily' },
            { step: 'Sunscreen', product: "Re'equil SPF 50", purpose: 'UV protection — #1 anti-tanning + anti-aging tool', timing: 'Daily (reapply every 2-3 hrs in sun)' },
        );

        // PM varies by day
        routine.pm = [
            { step: 'Cleanser', product: 'Same face wash', purpose: 'Remove sunscreen + daily grime', timing: 'Daily' },
        ];

        if (concerns.includes('acne') || concerns.includes('pores')) {
            routine.pm.push({ step: 'Salicylic Acid Serum', product: 'Minimalist 2% SA Serum', purpose: 'Pore clearing + anti-inflammatory', timing: '3x/week (Mon, Thu, Sun)' });
        }

        if (concerns.includes('dullness') || concerns.includes('tanning')) {
            routine.pm.push({ step: 'Glycolic Acid', product: 'Minimalist 8% Glycolic Acid', purpose: 'Surface exfoliation + glow + de-tanning', timing: '2x/week (Wed, Sat) — alternate with SA' });
        }

        if (concerns.includes('acne')) {
            routine.pm.push({ step: 'Spot Treatment', product: 'Benzac AC 2.5%', purpose: 'Kill C. acnes on active lesions', timing: 'As needed, on active pimples only' });
        }

        routine.pm.push({ step: 'Moisturizer', product: 'Same gel moisturizer', purpose: 'Overnight barrier repair', timing: 'Daily' });
    }

    if (hasHairConcerns) {
        routine.hair = [
            { step: 'Pre-wash Oil', product: 'Coconut oil', purpose: 'Reduce protein loss, lubricate cuticle', timing: '1x/week, 30 min before wash' },
            { step: 'Shampoo', product: "Re'equil sulfate-free", purpose: 'Gentle cleansing', timing: '2-3x/week' },
            { step: 'Conditioner', product: 'Dove Peptide Bond', purpose: 'Cuticle repair, slip, moisture', timing: 'Every wash (mid-lengths + ends)' },
            { step: 'Deep Mask', product: 'Tresemmé Keratin Smooth', purpose: 'Intensive repair + keratin infusion', timing: '1x/week (replace conditioner)' },
            { step: 'Hair Serum', product: 'Streax Vitariche Gloss', purpose: 'Seal cuticle, lock out humidity, add shine', timing: 'After every wash, damp hair' },
        ];
    }

    return routine;
}

function generateDietPlan(profile) {
    const concerns = profile.concerns || [];
    const diet = [];

    // Add concern-specific recommendations
    concerns.forEach(concernId => {
        const recs = DIET_RECOMMENDATIONS[concernId];
        if (recs) {
            recs.forEach(rec => {
                if (!diet.find(d => d.item === rec.item)) {
                    diet.push({ ...rec, forConcern: concernId });
                }
            });
        }
    });

    // Always add general recommendations
    DIET_RECOMMENDATIONS.general.forEach(rec => {
        if (!diet.find(d => d.item === rec.item)) {
            diet.push({ ...rec, forConcern: 'general' });
        }
    });

    return diet;
}

function assessLifestyle(profile) {
    const concerns = profile.concerns || [];
    return LIFESTYLE_FACTORS
        .filter(f => f.impactAreas.some(area => concerns.includes(area)))
        .map(factor => ({
            ...factor,
            currentStatus: getLifestyleStatus(factor.id, profile),
            recommendation: getLifestyleRec(factor.id, profile),
        }));
}

function getLifestyleStatus(factorId, profile) {
    if (factorId === 'sleep') {
        const hrs = parseInt(profile.sleep) || 7;
        if (hrs >= 7) return { status: 'good', label: `${hrs} hrs — adequate` };
        if (hrs >= 6) return { status: 'warning', label: `${hrs} hrs — suboptimal` };
        return { status: 'critical', label: `${hrs} hrs — insufficient` };
    }
    if (factorId === 'stress') {
        return { status: profile.stress === 'low' ? 'good' : profile.stress === 'high' ? 'critical' : 'warning', label: profile.stress || 'unknown' };
    }
    return { status: 'unknown', label: 'Not assessed' };
}

function getLifestyleRec(factorId, profile) {
    if (factorId === 'sleep' && parseInt(profile.sleep) < 7) {
        return 'Aim for 7+ hrs. Even 30 min more significantly impacts cortisol normalization and growth hormone release.';
    }
    if (factorId === 'stress' && profile.stress !== 'low') {
        return 'Box breathing (4-4-4-4) for 10 min before sleep. Directly lowers CRH → reduces sebaceous stimulation. Zero cost, evidence-backed.';
    }
    return null;
}

function generateIntroSchedule(profile) {
    const concerns = profile.concerns || [];
    const schedule = [];
    let week = 1;

    schedule.push({ week: week++, items: ['Cleanser', 'Moisturizer', 'Sunscreen'], note: 'Foundation — establish baseline routine' });

    if (concerns.includes('hair_dry') || concerns.includes('scalp_dry')) {
        schedule.push({ week: week++, items: ['Conditioner', 'Hair Serum'], note: 'Hair basics — low risk, start early' });
    }

    if (concerns.some(c => ['acne', 'pores', 'tanning', 'dullness', 'pie'].includes(c))) {
        schedule.push({ week: week++, items: ['Niacinamide Serum (AM)'], note: 'Primary active — well-tolerated, multi-benefit' });
    }

    if (concerns.includes('tanning') || concerns.includes('dullness')) {
        schedule.push({ week: week++, items: ['Alpha Arbutin Serum (AM)'], note: 'Brightening layer — non-irritating' });
    }

    if (concerns.includes('acne') || concerns.includes('pores')) {
        schedule.push({ week: week++, items: ['Salicylic Acid Serum (PM, 2x/week)'], note: 'Exfoliation — start slow, titrate up' });
    }

    if (concerns.includes('dullness') || concerns.includes('tanning')) {
        schedule.push({ week: week++, items: ['Glycolic Acid (PM, 1x/week)'], note: 'Surface exfoliation — alternate with SA nights' });
    }

    if (concerns.includes('acne')) {
        schedule.push({ week: week++, items: ['Benzac AC 2.5% (spot treatment)'], note: 'Targeted acne treatment — as needed only' });
    }

    if (concerns.includes('hair_dry')) {
        schedule.push({ week: week++, items: ['Weekly Deep Mask', 'Pre-wash Oil'], note: 'Deep conditioning layer' });
    }

    return schedule;
}

function getConflicts(products) {
    const conflicts = [];
    const hasAHA = products.some(p => p.keyIngredients?.includes('glycolic_acid'));
    const hasBHA = products.some(p => p.keyIngredients?.includes('salicylic_acid'));
    const hasRetinol = products.some(p => p.keyIngredients?.includes('retinol'));
    const hasVitC = products.some(p => p.keyIngredients?.includes('vitamin_c'));

    if (hasAHA && hasBHA) {
        conflicts.push({
            type: 'timing',
            severity: 'warning',
            message: 'AHA (Glycolic) and BHA (Salicylic) should NOT be used on the same night. Alternate them.',
            resolution: 'Mon/Thu/Sun → SA nights | Wed/Sat → AHA nights | Tue/Fri → rest nights',
        });
    }
    if (hasRetinol && hasAHA) {
        conflicts.push({
            type: 'timing',
            severity: 'critical',
            message: 'Retinol + AHA on the same night causes severe barrier damage.',
            resolution: 'Use on completely separate nights.',
        });
    }
    if (hasVitC && products.some(p => p.keyIngredients?.includes('niacinamide'))) {
        conflicts.push({
            type: 'info',
            severity: 'info',
            message: 'Vitamin C + Niacinamide can cause temporary flushing in some individuals.',
            resolution: 'If flushing occurs, use Vitamin C in AM and Niacinamide in PM.',
        });
    }

    return conflicts;
}


// ============================================================
// DermIQ — Chat Engine
// Keyword matching + decision tree based conversational engine.
// Provides structured expert-system responses.
// ============================================================


const GREETINGS = ['hi', 'hello', 'hey', 'namaste', 'hii', 'helo', 'sup', 'good morning', 'good evening'];
const THANKS = ['thanks', 'thank you', 'thanku', 'thnx', 'ty', 'thx'];

const CONCERN_KEYWORDS = {
    acne: ['acne', 'pimple', 'breakout', 'zit', 'blemish', 'spots', 'bumps', 'cystic', 'whitehead', 'blackhead', 'comedone'],
    tanning: ['tan', 'tanning', 'dark', 'pigmentation', 'uneven', 'fairness', 'brightening', 'dark spots', 'sun damage', 'melanin'],
    pie: ['redness', 'red marks', 'pink marks', 'pie', 'post inflammatory', 'acne scars red', 'acne marks'],
    pores: ['pores', 'large pores', 'open pores', 'visible pores', 'enlarged pores'],
    dullness: ['dull', 'glow', 'radiance', 'tired skin', 'no glow', 'lifeless', 'brightness', 'glowing'],
    dryness: ['dry', 'dehydrated', 'flaky', 'tight', 'peeling', 'rough skin', 'moisture'],
    hair_dry: ['hair dry', 'frizzy', 'frizz', 'hair shine', 'hair smooth', 'rough hair', 'dull hair', 'hair fall', 'hair damage'],
    scalp_dry: ['dandruff', 'scalp', 'flakes', 'itchy scalp', 'scalp dry'],
};

const PRODUCT_KEYWORDS = ['product', 'recommend', 'buy', 'which', 'best', 'suggestion', 'use what', 'face wash', 'serum', 'sunscreen', 'moisturizer', 'cleanser', 'shampoo'];
const ROUTINE_KEYWORDS = ['routine', 'schedule', 'when to use', 'morning', 'night', 'am', 'pm', 'order', 'steps', 'how to apply'];
const DIET_KEYWORDS = ['diet', 'food', 'eat', 'nutrition', 'vitamin', 'supplement', 'zinc', 'omega', 'b12'];
const INGREDIENT_KEYWORDS = ['ingredient', 'niacinamide', 'salicylic', 'glycolic', 'retinol', 'vitamin c', 'hyaluronic', 'arbutin', 'benzoyl', 'ceramide', 'aha', 'bha'];
const WHY_KEYWORDS = ['why', 'how does', 'mechanism', 'explain', 'science', 'how it works', 'what does'];

function processMessage(message, profile) {
    const lower = message.toLowerCase().trim();

    // Greeting
    if (GREETINGS.some(g => lower.startsWith(g) || lower === g)) {
        return createResponse('greeting', profile);
    }

    // Thanks
    if (THANKS.some(t => lower.includes(t))) {
        return createResponse('thanks', profile);
    }

    // Determine intent
    const intent = classifyIntent(lower);
    return createResponse(intent.type, profile, intent.data);
}

function classifyIntent(message) {
    // Check for "why" / mechanism questions
    if (WHY_KEYWORDS.some(k => message.includes(k))) {
        const ingredient = findIngredient(message);
        if (ingredient) return { type: 'ingredient_explain', data: ingredient };
        const concern = findConcern(message);
        if (concern) return { type: 'concern_explain', data: concern };
    }

    // Check for ingredient questions
    if (INGREDIENT_KEYWORDS.some(k => message.includes(k))) {
        const ingredient = findIngredient(message);
        if (ingredient) return { type: 'ingredient_info', data: ingredient };
    }

    // Check for product recommendations
    if (PRODUCT_KEYWORDS.some(k => message.includes(k))) {
        const concern = findConcern(message);
        return { type: 'product_rec', data: concern };
    }

    // Check for routine questions
    if (ROUTINE_KEYWORDS.some(k => message.includes(k))) {
        return { type: 'routine_info', data: null };
    }

    // Check for diet questions
    if (DIET_KEYWORDS.some(k => message.includes(k))) {
        return { type: 'diet_info', data: null };
    }

    // Check for specific concern
    const concern = findConcern(message);
    if (concern) return { type: 'concern_info', data: concern };

    // Fallback
    return { type: 'general', data: null };
}

function findConcern(message) {
    for (const [concernId, keywords] of Object.entries(CONCERN_KEYWORDS)) {
        if (keywords.some(k => message.includes(k))) {
            return CONCERNS.find(c => c.id === concernId);
        }
    }
    return null;
}

function findIngredient(message) {
    const ingredientMap = {
        niacinamide: 'niacinamide',
        'vitamin b3': 'niacinamide',
        'salicylic': 'salicylic_acid',
        bha: 'salicylic_acid',
        glycolic: 'glycolic_acid',
        aha: 'glycolic_acid',
        'vitamin c': 'vitamin_c',
        'ascorbic': 'vitamin_c',
        arbutin: 'alpha_arbutin',
        'benzoyl': 'benzoyl_peroxide',
        'hyaluronic': 'hyaluronic_acid',
        ceramide: 'ceramides',
        retinol: 'retinol',
        zinc: 'zinc',
        squalane: 'squalane',
        panthenol: 'panthenol',
        'vitamin b5': 'panthenol',
        cica: 'centella_asiatica',
        centella: 'centella_asiatica',
    };

    for (const [keyword, id] of Object.entries(ingredientMap)) {
        if (message.includes(keyword)) {
            return INGREDIENTS[id];
        }
    }
    return null;
}

function createResponse(type, profile, data) {
    const responses = {
        greeting: () => ({
            text: `Welcome to DermIQ${profile?.name ? ', ' + profile.name : ''}! 👋\n\nI'm your skincare intelligence system. I use structured reasoning and evidence-based data to help you build the optimal routine.\n\n**Ask me about:**\n• Any skin concern (acne, tanning, dullness, etc.)\n• Ingredient mechanisms (\"How does niacinamide work?\")\n• Product recommendations\n• Routine scheduling\n• Diet & nutrition for skin\n\nWhat would you like to know?`,
            type: 'greeting',
        }),

        thanks: () => ({
            text: "You're welcome! Remember — consistency beats intensity. Stick with your routine for at least 8 weeks before judging results. Your skin's turnover cycle is 28 days, so meaningful change takes 2-3 full cycles.\n\nAnything else you'd like to know?",
            type: 'info',
        }),

        concern_info: () => {
            if (!data) return responses.general();
            const ingredientDetails = (data.keyIngredients || [])
                .map(id => INGREDIENTS[id])
                .filter(Boolean)
                .map(ing => `• **${ing.name}** — ${ing.mechanism.split('.')[0]}`)
                .join('\n');

            return {
                text: `## ${data.icon} ${data.label}\n\n**Mechanism:**\n${data.mechanism}\n\n**Root Causes:**\n${data.rootCauses.map(r => '• ' + r).join('\n')}\n\n**Key Ingredients to Address This:**\n${ingredientDetails}\n\n**Evidence Level:** ${data.evidenceLevel === 'strong' ? '🟢 Strong' : data.evidenceLevel === 'moderate' ? '🟡 Moderate' : '🟣 Emerging'}\n\n_Ask me about any of these ingredients for deeper mechanism details, or say "products for ${data.label.toLowerCase()}" for specific recommendations._`,
                type: 'concern',
                concern: data,
            };
        },

        concern_explain: () => {
            if (!data) return responses.general();
            return {
                text: `## Why ${data.label} Happens — Mechanistic Breakdown\n\n${data.mechanism}\n\n**Contributing Factors in Your Environment:**\n${data.rootCauses.map(r => '• ' + r).join('\n')}\n\n**The Fix Requires Attacking Multiple Steps:**\n${(data.keyIngredients || []).map(id => {
                    const ing = INGREDIENTS[id];
                    return ing ? `• **${ing.name}** (${ing.concentration}) — ${ing.benefits.join(', ')}` : '';
                }).filter(Boolean).join('\n')}\n\n_Would you like to know about specific products or see a personalized routine?_`,
                type: 'mechanism',
            };
        },

        ingredient_info: () => {
            if (!data) return { text: "I couldn't identify that ingredient. Try asking about: niacinamide, salicylic acid, glycolic acid, vitamin C, alpha arbutin, hyaluronic acid, or benzoyl peroxide.", type: 'info' };
            return {
                text: `## 🧬 ${data.name}\n\n**Mechanism:**\n${data.mechanism}\n\n**Benefits:**\n${data.benefits.map(b => '• ' + b).join('\n')}\n\n**Risks/Side Effects:**\n${data.risks.map(r => '• ' + r).join('\n')}\n\n**Recommended Concentration:** ${data.concentration}\n\n**Evidence Level:** ${data.evidence === 'strong' ? '🟢 Strong consensus' : data.evidence === 'moderate' ? '🟡 Moderate' : '🟣 Emerging'}\n\n**Addresses:** ${data.concerns.map(c => {
                    const concern = CONCERNS.find(cc => cc.id === c);
                    return concern ? concern.icon + ' ' + concern.label : c;
                }).join(', ')}`,
                type: 'ingredient',
            };
        },

        ingredient_explain: () => {
            if (!data) return responses.general();
            return {
                text: `## How ${data.name} Works\n\n${data.mechanism}\n\n**Step-by-Step:**\n${data.benefits.map((b, i) => `${i + 1}. ${b}`).join('\n')}\n\n**Important Caution:**\n${data.risks.map(r => '⚠️ ' + r).join('\n')}\n\n**Evidence Strength:** ${data.evidence === 'strong' ? '🟢 Strong — supported by multiple clinical trials' : '🟡 Moderate — observational and mechanistic support'}`,
                type: 'mechanism',
            };
        },

        product_rec: () => {
            const concernId = data?.id;
            let relevantProducts = PRODUCTS;
            if (concernId) {
                relevantProducts = PRODUCTS.filter(p => p.concerns.includes(concernId));
            }
            if (profile?.skinType) {
                relevantProducts = relevantProducts.filter(p => p.bestFor.includes(profile.skinType));
            }

            const topProducts = relevantProducts.slice(0, 5);
            if (topProducts.length === 0) return { text: "Complete your skin profile first so I can give personalized product recommendations. Go to the **Profile** tab to get started.", type: 'info' };

            const productList = topProducts.map(p =>
                `### ${p.name}\n**₹${p.price}** (${p.size}) · Ingredient Score: **${p.ingredientScore}/10** · Review: **${p.reviewScore}/10**\n${p.comedogenicSafe ? '✅ Non-comedogenic' : '⚠️ Check comedogenic rating'} ${p.fragranceFree ? '· ✅ Fragrance-free' : ''}\n${p.highlights.map(h => '• ' + h).join('\n')}`
            ).join('\n\n---\n\n');

            return {
                text: `## 🛍️ Product Recommendations${data ? ' for ' + data.label : ''}\n\n${productList}\n\n_All products verified via INCIDecoder ingredient analysis and r/IndianSkincareAddicts community reviews._`,
                type: 'products',
            };
        },

        routine_info: () => {
            if (!profile || !profile.concerns || profile.concerns.length === 0) {
                return { text: "Complete your skin profile first so I can generate a personalized routine. Go to the **Profile** tab to get started.", type: 'info' };
            }
            const analysis = analyzeProfile(profile);
            if (!analysis) return { text: "I need your profile data to generate a routine. Head to the **Profile** tab.", type: 'info' };

            let routineText = '## 📋 Your Personalized Routine\n\n';
            if (analysis.routine.am.length > 0) {
                routineText += '### ☀️ Morning (AM)\n' + analysis.routine.am.map((s, i) => `${i + 1}. **${s.step}** — ${s.product}\n   _${s.purpose}_ · ${s.timing}`).join('\n') + '\n\n';
            }
            if (analysis.routine.pm.length > 0) {
                routineText += '### 🌙 Evening (PM)\n' + analysis.routine.pm.map((s, i) => `${i + 1}. **${s.step}** — ${s.product}\n   _${s.purpose}_ · ${s.timing}`).join('\n') + '\n\n';
            }
            if (analysis.routine.hair.length > 0) {
                routineText += '### 💇 Hair Care\n' + analysis.routine.hair.map((s, i) => `${i + 1}. **${s.step}** — ${s.product}\n   _${s.purpose}_ · ${s.timing}`).join('\n');
            }

            return { text: routineText, type: 'routine' };
        },

        diet_info: () => {
            const concerns = profile?.concerns || [];
            let dietItems = [];
            concerns.forEach(c => {
                if (DIET_RECOMMENDATIONS[c]) dietItems.push(...DIET_RECOMMENDATIONS[c]);
            });
            dietItems.push(...DIET_RECOMMENDATIONS.general);

            // Deduplicate
            const seen = new Set();
            dietItems = dietItems.filter(d => { if (seen.has(d.item)) return false; seen.add(d.item); return true; });

            if (dietItems.length === 0) {
                return { text: "Complete your profile to get personalized dietary recommendations.", type: 'info' };
            }

            const text = `## 🥗 Dietary Recommendations\n\n${dietItems.map(d => `• **${d.item}** — ${d.benefit} (${d.cost})`).join('\n')}\n\n_These are evidence-based nutritional recommendations. They complement your topical routine — not replace it._`;
            return { text, type: 'diet' };
        },

        general: () => ({
            text: "I can help you with:\n\n• **Skin concerns** — Ask about acne, tanning, dullness, pores, dryness, or hair issues\n• **Ingredients** — \"How does niacinamide work?\" or \"What is salicylic acid?\"\n• **Products** — \"Best products for acne\" or \"Recommend a sunscreen\"\n• **Routine** — \"Show me my routine\" or \"When should I apply serum?\"\n• **Diet** — \"What should I eat for better skin?\"\n\nTry asking a specific question!",
            type: 'help',
        }),
    };

    const handler = responses[type] || responses.general;
    return handler();
}

;(function () {
  const STORAGE_KEY = 'dermiq_profile';
  const ROUTE_NAMES = ['home', 'profile', 'analysis', 'routine', 'products', 'chat'];
  const STEPS = ['basics', 'skin', 'concerns', 'lifestyle', 'complete'];
  const DEFAULT_PROFILE = {
    name: '',
    age: '',
    gender: '',
    skinType: '',
    climate: '',
    concerns: [],
    sleep: '',
    stress: '',
    diet: '',
    budget: 'medium',
    hairType: '',
    completed: false,
  };
  const QUICK_QUESTIONS = [
    'How does niacinamide work?',
    'Best products for acne',
    'Show me my routine',
    'What should I eat for better skin?',
    'How to remove tanning?',
    'What is salicylic acid?',
  ];

  function escapeHtml(value) {
    if (value === undefined || value === null) return '';
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  function isValidRoute(route) {
    return ROUTE_NAMES.includes(route);
  }

  function getInitialRoute() {
    const hash = window.location.hash.slice(1);
    return isValidRoute(hash) ? hash : 'home';
  }

  function ensureArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function mapConcernIcons(ids) {
    return ensureArray(ids)
      .map(id => {
        const concern = CONCERNS.find(c => c.id === id);
        return concern ? concern.icon : '';
      })
      .join(' ');
  }

  function loadProfile() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
        };
      }
    } catch (error) {
      console.warn('Unable to read profile', error);
    }
    return { ...DEFAULT_PROFILE };
  }

  const initialProfile = loadProfile();

  const state = {
    profile: initialProfile,
    profileStep: initialProfile.completed ? STEPS.length - 1 : 0,
    route: getInitialRoute(),
    productsSort: 'relevance',
    expandedProductId: null,
    chat: {
      messages: [],
      input: '',
      isTyping: false,
      typingTimer: null,
    },
  };

  const app = document.getElementById('app');
  const navLinks = document.querySelectorAll('[data-route]');
  const navbarProfile = document.getElementById('navbar-profile');

  const TEXT_FIXES = [
    ['â—', '•'],
    ['âš ï¸', '⚠️'],
    ['â†', '←'],
    ['â„¹ï¸', 'ℹ️'],
    ['â˜€ï¸', '☀️'],
    ['ðŸ›ï¸', '🛍️'],
  ];

  function saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.profile));
    } catch (error) {
      console.warn('Unable to save profile', error);
    }
  }

  function bindRouteButtons(container) {
    if (!container) return;
    container.querySelectorAll('[data-route-target]').forEach(el => {
      el.addEventListener('click', event => {
        event.preventDefault();
        const target = el.dataset.routeTarget;
        if (target) navigate(target);
      });
    });
  }

  function applyTextFixes(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      let updated = node.nodeValue;
      TEXT_FIXES.forEach(([source, target]) => {
        if (updated.includes(source)) {
          updated = updated.split(source).join(target);
        }
      });
      if (updated !== node.nodeValue) {
        node.nodeValue = updated;
      }
      node = walker.nextNode();
    }
  }

  function renderEvidenceBadge(level) {
    const info = EVIDENCE_LEVELS[level];
    if (!info) return '';
    return `<span class="badge" style="background:${info.color}20;color:${info.color}"><span style="font-size:0.6rem;">â—</span>${info.label}</span>`;
  }

  function updateProfile(updates) {
    state.profile = {
      ...state.profile,
      ...updates,
      concerns: ensureArray(state.profile.concerns),
    };
    saveProfile();
    renderNavbar();
  }

  function setProfileStep(step) {
    state.profileStep = Math.min(Math.max(step, 0), STEPS.length - 1);
    if (state.route === 'profile') {
      renderMainContent();
    }
  }

  function handleProfileStepChange(delta) {
    setProfileStep(state.profileStep + delta);
  }

  function completeProfileFlow() {
    updateProfile({ completed: true });
    setProfileStep(STEPS.length - 1);
  }

  function bindProfileStepButtons(container) {
    const nextBtn = container.querySelector('[data-profile-action="next"]');
    const prevBtn = container.querySelector('[data-profile-action="prev"]');
    const completeBtn = container.querySelector('[data-profile-action="complete"]');
    const editBtn = container.querySelector('[data-profile-action="edit"]');

    if (nextBtn) nextBtn.addEventListener('click', () => handleProfileStepChange(1));
    if (prevBtn) prevBtn.addEventListener('click', () => handleProfileStepChange(-1));
    if (completeBtn) completeBtn.addEventListener('click', completeProfileFlow);
    if (editBtn) editBtn.addEventListener('click', () => setProfileStep(0));
  }

  function updateStepButtonState(container) {
    const nextBtn = container.querySelector('[data-profile-action="next"]');
    if (!nextBtn) return;
    let disabled = false;
    if (state.profileStep === 0) {
      disabled = !state.profile.name || !state.profile.age;
    } else if (state.profileStep === 1) {
      disabled = !state.profile.skinType;
    } else if (state.profileStep === 2) {
      disabled = !(state.profile.concerns && state.profile.concerns.length);
    }
    nextBtn.disabled = disabled;
  }

  function setupProfileInteractions() {
    const container = app.querySelector('.profile-container');
    if (!container) return;

    container.querySelectorAll('[data-profile-field]:not([data-profile-value])').forEach(el => {
      const field = el.dataset.profileField;
      const eventType = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(eventType, event => {
        updateProfile({ [field]: event.target.value });
        updateStepButtonState(container);
      });
    });

    container.querySelectorAll('[data-profile-field][data-profile-value]').forEach(el => {
      const field = el.dataset.profileField;
      const value = el.dataset.profileValue;
      el.addEventListener('click', () => {
        updateProfile({ [field]: value });
        container.querySelectorAll(`[data-profile-field="${field}"][data-profile-value]`).forEach(item => {
          item.classList.toggle('selected', item === el);
        });
        updateStepButtonState(container);
      });
    });

    container.querySelectorAll('[data-profile-concern]').forEach(btn => {
      btn.addEventListener('click', () => {
        const concernId = btn.dataset.profileConcern;
        const current = new Set(ensureArray(state.profile.concerns));
        const isSelected = current.has(concernId);
        if (isSelected) {
          current.delete(concernId);
        } else {
          current.add(concernId);
        }
        updateProfile({ concerns: Array.from(current) });
        btn.classList.toggle('selected', !isSelected);
        const check = btn.querySelector('.concern-check');
        if (check) {
          check.style.display = !isSelected ? 'flex' : 'none';
        }
        updateStepButtonState(container);
      });
    });

    bindProfileStepButtons(container);
    updateStepButtonState(container);
  }

  function renderHome() {
    const completed = Boolean(state.profile.completed);
    const heroButtons = completed
      ? `<a href="#analysis" class="btn btn-primary btn-lg" data-route-target="analysis">View Analysis</a><a href="#chat" class="btn btn-secondary btn-lg" data-route-target="chat">Ask DermIQ</a>`
      : `<a href="#profile" class="btn btn-primary btn-lg" data-route-target="profile">Start Assessment →</a><a href="#chat" class="btn btn-secondary btn-lg" data-route-target="chat">Explore Chat</a>`;
    const features = [
      { icon: '🧬', title: 'Profile Analysis', desc: 'Multi-dimensional skin profiling — type, climate, concerns, lifestyle, diet', link: 'profile' },
      { icon: '🔬', title: 'Root Cause Engine', desc: 'Mechanistic breakdown of every concern — biological pathways, not surface advice', link: 'analysis' },
      { icon: '📋', title: 'Routine Builder', desc: 'Personalized AM/PM routines with ingredient conflict detection and staggered introduction', link: 'routine' },
      { icon: '🛍️', title: 'Product Intelligence', desc: 'Budget-optimized products verified via INCIDecoder, SkinSort, and r/IndianSkincareAddicts', link: 'products' },
      { icon: '💬', title: 'Ask DermIQ', desc: 'Ask about ingredients, concerns, products, or routines — structured expert responses', link: 'chat' },
      { icon: '🥗', title: 'Nutrition Engine', desc: 'Evidence-based dietary recommendations mapped to skin concerns', link: 'analysis' },
    ];
    const principles = [
      { icon: '🎯', title: 'First Principles', desc: 'Every recommendation traces to biological mechanism' },
      { icon: '📊', title: 'Evidence Calibrated', desc: 'Confidence levels tied to research quality' },
      { icon: 'âš ï¸', title: 'Risk Assessed', desc: 'Side effects, conflicts, and edge cases evaluated' },
      { icon: '🔒', title: 'Zero API', desc: 'All intelligence runs locally — your data never leaves this browser' },
    ];

    app.innerHTML = `
      <div class="home-page">
        <section class="hero">
          <div class="hero-inner container">
            <div class="hero-badge animate-in">
              <span>🧬</span> Skincare Intelligence System
            </div>
            <h1 class="hero-title animate-in animate-delay-1">
              Your skin deserves<br />
              <span class="gradient-text">structured reasoning.</span>
            </h1>
            <p class="hero-subtitle animate-in animate-delay-2">
              Not generic advice. Not content marketing. A rule-based expert system built on
              ingredient science, clinical evidence, and mechanistic analysis.
            </p>
            <div class="hero-actions animate-in animate-delay-3">
              ${heroButtons}
            </div>
          </div>
          <div class="hero-glow"></div>
        </section>
        <section class="section container">
          <div class="principles-grid">
            ${principles
              .map(
                (item, index) => `<div class="principle-card animate-in animate-delay-${index + 1}">
                    <span class="principle-icon">${item.icon}</span>
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                  </div>`
              )
              .join('')}
          </div>
        </section>
        <section class="section container">
          <div class="section-header">
            <h2 class="section-title">Intelligence Modules</h2>
            <p class="section-subtitle">Each module is built for analytical depth, not surface-level tips</p>
          </div>
          <div class="features-grid">
            ${features
              .map(
                feature => `<a href="#${feature.link}" class="feature-card glass-card" data-route-target="${feature.link}">
                    <span class="feature-icon">${feature.icon}</span>
                    <h3>${feature.title}</h3>
                    <p>${feature.desc}</p>
                    <span class="feature-arrow">→</span>
                  </a>`
              )
              .join('')}
          </div>
        </section>
        <section class="section container">
          <div class="cta-card glass-card no-hover">
            <h2>Built on the <span class="gradient-text">Sovereign Identity Framework</span></h2>
            <p>Zero mediocrity. First-principles reasoning. Evidence calibration. Risk assessment. Personalization logic. Every response architecturally undeniable.</p>
            ${!state.profile.completed ? `<a href="#profile" class="btn btn-primary btn-lg" data-route-target="profile" style="margin-top: 16px;">Begin Your Assessment →</a>` : ''}
          </div>
        </section>
      </div>
    `;
    bindRouteButtons(app);
  }

  function getProfileStepMarkup() {
    const profile = state.profile;
    switch (state.profileStep) {
      case 0:
        return `
          <div class="step-content animate-in">
            <h2>Let's understand you</h2>
            <p class="step-desc">Basic information helps personalize every recommendation.</p>
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="input-field" data-profile-field="name" placeholder="Your name" value="${escapeHtml(profile.name)}" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Age</label>
                <input type="number" class="input-field" data-profile-field="age" placeholder="19" value="${escapeHtml(profile.age)}" />
              </div>
              <div class="form-group">
                <label>Gender</label>
                <select class="input-field" data-profile-field="gender">
                  <option value="">Select</option>
                  <option value="male" ${profile.gender === 'male' ? 'selected' : ''}>Male</option>
                  <option value="female" ${profile.gender === 'female' ? 'selected' : ''}>Female</option>
                  <option value="other" ${profile.gender === 'other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Climate</label>
              <div class="chip-grid">
                ${CLIMATES.map(
                  climate => `<button type="button" class="chip ${profile.climate === climate.id ? 'selected' : ''}" data-profile-field="climate" data-profile-value="${climate.id}">
                    ${climate.label}
                  </button>`
                ).join('')}
              </div>
            </div>
            <button type="button" class="btn btn-primary btn-lg full-width" data-profile-action="next" ${!profile.name || !profile.age ? 'disabled' : ''}>Next →</button>
          </div>
        `;
      case 1:
        return `
          <div class="step-content animate-in">
            <h2>Your skin type</h2>
            <p class="step-desc">This determines product textures, ingredient concentrations, and routine intensity.</p>
            <div class="type-grid">
              ${SKIN_TYPES.map(
                type => `<button type="button" class="type-card ${profile.skinType === type.id ? 'selected' : ''}" data-profile-field="skinType" data-profile-value="${type.id}">
                  <h3>${type.label}</h3>
                  <p>${type.desc}</p>
                </button>`
              ).join('')}
            </div>
            <div class="step-nav">
              <button type="button" class="btn btn-secondary" data-profile-action="prev">â† Back</button>
              <button type="button" class="btn btn-primary btn-lg" data-profile-action="next" ${!profile.skinType ? 'disabled' : ''}>Next →</button>
            </div>
          </div>
        `;
      case 2:
        return `
          <div class="step-content animate-in">
            <h2>What concerns you?</h2>
            <p class="step-desc">Select all that apply. Each concern triggers a distinct analysis pathway.</p>
            <div class="concerns-grid">
              ${CONCERNS.map(
                concern => `<button type="button" class="concern-card ${ensureArray(profile.concerns).includes(concern.id) ? 'selected' : ''}" data-profile-concern="${concern.id}">
                  <span class="concern-icon">${concern.icon}</span>
                  <h3>${concern.label}</h3>
                  <p>${concern.description}</p>
                  <span class="concern-check" style="display:${ensureArray(profile.concerns).includes(concern.id) ? 'flex' : 'none'};">✓</span>
                </button>`
              ).join('')}
            </div>
            <div class="step-nav">
              <button type="button" class="btn btn-secondary" data-profile-action="prev">â† Back</button>
              <button type="button" class="btn btn-primary btn-lg" data-profile-action="next" ${!(profile.concerns && profile.concerns.length) ? 'disabled' : ''}>Next →</button>
            </div>
          </div>
        `;
      case 3:
        return `
          <div class="step-content animate-in">
            <h2>Lifestyle factors</h2>
            <p class="step-desc">These systemic drivers often matter more than products.</p>
            <div class="form-row">
              <div class="form-group">
                <label>Sleep (hours/night)</label>
                <select class="input-field" data-profile-field="sleep">
                  <option value="">Select</option>
                  <option value="4" ${profile.sleep === '4' ? 'selected' : ''}>4 or less</option>
                  <option value="5" ${profile.sleep === '5' ? 'selected' : ''}>5 hours</option>
                  <option value="6" ${profile.sleep === '6' ? 'selected' : ''}>6 hours</option>
                  <option value="7" ${profile.sleep === '7' ? 'selected' : ''}>7 hours</option>
                  <option value="8" ${profile.sleep === '8' ? 'selected' : ''}>8+ hours</option>
                </select>
              </div>
              <div class="form-group">
                <label>Stress Level</label>
                <select class="input-field" data-profile-field="stress">
                  <option value="">Select</option>
                  <option value="low" ${profile.stress === 'low' ? 'selected' : ''}>Low</option>
                  <option value="moderate" ${profile.stress === 'moderate' ? 'selected' : ''}>Moderate</option>
                  <option value="high" ${profile.stress === 'high' ? 'selected' : ''}>High</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Diet</label>
                <select class="input-field" data-profile-field="diet">
                  <option value="">Select</option>
                  <option value="vegetarian" ${profile.diet === 'vegetarian' ? 'selected' : ''}>Vegetarian</option>
                  <option value="vegan" ${profile.diet === 'vegan' ? 'selected' : ''}>Vegan</option>
                  <option value="non-vegetarian" ${profile.diet === 'non-vegetarian' ? 'selected' : ''}>Non-Vegetarian</option>
                  <option value="eggetarian" ${profile.diet === 'eggetarian' ? 'selected' : ''}>Eggetarian</option>
                </select>
              </div>
              <div class="form-group">
                <label>Monthly Skincare Budget</label>
                <select class="input-field" data-profile-field="budget">
                  <option value="low" ${profile.budget === 'low' ? 'selected' : ''}>Under ₹500</option>
                  <option value="medium" ${profile.budget === 'medium' ? 'selected' : ''}>₹500 - ₹1000</option>
                  <option value="high" ${profile.budget === 'high' ? 'selected' : ''}>₹1000+</option>
                </select>
              </div>
            </div>
            <div class="step-nav">
              <button type="button" class="btn btn-secondary" data-profile-action="prev">â† Back</button>
              <button type="button" class="btn btn-primary btn-lg" data-profile-action="complete">Complete Assessment →</button>
            </div>
          </div>
        `;
      case 4:
      default:
        return `
          <div class="step-content animate-in" style="text-align:center;">
            <div class="complete-icon">✅</div>
            <h2>Profile Complete</h2>
            <p class="step-desc">Your personalized analysis is ready. DermIQ has processed your profile through the analysis engine.</p>
            <div class="profile-summary glass-card no-hover">
              <div class="summary-grid">
                <div><span class="summary-label">Name</span><span class="summary-value">${escapeHtml(profile.name)}</span></div>
                <div><span class="summary-label">Age</span><span class="summary-value">${escapeHtml(profile.age)}</span></div>
                <div><span class="summary-label">Skin Type</span><span class="summary-value">${escapeHtml(profile.skinType)}</span></div>
                <div><span class="summary-label">Climate</span><span class="summary-value">${profile.climate ? profile.climate.replace('_', ' ') : ''}</span></div>
                <div><span class="summary-label">Concerns</span><span class="summary-value">${mapConcernIcons(profile.concerns)}</span></div>
                <div><span class="summary-label">Budget</span><span class="summary-value">${escapeHtml(profile.budget)}</span></div>
              </div>
            </div>
            <div class="complete-actions">
              <a href="#analysis" class="btn btn-primary btn-lg" data-route-target="analysis">View Analysis →</a>
              <button type="button" class="btn btn-secondary" data-profile-action="edit">Edit Profile</button>
            </div>
          </div>
        `;
    }
  }

  function renderProfile() {
    const progress = ((state.profileStep + 1) / STEPS.length) * 100;
    const stepsMarkup = STEPS.map((_, index) => `<span class="progress-step ${index <= state.profileStep ? 'active' : ''}">${index < state.profileStep ? '✓' : index + 1}</span>`).join('');
    app.innerHTML = `
      <div class="profile-page">
        <div class="container">
          <div class="profile-container">
            <div class="profile-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width:${progress}%"></div>
              </div>
              <div class="progress-steps">
                ${stepsMarkup}
              </div>
            </div>
            ${getProfileStepMarkup()}
          </div>
        </div>
      </div>
    `;
    setupProfileInteractions();
    bindRouteButtons(app);
  }

  function renderPageEmpty(title, description, route) {
    app.innerHTML = `
      <div class="page-empty">
        <div class="container">
          <div class="empty-state">
            <span class="empty-icon">🔬</span>
            <h2>${title}</h2>
            <p>${description}</p>
            <a href="#${route}" class="btn btn-primary btn-lg" data-route-target="${route}">Start Assessment →</a>
          </div>
        </div>
      </div>
    `;
    bindRouteButtons(app);
  }

  function renderAnalysis() {
    const analysis = analyzeProfile(state.profile);
    if (!state.profile.completed || !analysis) {
      renderPageEmpty('Complete Your Profile First', 'DermIQ needs your skin data to generate a personalized analysis.', 'profile');
      return;
    }
    const climateLabel = state.profile.climate ? state.profile.climate.replace('_', ' ') : '';
    const concernsHtml = analysis.concerns
      .map((concern, index) => {
        const severityClass = concern.severity === 'moderate-severe' ? 'red' : concern.severity === 'moderate' ? 'yellow' : 'green';
        const aggravators = concern.aggravators.map(item => `<li>${item}</li>`).join('');
        const rootCauses = concern.rootCauses.map(cause => `<span class="root-cause-tag">${cause}</span>`).join('');
        const ingredients = concern.relevantIngredients
          .map(ing => `<div class="ingredient-row"><div class="ingredient-name">${ing.name} <span class="ingredient-conc">(${ing.concentration})</span></div><div class="ingredient-mech">${ing.mechanism.split('.')[0]}.</div></div>`)
          .join('');
        return `
          <div class="concern-analysis-card glass-card no-hover animate-in animate-delay-${Math.min(index + 1, 4)}">
            <div class="concern-header">
              <div class="concern-title-row">
                <span class="concern-emoji">${concern.icon}</span>
                <h2>${concern.label}</h2>
              </div>
              <div class="concern-meta">
                <span class="badge badge-${severityClass}">${concern.severity}</span>
                ${renderEvidenceBadge(concern.evidenceLevel)}
              </div>
            </div>
            <div class="mechanism-section">
              <h4>Mechanism</h4>
              <p>${concern.mechanism}</p>
            </div>
            ${concern.aggravators.length ? `<div class="aggravators-section"><h4>âš ï¸ Your Risk Factors</h4><ul>${aggravators}</ul></div>` : ''}
            <div class="root-causes-section">
              <h4>Root Causes</h4>
              <div class="root-causes-list">${rootCauses}</div>
            </div>
            ${ingredients ? `<div class="ingredients-section"><h4>Key Treatment Ingredients</h4>${ingredients}</div>` : ''}
            ${concern.personalizedNote ? `<div class="personalized-note"><span class="note-icon">💡</span><p>${concern.personalizedNote}</p></div>` : ''}
          </div>
        `;
      })
      .join('');

    const lifestyleHtml = analysis.lifestyle.length
      ? `
        <section class="section">
          <h2 class="section-title">Lifestyle Impact</h2>
          <p class="section-subtitle">Systemic drivers often matter more than topicals</p>
          <div class="lifestyle-grid">
            ${analysis.lifestyle
              .map(factor => {
                const badgeType =
                  factor.currentStatus?.status === 'good'
                    ? 'green'
                    : factor.currentStatus?.status === 'critical'
                      ? 'red'
                      : 'yellow';
                const badgeLabel = factor.currentStatus?.label || '';
                return `
                  <div class="lifestyle-card glass-card no-hover">
                    <div class="lifestyle-header">
                      <h3>${factor.label}</h3>
                      ${badgeLabel ? `<span class="badge badge-${badgeType}">${badgeLabel}</span>` : ''}
                    </div>
                    <p class="lifestyle-mechanism">${factor.mechanism}</p>
                    ${factor.recommendation ? `<div class="lifestyle-rec"><strong>Action:</strong> ${factor.recommendation}</div>` : ''}
                  </div>
                `;
              })
              .join('')}
          </div>
        </section>
      `
      : '';

    const dietHtml = analysis.diet.length
      ? `
        <section class="section">
          <h2 class="section-title">🥗 Nutritional Strategy</h2>
          <p class="section-subtitle">Evidence-based dietary interventions for your concerns</p>
          <div class="diet-grid">
            ${analysis.diet
              .map(item => `
                <div class="diet-card glass-card no-hover">
                  <h4>${item.item}</h4>
                  <p>${item.benefit}</p>
                  <span class="diet-cost">${item.cost}</span>
                </div>
              `)
              .join('')}
          </div>
        </section>
      `
      : '';

    app.innerHTML = `
      <div class="analysis-page">
        <div class="container">
          <div class="section-header">
            <h1 class="section-title">Your Skin Analysis</h1>
            <p class="section-subtitle">Multi-dimensional breakdown based on your profile — ${escapeHtml(state.profile.name)}, ${escapeHtml(state.profile.age)}y, ${escapeHtml(state.profile.skinType)} skin, ${escapeHtml(climateLabel)} climate</p>
          </div>
          <div class="analysis-grid">
            ${concernsHtml}
          </div>
          ${lifestyleHtml}
          ${dietHtml}
          <div class="analysis-nav">
            <a href="#routine" class="btn btn-primary btn-lg" data-route-target="routine">View Your Routine →</a>
            <a href="#products" class="btn btn-secondary btn-lg" data-route-target="products">See Products →</a>
          </div>
        </div>
      </div>
    `;
    bindRouteButtons(app);
  }

  function renderRoutine() {
    const analysis = analyzeProfile(state.profile);
    if (!state.profile.completed || !analysis) {
      renderPageEmpty('Complete Your Profile First', 'Your personalized routine is generated from your profile data.', 'profile');
      return;
    }
    const conflicts = getConflicts(analysis.products);
    const routineSection = (title, steps, badgeLabel, badgeClass) => {
      if (!steps.length) return '';
      const mapped = steps
        .map((step, index) => `
          <div class="timeline-step">
            <div class="timeline-marker">
              <span class="step-number">${index + 1}</span>
              ${index < steps.length - 1 ? '<div class="timeline-line"></div>' : ''}
            </div>
            <div class="timeline-content glass-card no-hover">
              <div class="step-header">
                <h3>${step.step}</h3>
                <span class="badge badge-${badgeClass}">${step.timing}</span>
              </div>
              <p class="step-product">${step.product}</p>
              <p class="step-purpose">${step.purpose}</p>
            </div>
          </div>
        `)
        .join('');
      return `
        <section class="routine-section animate-in">
          <div class="routine-header">
            <h2>${title}</h2>
            <span class="badge badge-${badgeClass}">${badgeLabel}</span>
          </div>
          <div class="routine-timeline">
            ${mapped}
          </div>
        </section>
      `;
    };
    const introductionHtml = analysis.introductionSchedule.length
      ? `
        <section class="section">
          <h2 class="section-title">📅 Introduction Schedule</h2>
          <p class="section-subtitle">Never introduce everything at once. Stagger to isolate reactions.</p>
          <div class="intro-timeline">
            ${analysis.introductionSchedule
              .map(phase => `
                <div class="intro-phase glass-card no-hover">
                  <div class="phase-week">
                    <span class="week-label">Week ${phase.week}</span>
                  </div>
                  <div class="phase-content">
                    <div class="phase-items">
                      ${phase.items.map(item => `<span class="chip selected">${item}</span>`).join('')}
                    </div>
                    <p class="phase-note">${phase.note}</p>
                  </div>
                </div>
              `)
              .join('')}
          </div>
        </section>
      `
      : '';
    app.innerHTML = `
      <div class="routine-page">
        <div class="container">
          <div class="section-header">
            <h1 class="section-title">Your Personalized Routine</h1>
            <p class="section-subtitle">Optimized for ${escapeHtml(state.profile.skinType)} skin in ${escapeHtml(state.profile.climate ? state.profile.climate.replace('_', ' ') : '')} conditions</p>
          </div>
          ${conflicts
            .map(conflict => `
              <div class="conflict-card conflict-${conflict.severity}">
                <strong>${conflict.severity === 'critical' ? '🚫' : conflict.severity === 'warning' ? 'âš ï¸' : 'â„¹ï¸'} ${conflict.message}</strong>
                <p>${conflict.resolution}</p>
              </div>
            `)
            .join('')}
          ${routineSection('â˜€ï¸ Morning Routine (AM)', analysis.routine.am, 'Daily', 'cyan')}
          ${routineSection('🌙 Evening Routine (PM)', analysis.routine.pm, 'Varies by day', 'purple')}
          ${routineSection('💇 Hair Care', analysis.routine.hair, '2-3x/week', 'green')}
          ${introductionHtml}
          <div class="cost-summary glass-card no-hover">
            <h3>💰 Estimated Monthly Cost</h3>
            <div class="cost-value">₹${Math.round(analysis.monthlyCost)}/month</div>
            <p>Based on ${analysis.products.length} products with amortized monthly costs</p>
          </div>
        </div>
      </div>
    `;
    bindRouteButtons(app);
  }

  function renderProducts() {
    const analysis = analyzeProfile(state.profile);
    if (!state.profile.completed || !analysis) {
      renderPageEmpty('Complete Your Profile First', 'Product recommendations are personalized to your skin type, concerns, and budget.', 'profile');
      return;
    }
    const products = [...analysis.products];
    if (state.productsSort === 'price') {
      products.sort((a, b) => a.price - b.price);
    } else if (state.productsSort === 'score') {
      products.sort((a, b) => b.ingredientScore - a.ingredientScore);
    } else if (state.productsSort === 'review') {
      products.sort((a, b) => b.reviewScore - a.reviewScore);
    }
    const categoryLabels = {
      cleanser: '🧴 Cleanser',
      serum: '💧 Serum',
      exfoliator: '✨ Exfoliator',
      spot_treatment: '🎯 Spot Treatment',
      moisturizer: '🧊 Moisturizer',
      sunscreen: 'â˜€ï¸ Sunscreen',
      shampoo: '🧴 Shampoo',
      conditioner: '💧 Conditioner',
      hair_serum: '✨ Hair Serum',
      hair_mask: '🎭 Hair Mask',
    };
    const productCards = products
      .map(product => {
        const expanded = state.expandedProductId === product.id;
        const highlightHtml = product.highlights.map(point => `<div class="highlight-item">• ${point}</div>`).join('');
        const tags = [
          product.comedogenicSafe ? `<span class="badge badge-green">Non-comedogenic</span>` : '',
          product.fragranceFree ? `<span class="badge badge-green">Fragrance-free</span>` : '',
          ...(product.matchedConcerns || []).map(c => {
            const concern = CONCERNS.find(item => item.id === c);
            return concern ? `<span class="badge badge-cyan">${concern.icon} ${concern.label}</span>` : '';
          }),
        ]
          .filter(Boolean)
          .join('');
        const ingredientDetails = (product.keyIngredients || [])
          .map(id => {
            const ing = INGREDIENTS[id];
            if (!ing) return '';
            return `
              <div class="detail-ingredient">
                <div class="detail-ing-header">
                  <strong>${ing.name}</strong>
                  ${renderEvidenceBadge(ing.evidence)}
                </div>
                <p>${ing.mechanism.split('.')[0]}.</p>
                <div class="detail-risks">
                  ${ing.risks.map(risk => `<span class="risk-tag">âš ï¸ ${risk}</span>`).join('')}
                </div>
              </div>
            `;
          })
          .join('');
        return `
          <div class="product-card glass-card no-hover">
            <div class="product-top">
              <span class="product-category">${categoryLabels[product.category] || product.category}</span>
              <div class="product-scores">
                <div class="score-pill">
                  <span class="score-label">Ingredients</span>
                  <span class="score-num" style="color:${product.ingredientScore >= 9 ? 'var(--success)' : product.ingredientScore >= 8 ? 'var(--accent-primary)' : 'var(--warning)'}">${product.ingredientScore}/10</span>
                </div>
                <div class="score-pill">
                  <span class="score-label">Reviews</span>
                  <span class="score-num" style="color:${product.reviewScore >= 9 ? 'var(--success)' : product.reviewScore >= 8 ? 'var(--accent-primary)' : 'var(--warning)'}">${product.reviewScore}/10</span>
                </div>
              </div>
            </div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price-row">
              <span class="product-price">₹${product.price}</span>
              <span class="product-size">${product.size}</span>
              <span class="product-monthly">~₹${product.monthlyCost}/mo</span>
            </div>
            <div class="product-tags">
              ${tags}
            </div>
            <div class="product-highlights">
              ${highlightHtml}
            </div>
            <button type="button" class="expand-btn" data-product-expand="${product.id}">
              ${expanded ? '▲ Hide Details' : '▼ Why This Product?'}
            </button>
            ${expanded ? `<div class="product-details animate-in">${ingredientDetails}</div>` : ''}
          </div>
        `;
      })
      .join('');

    app.innerHTML = `
      <div class="products-page">
        <div class="container">
          <div class="section-header">
            <h1 class="section-title">Recommended Products</h1>
            <p class="section-subtitle">
              ${products.length} products selected from 18+ reviewed — filtered for ${escapeHtml(state.profile.skinType)} skin, ${escapeHtml((state.profile.concerns || []).length.toString())} concerns, ${escapeHtml(state.profile.budget)} budget
            </p>
          </div>
          <div class="sort-bar">
            <span class="sort-label">Sort by:</span>
            ${['relevance', 'price', 'score', 'review']
              .map(sortKey => `<button type="button" class="btn btn-ghost ${state.productsSort === sortKey ? 'active' : ''}" data-products-sort="${sortKey}">${sortKey.charAt(0).toUpperCase() + sortKey.slice(1)}</button>`)
              .join('')}
          </div>
          <div class="products-grid">
            ${productCards}
          </div>
          <div class="products-total glass-card no-hover">
            <div class="total-row">
              <span>Total Monthly Cost (amortized)</span>
              <span class="total-value">₹${Math.round(analysis.monthlyCost)}/month</span>
            </div>
          </div>
        </div>
      </div>
    `;
    bindRouteButtons(app);
    app.querySelectorAll('[data-products-sort]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.productsSort;
        if (state.productsSort !== key) {
          state.productsSort = key;
        }
        renderMainContent();
      });
    });
    app.querySelectorAll('[data-product-expand]').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.productExpand;
        state.expandedProductId = state.expandedProductId === productId ? null : productId;
        renderMainContent();
      });
    });
  }

  function renderChat() {
    const quickButtons = QUICK_QUESTIONS.map(q => `<button type="button" class="chip" data-chat-quick="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join('');
    app.innerHTML = `
      <div class="chat-page">
        <div class="chat-container">
          <div class="chat-header">
            <div>
              <h2>💬 Ask DermIQ</h2>
              <p>Ask about ingredients, concerns, products, or routines</p>
            </div>
            <div class="chat-status">
              <span class="status-dot"></span>
              <span>Expert System Online</span>
            </div>
          </div>
          <div class="chat-messages"></div>
          <div class="quick-questions">
            ${quickButtons}
          </div>
          <div class="chat-input-area">
            <div class="chat-input-wrapper">
              <input type="text" class="chat-input" placeholder="Ask about any skin concern, ingredient, or product..." />
              <button type="button" class="send-btn" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
            <p class="chat-disclaimer">
              DermIQ uses a structured rule-based system — not AI generation. Responses are deterministic and evidence-mapped.
            </p>
          </div>
        </div>
      </div>
    `;
    bindRouteButtons(app);
    setupChatInteractions();
  }

  function scrollChatToBottom(container) {
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }

  function parseInlineMarkdown(line) {
    const pattern = /(\*\*(.+?)\*\*)|(_(.+?)_)/g;
    let lastIndex = 0;
    const fragments = [];
    let match;
    while ((match = pattern.exec(line)) !== null) {
      if (match.index > lastIndex) {
        fragments.push(line.slice(lastIndex, match.index));
      }
      if (match[2]) {
        const bold = document.createElement('strong');
        bold.textContent = match[2];
        fragments.push(bold);
      } else if (match[4]) {
        const italic = document.createElement('em');
        italic.textContent = match[4];
        fragments.push(italic);
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
      fragments.push(line.slice(lastIndex));
    }
    if (fragments.length === 0) {
      fragments.push(line);
    }
    return fragments;
  }

  function createMarkdownLine(line) {
    const trimmed = line.trim();
    if (trimmed === '') {
      const spacer = document.createElement('div');
      spacer.className = 'chat-spacer';
      return spacer;
    }
    if (trimmed === '---') {
      return document.createElement('hr');
    }
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
      const content = trimmed.slice(2);
      const item = document.createElement('div');
      item.className = 'chat-list-item';
      parseInlineMarkdown(content).forEach(fragment => {
        if (typeof fragment === 'string') {
          item.appendChild(document.createTextNode(fragment));
        } else {
          item.appendChild(fragment);
        }
      });
      return item;
    }
    const numMatch = trimmed.match(/^(\d+)\.\s+/);
    if (numMatch) {
      const number = numMatch[1];
      const rest = trimmed.slice(numMatch[0].length);
      const item = document.createElement('div');
      item.className = 'chat-list-item numbered';
      const numSpan = document.createElement('span');
      numSpan.className = 'list-num';
      numSpan.textContent = `${number}.`;
      item.appendChild(numSpan);
      parseInlineMarkdown(rest).forEach(fragment => {
        if (typeof fragment === 'string') {
          item.appendChild(document.createTextNode(fragment));
        } else {
          item.appendChild(fragment);
        }
      });
      return item;
    }
    if (trimmed.startsWith('## ')) {
      const h2 = document.createElement('h2');
      h2.textContent = trimmed.slice(3);
      return h2;
    }
    if (trimmed.startsWith('### ')) {
      const h3 = document.createElement('h3');
      h3.textContent = trimmed.slice(4);
      return h3;
    }
    const paragraph = document.createElement('p');
    parseInlineMarkdown(trimmed).forEach(fragment => {
      if (typeof fragment === 'string') {
        paragraph.appendChild(document.createTextNode(fragment));
      } else {
        paragraph.appendChild(fragment);
      }
    });
    return paragraph;
  }

  function refreshChatMessages() {
    const container = app.querySelector('.chat-messages');
    const quickBox = app.querySelector('.quick-questions');
    if (!container) return;
    container.innerHTML = '';
    state.chat.messages.forEach(msg => {
      const messageWrapper = document.createElement('div');
      messageWrapper.className = `chat-message ${msg.role}`;
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      avatar.textContent = msg.role === 'user' ? '👤' : '🧬';
      const content = document.createElement('div');
      content.className = 'message-content';
      if (msg.role === 'user') {
        const paragraph = document.createElement('p');
        paragraph.textContent = msg.text;
        content.appendChild(paragraph);
      } else {
        const markdown = document.createElement('div');
        markdown.className = 'markdown-content';
        msg.text.split('\n').forEach(line => {
          markdown.appendChild(createMarkdownLine(line));
        });
        content.appendChild(markdown);
      }
      messageWrapper.appendChild(avatar);
      messageWrapper.appendChild(content);
      container.appendChild(messageWrapper);
    });
    if (state.chat.isTyping) {
      const typingWrapper = document.createElement('div');
      typingWrapper.className = 'chat-message assistant';
      const avatar = document.createElement('div');
      avatar.className = 'message-avatar';
      avatar.textContent = '🧬';
      const content = document.createElement('div');
      content.className = 'message-content';
      const indicator = document.createElement('div');
      indicator.className = 'typing-indicator';
      for (let i = 0; i < 3; i += 1) {
        const dot = document.createElement('span');
        dot.className = 'typing-dot';
        indicator.appendChild(dot);
      }
      content.appendChild(indicator);
      typingWrapper.appendChild(avatar);
      typingWrapper.appendChild(content);
      container.appendChild(typingWrapper);
    }
    if (quickBox) {
      quickBox.style.display = state.chat.messages.length <= 1 ? 'flex' : 'none';
    }
    scrollChatToBottom(container);
  }

  function addChatMessage(role, payload) {
    state.chat.messages.push({
      role,
      text: payload.text,
      type: payload.type,
      id: Date.now() + Math.random(),
    });
    refreshChatMessages();
  }

  function handleChatSend(prefill) {
    const inputEl = app.querySelector('.chat-input');
    const rawText = prefill || (inputEl ? inputEl.value : '');
    const text = (rawText || '').trim();
    if (!text) return;
    state.chat.messages.push({
      role: 'user',
      text,
      id: Date.now(),
    });
    state.chat.input = '';
    if (inputEl) {
      inputEl.value = '';
      inputEl.focus();
    }
    refreshChatMessages();
    const sendBtn = app.querySelector('.send-btn');
    if (sendBtn) sendBtn.disabled = true;
    if (state.chat.typingTimer) {
      clearTimeout(state.chat.typingTimer);
    }
    state.chat.isTyping = true;
    refreshChatMessages();
    state.chat.typingTimer = setTimeout(() => {
      const response = processMessage(text, state.profile);
      state.chat.isTyping = false;
      addChatMessage('assistant', response);
      const button = app.querySelector('.send-btn');
      if (button) {
        button.disabled = true;
      }
    }, 600 + Math.random() * 400);
  }

  function setupChatInteractions() {
    ensureChatGreeting();
    const quickBox = app.querySelector('.quick-questions');
    const input = app.querySelector('.chat-input');
    const sendBtn = app.querySelector('.send-btn');

    if (quickBox) {
      quickBox.querySelectorAll('[data-chat-quick]').forEach(btn => {
        btn.addEventListener('click', () => handleChatSend(btn.dataset.chatQuick));
      });
    }

    if (input) {
      input.value = state.chat.input;
      input.addEventListener('input', event => {
        state.chat.input = event.target.value;
        if (sendBtn) {
          sendBtn.disabled = !(event.target.value || '').trim();
        }
      });
      input.addEventListener('keydown', event => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          handleChatSend();
        }
      });
    }

    if (sendBtn) {
      sendBtn.disabled = !(state.chat.input || '').trim();
      sendBtn.addEventListener('click', handleChatSend);
    }
    refreshChatMessages();
  }

  function ensureChatGreeting() {
    if (state.chat.messages.length === 0) {
      addChatMessage('assistant', processMessage('hello', state.profile));
    }
  }

  const ROUTE_RENDERERS = {
    home: renderHome,
    profile: renderProfile,
    analysis: renderAnalysis,
    routine: renderRoutine,
    products: renderProducts,
    chat: renderChat,
  };

  function renderMainContent() {
    const renderer = ROUTE_RENDERERS[state.route] || renderHome;
    renderer();
    applyTextFixes(app);
  }

  function renderNavbar() {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.route === state.route);
    });
    if (!navbarProfile) return;
    if (state.profile.completed) {
      navbarProfile.innerHTML = `
        <div class="profile-indicator">
          <span class="profile-dot active"></span>
          <span class="profile-name">${escapeHtml(state.profile.name || 'User')}</span>
        </div>
      `;
    } else {
      navbarProfile.innerHTML = `<a href="#profile" class="btn btn-primary btn-sm" data-route-target="profile">Get Started</a>`;
    }
    bindRouteButtons(navbarProfile);
    applyTextFixes(document.querySelector('.navbar'));
  }

  function setupNavLinks() {
    navLinks.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        navigate(link.dataset.route);
      });
    });
  }

  function navigate(route, options = {}) {
    const target = isValidRoute(route) ? route : 'home';
    const previous = state.route;
    state.route = target;
    renderNavbar();
    renderMainContent();
    const hash = target === 'home' ? '' : `#${target}`;
    if (options.replace || previous !== target) {
      const method = options.replace ? 'replaceState' : 'pushState';
      history[method]({}, '', hash);
    }
  }

  function handlePopState() {
    const hash = window.location.hash.slice(1);
    const target = isValidRoute(hash) ? hash : 'home';
    state.route = target;
    renderNavbar();
    renderMainContent();
  }

  setupNavLinks();
  renderNavbar();
  renderMainContent();
  window.addEventListener('popstate', handlePopState);
})();
