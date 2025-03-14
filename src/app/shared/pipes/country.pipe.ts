import { Pipe, PipeTransform } from '@angular/core';
interface Country {
  name?: string;
  alpha2Code: string;
  alpha3Code?: string;
  numericCode?: string;
  callingCode?: string;
}

const COUNTRIES_DB: Country[] = [
  {
    name: 'Afghanistan',
    alpha2Code: 'AF',
    alpha3Code: 'AFG',
    numericCode: '004',
    callingCode: '+93',
  },
  {
    name: 'Åland Islands',
    alpha2Code: 'AX',
    alpha3Code: 'ALA',
    numericCode: '248',
    callingCode: '+358',
  },
  {
    name: 'Albania',
    alpha2Code: 'AL',
    alpha3Code: 'ALB',
    numericCode: '008',
    callingCode: '+355',
  },
  {
    name: 'Algeria',
    alpha2Code: 'DZ',
    alpha3Code: 'DZA',
    numericCode: '012',
    callingCode: '+213',
  },
  {
    name: 'American Samoa',
    alpha2Code: 'AS',
    alpha3Code: 'ASM',
    numericCode: '016',
    callingCode: '+1684',
  },
  {
    name: 'Andorra',
    alpha2Code: 'AD',
    alpha3Code: 'AND',
    numericCode: '020',
    callingCode: '+376',
  },
  {
    name: 'Angola',
    alpha2Code: 'AO',
    alpha3Code: 'AGO',
    numericCode: '024',
    callingCode: '+244',
  },
  {
    name: 'Anguilla',
    alpha2Code: 'AI',
    alpha3Code: 'AIA',
    numericCode: '660',
    callingCode: '+1264',
  },
  {
    name: 'Antarctica',
    alpha2Code: 'AQ',
    alpha3Code: 'ATA',
    numericCode: '010',
    callingCode: '+672',
  },
  {
    name: 'Antigua and Barbuda',
    alpha2Code: 'AG',
    alpha3Code: 'ATG',
    numericCode: '028',
    callingCode: '+1268',
  },
  {
    name: 'Argentina',
    alpha2Code: 'AR',
    alpha3Code: 'ARG',
    numericCode: '032',
    callingCode: '+54',
  },
  {
    name: 'Armenia',
    alpha2Code: 'AM',
    alpha3Code: 'ARM',
    numericCode: '051',
    callingCode: '+374',
  },
  {
    name: 'Aruba',
    alpha2Code: 'AW',
    alpha3Code: 'ABW',
    numericCode: '533',
    callingCode: '+297',
  },
  {
    name: 'Australia',
    alpha2Code: 'AU',
    alpha3Code: 'AUS',
    numericCode: '036',
    callingCode: '+61',
  },
  {
    name: 'Austria',
    alpha2Code: 'AT',
    alpha3Code: 'AUT',
    numericCode: '040',
    callingCode: '+43',
  },
  {
    name: 'Azerbaijan',
    alpha2Code: 'AZ',
    alpha3Code: 'AZE',
    numericCode: '031',
    callingCode: '+994',
  },
  {
    name: 'Bahamas',
    alpha2Code: 'BS',
    alpha3Code: 'BHS',
    numericCode: '044',
    callingCode: '+1242',
  },
  {
    name: 'Bahrain',
    alpha2Code: 'BH',
    alpha3Code: 'BHR',
    numericCode: '048',
    callingCode: '+973',
  },
  {
    name: 'Bangladesh',
    alpha2Code: 'BD',
    alpha3Code: 'BGD',
    numericCode: '050',
    callingCode: '+880',
  },
  {
    name: 'Barbados',
    alpha2Code: 'BB',
    alpha3Code: 'BRB',
    numericCode: '052',
    callingCode: '+1246',
  },
  {
    name: 'Belarus',
    alpha2Code: 'BY',
    alpha3Code: 'BLR',
    numericCode: '112',
    callingCode: '+375',
  },
  {
    name: 'Belgium',
    alpha2Code: 'BE',
    alpha3Code: 'BEL',
    numericCode: '056',
    callingCode: '+32',
  },
  {
    name: 'Belize',
    alpha2Code: 'BZ',
    alpha3Code: 'BLZ',
    numericCode: '084',
    callingCode: '+501',
  },
  {
    name: 'Benin',
    alpha2Code: 'BJ',
    alpha3Code: 'BEN',
    numericCode: '204',
    callingCode: '+229',
  },
  {
    name: 'Bermuda',
    alpha2Code: 'BM',
    alpha3Code: 'BMU',
    numericCode: '060',
    callingCode: '+1441',
  },
  {
    name: 'Bhutan',
    alpha2Code: 'BT',
    alpha3Code: 'BTN',
    numericCode: '064',
    callingCode: '+975',
  },
  {
    name: 'Bolivia (Plurinational State of)',
    alpha2Code: 'BO',
    alpha3Code: 'BOL',
    numericCode: '068',
    callingCode: '+591',
  },
  {
    name: 'Bonaire, Sint Eustatius and Saba',
    alpha2Code: 'BQ',
    alpha3Code: 'BES',
    numericCode: '535',
    callingCode: '+5997',
  },
  {
    name: 'Bosnia and Herzegovina',
    alpha2Code: 'BA',
    alpha3Code: 'BIH',
    numericCode: '070',
    callingCode: '+387',
  },
  {
    name: 'Botswana',
    alpha2Code: 'BW',
    alpha3Code: 'BWA',
    numericCode: '072',
    callingCode: '+267',
  },
  {
    name: 'Bouvet Island',
    alpha2Code: 'BV',
    alpha3Code: 'BVT',
    numericCode: '074',
    callingCode: '+',
  },
  {
    name: 'Brazil',
    alpha2Code: 'BR',
    alpha3Code: 'BRA',
    numericCode: '076',
    callingCode: '+55',
  },
  {
    name: 'British Indian Ocean Territory',
    alpha2Code: 'IO',
    alpha3Code: 'IOT',
    numericCode: '086',
    callingCode: '+246',
  },
  {
    name: 'United States Minor Outlying Islands',
    alpha2Code: 'UM',
    alpha3Code: 'UMI',
    numericCode: '581',
    callingCode: '+',
  },
  {
    name: 'Virgin Islands (British)',
    alpha2Code: 'VG',
    alpha3Code: 'VGB',
    numericCode: '092',
    callingCode: '+1284',
  },
  {
    name: 'Virgin Islands (U.S.)',
    alpha2Code: 'VI',
    alpha3Code: 'VIR',
    numericCode: '850',
    callingCode: '+1 340',
  },
  {
    name: 'Brunei Darussalam',
    alpha2Code: 'BN',
    alpha3Code: 'BRN',
    numericCode: '096',
    callingCode: '+673',
  },
  {
    name: 'Bulgaria',
    alpha2Code: 'BG',
    alpha3Code: 'BGR',
    numericCode: '100',
    callingCode: '+359',
  },
  {
    name: 'Burkina Faso',
    alpha2Code: 'BF',
    alpha3Code: 'BFA',
    numericCode: '854',
    callingCode: '+226',
  },
  {
    name: 'Burundi',
    alpha2Code: 'BI',
    alpha3Code: 'BDI',
    numericCode: '108',
    callingCode: '+257',
  },
  {
    name: 'Cambodia',
    alpha2Code: 'KH',
    alpha3Code: 'KHM',
    numericCode: '116',
    callingCode: '+855',
  },
  {
    name: 'Cameroon',
    alpha2Code: 'CM',
    alpha3Code: 'CMR',
    numericCode: '120',
    callingCode: '+237',
  },
  {
    name: 'Canada',
    alpha2Code: 'CA',
    alpha3Code: 'CAN',
    numericCode: '124',
    callingCode: '+1',
  },
  {
    name: 'Cabo Verde',
    alpha2Code: 'CV',
    alpha3Code: 'CPV',
    numericCode: '132',
    callingCode: '+238',
  },
  {
    name: 'Cayman Islands',
    alpha2Code: 'KY',
    alpha3Code: 'CYM',
    numericCode: '136',
    callingCode: '+1345',
  },
  {
    name: 'Central African Republic',
    alpha2Code: 'CF',
    alpha3Code: 'CAF',
    numericCode: '140',
    callingCode: '+236',
  },
  {
    name: 'Chad',
    alpha2Code: 'TD',
    alpha3Code: 'TCD',
    numericCode: '148',
    callingCode: '+235',
  },
  {
    name: 'Chile',
    alpha2Code: 'CL',
    alpha3Code: 'CHL',
    numericCode: '152',
    callingCode: '+56',
  },
  {
    name: 'China',
    alpha2Code: 'CN',
    alpha3Code: 'CHN',
    numericCode: '156',
    callingCode: '+86',
  },
  {
    name: 'Christmas Island',
    alpha2Code: 'CX',
    alpha3Code: 'CXR',
    numericCode: '162',
    callingCode: '+61',
  },
  {
    name: 'Cocos (Keeling) Islands',
    alpha2Code: 'CC',
    alpha3Code: 'CCK',
    numericCode: '166',
    callingCode: '+61',
  },
  {
    name: 'Colombia',
    alpha2Code: 'CO',
    alpha3Code: 'COL',
    numericCode: '170',
    callingCode: '+57',
  },
  {
    name: 'Comoros',
    alpha2Code: 'KM',
    alpha3Code: 'COM',
    numericCode: '174',
    callingCode: '+269',
  },
  {
    name: 'Congo',
    alpha2Code: 'CG',
    alpha3Code: 'COG',
    numericCode: '178',
    callingCode: '+242',
  },
  {
    name: 'Congo (Democratic Republic of the)',
    alpha2Code: 'CD',
    alpha3Code: 'COD',
    numericCode: '180',
    callingCode: '+243',
  },
  {
    name: 'Cook Islands',
    alpha2Code: 'CK',
    alpha3Code: 'COK',
    numericCode: '184',
    callingCode: '+682',
  },
  {
    name: 'Costa Rica',
    alpha2Code: 'CR',
    alpha3Code: 'CRI',
    numericCode: '188',
    callingCode: '+506',
  },
  {
    name: 'Croatia',
    alpha2Code: 'HR',
    alpha3Code: 'HRV',
    numericCode: '191',
    callingCode: '+385',
  },
  {
    name: 'Cuba',
    alpha2Code: 'CU',
    alpha3Code: 'CUB',
    numericCode: '192',
    callingCode: '+53',
  },
  {
    name: 'Curaçao',
    alpha2Code: 'CW',
    alpha3Code: 'CUW',
    numericCode: '531',
    callingCode: '+599',
  },
  {
    name: 'Cyprus',
    alpha2Code: 'CY',
    alpha3Code: 'CYP',
    numericCode: '196',
    callingCode: '+357',
  },
  {
    name: 'Czech Republic',
    alpha2Code: 'CZ',
    alpha3Code: 'CZE',
    numericCode: '203',
    callingCode: '+420',
  },
  {
    name: 'Denmark',
    alpha2Code: 'DK',
    alpha3Code: 'DNK',
    numericCode: '208',
    callingCode: '+45',
  },
  {
    name: 'Djibouti',
    alpha2Code: 'DJ',
    alpha3Code: 'DJI',
    numericCode: '262',
    callingCode: '+253',
  },
  {
    name: 'Dominica',
    alpha2Code: 'DM',
    alpha3Code: 'DMA',
    numericCode: '212',
    callingCode: '+1767',
  },
  {
    name: 'Dominican Republic',
    alpha2Code: 'DO',
    alpha3Code: 'DOM',
    numericCode: '214',
    callingCode: '+1809',
  },
  {
    name: 'Ecuador',
    alpha2Code: 'EC',
    alpha3Code: 'ECU',
    numericCode: '218',
    callingCode: '+593',
  },
  {
    name: 'Egypt',
    alpha2Code: 'EG',
    alpha3Code: 'EGY',
    numericCode: '818',
    callingCode: '+20',
  },
  {
    name: 'El Salvador',
    alpha2Code: 'SV',
    alpha3Code: 'SLV',
    numericCode: '222',
    callingCode: '+503',
  },
  {
    name: 'Equatorial Guinea',
    alpha2Code: 'GQ',
    alpha3Code: 'GNQ',
    numericCode: '226',
    callingCode: '+240',
  },
  {
    name: 'Eritrea',
    alpha2Code: 'ER',
    alpha3Code: 'ERI',
    numericCode: '232',
    callingCode: '+291',
  },
  {
    name: 'Estonia',
    alpha2Code: 'EE',
    alpha3Code: 'EST',
    numericCode: '233',
    callingCode: '+372',
  },
  {
    name: 'Ethiopia',
    alpha2Code: 'ET',
    alpha3Code: 'ETH',
    numericCode: '231',
    callingCode: '+251',
  },
  {
    name: 'Falkland Islands (Malvinas)',
    alpha2Code: 'FK',
    alpha3Code: 'FLK',
    numericCode: '238',
    callingCode: '+500',
  },
  {
    name: 'Faroe Islands',
    alpha2Code: 'FO',
    alpha3Code: 'FRO',
    numericCode: '234',
    callingCode: '+298',
  },
  {
    name: 'Fiji',
    alpha2Code: 'FJ',
    alpha3Code: 'FJI',
    numericCode: '242',
    callingCode: '+679',
  },
  {
    name: 'Finland',
    alpha2Code: 'FI',
    alpha3Code: 'FIN',
    numericCode: '246',
    callingCode: '+358',
  },
  {
    name: 'France',
    alpha2Code: 'FR',
    alpha3Code: 'FRA',
    numericCode: '250',
    callingCode: '+33',
  },
  {
    name: 'French Guiana',
    alpha2Code: 'GF',
    alpha3Code: 'GUF',
    numericCode: '254',
    callingCode: '+594',
  },
  {
    name: 'French Polynesia',
    alpha2Code: 'PF',
    alpha3Code: 'PYF',
    numericCode: '258',
    callingCode: '+689',
  },
  {
    name: 'French Southern Territories',
    alpha2Code: 'TF',
    alpha3Code: 'ATF',
    numericCode: '260',
    callingCode: '+',
  },
  {
    name: 'Gabon',
    alpha2Code: 'GA',
    alpha3Code: 'GAB',
    numericCode: '266',
    callingCode: '+241',
  },
  {
    name: 'Gambia',
    alpha2Code: 'GM',
    alpha3Code: 'GMB',
    numericCode: '270',
    callingCode: '+220',
  },
  {
    name: 'Georgia',
    alpha2Code: 'GE',
    alpha3Code: 'GEO',
    numericCode: '268',
    callingCode: '+995',
  },
  {
    name: 'Germany',
    alpha2Code: 'DE',
    alpha3Code: 'DEU',
    numericCode: '276',
    callingCode: '+49',
  },
  {
    name: 'Ghana',
    alpha2Code: 'GH',
    alpha3Code: 'GHA',
    numericCode: '288',
    callingCode: '+233',
  },
  {
    name: 'Gibraltar',
    alpha2Code: 'GI',
    alpha3Code: 'GIB',
    numericCode: '292',
    callingCode: '+350',
  },
  {
    name: 'Greece',
    alpha2Code: 'GR',
    alpha3Code: 'GRC',
    numericCode: '300',
    callingCode: '+30',
  },
  {
    name: 'Greenland',
    alpha2Code: 'GL',
    alpha3Code: 'GRL',
    numericCode: '304',
    callingCode: '+299',
  },
  {
    name: 'Grenada',
    alpha2Code: 'GD',
    alpha3Code: 'GRD',
    numericCode: '308',
    callingCode: '+1473',
  },
  {
    name: 'Guadeloupe',
    alpha2Code: 'GP',
    alpha3Code: 'GLP',
    numericCode: '312',
    callingCode: '+590',
  },
  {
    name: 'Guam',
    alpha2Code: 'GU',
    alpha3Code: 'GUM',
    numericCode: '316',
    callingCode: '+1671',
  },
  {
    name: 'Guatemala',
    alpha2Code: 'GT',
    alpha3Code: 'GTM',
    numericCode: '320',
    callingCode: '+502',
  },
  {
    name: 'Guernsey',
    alpha2Code: 'GG',
    alpha3Code: 'GGY',
    numericCode: '831',
    callingCode: '+44',
  },
  {
    name: 'Guinea',
    alpha2Code: 'GN',
    alpha3Code: 'GIN',
    numericCode: '324',
    callingCode: '+224',
  },
  {
    name: 'Guinea-Bissau',
    alpha2Code: 'GW',
    alpha3Code: 'GNB',
    numericCode: '624',
    callingCode: '+245',
  },
  {
    name: 'Guyana',
    alpha2Code: 'GY',
    alpha3Code: 'GUY',
    numericCode: '328',
    callingCode: '+592',
  },
  {
    name: 'Haiti',
    alpha2Code: 'HT',
    alpha3Code: 'HTI',
    numericCode: '332',
    callingCode: '+509',
  },
  {
    name: 'Heard Island and McDonald Islands',
    alpha2Code: 'HM',
    alpha3Code: 'HMD',
    numericCode: '334',
    callingCode: '+',
  },
  {
    name: 'Holy See',
    alpha2Code: 'VA',
    alpha3Code: 'VAT',
    numericCode: '336',
    callingCode: '+379',
  },
  {
    name: 'Honduras',
    alpha2Code: 'HN',
    alpha3Code: 'HND',
    numericCode: '340',
    callingCode: '+504',
  },
  {
    name: 'Hong Kong',
    alpha2Code: 'HK',
    alpha3Code: 'HKG',
    numericCode: '344',
    callingCode: '+852',
  },
  {
    name: 'Hungary',
    alpha2Code: 'HU',
    alpha3Code: 'HUN',
    numericCode: '348',
    callingCode: '+36',
  },
  {
    name: 'Iceland',
    alpha2Code: 'IS',
    alpha3Code: 'ISL',
    numericCode: '352',
    callingCode: '+354',
  },
  {
    name: 'India',
    alpha2Code: 'IN',
    alpha3Code: 'IND',
    numericCode: '356',
    callingCode: '+91',
  },
  {
    name: 'Indonesia',
    alpha2Code: 'ID',
    alpha3Code: 'IDN',
    numericCode: '360',
    callingCode: '+62',
  },
  {
    name: "Côte d'Ivoire",
    alpha2Code: 'CI',
    alpha3Code: 'CIV',
    numericCode: '384',
    callingCode: '+225',
  },
  {
    name: 'Iran (Islamic Republic of)',
    alpha2Code: 'IR',
    alpha3Code: 'IRN',
    numericCode: '364',
    callingCode: '+98',
  },
  {
    name: 'Iraq',
    alpha2Code: 'IQ',
    alpha3Code: 'IRQ',
    numericCode: '368',
    callingCode: '+964',
  },
  {
    name: 'Ireland',
    alpha2Code: 'IE',
    alpha3Code: 'IRL',
    numericCode: '372',
    callingCode: '+353',
  },
  {
    name: 'Isle of Man',
    alpha2Code: 'IM',
    alpha3Code: 'IMN',
    numericCode: '833',
    callingCode: '+44',
  },
  {
    name: 'Israel',
    alpha2Code: 'IL',
    alpha3Code: 'ISR',
    numericCode: '376',
    callingCode: '+972',
  },
  {
    name: 'Italy',
    alpha2Code: 'IT',
    alpha3Code: 'ITA',
    numericCode: '380',
    callingCode: '+39',
  },
  {
    name: 'Jamaica',
    alpha2Code: 'JM',
    alpha3Code: 'JAM',
    numericCode: '388',
    callingCode: '+1876',
  },
  {
    name: 'Japan',
    alpha2Code: 'JP',
    alpha3Code: 'JPN',
    numericCode: '392',
    callingCode: '+81',
  },
  {
    name: 'Jersey',
    alpha2Code: 'JE',
    alpha3Code: 'JEY',
    numericCode: '832',
    callingCode: '+44',
  },
  {
    name: 'Jordan',
    alpha2Code: 'JO',
    alpha3Code: 'JOR',
    numericCode: '400',
    callingCode: '+962',
  },
  {
    name: 'Kazakhstan',
    alpha2Code: 'KZ',
    alpha3Code: 'KAZ',
    numericCode: '398',
    callingCode: '+7',
  },
  {
    name: 'Kenya',
    alpha2Code: 'KE',
    alpha3Code: 'KEN',
    numericCode: '404',
    callingCode: '+254',
  },
  {
    name: 'Kiribati',
    alpha2Code: 'KI',
    alpha3Code: 'KIR',
    numericCode: '296',
    callingCode: '+686',
  },
  {
    name: 'Kuwait',
    alpha2Code: 'KW',
    alpha3Code: 'KWT',
    numericCode: '414',
    callingCode: '+965',
  },
  {
    name: 'Kyrgyzstan',
    alpha2Code: 'KG',
    alpha3Code: 'KGZ',
    numericCode: '417',
    callingCode: '+996',
  },
  {
    name: "Lao People's Democratic Republic",
    alpha2Code: 'LA',
    alpha3Code: 'LAO',
    numericCode: '418',
    callingCode: '+856',
  },
  {
    name: 'Latvia',
    alpha2Code: 'LV',
    alpha3Code: 'LVA',
    numericCode: '428',
    callingCode: '+371',
  },
  {
    name: 'Lebanon',
    alpha2Code: 'LB',
    alpha3Code: 'LBN',
    numericCode: '422',
    callingCode: '+961',
  },
  {
    name: 'Lesotho',
    alpha2Code: 'LS',
    alpha3Code: 'LSO',
    numericCode: '426',
    callingCode: '+266',
  },
  {
    name: 'Liberia',
    alpha2Code: 'LR',
    alpha3Code: 'LBR',
    numericCode: '430',
    callingCode: '+231',
  },
  {
    name: 'Libya',
    alpha2Code: 'LY',
    alpha3Code: 'LBY',
    numericCode: '434',
    callingCode: '+218',
  },
  {
    name: 'Liechtenstein',
    alpha2Code: 'LI',
    alpha3Code: 'LIE',
    numericCode: '438',
    callingCode: '+423',
  },
  {
    name: 'Lithuania',
    alpha2Code: 'LT',
    alpha3Code: 'LTU',
    numericCode: '440',
    callingCode: '+370',
  },
  {
    name: 'Luxembourg',
    alpha2Code: 'LU',
    alpha3Code: 'LUX',
    numericCode: '442',
    callingCode: '+352',
  },
  {
    name: 'Macao',
    alpha2Code: 'MO',
    alpha3Code: 'MAC',
    numericCode: '446',
    callingCode: '+853',
  },
  {
    name: 'Macedonia (the former Yugoslav Republic of)',
    alpha2Code: 'MK',
    alpha3Code: 'MKD',
    numericCode: '807',
    callingCode: '+389',
  },
  {
    name: 'Madagascar',
    alpha2Code: 'MG',
    alpha3Code: 'MDG',
    numericCode: '450',
    callingCode: '+261',
  },
  {
    name: 'Malawi',
    alpha2Code: 'MW',
    alpha3Code: 'MWI',
    numericCode: '454',
    callingCode: '+265',
  },
  {
    name: 'Malaysia',
    alpha2Code: 'MY',
    alpha3Code: 'MYS',
    numericCode: '458',
    callingCode: '+60',
  },
  {
    name: 'Maldives',
    alpha2Code: 'MV',
    alpha3Code: 'MDV',
    numericCode: '462',
    callingCode: '+960',
  },
  {
    name: 'Mali',
    alpha2Code: 'ML',
    alpha3Code: 'MLI',
    numericCode: '466',
    callingCode: '+223',
  },
  {
    name: 'Malta',
    alpha2Code: 'MT',
    alpha3Code: 'MLT',
    numericCode: '470',
    callingCode: '+356',
  },
  {
    name: 'Marshall Islands',
    alpha2Code: 'MH',
    alpha3Code: 'MHL',
    numericCode: '584',
    callingCode: '+692',
  },
  {
    name: 'Martinique',
    alpha2Code: 'MQ',
    alpha3Code: 'MTQ',
    numericCode: '474',
    callingCode: '+596',
  },
  {
    name: 'Mauritania',
    alpha2Code: 'MR',
    alpha3Code: 'MRT',
    numericCode: '478',
    callingCode: '+222',
  },
  {
    name: 'Mauritius',
    alpha2Code: 'MU',
    alpha3Code: 'MUS',
    numericCode: '480',
    callingCode: '+230',
  },
  {
    name: 'Mayotte',
    alpha2Code: 'YT',
    alpha3Code: 'MYT',
    numericCode: '175',
    callingCode: '+262',
  },
  {
    name: 'Mexico',
    alpha2Code: 'MX',
    alpha3Code: 'MEX',
    numericCode: '484',
    callingCode: '+52',
  },
  {
    name: 'Micronesia (Federated States of)',
    alpha2Code: 'FM',
    alpha3Code: 'FSM',
    numericCode: '583',
    callingCode: '+691',
  },
  {
    name: 'Moldova (Republic of)',
    alpha2Code: 'MD',
    alpha3Code: 'MDA',
    numericCode: '498',
    callingCode: '+373',
  },
  {
    name: 'Monaco',
    alpha2Code: 'MC',
    alpha3Code: 'MCO',
    numericCode: '492',
    callingCode: '+377',
  },
  {
    name: 'Mongolia',
    alpha2Code: 'MN',
    alpha3Code: 'MNG',
    numericCode: '496',
    callingCode: '+976',
  },
  {
    name: 'Montenegro',
    alpha2Code: 'ME',
    alpha3Code: 'MNE',
    numericCode: '499',
    callingCode: '+382',
  },
  {
    name: 'Montserrat',
    alpha2Code: 'MS',
    alpha3Code: 'MSR',
    numericCode: '500',
    callingCode: '+1664',
  },
  {
    name: 'Morocco',
    alpha2Code: 'MA',
    alpha3Code: 'MAR',
    numericCode: '504',
    callingCode: '+212',
  },
  {
    name: 'Mozambique',
    alpha2Code: 'MZ',
    alpha3Code: 'MOZ',
    numericCode: '508',
    callingCode: '+258',
  },
  {
    name: 'Myanmar',
    alpha2Code: 'MM',
    alpha3Code: 'MMR',
    numericCode: '104',
    callingCode: '+95',
  },
  {
    name: 'Namibia',
    alpha2Code: 'NA',
    alpha3Code: 'NAM',
    numericCode: '516',
    callingCode: '+264',
  },
  {
    name: 'Nauru',
    alpha2Code: 'NR',
    alpha3Code: 'NRU',
    numericCode: '520',
    callingCode: '+674',
  },
  {
    name: 'Nepal',
    alpha2Code: 'NP',
    alpha3Code: 'NPL',
    numericCode: '524',
    callingCode: '+977',
  },
  {
    name: 'Netherlands',
    alpha2Code: 'NL',
    alpha3Code: 'NLD',
    numericCode: '528',
    callingCode: '+31',
  },
  {
    name: 'New Caledonia',
    alpha2Code: 'NC',
    alpha3Code: 'NCL',
    numericCode: '540',
    callingCode: '+687',
  },
  {
    name: 'New Zealand',
    alpha2Code: 'NZ',
    alpha3Code: 'NZL',
    numericCode: '554',
    callingCode: '+64',
  },
  {
    name: 'Nicaragua',
    alpha2Code: 'NI',
    alpha3Code: 'NIC',
    numericCode: '558',
    callingCode: '+505',
  },
  {
    name: 'Niger',
    alpha2Code: 'NE',
    alpha3Code: 'NER',
    numericCode: '562',
    callingCode: '+227',
  },
  {
    name: 'Nigeria',
    alpha2Code: 'NG',
    alpha3Code: 'NGA',
    numericCode: '566',
    callingCode: '+234',
  },
  {
    name: 'Niue',
    alpha2Code: 'NU',
    alpha3Code: 'NIU',
    numericCode: '570',
    callingCode: '+683',
  },
  {
    name: 'Norfolk Island',
    alpha2Code: 'NF',
    alpha3Code: 'NFK',
    numericCode: '574',
    callingCode: '+672',
  },
  {
    name: "Korea (Democratic People's Republic of)",
    alpha2Code: 'KP',
    alpha3Code: 'PRK',
    numericCode: '408',
    callingCode: '+850',
  },
  {
    name: 'Northern Mariana Islands',
    alpha2Code: 'MP',
    alpha3Code: 'MNP',
    numericCode: '580',
    callingCode: '+1670',
  },
  {
    name: 'Norway',
    alpha2Code: 'NO',
    alpha3Code: 'NOR',
    numericCode: '578',
    callingCode: '+47',
  },
  {
    name: 'Oman',
    alpha2Code: 'OM',
    alpha3Code: 'OMN',
    numericCode: '512',
    callingCode: '+968',
  },
  {
    name: 'Pakistan',
    alpha2Code: 'PK',
    alpha3Code: 'PAK',
    numericCode: '586',
    callingCode: '+92',
  },
  {
    name: 'Palau',
    alpha2Code: 'PW',
    alpha3Code: 'PLW',
    numericCode: '585',
    callingCode: '+680',
  },
  {
    name: 'Palestine, State of',
    alpha2Code: 'PS',
    alpha3Code: 'PSE',
    numericCode: '275',
    callingCode: '+970',
  },
  {
    name: 'Panama',
    alpha2Code: 'PA',
    alpha3Code: 'PAN',
    numericCode: '591',
    callingCode: '+507',
  },
  {
    name: 'Papua New Guinea',
    alpha2Code: 'PG',
    alpha3Code: 'PNG',
    numericCode: '598',
    callingCode: '+675',
  },
  {
    name: 'Paraguay',
    alpha2Code: 'PY',
    alpha3Code: 'PRY',
    numericCode: '600',
    callingCode: '+595',
  },
  {
    name: 'Peru',
    alpha2Code: 'PE',
    alpha3Code: 'PER',
    numericCode: '604',
    callingCode: '+51',
  },
  {
    name: 'Philippines',
    alpha2Code: 'PH',
    alpha3Code: 'PHL',
    numericCode: '608',
    callingCode: '+63',
  },
  {
    name: 'Pitcairn',
    alpha2Code: 'PN',
    alpha3Code: 'PCN',
    numericCode: '612',
    callingCode: '+64',
  },
  {
    name: 'Poland',
    alpha2Code: 'PL',
    alpha3Code: 'POL',
    numericCode: '616',
    callingCode: '+48',
  },
  {
    name: 'Portugal',
    alpha2Code: 'PT',
    alpha3Code: 'PRT',
    numericCode: '620',
    callingCode: '+351',
  },
  {
    name: 'Puerto Rico',
    alpha2Code: 'PR',
    alpha3Code: 'PRI',
    numericCode: '630',
    callingCode: '+1',
  },
  {
    name: 'Qatar',
    alpha2Code: 'QA',
    alpha3Code: 'QAT',
    numericCode: '634',
    callingCode: '+974',
  },
  {
    name: 'Republic of Kosovo',
    alpha2Code: 'XK',
    alpha3Code: 'KOS',
    numericCode: undefined,
    callingCode: '+383',
  },
  {
    name: 'Réunion',
    alpha2Code: 'RE',
    alpha3Code: 'REU',
    numericCode: '638',
    callingCode: '+262',
  },
  {
    name: 'Romania',
    alpha2Code: 'RO',
    alpha3Code: 'ROU',
    numericCode: '642',
    callingCode: '+40',
  },
  {
    name: 'Russian Federation',
    alpha2Code: 'RU',
    alpha3Code: 'RUS',
    numericCode: '643',
    callingCode: '+7',
  },
  {
    name: 'Rwanda',
    alpha2Code: 'RW',
    alpha3Code: 'RWA',
    numericCode: '646',
    callingCode: '+250',
  },
  {
    name: 'Saint Barthélemy',
    alpha2Code: 'BL',
    alpha3Code: 'BLM',
    numericCode: '652',
    callingCode: '+590',
  },
  {
    name: 'Saint Helena, Ascension and Tristan da Cunha',
    alpha2Code: 'SH',
    alpha3Code: 'SHN',
    numericCode: '654',
    callingCode: '+290',
  },
  {
    name: 'Saint Kitts and Nevis',
    alpha2Code: 'KN',
    alpha3Code: 'KNA',
    numericCode: '659',
    callingCode: '+1869',
  },
  {
    name: 'Saint Lucia',
    alpha2Code: 'LC',
    alpha3Code: 'LCA',
    numericCode: '662',
    callingCode: '+1758',
  },
  {
    name: 'Saint Martin (French part)',
    alpha2Code: 'MF',
    alpha3Code: 'MAF',
    numericCode: '663',
    callingCode: '+590',
  },
  {
    name: 'Saint Pierre and Miquelon',
    alpha2Code: 'PM',
    alpha3Code: 'SPM',
    numericCode: '666',
    callingCode: '+508',
  },
  {
    name: 'Saint Vincent and the Grenadines',
    alpha2Code: 'VC',
    alpha3Code: 'VCT',
    numericCode: '670',
    callingCode: '+1784',
  },
  {
    name: 'Samoa',
    alpha2Code: 'WS',
    alpha3Code: 'WSM',
    numericCode: '882',
    callingCode: '+685',
  },
  {
    name: 'San Marino',
    alpha2Code: 'SM',
    alpha3Code: 'SMR',
    numericCode: '674',
    callingCode: '+378',
  },
  {
    name: 'Sao Tome and Principe',
    alpha2Code: 'ST',
    alpha3Code: 'STP',
    numericCode: '678',
    callingCode: '+239',
  },
  {
    name: 'Saudi Arabia',
    alpha2Code: 'SA',
    alpha3Code: 'SAU',
    numericCode: '682',
    callingCode: '+966',
  },
  {
    name: 'Senegal',
    alpha2Code: 'SN',
    alpha3Code: 'SEN',
    numericCode: '686',
    callingCode: '+221',
  },
  {
    name: 'Serbia',
    alpha2Code: 'RS',
    alpha3Code: 'SRB',
    numericCode: '688',
    callingCode: '+381',
  },
  {
    name: 'Seychelles',
    alpha2Code: 'SC',
    alpha3Code: 'SYC',
    numericCode: '690',
    callingCode: '+248',
  },
  {
    name: 'Sierra Leone',
    alpha2Code: 'SL',
    alpha3Code: 'SLE',
    numericCode: '694',
    callingCode: '+232',
  },
  {
    name: 'Singapore',
    alpha2Code: 'SG',
    alpha3Code: 'SGP',
    numericCode: '702',
    callingCode: '+65',
  },
  {
    name: 'Sint Maarten (Dutch part)',
    alpha2Code: 'SX',
    alpha3Code: 'SXM',
    numericCode: '534',
    callingCode: '+1721',
  },
  {
    name: 'Slovakia',
    alpha2Code: 'SK',
    alpha3Code: 'SVK',
    numericCode: '703',
    callingCode: '+421',
  },
  {
    name: 'Slovenia',
    alpha2Code: 'SI',
    alpha3Code: 'SVN',
    numericCode: '705',
    callingCode: '+386',
  },
  {
    name: 'Solomon Islands',
    alpha2Code: 'SB',
    alpha3Code: 'SLB',
    numericCode: '090',
    callingCode: '+677',
  },
  {
    name: 'Somalia',
    alpha2Code: 'SO',
    alpha3Code: 'SOM',
    numericCode: '706',
    callingCode: '+252',
  },
  {
    name: 'South Africa',
    alpha2Code: 'ZA',
    alpha3Code: 'ZAF',
    numericCode: '710',
    callingCode: '+27',
  },
  {
    name: 'South Georgia and the South Sandwich Islands',
    alpha2Code: 'GS',
    alpha3Code: 'SGS',
    numericCode: '239',
    callingCode: '+500',
  },
  {
    name: 'Korea (Republic of)',
    alpha2Code: 'KR',
    alpha3Code: 'KOR',
    numericCode: '410',
    callingCode: '+82',
  },
  {
    name: 'South Sudan',
    alpha2Code: 'SS',
    alpha3Code: 'SSD',
    numericCode: '728',
    callingCode: '+211',
  },
  {
    name: 'Spain',
    alpha2Code: 'ES',
    alpha3Code: 'ESP',
    numericCode: '724',
    callingCode: '+34',
  },
  {
    name: 'Sri Lanka',
    alpha2Code: 'LK',
    alpha3Code: 'LKA',
    numericCode: '144',
    callingCode: '+94',
  },
  {
    name: 'Sudan',
    alpha2Code: 'SD',
    alpha3Code: 'SDN',
    numericCode: '729',
    callingCode: '+249',
  },
  {
    name: 'Suriname',
    alpha2Code: 'SR',
    alpha3Code: 'SUR',
    numericCode: '740',
    callingCode: '+597',
  },
  {
    name: 'Svalbard and Jan Mayen',
    alpha2Code: 'SJ',
    alpha3Code: 'SJM',
    numericCode: '744',
    callingCode: '+4779',
  },
  {
    name: 'Swaziland',
    alpha2Code: 'SZ',
    alpha3Code: 'SWZ',
    numericCode: '748',
    callingCode: '+268',
  },
  {
    name: 'Sweden',
    alpha2Code: 'SE',
    alpha3Code: 'SWE',
    numericCode: '752',
    callingCode: '+46',
  },
  {
    name: 'Switzerland',
    alpha2Code: 'CH',
    alpha3Code: 'CHE',
    numericCode: '756',
    callingCode: '+41',
  },
  {
    name: 'Syrian Arab Republic',
    alpha2Code: 'SY',
    alpha3Code: 'SYR',
    numericCode: '760',
    callingCode: '+963',
  },
  {
    name: 'Taiwan, China',
    alpha2Code: 'TW',
    alpha3Code: 'TWN',
    numericCode: '158',
    callingCode: '+886',
  },
  {
    name: 'Tajikistan',
    alpha2Code: 'TJ',
    alpha3Code: 'TJK',
    numericCode: '762',
    callingCode: '+992',
  },
  {
    name: 'Tanzania, United Republic of',
    alpha2Code: 'TZ',
    alpha3Code: 'TZA',
    numericCode: '834',
    callingCode: '+255',
  },
  {
    name: 'Thailand',
    alpha2Code: 'TH',
    alpha3Code: 'THA',
    numericCode: '764',
    callingCode: '+66',
  },
  {
    name: 'Timor-Leste',
    alpha2Code: 'TL',
    alpha3Code: 'TLS',
    numericCode: '626',
    callingCode: '+670',
  },
  {
    name: 'Togo',
    alpha2Code: 'TG',
    alpha3Code: 'TGO',
    numericCode: '768',
    callingCode: '+228',
  },
  {
    name: 'Tokelau',
    alpha2Code: 'TK',
    alpha3Code: 'TKL',
    numericCode: '772',
    callingCode: '+690',
  },
  {
    name: 'Tonga',
    alpha2Code: 'TO',
    alpha3Code: 'TON',
    numericCode: '776',
    callingCode: '+676',
  },
  {
    name: 'Trinidad and Tobago',
    alpha2Code: 'TT',
    alpha3Code: 'TTO',
    numericCode: '780',
    callingCode: '+1868',
  },
  {
    name: 'Tunisia',
    alpha2Code: 'TN',
    alpha3Code: 'TUN',
    numericCode: '788',
    callingCode: '+216',
  },
  {
    name: 'Turkey',
    alpha2Code: 'TR',
    alpha3Code: 'TUR',
    numericCode: '792',
    callingCode: '+90',
  },
  {
    name: 'Turkmenistan',
    alpha2Code: 'TM',
    alpha3Code: 'TKM',
    numericCode: '795',
    callingCode: '+993',
  },
  {
    name: 'Turks and Caicos Islands',
    alpha2Code: 'TC',
    alpha3Code: 'TCA',
    numericCode: '796',
    callingCode: '+1649',
  },
  {
    name: 'Tuvalu',
    alpha2Code: 'TV',
    alpha3Code: 'TUV',
    numericCode: '798',
    callingCode: '+688',
  },
  {
    name: 'Uganda',
    alpha2Code: 'UG',
    alpha3Code: 'UGA',
    numericCode: '800',
    callingCode: '+256',
  },
  {
    name: 'Ukraine',
    alpha2Code: 'UA',
    alpha3Code: 'UKR',
    numericCode: '804',
    callingCode: '+380',
  },
  {
    name: 'United Arab Emirates',
    alpha2Code: 'AE',
    alpha3Code: 'ARE',
    numericCode: '784',
    callingCode: '+971',
  },
  {
    name: 'United Kingdom of Great Britain and Northern Ireland',
    alpha2Code: 'GB',
    alpha3Code: 'GBR',
    numericCode: '826',
    callingCode: '+44',
  },
  {
    name: 'United States of America',
    alpha2Code: 'US',
    alpha3Code: 'USA',
    numericCode: '840',
    callingCode: '+1',
  },
  {
    name: 'Uruguay',
    alpha2Code: 'UY',
    alpha3Code: 'URY',
    numericCode: '858',
    callingCode: '+598',
  },
  {
    name: 'Uzbekistan',
    alpha2Code: 'UZ',
    alpha3Code: 'UZB',
    numericCode: '860',
    callingCode: '+998',
  },
  {
    name: 'Vanuatu',
    alpha2Code: 'VU',
    alpha3Code: 'VUT',
    numericCode: '548',
    callingCode: '+678',
  },
  {
    name: 'Venezuela (Bolivarian Republic of)',
    alpha2Code: 'VE',
    alpha3Code: 'VEN',
    numericCode: '862',
    callingCode: '+58',
  },
  {
    name: 'Viet Nam',
    alpha2Code: 'VN',
    alpha3Code: 'VNM',
    numericCode: '704',
    callingCode: '+84',
  },
  {
    name: 'Wallis and Futuna',
    alpha2Code: 'WF',
    alpha3Code: 'WLF',
    numericCode: '876',
    callingCode: '+681',
  },
  {
    name: 'Western Sahara',
    alpha2Code: 'EH',
    alpha3Code: 'ESH',
    numericCode: '732',
    callingCode: '+212',
  },
  {
    name: 'Yemen',
    alpha2Code: 'YE',
    alpha3Code: 'YEM',
    numericCode: '887',
    callingCode: '+967',
  },
  {
    name: 'Zambia',
    alpha2Code: 'ZM',
    alpha3Code: 'ZMB',
    numericCode: '894',
    callingCode: '+260',
  },
  {
    name: 'Zimbabwe',
    alpha2Code: 'ZW',
    alpha3Code: 'ZWE',
    numericCode: '716',
    callingCode: '+263',
  },
];

@Pipe({
  name: 'country',
})
export class CountryPipe implements PipeTransform {
  countries = COUNTRIES_DB;

  transform(alpha2Code: string): string {
    const foundCountry: Country = this.countries.find(
      (c) => c.alpha2Code === alpha2Code,
    ) as Country;
    return foundCountry?.alpha2Code ?? '';
  }
}
