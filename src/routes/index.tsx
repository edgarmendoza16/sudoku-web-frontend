import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {SudokuLayout} from "~/components/sudoku/sudoku";

export default component$(() => {
  return (
    <div style={{minHeight: "100vh", backgroundColor: "#eee"}}>
      <h1>Sudoku online 👋</h1>
      <SudokuLayout level="facil" checkErrors={true} cellSize={64} blockBorderWidth={2} cellBorderWidth={1}/>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sudoku",
  meta: [
    {
      name: "description",
      content: "Play sudoku online",
    },
  ],
};
