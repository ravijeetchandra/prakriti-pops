-- Campaign Seed Data
-- Run this in Supabase SQL Editor (after seed.sql)

-- Campaign 1: Monsoon Mania – 25% off on all spicy flavors
INSERT INTO campaigns (title_en, title_hi, description_en, description_hi, discount_percent, discount_type, start_time, end_time, is_active)
VALUES (
  'Monsoon Mania 🌧️',
  'मानसून मैनिया 🌧️',
  'Barsaat ka maza with spicy makhana! 25% off on all our spicy flavors.',
  'बारिश का मज़ा स्पाइसी मखाना के साथ! सभी स्पाइसी फ्लेवर्स पर 25% छूट।',
  25,
  'percentage',
  NOW() - INTERVAL '1 day',
  NOW() + INTERVAL '14 days',
  true
);

-- Associate spicy products (Peri Peri, Honey Chilli, Tandoori)
INSERT INTO campaign_products (campaign_id, product_id)
SELECT c.id, p.id
FROM campaigns c, products p
WHERE c.title_en = 'Monsoon Mania 🌧️'
  AND p.slug IN ('periperi-makhana', 'honey-chilli', 'tandoori-makhana');


-- Campaign 2: Healthy Snack Week – 15% off on classic roasted & masala
INSERT INTO campaigns (title_en, title_hi, description_en, description_hi, discount_percent, discount_type, start_time, end_time, is_active)
VALUES (
  'Healthy Snack Week 🥗',
  'हेल्दी स्नैक वीक 🥗',
  'Apne healthy snacking goal achieve karo with 15% off on our OG classics!',
  'अपने हेल्दी स्नैकिंग गोल को हासिल करो 15% छूट के साथ हमारे OG क्लासिक्स पर!',
  15,
  'percentage',
  NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '5 days',
  true
);

INSERT INTO campaign_products (campaign_id, product_id)
SELECT c.id, p.id
FROM campaigns c, products p
WHERE c.title_en = 'Healthy Snack Week 🥗'
  AND p.slug IN ('masala-makhana', 'classic-roasted');


-- Campaign 3: Weekend Special – BOGO-style: 30% off on premium flavors (only Sat-Sun)
INSERT INTO campaigns (title_en, title_hi, description_en, description_hi, discount_percent, discount_type, start_time, end_time, is_active)
VALUES (
  'Weekend Special 🎉',
  'वीकेंड स्पेशल 🎉',
  'Weekend hai to premium flavors pe 30% OFF! Chocolate Drizzle, Mango Tango aur Matcha Magic pe. Kya wait kar rahe ho?',
  'वीकेंड है तो प्रीमियम फ्लेवर्स पर 30% OFF! चॉकलेट ड्रिज़ल, मैंगो टैंगो और मटका मैजिक पर। क्या वेट कर रहे हो?',
  30,
  'percentage',
  NOW() - INTERVAL '12 hours',
  NOW() + INTERVAL '2 days',
  true
);

INSERT INTO campaign_products (campaign_id, product_id)
SELECT c.id, p.id
FROM campaigns c, products p
WHERE c.title_en = 'Weekend Special 🎉'
  AND p.slug IN ('chocolate-drizzle', 'mango-tango', 'matcha-magic');


-- Campaign 4: New Launch Offer – 20% off Coconut Bliss (for next 30 days)
INSERT INTO campaigns (title_en, title_hi, description_en, description_hi, discount_percent, discount_type, start_time, end_time, is_active)
VALUES (
  'New Launch: Coconut Bliss 🥥',
  'नया लॉन्च: कोकोनट ब्लिस 🥥',
  'Humara brand new Coconut Bliss flavor ab available hai! Launch offer pe 20% off. Jaldi karo!',
  'हमारा बिल्कुल नया कोकोनट ब्लिस फ्लेवर अब उपलब्ध है! लॉन्च ऑफर पर 20% छूट। जल्दी करो!',
  20,
  'percentage',
  NOW() - INTERVAL '5 days',
  NOW() + INTERVAL '25 days',
  true
);

INSERT INTO campaign_products (campaign_id, product_id)
SELECT c.id, p.id
FROM campaigns c, products p
WHERE c.title_en = 'New Launch: Coconut Bliss 🥥'
  AND p.slug = 'coconut-bliss';

EOF
