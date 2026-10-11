# Metrocart: Logo & Products

This file is the **master list** for the website's logo and product catalogue. Edit it or add photos, then ask Claude to *sync the website* (or run `python .claude/tools/sync_products.py`).

## Photo filenames

Name every photo **`Product name x pieces per carton`** and put it in `assets/img/products/FROZEN`, `DATES` or `AMBIENT`:

| Photo filename | Shown on the website |
| --- | --- |
| `Faani Frz. Grated Coconut 400g x 18.jpg` | **Faani Frz. Grated Coconut 400g** · 18 per carton |
| `Ajwa Dates 300g x 24.png` | **Ajwa Dates 300g** · 24 per carton |

Any size and any of JPG / PNG works; the sync turns each photo into a white 800×800 JPG and keeps your filename. For a product **with a photo (✅), the filename decides its name and pieces**: to change them, rename the photo. A photo of a product that isn't in the tables yet adds it to the category of the folder it is in.

## How to edit

| To… | Do this |
| --- | --- |
| **Add a product** | Add its photo (named as above), or add a row to the right category table (copy an existing row). |
| **Remove a product** | Delete its row, and its photo if it has one. |
| **Change a name or pieces** | No photo (—): edit the cell. With a photo (✅): rename the photo. *Pieces per carton* must be a whole number. |
| **Feature on the homepage** | Put `★` in *Featured*. The homepage shows 6 starred products (ones with a photo first); every starred product appears in the *Popular* tab. |
| **Move to another category** | Cut the row and paste it into the other table. |
| **Change the logo** | Replace the URL in the Logo table. |

Keep each row on one line and don't use the `|` character inside a cell. The **Photo** column, the counts and the summary are filled in automatically, so there's no need to edit them.

## Logo

| Setting | Value |
| --- | --- |
| Logo image URL | https://www.image2url.com/r2/default/images/1781904808985-1db7f06d-0a38-439e-b981-e51f22598970.png |

## Summary

| Category | Products | Photos added |
| --- | :---: | :---: |
| Frozen | 40 | 39 |
| Dates | 6 | 6 |
| Ambient | 56 | 55 |
| **Total** | **102** | **100** |

## Frozen (40)

| Product name | Pieces per carton | Featured | Photo |
| --- | :---: | :---: | :---: |
| Faani Frz. Grated Coconut 400g | 18 | ★ | ✅ |
| Faani Frz. Grated Coconut 1kg | 12 | ★ | ✅ |
| Faani Frz tapioca slice 700g | 20 |  | ✅ |
| Faani Tapioca Slice 2.5kg | 6 |  | ✅ |
| Faani Frz tapioca whole 700g | 20 |  | — |
| Faani Froz Jackfruit Ripe 300g | 12 |  | ✅ |
| Faani Frozen Tender Mango 250g | 24 |  | ✅ |
| Faani Frozen Tender mango 500g | 24 |  | ✅ |
| Fni Frz Jackfruit Seed Slice 250g | 24 |  | ✅ |
| Faani Chilli Parotta 350g | 24 |  | ✅ |
| Faani Malabar restaurant Parotta 1.5Kg | 4 | ★ | ✅ |
| Faani Aloo Parotta 350g | 24 |  | ✅ |
| Faani Puttu White 350g | 12 |  | ✅ |
| Faani Puttu Brown 350g | 12 |  | ✅ |
| Faani Idiyappam White 350g | 12 |  | ✅ |
| Faani Idiyappam Brown 350g | 12 |  | ✅ |
| Faani Vellayappam 350g | 12 |  | ✅ |
| Faani Masala Dosa 350g | 12 |  | ✅ |
| Faani Idli Sambar 350g | 12 |  | ✅ |
| Fni Vegetable Mini Samosa 1Kg (ready to fry) | 5 |  | ✅ |
| Fni Vegetable Mini Samosa 350g (ready to fry) | 12 |  | ✅ |
| Fni Vegetable Spring Roll 1Kg (ready to fry) | 5 |  | ✅ |
| Faani Sukian 350g | 12 |  | ✅ |
| Faani Vattayappam 350g | 12 |  | ✅ |
| Faani Banana Roast 350g | 12 |  | ✅ |
| Faani Unniappam 350g | 12 |  | ✅ |
| Faani Neyyappam 350g | 12 |  | ✅ |
| Faani Parippuvada 350g | 12 |  | ✅ |
| Faani Elayada 350g | 12 |  | ✅ |
| Faani Breaded Veg. Cutlet 350g | 12 |  | ✅ |
| Faani Idiyappam White 1KG | 4 |  | ✅ |
| Faani Paruppu vada 1Kg | 5 |  | ✅ |
| FAANI Banana Fry 1 Kg | 5 |  | ✅ |
| FAANI Unnakai 1kg | 5 |  | ✅ |
| TrueFroot F.Blend Tender Coconut 1L | 12 |  | ✅ |
| TrueFroot F.Blend Chikku 1L | 12 |  | ✅ |
| TrueFroot F.Blend Mango 1L | 12 |  | ✅ |
| TrueFroot F.Blend PassionFrut 1L | 12 |  | ✅ |
| TrueFroot F.Blend Guava 1L | 12 |  | ✅ |
| TrueFroot F.Blend Shamam 1L | 12 |  | ✅ |

## Dates (6)

| Product name | Pieces per carton | Featured | Photo |
| --- | :---: | :---: | :---: |
| Ajwa Dates 300g | 24 | ★ | ✅ |
| Mabroom Dates 300g | 24 | ★ | ✅ |
| Medjool Dates 450g | 10 |  | ✅ |
| Medjool Dates 900g | 8 |  | ✅ |
| Suquei Dates 400g | 10 |  | ✅ |
| Safawi Dates 450g | 10 |  | ✅ |

## Ambient (56)

| Product name | Pieces per carton | Featured | Photo |
| --- | :---: | :---: | :---: |
| Aahaa Bhakharwadi 200g | 25 | ★ | ✅ |
| Aahaa Bhujia Munchy Masti 200g | 25 | ★ | ✅ |
| Aahaa Bikaner Bujiya 200g | 25 |  | ✅ |
| Aahaa Farali Chiwda 200g | 25 |  | ✅ |
| Aahaa Masala Boondi 200g | 25 |  | ✅ |
| Aahaa Salted Moong Dal 200g | 25 |  | ✅ |
| Faani Andhra Mixture 200g | 24 |  | ✅ |
| Faani Banana Chips 200g | 24 | ★ | ✅ |
| Faani Banana Chips Pepper 200g | 24 |  | ✅ |
| Faani Banana Chips Ripen.200g | 24 |  | ✅ |
| Faani Banana Chips Spicy 200g | 24 |  | ✅ |
| Faani BananaChips Fourcut 200g | 24 |  | ✅ |
| Faani BananaChips Jaggery 200g | 24 |  | ✅ |
| Faani Gingelly Oil 1L | 12 |  | ✅ |
| Faani Ginger Sarbath 500ml | 20 |  | ✅ |
| Faani Grape Sarbath 500ml | 20 |  | ✅ |
| Faani Jackfruit Chips 200g | 24 |  | ✅ |
| Faani Jaggery Cubes 1kg | 10 |  | ✅ |
| Faani Kerala Mixture 200g | 24 |  | ✅ |
| Faani Kerala Mixture Spicy 200g | 24 |  | ✅ |
| Faani Kudampuli 200g | 50 |  | ✅ |
| Faani Madras Mixture 200g | 24 |  | ✅ |
| Faani Masala Peanut 200g | 24 |  | ✅ |
| Faani Murukku Long 200g | 24 |  | ✅ |
| Faani Murukku Round 200g | 24 |  | ✅ |
| Faani Nannari Sarbath 500ml | 20 |  | ✅ |
| Faani Nutmeg Sarbath 500ml | 20 |  | ✅ |
| Faani Palada Payasam Mix 200g | 50 |  | ✅ |
| Faani Pasionfrut Sarbath 500ml | 20 |  | ✅ |
| Faani Rice Flakes-Aval 500gm | 20 |  | ✅ |
| Faani Roasted Vermicelli 180g | 20 |  | ✅ |
| Faani Semiya Payasam Mix 200g | 50 |  | ✅ |
| Faani Sweet Mixture 200g | 24 |  | ✅ |
| Faani Tamarind Seedless 200g | 50 |  | ✅ |
| Faani Tapioca Chips 100g | 24 |  | ✅ |
| Faani Tapioca Chips Spicy 100g | 24 |  | ✅ |
| Faani Tapioca Sticks 200g | 24 |  | ✅ |
| Faani Tapioca Sticks Spicy200g | 24 |  | ✅ |
| Faash Coconut Oil 1L | 12 |  | ✅ |
| Faash Coconut Oil 2L | 8 |  | ✅ |
| Fani Rice Palada Paysm Mix 200g | 50 |  | ✅ |
| Fira Dosa Powder 1kg | 10 |  | ✅ |
| Fira Goosbry BE.Chili Syrp 500ml | 12 |  | ✅ |
| Fira Idiyapam Powder White 1kg | 10 |  | ✅ |
| Fira Idly Powder 1kg | 10 |  | ✅ |
| Fira Knthri.Mango Chamanti 400g | 12 |  | ✅ |
| Fira Paalappam Powder 1kg | 10 |  | ✅ |
| Fira Rice Powder 1kg | 10 |  | — |
| Fira Steamed RicePuttu Powder 1Kg | 10 |  | ✅ |
| Fira Synthetic Vinegar 500ml | 24 |  | ✅ |
| Tholur Garlic Pickle 300g | 12 |  | ✅ |
| Tholur Ginger Garlic Paste 300g | 12 |  | ✅ |
| Tholur Lime Pickle 300g | 12 |  | ✅ |
| Tholur Mango Pickle 300g | 12 |  | ✅ |
| Tholur Mix Veg Pickle 300g | 12 |  | ✅ |
| Tholur Tender Mango Pickle 300g | 12 |  | ✅ |

## Notes

_Add your own notes here; this section is kept as-is when syncing._
