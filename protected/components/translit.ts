export function Translit(input: string, capitalize: boolean = false) {
    if (!input) {
        return;
    }
    const translited = input.split('')
        .map((char: string) => {
            char = char.toLowerCase();
            return (letterMap[char] !== undefined) ? letterMap[char] : char;
        })
        .join('')
        .replace(/[^a-z0-9\-_]/gi, '-')
        .replace(/\-{2,}/g, '-')
        .replace(/_{2,}/g, '_')
        .replace(/[\-\_]+$/g, '')
        .replace(/^[\-\_]+/g, '');

    return capitalize
        ? (translited[0].toUpperCase() + translited.slice(1))
        : translited;
}

const letterMap = {
    '/': '_',
    '\\': '_',
    '\'': '',
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'y',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'kh',
    'ц': 'ts',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sch',
    'ы': 'y',
    'ь': '',
    'ъ': '',
    'э': 'e',
    'ю': 'yu',
    'я': 'ya',
    'ё': 'e',
    'є': 'e',
    'і': 'i',
    'ї': 'yi',
    'ґ': 'g',
    '+': '-plus'
};
