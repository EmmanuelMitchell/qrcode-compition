// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function main() {
//   // Create initial shops
//   const shops = [
//     { id: 'bo-android', name: 'Bo', url: 'https://play.google.com/store/apps/details?id=com.orange.myorange.osl', platform: 'android' },
//     { id: 'kenema-android', name: 'Kenema', url: 'https://play.google.com/store/apps/details?id=com.orange.myorange.osl', platform: 'android' },
//     { id: 'hq-android', name: 'HQ', url: 'https://play.google.com/store/apps/details?id=com.orange.myorange.osl', platform: 'android' },
//     { id: 'lungi-android', name: 'Lungi', url: 'https://play.google.com/store/apps/details?id=com.orange.myorange.osl', platform: 'android' },
//     { id: 'waterloo-android', name: 'Waterloo', url: 'https://play.google.com/store/apps/details?id=com.orange.myorange.osl', platform: 'android' },
//     { id: 'wellington-android', name: 'Wellington', url: 'https://play.google.com/store/apps/details?id=com.orange.myorange.osl', platform: 'android' },
//     { id: 'kono-android', name: 'Kono', url: 'https://play.google.com/store/apps/details?id=com.orange.myorange.osl', platform: 'android' },
//     { id: 'makeni-android', name: 'Makeni', url: 'https://play.google.com/store/apps/details?id=com.orange.myorange.osl', platform: 'android' },
//     { id: 'flagship-android', name: 'Flagship', url: 'https://play.google.com/store/apps/details?id=com.orange.myorange.osl', platform: 'android' },
    
//     { id: 'bo-iphone', name: 'Bo', url: 'https://itunes.apple.com/fr/app/id6443607903', platform: 'iphone' },
//     { id: 'kenema-iphone', name: 'Kenema', url: 'https://itunes.apple.com/fr/app/id6443607903', platform: 'iphone' },
//     { id: 'hq-iphone', name: 'HQ', url: 'https://itunes.apple.com/fr/app/id6443607903', platform: 'iphone' },
//     { id: 'lungi-iphone', name: 'Lungi', url: 'https://itunes.apple.com/fr/app/id6443607903', platform: 'iphone' },
//     { id: 'waterloo-iphone', name: 'Waterloo', url: 'https://itunes.apple.com/fr/app/id6443607903', platform: 'iphone' },
//     { id: 'wellington-iphone', name: 'Wellington', url: 'https://itunes.apple.com/fr/app/id6443607903', platform: 'iphone' },
//     { id: 'kono-iphone', name: 'Kono', url: 'https://itunes.apple.com/fr/app/id6443607903', platform: 'iphone' },
//     { id: 'makeni-iphone', name: 'Makeni', url: 'https://itunes.apple.com/fr/app/id6443607903', platform: 'iphone' },
//     { id: 'flagship-iphone', name: 'Flagship', url: 'https://itunes.apple.com/fr/app/id6443607903', platform: 'iphone' },
//   ];

//   for (const shop of shops) {
//     await prisma.shop.upsert({
//       where: { id: shop.id },
//       update: shop,
//       create: shop
//     });
//   }

//   console.log('Seed completed');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });