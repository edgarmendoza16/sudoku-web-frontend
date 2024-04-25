import type {QRL} from "@builder.io/qwik";
import { component$} from "@builder.io/qwik";

interface LevelSelectorProps {
  value: string
  onSelect$: QRL<(value: string) => void>
}

export const LevelSelector = component$<LevelSelectorProps>((props) => {
  const levels = [
    'facil',
    'medio',
    'dificil',
    'experto',
    'maestro',
    'extremo',
  ]

  return (
    <div>
      <select value={props.value} onChange$={(event: any) => props.onSelect$(event.target.value)}>
        {levels.map((option) => {
          return <option value={option} key={option}>{option}</option>
        })}
      </select>
    </div>
  )
})
