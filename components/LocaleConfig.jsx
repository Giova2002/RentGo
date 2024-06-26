import {LocaleConfig} from 'react-native-calendars';

export default calendarioEsp = () => {
    LocaleConfig.locales['es'] = {
        monthNames: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre'
        ],
        monthNamesShort: ['Ene', 'Feb.', 'Mar', 'Abr', 'May', 'Jun', 'Jul.', 'Ago', 'Sept', 'Oct.', 'Nov.', 'Dic.'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'],
        today: "Hoy"
      };
      
      LocaleConfig.defaultLocale = 'es';
}