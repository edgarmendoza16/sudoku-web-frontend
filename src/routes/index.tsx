import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {Sudoku as SudokuLayout} from "~/components/sudoku/sudoku";
import {Sudoku} from "~/libs/sudoku";

export default component$(() => {
  const sudoku = new Sudoku();
  const rows = sudoku.make("facil")

  return (
    <div style={{minHeight: "100vh", backgroundColor: "#eee"}}>
      <h1>Sudoku online 👋</h1>
      <SudokuLayout rows={rows} cellSize={80} blockBorderWidth={2} cellBorderWidth={0.5}/>
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
