const nav = document.querySelector('.navigate'),
    burger_nav = document.querySelector('.burger-nav'),
    close_nav = document.querySelector('.close-nav'),
    userLanguage = document.querySelectorAll('input[name=land_id]'),
    hostName = document.querySelectorAll('.host'),
    btnsScrollTo = document.querySelectorAll('[data-scroll]'),
    dropdownBtn = document.querySelectorAll('.dropdown-btn'),
    dropdownContent = document.querySelectorAll('.dropdown-content')
burger_nav.addEventListener('click', () => nav.classList.add('show'))
close_nav.addEventListener('click', () => nav.classList.remove('show'))
const scroll = ({currentTarget: el}) => {
    const element = el.getAttribute('data-scroll'),
        elementWr = document.querySelector('[data-target=' + element + ']')
    elementWr.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
    })
}
btnsScrollTo.forEach((btn) =>
    btn.addEventListener('click', (e) => scroll(e))
)


function getFlagSrc(geo) {
    return /^[A-Z]{2}$/.test(geo)
        ? `https://flagicons.lipis.dev/flags/4x3/${geo.toLowerCase()}.svg`
        : ''
}

dropdownBtn.forEach((btn) =>
    btn.addEventListener('click', () => btn.closest('.dropdown').querySelector('.dropdown-content').classList.toggle('show'))
)
dropdownBtn.forEach((btn) =>
    btn.addEventListener('blur', () => btn.closest('.dropdown').querySelector('.dropdown-content').classList.remove('show'))
)

function setSelectedLocale(lang) {
    const data = new Intl.Locale(lang)
    dropdownContent.forEach((el) => (el.innerHTML = ''))
    const dataArr = locales.filter((el) => el.lang !== lang)
    dataArr.forEach((el) => {
        const dataLang = new Intl.Locale(el.lang)
        dropdownContent.forEach((newEL) => {
            const li = document.createElement('li')
            li.innerHTML = '<img src="' + getFlagSrc(dataLang.region) + '" />'
            li.addEventListener('mousedown', function () {
                window.localStorage.setItem('language', el.lang.split('-')[1])
                init(el)
            })
            newEL.appendChild(li)
        })
    })
    dropdownBtn.forEach((btn) => (btn.innerHTML = `<img src="${getFlagSrc(data.region)}" /><span class="arrow-down"></span>`))
}

function changeLang(data) {
    let lang = new Intl.Locale(data).language,
        includesLang = window.location.pathname.includes(lang),
        pathLang = window.location.pathname.split('/')[2]
    if (pathLang === undefined) {
        pathLang = ''
    }
    !includesLang && (window.location.href = '../' + lang + '/' + pathLang + window.location.search)
}

async function getLocate() {
    let currentISO
    await $.getJSON('https://get.geojs.io/v1/ip/country.json',
        function (data) {
            currentISO = data.country
        }
    )
    const userGeo = window.localStorage.getItem('language') || currentISO
    let userLang = locales.find((el) => el.iso.includes(userGeo))
    userLang ? init(userLang) : init(defLang)
}

function init(data) {
    setSelectedLocale(data.lang)
    changeLang(data.lang)
    userLanguage.forEach((el) => (el.value = data.lang_id))
    cookieconsentLang(data.lang)
}

getLocate()

function cookieconsentLang(lang) {
    var cc = initCookieConsent();

    var logo = '<img src="../img/logo-dark.png?' + Date.now() + '" alt="Logo" loading="lazy" style="margin-left: -4px; margin-bottom: -5px; height: 35px">';
    var cookie = '🍪';

    cc.run({
        current_lang: lang,
        autoclear_cookies: true,
        cookie_name: 'cc_cookie',
        cookie_expiration: 365,
        page_scripts: true,
        gui_options: {
            consent_modal: {
                layout: 'box',
                position: 'bottom left',
                transition: 'slide'
            },
            settings_modal: {
                layout: 'box',
                transition: 'slide'
            }
        },

        onFirstAction: function () {
            console.log('onFirstAction fired');
        },

        onAccept: function (cookie) {
            console.log('onAccept fired ...');
        },

        onChange: function (cookie, changed_preferences) {
            console.log('onChange fired ...');
        },
        languages: {
            'en-GB': {
                consent_modal: {
                    title: cookie + ' We use cookies! ',
                    description:
                        'Hi, this website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent. <button type="button" data-cc="c-settings" class="cc-link">Let me choose</button>',
                    primary_btn: {
                        text: 'Accept all',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Reject all',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Save settings',
                    accept_all_btn: 'Accept all',
                    reject_all_btn: 'Reject all',
                    close_btn_label: 'Close',
                    cookie_table_headers: [
                        {col1: 'Name'},
                        {col2: 'Domain'},
                        {col3: 'Expiration'},
                        {col4: 'Description'},
                    ],
                    blocks: [
                        {
                            title: 'Cookie usage \uD83D\uDCE2',
                            description:
                                'I use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">privacy policy</a>.',
                        },
                        {
                            title: 'Strictly necessary cookies',
                            description:
                                'These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Performance and Analytics cookies',
                            description:
                                'These cookies allow the website to remember the choices you have made in the past',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Advertisement and Targeting cookies',
                            description:
                                'These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'More information',
                            description:
                                'For any queries in relation to my policy on cookies and your choices, please contact me.',
                        },
                    ],
                },
            },
            'es-ES': {
                consent_modal: {
                    title: '\uD83C\uDF6A \xA1Utilizamos cookies! ',
                    description:
                        'Hola, este sitio web utiliza cookies esenciales para garantizar su correcto funcionamiento y cookies de seguimiento para comprender cómo interactúa con él. Estas últimas solo se instalarán previo consentimiento. <button type="button" data-cc="c-settings" class="cc-link">Déjame elegir</button>',
                    primary_btn: {
                        text: 'Aceptar todo',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Rechazar todo',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Guardar ajustes',
                    accept_all_btn: 'Aceptar todo',
                    reject_all_btn: 'Rechazar todo',
                    close_btn_label: 'Cerrar',
                    cookie_table_headers: [
                        {col1: 'Nombre'},
                        {col2: 'Dominio'},
                        {col3: 'Caducidad'},
                        {col4: 'Descripción'},
                    ],
                    blocks: [
                        {
                            title: 'Uso de cookies \uD83D\uDCE2',
                            description:
                                'Utilizo cookies para garantizar las funcionalidades básicas del sitio web y para mejorar su experiencia en línea. En cada categoría puede elegir si desea aceptarlas o rechazarlas cuando lo desee. Para más información sobre las cookies y otros datos sensibles, lea la <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">política de privacidad</a> completa.',
                        },
                        {
                            title: 'Cookies estrictamente necesarias',
                            description:
                                'Estas cookies son esenciales para el correcto funcionamiento de mi sitio web. Sin estas cookies, el sitio web no funcionaría correctamente',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Cookies de rendimiento y análisis',
                            description:
                                'Estas cookies permiten que el sitio web recuerde las elecciones que ha hecho en el pasado',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Cookies publicitarias y de segmentación',
                            description:
                                'Estas cookies recogen información sobre cómo utiliza el sitio web, qué páginas ha visitado y en qué enlaces ha hecho clic. Todos los datos son anónimos y no pueden utilizarse para identificarle.',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Más información',
                            description:
                                'Para cualquier consulta en relación con mi política sobre cookies y sus opciones, póngase en contacto conmigo.',
                        },
                    ],
                },
            },
            'de-DE': {
                consent_modal: {
                    title: '\uD83C\uDF6A Wir verwenden Cookies! ',
                    description:
                        'Hallo, diese Website verwendet essentielle Cookies, um ihren ordnungsgemäßen Betrieb zu gewährleisten, und Tracking-Cookies, um zu verstehen, wie Sie mit ihr interagieren. Letztere werden nur nach Zustimmung gesetzt werden. <button type="button" data-cc="c-settings" class="cc-link">Lass mich wählen</button>',
                    primary_btn: {
                        text: 'Alle akzeptieren',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Alle ablehnen',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Einstellungen speichern',
                    accept_all_btn: 'Alle akzeptieren',
                    reject_all_btn: 'Alle ablehnen',
                    close_btn_label: 'Schließen Sie',
                    cookie_table_headers: [
                        {col1: 'Name'},
                        {col2: 'Bereich'},
                        {col3: 'Verfallsdatum'},
                        {col4: 'Beschreibung'},
                    ],
                    blocks: [
                        {
                            title: 'Verwendung von Cookies \uD83D\uDCE2',
                            description:
                                'Ich verwende Cookies, um die grundlegenden Funktionen der Website zu gewährleisten und um Ihr Online-Erlebnis zu verbessern. Sie können für jede Kategorie wählen, ob Sie sich ein- oder austragen möchten. Für weitere Einzelheiten zu Cookies und anderen sensiblen Daten lesen Sie bitte die vollständige <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">Datenschutzerklärung</a>.',
                        },
                        {
                            title: 'Streng notwendige Cookies',
                            description:
                                'Diese Cookies sind für das ordnungsgemäße Funktionieren meiner Website unerlässlich. Ohne diese Cookies würde die Website nicht richtig funktionieren',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Leistungs- und Analyse-Cookies',
                            description:
                                'Diese Cookies ermöglichen es der Website, sich an die von Ihnen in der Vergangenheit getroffenen Auswahlen zu erinnern',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Cookies für Werbung und Zielgruppenansprache',
                            description:
                                'Diese Cookies sammeln Informationen darüber, wie Sie die Website nutzen, welche Seiten Sie besucht und welche Links Sie angeklickt haben. Alle Daten sind anonymisiert und können nicht verwendet werden, um Sie zu identifizieren',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Weitere Informationen',
                            description:
                                'Bei Fragen zu meiner Politik in Bezug auf Cookies und Ihre Wahlmöglichkeiten kontaktieren Sie mich bitte.',
                        },
                    ],
                },
            },
            'fr-FR': {
                consent_modal: {
                    title: '\uD83C\uDF6A Nous utilisons des cookies ! ',
                    description:
                        'Bonjour, ce site web utilise des cookies essentiels pour assurer son bon fonctionnement et des cookies de suivi pour comprendre comment vous interagissez avec lui. Ces derniers ne seront installés qu\'après consentement. <button type="button" data-cc="c-settings" class="cc-link">Laissez-moi choisir</button>',
                    primary_btn: {
                        text: 'Accepter tous',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Rejeter tous les',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Sauvegarder les paramètres',
                    accept_all_btn: 'Accepter tous',
                    reject_all_btn: 'Rejeter tous les',
                    close_btn_label: 'Fermer',
                    cookie_table_headers: [
                        {col1: 'Nom'},
                        {col2: 'Domaine'},
                        {col3: 'Expiration'},
                        {col4: 'Description'},
                    ],
                    blocks: [
                        {
                            title: 'Utilisation des cookies \uD83D\uDCE2',
                            description:
                                "J'utilise des cookies pour assurer les fonctionnalités de base du site web et pour améliorer votre expérience en ligne. Pour chaque catégorie, vous pouvez choisir d'accepter ou de refuser les cookies quand vous le souhaitez. Pour plus de détails concernant les cookies et autres données sensibles, veuillez lire <a href=\"./privacy-policy.php" +
                                window.location.search +
                                '" class="cc-link">la politique de confidentialité</a> dans son intégralité.',
                        },
                        {
                            title: 'Cookies strictement nécessaires',
                            description:
                                'Ces cookies sont essentiels au bon fonctionnement de mon site web. Sans ces cookies, le site ne fonctionnerait pas correctement',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: "Cookies de performance et d'analyse",
                            description:
                                'Ces cookies permettent au site web de se souvenir des choix que vous avez faits dans le passé',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Cookies publicitaires et de ciblage',
                            description:
                                'Ces cookies recueillent des informations sur la manière dont vous utilisez le site web, les pages que vous avez visitées et les liens sur lesquels vous avez cliqué. Toutes les données sont anonymes et ne peuvent être utilisées pour vous identifier',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: "Plus d'informations",
                            description:
                                'Pour toute question relative à ma politique en matière de cookies et à vos choix, veuillez me contacter.',
                        },
                    ],
                },
            },
            'it-IT': {
                consent_modal: {
                    title: '\uD83C\uDF6A Utilizziamo i cookie! ',
                    description:
                        'Salve, questo sito web utilizza cookie essenziali per garantirne il corretto funzionamento e cookie di monitoraggio per capire come interagite con esso. Questi ultimi saranno impostati solo dopo il consenso. <button type="button" data-cc="c-settings" class="cc-link">Lasciatemi scegliere</button>',
                    primary_btn: {
                        text: 'Accettare tutti',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Rifiutare tutti',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Salva le impostazioni',
                    accept_all_btn: 'Accettare tutti',
                    reject_all_btn: 'Rifiutare tutti',
                    close_btn_label: 'Chiudere',
                    cookie_table_headers: [
                        {col1: 'Nome'},
                        {col2: 'Dominio'},
                        {col3: 'Scadenza'},
                        {col4: 'Descrizione'},
                    ],
                    blocks: [
                        {
                            title: 'Utilizzo dei cookie \uD83D\uDCE2',
                            description:
                                "Utilizzo i cookie per garantire le funzionalità di base del sito e per migliorare la vostra esperienza online. Per ogni categoria è possibile scegliere l'opt-in/out ogni volta che lo si desidera. Per ulteriori dettagli relativi ai cookie e ad altri dati sensibili, si prega di leggere l'informativa sulla <a href=\"./privacy-policy.php" +
                                window.location.search +
                                '" class="cc-link">privacy completa</a>.',
                        },
                        {
                            title: 'Cookie strettamente necessari',
                            description:
                                'Questi cookie sono essenziali per il corretto funzionamento del mio sito web. Senza questi cookie, il sito web non funzionerebbe correttamente.',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Cookie di prestazione e di analisi',
                            description:
                                "Questi cookie consentono al sito web di ricordare le scelte effettuate dall'utente in passato",
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Cookie pubblicitari e di targeting',
                            description:
                                "Questi cookie raccolgono informazioni sull'utilizzo del sito web, sulle pagine visitate e sui link cliccati. Tutti i dati sono anonimizzati e non possono essere utilizzati per identificare l'utente.",
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Ulteriori informazioni',
                            description:
                                'Per qualsiasi domanda relativa alla mia politica sui cookie e alle vostre scelte, contattatemi.',
                        },
                    ],
                },
            },
            'pl-PL': {
                consent_modal: {
                    title: '\uD83C\uDF6A Używamy plików cookie! ',
                    description:
                        'Cześć, ta strona używa niezbędnych plików cookie, aby zapewnić jej prawidłowe działanie, oraz śledzących plików cookie, aby zrozumieć, w jaki sposób użytkownik wchodzi z nią w interakcję. Te ostatnie będą ustawiane tylko po wyrażeniu zgody. <button type="button" data-cc="c-settings" class="cc-link">Pozwól mi wybrać</button>',
                    primary_btn: {
                        text: 'Zaakceptuj wszystko',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Odrzuć wszystko',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Zapisz ustawienia',
                    accept_all_btn: 'Zaakceptuj wszystko',
                    reject_all_btn: 'Odrzuć wszystko',
                    close_btn_label: 'Zamknij',
                    cookie_table_headers: [
                        {col1: 'Nazwa'},
                        {col2: 'Domena'},
                        {col3: 'Wygaśnięcie'},
                        {col4: 'Opis'},
                    ],
                    blocks: [
                        {
                            title: 'Wykorzystanie plików cookie \uD83D\uDCE2',
                            description:
                                'Używam plików cookie, aby zapewnić podstawowe funkcje witryny i poprawić komfort korzystania z niej. Dla każdej kategorii można wybrać opcję opt-in/out w dowolnym momencie. Aby uzyskać więcej informacji na temat plików cookie i innych wrażliwych danych, zapoznaj się z pełną <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">polityką prywatności</a>.',
                        },
                        {
                            title: 'Niezbędne pliki cookie',
                            description:
                                'Te pliki cookie są niezbędne do prawidłowego funkcjonowania mojej strony internetowej. Bez tych plików cookie witryna nie działałaby prawidłowo',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Wydajnościowe i analityczne pliki cookie',
                            description:
                                'Te pliki cookie umożliwiają witrynie zapamiętanie wyborów dokonanych przez użytkownika w przeszłości',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Reklamowe i ukierunkowane pliki cookie',
                            description:
                                'Te pliki cookie gromadzą informacje o sposobie korzystania z witryny, odwiedzanych stronach i klikniętych linkach. Wszystkie dane są anonimowe i nie mogą być wykorzystane do identyfikacji użytkownika',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Więcej informacji',
                            description:
                                'W przypadku jakichkolwiek pytań dotyczących mojej polityki dotyczącej plików cookie i wyborów użytkownika, proszę o kontakt.',
                        },
                    ],
                },
            },
            'cs-CZ': {
                consent_modal: {
                    title: '\uD83C\uDF6A Používáme soubory cookie! ',
                    description:
                        'Dobrý den, tyto webové stránky používají základní soubory cookie k zajištění svého správného fungování a sledovací soubory cookie k pochopení toho, jak s nimi pracujete. Ty se nastavují pouze po souhlasu. <button type="button" data-cc="c-settings" class="cc-link">Dovolte mi vybrat</button>',
                    primary_btn: {
                        text: 'Přijmout všechny',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Odmítnout všechny',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Uložit nastavení',
                    accept_all_btn: 'Přijmout všechny',
                    reject_all_btn: 'Odmítnout všechny',
                    close_btn_label: 'Zavřít',
                    cookie_table_headers: [
                        {col1: 'Název'},
                        {col2: 'Doména'},
                        {col3: 'Expirace'},
                        {col4: 'Popis'},
                    ],
                    blocks: [
                        {
                            title: 'Používání souborů cookie \uD83D\uDCE2',
                            description:
                                'Soubory cookie používám k zajištění základních funkcí webových stránek a ke zlepšení vašeho online zážitku. U každé kategorie si můžete zvolit, zda se chcete přihlásit nebo odhlásit, kdykoli budete chtít. Další podrobnosti týkající se souborů cookie a dalších citlivých údajů naleznete v úplném znění <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">zásad ochrany osobních údajů</a>.',
                        },
                        {
                            title: 'Nezbytně nutné soubory cookie',
                            description:
                                'Tyto soubory cookie jsou nezbytné pro správné fungování mých webových stránek. Bez těchto souborů cookie by webové stránky nefungovaly správně.',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Výkonnostní a analytické soubory cookie',
                            description:
                                'Tyto soubory cookie umožňují webové stránce zapamatovat si volby, které jste provedli v minulosti.',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Soubory cookie pro reklamu a cílení',
                            description:
                                'Tyto soubory cookie shromažďují informace o tom, jak webové stránky používáte, které stránky jste navštívili a na které odkazy jste klikli. Všechny údaje jsou anonymizované a nelze je použít k vaší identifikaci.',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Více informací',
                            description:
                                'V případě jakýchkoli dotazů týkajících se mých zásad ohledně souborů cookie a vašich voleb mě prosím kontaktujte.',
                        },
                    ],
                },
            },
            'ro-RO': {
                consent_modal: {
                    title: '\uD83C\uDF6A Noi folosim cookie-uri! ',
                    description:
                        'Bună ziua, acest site web utilizează cookie-uri esențiale pentru a asigura buna funcționare a acestuia și cookie-uri de urmărire pentru a înțelege modul în care interacționați cu acesta. Acestea din urmă vor fi setate numai după obținerea consimțământului. <button type="button" data-cc="c-settings" class="cc-link">Lasă-mă să aleg</button>',
                    primary_btn: {
                        text: 'Acceptă toate',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Respingeți toate',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Salvați setările',
                    accept_all_btn: 'Acceptă toate',
                    reject_all_btn: 'Respingeți toate',
                    close_btn_label: 'Închideți',
                    cookie_table_headers: [
                        {col1: 'Nume'},
                        {col2: 'Domeniu'},
                        {col3: 'Expirare'},
                        {col4: 'Descriere'},
                    ],
                    blocks: [
                        {
                            title: 'Utilizarea cookie-urilor \uD83D\uDCE2',
                            description:
                                'Folosesc cookie-uri pentru a asigura funcționalitățile de bază ale site-ului web și pentru a vă îmbunătăți experiența online. Puteți alege pentru fiecare categorie să optați pentru opt-in/out oricând doriți. Pentru mai multe detalii referitoare la cookie-uri și alte date sensibile, vă rugăm să citiți <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">politica de confidențialitate completă</a>.',
                        },
                        {
                            title: 'Cookie-uri strict necesare',
                            description:
                                'Aceste module cookie sunt esențiale pentru buna funcționare a site-ului meu web. Fără aceste module cookie, site-ul web nu ar funcționa corect.',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Cookie-uri de performanță și de analiză',
                            description:
                                'Aceste cookie-uri permit site-ului web să rețină alegerile pe care le-ați făcut în trecut.',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Cookie-uri pentru publicitate și direcționare',
                            description:
                                'Aceste module cookie colectează informații despre modul în care utilizați site-ul web, ce pagini ați vizitat și pe ce linkuri ați făcut clic. Toate aceste date sunt anonime și nu pot fi folosite pentru a vă identifica.',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Mai multe informații',
                            description:
                                'Pentru orice întrebări legate de politica mea privind cookie-urile și opțiunile dumneavoastră, vă rog să mă contactați.',
                        },
                    ],
                },
            },
            'pt-PT': {
                consent_modal: {
                    title: '\uD83C\uDF6A Utilizamos cookies! ',
                    description:
                        'Olá, este sítio Web utiliza cookies essenciais para garantir o seu bom funcionamento e cookies de rastreio para compreender a forma como interage com o mesmo. Estes últimos só serão definidos após consentimento. <button type="button" data-cc="c-settings" class="cc-link">Deixem-me escolher</button>',
                    primary_btn: {
                        text: 'Aceitar tudo',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Rejeitar tudo',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Guardar definições',
                    accept_all_btn: 'Aceitar tudo',
                    reject_all_btn: 'Rejeitar tudo',
                    close_btn_label: 'Fechar',
                    cookie_table_headers: [
                        {col1: 'Nome'},
                        {col2: 'Domínio'},
                        {col3: 'Prazo de validade'},
                        {col4: 'Descrição'},
                    ],
                    blocks: [
                        {
                            title: 'Utilização de cookies \uD83D\uDCE2',
                            description:
                                'Utilizo cookies para garantir as funcionalidades básicas do sítio Web e para melhorar a sua experiência online. Para cada categoria, o utilizador pode optar por aceitar ou recusar os cookies quando quiser. Para mais pormenores relativos a cookies e outros dados sensíveis, leia a <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">política de privacidade na íntegra</a>.',
                        },
                        {
                            title: 'Cookies estritamente necessários',
                            description:
                                'Estes cookies são essenciais para o bom funcionamento do meu sítio Web. Sem estes cookies, o sítio Web não funcionaria corretamente',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Cookies de desempenho e analíticos',
                            description:
                                'Estes cookies permitem que o sítio Web se lembre das escolhas que fez no passado',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Cookies de publicidade e segmentação',
                            description:
                                'Estes cookies recolhem informações sobre a forma como o utilizador utiliza o sítio Web, as páginas que visitou e as ligações em que clicou. Todos os dados são anónimos e não podem ser utilizados para identificar o utilizador',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Mais informações',
                            description:
                                'Para quaisquer questões relacionadas com a minha política em matéria de cookies e as suas escolhas, contacte-me.',
                        },
                    ],
                },
            },
            'bg-BG': {
                consent_modal: {
                    title: '\uD83C\uDF6A Използваме бисквитки! ',
                    description:
                        'Здравейте, този уебсайт използва основни "бисквитки", за да осигури правилното си функциониране, и "бисквитки" за проследяване, за да разбере как взаимодействате с него. Последните ще бъдат зададени само след съгласие. <button type="button" data-cc="c-settings" class="cc-link">Позволете ми да избера</button>',
                    primary_btn: {
                        text: 'Приемете всички',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Отхвърляне на всички',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Запазване на настройките',
                    accept_all_btn: 'Приемете всички',
                    reject_all_btn: 'Отхвърляне на всички',
                    close_btn_label: 'Затвори',
                    cookie_table_headers: [
                        {col1: 'Име'},
                        {col2: 'Домейн'},
                        {col3: 'Срок на валидност'},
                        {col4: 'Описание'},
                    ],
                    blocks: [
                        {
                            title: 'Използване на бисквитки \uD83D\uDCE2',
                            description:
                                'Използвам "бисквитки", за да осигуря основните функционалности на уебсайта и да подобря вашето онлайн преживяване. Можете да изберете за всяка категория да се включите/изключите, когато пожелаете. За повече подробности относно бисквитките и други чувствителни данни, моля, прочетете пълната <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">политика за поверителност</a>.',
                        },
                        {
                            title: 'Строго необходими бисквитки',
                            description:
                                'Тези бисквитки са от съществено значение за правилното функциониране на моя уебсайт. Без тези "бисквитки" уебсайтът няма да работи правилно.',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Бисквитки за ефективност и анализ',
                            description:
                                'Тези бисквитки позволяват на уебсайта да запомни изборите, които сте направили в миналото.',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Бисквитки за рекламиране и насочване',
                            description:
                                'Тези "бисквитки" събират информация за това как използвате уебсайта, кои страници сте посетили и върху кои връзки сте кликнали. Всички данни са анонимизирани и не могат да бъдат използвани за идентифицирането ви',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Повече информация',
                            description:
                                'За всякакви въпроси, свързани с моята политика за бисквитките и вашия избор, моля, свържете се с мен.',
                        },
                    ],
                },
            },
            'nl-NL': {
                consent_modal: {
                    title: '\uD83C\uDF6A We gebruiken cookies! ',
                    description:
                        'Hallo, deze website gebruikt essentiële cookies om de goede werking ervan te garanderen en tracking cookies om te begrijpen hoe u met de website omgaat. Deze laatste worden alleen geplaatst na toestemming. <button type="button" data-cc="c-settings" class="cc-link">Laat me kiezen</button>',
                    primary_btn: {
                        text: 'Alles accepteren',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Alles afwijzen',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Instellingen opslaan',
                    accept_all_btn: 'Alles accepteren',
                    reject_all_btn: 'Alles afwijzen',
                    close_btn_label: 'Sluit',
                    cookie_table_headers: [
                        {col1: 'Naam'},
                        {col2: 'Domein'},
                        {col3: 'Vervaldatum'},
                        {col4: 'Beschrijving'},
                    ],
                    blocks: [
                        {
                            title: 'Gebruik cookies \uD83D\uDCE2',
                            description:
                                'Ik gebruik cookies om de basisfuncties van de website te garanderen en je online ervaring te verbeteren. Je kunt per categorie kiezen voor opt-in/ opt-out wanneer je maar wilt. Lees voor meer informatie over cookies en andere gevoelige gegevens het volledige <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">privacybeleid</a>.',
                        },
                        {
                            title: 'Strikt noodzakelijke cookies',
                            description:
                                'Deze cookies zijn essentieel voor het goed functioneren van mijn website. Zonder deze cookies zou de website niet goed werken',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Prestatie- en analysecookies',
                            description:
                                'Met deze cookies kan de website de keuzes onthouden die u in het verleden hebt gemaakt',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Advertentie en targeting cookies',
                            description:
                                "Deze cookies verzamelen informatie over hoe je de website gebruikt, welke pagina's je hebt bezocht en op welke links je hebt geklikt. Alle gegevens worden geanonimiseerd en kunnen niet worden gebruikt om u te identificeren.",
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Meer informatie',
                            description:
                                'Als je vragen hebt over mijn cookiebeleid en jouw keuzes, kun je contact met me opnemen.',
                        },
                    ],
                },
            },
            'lt-LT': {
                consent_modal: {
                    title: '\uD83C\uDF6A Mes naudojame slapukus! ',
                    description:
                        'Sveiki, ši svetainė naudoja svarbiausius slapukus, kad užtikrintų tinkamą veikimą, ir stebėjimo slapukus, kad suprastų, kaip su ja sąveikaujate. Pastarieji bus nustatyti tik gavus sutikimą. <button type="button" data-cc="c-settings" class="cc-link">Leiskite man pasirinkti</button>',
                    primary_btn: {
                        text: 'Priimti visus',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Atmesti visus',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Išsaugoti nustatymus',
                    accept_all_btn: 'Priimti visus',
                    reject_all_btn: 'Atmesti visus',
                    close_btn_label: 'Uždaryti',
                    cookie_table_headers: [
                        {col1: 'Pavadinimas'},
                        {col2: 'Domenas'},
                        {col3: 'Galiojimo pabaiga'},
                        {col4: 'Aprašymas'},
                    ],
                    blocks: [
                        {
                            title: 'Slapukų naudojimas \uD83D\uDCE2',
                            description:
                                'Naudoju slapukus, kad užtikrintų pagrindines svetainės funkcijas ir pagerintų jūsų patirtį internete. Kiekvienos kategorijos atveju galite pasirinkti įjungti / išjungti slapukus, kai tik norite. Daugiau informacijos apie slapukus ir kitus neskelbtinus duomenis rasite visoje <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">privatumo politikoje</a>.',
                        },
                        {
                            title: 'Griežtai būtini slapukai',
                            description:
                                'Šie slapukai yra būtini tinkamam mano svetainės veikimui. Be šių slapukų svetainė negalėtų tinkamai veikti',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Veiklos ir analizės slapukai',
                            description:
                                'Šie slapukai leidžia svetainei įsiminti jūsų praeityje padarytus pasirinkimus',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Reklamos ir tiksliniai slapukai',
                            description:
                                'Šie slapukai renka informaciją apie tai, kaip naudojatės svetaine, kokiuose puslapiuose lankėtės ir kokias nuorodas paspaudėte. Visi duomenys yra anoniminiai ir negali būti naudojami jūsų tapatybei nustatyti.',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Daugiau informacijos',
                            description:
                                'Jei turite klausimų, susijusių su mano slapukų politika ir jūsų pasirinkimais, susisiekite su manimi.',
                        },
                    ],
                },
            },
            'sv-SE': {
                consent_modal: {
                    title: '\uD83C\uDF6A Vi använder cookies! ',
                    description:
                        'Hej, den här webbplatsen använder nödvändiga cookies för att säkerställa att den fungerar korrekt och spårningscookies för att förstå hur du interagerar med den. De senare kommer endast att ställas in efter samtycke. <button type="button" data-cc="c-settings" class="cc-link">Låt mig välja</button>',
                    primary_btn: {
                        text: 'Acceptera alla',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Avvisa alla',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Spara inställningar',
                    accept_all_btn: 'Acceptera alla',
                    reject_all_btn: 'Avvisa alla',
                    close_btn_label: 'Nära',
                    cookie_table_headers: [
                        {col1: 'Namn'},
                        {col2: 'Domän'},
                        {col3: 'Utgångsdatum'},
                        {col4: 'Beskrivning'},
                    ],
                    blocks: [
                        {
                            title: 'Användning av cookies \uD83D\uDCE2',
                            description:
                                'Jag använder cookies för att säkerställa de grundläggande funktionerna på webbplatsen och för att förbättra din onlineupplevelse. Du kan välja för varje kategori att opt-in/out när du vill. För mer information om cookies och andra känsliga uppgifter, läs den fullständiga <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">integritetspolicyn</a>.',
                        },
                        {
                            title: 'Strängt nödvändiga cookies',
                            description:
                                'Dessa cookies är nödvändiga för att min webbplats ska fungera korrekt. Utan dessa cookies skulle webbplatsen inte fungera korrekt',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Cookies för prestanda och analys',
                            description:
                                'Dessa cookies gör det möjligt för webbplatsen att komma ihåg de val du har gjort tidigare',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Cookies för annonsering och målgruppsanpassning',
                            description:
                                'Dessa cookies samlar in information om hur du använder webbplatsen, vilka sidor du besöker och vilka länkar du klickar på. All data är anonymiserad och kan inte användas för att identifiera dig',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Mer information',
                            description:
                                'Om du har några frågor om min policy för cookies och dina val, vänligen kontakta mig.',
                        },
                    ],
                },
            },
            'hi-IN': {
                consent_modal: {
                    title: '\uD83C\uDF6A हम कुकीज़ का उपयोग करते हैं! ',
                    description:
                        'नमस्ते, यह वेबसाइट अपने उचित संचालन को सुनिश्चित करने के लिए आवश्यक कुकीज़ का उपयोग करती है और आप इसके साथ कैसे इंटरैक्ट करते हैं यह समझने के लिए कुकीज़ को ट्रैक करती है\u0964 बाद में सहमति के बाद ही सेट किया जाएगा\u0964 <button type="button" data-cc="c-settings" class="cc-link">मुझे चुनने दें</button>',
                    primary_btn: {
                        text: 'सभी स्वीकृत',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'सभी को अस्वीकार करें',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'सेटिंग्स सेव करें',
                    accept_all_btn: 'सभी स्वीकृत',
                    reject_all_btn: 'सभी को अस्वीकार करें',
                    close_btn_label: 'बंद करना',
                    cookie_table_headers: [
                        {col1: 'नाम'},
                        {col2: 'कार्यक्षेत्र'},
                        {col3: 'समय सीमा समाप्ति'},
                        {col4: 'विवरण'},
                    ],
                    blocks: [
                        {
                            title: 'कुकी उपयोग \uD83D\uDCE2',
                            description:
                                'मैं वेबसाइट की बुनियादी कार्यक्षमता सुनिश्चित करने और आपके ऑनलाइन अनुभव को बढ़ाने के लिए कुकीज़ का उपयोग करता हूं\u0964 आप जब चाहें प्रत्येक श्रेणी के लिए ऑप्ट-इन/आउट करना चुन सकते हैं\u0964 कुकीज़ और अन्य संवेदनशील डेटा से संबंधित अधिक जानकारी के लिए, कृपया पूरी <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">गोपनीयता नीति</a> पढ़ें.',
                        },
                        {
                            title: 'अत्यंत आवश्यक कुकीज़',
                            description:
                                'ये कुकीज़ मेरी वेबसाइट के उचित कामकाज के लिए आवश्यक हैं\u0964 इन कुकीज़ के बिना, वेबसाइट ठीक से काम नहीं करेगी',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'प्रदर्शन और विश्लेषण कुकीज़',
                            description:
                                'ये कुकीज़ वेबसाइट को आपके द्वारा अतीत में चुने गए विकल्पों को याद रखने की अनुमति देती हैं',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'विज्ञापन और लक्ष्यीकरण कुकीज़',
                            description:
                                'ये कुकीज़ इस बारे में जानकारी एकत्र करती हैं कि आप वेबसाइट का उपयोग कैसे करते हैं, आपने कौन से पेज देखे और किन लिंक पर क्लिक किया\u0964 सारा डेटा अज्ञात है और इसका उपयोग आपकी पहचान के लिए नहीं किया जा सकता',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'अधिक जानकारी',
                            description:
                                'कुकीज़ पर मेरी नीति और आपकी पसंद के संबंध में किसी भी प्रश्न के लिए, कृपया मुझसे संपर्क करें\u0964',
                        },
                    ],
                },
            },
            'nb-NO': {
                consent_modal: {
                    title: '\uD83C\uDF6A Vi bruker informasjonskapsler! ',
                    description:
                        'Hei, dette nettstedet bruker viktige informasjonskapsler for å sikre at det fungerer som det skal, og sporingsinformasjonskapsler for å forstå hvordan du samhandler med det. Sistnevnte settes kun etter samtykke. <button type="button" data-cc="c-settings" class="cc-link">La meg velge</button>',
                    primary_btn: {
                        text: 'Godta alle',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Avvis alle',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Lagre innstillinger',
                    accept_all_btn: 'Godta alle',
                    reject_all_btn: 'Avvis alle',
                    close_btn_label: 'Lukk',
                    cookie_table_headers: [
                        {col1: 'Navn'},
                        {col2: 'Domene'},
                        {col3: 'Utløp'},
                        {col4: 'Beskrivelse'},
                    ],
                    blocks: [
                        {
                            title: 'Bruk av informasjonskapsler \uD83D\uDCE2',
                            description:
                                'Jeg bruker informasjonskapsler for å sikre nettstedets grunnleggende funksjoner og for å forbedre nettopplevelsen din. Du kan velge å melde deg av eller på for hver kategori når du vil. For mer informasjon om informasjonskapsler og andre sensitive data, vennligst les hele <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">personvernerklæringen</a>.',
                        },
                        {
                            title: 'Strengt nødvendige informasjonskapsler',
                            description:
                                'Disse informasjonskapslene er avgjørende for at nettstedet mitt skal fungere som det skal. Uten disse informasjonskapslene ville ikke nettstedet fungere som det skal.',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Informasjonskapsler for ytelse og analyse',
                            description:
                                'Disse informasjonskapslene gjør det mulig for nettstedet å huske valgene du har gjort tidligere.',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Informasjonskapsler for annonsering og målretting',
                            description:
                                'Disse informasjonskapslene samler inn informasjon om hvordan du bruker nettstedet, hvilke sider du besøker og hvilke lenker du klikker på. All informasjon er anonymisert og kan ikke brukes til å identifisere deg.',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Mer informasjon',
                            description:
                                'Hvis du har spørsmål om mine retningslinjer for informasjonskapsler og dine valg, kan du kontakte meg.',
                        },
                    ],
                },
            },
            'sr-RS': {
                consent_modal: {
                    title: '\uD83C\uDF6A Користимо колачиће! ',
                    description:
                        'Здраво, ова веб локација користи основне колачиће да би обезбедила правилан рад и колачиће за праћење да би разумела како са њим комуницирате. Ово последње ће бити постављено тек након сагласности. <button type="button" data-cc="c-settings" class="cc-link">Пусти ме да бирам</button>',
                    primary_btn: {
                        text: 'Прихвати све',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Одбаци све',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Сачувај подешавања',
                    accept_all_btn: 'Прихвати све',
                    reject_all_btn: 'Одбаци све',
                    close_btn_label: 'Близу',
                    cookie_table_headers: [
                        {col1: 'Име'},
                        {col2: 'Домаин'},
                        {col3: 'Истицање'},
                        {col4: 'Опис'},
                    ],
                    blocks: [
                        {
                            title: 'Употреба колачића \uD83D\uDCE2',
                            description:
                                'Користим колачиће да бих обезбедио основне функционалности веб странице и побољшао ваше искуство на мрежи. За сваку категорију можете изабрати да се укључите/одјавите кад год желите. За више детаља у вези с колачићима и другим осетљивим подацима, прочитајте комплетну <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">политику приватности</a>.',
                        },
                        {
                            title: 'Строго неопходни колачићи',
                            description:
                                'Ови колачићи су неопходни за правилно функционисање моје веб странице. Без ових колачића, веб локација не би радила исправно',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Колачићи перформанси и аналитике',
                            description:
                                'Ови колачићи омогућавају веб локацији да запамти изборе које сте направили у прошлости',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Колачићи за оглашавање и циљање',
                            description:
                                'Ови колачићи прикупљају информације о томе како користите веб локацију, које странице сте посетили и на које сте везе кликнули. Сви подаци су анонимни и не могу се користити за вашу идентификацију',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Више информација',
                            description:
                                'За сва питања у вези са мојом политиком о колачићима и вашим изборима, контактирајте ме.',
                        },
                    ],
                },
            },
            'hr-HR': {
                consent_modal: {
                    title: '\uD83C\uDF6A Koristimo kolačiće! ',
                    description:
                        'Bok, ova web stranica koristi bitne kolačiće kako bi osigurala pravilan rad i kolačiće za praćenje kako bi razumjela kako s njom komunicirate. Potonji će se postaviti tek nakon pristanka. <button type="button" data-cc="c-settings" class="cc-link">Pusti me da odaberem</button>',
                    primary_btn: {
                        text: 'Prihvatiti sve',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Odbaci sve',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Spremi postavke',
                    accept_all_btn: 'Prihvatiti sve',
                    reject_all_btn: 'Odbaci sve',
                    close_btn_label: 'Zatvoriti',
                    cookie_table_headers: [
                        {col1: 'Ime'},
                        {col2: 'Domena'},
                        {col3: 'Istek'},
                        {col4: 'Opis'},
                    ],
                    blocks: [
                        {
                            title: 'Korištenje kolačića \uD83D\uDCE2',
                            description:
                                'Koristim kolačiće kako bih osigurao osnovne funkcionalnosti web stranice i poboljšao vaše online iskustvo. Za svaku kategoriju možete odabrati da se uključite/isključite kad god želite. Za više pojedinosti o kolačićima i drugim osjetljivim podacima pročitajte potpuna <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">pravila o privatnosti</a>.',
                        },
                        {
                            title: 'Strogo neophodni kolačići',
                            description:
                                'Ovi su kolačići neophodni za ispravno funkcioniranje moje web stranice. Bez ovih kolačića web stranica ne bi ispravno radila',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Kolačići za izvedbu i analitiku',
                            description:
                                'Ovi kolačići omogućuju web stranici da zapamti odabire koje ste napravili u prošlosti',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Kolačići za oglašavanje i ciljanje',
                            description:
                                'Ovi kolačići prikupljaju informacije o tome kako koristite web stranicu, koje stranice ste posjetili i na koje ste poveznice kliknuli. Svi podaci su anonimizirani i ne mogu se koristiti za vašu identifikaciju',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Više informacija',
                            description:
                                'Za sve upite u vezi s mojim pravilima o kolačićima i vašim izborima, kontaktirajte me.',
                        },
                    ],
                },
            },
            'hu-HU': {
                consent_modal: {
                    title: '\uD83C\uDF6A Sütiket használunk! ',
                    description:
                        'Üdvözlöm, ez a weboldal alapvető sütiket használ a megfelelő működés biztosításához, valamint nyomkövető sütiket ahhoz, hogy megértsük, hogyan lép kapcsolatba vele. Ez utóbbiak csak beleegyezés után kerülnek beállításra. <button type="button" data-cc="c-settings" class="cc-link">Hadd válasszam ki</button>',
                    primary_btn: {
                        text: 'Fogadjon el mindent',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Utasítson el mindent',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Beállítások mentése',
                    accept_all_btn: 'Fogadjon el mindent',
                    reject_all_btn: 'Utasítson el mindent',
                    close_btn_label: 'Close',
                    cookie_table_headers: [
                        {col1: 'Név'},
                        {col2: 'Domain'},
                        {col3: 'Lejárat'},
                        {col4: 'Leírás'},
                    ],
                    blocks: [
                        {
                            title: 'Cookie használat \uD83D\uDCE2',
                            description:
                                'Sütiket használok a weboldal alapvető funkcióinak biztosítása és az Ön online élményének javítása érdekében. Minden egyes kategória esetében bármikor kiválaszthatja a ki/bejelentkezést. A sütikkel és egyéb érzékeny adatokkal kapcsolatos további részletekért kérjük, olvassa el a teljes <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">adatvédelmi szabályzatot</a>.',
                        },
                        {
                            title: 'Szigorúan szükséges sütik',
                            description:
                                'Ezek a sütik elengedhetetlenek a weboldalam megfelelő működéséhez. E sütik nélkül a weboldal nem működne megfelelően.',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Teljesítmény és analitikai sütik',
                            description:
                                'Ezek a sütik lehetővé teszik a weboldal számára, hogy emlékezzen az Ön által a múltban tett választásokra.',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Hirdetési és célzási sütik',
                            description:
                                'Ezek a sütik információkat gyűjtenek arról, hogy Ön hogyan használja a weboldalt, mely oldalakat látogatta meg, és mely linkekre kattintott. Minden adat anonimizálva van, és nem használható fel az Ön azonosítására.',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'További információ',
                            description:
                                'A sütikre vonatkozó politikámmal és az Ön választási lehetőségeivel kapcsolatos bármilyen kérdéssel kapcsolatban, kérjük, lépjen kapcsolatba velem.',
                        },
                    ],
                },
            },
            'sl-SI': {
                consent_modal: {
                    title: '\uD83C\uDF6A Uporabljamo piškotke! ',
                    description:
                        'Pozdravljeni, to spletno mesto uporablja bistvene piškotke za zagotavljanje pravilnega delovanja in sledilne piškotke za razumevanje vaše interakcije z njim. Slednji bodo nastavljeni le po privolitvi. <button type="button" data-cc="c-settings" class="cc-link">Naj izberem</button>',
                    primary_btn: {
                        text: 'Sprejmite vse',
                        role: 'accept_all',
                    },
                    secondary_btn: {
                        text: 'Zavrnite vse',
                        role: 'accept_necessary',
                    },
                },
                settings_modal: {
                    title: logo,
                    save_settings_btn: 'Save settings',
                    accept_all_btn: 'Sprejmite vse',
                    reject_all_btn: 'Zavrnite vse',
                    close_btn_label: 'Zapri',
                    cookie_table_headers: [
                        {col1: 'Ime'},
                        {col2: 'Domena'},
                        {col3: 'Iztek veljavnosti'},
                        {col4: 'Opis'},
                    ],
                    blocks: [
                        {
                            title: 'Uporaba piškotkov \uD83D\uDCE2',
                            description:
                                'Piškotke uporabljam za zagotavljanje osnovnih funkcij spletnega mesta in izboljšanje vaše spletne izkušnje. Za vsako kategorijo lahko izberete, ali se želite vključiti ali izključiti, kadar koli želite. Za več podrobnosti v zvezi s piškotki in drugimi občutljivimi podatki preberite celoten <a href="./privacy-policy.php' +
                                window.location.search +
                                '" class="cc-link">pravilnik o zasebnosti</a>.',
                        },
                        {
                            title: 'Nujno potrebni piškotki',
                            description:
                                'Ti piškotki so nujni za pravilno delovanje moje spletne strani. Brez teh piškotkov spletno mesto ne bi delovalo pravilno',
                            toggle: {
                                value: 'necessary',
                                enabled: true,
                                readonly: true,
                            },
                        },
                        {
                            title: 'Piškotki za učinkovitost in analitiko',
                            description:
                                'Ti piškotki spletni strani omogočajo, da si zapomni izbire, ki ste jih sprejeli v preteklosti',
                            toggle: {
                                value: 'analytics',
                                enabled: false,
                                readonly: false,
                            },
                            cookie_table: [
                                {
                                    col1: '^_ga',
                                    col2: 'google.com',
                                    col3: '2 years',
                                    col4: 'description ...',
                                    is_regex: true,
                                },
                                {
                                    col1: '_gid',
                                    col2: 'google.com',
                                    col3: '1 day',
                                    col4: 'description ...',
                                },
                            ],
                        },
                        {
                            title: 'Oglaševanje in ciljni piškotki',
                            description:
                                'Ti piškotki zbirajo informacije o tem, kako uporabljate spletno mesto, katere strani ste obiskali in katere povezave ste kliknili. Vsi podatki so anonimizirani in jih ni mogoče uporabiti za vašo identifikacijo',
                            toggle: {
                                value: 'targeting',
                                enabled: false,
                                readonly: false,
                            },
                        },
                        {
                            title: 'Več informacij',
                            description:
                                'Za vsa vprašanja v zvezi z mojim pravilnikom o piškotkih in vašimi izbirami se obrnite name',
                        },
                    ],
                },
            },
        },
    })
}
