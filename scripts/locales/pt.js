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
 * Portuguese language messages file. See en.js for format description.
 */
LocalisedMessages["pt"] = {
  "input-prompt": {
    "message": "Insira um plus+code, endereço ou clique no mapa",
  },
  "map-error": {
    "message": "Não foi possível carregar o Google Maps. Verifique asua ligação à Internet e tente recarregar a página.</p><p>Você ainda pode inserir códigos completos (XXXX.XXXXXX) ou abreviados (XXXXXX), e usar a bússola, mas não poderá inserir endereços, ou códigos abreviados com endereços, até os mapas serem exibidos.",
  },
  "browser-problem-msg": {
    "message": "O navegador que você está a usar não suporta todas as funcionalidades que precisamos, como localização e bússola.</p><p>Recomendamos usar o Chrome, Firefox ou Opera mais recentes.",
  },
  "geocoder-no-info": {
    "message": "O serviço <i>geocoder</i> da Google não tem informações de endereço nesta área. É possível que consiga usar o OLC com o nome de uma grande cidade, se existir uma num raio de 40km.",
  },
  "extend-failure-msg": {
    "message": "Para descobrir onde $OLC$ está, nós precisamos da sua localização atual, ou você terá que incluir as informações da cidade.</p><p>Verifique que o seu navegador está a permitir o acesso à localização, e que serviços de localização estão ativados no seu dispositivo.",
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
    "message": "Ver no Google Maps",
  },
  "osm-maps": {
    "message": "Ver no Open Street Map",
  },
  "bing-maps": {
    "message": "Ver no Bing Maps",
  },
  "apple-maps": {
    "message": "Ver no Apple Maps",
  },
  "apps": {
    "message": "Apps",
  },
  "waiting-location": {
    "message": "Aguardando localização...",
  },
  "units-km": {
    "message": "km",
  },
  "units-meters": {
    "message": "metros",
  },
  "compass-check-msg": {
    "message": "Pode ter havido um problema ao ler a bússola do dispositivo.</p><p>Para testá-lá, mantenha o seu dispositivo na horizontal e rode num círculo. Quando tiver dado uma volta completa, carregue o botão abaixo.",
  },
  "compass-check-fail-msg": {
    "message": "A bússola do seu dispositivo não está a retornar direções. A funcionalidade de bússola pode não estar implementada no seu dispositivo, ou pode não estar a funcionar corretamente.",
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
    "message": "Modo satélite",
  },
  "ui-language": {
    "message": "Alterar idioma",
  },
  "ui-feedback": {
    "message": "Enviar comentários",
  },
  "ui-github": {
    "message": "Código fonte",
  },
  "dismiss": {
    "message": "Ocultar",
  },
  "help-01-0": {
    "message": "<h2>O seu código postal personalizado</h2><p>plus+codes são códigos curtos para qualquer localização. Pode usá-los para guiar pessoas à sua localização exata, de forma rápida e fiável.</p>",
  },
  "help-02-0": {
    "message": "<h2>O que é um plus+code?</h2><p>Um plus+code é um código conciso, composto por seis ou sete letras e números, como <b>$EXAMPLE_CODE$</b>, ou combinado com o nome de uma localidade ou cidade, como <b>$EXAMPLE_CODE$ Nairobi</b>.</p><p>Eles permitem comunicar uma localização exata que não depende de nomes de ruas ou números de portas.</p>",
    "placeholders": {
      "EXAMPLE_CODE": {
        "content": "MQRG+59"
      }
    }
  },
  "help-02-1": {
    "message": "<h2>Como descubro onde fica um plus+code?</h2><p>Ao inserir um plus+code (<b>$EXAMPLE_CODE$</b>) no seu telemóvel ou computador, ele encontrará a correspondência mais próxima. Isto produzirá a localização correta desde que esteja num raio de 40 quilómetros do local.</p><p>Se estiver mais longe, use o nome da localidade ou cidade (<b>$EXAMPLE_CODE$ Nairobi</b>), ou insira o plus+code completo, incluindo o código de região (<b>$FULL_CODE$</b>).</p>",
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
    "message": "<h2>Tenho que me registar para ter um plus+code?</h2><p>Não é preciso. Os plus+codes já cobrem todo o planeta, e qualquer pessoa pode usá-los livremente.</p><p>Para obter o plus+code de um local, basta arrastar o mapa para realçar o local pretendido.</p>",
  },
  "help-03-0": {
    "message": "<h2>Quais são as partes do código?</h2><p>Para o código de exemplo <b>$FULL_CODE$</b>, <b>$CODE_PART_1$</b> é o código de região (aproximadamente 100 × 100 quilómetros). <b>$CODE_PART_2$</b> é o código de cidade (5 × 5 quilómetros). <b>$CODE_PART_3$</b> é o código de bairro (250 × 250 metros). Depois do <b>+</b>, <b>$CODE_PART_4$</b> é o código de edifício (14 × 14 metros). Pode ser acompanhado um código de porta com um dígito, se o tamanho do código de edifício cobrir mais que um edifício.</p><p>Por norma, o código de região não é necessário, e em certos casos é possível cortar também o código de cidade.</p>",
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
    "message": "<h2>Pode uma localização ter mais que um plus+code?</h2><p>Não. Cada local tem um plus+code único.</p>",
  },
  "help-03-2": {
    "message": "<h2>Posso guardá-los?</h2><p>Para guardar um plus+code, basta criar um marcador para a página. Quando abrir o marcador, a página irá mostrar a localização correspondente.</p>",
  },
  "help-03-3": {
    "message": "<h2>Posso usar isto se não tiver acesso à Internet?</h2><p>Sim! Depois de ter aberto esta página no seu telemóvel ou computador, uma cópia será mantida que será carregada mesmo sem uma ligação à rede.</p>",
  },
  "help-03-4": {
    "message": "<h2>Posso obter indicações de caminho?</h2><p>Há um modo de bússola, que mostra a direção e a distância de onde está para o local apontado pelo plus+code. O menu principal tem links para vários serviços de mapas que pode usar.</p>",
  },
  "help-03-5": {
    "message": "<h2>A área do meu plus+code é muito grande!</h2><p>Se ampliar o mapa, o código cobrirá uma área menor.</p>",
  },
  "help-03-6": {
    "message": "<h2>O endereço que isto mostra está errado!</h2><p>O endereço fornecido é apenas uma sugestão. É usado para reduzir o tamanho do código que tem que usar. Você pode experimentar outros endereços na barra de pesquisa.</p>",
  },
  "feedback-detail": {
    "message": "Envie os seus comentários. Diga-nos o que gosta ou o que não está a funcionar, e tentaremos melhorar.",
  }
};
