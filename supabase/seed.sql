-- Prakriti Pops - Seed Data
-- Run this in your Supabase SQL Editor after running schema.sql

-- Products
INSERT INTO products (name_en, name_hi, slug, description_en, description_hi, price, compare_price, category, flavor, stock_qty, is_featured, is_active) VALUES
('Masala Makhana', 'मसाला मखाना', 'masala-makhana', 'The OG BOHOT HARDD flavour. Roasted makhana tossed in our secret masala blend that Mithila ki nanis have been perfecting for generations. Ek baar khao, baar baar khao!', 'OG BOHOT HARDD फ्लेवर। मिथिला की नानियों का सीक्रेट मसाला जो पीढ़ियों से परफेक्ट हो रहा है। एक बार खाओ, बार बार खाओ!', 199, 249, 'classic', 'Masala', 500, true, true),
('Chocolate Drizzle', 'चॉकलेट ड्रिज़ल', 'chocolate-drizzle', 'Makhana + Belgian chocolate = MATCH MADE IN HEAVEN 🔥. Crunchy makhana dipped in rich dark chocolate. Healthy snacks ka ye END GAME hai!', 'मखाना + बेल्जियन चॉकलेट = स्वर्ग में बनी जोड़ी 🔥। क्रंची मखाना डार्क चॉकलेट में डूबा हुआ। हेल्दी स्नैक्स का ये END GAME है!', 249, 299, 'classic', 'Chocolate', 300, true, true),
('Peri Peri Makhana', 'पेरी पेरी मखाना', 'periperi-makhana', 'Peri Peri lovers, ATTENTION! 🔴 Spicy, tangy, and absolutely ADDICTIVE. This one is for the brave souls who like it HOT. Served with a glass of doodh recommended 😂', 'पेरी पेरी लवर्स, ATTENTION! 🔴 तीखा, चटपटा और बिल्कुल ADDICTIVE। ये उन बहादुरों के लिए है जो इसे HOT पसंद करते हैं। एक गिलास दूध के साथ सर्व करें 😂', 219, 269, 'spicy', 'Peri Peri', 400, true, true),
('Salted Caramel Crunch', 'साल्टेड कारमेल क्रंच', 'salted-caramel-crunch', 'Sweet + Salty = PERFECTION. Caramel coated makhana with a hint of sea salt. It''s like your favorite dessert met your favorite snack and fell in LOVE! 🧡', 'मीठा + नमकीन = PERFECTION। कारमेल कोटेड मखाना समुद्री नमक के साथ। जैसे आपकी पसंदीदा मिठाई मिली आपके पसंदीदा स्नैक से और हो गया PYAAR! 🧡', 229, 279, 'classic', 'Caramel', 250, true, true),
('Garlic Butter Blast', 'गार्लिक बटर ब्लास्ट', 'garlic-butter-blast', 'Garlic naan ke saath jo maza aata hai, wohi maza ab makhana mein! Butter roasted with fresh garlic and herbs. It''s not just a snack, it''s an EMOTION. 🧄', 'गार्लिक नान के साथ जो मज़ा आता है, वही मज़ा अब मखाना में! बटर रोस्टेड फ्रेश गार्लिक और हर्ब्स के साथ। ये सिर्फ स्नैक नहीं, एक EMOJAN है। 🧄', 209, 259, 'savory', 'Garlic Butter', 350, false, true),
('Mango Tango', 'मैंगो टैंगो', 'mango-tango', 'Aam ki baat hi kuch aur hai! Alphonso mango coated makhana that tastes like summer in every bite. BOHOT HARDD level ka MAZA! 🥭', 'आम की बात ही कुछ और है! अल्फांसो मैंगो कोटेड मखाना हर कौर में गर्मी का स्वाद। BOHOT HARDD लेवल का MAZA! 🥭', 239, 289, 'seasonal', 'Mango', 150, false, true),
('Cheese Burst', 'चीज़ बर्स्ट', 'cheese-burst', 'Cheese lovers, YE RAHA TUMHARA HERO! 🧀 Cheddar cheese powder coating on crunchy makhana. Protein rich, cheese rich, SWAG rich. Simply CHEESE PLEASE!', 'चीज़ लवर्स, ये रहा तुम्हारा HERO! 🧀 चेडर चीज़ पाउडर कोटिंग क्रंची मखाना पर। प्रोटीन रिच, चीज़ रिच, SWAG रिच। Simply CHEESE PLEASE!', 229, 269, 'savory', 'Cheese', 200, false, true),
('Classic Roasted', 'क्लासिक रोस्टेड', 'classic-roasted', 'Zero drama, 100% SWAG. Just pure roasted makhana with a pinch of black salt. For the minimalists who believe less is MORE. Nani ke haath ka swaad! 🧡', 'ज़ीरो ड्रामा, 100% SWAG। बस शुद्ध रोस्टेड मखाना एक चुटकी काला नमक के साथ। उन मिनिमलिस्ट्स के लिए जो मानते हैं कम में MORE है। नानी के हाथ का स्वाद! 🧡', 179, 219, 'classic', 'Classic', 600, false, true),
('Honey Chilli', 'हनी चिल्ली', 'honey-chilli', 'Sweet honey meets spicy chilli — the ULTIMATE power couple! Glazed to perfection, this one is dangerously addictive. Warning: Ek packet kabhi kaafi nahi! 🍯🌶️', 'मीठा हनी मीट करता है तीखा चिल्ली — अल्टीमेट पावर कपल! परफेक्ट ग्लेज़्ड, ये खतरनाक रूप से ADDICTIVE है। चेतावनी: एक पैकेट कभी काफी नहीं! 🍯🌶️', 219, 259, 'spicy', 'Honey Chilli', 300, true, true),
('Coconut Bliss', 'कोकोनट ब्लिस', 'coconut-bliss', 'Tropical vibes only! 🌴 Coconut roasted makhana that''ll transport you straight to the beaches of Goa. Crunchy, creamy, and absolutely BLISSful. Pura VIBE hai!', 'सिर्फ ट्रॉपिकल VIBES! 🌴 कोकोनट रोस्टेड मखाना जो आपको सीधा गोवा के बीच पर ले जाएगा। क्रंची, क्रीमी और बिल्कुल BLISSful। पूरा VIBE है!', 209, 259, 'classic', 'Coconut', 180, false, true),
('Tandoori Makhana', 'तंदूरी मखाना', 'tandoori-makhana', 'Tandoori chicken ka swaad, but make it VEGAN! 🌿 Smoky tandoori spices on roasted makhana. Fire, flavour, and full on DESI VIBES. Dilli ki chaat wali energy!', 'तंदूरी चिकन का स्वाद, बट मेक इट VEGAN! 🌿 स्मोकी तंदूरी मसाले रोस्टेड मखाना पर। आग, फ्लेवर और पूरे DESI VIBES। दिल्ली की चाट वाली एनर्जी!', 229, 279, 'spicy', 'Tandoori', 220, false, true),
('Matcha Magic', 'मटका मैजिक', 'matcha-magic', 'Japanese matcha + Bihari makhana = GLOBAL CRUNCH 🌏🇯🇵🇮🇳. Premium green tea dusted on crunchy lotus seeds. For the aesthetic girlies and boyies. Aesthetic ke saath taste bhi!', 'जापानी मटका + बिहारी मखाना = ग्लोबल CRUNCH 🌏🇯🇵🇮🇳। प्रीमियम ग्रीन टी डस्टेड क्रंची मखाना पर। एस्थेटिक girlies और boyies के लिए। एस्थेटिक के साथ टेस्ट भी!', 259, 309, 'seasonal', 'Matcha', 100, false, true);

-- Announcements
INSERT INTO announcements (text_en, text_hi, is_active, bg_color, text_color) VALUES
('🎉 Free delivery on orders above ₹499! Use code MAKHANA20 for 20% off', '🎉 ₹499 से ऊपर के ऑर्डर पर फ्री डिलीवरी! कोड MAKHANA20 से 20% छूट', true, '#1B5E20', '#ffffff'),
('🚚 New flavour dropping soon! Stay tuned for COCONUT BLISS', '🚚 नया फ्लेवर जल्द आ रहा है! COCONUT BLISS के लिए तैयार रहें', true, '#D4A853', '#000000');

-- Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_cart_value, max_uses, is_active) VALUES
('MAKHANA20', 'percentage', 20, 299, 100, true),
('BOHOT10', 'percentage', 10, 199, 200, true),
('FIRST50', 'fixed', 50, 399, 50, true),
('WELCOME20', 'percentage', 20, 0, 500, true);

-- Admin user (password will be set via Supabase Auth UI)
INSERT INTO admin_users (email, name, role) VALUES
('admin@prakritipops.com', 'Prakriti Admin', 'superadmin');
