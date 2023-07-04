export const onGet = async ({ redirect }: RequestEvent) => {
  throw redirect(308, `/events/${new Date().getFullYear()}/`)
}
