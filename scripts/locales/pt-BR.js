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
 * Brazilian Portuguese language messages file. See en.js for format description.
 */
LocalisedMessages["pt-BR"] = {
  "input-prompt": {
    "message": "Digite um plus+code, endereço ou clique no mapa",
  },
  "map-error": {
    "message": "Não foi possível carregar o Google Maps. Verifique sua conexão com a Internet e tente recarregar a página.</p><p>Você ainda pode digitar códigos completos (XXXX.XXXXXX) ou abreviados (XXXXXX), e usar a bússola, mas você não poderá digitar endereços, ou códigos abreviados com endereços, até os mapas serem exibidos.",
  },
  "browser-problem-msg": {
    "message": "O navegador que você está usando não suporta todas as funcionalidades que precisamos, como local e bússola.</p><p>Nós recomendamos usar o Chrome, Firefox ou Opera mais recentes.",
  },
  "geocoder-no-info": {
    "message": "O serviço <i>geocoder</i> da Google não tem informações de endereço nessa área. Você pode ser capaz de utilizar OLC com o nome de uma grande cidade, se existir uma em até 40km.",
  },
  "extend-failure-msg": {
    "message": "Para descobrir onde $OLC$ está, nós precisamos do seu local atual, ou você precisa incluir as informações da cidade.</p><p>Verifique que seu navegador está permitindo localização, e que serviços de localização estão habilitados no seu dispositivo.",
  },
  "geocode-not-loaded": {
    "message": "O serviço de endereços do Google não está carregado; não é possível localizar $ADDRESS$.",
  },
  "geocode-fail": {
    "message": "O serviço de endereços do Google não conseguiu localizar $ADDRESS$.",
  },
  "geocode-reverse-fail": {
    "message": "Não foi possível obter nenhuma informação de localidade (O serviço <i>geocoder</i> do Google teve um erro)",
  },
  "google-maps": {
    "message": "Google Maps",
  },
  "osm-maps": {
    "message": "Open Street Map",
  },
  "bing-maps": {
    "message": "Bing Maps",
  },
  "apple-maps": {
    "message": "Apple Maps",
  },
  "apps": {
    "message": "Apps",
  },
  "waiting-location": {
    "message": "Esperando por local...",
  },
  "units-km": {
    "message": "km",
  },
  "units-meters": {
    "message": "metros",
  },
  "compass-check-msg": {
    "message": "Pode ter havido um problema lendo a bússola do dispositivo.</p><p>Para testá-lá, mantenha seu dispositivo na horizontal e rode em um círculo. Quando você tiver dado uma voltacompleta, aperte o botão abaixo.",
  },
  "compass-check-fail-msg": {
    "message": "A bússola do seu dispositivo não está reportando direções. A funcionalidade de bússola pode não estar implementada no seu dispositivo, ou pode não estar funcionando corretamente.",
  },
  "compass-check-ok": {
    "message": "A bússola do seu dispositivo funciona corretamente!",
  },
  "waiting-for-compass-1": {
    "message": "Esperando por",
  },
  "waiting-for-compass-2": {
    "message": "leitura da bússola",
  },
  "location-prompt": {
    "message": "Este serviço precisa da sua localização para funcionar. Se o seu navegador perguntar, por favor, permita-o.",
  },
  "ui-help": {
    "message": "Ajuda",
  },
  "ui-satellite": {
    "message": "Satélite",
  },
  "ui-language": {
    "message": "Língua",
  },
  "ui-feedback": {
    "message": "Comentários",
  },
  "ui-github": {
    "message": "Ver projeto",
  },
  "dismiss": {
    "message": "Dispensar",
  },
  "help-01-0": {
    "message": "<h2>Your own personal postcode</h2><p>plus+codes are short codes for any location, anywhere. You can use them to guide people to your exact location, fast and reliably.</p>",
  },
  "help-02-0": {
    "message": "<h2>What is a plus+code?</h2><p>A plus+code is a short code made up of six or seven letters and numbers, like <b>$EXAMPLE_CODE$</b>, or combined with a town or city like this <b>$EXAMPLE_CODE$ Nairobi</b>.</p><p>They let you give someone an exact location that doesn't depend on street names or building numbers.</p>",
    "placeholders": {
      "EXAMPLE_CODE": {
        "content": "MQRG+59"
      }
    }
  },
  "help-02-1": {
    "message": "<h2>How do I find out where a plus+code is?</h2><p>When you enter a plus+code (<b>$EXAMPLE_CODE$</b>) on your phone or computer, it will find the nearest match. This will return the correct location as long as you are within about 40 kilometers of the place.</p><p>If you are further away, use the town or city name (<b>$EXAMPLE_CODE$ Nairobi</b>), or enter the plus+code including the region code (<b>$FULL_CODE$</b>).</p>",
    "placeholders": {
      "EXAMPLE_CODE": {
        "content": "MQRG+59"
      },
      "FULL_CODE": {
        "content": "6GCRMQRG+59"
      }
    }
  },
  "help-02-2": {
    "message": "<h2>Do I need to apply for a plus+code?</h2><p>No, plus+codes already exist for everywhere and anyone can use them for free.</p><p>To get the plus+code for a place just drag the map to highlight the place you want.</p>",
  },
  "help-03-0": {
    "message": "<h2>What are the parts of the code?</h2><p>For our example code <b>$FULL_CODE$</b>, <b>$CODE_PART_1$</b> is the region code (roughly 100 x 100 kilometers). <b>$CODE_PART_2$</b> is the city code (5 x 5 kilometers). <b>$CODE_PART_3$</b> is the neighbourhood code (250 x 250 meters). After the <b>+</b>, <b>$CODE_PART_4$</b> is the building code (14 x 14 meters). It can be followed by a single digit door code, if the building size code extends over more than one building.</p><p>Usually, the region code isn't needed, and sometimes you will be able to drop the city code as well.</p>",
    "placeholders": {
      "FULL_CODE": {
        "content": "6GCRMQRG+59"
      },
      "CODE_PART_1": {
        "content": "6GCR"
      },
      "CODE_PART_2": {
        "content": "MQ"
      },
      "CODE_PART_3": {
        "content": "RG"
      },
      "CODE_PART_4": {
        "content": "59"
      }
    }
  },
  "help-03-1": {
    "message": "<h2>Does a location have more than one plus+code?</h2><p>No. Any place only has one plus+code.</p>",
  },
  "help-03-2": {
    "message": "<h2>Can I save them?</h2><p>To save a plus+code, just create a bookmark for the page. When you open the bookmark, it will show you the place.</p>",
  },
  "help-03-3": {
    "message": "<h2>Can I use this when I don't have a network?</h2><p>Yes! After you have loaded this page on your phone or computer, it will keep a copy and let you load it even without a network connection.</p>",
  },
  "help-03-4": {
    "message": "<h2>Can I get directions?</h2><p>There is a compass mode that shows you the direction and distance from where you are to the current plus+code. The main menu has links to different map providers you can use.</p>",
  },
  "help-03-5": {
    "message": "<h2>My plus+code area is too large!</h2><p>If you zoom in further, the code will be for a smaller area.</p>",
  },
  "help-03-6": {
    "message": "<h2>The address you show is wrong!</h2><p>The address given is just a suggestion. It is used to reduce the length of the code you need to use. You can try other addresses in the search box.</p>",
  },
  "feedback-detail": {
    "message": "Envie seu comentário. Deixe-nos saber o que você gosta, ou o que não está funcionando, e vamos tentar melhorar.",
  }
};
