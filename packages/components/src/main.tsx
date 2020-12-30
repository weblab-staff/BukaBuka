import React, { useState, useEffect } from 'react';

import axios, { AxiosError } from 'axios';
interface HappinessResponse {
  happiness: number;
}

export const Main: React.FunctionComponent = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [happiness, setHappiness] = useState<number>(0);

  const getHappiness = async () => {
    const happiness = await axios
      .get<HappinessResponse>('/api/happiness')
      .then((res) => res.data)
      .then((happinessResp) => happinessResp.happiness);
    setHappiness(happiness);
    setLoaded(true);
  };
  useEffect(() => {
    getHappiness().catch((err: AxiosError) => {
      throw new Error(`There is no happiness: ${err}`);
    });
  }, []);

  if (!loaded) {
    return <div>Bukabuka cannot be reached. There is no happiness.</div>;
  }
  return <div>Bukabuka happiness level: {happiness}</div>;
};
