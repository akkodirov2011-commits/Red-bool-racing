/* ============================================================
   RED BULL ENERGY — ma'lumotlar
   Narxlarni yoki tovarni o'zgartirish uchun shu faylni tahrirlang.
   ============================================================ */

const CATS = [
  { id:'all',     name:'Всё'            },
  { id:'drinks',  name:'Напитки'        },
  { id:'apparel', name:'Одежда'         },
  { id:'gear',    name:'Аксессуары'     },
  { id:'collect', name:'Коллекционное'  }
];

const PRODUCTS = [
  /* ---------- Напитки ---------- */
  { id:'d1',  cat:'drinks', name:'Original',        price:20900, img:'./img/redbul 7.jpg',  vol:'250мл' },
  { id:'d2',  cat:'drinks', name:'Blue Edition',    price:22800, img:'./img/redbul 2.jpg',  vol:'250 мл' },
  { id:'d3',  cat:'drinks', name:'Winter Edition',  price:21600, img:'./img/redbul 3.webp', vol:'250 мл' },
  { id:'d4',  cat:'drinks', name:'Spring Edition',  price:22800, img:'./img/redbul 4.jpg',  vol:'250 мл' },
  { id:'d5',  cat:'drinks', name:'Winter Edition',  price:22800, img:'./img/redbul 5.jpg',  vol:'355 мл' },
  { id:'d6',  cat:'drinks', name:'Winter Edition',  price:22800, img:'./img/redbul 6.jpg',  vol:'473 мл' },
  { id:'d7',  cat:'drinks', name:'Zero',            price:20900, img:'./img/zero.webp',     tag:'new', vol:'250 мл' },
  { id:'d8',  cat:'drinks', name:'Purple Edition',  price:22800, img:'./img/redbul 8.webp', vol:'250 мл' },
  { id:'d9',  cat:'drinks', name:'Green Edition',   price:20900, img:'./img/redbul.jpg',    vol:'250 мл' },
  { id:'d10', cat:'drinks', name:'Summer Edition',  price:21600, img:'./img/redbul 9.jpg',  vol:'250 мл' },
  { id:'d11', cat:'drinks', name:'Summer Edition',  price:20900, img:'./img/redbul 10.jpg', vol:'355 мл' },
  { id:'d12', cat:'drinks', name:'Sea Blue Edition',price:21600, img:'./img/redbul 11.webp',vol:'250 мл' },

  /* ---------- Одежда ---------- */
  { id:'a1', cat:'apparel', name:'Red Bull Ring Paddock Sweater',            price:678000, img:'./img/sweter.webp' },
  { id:'a2', cat:'apparel', name:'Red Bull BORA-hansgrohe Italy T-Shirt',    price:435000, img:'./img/bora.webp' },
  { id:'a3', cat:'apparel', name:'Red Bull Ring Boost T-Shirt',              price:511000, img:'./img/Ring.webp' },
  { id:'a4', cat:'apparel', name:'Red Bull BC One Freeze Jersey',            price:588000, img:'./img/One.webp' },
  { id:'a5', cat:'apparel', name:'Oracle Red Bull Racing × Crocs Crocband Clog', price:484000, img:'./img/crocs.webp' },
  { id:'a6', cat:'apparel', name:'Max Verstappen Hoodie',                        price:756000, img:'./img/Max-Verstappen-Hoodie.avif', tag:'hit' },

  /* ---------- Аксессуары ---------- */
  { id:'g1', cat:'gear', name:'Red Bull Glasses — набор из 2',               price:269000, img:'./img/glasses.webp' },
  { id:'g2', cat:'gear', name:'Red Bull Ring Paddock Backpack',              price:895000, img:'./img/backpacj.webp', tag:'hit' },
  { id:'g3', cat:'gear', name:'Red Bull Ring Paddock Wash Bag',              price:447000, img:'./img/paddock 2.webp' },
  { id:'g4', cat:'gear', name:'Red Bull Ring Core Wallet',                   price:293000, img:'./img/core.webp' },
  { id:'g5', cat:'gear', name:'Red Bull Ring Paddock Bag',                   price:537000, img:'./img/paddock.webp' },
  { id:'g6', cat:'gear', name:'Red Bull SPECT DUNDEE-010 Sunglasses',        price:434000, img:'./img/Sunglasses.webp' },
  { id:'g7', cat:'gear', name:'Red Bull Ring Adrenaline Mug',                price:184000, img:'./img/Crushka.webp' },
  { id:'g8', cat:'gear', name:'Red Bull Racing Adrenaline Logo Bum Bag',     price:255000, img:'./img/Logo-Bum-Bag.avif' },
  { id:'g9',cat:'gear', name:'Red Bull KTM Racing Team Grid Water Bottle',  price:228000, img:'./img/KTM25043_13_1.webp' },
  { id:'g10',cat:'gear', name:'Red Bull BORA-hansgrohe Remco Drinking Bottle',price:178000,img:'./img/M-RBB264028_UU01_1.webp' },
  { id:'g11',cat:'gear', name:'Oracle Red Bull Racing Logo Notebook',        price:113000, img:'./img/Notebook.webp' },
  { id:'g12',cat:'gear', name:'Oracle Red Bull Racing × Crocs Jibbitz 5-Pack',price:89000, img:'./img/Oracle.webp' },
  { id:'g13',cat:'gear', name:'Oracle Red Bull Racing Powerstation Plus Las Vegas', price:434000, img:'./img/Oracle-Red-Bull-Racing-Powerstation-Plus-Las-Vegas-Limited-Edition.avif', tag:'lim' },
  { id:'g14',cat:'gear', name:'Red Bull Racing Logo Umbrella',              price:485000, img:'./img/Logo-Umbrella.avif' },

  /* ---------- Коллекционное ---------- */
  { id:'c1', cat:'collect', name:'TFB Alpha Jet Magnet',                          price:115000,  img:'./img/Jet-Magnet.avif' },
  { id:'c2', cat:'collect', name:'1:12 Red Bull Racing RB21 Verstappen Japan GP 2025', price:471000, img:'./img/Verstappen-Japan-GP-2025.avif' },
  { id:'c3', cat:'collect', name:'Funko POP! Rides Max Verstappen с RB20',        price:307000, img:'./img/Max-Verstappen-with-RB20.avif' },
  { id:'c4', cat:'collect', name:'1:2 Max Verstappen Brazil GP 2025 Mini Helmet', price:1126000, img:'./img/1-2-Max-Verstappen-Brazil-GP-2025-Mini-Helmet.avif', tag:'lim' },
  { id:'c5', cat:'collect', name:'Red Bull Racing Austrian GP 2025 Puzzle',       price:140000, img:'./img/Oracle-Red-Bull-Racing-Verstappen-Speed-Precision-2025-Puzzle.avif' },
  { id:'c6', cat:'collect', name:'Oracle Red Bull Racing 2026 Fan Calendar',      price:127000, img:'./img/Oracle-Red-Bull-Racing-2026-Fan-Calendar.avif', tag:'new' },
  { id:'c7', cat:'collect', name:'MINIX Max Verstappen World Champion Figurine', price:295000, img:'./img/MINIX-Max-Verstappen-World-Champion-Figurine.avif', tag:'hit' },
  { id:'c8', cat:'collect', name:'Funko POP! Rides Super Deluxe Max Verstappen', price:420000, img:'./img/Funko-POP-Rides-Super-Deluxe-Max-Verstappen.avif', tag:'new' }
];

const MARQUEE = ['Red Bull окрыляет','Formula 1','BC One','Cliff Diving','Air Race','Rampage','Wings for Life','Soapbox Race','X-Fighters','Crashed Ice'];
const CAT_NAME = Object.fromEntries(CATS.map(c => [c.id, c.name]));
const FREE_FROM = 640000, SHIP_COST = 63000;
