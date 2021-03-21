import { Task } from "./types";

const shuffle = (array: Array<any>) => {
    return [...array].sort(() => Math.random() - 0.5);
}

const allVariants: (i: number, cur: any, lengths: Array<number>) => Array<Array<number>> = (i = -1, cur, lengths: Array<number>) => {
    if (lengths.length === 0) {
        return [];
    }

    if (i + 1 >= lengths.length) {
        return cur || [];
    }
    const res = Array(lengths[i + 1]).fill(1).map((_, index) => allVariants(i + 1, [...(cur || []), index], lengths));

    if (i === 0) {
      return res;
    }

    return res.reduce((acc, el) => [...acc, ...el], []);
}

export const generate = (tasks: Array<Task>, amountVariants: number) => {
    if (tasks.length === 0 || amountVariants < 0) {
        return '';
    }
    
    const typesTasks = tasks.reduce((acc, task) => {
        if (task.type in acc) {
            // @ts-ignore
            acc[task.type].push(task);
        } else {
            // @ts-ignore
            acc[task.type] = [task];
        }

        return acc;
    }, {});

    
    const sortedKeys = Object.keys(typesTasks).sort((a: string, b: string) => Number(a) - Number(b));

    // @ts-ignore
    const lengths = sortedKeys.map((key) => typesTasks[key].length);
    const generatedVariants = allVariants(-1, null, lengths);


    let sizedGeneratedVariants = [] as Array<Array<number>>;
    for (let i = 0; i < amountVariants / generatedVariants.length; i++) {
        sizedGeneratedVariants = [...sizedGeneratedVariants, ...generatedVariants];
    }
    sizedGeneratedVariants = sizedGeneratedVariants.slice(0, amountVariants);
    const shaffledVariants = shuffle(sizedGeneratedVariants);

    const mappedToText = shaffledVariants.map((el) => {
        // @ts-ignore
        return el.map((el, i) => typesTasks[String(i + 1)][el]);
    });

    let result = '';
    for (let i = 0; i < mappedToText.length; i++) {
        result += `Вариант ${i + 1}\n\n`;
        for (let j = 0; j < mappedToText[i].length; j++) {
            result += `${j + 1}. ${mappedToText[i][j].content}\n\n`;
        }
        result += '\n\n\n';
    }
    
    return result;
}
