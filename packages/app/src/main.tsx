/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import socket from './client-socket';

import buka_0 from './images/buka_0.png';
import buka_1 from './images/buka_1.png';
import buka_2 from './images/buka_2.png';
import buka_3 from './images/buka_3.png';
import buka_4 from './images/buka_4.png';
import sleepingBuka from './images/buka_sleep.png';

import './main.scss';

const images = {
  0: buka_0,
  1: buka_1,
  2: buka_2,
  3: buka_3,
  4: buka_4,
  5: sleepingBuka,
};

interface HappinessResponse {
  happiness: number;
}

interface QuestionResponse {
  question: string;
}

interface AwakeResponse {
  awake: boolean;
}

export const Main: React.FunctionComponent = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [happiness, setHappiness] = useState<number>(0.5);
  const [question, setQuestion] = useState<string>('can i use --force in my git commands for good luck?');
  const [active, setActive] = useState<boolean>(false);

  const getHappiness = async () => {
    const happinessValue = await axios
      .get<HappinessResponse>('/api/happiness')
      .then((res) => res.data)
      .then((happinessResp) => happinessResp.happiness);
    setHappiness(happinessValue);
  };

  const getQuestion = async () => {
    const questionValue = await axios
      .get<QuestionResponse>('/api/question')
      .then((res) => res.data)
      .then((questionResp) => questionResp.question);
    setQuestion(questionValue);
  };

  const checkIfClassActive = async () => {
    const awake = await axios
      .get<AwakeResponse>('/api/awake')
      .then((res) => res.data)
      .then((awakeResp) => awakeResp.awake);
    setActive(awake);
  };

  useEffect(() => {
    socket.on('happiness', (value: number) => {
      setHappiness(value);
    });
    socket.on('awake', () => {
      setActive(true);
    });
    socket.on('sleep', () => {
      setActive(false);
    });
  }, []);

  useEffect(() => {
    checkIfClassActive().catch((err: AxiosError) => {
      throw new Error(`Buka buka is not in class: ${err}`);
    });
  }, []);

  useEffect(() => {
    Promise.all([getHappiness(), getQuestion()])
      .then(() => {
        setLoaded(true);
      })
      .catch((err) => {
        throw new Error(`Failed to contact the buka buka service: ${err}`);
      });
  }, []);

  const buka_number = Math.min(Math.trunc(happiness / 0.2), 4);
  const buka_size = Math.trunc(happiness * 10) + 1;

  const text = loaded
    ? question
      ? question
      : "this is buka buka the turtle. buka buka loves questions from web.lab students. no questions make buka buka sad. you don't want to make buka buka sad."
    : 'buka buka cannot be reached. the weblab staff is saddened.';

  const textWhenNotInClass = 'buka buka is resting';
  return (
    <div className="dark-blue-bg">
      <div className="container">
        <div className="title white-text">{active ? text : textWhenNotInClass} </div>
        {active ? (
          <div>
            <img className={`buka-image-${buka_size}`} src={images[buka_number] || buka_2} />
          </div>
        ) : (
          <img className={`buka-image-5`} src={sleepingBuka} />
        )}
      </div>
    </div>
  );
};
