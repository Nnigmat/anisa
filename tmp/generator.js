const flatten = (array, depth) => {
    let result = array;
    for (let i = 0; i < depth; i++) {
        result = [...result].flat();
    }

    return result;
}

const allVariants = (lengths, i = -1, cur = []) => {
    const result = [];

    if (lengths.length === 0) {
        return result;
    }

    if (i + 1 >= lengths.length) {
        return cur;
    }
    
    const taskIds = Array(lengths[i + 1]).fill(1);
    for (let [index, id] of Object.entries(taskIds)) {
        result.push([...cur, index]);
    }

    return result.map(el => allVariants(lengths, i + 1, el));
}

function dec2bin(dec) {
    return (dec >>> 0).toString(2); 
}

const idea = (lengths) => {
    const result = [];
    const size = lengths.reduce((acc, el) => acc * el, 1);
    const maxLength = dec2bin(size).length - 1;

    for (let i = 0; i < size; i++) {
        const numberString = dec2bin(i).padStart(maxLength, '0');
        result.push(numberString.split('').map(el => Number(el)));
    }

    return result;
}
