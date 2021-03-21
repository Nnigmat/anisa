import React, { ChangeEvent, ChangeEventHandler } from 'react';
import { Textarea, ITextareaProps } from '@yandex/ui/Textarea/desktop/bundle';
import { Text } from '@yandex/ui/Text/desktop/bundle';
import { Select } from '@yandex/ui/Select/desktop/bundle';
import { Button, ContainerElement } from '@yandex/ui/Button/desktop/bundle';
import { Task } from '../../types';

import './index.css';

export const TaskView = ({ task, onChange, onDelete, onTaskTypeChange, ...props}:
    { task: Task,
      onDelete?: ((event: React.MouseEvent<ContainerElement, MouseEvent>) => void),
      onTaskTypeChange: (id: string, event: ChangeEvent<HTMLSelectElement>) => void,
    } & ITextareaProps) => {
    const showDelete = Boolean(onDelete);
    const taskTypes = Array(10).fill(1).map((_, index) => ({ 
        value: index + 1, content: 'Задание ' + String(index + 1)
    }))

    return (
        <div className="TaskView">
            <Textarea 
                value={task.content}
                onChange={onChange}
                view="default"
                className="TaskView-Input"
                rows={10}
                {...props}
            />
            <Select 
                view="default"
                size="m"
                value={task.type}
                onChange={(e) => onTaskTypeChange(task.id, e)}
                options={taskTypes}
            />
            { showDelete && (
                <Button
                    // className="TaskView-Delete"
                    size="m"
                    view="clear"
                    onClick={onDelete}
                >
                    Удалить&nbsp;
                </Button>
            )}
        </div>
    );
};
