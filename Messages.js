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
 * @this Messages
 */
function Messages() {
  // Define the list of languages. The first is the browser language preference,
  // the second is which language code in our messages to use.
  this.languageMap = {
      'en': 'en',
      'fr': 'fr',
      'pt': 'pt-BR'};

  // Define all the messages inline for all languages. Since they would all be
  // included in the appcache, this doesn't cost any more memory or load time.
  this.messages = {
      'input-prompt': {
          'en': 'Enter a code, address or click the map',
          'fr': 'Saisissez un Open Location Code, une adresse ou cliquez sur ' +
                'la carte',
          'pt-BR': 'Digite um código, endereço ou clique no mapa'
      },
      'map-error': {
          'en': '<p>Cannot load Google Maps. Make sure you have a working ' +
                'network and try reloading the page.</p><p>You can still ' +
                'enter full (XXXX.XXXXXX) and short (XXXXXX) codes, and use ' +
                'the compass, but you will not be able to enter addresses, ' +
                'or short codes with addresses, until maps are displayed.</p>',
          'fr': '<p>Impossible de charger Google Maps. Assurez-vous d’avoir ' +
                'une connection Internetet essayez de recharger la page.</p>' +
                '<p>Vous pouvez toujours saisir codes, et utiliser la ' +
                'boussole, mais vous ne pourrez pas saisir d’adresse, ' +
                'de code postaux avant que la carte ne s’affiche.</p>',
          'pt-BR': '<p>Não foi possível carregar o Google Maps. Verifique ' +
                'sua conexão com a internet e tente recarregar a página.</p>' +
                '<p>Você ainda pode digitar códigos ompletos (XXXX.XXXXXX) ' +
                'ou abreviados (XXXXXX), e usar a bússola, mas você não ' +
                'poderá digitar endereços, ou códigos abreviados com ' +
                'endereços, até os mapas serem exibidos.</p>'
      },
      'browser-problem': {
          'en': 'Browser problem',
          'fr': 'Problème de navigateur',
          'pt-BR': 'Problema com o navegador'
      },
      'browser-problem-msg': {
          'en': '<p>The browser you are using does not support all the ' +
                'features we need, such as location and compass.</p><p>We ' +
                'recommend Chrome, Firefox and Opera.</p>',
          'fr': '<p>Votre navigateur n’est pas compatible avec les ' +
                'fonctionnalités que nous proposons, comme la localisation ' +
                'et la boussole.</p><p>Nous vous recommandons d’utiliser ' +
                'Chrome, Firefox ou Opera.</p>',
          'pt-BR': '<p>O navegador que você está usando não suporta todas ' +
                'as funcionalidades que precisamos, como local e bússola.</p>' +
                '<p>Nós recomendamos Chrome, Firefox e Opera.</p>'
      },
      'location-accuracy': {
          'en': 'Current location accuracy +/- NUM meters',
          'fr': 'Précision de localisation actuelle +/- NUM mètres',
          'pt-BR': 'Precisão do local atual +/- NUM metros'
      },
      'location-failure': {
          'en': 'Can\'t get location information (MSG)',
          'fr': 'Impossible d’obtenir vos informations de localisation',
          'pt-BR': 'Não foi possível obter informações do local (MSG)'
      },
      'shorten-bad': {
          'en': 'Only standard length codes (XXXX.XXXXXX or XXXX.XXXXXXX) ' +
                'can be shortened',
          'fr': 'Seuls les codes de longueur standard (XXXX.XXXXXX or ' +
                'XXXX.XXXXXXX) peuvent être raccourcis',
          'pt-BR': 'Apenas códigos de tamanho padrão (XXXX.XXXXXX ou ' +
                'XXXX.XXXXXXX) podem ser abreviados'
      },
      'geocoder-no-info': {
          'en': 'Google\'s geocoder service has no address information in ' +
                'this area. You might be able to use OLC with the name of a ' +
                'large town, if there is one within 40km.',
          'fr': 'Google geocoder n’a pas d’information d’adresse pour cette ' +
                'zone. Vous pourriez utiliser OLC avec le nom d’une grande ' +
                'ville, s’il y en a une dans les 40kms aux alentours.',
          'pt-BR': 'O serviço geocoder da Google não tem informações de ' +
                'endereço nessa área. Você pode ser capaz de utilizar OLC ' +
                'com o nome de uma grande cidade, se existir uma em até 40km.'
      },
      'invalid-code': {
          'en': 'Invalid location code OLC',
          'fr': 'Code de localisation invalide OLC',
          'pt-BR': 'Código de localidade inválido OLC'
      },
      'missing-plus': {
          'en': '<i>OLC</i> could be a location code. Did you mean ' +
                '<i><b>+OLC</b></i>?',
          'fr': '<i>OLC</i> pourrait être un code de localisation. ' +
                'Vouliez-vous dire <i><b>+OLC</b></i>?',
          'pt-BR': '<i>OLC</i> pode ser um código de local. ' +
                'Você quis dizer <i><b>+OLC</b></i>?'
      },
      'extend-failure': {
          'en': 'Cannot extend code',
          'fr': 'Impossible d\'étendre le code',
          'pt-BR': 'Não foi possível extender o código'
      },
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
                'localização estão habilitados no seu dispositivo.</p>'
      },
      'waiting-for-address': {
          'en': 'Waiting for address information...',
          'fr': 'En attente d’informations sur l’adresse...',
          'pt-BR': 'Esperando informações sobre o endereço...'
      },
      'geocode-fail': {
          'en': 'Google\'s address service can\'t locate <i>ADDRESS</i>.',
          'fr': 'Google Adresse ne peut pas localiser <i>ADDRESS</i>.',
          'pt-BR': 'O serviço de endereços do Google não conseguiu localizar ' +
                '<i>ADDRESS</i>.'
      },
      'geocode-fail-limit': {
          'en': 'Could not locate <i>ADDRESS</i> (Google\'s geocoder service ' +
                'over query limit)',
          'fr': 'Impossible de localiser <i>ADDRESS</i> (limite de la ' +
                'requête Google geocoder)',
          'pt-BR': 'Não foi possível localizar <i>ADDRESS</i> (O serviço de ' +
                'geocoder do Google está acima do número de requisições limite)'
      },
      'geocode-fail-deny': {
          'en': 'Could not locate <i>ADDRESS</i> (Google\'s geocoder service ' +
                'is not available)',
          'fr': 'Impossible de localiser <i>ADDRESS</i> (Google geocoder ' +
                'n’est pas disponible)',
          'pt-BR': 'Não foi possível localizar <i>ADDRESS</i> (O serviço de ' +
                'geocoder do Google não está disponível)'
      },
      'geocode-fail-reject': {
          'en': 'Could not locate <i>ADDRESS</i> (Google\'s geocoder ' +
                'service rejected our request)',
          'fr': 'Impossible de localiser <i>ADDRESS</i> (Google geocoder a ' +
                'rejeté notre demande)',
          'pt-BR': 'Não foi possível localizar <i>ADDRESS</i> (O serviço de ' +
                'geocoder do Google rejeitou sua requisição)'
      },
      'geocode-fail-error': {
          'en': 'Could not locate <i>ADDRESS</i> (Google\'s geocoder service ' +
                'had an error)',
          'fr': 'Impossible de localiser <i>ADDRESS</i> (Google geocoder a ' +
                'rencontré une erreur)',
          'pt-BR': 'Não foi possível localizar <i>ADDRESS</i> (O serviço de ' +
                'geocoder do Google teve um erro)'
      },
      'geocode-reverse-zero': {
          'en': 'Could not get any locality information (Google\'s geocoder ' +
                'service returned no results)',
          'fr': 'Impossible d’obtenir des informations sur la localité ' +
                '(Google geocoder n’a pas renvoyé de résultat)',
          'pt-BR': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço de geocoder do Google não retornou resultados)'
      },
      'geocode-reverse-limit': {
          'en': 'Could not get any locality information (Google\'s geocoder ' +
                'service over query limit)',
          'fr': 'Impossible d’obtenir des informations sur la localité ' +
                '(limite de la requête Google geocoder)',
          'pt-BR': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço de geocoder do Google está acima do número de ' +
                'requisições limite)'
      },
      'geocode-reverse-deny': {
          'en': 'Could not get any locality information (Google\'s geocoder ' +
                'service is not avilable)',
          'fr': 'Impossible d’obtenir des informations sur la localité ' +
                '(Google geocoder n’est pas disponible)',
          'pt-BR': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço de geocoder do Google não está disponível)'
      },
      'geocode-reverse-reject': {
          'en': 'Could not get any locality information (Google\'s geocoder ' +
                'service rejected our request)',
          'fr': 'Impossible d’obtenir des informations sur la localité ' +
                '(Google geocoder a rejeté notre demande)',
          'pt-BR': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço de geocoder do Google rejeitou sua requisição)'
      },
      'geocode-reverse-error': {
          'en': 'Could not get any locality information (Google\'s geocoder ' +
                'service had an error)',
          'fr': 'Impossible d’obtenir des informations sur la localité ' +
                '(Google geocoder a rencontré une erreur)',
          'pt-BR': 'Não foi possível obter nenhuma informação de localidade ' +
                '(O serviço de geocoder do Google teve um erro)'
      },
      'other-maps': {
          'en': 'See this location in other maps',
          'fr': 'Voir ce lieu sur d’autres cartes',
          'pt-BR': 'Veja este local em outros mapas'
      },
      'google-maps': {
          'en': 'Google Maps',
          'fr': 'Google Maps',
          'pt-BR': 'Google Maps'
      },
      'osm-maps': {
          'en': 'Open Street Map',
          'fr': 'Open Street Map',
          'pt-BR': 'Open Street Map'
      },
      'bing-maps': {
          'en': 'Bing Maps',
          'fr': 'Bing Maps',
          'pt-BR': 'Bing Maps'
      },
      'apple-maps': {
          'en': 'Apple Maps',
          'fr': 'Apple Maps',
          'pt-BR': 'Apple Maps'
      },
      'android-apps': {
          'en': 'Android apps',
          'fr': 'Android apps',
          'pt-BR': 'Android apps'
      },
      'dialog-dismiss': {
          'en': 'Dismiss',
          'fr': 'Passer',
          'pt-BR': 'Entendido'
      },
      'waiting-location': {
          'en': 'Waiting for location...',
          'fr': 'En attente localisation...',
          'pt-BR': 'Esperando por local...'
      },
      'units-km': {
          'en': 'km',
          'fr': 'km',
          'pt-BR': 'km'
      },
      'units-meters': {
          'en': 'meters',
          'fr': 'mètres',
          'pt-BR': 'metros'
      },
      'compass-check': {
          'en': 'Checking the device compass',
          'fr': 'Vérification boussole en cours',
          'pt-BR': 'Checando a bússola do dispositivo'
      },
      'compass-check-msg': {
          'en': '<p>There could be a problem reading the compass.</p>' +
                '<p>To test it, hold your device flat and turn around ' +
                'in a circle. When you have turned completely around, tap ' +
                'the button below.</p>',
          'fr': '<p>Il y a peut-être un problème avec la lecture de la ' +
                'boussole.</p><p>Pour la tester, tenez votre téléphone à ' +
                'plat et tournez-le sur lui-mêmeUne fois que vous aurez ' +
                'réalisé un tour complet, appuyez sur le bouton ' +
                'ci-dessous.</p>',
          'pt-BR': '<p>Pode ter havido um problema lendo a bússola do ' +
                'dispositivo.</p><p>Para testa-lo, deixe seu dispositivo ' +
                'reto e rode em um círculo. Quando você tiver dado uma volta ' +
                'completa, aperta o botão abaixo.</p>'
      },
      'compass-check-turned': {
          'en': 'I\'ve turned around',
          'fr': 'J’ai fini mon tour.',
          'pt-BR': 'Eu dei uma volta completa'
      },
      'compass-check-fast': {
          'en': 'Too fast!',
          'fr': 'Trop rapide !',
          'pt-BR': 'Muito rápido!'
      },
      'compass-check-fast-msg': {
          'en': '<p>Take 5-10 seconds to turn your device around. It ' +
                'doesn\'t matter if you go too far, as long as you turn a ' +
                'full circle.</p>',
          'fr': '<p>Faites tourner votre appareil sur lui-même durant 5 à ' +
                '10 secondes. Vous devez faire au moins un tour complet.</p>',
          'pt-BR': '<p>Você deve levar 5-10 segundos para girar seu ' +
                'dispositivo. Não importa se você for muito longe, desde que ' +
                'você dê uma volta completa.</p>'
      },
      'compass-check-fail': {
          'en': 'There\'s a problem reading your compass',
          'fr': 'Il y a un problème avec votre boussole.',
          'pt-BR': 'Existe um problema tentando ler sua bússola'
      },
      'compass-check-fail-msg': {
          'en': '<p>The compass on your device is not reporting the ' +
                'direction. It could be worth trying another browser, or ' +
                'the compass might not be supported by your hardware. (Some ' +
                'phones with working compasses don\'t allow the browser to ' +
                'access them properly.)</p><p>Do navigation by pressing the ' +
                'navigation button below and select a navigation provider.</p>',
          'fr': '<p>Votre boussole ne fonctionne pas correctement. Merci ' +
                'd’essayer un autre navigateur ou de vérifier que votre ' +
                'matériel permet l’accès à la boussole depuis un navigateur ' +
                '(Certains modèles peuvent ne pas partager ces informations ' +
                'convenablement).</p><p>Utilisez le bouton de navigation ' +
                'pour calculer votre itinéraire et accéder aux options.</p>',
          'pt-BR': '<p>A bússola no seu dispositivo não está reportando ' +
                'direções. Pode valer a pena tentar em outro navegador, ' +
                'ou a bússola pode não ser suportado no seu hardware. ' +
                '(Alguns telefones com bússolas funcionando não permitem ' +
                'o navegador acessa-lo apropriadamente.)</p><p>Faça uma ' +
                'navegação apertando o botão de navegação abaixo e ' +
                'selecione o provedor de navegação.</p>'
      },
      'compass-check-ok': {
          'en': 'The compass on your device looks OK!',
          'fr': 'Votre boussole fonctionne correctement',
          'pt-BR': 'A bússola do seu dispositivo parece OK!'
      },
      'waiting-for-compass-1': {
          'en': 'Waiting for',
          'fr': 'Attente',
          'pt-BR': 'Esperando por'
      },
      'waiting-for-compass-2': {
          'en': 'compass reading',
          'fr': 'information boussole',
          'pt-BR': 'lendo bússola'
      },
      'current-location': {
          'en': 'Current location',
          'fr': 'Localisation actuelle ',
          'pt-BR': 'Local atual'
      },
      'no-location': {
          'en': 'Current location unknown. Short codes will be resolved ' +
                'relative to the map center.',
          'fr': 'Emplacement actuel inconnu. Les codes abrégés seront ' +
                'résolus par rapport au centre de la carte.',
          'pt-BR': 'A localização atual é desconhecida. Códigos serão ' +
                'resolvidos em relação ao centro do mapa até que você ' +
                'permitir plus.codes acesso à sua localização.'
      }
  };

  this.language = 'en';

  // Work out which of our supported languages we'll use.
  if ('languages' in navigator) {
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


/**
  Get the message for the passed key in the current language. If it doesn't
  exist, returns null.
  @param {string} key The message key to fetch.
  @param {Array<string>} params A dict of name/value pairs to try to substitute
      into the message text.
  @return {string} the message or null if the message key doesn't exist.
 */
Messages.prototype.get = function(key, params) {
  if (key in this.messages && this.language in this.messages[key]) {
    var message = this.messages[key][this.language];
    for (var param in params) {
      var regex = new RegExp(param, 'g');
      message = message.replace(regex, params[param]);
    }
    return message;
  }
  return null;
};
