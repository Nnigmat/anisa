import React, { ChangeEvent, KeyboardEvent, useState, useEffect, useRef } from 'react';
import { configureRootTheme } from '@yandex/ui/Theme';
import { theme } from '@yandex/ui/Theme/presets/default';
import { Textarea } from '@yandex/ui/Textarea/desktop/bundle';
import { Textinput } from '@yandex/ui/Textinput/desktop/bundle';
import { Button } from '@yandex/ui/Button/desktop/bundle';
import { RadioButton } from '@yandex/ui/RadioButton/desktop/bundle';
import { Select } from '@yandex/ui/Select/desktop/bundle';
import { Text } from '@yandex/ui/Text/desktop/bundle';
import { MessageBox } from '@yandex/ui/MessageBox/desktop/bundle';
import { Modal } from '@yandex/ui/Modal/desktop/bundle';

import logo from './logo.svg';
import meGif from './assets/me.gif';
import './App.css';

import { generateKey } from './utils';
import { Task } from './types';
import { TaskView } from './components/TaskView';
import { Empty } from './components/Empty';
import { generate } from './generator';

configureRootTheme({ theme })

const MIN_VARIANTS_AMOUNT = 1;

function App() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState([] as Array<Task>);
  const [variantsAmount, setVariantsAmount] = useState(MIN_VARIANTS_AMOUNT);
  const [currentTask, setCurrentTask] = useState('');
  const [generatorType, setGeneratorType] = useState('text');
  const [taskType, setTaskType] = useState(1);
  const [generatedText, setGeneratedText] = useState('');
  const [messageBoxVisible, setMessageBoxVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => setMessageBoxVisible(true), 2000);
    return  () => clearTimeout(timerId);
  }, []);

  const onCurrentTaskChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentTask(e.target.value);
  }

  const onGenerateClick = () => {
    setGeneratedText(generate(tasks, variantsAmount));
  }

  const addTask = () => {
    if (currentTask.trim().length === 0) {
      return;
    }

    setTasks(prev => [...prev, {
      id: generateKey(currentTask),
      content: currentTask,
      type: taskType
    }]);
    clearCurrentTask();
  };

  const handleTaskChange = (id: string, e: ChangeEvent<HTMLTextAreaElement>) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, content: e.target.value } : task));
  }

  const handleTaskTypeChange = (id: string, e: ChangeEvent<HTMLSelectElement>) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, type: Number(e.target.value) } : task));
  }

  const handleVariantsAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) < MIN_VARIANTS_AMOUNT) {
      setVariantsAmount(Number(MIN_VARIANTS_AMOUNT));
      return;
    }

    setVariantsAmount(Number(e.target.value));
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter((task) => task.id !== id));
  };

  const clearCurrentTask = () => {
    setCurrentTask('');
  };

  const generatorTypes = [
      { value: 'text', children: 'Текст' },
      { value: 'document', children: 'Документ' },
  ];

  const taskTypes = Array(10).fill(1).map((_, index) => ({ 
    value: index + 1, content: 'Задание ' + String(index + 1)
  }));

  return (
    <div className="App" ref={scopeRef}>
      <div className="left">
          <div className="Input">
            <Textarea
              value={currentTask}
              onChange={onCurrentTaskChange}
              view="default"
              placeholder="Задание"
              autoFocus={true}
              rows={5}

            /> 
            <div className="Input-Buttons">
              <Button
                view="action" 
                size="m"
                onClick={addTask}
              >
                Добавить
              </Button>
              <Select 
                view="default"
                size="m"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                options={taskTypes}
              />
            </div>
          </div>
          {[...tasks].reverse().map((task) => (
            <TaskView
              key={task.id}
              task={task}
              value={task.content}
              onChange={(e) => handleTaskChange(task.id, e)}
              onDelete={() => deleteTask(task.id)}
              onTaskTypeChange={handleTaskTypeChange}
            />
          ))}
          <Empty size="s" />
      </div>
      <div className="right">
        <Text
          typography="display-s"
          weight="light"
          align="center"
          className="Title"
        >
          Генератор вариантов
        </Text>
        <div className="right-Menu">
          <Text> Количество вариантов:
            <Textinput
              placeholder="от 0 до 50"
              type="number"
              view="default"
              size="m"
              value={variantsAmount}
              onChange={handleVariantsAmountChange}
              min={1}
              max={50}
              inputMode="decimal"
              style={{ width: 150, display: 'inline' }}
            />
          </Text>
          <RadioButton 
            size="m"
            view="default"
            value={generatorType}
            options={generatorTypes}
            onChange={(e) => setGeneratorType(e.target.value)}
          />
          <Button
            view="action" 
            size="m"
            onClick={onGenerateClick}
          >
            Сгенерировать
          </Button>
        </div>
        <Textarea
          view="default" 
          className="Generated"
          placeholder="Сгенерированные данные"
          value={generatedText}
        />
      </div>
      { messageBoxVisible && (
        <MessageBox
          onClose={() => setMessageBoxVisible(false)}
          view="default"
          size="m"
          actions={
              <>
                <Button view="action" size="s" onClick={() => setModalVisible(true)}>
                    Подробнее
                </Button>
              </>
          }
          className="MessageBox-Custom"
        >
          Специально для Анисы апы от Никиты. Ждем тебя в Иннополисе :)
        </MessageBox>
      )}
      { modalVisible && (
        <Modal
          theme="normal"
          scope={scopeRef}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        >
          <img src={meGif} alt="Author" />
        </Modal>
      )}
    </div>
  );
} 
export default App;
