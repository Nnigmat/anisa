import { Task } from "./types";

const shuffle = (array: Array<any>) => {
    return [...array].sort(() => Math.random() - 0.5);
}

const flatten = (array: Array<any>, depth: number) => {
    let result = array;
    for (let i = 0; i < depth; i++) {
        result = [...result].flat();
    }

    return result;
}

// @ts-ignore
const allVariants = (lengths: Array<number>, i = -1, cur = [] as string[]) => {
    const result = [] as Array<any>;

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

    return result.map(el => allVariants(lengths, i + 1, el)) as Array<any>;
};

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
    const generatedVariants = flatten(allVariants(lengths), lengths.length - 1);

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
