
export interface CategoryItem {
  id: number;  
  name: string;
  categoryId: string;
}

export interface CategoryData {
  [key: string]: CategoryItem[];
}

export const categoryData: CategoryData = {

  // 🥦 VEGETABLES
  vegetables: [
    { id: 1, name: "Potato", categoryId: "potato" },
    { id: 2, name: "Tomato", categoryId: "tomato" },
    { id: 3, name: "Onion", categoryId: "onion" },
    { id: 4, name: "Cauliflower", categoryId: "cauliflower" },
    { id: 5, name: "Spinach", categoryId: "spinach" },
    { id: 6, name: "Cabbage", categoryId: "cabbage" },
    { id: 7, name: "Carrot", categoryId: "carrot" },
    { id: 8, name: "Brinjal", categoryId: "brinjal" }, // ❌ remove (Eggplant)
    { id: 9, name: "Bitter Gourd", categoryId: "bitter_gourd" },
    { id: 10, name: "Bottle Gourd", categoryId: "bottle_gourd" },
    { id: 11, name: "Lady Finger", categoryId: "okra" }, // ✅ match title
    { id: 12, name: "Green Peas", categoryId: "green_peas" },
    { id: 13, name: "Capsicum", categoryId: "capsicum" },
    { id: 14, name: "Pumpkin", categoryId: "pumpkin" },
    { id: 15, name: "Radish", categoryId: "radish" },
    { id: 16, name: "Cucumber", categoryId: "cucumber" },
    { id: 17, name: "Garlic", categoryId: "garlic" },
    { id: 18, name: "Ginger", categoryId: "ginger" },
    { id: 19, name: "Green Chilli", categoryId: "green_chilli" },
  ],

  // 🍎 FRUITS
  fruits: [
    { id: 1, name: "Mango", categoryId: "mango" },
    { id: 2, name: "Banana", categoryId: "banana" },
    { id: 3, name: "Apple", categoryId: "apple" },
    { id: 4, name: "Grapes", categoryId: "grapes" },
    { id: 5, name: "Watermelon", categoryId: "watermelon" },
    { id: 6, name: "Papaya", categoryId: "papaya" },
    { id: 7, name: "Guava", categoryId: "guava" },
    { id: 8, name: "Pomegranate", categoryId: "pomegranate" },
    { id: 9, name: "Orange", categoryId: "orange" },
    { id: 10, name: "Lemon", categoryId: "lemon" },
    { id: 11, name: "Pineapple", categoryId: "pineapple" },
    { id: 12, name: "Coconut", categoryId: "coconut" },
    { id: 13, name: "Strawberry", categoryId: "strawberry" },
    { id: 14, name: "Kiwi", categoryId: "kiwi" },
    { id: 15, name: "Chikoo", categoryId: "chikoo" },
  ],

  // 🌾 GRAINS & CEREALS
  grains_cereals: [
    { id: 1, name: "Rice", categoryId: "rice" },
    { id: 2, name: "Wheat", categoryId: "wheat" },
    { id: 3, name: "Maize", categoryId: "maize" },
    { id: 4, name: "Barley", categoryId: "barley" },
    { id: 5, name: "Millet (Bajra)", categoryId: "bajra" },
    { id: 6, name: "Sorghum (Jowar)", categoryId: "jowar" },
    { id: 7, name: "Finger Millet (Ragi)", categoryId: "ragi" },
    { id: 8, name: "Oats", categoryId: "oats" },
    { id: 9, name: "Foxtail Millet (Kangni)", categoryId: "kangni" },
    { id: 10, name: "Buckwheat (Kuttu)", categoryId: "kuttu" },
  ],


  pulses_lentils: [
    { id: 1, name: "Chickpeas", categoryId: "chickpeas" },
    { id: 2, name: "Black Gram", categoryId: "urad_dal" },
    { id: 3, name: "Green Gram", categoryId: "moong_dal" },
    { id: 4, name: "Red Lentils", categoryId: "masoor_dal" },
    { id: 5, name: "Pigeon Pea", categoryId: "toor_dal" },
    { id: 6, name: "Kidney Beans", categoryId: "rajma" },
    { id: 7, name: "Black-Eyed Peas", categoryId: "lobia" },
    { id: 8, name: "Peas", categoryId: "matar" },
    { id: 9, name: "Moth Beans", categoryId: "moth_dal" },
    { id: 10, name: "Horse Gram", categoryId: "kulthi" },
  ],
};