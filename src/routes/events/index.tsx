import { component$ } from '@builder.io/qwik'
import type { RequestHandler } from '@builder.io/qwik-city'

export const onRequest: RequestHandler = ({ redirect }) => {
  redirect(308, '/')
}

// need to export a component due to a bug
// https://github.com/BuilderIO/qwik/issues/4502
export default component$(() => 'hi')
