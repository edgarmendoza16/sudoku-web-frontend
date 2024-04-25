import {component$} from "@builder.io/qwik";

interface ErrorsProps {
  count: number
  max: number
}

export const ErrorsLayout = component$<ErrorsProps>((props) => {
  return (
      <div>
        <p>Errores: {props.count} / {props.max}</p>
      </div>
    )
})
