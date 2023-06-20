import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const dateFromInputForDb = (dateIn: string | null): string | null => {
  // accept date in format D, DD, D.M, DD.M, D.MM, DD.MM, D.M.YY, DD.M.YY, D.MM.YY, DD.MM.YY, D.M.YYYY, DD.M.YYYY, D.MM.YYYY, DD.MM.YYYY
  const date = dayjs(dateIn, 'DD.MM.YYYY').isValid()
    ? dayjs(dateIn, 'DD.MM.YYYY')
    : dayjs(dateIn, 'D.MM.YYYY').isValid()
    ? dayjs(dateIn, 'D.MM.YYYY')
    : dayjs(dateIn, 'DD.M.YYYY').isValid()
    ? dayjs(dateIn, 'DD.M.YYYY')
    : dayjs(dateIn, 'D.M.YYYY').isValid()
    ? dayjs(dateIn, 'D.M.YYYY')
    : dayjs(dateIn, 'DD.MM.YY').isValid()
    ? dayjs(dateIn, 'DD.MM.YY')
    : dayjs(dateIn, 'D.MM.YY').isValid()
    ? dayjs(dateIn, 'D.MM.YY')
    : dayjs(dateIn, 'DD.M.YY').isValid()
    ? dayjs(dateIn, 'DD.M.YY')
    : dayjs(dateIn, 'D.M.YY').isValid()
    ? dayjs(dateIn, 'D.M.YY')
    : dayjs(dateIn, 'DD.MM.').isValid()
    ? dayjs(dateIn, 'DD.MM.')
    : dayjs(dateIn, 'DD.MM').isValid()
    ? dayjs(dateIn, 'DD.MM')
    : dayjs(dateIn, 'D.MM').isValid()
    ? dayjs(dateIn, 'D.MM')
    : dayjs(dateIn, 'DD.M.').isValid()
    ? dayjs(dateIn, 'DD.M.')
    : dayjs(dateIn, 'DD.M').isValid()
    ? dayjs(dateIn, 'DD.M')
    : dayjs(dateIn, 'D.M').isValid()
    ? dayjs(dateIn, 'D.M')
    : dayjs(dateIn, 'DD.').isValid()
    ? dayjs(dateIn, 'DD.')
    : dayjs(dateIn, 'DD').isValid()
    ? dayjs(dateIn, 'DD')
    : dayjs(dateIn, 'D.').isValid()
    ? dayjs(dateIn, 'D.')
    : dayjs(dateIn, 'D').isValid()
    ? dayjs(dateIn, 'D')
    : null
  const dateFormated = date ? date.format('YYYY-MM-DD') : null

  return dateFormated
}

export default dateFromInputForDb
