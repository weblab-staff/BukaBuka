import type React from "react";
import { Main } from "@bukabuka/components";

export interface AppProps {
  text: string;
}

export const App: React.VFC<AppProps> = ({ text }) => <Main text={text} />;
