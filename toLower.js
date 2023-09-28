const toLower = s =>
  s
    .toLocaleLowerCase()
    .replace(/á/g, 'a')
    .replace(/à/g, 'a')
    .replace(/â/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/é/g, 'e')
    .replace(/è/g, 'e')
    .replace(/ê/g, 'e')
    .replace(/ë/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ì/g, 'i')
    .replace(/î/g, 'i')
    .replace(/ï/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ò/g, 'o')
    .replace(/ô/g, 'o')
    .replace(/ö/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ù/g, 'u')
    .replace(/û/g, 'u')
    .replace(/ü/g, 'u')
    .replace(/ñ/g, 'n')

module.exports = toLower
