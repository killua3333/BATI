const photoMap: Record<string, string> = {
  'lebron-james': '/photo/lebron.jpeg',
  'stephen-curry': '/photo/curry.jpeg',
  'kevin-durant': '/photo/kd.jpeg',
  'giannis-antetokounmpo': '/photo/giannis.jpeg',
  'kobe-bryant': '/photo/kobe.jpeg',
  'shaquille-o-neal': '/photo/oneal.jpeg',
  'klay-thompson': '/photo/thompson.jpeg',
  'nikola-joki': '/photo/jokic.jpeg',
  'kyrie-irving': '/photo/irving.jpeg',
  'james-harden': '/photo/harden.jpeg',
  'luka-don-i': '/photo/doncic.jpeg',
  'kawhi-leonard': '/photo/leonard.jpeg',
  'jimmy-butler': '/photo/butler.jpeg',
  'draymond-green': '/photo/green.jpeg',
  'russell-westbrook': '/photo/westbrook.jpeg',
  'rudy-gobert': '/photo/gobert.jpeg',
  'chris-paul': '/photo/paul.jpeg',
  'damian-lillard': '/photo/lilard.jpeg',
  'anthony-davis': '/photo/davis.jpeg',
  'tim-duncan': '/photo/duncan.jpeg',
  'trae-young': '/photo/young.jpeg',
  'zion-williamson': '/photo/williamson.jpeg',
  'paul-george': '/photo/george.jpeg',
  'bam-adebayo': '/photo/adebayo.jpeg',
  'devin-booker': '/photo/booker.jpeg',
  'shai-gilgeous-alexander': '/photo/alexander.jpeg',
  'victor-wembanyama': '/photo/wembanyama.jpeg',
  'dennis-rodman': '/photo/rodman.jpeg',
  'tyrese-haliburton': '/photo/haliburton.jpeg',
  'anthony-edwards': '/photo/edwards.jpeg'
};

export function getPlayerPhoto(characterId: string): string {
  return photoMap[characterId] ?? '/photo/jordan.jpeg';
}
