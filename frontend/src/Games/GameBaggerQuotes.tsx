import { motion } from "framer-motion";
import { styled } from "styled-components";
import { useEffect, useState } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

import { GameProps } from "../MiniGame";
import { quotes } from "./Quotes";

const ConfettiWrapper = styled.div<{ visible: boolean }>`
  transition: 0.3s ease all;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

const POSSIBLE_AUTHORS = [
  "Flip",
  "Frank",
  "Karel",
  "Floris",
  "Jeffrey",
  "Suus",
  "Heleen",
  "Joost",
  "Oliver",
  "Max",
  "Minke",
  "Margot",
  "Carlijn",
  "Darrell",
  "Cato",
];

const GetQuote = () => {
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const GameBaggerQuotes = ({ onFinish }: GameProps) => {
  const { width, height } = useWindowSize();

  const [quoteIsHappy, setHappyQuote] = useState(false);

  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [quote, setQuote] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [nQuotes, setNQuotes] = useState(Math.ceil(Math.random() * 4));

  useEffect(() => {
    if (quoteIsHappy) {
      const timeout = setTimeout(() => {
        setHappyQuote(false);
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [quoteIsHappy]);

  useEffect(() => {
    if (nQuotes <= 0) {
      onFinish();
    } else {
      let quote_info = GetQuote();
      setQuote(quote_info[1]);
      setAuthor(quote_info[0]);
    }
    return () => {};
  }, [nQuotes]);

  let usedQuote = quote;

  if (wrongAnswers > 3) {
    usedQuote += " - ";
    const authorInitials = author.slice(0, wrongAnswers - 3);
    usedQuote += authorInitials;
  }

  return (
    <>
      <h2 style={{ fontSize: 28, marginTop: -20, color: "#16a085" }}>
        Nog {nQuotes} Bagger quotes!
      </h2>
      <ConfettiWrapper visible={quoteIsHappy}>
        <Confetti width={width} height={height} />
      </ConfettiWrapper>
      <div style={{ fontSize: 20, fontWeight: 400, padding: "1rem 0.5rem" }}>
        {usedQuote}
      </div>
      <select
        style={{ marginBottom: "1rem" }}
        name="author"
        onChange={(e) => {
          let author_value: string = e.target.value.toLowerCase();
          if (author_value.includes(author.toLowerCase())) {
            setNQuotes((x) => x - 1);
            setHappyQuote(true);
          } else {
            alert("FOUT LOL");
            let quote_info = GetQuote();
            setQuote(quote_info[1]);
            setAuthor(quote_info[0]);
            setWrongAnswers((x) => x + 1);
          }

          e.target.value = "";
        }}
      >
        <option value="">--KIES MIJ!!--</option>
        {POSSIBLE_AUTHORS.map((x) => (
          <option value={x}>{x}</option>
        ))}
      </select>
    </>
  );
};
