/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import socket from './client-socket';

import buka_0 from './images/buka_0.png';
import buka_1 from './images/buka_1.png';
import buka_2 from './images/buka_2.png';
import buka_3 from './images/buka_3.png';
import buka_4 from './images/buka_4.png';

import './main.scss';

const images = {
  0: buka_0,
  1: buka_1,
  2: buka_2,
  3: buka_3,
  4: buka_4,
};

interface HappinessResponse {
  happiness: number;
}

export const Main: React.FunctionComponent = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [happiness, setHappiness] = useState<number>(0.5);

  const getHappiness = async () => {
    const happiness = await axios
      .get<HappinessResponse>('/api/happiness')
      .then((res) => res.data)
      .then((happinessResp) => happinessResp.happiness);
    setHappiness(happiness);
    setLoaded(true);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    socket.on('happiness', (value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      setHappiness(value.happiness);
    });
  });
  useEffect(() => {
    getHappiness().catch((err: AxiosError) => {
      throw new Error(`There is no happiness: ${err}`);
    });
  }, []);

  const buka_number = Math.min(Math.trunc(happiness / 0.2), 4);
  const buka_size = Math.trunc(happiness * 10) + 1;

  const text = loaded
    ? "this is buka buka the turtle. buka buka loves questions from web.lab students. no questions make buka buka sad. you don't want to make buka buka sad."
    : 'buka buka cannot be reached. there is no happiness';

  return (
    <div className="dark-blue-bg">
      <div className="container">
        <div className="title white-text">{text}</div>
        <img className={`buka-image-${buka_size}`} src={images[buka_number] || buka_2} />
      </div>
    </div>
  );
};
