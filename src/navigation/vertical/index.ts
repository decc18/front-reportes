export default [
  {
    title: 'Home',
    to: { name: 'root' },
    icon: { icon: 'ri-home-smile-2-line' },
  },
  {
    title: 'Second page',
    to: { name: 'second-page' },
    icon: { icon: 'ri-file-text-line' },
  },
  {
    title: 'Reportes',
    icon: { icon: 'ri-bill-line' },
    children: [
      { title: 'Reportes Generados', to: 'apps-reportes' },
      { title: 'Nuevo Reporte', to: 'apps-reportes-generar-reporte' },
      { title: 'Programar Reporte', to: 'apps-reportes-programar-reporte' },
    ],
  },
]
