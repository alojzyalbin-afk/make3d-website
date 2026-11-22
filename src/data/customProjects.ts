export interface CustomProject {
  slug: string;
  title: string;
  short: string;
  paragraphs: string[];
  keywords: string;
  alt: string;
  images: string[];
}

const set = (slug: string, n: number, video?: number) =>
  Array.from({ length: n }, (_, i) => {
    const k = String(i + 1).padStart(2, '0');
    return video === i + 1 ? `/images/${slug}-${k}.mp4` : `/images/${slug}-${k}.jpg`;
  });

export const customProjects: CustomProject[] = [
  {
    slug: 'explorer-compass-locket',
    title: 'Cartoon-style explorer compass locket',
    short: 'Gold and turquoise star compass that opens to a hidden constellation',
    paragraphs: [
      'A round gold and turquoise star compass locket that opens to reveal a hidden constellation, with a name engraved on the back. I made it as a custom 3D printed prop in the style of a cartoon adventure gadget, built to be worn on a chain.',
      'Props like this work for cosplay, kids dress-up, adventure play, themed birthday parties, school plays and gifts for fans of a favourite show. If you have a cartoon, game or story prop in mind, send me a picture and I will design and print my own version, with moving parts, engraved names and your choice of colours.',
    ],
    keywords: 'custom 3D printed prop, cosplay prop, compass locket, star amulet, personalised pendant, adventure toy, themed party gift, Dublin',
    alt: 'Custom 3D printed gold and turquoise star compass locket prop with a hidden constellation',
    images: set('custom-explorer-star-locket', 6),
  },
  {
    slug: 'pint-glass-purse',
    title: 'Pint glass purses for decorating',
    short: 'Two hinged pint-glass shaped hard-shell purses with a magnetic lid',
    paragraphs: [
      'Two matte black pint-glass shaped purses, each with a hinged lid, hidden magnets to hold it shut and small loops for a chain. They were printed as blank shells so the owner could decorate them with rhinestones and turn them into chic novelty handbags.',
      'The hinge is printed in place, with no screws or glue, and the lid is hollow to keep the purse light. This is the kind of custom 3D printing I enjoy: a novelty clutch, a hen party accessory, a gift bag or a prop for a costume, designed from scratch around the size you need. Watch the short video to see the lid open and close.',
    ],
    keywords: 'pint glass purse, novelty handbag, rhinestone craft blank, hinged box, hen party accessory, custom 3D printed bag, magnetic lid, Dublin',
    alt: 'Two black 3D printed pint-glass shaped purses with hinged lids',
    images: set('custom-pint-glass-purse', 3, 3),
  },
  {
    slug: 'diorama-scale-model',
    title: 'Diorama-style scale model of a building',
    short: 'A miniature shed built from photos as a birthday gift',
    paragraphs: [
      'A miniature scale model of a real shed, designed from photos and measurements and 3D printed in colour as a birthday present. It is a diorama, an architectural miniature and a keepsake in one, small enough for a desk or a shelf.',
      'Any house, shed, shop, pub, garage or workshop can become a desk-sized model. Send me photos from a few angles and roughly how big you want it. Scale models make memorable gifts for housewarmings, retirements, new businesses and anyone who loves a particular building, and they also work as display pieces for model makers and small shops.',
    ],
    keywords: 'custom scale model, diorama, architectural miniature, 3D printed house model, building replica, personalised keepsake, birthday gift, Dublin',
    alt: 'Custom 3D printed diorama-style miniature scale model of a shed',
    images: set('custom-shed-diorama', 6),
  },
  {
    slug: 'snowman-character-keyring',
    title: 'Snowman character keyring with a name',
    short: 'A multi-colour snowman keyring with a name on the scarf',
    paragraphs: [
      'A small snowman character keyring in four colours, about 4 to 5 cm tall, with a name printed on the scarf. I made it as a personalised Christmas gift for a child.',
      'Cartoon characters, pets, mascots and your own drawings can all become custom 3D printed keyrings, bag charms, zip pulls and Christmas tree ornaments. Tell me the character, the name and the colours, and I will turn it into a solid, hard-wearing keyring made in Dublin. A great idea for stocking fillers, party bag gifts, Secret Santa and school bag tags.',
    ],
    keywords: 'custom character keyring, personalised keychain, snowman keyring, 3D printed bag charm, stocking filler, Christmas gift for kids, name keyring, Dublin',
    alt: 'Custom 3D printed snowman character keyring with a name on the scarf',
    images: set('custom-snowman-keyring', 5),
  },
  {
    slug: 'raised-course-patch',
    title: 'Raised 3D course patch',
    short: 'A military-style course patch turned into a raised 3D badge',
    paragraphs: [
      'A military-style course patch with a walking soldier and a motto, turned into a raised 3D printed badge. The figure and the lettering stand out from the base, so the patch has depth that embroidery cannot give.',
      'Course memorabilia, club badges, team crests, unit plaques, wall plaques and leaving gifts can all be made this way. Send me a photo or a drawing of the badge and I will rebuild it as a 3D printed patch in your colours, from a single piece up to a small batch.',
    ],
    keywords: 'custom 3D printed patch, raised badge, military course memorabilia, club crest, wall plaque, personalised badge, small batch, Dublin',
    alt: 'Custom 3D printed raised military-style course patch with a walking soldier',
    images: set('custom-course-patch', 1),
  },
  {
    slug: 'autumn-tray-decor',
    title: 'Autumn table decor: pumpkins, acorn and mushroom',
    short: 'Decorative pumpkins, a giant acorn and a mushroom for a seasonal tray',
    paragraphs: [
      'A set of autumn table decorations printed for a seasonal display tray: orange and white pumpkins, a gourd, a giant acorn with a textured cap and a mushroom, all in matching autumn colours.',
      'Seasonal home decor is easy to customise: choose the shapes, sizes and colours to match your table, mantelpiece, shelf or entrance. Pumpkins, acorns, mushrooms, leaves and mini harvest pieces make lasting autumn and Halloween decorations that you can bring out every year, and they work well for shop windows and cafes too.',
    ],
    keywords: 'autumn decor, 3D printed pumpkins, acorn decoration, mushroom decor, fall table centrepiece, seasonal home decor, Halloween decoration, Dublin',
    alt: 'Custom 3D printed autumn decorations on a white tray: pumpkins, a giant acorn and a mushroom',
    images: set('custom-autumn-tray-decor', 1),
  },
  {
    slug: 'dear-santa-door-hanger',
    title: 'Christmas door hanger: Dear Santa, Cookies Inside',
    short: 'A candy cane door hanger with a Santa belt and a cookie message',
    paragraphs: [
      'A Christmas door hanger shaped like a Santa suit under a candy cane hook, with a gold belt buckle and the message Dear Santa - Cookies Inside in raised white lettering. It hangs on a door handle, a bedroom door or a kitchen cupboard.',
      'Seasonal door decor like this makes a fun Christmas Eve tradition for families and a cheerful sign for shops, cafes and offices. I can change the wording, add a name, switch the colours or design a different festive shape, such as a reindeer, an elf or a snowman, for your own door.',
    ],
    keywords: 'Christmas door hanger, Dear Santa cookies sign, personalised door decor, candy cane hanger, 3D printed Christmas decoration, Christmas Eve tradition, Dublin',
    alt: 'Custom 3D printed Christmas door hanger with a candy cane hook and the message Dear Santa Cookies Inside',
    images: set('custom-santa-door-hanger', 2),
  },
];
