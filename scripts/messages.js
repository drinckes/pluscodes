/*
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

/**
 * Get strings depending on the browser language setting.
 *
 * This has all the messages for the UI defined. Each message is defined for
 * all the languages, keeping all the definitions together. This is in contrast
 * to other localisation methods that have separate files per language. We need
 * to load everything, so that it's cached, so there's no benefit in splitting
 * the messages across multiple files. Having all local versions of a message
 * next to each other makes it easier to notice when messages change.
 *
 * @this Messages
 */
function Messages() {
  // Define the list of languages. The first is the browser language preference,
  // the second is which language code in our messages to use.
  this.languageMap = {
      'en': 'en',       // English
      'fr': 'fr',       // French
      'pt': 'pt-PT',    // Portuguese
      'pt-PT': 'pt-PT', // Portuguese (Portugal)
      'pt-BR': 'pt-BR', // Portuguese (Brazil)
      'ur': 'ur',       // Urdu
      'sd': 'sd',       // Sindhi
      'skr': 'skr'      // Saraiki
  };

  // Define all the messages inline for all languages. Since they would all be
  // included in the appcache, this doesn't cost any more memory or load time.
  this.messages = {
      // Displayed in the search box. Must be short for mobile devices.
      'input-prompt': {
          'en': 'Enter a plus+code, address or drag the map',
          // TODO: validate translations
          'fr': 'Saisissez un plus+code, une adresse ou cliquez sur ' +
                'la carte',
          'pt-BR': 'Digite um plus+code, endereço ou clique no mapa',
          'pt-PT': 'Insira um plus+code, endereço ou clique no mapa',
          'ur': '.ایک کوڈ ، ایڈریس درج کریں یا نقشہ پر کلک کریں',
          'sd': 'ھڪڙو ڪوڊ ايڊريس درج ڪيو يا  نقشي تي ڪلڪ ڪيو',
          'skr': '.ھکرا کوڈ ، ایڈریس لکھ  یا نقشہ  تے کلک کر'
      },
      // Displayed if the map can't be loaded, e.g. we're offline.
      'map-error': {
          'en': '<p>Cannot load Google Maps. Make sure you have a working ' +
                'network and try reloading the page.</p><p>You can enter ' +
                'enter plus+codes with or without the area code, and use ' +
                'the compass, but you will not be able to enter addresses, ' +
                'or plus+codes with addresses, until maps are displayed.</p>',
          // TODO: validate translations
          'fr': '<p>Impossible de charger Google Maps. Assurez-vous d’avoir ' +
                'une connection Internetet essayez de recharger la page.</p>' +
                '<p>Vous pouvez toujours saisir codes, et utiliser la ' +
                'boussole, mais vous ne pourrez pas saisir d’adresse, ' +
                'de code postaux avant que la carte ne s’affiche.</p>',
          'pt-BR': '<p>Não foi possível carregar o Google Maps. Verifique ' +
                'sua conexão com a Internet e tente recarregar a página.</p>' +
                '<p>Você ainda pode digitar códigos completos (XXXX.XXXXXX) ' +
                'ou abreviados (XXXXXX), e usar a bússola, mas você não ' +
                'poderá digitar endereços, ou códigos abreviados com ' +
                'endereços, até os mapas serem exibidos.</p>',
          'pt-PT': '<p>Não foi possível carregar o Google Maps. Verifique a' +
                'sua ligação à Internet e tente recarregar a página.</p>' +
                '<p>Você ainda pode inserir códigos completos (XXXX.XXXXXX) ' +
                'ou abreviados (XXXXXX), e usar a bússola, mas não poderá ' +
                'inserir endereços, ou códigos abreviados com endereços, ' +
                'até os mapas serem exibidos.</p>',
          'ur': '<p>گوگل نقشہ جات لوڈ نہیں کر سکتے ہیں. آٓپ ورکنگ نیٹ ورک کی موجودگی  کو یقیںی بناءے ' +
                'اور پیج دوبارہ لوڈ کریں۔</p><p> (XXXXXX)اور  مختصر(XXXX.XXXXXX)آپ اب بھی مکمل ' +
                'کوڈ درج کر سکتے ہیں اور قطب نما استعمال کریں لیکن آپ ایڈریس ' +
                ' داخل کرنے کے قابل نہیں ہوں گے یا ایڈریس کے ساتھ ' +
                'مختصر کوڈ یہاں تک کہ نقشے دکھائے جاءیں۔',
          'sd': '<p>گوگل نقشو لوڊ نٿا ڪري سگھيوتوھان ورڪنگ نيٽ ورڪ جي موجودگي کي يقيني بڻايو ' +
                '۽ پيج وري لوڊ ڪيو۔</p><p> (XXXXXX)۽ مختصر(XXXX.XXXXXX)توھان ھاڻي بہ مڪمل ' +
                'ڪوڊ درج ڪري سگھيو ٿا ۽ قطب نما استعمال ڪيو پر توھان ايڊريس ' +
                ' داخل ڪرڻ جي قابل ڪون ھوندا يا وري ايڊريس سان گڏ ' +
                'مختصر ڪوڊ نقشو ڏيکارڻ۔',
          'skr': '<p>گوگل نقشہ جات لوڈ کونھی تھی سگھدا. توساں ورکنگ نیٹ ورک دی موجودگی  کوں یقیںی ٹھایو ' +
                'ائیں  پیج کوں ول لوڈ کرس۔</p><p> (XXXXXX)ائیں ننڈا(XXXX.XXXXXX)ٔتوساں ھاڑیں بی پورا '+
                'کوڈ لکھ سگھ دے ہو ائیں قطب نما استعمال کروس پر توساں ایڈریس ' +
                ' گھتڑ دے قابل کون ہو سو یا ایڈریس نڑ گڈ ' +
                'ننڈا کوڈ جیس تائیں نقشا ڈیکھالن۔',
      },
      // Displayed if the browser does not support location or orientation.
      'browser-problem-msg': {
          'en': '<p>The browser you are using does not support all the ' +
                'features we need, such as location and compass.</p><p>We ' +
                'recommend upgrading to Chrome, Firefox or Opera.</p>',
          'fr': '<p>Votre navigateur n’est pas compatible avec les ' +
                'fonctionnalités que nous proposons, comme la localisation ' +
                'et la boussole.</p><p>Nous vous recommandons de passer à Chrome, Firefox ou Opera.</p>',
          'pt-BR': '<p>O navegador que você está usando não suporta todas ' +
                'as funcionalidades que precisamos, como local e bússola.</p>' +
                '<p>Nós recomendamos usar o Chrome, Firefox ou Opera mais recentes.</p>',
          'pt-PT': '<p>O navegador que você está a usar não suporta todas ' +
                'as funcionalidades que precisamos, como localização e bússola.</p>' +
                '<p>Recomendamos usar o Chrome, Firefox ou Opera mais recentes.</p>',
          'ur': '<p>براؤزر آپ استعمال کررہے ہیں ہماری تمام ضروری خصوصیات کی ' +
                'حمایت نہیں کرتا ،جس طرح محل وقوع اور قطب نما۔</p><p>ہم سفارش ' +
                '.کرتے ہیں کروم، فائر فاکس اور اوپیرا</p>.',
          'sd': '<p>جيڪو برائوزر توھان  استعمال ڪريو ٿا اسان جي سڄي  خصوصيات کي ' +
                'حمايت نٿو ڪري ھاڻي جگھ ۽ ڪمپاس۔</p><p>اسان سفارش ' +
                '.ڪندا اھيون ڪروم فائرفوڪس۽ اوپيرا</p>.',
          'skr': '<p>جیکو براؤزر توساں استعمال کریندے پاءے ھو اوھو اساڈی پوری خصوصیات دی ' +
                'حمایت کونی کریندا،جیؑیں جگہ اور اور قطب نما۔</p><p>اساں سفارش ' +
                '.کریندے ہوں کروم، فائر فاکس اور اوپیرا</p>.'
      },
      // To shorten a code we need address information, but we don't have any
      // here.
      'geocoder-no-info': {
          'en': 'Google\'s geocoder service has no address information in ' +
                'this area. You might be able to use OLC with the name of a ' +
                'large town, if there is one within 40km.',
          'fr': 'Google geocoder n’a pas d’information d’adresse pour cette ' +
                'zone. Vous pourriez utiliser OLC avec le nom d’une grande ' +
                'ville, s’il y en a une dans les 40kms aux alentours.',
          'pt-BR': 'O serviço <i>geocoder</i> da Google não tem informações ' +
                'de endereço nessa área. Você pode ser capaz de utilizar OLC ' +
                'com o nome de uma grande cidade, se existir uma em até 40km.',
          'pt-PT': 'O serviço <i>geocoder</i> da Google não tem informações ' +
                'de endereço nesta área. É possível que consiga usar o OLC ' +
                'com o nome de uma grande cidade, se existir uma num raio de 40km.',
          'ur': 'گوگل جیوکوڈرسروس کو اس علاقے میں کوئی پتہ کی معلومات نہیں ہے۔ ' +
                'آپ ایک بڑے شہر کے نام کے   ساتھ استعمال کرنے OLC ' +
                '.کے قابل ہو سکتےہیں، اگر 40km کے اندر موجود ہے',
          'sd': 'گوگل جيو ڪوڊر جي سروس کي ھن علائقي ۾ اھيو پتو خبر ناھي۔ ' +
                'تواھان ھڪڙي  وڏي شھر جي نالي سان گڏ استعمال  OLC ' +
                '.ڪري سگھيو ٿا اگر تہ ھکڙي ۾ اھي',
          'skr': 'گوگل جیوکوڈرسروس کوں اینھ علاقے چو کوئی کم دی معلومات کونی۔ ' +
                ' توساں ھکڑے وڈے شہر دے  نالے نڑ گڈ استعمال کرڑ OLC ' +
                '.دے قابل  تھی  سگھدے ہو، اگر ھکڑے دے  اندر موجود ہے'
      },
      // Displayed in a dialog when the user enters a short code and we have
      // neither a map nor the user location.
      'extend-failure-msg': {
          'en': '<p>To work out where <i><b>OLC</b></i> is, we need your ' +
                'current location, or you need to include a town or city in ' +
                'the information.</p><p>Check that your browser is allowing ' +
                'location, and that location services are enabled on your ' +
                'device.</p>',
          'fr': '<p>Pour déterminer où se situe<i><b>OLC</b></i>, nous ' +
                'avons besoin de votre position actuelle, ou alors vous ' +
                'pouvez inclure un nom de ville dans votre saisie.</p>' +
                '<p>Vérifiez que votre navigateur autorise la localisation ' +
                'et que les services de localisation soient activés sur ' +
                'votre périphérique.</p>',
          'pt-BR': '<p>Para descobrir onde <i><b>OLC</b></i> está, nós ' +
                'precisamos do seu local atual, ou você precisa incluir ' +
                'as informações da cidade.</p><p>Verifique que seu ' +
                'navegador está permitindo localização, e que serviços de ' +
                'localização estão habilitados no seu dispositivo.</p>',
          'pt-PT': '<p>Para descobrir onde <i><b>OLC</b></i> está, nós ' +
                'precisamos da sua localização atual, ou você terá que ' +
                'incluir as informações da cidade.</p><p>Verifique que o ' +
                'seu navegador está a permitir o acesso à localização, e ' +
                'que serviços de localização estão ativados no seu ' +
                'dispositivo.</p>',
          'ur': '<p>کے باہر کام کرنے کے لئے ہمیں آپ کی موجودہ جگہ کی ضرورت ہے<i><b>OLC</b></i> ' +
                'یا آپ کو کے ایک قصبے یا شہر کی  معلومات  شامل کرنے ضرورت ہے۔</p> ' +
                '<p>جانچ پڑتال کریں کہ براؤزر کی موجودہ جگہ کی اجازت دیتا ہے ' +
                '.اس مقام کی خدمات آپ کے آلہ پر فعال ہیں</p>',
          'sd': '<p>جي ٻاھر کم ڪرڻ جي لائي اسان کي تواھان ھاڻي واري جڳہ کپي<i><b>OLC</b></i> ' +
                'يا توھان کي ھڪڙي ڳوٺ يا شھر جي خبر ڏيڻ جي ضرورت اھي۔</p> ' +
                '<p>ڏسو تہ برائوزر ھاڻي واري جڳہ جي اجاذت ڏئي ٿوs ' +
                '.ھن مقام  جي سروس توھان جي ڊيوائس تي ھلي ٿي</p>',
          'skr': '<p>دے باہر کم کرڑ دے لائ اساں  کو توساں دی موجودہ جگہ دی ضرورت ہے<i><b>OLC</b></i> ' +
                'یا توساں کو ھکڑے  گوٹھ یا شہر دی  معلومات  شامل  کرڑ دی ضرورت ہے۔</p> ' +
                '<p>جانچ پڑتال کرو  تہ براؤزر دی موجودہ جگہ دی اجازت ڈیندا ہے ' +
                '.اینھں مقام دی خدمات توساں ڈے آلہ  تے کم کریندے ھن</p>'
      },
      // Messages starting with geocode- are displayed if the geocoder service
      // has errors. They should be self-explanatory, although there isn't much
      // the user can do other than wait and try in a few seconds.
      'geocode-not-loaded': {
          'en': 'Google\'s address service is not loaded, can\'t locate "ADDRESS".',
          // TODO: Modify other translations
          'fr': 'Google Adresse ne peut pas localiser "ADDRESS".',
          'pt-BR': 'O serviço de endereços do Google não está carregado; não é' +
                'possível localizar "ADDRESS".',
          'pt-PT': 'O serviço de endereços do Google não está carregado; não é' +
                'possível localizar "ADDRESS".',
          'ur': '"ADDRESS" گوگل ایڈریس سروس تلاش نہیں کرسکتا .',
          'sd': '"ADDRESS"گوگل ايڊريس سروس سڃاڻپ نٿو ڪري سگھي .',
          'skr': '"ADDRESS" گوگل ایڈریس سروس تلاش نہیں کرسکتا .'
      },
      'geocode-fail': {
          'en': 'Google\'s address service can\'t locate "ADDRESS".',
          'fr': 'Google Adresse ne peut pas localiser "ADDRESS".',
          'pt-BR': 'O serviço de endereços do Google não conseguiu localizar ' +
                '"ADDRESS".',
          'pt-PT': 'O serviço de endereços do Google não conseguiu localizar ' +
                '"ADDRESS".',
          'ur': '"ADDRESS" گوگل ایڈریس سروس تلاش نہیں کرسکتا .',
          'sd': '"ADDRESS"گوگل ايڊريس سروس سڃاڻپ نٿو ڪري سگھي .',
          'skr': '"ADDRESS" گوگل ایڈریس سروس تلاش نہیں کرسکتا .'
      },
      'geocode-fail-limit': {
          'en': 'Could not locate "ADDRESS" (Google\'s geocoder service ' +
                'over query limit)',
          'fr': 'Impossible de localiser "ADDRESS" (limite de la ' +
                'requête Google geocoder)',
          'pt-BR': 'Não foi possível localizar "ADDRESS" (O serviço ' +
                '<i>geocoder</i> do Google ultrapassou o limite de consultas)',
          'pt-PT': 'Não foi possível localizar "ADDRESS" (O serviço ' +
                '<i>geocoder</i> do Google ultrapassou o limite de consultas)',
          'ur': 'گوگل  جیوکوڈر کی سروس  )"ADDRESS"تلاش نہیں کر سکا ' +
                '(طلب کی حد کو پار کررہی ہے',
          'sd': 'گوگل جيو ڪوڏر جي سروس  )"ADDRESS"تلاش نہ ڪري سگھيو ' +
                '(طلب جي حد کي پار  ڪري ٿو',
          'skr': 'گوگل  جیوکوڈر کی سروس  )"ADDRESS"تلاش نہیں کر سکا ' +
                '(طلب کی حد کو پار کررہی ہے'
      },
      'geocode-fail-deny': {
          'en': 'Could not locate "ADDRESS" (Google\'s geocoder service ' +
                'is not available)',
          'fr': 'Impossible de localiser "ADDRESS" (Google geocoder ' +
                'n’est pas disponible)',
          'pt-BR': 'Não foi possível localizar "ADDRESS" (O serviço ' +
                '<i>geocoder</i> do Google não está disponível)',
          'pt-PT': 'Não foi possível localizar "ADDRESS" (O serviço ' +
                '<i>geocoder</i> do Google não está disponível)',
          'ur': 'گوگل  جیوکوڈر کی سروس  )"ADDRESS"تلاش نہیں کر سکا ' +
                '(موجود نہیں ہے',
          'sd': 'گوگل جيو ڪوڏر جي سروس  )"ADDRESS"تلاش نہ ڪري سگھيو ' +
                '(موجود نا اھي',
          'skr': 'گوگل  جیوکوڈر کی سروس  )"ADDRESS"تلاش نہیں کر سکا ' +
                '(موجود نہیں ہے'
      },
      'geocode-fail-reject': {
          'en': 'Could not locate "ADDRESS" (Google\'s geocoder ' +
                'service rejected our request)',
          'fr': 'Impossible de localiser "ADDRESS" (Google geocoder a ' +
                'rejeté notre demande)',
          'pt-BR': 'Não foi possível localizar "ADDRESS" (O serviço ' +
                '<i>geocoder</i> do Google rejeitou nossa requisição)',
          'pt-PT': 'Não foi possível localizar "ADDRESS" (O serviço ' +
                '<i>geocoder</i> do Google rejeitou a nossa requisição)',
          'ur': ' گوگل  جیوکوڈر کی)"ADDRESS"تلاش نہیں کر سکا' +
                '(سروس نے ہماری درخواست کو مسترد کر دیا',
          'sd': 'گوگل جيو ڪوڊر جي سروس  )"ADDRESS"تلاش نہ ڪري سگھيو' +
                '( اسان جي درخواست نٿو مڄي',
          'skr': ' گوگل  جیوکوڈر کی)"ADDRESS"تلاش نہیں کر سکا' +
                 '(سروس نے ہماری درخواست کو مسترد کر دیا'
      },
      'geocode-fail-error': {
          'en': 'Could not locate "ADDRESS" (Google\'s geocoder service ' +
                'had an error)',
          'fr': 'Impossible de localiser "ADDRESS" (Google geocoder a ' +
                'rencontré une erreur)',
          'pt-BR': 'Não foi possível localizar "ADDRESS" (O serviço ' +
                '<i>geocoder</i> do Google teve um erro)',
          'pt-PT': 'Não foi possível localizar "ADDRESS" (O serviço ' +
                '<i>geocoder</i> do Google teve um erro)',
          'ur':  '( گوگل  جیوکوڈر کی خدمت میں ایک نقص تھا)"ADDRESS"تلاش نہیں کر سکا ',
          'sd':  '( گوگل جيو ڪوڊر جي سروس ۾ ھڪڙي خرابي اھي)"ADDRESS"تلاش نہ ڪري سگھيو ',
          'skr':  '( گوگل  جیوکوڈر کی خدمت میں ایک نقص تھا)"ADDRESS"تلاش نہیں کر سکا '
      },
      'geocode-reverse-zero': {
          'en': 'Could not get any locality information (Google\'s geocoder ' +
                'service returned no results)',
          'fr': 'Impossible d’obtenir des informations sur la localité ' +
                '(Google geocoder n’a pas renvoyé de résultat)',
          'pt-BR': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço <i>geocoder</i> do Google não retornou resultados)',
          'pt-PT': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço <i>geocoder</i> do Google não retornou resultados)',
          'ur': 'کسی بھی علاقے کے بارے میں معلومات نہیں مل سکی(گوگل  جیوکوڈرکی ' +
                'یسروس کا کوئی نتیجہ نہیں آیا',
          'sd': 'ڪھڙي بہ علائقي جي معلو مات نٿي ملي سڳي(گوگل جيو ڪوڊر جي ' +
                'سروس جو ڪو بہ نتيجو ڪون ايو',
          'skr': 'کسی بھی علاقے کے بارے میں معلومات نہیں مل سکی(گوگل  جیوکوڈرکی ' +
                'یسروس کا کوئی نتیجہ نہیں آیا'
      },
      'geocode-reverse-limit': {
          'en': 'Could not get any locality information (Google\'s geocoder ' +
                'service over query limit)',
          'fr': 'Impossible d’obtenir des informations sur la localité ' +
                '(limite de la requête Google geocoder)',
          'pt-BR': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço <i>geocoder</i> do Google ultrapassou o limite ' +
                'de consultas)',
          'pt-PT': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço <i>geocoder</i> do Google ultrapassou o limite ' +
                'de consultas)',
          'ur': 'کسی بھی علاقے کے بارے میں معلومات نہیں مل سکی(گوگل  جیوکوڈرکی ' +
                '(خدمت طلب کی حد کو پار کررہی ہے',
          'sd': 'ڪھڙي بہ علائقہ جي معلو مات نٿي ملي سڳي(گوگل جيو ڪوڏر جي  ' +
                '(خدمت طلب جي حد کي پار ڪري ٿو',
          'skr': 'کسی بھی علاقے کے بارے میں معلومات نہیں مل سکی(گوگل  جیوکوڈرکی ' +
                '(خدمت طلب کی حد کو پار کررہی ہے'
      },
      'geocode-reverse-deny': {
          'en': 'Could not get any locality information (Google\'s geocoder ' +
                'service is not avilable)',
          'fr': 'Impossible d’obtenir des informations sur la localité ' +
                '(Google geocoder n’est pas disponible)',
          'pt-BR': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço de <i>geocoder</i> do Google não está disponível)',
          'pt-PT': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço de <i>geocoder</i> do Google não está disponível)',
          'ur': 'کسی بھی علاقے کے بارے میں معلومات نہیں مل سکی(گوگل  جیوکوڈرکی ' +
                '( سروس موجود نہیں ہے',
          'sd': 'ڪھڙي بہ علائقہ جي معلو مات نٿي ملي سڳي(گوگل جيو ڪوڏر جي' +
                '( سروس موجود ڪون اھي',
          'skr': 'کسی بھی علاقے کے بارے میں معلومات نہیں مل سکی(گوگل  جیوکوڈرکی ' +
                '( سروس موجود نہیں ہے'
      },
      'geocode-reverse-reject': {
          'en': 'Could not get any locality information (Google\'s geocoder ' +
                'service rejected our request)',
          'fr': 'Impossible d’obtenir des informations sur la localité ' +
                '(Google geocoder a rejeté notre demande)',
          'pt-BR': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço <i>geocoder</i> do Google rejeitou nossa requisição)',
          'pt-PT': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço <i>geocoder</i> do Google rejeitou a nossa requisição)',
          'ur': 'کسی بھی علاقے کے بارے میں معلومات نہیں مل سکی(گوگل  جیوکوڈر ' +
                'کی سروس نے ہماری درخواست کو مسترد کر دیا',
          'sd': 'ڪھڙي بہ علائقہ جي معلو مات نٿي ملي سڳي(گوگل جيو ڪوڏر جي ' +
                ' سروس اسان جي درخواست نٿو مڄي',
          'skr': 'کسی بھی علاقے کے بارے میں معلومات نہیں مل سکی(گوگل  جیوکوڈر ' +
                'کی سروس نے ہماری درخواست کو مسترد کر دیا'
      },
      'geocode-reverse-error': {
          'en': 'Could not get any locality information (Google\'s geocoder ' +
                'service had an error)',
          'fr': 'Impossible d’obtenir des informations sur la localité ' +
                '(Google geocoder a rencontré une erreur)',
          'pt-BR': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço <i>geocoder</i> do Google teve um erro)',
          'pt-PT': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço <i>geocoder</i> do Google teve um erro)',
          'ur': 'کسی بھی علاقے کے بارے میں معلومات نہیں مل سکی(گوگل  جیوکوڈر ' +
                '(کی خدمت میں ایک نقص تھا',
          'sd': 'ڪھڙي بہ علائقہ جي معلو مات نٿي ملي سڳي(گوگل جيو ڪوڏر جي ' +
                '(کی خدمت ۾ ھڪڙي کرابي اھي',
          'skr': 'کسی بھی علاقے کے بارے میں معلومات نہیں مل سکی(گوگل  جیوکوڈر ' +
                '(کی خدمت میں ایک نقص تھا'
      },
      // View this location in another map provider. Shown in main menu.
      'google-maps': {
          'en': 'Google Maps',
          'fr': 'Google Maps',
          'pt-BR': 'Google Maps',
          'pt-PT': 'Google Maps',
          'ur': 'گوگل میپس',
          'sd': 'گوگل میپس',
          'skr': 'گوگل میپس',
      },
      // View this location in another map provider. Shown in main menu.
      'osm-maps': {
          'en': 'Open Street Map',
          'fr': 'Open Street Map',
          'pt-BR': 'Open Street Map',
          'pt-PT': 'Open Street Map',
          'ur': 'اوپن اسٹریٹ میپ',
          'sd': 'اوپن اسٽریٹ میپ',
          'skr': 'اوپن اسٹریٹ میپ'
      },
      // View this location in another map provider. Shown in main menu.
      'bing-maps': {
          'en': 'Bing Maps',
          'fr': 'Bing Maps',
          'pt-BR': 'Bing Maps',
          'pt-PT': 'Bing Maps',
          'ur': 'بنگ میپس',
          'sd': 'بنگ میپس',
          'skr': 'بنگ میپس',
      },
      // View this location in another map provider. Shown in main menu.
      'apple-maps': {
          'en': 'Apple Maps',
          'fr': 'Apple Maps',
          'pt-BR': 'Apple Maps',
          'pt-PT': 'Apple Maps',
          'ur': 'ایپل میپس',
          'sd': 'ایپل میپس',
          'skr': 'ایپل میپس'
      },
      // View this location in mobile Apps (could be Android or iOS etc).
      'apps': {
          'en': 'Apps',
          'fr': 'Apps',
          'pt-BR': 'Apps',
          'pt-PT': 'Apps',
          // TODO: Check the following translations are consistent.
          'ur': 'اینڈراءیڈ ایپس',
          'sd': 'اينڏرائيڏ ایپس',
          'skr': 'اینڈراءیڈ ایپس'
      },
      // Displayed in the infobox until we have the device location
      'waiting-location': {
          'en': 'Waiting for location...',
          'fr': 'En attente localisation...',
          'pt-BR': 'Esperando por local...',
          'pt-PT': 'Aguardando localização...',
          'ur': '...جگہ کے لئے انتظار کر رہے',
          'sd': '...جاء جي لاء انتظار ڪريو',
          'skr': '...جگہ کے لئے انتظار کر رہے'
      },
      // Used on compass displaying distance to a code
      'units-km': {
          'en': 'km',
          'fr': 'km',
          'pt-BR': 'km',
          'pt-PT': 'km',
          'ur': 'کلومیٹر',
          'sd': 'ڪلو ميٽر',
          'skr': 'کلومیٹر'
      },
      // Used on compass displaying distance to a code
      'units-meters': {
          'en': 'meters',
          'fr': 'mètres',
          'pt-BR': 'metros',
          'pt-PT': 'metros',
          'ur': 'میٹر',
          'sd': 'ميٽر',
          'skr': 'میٹر'
      },
      // Used when verifying compass readings.
      'compass-check-msg': {
          'en': '<p>There could be a problem reading the compass.</p>' +
                '<p>To test it, hold your device flat and turn around ' +
                'in a circle.</p>' +
                '<p>When you have turned completely around, tap ' +
                'the button below.</p>',
          'fr': '<p>Il y a peut-être un problème avec la lecture de la ' +
                'boussole.</p><p>Pour la tester, tenez votre téléphone à ' +
                'plat et tournez-le sur lui-mêmeUne fois que vous aurez ' +
                'réalisé un tour complet, appuyez sur le bouton ' +
                'ci-dessous.</p>',
          'pt-BR': '<p>Pode ter havido um problema lendo a bússola do ' +
                'dispositivo.</p><p>Para testá-lá, mantenha seu dispositivo ' +
                'na horizontal e rode em um círculo. Quando você tiver dado uma volta ' +
                'completa, aperte o botão abaixo.</p>',
          'pt-PT': '<p>Pode ter havido um problema ao ler a bússola do ' +
                'dispositivo.</p><p>Para testá-lá, mantenha o seu dispositivo ' +
                'na horizontal e rode num círculo. Quando tiver dado uma volta ' +
                'completa, carregue o botão abaixo.</p>',
          'ur': '<p>.کمپاس پڑھنے میں کچھ مسئلہ ہو سکتا ہے</p>' +
                '<p>اس کی جانچ کے لیے ,  آپ اپنے آلہ کو فلیٹ تھامیں اور داءرے میں  گھوماءیں ' +
                ' جب آپ  مکمل طور گھوما  دیں ' +
                'نیچے دیے گئے بٹن پر ٹیپ کریں.</p>',
          'sd': '<p>.ڪمپاس جي پڙھڻ ۾ ڪجھ مسئلو ٿي سگھي ٿو</p>' +
                '<p>ھن جي جانچ جي لاء توھان پھنجي ڏيوائس کي سڌو رکيو۽   گھمايو ' +
                'گولائي ۾ ۔  جڏھن توھا مڪمل طور تي گھمائي ڇڏيو ' +
                '.پ ء ھيٺان واري بثڻ کي دٻايو</p>',
          'skr': '<p>.کمپاس پڑھنے میں کچھ مسئلہ ہو سکتا ہے</p>' +
                '<p>اس کی جانچ کے لیے ,  آپ اپنے آلہ کو فلیٹ تھامیں اور داءرے میں  گھوماءیں ' +
                ' جب آپ  مکمل طور گھوما  دیں ' +
                'نیچے دیے گئے بٹن پر ٹیپ کریں.</p>'
      },
      // Displayed when the compass check didn't get enough readings and so the
      // compass doesn't look like it works.
      'compass-check-fail-msg': {
          'en': 'The compass on your device is not reporting the ' +
                'direction. The compass might not be supported by your ' +
                'device, or it might not be working properly.',
          // TODO: Check the following translations are consistent.
          'fr': '<p>Votre boussole ne fonctionne pas correctement. Merci ' +
                'd’essayer un autre navigateur ou de vérifier que votre ' +
                'matériel permet l’accès à la boussole depuis un navigateur ' +
                '(Certains modèles peuvent ne pas partager ces informations ' +
                'convenablement).</p><p>Utilisez le bouton de navigation ' +
                'pour calculer votre itinéraire et accéder aux options.</p>',
          'pt-BR': '<p>A bússola do seu dispositivo não está reportando ' +
                'direções. A funcionalidade de bússola pode não estar implementada' +
                'no seu dispositivo, ou pode não estar funcionando corretamente.</p>',
          'pt-PT': '<p>A bússola do seu dispositivo não está a retornar ' +
                'direções. A funcionalidade de bússola pode não estar implementada' +
                'no seu dispositivo, ou pode não estar a funcionar corretamente.</p>',
          'ur': '<p>آپ کے آلہ پر قطب نما  سمت کی رپورٹنگ نہیں کررہا ہو سکتا ہے کسی دوسرے براؤزر سے کوشش کریں ۔ ' +
                'یا قطب نما آپ کے ہارڈ ویئر کی حمایت نہیں کرسکتا( قطب نما کو کام کرنے کے ساتھ کچھ فونز ' +
                '(براؤزر انہیں صحیح طور پر رسائی حاصل کرنے کی اجازت نہیں دیتے۔ ',
          'sd': '<p>توھان جي ڏيوائس تي قطب نما  سمت جي سڄاڻپ نٿو ڪري سگھي بئي ڪنھن براوذر تي ڪوشش کيو ۔ ' +
                'يا وري توھان جو ڪمپاس ھارڏ ؤير نٿو مڄي( قطب نما سان گڏ ڪم ڪرڻ سان ڪجھ ڦونز ' +
                '( جا برائوزر انھن کي صحيح نموني سان ڪم ڪرڻ جي اجاذت نہ ڏيندا اھن </p>' +
                '<p>ھيٺ نيوي گيشن بٽڻ دبائڻ سان نيوي ڱيشن ٿيندو اھي ۽ ھڪڙونيوي ڱيشن ڏيو۔</p>',
          'skr': '<p>آپ کے آلہ پر قطب نما  سمت کی رپورٹنگ نہیں کررہا ہو سکتا ہے کسی دوسرے براؤزر سے کوشش کریں ۔ ' +
                'یا قطب نما آپ کے ہارڈ ویئر کی حمایت نہیں کرسکتا( قطب نما کو کام کرنے کے ساتھ کچھ فونز ' +
                '(براؤزر انہیں صحیح طور پر رسائی حاصل کرنے کی اجازت نہیں دیتے۔ '
      },
      // The compass had enough readings and so looks ok.
      'compass-check-ok': {
          'en': 'The compass on your device looks OK!',
          'fr': 'Votre boussole fonctionne correctement',
          'pt-BR': 'A bússola do seu dispositivo funciona corretamente!',
          'pt-PT': 'A bússola do seu dispositivo funciona corretamente!',
          'ur': '!آپ کے آلہ پے قطب نما ٹھیک لگتا ہے',
          'sd': '!توھان جي ڏيوائس تي قطب نما صحيح لڳي ٿو',
          'skr': '!آپ کے آلہ پے قطب نما ٹھیک لگتا ہے'
      },
      // Displayed in the compass when we are waiting for the first readings.
      'waiting-for-compass-1': {
          'en': 'Waiting for',
          'fr': 'Attente',
          'pt-BR': 'Esperando por',
          'pt-PT': 'Esperando por',
          'ur': 'انتظار',
          'sd': 'انتظار',
          'skr': 'انتظار'
      },
      // Displayed in the compass when we are waiting for the first readings.
      'waiting-for-compass-2': {
          'en': 'compass reading',
          'fr': 'information boussole',
          'pt-BR': 'leitura da bússola',
          'pt-PT': 'leitura da bússola',
          'ur': 'گردا پڑھنے',
          'sd': 'ڪمپاس پڙھيو',
          'skr': 'گردا پڑھنے'
      },
      // Displayed if we have never had a location. Used to explain to the user
      // why the app needs location information.
      'location-prompt': {
          'en': 'This service needs to use your location. If your browser asks, please allow it.',
          'fr': 'Ce service doit utiliser votre emplacement. ' +
                'Si votre navigateur demande, se il vous plaît permettre.',
          'pt-BR': 'Este serviço precisa da sua localização para funcionar. ' +
                'Se o seu navegador perguntar, por favor, permita-o.',
          'pt-PT': 'Este serviço precisa da sua localização para funcionar. ' +
                'Se o seu navegador perguntar, por favor, permita-o.'
      },
      // Help link in main menu.
      'ui-help': {
          'en': 'Help',
          'fr': 'Aide',
          'pt-BR': 'Ajuda',
          'pt-PT': 'Ajuda'
      },
      // Satellite imagery toggle in main menu.
      'ui-satellite': {
          'en': 'Satellite',
          'fr': 'Satellite',
          'pt-BR': 'Satélite',
          'pt-PT': 'Satélite'
      },
      // Language selection sub menu.
      'ui-language': {
          'en': 'Language',
          'fr': 'Langue',
          'pt-BR': 'Língua',
          'pt-PT': 'Língua'
      },
      // Feedback link in main menu.
      'ui-feedback': {
          'en': 'Feedback',
          'fr': 'Commentaires',
          'pt-BR': 'Comentários',
          'pt-PT': 'Comentários'
      },
      // Link to github project in main menu.
      'ui-github': {
          'en': 'View project',
          'fr': 'Voir le projet',
          'pt-BR': 'Ver projeto'
          'pt-PT': 'Ver projeto'
      },
      // Dismiss button in menus.
      'dismiss': {
          'en': 'Dismiss',
          'fr': 'Ignorer',
          'pt-BR': 'Dispensar',
          'pt-PT': 'Fechar'
      },
      // Help page content shown to the user.
      // Page 1 shows the quickest explanation.
      'help-01': {
          'en': '<h2>Your own personal postcode</h2>' +
                '<p>plus+codes are short codes for any location, anywhere. ' +
                'You can use them to guide people to your exact location, fast and reliably.</p>'
      },
      // Page 2 explains Plus Codes.
      'help-02': {
          'en': '<h2>What is a plus+code?</h2>' +
                '<p>A plus+code is a short code made up of six or seven letters ' +
                'and numbers, like <b>MQRG+59</b>, or combined with a town or ' +
                'city like this <b>MQRG+59 Nairobi</b>.</p>' +
                '<p>They let you give someone an exact location that doesn\'t' +
                ' depend on street names or building numbers.</p>' +
                '<h2>How do I find out where a plus+code is?</h2>' +
                '<p>When you enter a plus+code (<b>MQRG+59</b>) on your phone or ' +
                'computer, it will find the nearest match. ' +
                'This will return the correct location as long as you are within ' +
                'about 40 kilometers of the place.</p>' +
                '<p>If you are further away, use the town or city name ' +
                '(<b>MQRG+59 Nairobi</b>), or enter the plus+code including the ' +
                'region code (<b>6GCRMQRG+59</b>).</p>' +
                '<h2>Do I need to apply for a plus+code?</h2>' +
                '<p>No, plus+codes already exist for everywhere and anyone can ' +
                'use them for free.</p>' +
                '<p>To get the plus+code for a place just drag the map to ' +
                'highlight the place you want.</p>'
      },
                                                                                |
      // Page 3 answers some FAQ.
      'help-03': {
          'en': '<h2>What are the parts of the code?</h2>' +
                '<p>For our example code <b>6GCRMQRG+59</b>, <b>6GCR</b> is ' +
                'the region code (roughly 100 x 100 kilometers). ' +
                '<b>MQ</b> is the city code (5 x 5 kilometers). ' +
                '<b>RG</b> is the neighbourhood code (250 x 250 meters). ' +
                'After the <b>+</b>, <b>59</b> is the building code (14 x 14 meters). ' +
                'It can be followed by a single digit door code, if the ' +
                'building size code extends over more than one building.</p>' +
                '<p>Usually, the region code isn\'t needed, and sometimes you ' +
                'will be able to drop the city code as well.</p>' +
                '<h2>Does a location have more than one plus+code?</h2>' +
                '<p>No. Any place only has one plus+code.</p>' +
                '<h2>Can I save them?</h2>' +
                '<p>To save a plus+code, just create a bookmark for the page. ' +
                'When you open the bookmark, it will show you the place.</p>' +
                '<h2>Can I use this when I don\'t have a network?</h2>' +
                '<p>Yes! After you have loaded this page on your phone or ' +
                'computer, it will keep a copy and let you load it even without ' +
                'a network connection.</p>' +
                '<h2>Can I get directions?</h2>' +
                '<p>There is a compass mode that shows you the direction and ' +
                'distance from where you are to the current plus+code. ' +
                'The main menu has links to different map providers you can use.</p>' +
                '<h2>My plus+code area is too large!</h2>' +
                '<p>If you zoom in further, the code will be for a smaller area.</p>' +
                '<h2>The address you show is wrong!</h2>' +
                '<p>The address given is just a suggestion. It is used to reduce the ' +
                'length of the code you need to use. ' +
                'You can try other addresses in the search box.</p>'
      },
      // Feedback prompt, displayed in feedback popup.
      'feedback-detail': {
          'en': 'Send feedback. Let us know what you like, or what is not working ' +
                'and we\'ll try to improve.',
          'fr': 'Envoyez vos commentaires. Faites-nous savoir ce que vous aimez, ' +
                'ou ce qui ne fonctionne pas et nous essayons d\'améliorer.',
          'pt-BR': 'Envie seu comentário. Deixe-nos saber o que você gosta, ' +
                'ou o que não está funcionando, e vamos tentar melhorar.',
          'pt-PT': 'Envie os seus comentários. Diga-nos o que gosta ou ' +
                'o que não está a funcionar, e tentaremos melhorar.'
      },
      // Displayed when the user has been clicking but the code is pinned.
      'unpin': {
          'en': 'Tapping the map displays a new code, but you need to unpin the current code first.'
      }
  };

  this.language = 'en';

  // Work out which of our supported languages we'll use. If we have a stored
  // preference, use that, otherwise use the preferred language list for the
  // browser, or use the browser language settings.
  if (DataStore.has(Messages.LANGUAGE_PREF)) {
    this.language = DataStore.get(Messages.LANGUAGE_PREF);
  } else if ('languages' in navigator) {
    // If we have a preferred language list for the browser.
    for (var index in navigator.languages) {
      if (navigator.languages[index] in this.languageMap) {
        this.language = this.languageMap[navigator.languages[index]];
        break;
      }
      var index = navigator.languages[index].substr(0, 2);
      if (index in this.languageMap) {
        this.language = this.languageMap[index];
        break;
      }
    }
  } else {
    // Use the browser language setting.
    var language = navigator.language || navigator.userLanguage;
    if (language in this.languageMap) {
      // Do we have an entry for the browser language?
      this.language = this.languageMap[language];
    } else if (language.substr(0, 2) in this.languageMap) {
      // Try just the first two characters of the browser language.
      this.language = this.languageMap[language.substr(0, 2)];
    }
  }
}

// Datastore tag.
Messages.LANGUAGE_PREF = 'language_pref';

/** Set the language. */
Messages.prototype.setLanguage = function(language) {
  if (language in this.languageMap) {
    this.language = language;
    DataStore.putString(Messages.LANGUAGE_PREF, language);
    return true;
  }
  return false;
};

/**
  Get the message for the passed key in the current language. If it doesn't
  exist, returns null.
  @param {string} key The message key to fetch.
  @param {Array<string>} params A dict of name/value pairs to try to substitute
      into the message text.
  @return {string} the message or null if the message key doesn't exist.
 */
Messages.prototype.get = function(key, params) {
  var message = this.getWithLanguage(this.language, key, params);
  if (message !== null) {
    return message;
  }
  // Fallback to English.
  return this.getWithLanguage('en', key, params);
};

/**
  Get the message for the passed key in the specified language. If it doesn't
  exist, returns the message in English, or null if it doesn't exist.
  @param {string} key The message key to fetch.
  @param {Array<string>} params A dict of name/value pairs to try to substitute
      into the message text.
  @return {string} the message or null if the message key doesn't exist.
 */
Messages.prototype.getWithLanguage = function(language, key, params) {
  if (key in this.messages && language in this.messages[key]) {
    var message = this.messages[key][language];
    for (var param in params) {
      var regex = new RegExp(param, 'g');
      message = message.replace(regex, params[param]);
    }
    return message;
  }
  return null;
};
