import { isToday } from './helpers'

export const avatarText = (value: string) => {
  if (!value)
    return ''
  const nameArray = value.split(' ')

  return nameArray.map(word => word.charAt(0).toUpperCase()).join('')
}

// TODO: Try to implement this: https://twitter.com/fireship_dev/status/1565424801216311297
export const kFormatter = (num: number) => {
  const regex = /\B(?=(\d{3})+(?!\d))/g

  return Math.abs(num) > 9999 ? `${Math.sign(num) * +((Math.abs(num) / 1000).toFixed(1))}k` : Math.abs(num).toFixed(0).replace(regex, ',')
}

/**
 * Format and return date in Humanize format
 * Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 * Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {string} value date to format
 * @param {Intl.DateTimeFormatOptions} formatting Intl object to format with
 */
export const formatDate = (value: string, formatting: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value)
    return value

  return new Intl.DateTimeFormat('es-EC', formatting).format(new Date(value))
}

export const formatoFechaHora = (
  value: string,
  formatting: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric'
  }
) => {
  if (!value)
    return value;

  return new Intl.DateTimeFormat('es-EC', formatting).format(new Date(value));
};

export const formatoHora = (
  value: string,
  formatting: Intl.DateTimeFormatOptions = { 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric'
  }
) => {
  if (!value)
    return value;

  return new Intl.DateTimeFormat('es-EC', formatting).format(new Date(value));
};

export const convertToSeconds = (time: string): string => {
  // Dividir el tiempo en horas, minutos, segundos y milisegundos
  const [hours, minutes, seconds] = time.split(':');

  // Dividir segundos y fracciones de segundo
  const [wholeSeconds, fraction] = seconds.split('.');

  // Convertir todo a segundos
  const totalSeconds = (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseInt(wholeSeconds);

  // Convertir las fracciones de segundo a decimales
  const fractionalSeconds = parseFloat('0.' + fraction).toFixed(2);

  // Devolver en formato "X.XX s"
  return `${totalSeconds} segundos`;
};

/**
 * Return short human friendly month representation of date
 * Can also convert date to only time if date is of today (Better UX)
 * @param {string} value date to format
 * @param {boolean} toTimeForCurrentDay Shall convert to time if day is today/current
 */
export const formatDateToMonthShort = (value: string, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting: Record<string, string> = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date))
    formatting = { hour: 'numeric', minute: 'numeric' }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

export const prefixWithPlus = (value: number) => value > 0 ? `+${value}` : value
