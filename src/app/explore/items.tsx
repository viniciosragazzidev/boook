"use client";
import React from "react";
import MoviesList from "../components/Movies";

const Items = ({ currentItem }: { currentItem: string }) => {
  return <>{currentItem === "filmes" ? <MoviesList /> : <div></div>}</>;
};

export default Items;
