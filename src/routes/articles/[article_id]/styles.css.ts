import { style } from 'styled-vanilla-extract/qwik'

export const styles = style({
  ['& a']: { color: 'blue !important' },
  [`& p`]: { marginBottom: '20px' },
  [`& .row`]: { marginBottom: '20px' },
  [`& table`]: { marginBottom: '20px' },
  [`& h2`]: {
    textAlign: 'center',
    fontSize: 'x-large',
    fontWeight: 800,
    marginTop: '60px',
    marginBottom: '20px',
  },
  [`& h3`]: {
    textAlign: 'center',
    fontSize: 'large',
    fontWeight: 800,
    marginTop: '40px',
    marginBottom: '20px',
  },
})
