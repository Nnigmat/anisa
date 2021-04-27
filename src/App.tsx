import React, {
  ChangeEvent,
  KeyboardEvent,
  useState,
  useEffect,
  useRef,
} from 'react';
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
import copy from './assets/copy.svg';
import meGif from './assets/me.gif';
import './App.css';

import { generateKey } from './utils';
import { Task } from './types';
import { TaskView } from './components/TaskView';
import { Empty } from './components/Empty';
import { generate } from './generator';

configureRootTheme({ theme });

const MIN_VARIANTS_AMOUNT = 1;
const TASKS = localStorage.getItem('tasks')
  ? (JSON.parse(localStorage.getItem('tasks') || '') as Array<Task>)
  : ([] as Array<Task>);
const CURRENT_TASK = localStorage.getItem('current_task') || '';
const VARIANTS_AMOUNT =
  Number(localStorage.getItem('variants_amount')) || MIN_VARIANTS_AMOUNT;
const TASK_TYPE = Number(localStorage.getItem('task_type')) || 1;
const GENERATED_TEXT = localStorage.getItem('generated_text') || '';

function App() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState(TASKS);
  const [variantsAmount, setVariantsAmount] = useState(VARIANTS_AMOUNT);
  const [currentTask, setCurrentTask] = useState(CURRENT_TASK);
  const [taskType, setTaskType] = useState(TASK_TYPE);
  const [generatedText, setGeneratedText] = useState(GENERATED_TEXT);
  const [messageBoxVisible, setMessageBoxVisible] = useState(false);
  const [gifVisible, setGifVisible] = useState(false);
  const [clearModalVisible, setClearModalVisible] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => setMessageBoxVisible(true), 2000);
    return () => clearTimeout(timerId);
  }, []);

  const clear = () => {
    setTasks([]);
    setVariantsAmount(MIN_VARIANTS_AMOUNT);
    setCurrentTask('');
    setTaskType(1);
    setGeneratedText('');
    localStorage.clear();
  };

  const onCurrentTaskChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentTask(e.target.value);
    localStorage.setItem('current_task', e.target.value);
  };

  const onGenerateClick = () => {
    const generatedText = generate(tasks, variantsAmount);
    setGeneratedText(generatedText);
    localStorage.setItem('generated_text', generatedText);
  };

  const onCopyClick = () => {
    navigator.clipboard.writeText(generatedText);
  };

  const addTask = () => {
    if (currentTask.trim().length === 0) {
      return;
    }

    setTasks((prev) => {
      const tasks = [
        ...prev,
        {
          id: generateKey(currentTask),
          content: currentTask,
          type: taskType,
        },
      ];

      localStorage.setItem('tasks', JSON.stringify(tasks));
      return tasks;
    });
    clearCurrentTask();
  };

  const handleTaskChange = (
    id: string,
    e: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTasks((prev) => {
      const tasks = prev.map((task) =>
        task.id === id ? { ...task, content: e.target.value } : task
      );

      localStorage.setItem('tasks', JSON.stringify(tasks));
      return tasks;
    });
  };

  const handleTaskTypeChange = (
    id: string,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setTasks((prev) => {
      const tasks = prev.map((task) =>
        task.id === id ? { ...task, type: Number(e.target.value) } : task
      );

      localStorage.setItem('tasks', JSON.stringify(tasks));
      return tasks;
    });
  };

  const handleVariantsAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) < MIN_VARIANTS_AMOUNT) {
      setVariantsAmount(Number(MIN_VARIANTS_AMOUNT));
      return;
    }

    setVariantsAmount(Number(e.target.value));
    localStorage.setItem('variants_amount', e.target.value);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => {
      const tasks = prev.filter((task) => task.id !== id);

      localStorage.setItem('tasks', JSON.stringify(tasks));
      return tasks;
    });
  };

  const clearCurrentTask = () => {
    setCurrentTask('');
    localStorage.setItem('current_task', '');
  };

  const taskTypes = Array(10)
    .fill(1)
    .map((_, index) => ({
      value: index + 1,
      content: 'Задание ' + String(index + 1),
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
            <Button view="action" size="m" onClick={addTask}>
              Добавить
            </Button>
            <Select
              view="default"
              size="m"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              options={taskTypes}
            />
            <Button
              view="clear"
              size="m"
              onClick={() => setClearModalVisible(true)}
            >
              Очистить
            </Button>
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
          <Text>
            {' '}
            Количество вариантов:
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
          <Button view="action" size="m" onClick={onGenerateClick}>
            Сгенерировать
          </Button>
          <Button view="default" size="m" onClick={onCopyClick}>
            <img
              src={copy}
              className="Copy"
              alt="Скопировать"
              width="26"
              height="26"
            />
          </Button>
        </div>
        <Textarea
          view="default"
          className="Generated"
          placeholder="Сгенерированные данные"
          value={generatedText}
        />
      </div>
      {messageBoxVisible && (
        <MessageBox
          onClose={() => setMessageBoxVisible(false)}
          view="default"
          size="m"
          actions={
            <>
              <Button
                view="action"
                size="s"
                onClick={() => setGifVisible(true)}
              >
                Подробнее
              </Button>
            </>
          }
          className="MessageBox-Custom"
        >
          Специально для Анисы апы от Никиты. Ждем тебя в Иннополисе :)
        </MessageBox>
      )}
      {gifVisible && (
        <Modal
          theme="normal"
          scope={scopeRef}
          visible={gifVisible}
          keepMounted={false}
          autoFocus={true}
          onClose={() => setGifVisible(false)}
        >
          <img src={meGif} alt="Author" />
        </Modal>
      )}
      {clearModalVisible && (
        <Modal
          theme="normal"
          scope={scopeRef}
          visible={clearModalVisible}
          onClose={() => setClearModalVisible(false)}
        >
          <div
            style={{
              padding: 16,
              fontFamily: 'var(--control-font-family)',
              width: 400,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              Вы уверены, что хотите полностью очистить данные?
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                view="clear"
                size="m"
                onClick={() => setClearModalVisible(false)}
              >
                Отменить
              </Button>
              <Button
                view="action"
                size="m"
                onClick={() => {
                  clear();
                  setClearModalVisible(false);
                }}
              >
                Очистить
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
export default App;
